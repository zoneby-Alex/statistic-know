# 独立样本t检验

## 适用场景

比较**两个独立组**的均值是否存在统计学差异。

**典型应用：**
- 试验组 vs 对照组：新药降血压效果比较
- 男性 vs 女性：某项生化指标的性别差异
- 干预组 vs 空白组：教学方法的疗效评估

### 前提条件

| 条件 | 说明 | 检验方法 |
|------|------|----------|
| 独立性 | 两组观察值相互独立 | 研究设计保证 |
| 正态性 | 每组数据来自正态分布 | Shapiro-Wilk检验 |
| 方差齐性 | 两组总体方差相等 | **Levene检验** |

---

## Student t检验 vs Welch t检验

### Student t检验（方差齐性假设）

$$
t = \frac{\bar{x}_1 - \bar{x}_2}{s_p \sqrt{\frac{1}{n_1} + \frac{1}{n_2}}}
$$

合并标准差：

$$
s_p = \sqrt{\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}}
$$

自由度：$\nu = n_1 + n_2 - 2$

### Welch t检验（不假设方差齐性）

$$
t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}
$$

自由度（Satterthwaite近似）：

$$
\nu \approx \frac{\left( \frac{s_1^2}{n_1} + \frac{s_2^2}{n_2} \right)^2}{\frac{(s_1^2/n_1)^2}{n_1 - 1} + \frac{(s_2^2/n_2)^2}{n_2 - 1}}
$$

### 选择建议

| 情况 | 推荐方法 |
|------|----------|
| 方差齐性满足且样本量相等 | Student t / Welch t均可 |
| 方差齐性不满足 | **Welch t检验**（默认推荐） |
| 样本量相差较大 | Welch t检验（更稳健） |

现代统计实践中，**Welch t检验**已成为默认选择。

---

## 方差齐性检验（Levene检验）

Levene检验的假设：
- $H_0$：两组方差相等
- $H_1$：两组方差不相等

```python
import numpy as np
from scipy import stats

# 模拟两组数据
np.random.seed(42)
group1 = np.random.normal(loc=100, scale=10, size=30)  # 均值100，标准差10
group2 = np.random.normal(loc=110, scale=15, size=35)  # 均值110，标准差15

# Levene方差齐性检验
stat, p_levene = stats.levene(group1, group2)
print(f"Levene统计量: {stat:.4f}")
print(f"Levene检验p值: {p_levene:.4f}")

if p_levene > 0.05:
    print("方差齐性假设成立")
else:
    print("方差不齐，建议使用Welch t检验")
```

---

## Python代码示例

### 使用 scipy.stats.ttest_ind

```python
import numpy as np
from scipy import stats

# 示例：两种教学方法的效果比较
# 传统教学法 vs 新教学法的考试成绩
traditional = [78, 82, 85, 74, 79, 81, 76, 83, 77, 80]
new_method = [88, 92, 85, 90, 87, 91, 86, 89, 84, 93, 88, 90]

# 描述性统计
print("传统教学组:")
print(f"  n = {len(traditional)}, 均值 = {np.mean(traditional):.2f}, 标准差 = {np.std(traditional, ddof=1):.2f}")
print("新教学组:")
print(f"  n = {len(new_method)}, 均值 = {np.mean(new_method):.2f}, 标准差 = {np.std(new_method, ddof=1):.2f}")

# --- Student t检验（假设方差齐性） ---
t_student, p_student = stats.ttest_ind(traditional, new_method, equal_var=True)
print(f"\nStudent t检验:")
print(f"  t = {t_student:.4f}, df = {len(traditional) + len(new_method) - 2}, p = {p_student:.4f}")

# --- Welch t检验（不假设方差齐性，默认推荐） ---
t_welch, p_welch = stats.ttest_ind(traditional, new_method, equal_var=False)
print(f"\nWelch t检验（推荐）:")
print(f"  t = {t_welch:.4f}, df ≈ {stats.ttest_ind(traditional, new_method, equal_var=False, alternative='two-sided')}")

# 更准确获取Welch的自由度
result = stats.ttest_ind(traditional, new_method, equal_var=False)
# scipy >= 1.6 返回包含df的结果对象
if hasattr(result, 'df'):
    print(f"  df = {result.df:.2f}")
print(f"  p = {result.pvalue:.4f}")

# 统计推断
alpha = 0.05
if p_welch < alpha:
    print(f"\n结论：p={p_welch:.4f} < 0.05，两组教学效果存在统计学差异")
else:
    print(f"\n结论：p={p_welch:.4f} >= 0.05，两组教学效果无统计学差异")
```

### 完整的分析流程

```python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

def independent_ttest_full(x, y, alpha=0.05):
    """独立样本t检验完整分析流程"""
    
    # 1. 描述性统计
    def desc(name, data):
        print(f"{name}: n={len(data)}, M={np.mean(data):.2f}, SD={np.std(data, ddof=1):.2f}")
    desc("Group1", x)
    desc("Group2", y)
    
    # 2. 正态性检验
    _, p1 = stats.shapiro(x)
    _, p2 = stats.shapiro(y)
    print(f"\n正态性检验: Group1 p={p1:.4f}, Group2 p={p2:.4f}")
    if p1 > 0.05 and p2 > 0.05:
        print("两组均符合正态分布")
    else:
        print("警告：数据偏离正态分布")
    
    # 3. 方差齐性检验
    _, p_levene = stats.levene(x, y)
    print(f"方差齐性检验 (Levene): p={p_levene:.4f}")
    equal_var = p_levene > 0.05
    test_name = "Student t" if equal_var else "Welch t"
    print(f"使用 {test_name} 检验")
    
    # 4. t检验
    t_stat, p_value = stats.ttest_ind(x, y, equal_var=equal_var)
    print(f"\n{test_name}检验: t = {t_stat:.4f}, p = {p_value:.4f}")
    
    # 5. 置信区间
    n1, n2 = len(x), len(y)
    x1, x2 = np.mean(x), np.mean(y)
    s1, s2 = np.std(x, ddof=1), np.std(y, ddof=1)
    diff = x1 - x2
    if equal_var:
        sp = np.sqrt(((n1-1)*s1**2 + (n2-1)*s2**2) / (n1+n2-2))
        se = sp * np.sqrt(1/n1 + 1/n2)
        df = n1 + n2 - 2
    else:
        se = np.sqrt(s1**2/n1 + s2**2/n2)
        df_num = (s1**2/n1 + s2**2/n2)**2
        df_den = (s1**2/n1)**2/(n1-1) + (s2**2/n2)**2/(n2-1)
        df = df_num / df_den
    t_crit = stats.t.ppf(1 - alpha/2, df)
    ci = (diff - t_crit * se, diff + t_crit * se)
    print(f"均值差: {diff:.2f}, 95% CI: ({ci[0]:.2f}, {ci[1]:.2f})")
    
    # 6. 效应量 (Cohen's d)
    if equal_var:
        s_pooled = sp
    else:
        s_pooled = np.sqrt((s1**2 + s2**2) / 2)
    d = diff / s_pooled
    print(f"Cohen's d: {d:.3f}")
    if abs(d) < 0.2:
        d_label = "小"
    elif abs(d) < 0.5:
        d_label = "中"
    else:
        d_label = "大"
    print(f"效应量等级: {d_label}")
    
    return {
        't_stat': t_stat, 'p_value': p_value,
        'ci': ci, 'cohens_d': d, 'df': df
    }

# 运行分析
result = independent_ttest_full(traditional, new_method)
```

---

## 效应量 Cohen's d

### 计算公式

$$
d = \frac{\bar{x}_1 - \bar{x}_2}{s_{\text{pooled}}}
$$

其中 $s_{\text{pooled}}$ 为合并标准差。

### 解释标准

| d值 | 效应大小 | 百分位重叠 |
|-----|----------|-----------|
| 0.2 | 小 | 两组分布重叠约85% |
| 0.5 | 中 | 两组分布重叠约67% |
| 0.8 | 大 | 两组分布重叠约53% |

### 效应量与样本量的关系

```python
import numpy as np
from scipy import stats

# 不同样本量下，观察到显著差异所需的最小效应量
def min_effect_for_significance(n_per_group, alpha=0.05):
    """给定样本量，计算能达到显著的最小Cohen's d"""
    df = 2 * n_per_group - 2
    t_crit = stats.t.ppf(1 - alpha/2, df)
    return t_crit * np.sqrt(2 / n_per_group)

for n in [10, 20, 30, 50, 100, 500]:
    d_min = min_effect_for_significance(n)
    print(f"n={n}: 最小显著效应量 d={d_min:.3f}")

# 大样本下，微小效应也能达到显著，务必报告效应量！
```

---

## 结果报告模板

### 中文报告

> 采用独立样本t检验比较两种教学方法的效果。Levene检验提示两组方差齐（$F = 0.12, p = 0.732$）。传统教学组（$n=10$）成绩为 $79.50 \pm 3.34$，新教学组（$n=12$）成绩为 $88.58 \pm 2.91$，新教学法成绩显著高于传统教学法（$t(20) = -6.82, p < 0.001$，95\% CI: $[-11.78, -6.38]$，Cohen's $d = -2.92$）。

### 英文报告

> An independent-samples t-test was conducted to compare exam scores between the traditional teaching group ($M = 79.50$, $SD = 3.34$) and the new method group ($M = 88.58$, $SD = 2.91$). Levene's test indicated equal variances ($F = 0.12$, $p = .732$). There was a statistically significant difference, $t(20) = -6.82$, $p < .001$, 95\% CI [$-$11.78, $-$6.38$], $d = -2.92$.

---

## 关键点总结

1. **Welch t检验是默认推荐**，不需要先做方差齐性检验来决定
2. 大样本下即使微小差异也会显著，**必须报告效应量**
3. 两组样本量相差悬殊时，Welch t检验更稳健
4. 效应量Cohen's d**不受样本量影响**，是衡量实际意义的重要指标

---

## 相关知识点

- [单样本t检验](./单样本t检验) —— t检验的基础形式
- [配对t检验](./配对t检验) —— 与非配对设计的对比
- [样本量估算](/2-统计推断/参数估计/样本量估算) —— 独立t检验的样本量计算
- [单因素方差分析](/3-方差分析/单因素方差分析) —— 三组及以上比较的扩展

::: tip 快速记忆
独立t检验：两组独立数据比较均值差异

Student t = 等方差假设
Welch t = 不等方差（默认推荐）

报告必备：t, df, p, 95%CI, Cohen's d
:::
