---
title: Two Sum
description: Two Sum solved twice, first with the O(n²) nested loop and then with one pass that trades memory for an O(1) hash table lookup.
date: 2024-01-17
---

**Original**: [LeetCode 1. Two Sum](https://leetcode.com/problems/two-sum/)

**Difficulty**: Easy

**Topics**: Array, Hash Table

> Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

> You may assume that each input would have **exactly** one solution, and you may not use the same element twice.

> You can return the answer in any order.

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

### Brute force

**Approach**: on a first read the nested loop is the obvious move. Walk every pair and return the indices the moment a pair adds up to the target.

**Complexity**: O(n²)

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

### Hash table

**Approach**: the first pass already tells you the second number. The moment you have `num1` you know `num2` is `target - num1`, so the only open question is whether you have seen it yet. Store each value as you go and a hash table answers that in O(1), which puts the whole solution at O(n).

The same O(1) lookup shows up in ["Longest Substring Without Repeating Characters"](/notes/longest-substring-without-repeating-characters), paired with a sliding window there.

**Complexity**: O(n)

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        size = len(nums)
        hash_table = {}
        for i in range(size):
            key = target - nums[i]
            # if target - nums[i] is already in nums, return its index
            if key in hash_table:
                return [i, hash_table[key]]
            # otherwise store {nums.value, nums.key} in hash_table for later lookups
            hash_table[nums[i]] = i
        return []
```
