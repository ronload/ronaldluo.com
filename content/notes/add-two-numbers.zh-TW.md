---
title: Add Two Numbers｜兩數相加
description: LeetCode 2. Add Two Numbers 的解題筆記，比較直接相加、遞迴，以及提前跳出迴圈的三種鏈結串列寫法。
date: 2024-01-17
---

**原題**：[LeetCode 2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)

**難度**：Medium

**主題**：Linked List、Math、Recursion

> You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

> You may assume the two numbers do not contain any leading zero, except the number 0 itself.

> 給定兩個**非空**鏈結串列，代表兩個正整數，將兩正整數相加並以鏈結串列的形式回傳。

**Example 1.**

```text
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2.**

```text
Input: l1 = [0], l2 = [0]
Output: [0]
```

**Example 3.**

```text
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

**Constraints**:

- The number of nodes in each linked list is in the range [1, 100].
- 0 <= Node.val <= 9
- It is guaranteed that the list represents a number that does not have leading zeros.

## Solution

### 直接相加

**思路**：這題主要考的是**Linked List**的操作，理論上直接相加存到另一個串列就行，沒啥好說的

**複雜度**：O(max(m, n))

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        current = head = ListNode(0)
        carry = 0

        while l1 or l2 or carry:
            value = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
            carry, value = divmod(value, 10)
            current.next = ListNode(value)
            l1, l2, current = l1.next if l1 else None, l2.next if l2 else None, current.next

        return head.next
```

### 遞迴版

**思路：** 同理，可以將計算部分取出移 到另一個函式中利用遞迴呼叫解決。

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        head = ListNode(0)  # 創建頭節點
        self.count(l1, l2, 0, head)  # 執行遞迴呼叫
        return head.next

    def count(self, l1, l2, carry, current):
        # `l1`、`l2`、`carry`皆空時結束遞迴
        if not (l1 or l2 or carry):
            return
        # 執行計算
        value = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
        current.next = ListNode(value % 10)
        self.count(l1.next if l1 else None, l2.next if l2 else None, value // 10, current.next)
```

### 提前結束

**思路**：以上兩種解法必須在l1、l2、carry皆為空時才會結束迴圈，導致計算中必須重複判斷三者是否為空。但理論上在串列中只要讀取到了一個空節點，其後所有節點都會是空節點。所以我們可以利用此特性在讀取到空節點時跳出迴圈減少判斷次數。

[「Median of Two Sorted Arrays｜兩陣列中位數」](/notes/median-of-two-sorted-arrays)的 two pointer 合併也要處理同一件事，那題是直接用切片把剩下的一次接上。

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        head = current = ListNode(0)  # 創建新串列
        carry = 0

        # 當`l1`和`l2`都非空時，進行相加。如果有一者為空提前結束回圈
        while l1 and l2:
            carry, value = divmod(l1.val + l2.val + carry, 10)
            current.next = ListNode(value)
            l1 = l1.next
            l2 = l2.next
            current = current.next

        # 如果`l1`非空而`l2`為空，只讀取`l1`
        while l1:
            carry, value = divmod(l1.val + carry, 10)
            current.next = ListNode(value)
            l1 = l1.next
            current = current.next

        # 如果`l2`非空而`l1`為空，只讀取`l2`
        while l2:
            carry, value = divmod(l2.val + carry, 10)
            current.next = ListNode(value)
            l2 = l2.next
            current = current.next

        # 檢查carry
        if carry:
            current.next = ListNode(1)

        return head.next
```
