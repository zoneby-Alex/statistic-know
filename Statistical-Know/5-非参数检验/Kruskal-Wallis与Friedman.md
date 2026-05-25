# Kruskal-Wallis 与 Friedman 检验

当比较组数超过两组时，若数据不满足参数检验（ANOVA）的条件，需要采用非参数替代方法。

| 设计类型 | 参数方法 | 非参数方法 |
|---------|---------|-----------|
| 多组独立样本 | 单因素 ANOVA | **Kruskal-Wallis 检验** |
| 多组配对样本 | 重复测量 ANOVA | **Friedman 检验** |

## Kruskal-Wallis 检验

### 原理

Kruskal-Wallis 检验是 Mann-Whitney U 检验向多组的推广，用于比较 $k$ 个独立组是否来自相同分布。

步骤：
1. 将所有组数据合并后统一排秩
2. 分别计算各组的秩和 $R_i$
3. 计算 H 统计量：

$$
H = \frac{12}{N(N+1)} \sum_{i=1}^{k} \frac{R_i^2}{n_i} - 3(N+1)
$$

其中 $N$ 为总样本量，$n_i$ 为第 $i$ 组样本量，$R_i$ 为第 $i$ 组秩和。

$H$ 近似服从自由度为 $k-1$ 的卡方分布（当各组 $n_i \geq 5$ 时）。

### Python 实现

```python
from scipy.stats import kruskal
import numpy as np

# 三组独立样本：三种不同治疗方案的疗效评分
treatment_a = [65, 72, 68, 74, 70, 66, 71, 69, 73, 67]
treatment_b = [58, 62, 55, 60, 64, 59, 61, 63, 57, 56]
treatment_c = [70, 75, 80, 72, 78, 74, 76, 71, 79, 73]

stat, p_value = kruskal(treatment_a, treatment_b, treatment_c)

print(f"H 统计量 = {stat:.4f}")
print(f"p 值     = {p_value:.4f}")

# 组间中位数比较
print(f"A 组中位数 = {np.median(treatment_a)}")
print(f"B 组中位数 = {np.median(treatment_b)}")
print(f"C 组中位数 = {np.median(treatment_c)}")
```

若 $p < 0.05$，可进行事后两两比较（常用 Dunn 检验）：

```python
# 事后两两比较（需要 scikit-posthocs）
# pip install scikit-posthocs
import scikit_posthocs as sp

data = treatment_a + treatment_b + treatment_c
groups = ['A']*10 + ['B']*10 + ['C']*10

dunn_result = sp.posthoc_dunn([treatment_a, treatment_b, treatment_c],
                              p_adjust='bonferroni')
print("Dunn 事后检验（Bonferroni 校正）:")
print(dunn_result)
```

## Friedman 检验

### 原理

Friedman 检验是 Wilcoxon 符号秩检验向多组的推广，适用于**随机区组设计**或**重复测量设计**。

步骤：
1. 在每个区组（行）内对各处理排秩
2. 计算各处理（列）的秩和 $R_j$
3. 计算 $Q$ 统计量：

$$
Q = \frac{12}{b\,k\,(k+1)} \sum_{j=1}^{k} R_j^2 - 3b\,(k+1)
$$

其中 $b$ 为区组数（行数），$k$ 为处理数（列数）。

### Python 实现

```python
from scipy.stats import friedmanchisquare
import numpy as np

# 4 种药物分别施用于 8 只动物的效果（随机区组设计）
# 每行 = 同一动物，每列 = 不同药物
data = np.array([
    [20, 18, 22, 19],   # 动物1
    [24, 22, 23, 21],   # 动物2
    [18, 16, 20, 17],   # 动物3
    [22, 20, 24, 21],   # 动物4
    [26, 24, 25, 23],   # 动物5
    [19, 17, 21, 18],   # 动物6
    [21, 19, 22, 20],   # 动物7
    [23, 21, 24, 22],   # 动物8
])

drug_a = data[:, 0]
drug_b = data[:, 1]
drug_c = data[:, 2]
drug_d = data[:, 3]

stat, p_value = friedmanchisquare(drug_a, drug_b, drug_c, drug_d)

print(f"Q 统计量 = {stat:.4f}")
print(f"p 值     = {p_value:.4f}")

# 中位数比较
for i, name in enumerate(["Drug A", "Drug B", "Drug C", "Drug D"]):
    print(f"{name} 中位数 = {np.median(data[:, i])}")
```

## 与参数检验对比

| 特征 | 单因素 ANOVA | Kruskal-Wallis | 重复测量 ANOVA | Friedman |
|------|-------------|---------------|---------------|----------|
| **分布假设** | 正态+方差齐 | 无 | 正态+球对称 | 无 |
| **检验对象** | 均值 | 中位数/分布 | 均值 | 中位数/分布 |
| **功效（正态时）** | 100% | ~95% | 100% | ~95% |
| **事后检验** | Tukey HSD | Dunn 检验 | Bonferroni | Nemenyi 检验 |

## 相关知识点

- [符号检验与Wilcoxon](./符号检验与Wilcoxon) — 两配对组的非参数检验
- [Mann-Whitney检验](./Mann-Whitney检验) — 两独立组的非参数检验
- [方差分析](/Statistical-Know/3-方差分析/) — 参数化多组比较方法
