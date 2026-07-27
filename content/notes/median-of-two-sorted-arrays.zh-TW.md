---
title: Median of Two Sorted Arrays｜兩陣列中位數
description: LeetCode 4. Median of Two Sorted Arrays 的解題筆記，從合併排序、two pointer，到用二元搜尋在不合併陣列的情況下找出分割點。
date: 2024-01-17
---

**原題**：[LeetCode 4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

**難度**：Hard

**主題**：Array、Binary Search、Devide and Conquer

> Given two sorted arrays nums1 and nums2 of size m and n respectively, return **the median** of the two sorted arrays.

> The overall run time complexity should be O(log (m+n)).

> 給定兩個已排序陣列nums1、nums2，其長度分別為m、n，回傳兩陣列中位數。

> 時間複雜度必須為O(log(m+n))

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

### 暴力解

**思路**：直接合併兩陣列再對其進行快速排序，最後回傳中位數。合併+排序的複雜度為O((m+n)\log (m+n))，計算中位數的複雜度為O(m+n)。這種情況下，此解法並不滿足題目要求的複雜度，而且也沒有使用到**兩陣列已排序**這個條件進行優化。

**複雜度**：O((m+n)log (m+n))

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        return statistics.median(sorted(nums1 + nums2))
```

### Two Pointer合併

**思路**：使用兩個指針分別指向兩陣列，一一取出後放入新陣列。這樣做的優點是可以充分利用**兩陣列已排序**這項條件進行合併，但優化後時間複雜度為O(m+n)，仍不滿足題目要求。

同樣用兩個指針同步走兩條序列的還有[「Add Two Numbers｜兩數相加」](/notes/add-two-numbers)，那題也要處理其中一邊先走完的情況。

**複雜度**：O(m+n)

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

### Two Pointer＋二元搜尋法

**思路**：既然題目要求時間複雜度在O((m+n)\log (m+n))，代表我們不可能將兩個陣列完全進行遍歷（至少需要線性時間），更不用說是對陣列進行合併。這邊要求要在對數時間內進行計算，唯一的解法就是使用二元搜尋（binary search）。這題的難點主要是在**如何在不合併陣列的情況下進行二元搜尋**，我們的思路是利用兩個指針分別將兩個陣列分成割兩段，利用二元搜尋法尋找適合的分割點，使指針左側代表小於中位數的部分，而指針右側代表小於中位數的部分。

> [https://www.youtube.com/watch?v=wDBnBA82z1c](https://www.youtube.com/watch?v=wDBnBA82z1c)

> 這邊單看文字敘述可能有點抽象，可以看看這個影片比較幫助理解。

**複雜度**：O(log(min(m + n)))

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # 確保`nums1`一定比`nums2`短，簡化後續操作
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        # binary search
        left_size = (m + n + 1) // 2  # 固定左側長度，確保`median`在左側
        left, right = 0, m
        while left < right:  # 當 left == right 時代表找到分割點，結束搜尋
            ptr1 = left + (right - left + 1) // 2
            ptr2 = left_size - ptr1
            if nums1[ptr1 - 1] > nums2[ptr2]:
                right = ptr1 - 1
            else:
                left = ptr1
        # 根據binary search的結果設置最終分割點
        ptr1, ptr2 = left, left_size - left
        # edge cases, 處理指針剛好位於陣列邊界的情況
        nums1_left_max = float('-inf') if ptr1 == 0 else nums1[ptr1 - 1]
        nums1_right_min = float('inf') if ptr1 == m else nums1[ptr1]
        nums2_left_max = float('-inf') if ptr2 == 0 else nums2[ptr2 - 1]
        nums2_right_min = float('inf') if ptr2 == n else nums2[ptr2]
        # 根據奇偶性計算`median`
        if (m + n) % 2 == 1:
            return max(nums1_left_max, nums2_left_max)
        return (max(nums1_left_max, nums2_left_max) + min(nums1_right_min, nums2_right_min)) / 2
```
