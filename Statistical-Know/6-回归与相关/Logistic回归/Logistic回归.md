# Logistic 回归

当因变量为二分类变量（如患病/未患病、有效/无效）时，线性回归不再适用。Logistic 回归是处理二分类结局最常用的回归模型。

## Sigmoid 函数与 Logit 变换

### 从概率到 Logit

线性回归中 $y$ 的取值范围是 $(-\infty, +\infty)$，而概率 $p$ 的取值范围是 $[0, 1]$。Logistic 回归通过 **Sigmoid 函数**将线性组合映射到 $(0, 1)$：

$$
p = P(Y=1|X) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p)}} = \frac{e^{\beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p}}{1 + e^{\beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p}}
$$

**Logit 变换**将概率转换回线性形式：

$$
\text{logit}(p) = \ln\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p
$$

其中 $\frac{p}{1-p}$ 称为 **Odds（优势比）**。

## OR（Odds Ratio）的解释

### 核心概念

$$
OR_j = e^{\beta_j}
$$

- $OR_j > 1$：$x_j$ 增加，结局概率 **增加**
- $OR_j < 1$：$x_j$ 增加，结局概率 **减少**
- $OR_j = 1$：$x_j$ 与结局 **无关**

**连续变量**：$x_j$ 每增加 1 个单位，结局的 Odds 变为原来的 $e^{\beta_j}$ 倍。

**二分类变量**：暴露组的 Odds 是非暴露组的 $e^{\beta_j}$ 倍。

## Python 实现

```python
import statsmodels.api as sm
import pandas as pd
import numpy as np

# 模拟数据：冠心病 ~ 年龄 + 胆固醇 + 吸烟
np.random.seed(42)
n = 200
age = np.random.normal(55, 10, n)
cholesterol = np.random.normal(220, 40, n)
smoking = np.random.binomial(1, 0.35, n)

logit = -5 + 0.05*age + 0.008*cholesterol + 0.8*smoking
p = 1 / (1 + np.exp(-logit))
chd = np.random.binomial(1, p, n)  # 冠心病（1=是, 0=否）

data = pd.DataFrame({
    'CHD': chd,
    'AGE': age,
    'CHOL': cholesterol,
    'SMOKE': smoking
})

# 拟合 Logistic 回归
X = data[['AGE', 'CHOL', 'SMOKE']]
X = sm.add_constant(X)
model = sm.Logit(data['CHD'], X).fit()

print(model.summary())
```

### 结果解读

```
                 coef    std err      z      P>|z|    [0.025   0.975]
const         -5.1234    1.245    -4.11    0.000   -7.563   -2.684
AGE            0.0521    0.018     2.89    0.004    0.017    0.087
CHOL           0.0075    0.004     1.88    0.060   -0.000    0.015
SMOKE          0.7654    0.352     2.17    0.030    0.075    1.456
```

```python
# OR 及其 95% CI
odds_ratios = pd.DataFrame({
    'OR': np.exp(model.params),
    'OR Lower CI': np.exp(model.conf_int()[0]),
    'OR Upper CI': np.exp(model.conf_int()[1])
})
print(odds_ratios)

# 预测概率
data['pred_prob'] = model.predict(X)
print(data[['CHD', 'pred_prob']].head(10))
```

## 模型评价：ROC 与 AUC

### 混淆矩阵

| | 预测阳性 | 预测阴性 |
|---|---------|---------|
| 实际阳性 | TP | FN |
| 实际阴性 | FP | TN |

### ROC 曲线

ROC（Receiver Operating Characteristic）曲线以**假阳性率**（1-特异度）为横轴，**真阳性率**（灵敏度）为纵轴，反映不同截断值下模型的分类性能。

### AUC

AUC（Area Under the Curve）是 ROC 曲线下的面积，衡量模型的**整体判别能力**：

| AUC | 判别能力 |
|-----|---------|
| 0.50 | 无判别能力（等同随机） |
| 0.70 – 0.80 | 可接受 |
| 0.80 – 0.90 | 优秀 |
| 0.90 – 1.00 | 杰出 |

```python
from sklearn.metrics import roc_curve, roc_auc_score
import matplotlib.pyplot as plt

# 计算 ROC
fpr, tpr, thresholds = roc_curve(data['CHD'], data['pred_prob'])
auc = roc_auc_score(data['CHD'], data['pred_prob'])

# 绘图
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC curve (AUC = {auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='随机分类器')
plt.xlabel('假阳性率 (1 - 特异度)')
plt.ylabel('真阳性率 (灵敏度)')
plt.title('ROC 曲线')
plt.legend()
plt.grid(alpha=0.3)
plt.show()

print(f"AUC = {auc:.3f}")

# 寻找最佳截断值（Youden index）
youden = tpr - fpr
best_idx = np.argmax(youden)
best_threshold = thresholds[best_idx]
print(f"最佳截断值 = {best_threshold:.3f}")
print(f"灵敏度 = {tpr[best_idx]:.3f}, 特异度 = {1-fpr[best_idx]:.3f}")
```

## 模型假设与诊断

Logistic 回归相较于线性回归假设更宽松：

| 假设 | 说明 | 检验方法 |
|------|------|---------|
| 二元结局 | 因变量为二分类 | — |
| 观测独立 | 样本间独立 | — |
| 线性 Logit | 连续变量与 Logit 线性关系 | Box-Tidwell 检验 |
| 无强影响点 | 无极端值 | 标准化残差、Cook's D |
| 无多重共线性 | 自变量间不高度相关 | VIF |

```python
from statsmodels.stats.outliers_influence import variance_inflation_factor

# VIF 检查
X_vif = data[['AGE', 'CHOL', 'SMOKE']]
X_vif = sm.add_constant(X_vif)
vif_data = pd.DataFrame({
    'Variable': X_vif.columns,
    'VIF': [variance_inflation_factor(X_vif.values, i)
            for i in range(X_vif.shape[1])]
})
print(vif_data)
```

## 相关知识点

- [多元线性回归](../多元回归/多元线性回归) — 连续结局的回归模型
- [直线回归](../直线回归/直线回归) — 简单线性回归基础
- [卡方检验原理](/Statistical-Know/4-分类数据分析/卡方检验原理) — 分类变量的基本检验方法
