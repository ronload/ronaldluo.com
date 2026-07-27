---
title: Median of Two Sorted Arrays
description: Median of Two Sorted Arrays in logarithmic time, and why the answer is to binary search the split point instead of merging the arrays at all.
date: 2024-01-17
---

**Original**: [LeetCode 4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

**Difficulty**: Hard

**Topics**: Array, Binary Search, Divide and Conquer

> Given two sorted arrays nums1 and nums2 of size m and n respectively, return **the median** of the two sorted arrays.

> The overall run time complexity should be O(log (m+n)).

**Example 1:**

```text
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
```

**Example 2:**

```text
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
```

**Constraints:**

- nums1.length == m
- nums2.length == n
- 0 <= m <= 1000
- 0 <= n <= 1000
- 1 <= m + n <= 2000
- -106 <= nums1[i], nums2[i] <= 106

## Solution

### Brute force

**Approach**: concatenate both arrays, sort the result, and return the median. The merge and sort cost O((m+n)log(m+n)) and the median itself costs O(m+n), so this misses the complexity the problem asks for. It also throws away the one thing the problem hands you, which is that **both arrays are already sorted**.

**Complexity**: O((m+n)log (m+n))

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        return statistics.median(sorted(nums1 + nums2))
```

### Two pointer merge

**Approach**: point one pointer at each array and pull out the smaller value each time. This does use the sorted property, which the brute force ignored, but the merge is still O(m+n) and still misses the requirement.

Walking two sequences in step also comes up in ["Add Two Numbers"](/notes/add-two-numbers), which has the same problem of one side running out first.

**Complexity**: O(m+n)

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        ptr1, ptr2 = 0, 0
        m, n = len(nums1), len(nums2)
        merge_array = []
        while ptr1 < m and ptr2 < n:
            if nums1[ptr1] <= nums2[ptr2]:
                merge_array.append(nums1[ptr1])
                ptr1 = ptr1 + 1
            else:
                merge_array.append(nums2[ptr2])
                ptr2 = ptr2 + 1
        merge_array += nums1[ptr1:]
        merge_array += nums2[ptr2:]
        # O(m+n), still too young too simple
        return statistics.median(merge_array)
```

### Two pointers and binary search

**Approach**: the required complexity rules out touching every element, since a full traversal is already linear, let alone merging. Logarithmic time leaves binary search as the only option. The hard part is **binary searching without merging the arrays**. The idea is to cut each array into two pieces, then binary search for the pair of cut points where everything left of the cuts sits below the median and everything right of them sits above it.

> [A walkthrough of the partition idea on YouTube](https://www.youtube.com/watch?v=wDBnBA82z1c)

> The text on its own is fairly abstract, and watching it drawn out is what made it click for me.

**Complexity**: O(log(min(m + n)))

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # make sure `nums1` is the shorter one, which simplifies everything after this
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        # binary search
        left_size = (m + n + 1) // 2  # fix the left size so the `median` lands on the left
        left, right = 0, m
        while left < right:  # left == right means the split point is found, so stop searching
            ptr1 = left + (right - left + 1) // 2
            ptr2 = left_size - ptr1
            if nums1[ptr1 - 1] > nums2[ptr2]:
                right = ptr1 - 1
            else:
                left = ptr1
        # set the final split point from the binary search result
        ptr1, ptr2 = left, left_size - left
        # edge cases, where a pointer sits exactly on an array boundary
        nums1_left_max = float('-inf') if ptr1 == 0 else nums1[ptr1 - 1]
        nums1_right_min = float('inf') if ptr1 == m else nums1[ptr1]
        nums2_left_max = float('-inf') if ptr2 == 0 else nums2[ptr2 - 1]
        nums2_right_min = float('inf') if ptr2 == n else nums2[ptr2]
        # compute the `median` from the parity
        if (m + n) % 2 == 1:
            return max(nums1_left_max, nums2_left_max)
        return (max(nums1_left_max, nums2_left_max) + min(nums1_right_min, nums2_right_min)) / 2
```
