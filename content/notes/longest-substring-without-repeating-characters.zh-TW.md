---
title: Longest Substring Without Repeating Characters｜最長不重複子字串
description: LeetCode 3. Longest Substring Without Repeating Characters 的解題筆記，從暴力解到 sliding window 搭配 hash map 或 set 的 O(n) 解法。
date: 2024-01-17
---

**原題**：[LeetCode 3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

**難度**：Medium

**主題**：Hash Table、String、Sliding Window

> Given a string s, find the length of the **longest** **substring** without repeating characters.

> 給定一個字串s，找出其中不包含重複字元的**最長子字串**，並回傳其長度。

**Example 1:**

```text
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

**Example 2:**

```text
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

**Example 3:**

```text
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

**Constraints:**

- 0 <= s.length <= 5 * 104
- s consists of English letters, digits, symbols and spaces.

## Solution

### 暴力解

**思路**：利用雙重迴圈遍歷整個字串，對每一個字元向後找出最長的不重複子字串。

[「Longest Palindromic Substring｜最長回文子字串」](/notes/longest-palindromic-substring)的暴力解也是同一個形狀，差別在內層還要多做一次回文判斷。

**複雜度**：O(n²)

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        res = 0
        length = len(s)
        for i in range(length):
            substr = ""
            for j in range(i, length):
                if s[j] in substr:
                    break
                substr = substr + s[j]
            res = max(res, len(substr))
        return res
```

### Sliding Window + Hash Map

**思路**：這邊要降低時間複雜度就必須想辦法在O(n)時間內完成計算，也就是只能進行一次遍歷。我們可以嘗試使用sliding window進行遍歷，並使用hash map對每個字元的最後位置進行記錄。由於本題要求的結果是回傳長度，所以可以不保留字串直接透過子字串首尾index計算長度，避免創建字串造成的開銷。

hash map 換取 O(1) 查詢的基本用法可以看[「Two Sum｜兩數之和」](/notes/two-sum)。

**複雜度**：O(n)

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        start, res, length = 0, 0, len(s)  # 初始化起點、結果、最長字串長度
        latest_position = defaultdict(lambda:-1)  # 初始化所有字元的最後出現位置為-1
        for end in range(length):
            # 如果下一個字元已經存在子字串中，就將起點移動到該字元最後出現的位置+1
            # 如果下一個字元不存在子字串中，則不更動起點位置
            start = max(start, latest_position[s[end]] + 1)
            # 記錄當下字元最後出現的位置
            latest_position[s[end]] = end
            # 更新最長子字串長度
            res = max(res, end - start + 1)
        return res
```

### Sliding Window + Set

**思路**：將hash map替換為set，也是一種解法

**複雜度**：O(n)

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        start, end, res, length = 0, 0, 0, len(s)
        char_set = set()
        while end < length:
            # 如果下一個字元已經存在子字串中，則將窗口起點右移
            if s[end] in char_set:
                char_set.remove(s[start])
                start = start + 1
            # 如果下一個字元不在子字串中，則將窗口終點右移
            else:
                char_set.add(s[end])
                end = end + 1
                res = max(res, end - start)
        return res
```
