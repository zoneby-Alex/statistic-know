# Fisher 精确检验与 McNemar 检验

当卡方检验的适用条件不满足时（如期望频数过小、配对设计），需要使用替代方法。Fisher 精确检验和 McNemar 检验是两类重要的补充。

## Fisher 精确检验

### 适用场景

- $2\times2$ 四格表
- 存在期望频数 $< 5$（尤其是 $< 1$ 时必须使用）
- 小样本数据

### 原理

Fisher 精确检验基于**超几何分布**，在固定边际合计的条件下，直接计算当前（及更极端）表格出现的精确概率。

对于四格表：

| | 阳性 | 阴性 | 合计 |
|---|------|------|------|
| 组1 | $a$ | $b$ | $a+b$ |
| 组2 | $c$ | $d$ | $c+d$ |
| 合计 | $a+c$ | $b+d$ | $n$ |

概率计算公式：

$$
P = \frac{(a+b)!\,(c+d)!\,(a+c)!\,(b+d)!}{a!\,b!\,c!\,d!\,n!}
$$

### Python 实现

```python
from scipy.stats import fisher_exact

# 小样本四格表：新药 vs 安慰剂
#         有效  无效
# 新药     4     1
# 安慰剂   1     5
table = [[4, 1],
         [1, 5]]

odds_ratio, p_value = fisher_exact(table, alternative='two-sided')

print(f"优势比 (OR) = {odds_ratio:.4f}")
print(f"p 值         = {p_value:.4f}")
```

输出：

```
优势比 (OR) = 20.0000
p 值         = 0.0804
```

参数 `alternative` 可选 `'two-sided'`（双尾）、`'less'` 或 `'greater'`（单尾）。

## McNemar 检验

### 适用场景

**配对分类数据**，如同一受试者治疗前后的疗效对比、病例-对照配对研究。

### 数据形式

| 对照\病例 | 暴露(+) | 未暴露(-) |
|-----------|---------|-----------|
| 暴露(+)   | $a$     | $b$       |
| 未暴露(-) | $c$     | $d$       |

McNemar 检验仅关注**不一致的对子**（$b$ 和 $c$），原假设为 $b = c$：

$$
\chi^2 = \frac{(b-c)^2}{b+c}
$$

当 $b+c < 25$ 时，使用**二项分布精确检验**（`exact=True`）。

### Python 实现

```python
from scipy.stats import mcnemar
import numpy as np

# 配对数据：治疗前后
#         治后(+) 治后(-)
# 治前(+)   20      5
# 治前(-)   12     30
table = np.array([[20,  5],
                  [12, 30]])

result = mcnemar(table, exact=False, correction=True)
print(f"卡方值 = {result.statistic:.4f}")
print(f"p 值   = {result.pvalue:.4f}")

# 小样本时使用精确检验
result_exact = mcnemar(table, exact=True)
print(f"精确检验 p 值 = {result_exact.pvalue:.4f}")
```

## 选择逻辑

```
分类数据检验 → 设计类型？
├── 独立样本 → 四格表？
│   ├── 所有期望频数 ≥ 5 → Pearson 卡方
│   └── 有期望频数 < 5 → Fisher 精确检验
│       └── 四格表 > 2×2 → Fisher-Freeman-Halton 精确检验
└── 配对样本 → McNemar 检验
    ├── 不一致对 b+c ≥ 25 → 卡方近似
    └── 不一致对 b+c < 25 → 二项精确检验
```

## 相关知识点

- [卡方检验原理](./卡方检验原理) — 卡方检验基本框架
- [列联表与关联度量](./列联表与关联度量) — 关联强度计算
- [t检验](/Statistical-Know/2-统计推断/t检验) — 配对 t 检验（配对定量数据的对应方法）
