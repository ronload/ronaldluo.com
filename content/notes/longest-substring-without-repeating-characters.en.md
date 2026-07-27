---
title: Longest Substring Without Repeating Characters
description: Longest Substring Without Repeating Characters, from the O(n²) brute force to a sliding window backed first by a hash map and then by a set.
date: 2024-01-17
---

**Original**: [LeetCode 3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

**Difficulty**: Medium

**Topics**: Hash Table, String, Sliding Window

> Given a string s, find the length of the **longest** **substring** without repeating characters.

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

### Brute force

**Approach**: a nested loop over the whole string, and from each character walk forward as far as the characters stay unique.

The brute force in ["Longest Palindromic Substring"](/notes/longest-palindromic-substring) has the same shape, except its inner loop also has to run a palindrome check.

**Complexity**: O(n²)

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

### Sliding window with a hash map

**Approach**: getting under O(n²) means one pass and nothing more. A sliding window handles the walk, and a hash map records where each character last appeared. The problem only asks for a length, so there is no reason to keep the substring itself. Subtracting the window start from the window end gives the length directly and avoids the cost of building strings.

The plain version of trading memory for an O(1) lookup is in ["Two Sum"](/notes/two-sum).

**Complexity**: O(n)

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        start, res, length = 0, 0, len(s)  # window start, answer, string length
        latest_position = defaultdict(lambda:-1)  # every character starts with a last position of -1
        for end in range(length):
            # if the next character is already in the window, move the start to its last position + 1
            # if it is not in the window, leave the start where it is
            start = max(start, latest_position[s[end]] + 1)
            # record where this character was last seen
            latest_position[s[end]] = end
            # update the longest length
            res = max(res, end - start + 1)
        return res
```

### Sliding window with a set

**Approach**: swapping the hash map for a set also works.

**Complexity**: O(n)

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        start, end, res, length = 0, 0, 0, len(s)
        char_set = set()
        while end < length:
            # if the next character is already in the window, move the window start right
            if s[end] in char_set:
                char_set.remove(s[start])
                start = start + 1
            # if the next character is not in the window, move the window end right
            else:
                char_set.add(s[end])
                end = end + 1
                res = max(res, end - start)
        return res
```
