---
title: Reverse Integer｜數字反轉
description: LeetCode 7. Reverse Integer 的解題筆記，用字串反轉處理整數，並在不使用 64 位元整數的前提下檢查邊界。
date: 2024-01-20
---

**原題**：[LeetCode 7. Reverse Integer](https://leetcode.com/problems/reverse-integer/)

**難度**：Medium

**主題**：Math

> Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

> **Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**

> 給定一個整數，將其進行反轉後輸出。必須注意環境中不允許使用64位元整數。

**Example 1:**

```text
Input: x = 123
Output: 321
```

**Example 2:**

```text
Input: x = -123
Output: -321
```

**Example 3:**

```text
Input: x = 120
Output: 21
```

**Constraints:**

- -2^31 <= x <= 2^31 - 1

## Solution

### 反轉陣列

**思路**：將整數轉換成陣列儲存，再反轉並輸出。

同樣要在不用 64 位元整數的前提下處理 32 位元邊界的還有[「String to Integer (atoi)｜字串轉整數」](/notes/string-to-integer-atoi)，那題的要求是夾進範圍內而不是回 0。

**複雜度**：O(n)

```python
class Solution:
    def reverse(self, x):
        res = int(str(x)[::-1]) if x >= 0 else -1 * int(str(-x)[::-1])
        return res if res < 2**31 and res >= -2**31 else 0
```

**結果**：24ms, beats 99.42% of users with Python3.
