---
title: Longest Palindromic Substring
description: Four attempts at Longest Palindromic Substring, from a brute force that times out to expand around center, dynamic programming, and Manacher's.
date: 2024-01-18
---

**Original**: [LeetCode 5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**Difficulty**: Medium

**Topics**: String, Dynamic Programming

> Given a string s, return the longest palindromic substring in s.

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

### Brute force

**Approach**: a nested loop walks every substring of `s`, which is O(n²), and each one gets a palindrome check, which is O(n). Keep the longest and return it.

The brute force in ["Longest Substring Without Repeating Characters"](/notes/longest-substring-without-repeating-characters) has this same shape, but it needs no palindrome check, so it stops at O(n²).

**Complexity**: O(n³)

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

**Result**: TLE. The constraints cap the string at 1000 characters, so the worst single case costs around 1,000,000,000 operations.

### Expand around the center

**Approach**: treat each character as a center and expand outward, which removes the separate palindrome check entirely. Both the walk and the expansion are O(n), so the whole thing comes in at O(n²). Palindromes have a parity problem though, so odd length and even length centers need handling separately.

**Complexity**: O(n²)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        length = len(s)
        res = ""
        for i in range(length):
            # take the longest of the cached best, the odd length palindrome, and the even length one
            res = max ([
                self.extend_substr(i, i, s),  # odd cases
                self.extend_substr(i - 1, i, s),  # even cases
                res
            ], key=len)
        return res

    # expand while possible, and return the substring once it cannot expand further
    def extend_substr(self, left: int, right: int, s: str) -> str:
        if not (left >= 0 and right < len(s) and s[left] == s[right]):
            return s[left + 1:right]
        return self.extend_substr(left - 1, right + 1, s)
```

**Result**: 365ms, beats 76.90% of users with Python3.

### Dynamic programming

**Approach**: if `substr` is a palindrome then `substr[1:-1]` has to be one too, and that is the recurrence. Build a 2D table recording whether `s[i:j]` is a palindrome, then grow outward from the neighboring cases. DP is the more obvious framing of the two, and it lands at the same O(n²) as expand around the center. Neither one is optimal, but it is a reasonable excuse to revisit DP.

**Time complexity**: O(n²)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        length = len(s)
        dp = [[False] * length for _ in range(length)]
        for i in range(length):
            for j in range(i + 1):
                if i - j == 0:  # i == j means a single character, which is always a palindrome
                    dp[i][j] = True
                elif i - j == 1:  # i - j == 1 means two adjacent characters, a palindrome if they match
                    dp[i][j] = (s[i] == s[j])
                else:
                    dp[i][j] = (dp[i - 1][j + 1]) and (s[i] == s[j])  # the dp step
                if dp[i][j] and i - j + 1 > len(res):
                    res = s[j:i + 1]
        return res
```

**Result**: 2735ms, beats 32.51% of users with Python3.

### Manacher's algorithm

**Approach**: an algorithm built specifically for the longest palindromic substring, which gets the complexity down to linear with a genuinely elegant idea. It takes real effort to follow, and an interview is unlikely to ask for it. The core of it is combining expand around the center with the DP insight so that no palindrome ever gets checked twice.

**Time complexity**: O(n)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        s_processed = '#' + '#'.join(s) + '#'  # preprocess to remove the odd and even distinction
        n = len(s_processed)
        p = [0] * n

        center, right, max_len, max_center= 0, 0, 0, 0
        for i in range(n):
            p[i] = min(right - i, p[2 * center - i])  # can this center reuse a mirrored result

            # try to extend
            while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and s_processed[i - p[i] - 1] == s_processed[i + p[i] + 1]:
                p[i] = p[i] + 1
            if i + p[i] > right:
                center, right = i, i + p[i]
            if p[i] > max_len:
                max_len, max_center = p[i], i

        return s[(max_center - max_len) // 2:(max_center - max_len) // 2 + max_len]  # restore the original string
```

**Result**: 96ms, beats 96.25% of users with Python3.
