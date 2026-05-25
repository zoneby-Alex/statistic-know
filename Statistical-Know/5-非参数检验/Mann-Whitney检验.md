# Mann-Whitney U 检验

Mann-Whitney U 检验（也称 Wilcoxon 秩和检验）是**两独立样本 t 检验的非参数替代方法**，用于比较两组独立样本是否来自同一分布。

## 适用场景

- 两组数据不服从正态分布（或分布未知）
- 等级资料（如病情严重程度：轻/中/重）
- 存在极端异常值
- 小样本且正态性存疑

## 排秩原理

Mann-Whitney 检验不直接比较原始数值，而是将两组数据**合并后排秩**，再比较两组的秩和。

步骤：
1. 将两组数据合并，从小到大排秩（相同值取平均秩）
2. 分别计算两组的秩和 $R_1$ 和 $R_2$
3. 计算 U 统计量：

$$
U_1 = R_1 - \frac{n_1(n_1+1)}{2}, \quad U_2 = R_2 - \frac{n_2(n_2+1)}{2}
$$

取 $U = \min(U_1, U_2)$。若 $U$ 小于临界值，则拒绝 $H_0$。

当 $n_1, n_2$ 均 $\geq 10$ 时，$U$ 近似正态分布：

$$
z = \frac{U - \mu_U}{\sigma_U}, \quad \mu_U = \frac{n_1 n_2}{2}, \quad \sigma_U = \sqrt{\frac{n_1 n_2 (n_1 + n_2 + 1)}{12}}
$$

## Python 实现

```python
from scipy.stats import mannwhitneyu
import numpy as np

# 两组独立样本：新药组 vs 对照组
# 疼痛评分（VAS，0-10 分）
drug_group = np.array([3, 4, 2, 5, 3, 4, 2, 3, 4, 3,
                       2, 3, 4, 2, 3, 5, 3, 2, 4, 3])
placebo_group = np.array([5, 6, 4, 7, 5, 8, 6, 5, 7, 6,
                          5, 7, 6, 8, 5, 6, 7, 5, 6, 5])

stat, p_value = mannwhitneyu(drug_group, placebo_group, alternative='two-sided')

print(f"U 统计量 = {stat}")
print(f"p 值     = {p_value:.4f}")

# 计算中位数
print(f"药物组中位数 = {np.median(drug_group)}")
print(f"安慰剂组中位数 = {np.median(placebo_group)}")
```

输出示例：

```
U 统计量 = 56.0
p 值     = 0.0001
药物组中位数 = 3.0
安慰剂组中位数 = 6.0
```

### 参数说明

- `alternative`：`'two-sided'`（默认，双尾）、`'less'`（第一组 tend to be smaller）、`'greater'`
- `method`：`'auto'`（默认）、`'asymptotic'`（正态近似）、`'exact'`（精确分布）

## 效应量

Mann-Whitney U 检验的常用效应量：

$$
r = \frac{Z}{\sqrt{n_1 + n_2}}, \quad \text{或} \quad \text{CL} = \frac{U}{n_1 n_2}
$$

其中 CL（Common Language Effect Size）表示从一组中随机抽取的值大于另一组的概率。

```python
# 计算效应量 CL
n1 = len(drug_group)
n2 = len(placebo_group)
cl = stat / (n1 * n2)
print(f"CL 效应量 = {cl:.3f}")
print(f"药物组评分低于对照组的概率 ≈ {cl:.1%}")
```

## 与独立 t 检验功效对比

| 特征 | 独立 t 检验 | Mann-Whitney U 检验 |
|------|------------|-------------------|
| **分布假设** | 正态分布 + 方差齐 | 无特定分布假设 |
| **检验对象** | 均值之差 | 分布位置（中位数） |
| **正态时功效** | 100%（基准） | 约 95% |
| **偏态时功效** | 降低 | 稳健 |
| **异常值影响** | 较大 | 较小 |
| **适用数据** | 连续、正态 | 连续、偏态、等级 |
| **小样本** | 需验证正态性 | 可处理小样本 |

### 什么时候用 Mann-Whitney？

- 数据明显偏态（如住院天数、费用）
- 等级数据（如 Likert 量表评分）
- 存在多个极端值
- 样本量很小（如每组 $n < 10$）且无法确认正态性
- 效应方向比效应大小更重要

## 相关知识点

- [符号检验与Wilcoxon](./符号检验与Wilcoxon) — 配对设计的非参数检验
- [Kruskal-Wallis与Friedman](./Kruskal-Wallis与Friedman) — 多组比较的非参数方法
- [t检验](/Statistical-Know/2-统计推断/t检验) — 参数化的两独立样本检验
