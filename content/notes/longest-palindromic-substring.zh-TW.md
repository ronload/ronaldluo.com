---
title: Longest Palindromic Substring｜最長回文子字串
description: LeetCode 5. Longest Palindromic Substring 的解題筆記，比較暴力解、中心擴展、動態規劃與馬拉車演算法。
date: 2024-01-18
---

**原題**：[LeetCode 5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**難度**：Medium

**主題**：String、Dynamic Programming

> Given a string s, return the longest palindromic substring in s.

> 給定一個字串 s ，回傳其中包含的最長回文子字串。

**Example 1:**

```text
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

**Example 2:**

```text
Input: s = "cbbd"
Output: "bb"
```

**Constraints:**

- 1 <= s.length <= 1000
- s consist of only digits and English letters.

## Solution

### 暴力解

**思路**：利用雙重迴圈遍歷 s 中的所有子字串(O(n^2))，一一判斷是否為回文(O(n))，將長度最長的保存下來進行回傳。

[「Longest Substring Without Repeating Characters｜最長不重複子字串」](/notes/longest-substring-without-repeating-characters)的暴力解也是這個形狀，但那題不需要額外的回文判斷，所以停在 O(n²)。

**複雜度**：O(n³)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        length = len(s)
        for i in range(length):
            for j in range(i, length):
                substr = s[i:j+1]
                if self.is_palindrome(substr) and len(substr) > len(res):
                    res = substr
        return res
    def is_palindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1
        while(left < right):
            if not s[left] == s[right]:
                return False
            left, right = left + 1, right - 1
        return True
```

**結果**：TLE（超時）。由題幹描述可知，最長字串長度為1000，最差情況單一 case 需要 1000000000 的開銷。

### 中心擴展（雙指針）

**思路**：遍歷字串時，將自身作為中心點左右擴展，以省去判斷子字串是否為回文的步驟。遍歷和擴展的複雜度都是 O(n) ，因此利用這個方法可以在 O(n²) 複雜度下解決問題。另外，由於回文查詢操作可能存在奇偶性問題，需要將 odd cases 和 even cases 分開判斷。

**複雜度**：O(n²)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        length = len(s)
        res = ""
        for i in range(length):
            # 從`當前緩存的最長回文`、`奇數長度回文`、`偶數長度回文`三者中取出長度最長的
            res = max ([
                self.extend_substr(i, i, s),  # odd cases
                self.extend_substr(i - 1, i, s),  # even cases
                res
            ], key=len)
        return res

    # 判斷是否能擴展，如果不能擴展則回傳子字串
    def extend_substr(self, left: int, right: int, s: str) -> str:
        if not (left >= 0 and right < len(s) and s[left] == s[right]):
            return s[left + 1:right]
        return self.extend_substr(left - 1, right + 1, s)
```

**結果**：365ms, beats 76.90% of users with Python3.

### 動態規劃（Dynamic Programming）

**思路**：由於當 substr 為回文時 substr[1:-1] 必為回文，可以此作為 DP 點，建立一個二維陣列記錄 s[i:j] 是否為回文，在逐步推廣到其附近的 case 進行判斷。利用DP也算是一個比較直觀的解決方案，時間複雜度和使用雙指針的中心擴展法一樣都是O(n^2)，雖然都不是最優解，但可以當成一個解題思路，順便複習DP的應用。

**時間複雜度**：O(n²)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        length = len(s)
        dp = [[False] * length for _ in range(length)]
        for i in range(length):
            for j in range(i + 1):
                if i - j == 0:  # 當 i == j 代表子字串為單一字元，必為回文
                    dp[i][j] = True
                elif i - j == 1:  # 當 i - j = 1 代表子字串為兩相鄰字元，如果兩字元相同則必為回文
                    dp[i][j] = (s[i] == s[j])
                else:
                    dp[i][j] = (dp[i - 1][j + 1]) and (s[i] == s[j])  # dp點
                if dp[i][j] and i - j + 1 > len(res):
                    res = s[j:i + 1]
        return res
```

**結果**：2735ms, beats 32.51% of users with Python3.

### 馬拉車演算法（Manacher's algorithm）

**思路**：針對最長回文子字串進行特化產生的演算法，用很優雅的思維將時間複雜度縮小到線性時間。理解起來會有點複雜，一般面試基本上也不會要求。其中心思想可以理解為利用中心擴展+動態規劃的方式規避掉對回文的重複查詢。

**時間複雜度**：O(n)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        s_processed = '#' + '#'.join(s) + '#'  # 預處理，規避奇偶性
        n = len(s_processed)
        p = [0] * n

        center, right, max_len, max_center= 0, 0, 0, 0
        for i in range(n):
            p[i] = min(right - i, p[2 * center - i])  # 判斷當前中心是否可計算

            # 嘗試延展
            while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and s_processed[i - p[i] - 1] == s_processed[i + p[i] + 1]:
                p[i] = p[i] + 1
            if i + p[i] > right:
                center, right = i, i + p[i]
            if p[i] > max_len:
                max_len, max_center = p[i], i

        return s[(max_center - max_len) // 2:(max_center - max_len) // 2 + max_len]  # 恢復字串
```

**結果**：96ms, beats 96.25% of users with Python3.
