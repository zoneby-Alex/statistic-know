# Python 统计生态

Python 拥有完整、高效的统计计算与建模生态。三大核心库覆盖从基础检验到高级建模的全流程。

## SciPy.stats

`scipy.stats` 提供大量概率分布和统计检验函数，是日常统计分析的首选。

### 常用检验速查

```python
import numpy as np
from scipy import stats

np.random.seed(42)

# === t 检验 ===
group1 = np.random.normal(100, 15, 30)
group2 = np.random.normal(110, 15, 30)

# 单样本 t 检验
t_stat, p_val = stats.ttest_1samp(group1, 100)
print(f"单样本 t: t={t_stat:.3f}, p={p_val:.4f}")

# 独立样本 t 检验
t_stat, p_val = stats.ttest_ind(group1, group2, equal_var=True)
print(f"独立 t:   t={t_stat:.3f}, p={p_val:.4f}")

# 配对 t 检验
t_stat, p_val = stats.ttest_rel(group1, group2)
print(f"配对 t:   t={t_stat:.3f}, p={p_val:.4f}")

# Welch t 检验（不假设方差齐）
t_stat, p_val = stats.ttest_ind(group1, group2, equal_var=False)
print(f"Welch t:  t={t_stat:.3f}, p={p_val:.4f}")
```

### 单因素 ANOVA

```python
group3 = np.random.normal(105, 15, 30)
f_stat, p_val = stats.f_oneway(group1, group2, group3)
print(f"ANOVA: F={f_stat:.3f}, p={p_val:.4f}")
```

### 卡方检验

```python
from scipy.stats import chi2_contingency

obs = np.array([[45, 15],
                [30, 30]])
chi2, p, dof, expected = chi2_contingency(obs, correction=True)
print(f"卡方: χ²={chi2:.3f}, p={p:.4f}, df={dof}")
```

### 非参数检验

```python
from scipy.stats import (
    wilcoxon, mannwhitneyu, kruskal,
    friedmanchisquare, spearmanr, pearsonr
)

# Wilcoxon 符号秩（配对）
stat, p = wilcoxon(group1, group2)
print(f"Wilcoxon: W={stat}, p={p:.4f}")

# Mann-Whitney U（独立）
stat, p = mannwhitneyu(group1, group2, alternative='two-sided')
print(f"Mann-Whitney: U={stat}, p={p:.4f}")

# Kruskal-Wallis（多独立组）
stat, p = kruskal(group1, group2, group3)
print(f"Kruskal-Wallis: H={stat:.3f}, p={p:.4f}")

# 相关系数
r, p = pearsonr(group1, group2)
r_s, p_s = spearmanr(group1, group2)
print(f"Pearson r={r:.3f}, Spearman r_s={r_s:.3f}")
```

## Statsmodels

`statsmodels` 提供专业的回归模型、方差分析和时间序列分析，输出完整的统计推断结果。

### 线性回归（OLS）

```python
import statsmodels.api as sm
import pandas as pd

# 准备数据
x = np.random.normal(50, 10, 100)
y = 2.5 + 1.2 * x + np.random.normal(0, 5, 100)
X = sm.add_constant(x)
model = sm.OLS(y, X).fit()
print(model.summary())  # 包含 R²、F 检验、系数表
```

### Logistic 回归

```python
x1 = np.random.normal(55, 10, 200)
x2 = np.random.normal(25, 4, 200)
logit = -3 + 0.06*x1 + 0.10*x2
p = 1/(1+np.exp(-logit))
y_bin = np.random.binomial(1, p, 200)

X_logit = sm.add_constant(np.column_stack([x1, x2]))
logit_model = sm.Logit(y_bin, X_logit).fit()
print(logit_model.summary())
print(f"OR: {np.exp(logit_model.params)}")
```

### 方差分析

```python
# 使用 OLS + 分类变量进行 ANOVA
import statsmodels.formula.api as smf

df = pd.DataFrame({
    'value': np.concatenate([group1, group2, group3]),
    'group': ['A']*30 + ['B']*30 + ['C']*30
})

anova_model = smf.ols('value ~ C(group)', data=df).fit()
anova_table = sm.stats.anova_lm(anova_model, typ=2)
print(anova_table)
```

## Lifelines

`lifelines` 是生存分析专用库，提供 Kaplan-Meier 曲线和 Cox 比例风险模型。

```python
# pip install lifelines
from lifelines import KaplanMeierFitter, CoxPHFitter
import pandas as pd
import numpy as np

# === Kaplan-Meier 生存曲线 ===
# 模拟生存数据
T = np.random.exponential(10, 100)
E = np.random.binomial(1, 0.7, 100)

kmf = KaplanMeierFitter()
kmf.fit(durations=T, event_observed=E)

# 打印生存概率
print(kmf.survival_function_.head())

# 绘制曲线
# kmf.plot_survival_function()

# === Cox 比例风险模型 ===
n = 200
df_surv = pd.DataFrame({
    'duration': np.random.exponential(15, n),
    'event': np.random.binomial(1, 0.6, n),
    'age': np.random.normal(55, 10, n),
    'treatment': np.random.binomial(1, 0.5, n)
})

cph = CoxPHFitter()
cph.fit(df_surv, duration_col='duration', event_col='event')
print(cph.summary)
```

## 代码速查表

### 按分析目的索引

| 分析目的 | 函数 | 所属库 |
|---------|------|--------|
| 单样本均值比较 | `ttest_1samp` | SciPy |
| 两独立样本（参数） | `ttest_ind` | SciPy |
| 两独立样本（非参数） | `mannwhitneyu` | SciPy |
| 配对样本（参数） | `ttest_rel` | SciPy |
| 配对样本（非参数） | `wilcoxon` | SciPy |
| 多组比较（参数） | `f_oneway` | SciPy |
| 多组比较（非参数） | `kruskal` / `friedmanchisquare` | SciPy |
| 分类变量关联 | `chi2_contingency` | SciPy |
| 小样本四格表 | `fisher_exact` | SciPy |
| 配对分类数据 | `mcnemar` | SciPy |
| 线性回归 | `OLS.fit()` | Statsmodels |
| Logistic 回归 | `Logit.fit()` | Statsmodels |
| ANOVA 表 | `anova_lm` | Statsmodels |
| 重复测量 ANOVA | `AnovaRM` | Statsmodels |
| 生存分析 | `KaplanMeierFitter` / `CoxPHFitter` | Lifelines |

### 安装指令

```bash
pip install scipy statsmodels pandas numpy
pip install lifelines       # 生存分析
pip install scikit-learn    # ROC/AUC
pip install scikit-posthocs # 事后两两比较
```

## 相关知识点

- 各检验方法的原理详情请参阅具体知识卡片
- [路线导览](/Statistical-Know/0-路线导览/) — 学习路径参考
- [知识图谱](/Statistical-Know/知识图谱) — 知识点全局关联
