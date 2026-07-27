---
title: Two Sum｜兩數之和
description: LeetCode 1. Two Sum 的解題筆記，從 O(n²) 的雙重迴圈到用 hash table 一次遍歷求解。
date: 2024-01-17
---

**原題**：[LeetCode 1. Two Sum](https://leetcode.com/problems/two-sum/)

**難度**：Easy

**主題**：Array、Hash Table

> Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

> You may assume that each input would have **exactly** one solution, and you may not use the same element twice.

> You can return the answer in any order.

> 給定一個正整數陣列 nums 和一個正整數 target，找出 nums 中的相異兩數，相加為 target ，並回傳其下標。每題只有**一個**答案。

**Example 1.**

```text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Example 2.**

```text
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Example 3.**

```text
Input: nums = [3,3], target = 6
Output: [0,1]
```

**Constraints:**

- 2 <= nums.length <= 104
- -109 <= nums[i] <= 109
- -109 <= target <= 109
- **Only one valid answer exists.**

## Solution

### 暴力解

**思路**：初見題目我們可以先使用雙重迴圈求解，找到結果直接回傳下標。

**複雜度**：O(n²)

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        size = len(nums)
        for i in range(size):
            for j in range(i + 1, size):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
```

### Hash Table（雜湊表）

**思路**：由於我們在第一次遍歷 nums 時，其實也變相地得知了我們所需要找的第二個數字（當我們找到 num1 時，其實已經知道 num2 = target - num1），因此我們可以利用一次遍歷將資料存進 Hash Table 中，利用 hashmap 的 O(1) 查詢速度來讓整個 solution 達到 O(n) 的時間複雜度。

同樣靠 hash table 把查詢壓到 O(1) 的還有[「Longest Substring Without Repeating Characters｜最長不重複子字串」](/notes/longest-substring-without-repeating-characters)，那題是搭配 sliding window 使用。

**複雜度**：O(n)

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        size = len(nums)
        hash_table = {}
        for i in range(size):
            key = target - nums[i]
            # 如果target - nums[i]在存在nums中，回傳其index
            if key in hash_table:
                return [i, hash_table[key]]
            # 如果不存在，將{nums.value, nums.key}存入hash_table中，以供後續查詢
            hash_table[nums[i]] = i
        return []
```
