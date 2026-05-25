# 配对t检验

## 适用场景

比较**同一组对象**在两个不同条件下的测量值，或配对对象的测量值。

### 常见设计类型

| 设计类型 | 示例 |
|----------|------|
| 自身前后对照 | 同一患者治疗前后的血压 |
| 配对设计 | 年龄、性别匹配的一对患者，分别接受不同治疗 |
| 同源配对 | 同一标本的两个不同检测方法 |
| 交叉设计 | 同一对象先后接受两种处理（中间有洗脱期） |

### 与独立t检验的关键区别

| 特征 | 配对t检验 | 独立t检验 |
|------|-----------|-----------|
| 数据关系 | 成对数据，存在关联 | 两组独立 |
| 自由度 | $n_{\text{对}} - 1$ | $n_1 + n_2 - 2$ |
| 核心思想 | 对差值做单样本t检验 | 直接比较两组均值 |
| 统计功效 | 更高（控制了个体差异） | 相对较低 |

---

## 原理：转化为差值的单样本t检验

配对t检验实质上是将配对数据转化为**差值** $d_i$，然后对差值做单样本t检验（检验差值均值是否为零）。

### 差值计算

$$
d_i = x_{i,\text{after}} - x_{i,\text{before}} \quad \text{或} \quad d_i = x_{i,\text{组1}} - x_{i,\text{组2}}
$$

### 检验统计量

$$
t = \frac{\bar{d} - 0}{s_d / \sqrt{n}}
$$

其中：
- $\bar{d}$：差值的均值
- $s_d$：差值的标准差
- $n$：配对数

自由度：$\nu = n - 1$

### 置信区间

$$
\bar{d} \pm t_{\alpha/2,\; n-1} \cdot \frac{s_d}{\sqrt{n}}
$$

### 效应量

$$
d_z = \frac{\bar{d}}{s_d}
$$

---

## Python代码示例

### 使用 scipy.stats.ttest_rel

```python
import numpy as np
from scipy import stats

# 示例：某降压药的疗效评估（治疗前后血压）
np.random.seed(42)

# 模拟治疗前血压（mmHg）
before = np.random.normal(loc=145, scale=10, size=20)
# 模拟治疗后血压：比治疗前平均降低12mmHg，有个体变异
after = before - np.random.normal(loc=12, scale=5, size=20)

# 配对t检验
t_stat, p_value = stats.ttest_rel(before, after)
print(f"配对t检验结果:")
print(f"  t统计量: {t_stat:.4f}")
print(f"  p值: {p_value:.6f}")

# 描述性统计
diff = before - after
print(f"\n治疗前血压: {np.mean(before):.1f} ± {np.std(before, ddof=1):.1f} mmHg")
print(f"治疗后血压: {np.mean(after):.1f} ± {np.std(after, ddof=1):.1f} mmHg")
print(f"差值（降低值）: {np.mean(diff):.1f} ± {np.std(diff, ddof=1):.1f} mmHg")

# 差值的置信区间
n = len(diff)
d_mean = np.mean(diff)
d_se = np.std(diff, ddof=1) / np.sqrt(n)
t_crit = stats.t.ppf(0.975, df=n-1)
ci = (d_mean - t_crit * d_se, d_mean + t_crit * d_se)
print(f"差值95%置信区间: ({ci[0]:.1f}, {ci[1]:.1f})")

# 效应量
d_z = d_mean / np.std(diff, ddof=1)
print(f"效应量 d_z: {d_z:.3f}")

# 统计推断
if p_value < 0.05:
    print(f"\n结论：p={p_value:.6f} < 0.05")
    print(f"治疗后血压显著降低，平均降低 {d_mean:.1f} mmHg")
else:
    print(f"\n结论：p={p_value:.6f} >= 0.05")
    print(f"治疗前后血压差异无统计学意义")
```

### 手动验证：与单样本t检验等价

```python
# 配对t检验 = 差值的单样本t检验
t_paired, p_paired = stats.ttest_rel(before, after)

# 对差值做单样本t检验
t_diff, p_diff = stats.ttest_1samp(diff, popmean=0)

print(f"配对t检验: t = {t_paired:.6f}, p = {p_paired:.6f}")
print(f"差值单样本t: t = {t_diff:.6f}, p = {p_diff:.6f}")
print(f"两者完全等价: {np.isclose(t_paired, t_diff)}")
# 输出: True
```

### 配对t检验 vs 独立t检验

```python
# 同样的数据，如果错误地当作独立样本来分析
t_wrong, p_wrong = stats.ttest_ind(before, after)

print(f"正确（配对t检验）: t = {t_stat:.4f}, p = {p_stat:.6f}")
print(f"错误（独立t检验）: t = {t_wrong:.4f}, p = {p_wrong:.6f}")
print(f"\n配对设计的统计功效更高（p值更小）")

# 模拟验证：配对设计如何控制个体差异
print("\n个体差异对结果的影响:")
for i in range(5):
    print(f"  患者{i+1}: 治疗前 {before[i]:.0f} → 治疗后 {after[i]:.0f}, 差值 {diff[i]:+.0f}")
```

---

## 配对t检验的适用条件

### 必要条件

1. **配对关系明确**：每对数据之间存在自然的关联
2. **差值近似正态分布**：对差值的正态性要求（而非原始数据）
3. **差的独立性**：不同对之间的差值相互独立

### 差值正态性检验

```python
from scipy import stats
import matplotlib.pyplot as plt

# 对差值做正态性检验
shapiro_stat, shapiro_p = stats.shapiro(diff)
print(f"差值正态性检验 (Shapiro-Wilk): W = {shapiro_stat:.4f}, p = {shapiro_p:.4f}")

# QQ图
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# 直方图
axes[0].hist(diff, bins=10, edgecolor='black', alpha=0.7)
axes[0].axvline(x=0, color='red', linestyle='--', label='H0: μ_d=0')
axes[0].axvline(x=np.mean(diff), color='blue', linestyle='-', label=f'均值={np.mean(diff):.1f}')
axes[0].set_xlabel('差值 (mmHg)')
axes[0].set_ylabel('频数')
axes[0].set_title('治疗前后差值的分布')
axes[0].legend()

# QQ图
stats.probplot(diff, dist="norm", plot=axes[1])
axes[1].set_title('差值QQ图（正态性检验）')

plt.tight_layout()
plt.show()
```

### 不适应的情况

```python
# 如果差值严重偏离正态分布，应使用非参数替代方法
# Wilcoxon符号秩检验（配对数据的非参数检验）
from scipy import stats

wilcoxon_stat, wilcoxon_p = stats.wilcoxon(before, after)
print(f"Wilcoxon符号秩检验: statistic = {wilcoxon_stat}, p = {wilcoxon_p:.6f}")
```

---

## 结果报告模板

### 中文报告

> 采用配对t检验比较20例高血压患者治疗前后的收缩压变化。治疗后收缩压（$128.4 \pm 12.5$ mmHg）较治疗前（$143.6 \pm 10.7$ mmHg）平均降低 $15.2$ mmHg（95\% CI: $10.3$ ~ $20.1$ mmHg），差异有统计学意义（$t(19) = 6.45, p < 0.001$，Cohen's $d_z = 1.44$）。

### 英文报告

> A paired-samples t-test was conducted to compare systolic blood pressure before ($M = 143.6$, $SD = 10.7$) and after treatment ($M = 128.4$, $SD = 12.5$). There was a statistically significant mean decrease of $15.2$ mmHg, 95\% CI [$10.3$, $20.1$], $t(19) = 6.45$, $p < .001$, $d_z = 1.44$.

---

## 关键点总结

1. 配对t检验的核心是**计算差值并对差值做单样本t检验**
2. 配对设计通过**控制个体差异**提高统计功效（同一对象自身对照）
3. 检验的是**差值的正态性**，不是原始数据的正态性
4. 如果错误使用独立t检验分析配对数据，会**损失统计功效**
5. 效应量 $d_z$ 是基于差值的标准差计算

---

## 相关知识点

- [单样本t检验](./单样本t检验) —— 配对t检验等价于差值的单样本t检验
- [独立样本t检验](./独立样本t检验) —— 与配对设计的对比
- [重复测量方差分析](/3-方差分析/重复测量方差分析) —— 两个以上时间点的配对设计扩展
- [假设检验框架](/2-统计推断/假设检验/假设检验框架) —— 假设检验的基本逻辑

::: tip 应用要点
配对t检验 = 消除个体差异后的精确比较

记住三步：
1. 计算每对差值 $d_i$
2. 求差值的均值 $\bar{d}$
3. 检验 $\bar{d}$ 是否等于0
:::
