---
title: Add Two Numbers
description: Three ways to add two numbers stored as linked lists, from a plain carry loop to a version that stops as soon as one list runs out.
date: 2024-01-17
---

**Original**: [LeetCode 2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)

**Difficulty**: Medium

**Topics**: Linked List, Math, Recursion

> You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

> You may assume the two numbers do not contain any leading zero, except the number 0 itself.

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

### Add them directly

**Approach**: this one is really about **linked list** handling. Add the digits, carry when you have to, and write the result into a new list. Not much to it.

**Complexity**: O(max(m, n))

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

### Recursive version

**Approach**: same idea, with the arithmetic pulled out into its own function and driven by recursion.

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        head = ListNode(0)  # create the head node
        self.count(l1, l2, 0, head)  # start the recursion
        return head.next

    def count(self, l1, l2, carry, current):
        # stop once `l1`, `l2`, and `carry` are all empty
        if not (l1 or l2 or carry):
            return
        # do the arithmetic
        value = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
        current.next = ListNode(value % 10)
        self.count(l1.next if l1 else None, l2.next if l2 else None, value // 10, current.next)
```

### Bail out early

**Approach**: both of the previous versions only leave the loop once `l1`, `l2`, and `carry` are all empty, which means re-checking all three on every iteration. But once a list hands you an empty node, every node after it is empty too. Leave the loop at the first empty node and most of those checks disappear.

The two pointer merge in ["Median of Two Sorted Arrays"](/notes/median-of-two-sorted-arrays) runs into the same thing, and handles it by slicing the remainder on in one go.

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        head = current = ListNode(0)  # create the new list
        carry = 0

        # add while both `l1` and `l2` still have nodes, and leave the loop as soon as one runs out
        while l1 and l2:
            carry, value = divmod(l1.val + l2.val + carry, 10)
            current.next = ListNode(value)
            l1 = l1.next
            l2 = l2.next
            current = current.next

        # `l1` still has nodes and `l2` does not, so read `l1` only
        while l1:
            carry, value = divmod(l1.val + carry, 10)
            current.next = ListNode(value)
            l1 = l1.next
            current = current.next

        # `l2` still has nodes and `l1` does not, so read `l2` only
        while l2:
            carry, value = divmod(l2.val + carry, 10)
            current.next = ListNode(value)
            l2 = l2.next
            current = current.next

        # check the carry
        if carry:
            current.next = ListNode(1)

        return head.next
```
