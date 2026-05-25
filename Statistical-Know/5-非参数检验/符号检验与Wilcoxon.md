# 符号检验与 Wilcoxon 符号秩检验

非参数检验不依赖总体分布的具体形式，适用于偏态分布、等级数据或小样本场景。符号检验和 Wilcoxon 符号秩检验是配对设计中最常用的两种非参数方法。

## 符号检验（Sign Test）

### 原理

符号检验是最简单的非参数方法，仅关注配对差值的**方向**（正/负），忽略大小。

原假设 $H_0$：差值的总体中位数 $M_d = 0$（即正号与负号数量相等）。

检验统计量：$S = \min(N_+, N_-)$，其中 $N_+$ 为正号个数，$N_-$ 为负号个数。若 $S$ 过小，则拒绝 $H_0$。

数据要求极低——只需知道每对数据的相对大小，连具体的数值都不需要。

```python
from scipy.stats import binom_test
import numpy as np

# 配对数据：治疗前后血压
before = np.array([145, 150, 138, 160, 142, 155, 148, 152, 140, 147])
after  = np.array([135, 142, 140, 150, 130, 148, 138, 144, 136, 141])

diff = before - after
n_pos = np.sum(diff > 0)
n_neg = np.sum(diff < 0)
n_total = n_pos + n_neg

# 二项检验：p=0.5 下观察正号个数
p_value = binom_test(n_pos, n_total, p=0.5)
print(f"正号={n_pos}, 负号={n_neg}")
print(f"符号检验 p 值 = {p_value:.4f}")
```

## Wilcoxon 符号秩检验（Wilcoxon Signed-Rank Test）

### 原理

Wilcoxon 符号秩检验不仅考虑差值的正负，还考虑差值的大小，因此**功效高于**符号检验。

步骤：
1. 计算配对差值 $d_i = x_i - y_i$
2. 取绝对值 $|d_i|$，排除 $d_i=0$ 的配对
3. 对 $|d_i|$ 从小到大排秩
4. 给秩次加上原差值的符号（正/负）
5. 计算正秩和 $W_+$、负秩和 $W_-$

检验统计量 $W = \min(W_+, W_-)$。

当 $n \geq 20$ 时，$W$ 近似服从正态分布：

$$
z = \frac{W - n(n+1)/4}{\sqrt{n(n+1)(2n+1)/24}}
$$

### Python 实现

```python
from scipy.stats import wilcoxon

# 配对数据：新药前后疼痛评分（VAS）
pre_treatment  = [7, 6, 8, 5, 9, 7, 6, 8, 5, 6,
                  8, 7, 9, 4, 6, 7, 8, 5, 6, 7]
post_treatment = [4, 5, 3, 4, 6, 4, 5, 3, 4, 5,
                  5, 4, 6, 3, 4, 5, 4, 5, 4, 3]

stat, p_value = wilcoxon(pre_treatment, post_treatment, alternative='two-sided')

print(f"W 统计量 = {stat}")
print(f"p 值     = {p_value:.4f}")
```

参数 `alternative` 可选 `'two-sided'`、`'greater'`、`'less'`。当样本量较小时自动使用精确分布；$n > 20$ 时使用正态近似。

## 与配对 t 检验对比

| 特征 | 配对 t 检验 | Wilcoxon 符号秩检验 | 符号检验 |
|------|------------|-------------------|---------|
| **分布假设** | 差值服从正态分布 | 差值分布对称 | 无假设 |
| **检验对象** | 均值 | 中位数 | 中位数 |
| **使用信息** | 数值大小 | 差值方向+大小排序 | 仅方向 |
| **统计功效** | 最高（正态时） | 中等 | 最低 |
| **异常值影响** | 敏感 | 稳健 | 极稳健 |
| **适用数据** | 连续、正态 | 连续、偏态、等级 | 任何配对 |

### 选择建议

- **正态分布 + 方差齐** → 配对 t 检验（功效最高）
- **偏态分布 / 等级数据** → Wilcoxon 符号秩检验
- **仅知方向、不知大小** → 符号检验
- **存在极端异常值** → Wilcoxon 或符号检验

## 相关知识点

- [Mann-Whitney检验](./Mann-Whitney检验) — 两独立组的非参数检验
- [Kruskal-Wallis与Friedman](./Kruskal-Wallis与Friedman) — 多组非参数检验
- [t检验](/Statistical-Know/2-统计推断/t检验) — 参数化的配对检验
