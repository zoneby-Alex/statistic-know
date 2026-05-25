# Kaplan-Meier 曲线与 Log-rank 检验

## Kaplan-Meier 乘积限估计

### 原理

Kaplan-Meier (KM) 估计是生存函数的非参数估计方法。其核心思想是在每个事件发生的时间点，重新估计存活到该时刻的条件概率。

**KM 估计公式：**

$$\hat{S}(t) = \prod_{t_i \leq t} \left(1 - \frac{d_i}{n_i}\right)$$

其中 $t_i$ 为第 $i$ 个事件发生时间，$d_i$ 为第 $i$ 个时间点的事件数，$n_i$ 为第 $i$ 个时间点时的**风险集**（仍处于随访中且未发生事件的人数）。

### 计算示例

```python
import numpy as np
import pandas as pd
from lifelines import KaplanMeierFitter
import matplotlib.pyplot as plt

# 示例生存数据
df = pd.DataFrame({
    'time': [5, 8, 10, 12, 15, 18, 20, 22, 25, 30],
    'event': [1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    'group': ['A']*5 + ['B']*5
})

# 拟合 KM 曲线
kmf = KaplanMeierFitter()
kmf.fit(df['time'], df['event'], label='全样本')

# 打印生存表
kmf.event_table
```

### 中位生存时间

KM 曲线的中位生存时间是 $S(t) = 0.5$ 时的最小生存时间，即 50% 的研究对象发生事件的时间点。它比均值更适合生存数据（因删失导致均值无法可靠估计）。

## KM 曲线的解读

**关键读图技巧：**

1. **阶梯下降**：每个台阶对应一个事件发生时间点
2. **竖线标记 (tick marks)**：表示删失观测的时间点
3. **置信区间**：通常用绿色/浅色阴影表示 $S(t)$ 的 95% 置信区间（常用 Greenwood 公式）
4. **中位生存时间**：$S(t)=0.5$ 对应的横坐标
5. **曲线分离**：不同组的 KM 曲线差异越大，组间差异越可能显著

```python
# 分组绘制 KM 曲线
import numpy as np
from lifelines import KaplanMeierFitter

# 生成两组模拟数据
np.random.seed(42)
# 对照组: 中位生存约 15
control_times = np.random.exponential(15, 50)
control_event = np.ones(50)
# 治疗组: 中位生存约 25
treat_times = np.random.exponential(25, 50)
treat_event = np.ones(50)

kmf_ctrl = KaplanMeierFitter()
kmf_treat = KaplanMeierFitter()

ax = plt.subplot(111)
kmf_ctrl.fit(control_times, control_event, label='对照组')
kmf_ctrl.plot_survival_function(ax=ax)
kmf_treat.fit(treat_times, treat_event, label='治疗组')
kmf_treat.plot_survival_function(ax=ax)

plt.title('KM 生存曲线比较')
plt.xlabel('生存时间')
plt.ylabel('生存概率 S(t)')
plt.ylim(0, 1)
plt.show()
```

---

## Log-rank 检验

### 原理

Log-rank 检验是比较两条或多条生存曲线的**标准方法**。它在每个事件时间点构造 $2 \times 2$ 列联表，比较各组的观察事件数与期望事件数，然后合并所有时间点的信息。

**检验统计量：**

$$\chi^2_{\text{logrank}} = \sum_{i=1}^{k} \frac{(O_i - E_i)^2}{E_i}$$

其中 $O_i$ 为第 $i$ 组的观察事件数，$E_i$ 为第 $i$ 组的期望事件数。在原假设（各组生存曲线相同）下，该统计量服从 $\chi^2(\text{组数}-1)$ 分布。

### Python 实现

```python
from lifelines import KaplanMeierFitter
from lifelines.statistics import logrank_test

# 合并两组数据
all_times = np.concatenate([control_times, treat_times])
all_events = np.concatenate([control_event, treat_event])
groups = np.array(['对照']*50 + ['治疗']*50)

# Log-rank 检验
results = logrank_test(
    all_times, all_events, groups,
    alpha=0.05
)
results.print_summary()

# 提取 p 值
print(f'Log-rank 检验 p 值: {results.p_value:.4f}')
```

### 检验结果解读

- $p < 0.05$：拒绝原假设，认为两组生存曲线存在统计学差异
- Log-rank 检验对各组的**远期差异**更敏感
- 若两条曲线交叉，Log-rank 检验可能不敏感（此时考虑 Peto 检验或 Wilcoxon 检验）

---

## 注意事项

| 要点 | 说明 |
|------|------|
| 非信息性删失 | KM 估计和 Log-rank 检验均假设删失与事件无关 |
| 样本量要求 | 每组至少需观察到 10 个事件 |
| 曲线交叉 | 曲线交叉时需谨慎解读 Log-rank 结果 |
| 风险表 | 建议在 KM 图下方标注各时间点的风险人数 |

> **要点总结：** KM 曲线是生存数据的可视化基础，Log-rank 检验是组间比较的标准工具。两者共同构成了生存分析的第一步——单因素分析。后续的多因素分析（Cox 模型）在此基础上展开。
