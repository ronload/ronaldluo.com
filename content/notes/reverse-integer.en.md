---
title: Reverse Integer
description: Reverse Integer with the 32 bit range check done without ever holding a 64 bit integer, which is the constraint the problem actually cares about.
date: 2024-01-20
---

**Original**: [LeetCode 7. Reverse Integer](https://leetcode.com/problems/reverse-integer/)

**Difficulty**: Medium

**Topics**: Math

> Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

> **Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**

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

### Reverse the digits

**Approach**: turn the integer into a string, reverse the string, and convert it back. The interesting half is the range check, because the problem forbids a 64 bit integer, so the comparison has to happen on the reversed value itself.

The same 32 bit boundary without a 64 bit integer comes up in ["String to Integer (atoi)"](/notes/string-to-integer-atoi), where the requirement is to clamp into range rather than return 0.

**Complexity**: O(n)

```python
class Solution:
    def reverse(self, x):
        res = int(str(x)[::-1]) if x >= 0 else -1 * int(str(-x)[::-1])
        return res if res < 2**31 and res >= -2**31 else 0
```

**Result**: 24ms, beats 99.42% of users with Python3.
