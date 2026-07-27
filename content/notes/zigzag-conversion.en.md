---
title: Zigzag Conversion
description: Zigzag Conversion built the obvious way beats 5% of submissions, so the second attempt reads the pattern straight off the index arithmetic.
date: 2024-01-18
---

**Original**: [LeetCode 6. Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion/)

**Difficulty**: Medium

**Topics**: String

> The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

```text
P   A   H   N
A P L S I I G
Y   I   R
```

> And then read line by line: "PAHNAPLSIIGYIR"

> Write the code that will take a string and make this conversion given a number of rows:

> string convert(string s, int numRows);

**Example 1:**

```text
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
```

**Example 2:**

```text
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:
 P     I    N
 A   L S  I G
 Y A   H R
 P     I
```

**Example 3:**

```text
Input: s = "A", numRows = 1
Output: "A"
```

**Constraints:**

- 1 <= s.length <= 1000
- s consists of English letters (lower-case and upper-case), ',' and '.'.
- 1 <= numRows <= 1000

## Solution

### Brute force

**Approach**: build the table exactly the way the problem describes it, with a `state` variable tracking which way the write head is currently moving. Building the table needs a nested loop, so this lands at O(n²).

Push that `state` variable a little further and you get the state machine in ["String to Integer (atoi)"](/notes/string-to-integer-atoi).

**Time complexity**: O(n²)

```python
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        length = len(s)
        if length == 1 or numRows == 1:
            return s
        table = [['' for _ in range(length)] for _ in range(numRows)]
        state, row, col = 0, 0, 0
        for i in range(length):
            table[row][col] = s[i]
            state = 0 if row == 0 else state
            state = 1 if row == numRows - 1 else state
            row = row + 1 if state == 0 else row - 1
            col = col + 1 if state == 1 else col
        res = ""
        for i in range(numRows):
            for j in range(length):
                if table[i][j] == " ":
                    continue
                res += table[i][j]
        return res
```

**Result**: 1102ms, beats 5.02% of users with Python3.

### Skip the table

**Approach**: the brute force only ever needs one pass over the string. All of the cost sits in the table. So the fix is to work out the pattern the reader follows and compute the positions directly, which drops the table and finishes the whole thing in a single read.

**Complexity**: O(n)

```python
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        length = len(s)
        if length == 1 or numRows == 1:
            return s
        res = ""
        for row in range(numRows):
            step = 2 * (numRows - 1)
            i = row
            while i < length:
                res = res + s[i]
                if row > 0 and row < numRows - 1 and i + step - 2 * row < length:
                    res = res + s[i + step - 2 * row]
                i += step
        return res
```

**Result**: 42ms, beats 97.29% of users with Python3.
