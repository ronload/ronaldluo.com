---
title: Zigzag Conversion｜之字變換
description: LeetCode 6. Zigzag Conversion 的解題筆記，先按題意建表，再找出讀取規律省去建表步驟。
date: 2024-01-18
---

**原題**：[LeetCode 6. Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion/)

**難度**：Medium

**主題**：String

> The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

```text
P   A   H   N
A P L S I I G
Y   I   R
```

> And then read line by line: "PAHNAPLSIIGYIR"

> Write the code that will take a string and make this conversion given a number of rows:

> string convert(string s, int numRows);

> 給定一個字串，根據要求的行數進行**之字形**轉換，回傳結果不包含空格。

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

### 暴力解

**思路**：直接按照題目要求建表，利用一個 step 變數記錄當前字串讀取方式。由於建表過程需要用到雙重回圈，時間複雜度為O(n^2)。

這個用 state 變數控制讀取方向的寫法再往下推，就是[「String to Integer (atoi)｜字串轉整數」](/notes/string-to-integer-atoi)裡的狀態機。

**時間複雜度**：O(n²)

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

**結果**：1102ms, beats 5.02%of users with Python3.

### 省去建表

**思路**：其實暴力解的主要思路只需要遍歷一次字串，主要開銷在於建表造成的時間浪費。因此我們可以嘗試尋找讀取字串的規律來規避建表步驟，利用一次讀取完成計算。

**複雜度**：O(n)

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

**結果**：42ms, beats 97.29%of users with Python3.
