# 单样本t检验

## 适用场景

将一组样本的均值与**已知的理论值或标准值**进行比较。

**典型应用：**
- 某地区成年男性的平均身高是否等于全国平均水平（170 cm）
- 新药治疗前后的差值是否等于0（与配对t检验关联）
- 一批产品的某项指标是否符合国家标准

### 前提条件

| 条件 | 检验方法 | 不符合时的替代 |
|------|----------|---------------|
| 数据来自正态分布 | Shapiro-Wilk检验或QQ图 | Wilcoxon符号秩检验 |
| 样本独立 | 研究设计保证 | — |
| 无显著异常值 | 箱线图、Grubbs检验 | 稳健统计方法 |

---

## 公式原理

### 检验统计量

$$
t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}
$$

其中：
- $\bar{x}$：样本均值
- $\mu_0$：已知总体均值（理论值）
- $s$：样本标准差
- $n$：样本量

自由度：$\nu = n - 1$

### 置信区间

$$
\bar{x} \pm t_{\alpha/2,\; n-1} \cdot \frac{s}{\sqrt{n}}
$$

### 效应量

$$
d = \frac{\bar{x} - \mu_0}{s}
$$

---

## Python代码示例

### 使用 scipy.stats.ttest_1samp

```python
import numpy as np
from scipy import stats

# 示例：某班级数学成绩是否不同于全国平均分75分
scores = [68, 72, 85, 76, 79, 81, 74, 70, 88, 73, 77, 69, 82, 76, 71]
mu_0 = 75

# 描述性统计
n = len(scores)
xbar = np.mean(scores)
s = np.std(scores, ddof=1)
se = s / np.sqrt(n)

print(f"样本量: n = {n}")
print(f"样本均值: {xbar:.2f}")
print(f"样本标准差: {s:.2f}")
print(f"标准误: {se:.3f}")

# 单样本t检验
t_stat, p_value = stats.ttest_1samp(scores, popmean=mu_0)
print(f"\nt统计量: {t_stat:.4f}")
print(f"p值: {p_value:.4f}")

# 手动验证公式
t_manual = (xbar - mu_0) / se
print(f"手动计算t值: {t_manual:.4f}")

# 置信区间
alpha = 0.05
t_crit = stats.t.ppf(1 - alpha / 2, df=n - 1)
ci = (xbar - t_crit * se, xbar + t_crit * se)
print(f"\n95%置信区间: ({ci[0]:.2f}, {ci[1]:.2f})")

# 效应量 Cohen's d
d = (xbar - mu_0) / s
print(f"Cohen's d: {d:.3f}")

# 统计推断
if p_value < alpha:
    print(f"\n结论：p={p_value:.4f} < 0.05，拒绝H0")
    print(f"该班级数学成绩与全国平均水平存在统计学差异")
else:
    print(f"\n结论：p={p_value:.4f} >= 0.05，不拒绝H0")
    print(f"尚无充分证据表明该班级数学成绩与全国平均水平存在差异")
```

### 假设检验七步法在代码中的体现

```python
import numpy as np
from scipy import stats

# 数据
data = np.array([68, 72, 85, 76, 79, 81, 74, 70, 88, 73, 77, 69, 82, 76, 71])

# 步骤1: 建立检验假设
# H0: μ = 75  vs  H1: μ ≠ 75

# 步骤2: 检验水准
alpha = 0.05

# 步骤3-4: 选择检验方法并计算统计量
t_stat, p_value = stats.ttest_1samp(data, popmean=75)

# 步骤5-6: 确定p值并做出推断
print(f"t({len(data)-1}) = {t_stat:.3f}, p = {p_value:.4f}")
print("差异有统计学意义" if p_value < alpha else "差异无统计学意义")
```

### 正态性检验

```python
from scipy import stats

# Shapiro-Wilk正态性检验
stat, p_norm = stats.shapiro(scores)
print(f"Shapiro-Wilk统计量: {stat:.4f}")
print(f"正态性检验p值: {p_norm:.4f}")

if p_norm > 0.05:
    print("数据符合正态分布假设")
else:
    print("数据不符合正态分布，建议使用Wilcoxon符号秩检验")

# QQ图辅助判断
import matplotlib.pyplot as plt
from scipy import stats as sp_stats

fig, ax = plt.subplots(figsize=(6, 6))
sp_stats.probplot(scores, dist="norm", plot=ax)
ax.set_title("QQ图：正态性检验")
ax.grid(True, alpha=0.3)
plt.show()
```

---

## 结果报告模板

### 中文报告模板

> 采用单样本t检验比较样本均值与已知总体均值 $\mu_0 = 75$。结果显示，样本均值 $\bar{x} = 76.07 \pm 5.53$（$n = 15$），与总体均值差异为 $1.07$（95\% CI: $72.87$ ~ $79.26$），差异无统计学意义（$t(14) = 0.75, p = 0.467$）。

### 英文报告模板

> A one-sample t-test was conducted to compare the sample mean ($M = 76.07$, $SD = 5.53$) to the population mean ($\mu_0 = 75$). The result showed no statistically significant difference, $t(14) = 0.75$, $p = .467$, 95\% CI [$72.87$, $79.26$], $d = 0.19$.

### APA格式要点

| 要素 | 格式 |
|------|------|
| 统计量 | $t(df)$ |
| p值 | 精确 p 值（如 p = .023），而非 p < .05 |
| 置信区间 | 95\% CI [下限, 上限] |
| 效应量 | Cohen's d |

---

## 关键点总结

1. 单样本t检验是**最基础**的参数检验方法，其他t检验和ANOVA都是其推广
2. t统计量的分母是**标准误**（$s/\sqrt{n}$），而非标准差
3. 当 $n$ 较大时（通常 $n \geq 30$），即使数据轻度偏态，t检验仍较稳健
4. 务必同时报告**效应量**，避免仅依赖p值

---

## 相关知识点

- [独立样本t检验](./独立样本t检验) —— 两组独立样本的比较
- [配对t检验](./配对t检验) —— 配对设计的差值比较
- [假设检验框架](/2-统计推断/假设检验/假设检验框架) —— 假设检验的通用流程
- [点估计与区间估计](/2-统计推断/参数估计/点估计与区间估计) —— 置信区间的构造

::: tip 快速记忆
单样本t检验 = （样本均值 - 理论值）/ 标准误

自由度 = 样本量 - 1
:::
