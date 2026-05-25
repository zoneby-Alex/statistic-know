# Cox 比例风险模型

## 模型定义

Cox 比例风险模型 (Cox Proportional Hazards Model) 是生存分析中最常用的多因素回归模型。它在不指定基线风险函数 $h_0(t)$ 形式的前提下，估计协变量对风险函数的乘性效应——因此被称为**半参数模型**。

**模型公式：**

$$h(t|X) = h_0(t) \exp(\beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p)$$

其中 $h(t|X)$ 是在协变量 $X$ 条件下的风险函数，$h_0(t)$ 是基线风险函数（所有协变量为 0 时的风险），$\beta$ 是回归系数。

### 两侧取对数后的线性形式：

$$\ln \left[ \frac{h(t|X)}{h_0(t)} \right] = \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p$$

---

## 风险比 (Hazard Ratio, HR) 的解释

HR 是 Cox 模型中最重要的效应度量，表示某因素不同水平间风险的比值。

$$\text{HR} = \frac{h(t|X_1 = x+1, \text{其余不变})}{h(t|X_1 = x, \text{其余不变})} = \exp(\beta_1)$$

| HR 值 | 含义 | 举例 |
|-------|------|------|
| HR = 1 | 该因素对风险无影响 | 性别 HR=1，男女死亡风险相同 |
| HR > 1 | **危险因素**，增加风险 | 吸烟 HR=2.5，吸烟者死亡风险是不吸烟者的 2.5 倍 |
| HR < 1 | **保护因素**，降低风险 | 治疗 HR=0.4，治疗组风险降低 60% |

**注意：** HR 是**相对风险**的度量，不是绝对风险。HR=2 不表示风险翻倍后一定发生事件，而是表示风险率翻倍。

---

## 比例风险假设 (Proportional Hazards Assumption)

这是 Cox 模型的核心假设：**协变量的效应不随时间改变**。

$$\frac{h(t|X_1 = x+1)}{h(t|X_1 = x)} = \exp(\beta_1), \quad \forall t$$

也就是说，任意时刻两组风险函数之比为常数。

### 检验方法

**方法一：残差图法 (Schoenfeld Residuals)**

```python
from lifelines import CoxPHFitter
from lifelines.datasets import load_rossi

# 加载经典数据集
rossi = load_rossi()

# 拟合 Cox 模型
cph = CoxPHFitter()
cph.fit(rossi, duration_col='week', event_col='arrest')
cph.print_summary()

# 比例风险假设检验
# 若 p < 0.05，说明该变量可能违反比例风险假设
cph.check_assumptions(rossi, p_value_threshold=0.05)
```

**方法二：观察 KM 曲线是否交叉**

若两条 KM 曲线交叉，强烈提示违反比例风险假设。

### 违反假设的处理

- 加入时间交互项：$\beta X + \gamma (X \times \log t)$
- 分层 Cox 模型 (Stratified Cox Model)
- 使用时依协变量 (Time-dependent covariate)

---

## Python 完整示例

```python
import pandas as pd
import numpy as np
from lifelines import CoxPHFitter
import matplotlib.pyplot as plt

# 生成模拟数据
np.random.seed(42)
n = 200

df = pd.DataFrame({
    'time': np.random.exponential(30, n),
    'event': np.random.binomial(1, 0.7, n),
    'age': np.random.normal(55, 12, n),
    'treatment': np.random.choice([0, 1], n),
    'biomarker': np.random.normal(100, 20, n)
})

# 拟合 Cox 模型
cph = CoxPHFitter()
cph.fit(df, duration_col='time', event_col='event',
        formula='age + treatment + biomarker')
cph.print_summary()

# 可视化回归系数
cph.plot()
plt.show()

# HR 和 95% CI
hr_ci = np.exp(cph.confidence_intervals_)
hr_ci.columns = ['HR 下限', 'HR 上限']
hr_ci['HR'] = np.exp(cph.hazards_.T)
print(hr_ci)
```

### 输出解读要点

| 字段 | 含义 |
|------|------|
| `coef` | 回归系数 $\beta$ |
| `exp(coef)` | 风险比 HR |
| `se(coef)` | 回归系数标准误 |
| `z` | Wald 统计量 = coef / se |
| `p` | 显著性检验 p 值 |
| `exp(coef) lower 95%` | HR 的 95% 置信区间下限 |
| `exp(coef) upper 95%` | HR 的 95% 置信区间上限 |
| `Concordance` | C-index，模型区分度 |

---

## 模型适用条件总结

1. **比例风险假设**——最重要的前提条件
2. **非信息性删失**——删失与事件独立
3. **对数线性**——连续变量与 $\ln(HR)$ 呈线性关系
4. **无强共线性**——协变量间不存在高度相关

> **要点总结：** Cox 模型是生存分析多因素分析的支柱。核心概念是风险比 (HR) 和比例风险假设。使用 `lifelines` 库可以快速完成拟合、检验和可视化。分析报告时必须包含 HR 及其 95% 置信区间。
