# R 与 SPSS 统计操作速查

## R 语言常用统计命令速查

### 基础统计分析

#### 描述统计

```r
# 定量描述
mean(x, na.rm = TRUE)
sd(x)
median(x)
quantile(x, probs = c(0.25, 0.5, 0.75))
summary(x)

# 定性描述
table(x)
prop.table(table(x))
```

#### t 检验

```r
# 单样本 t 检验
t.test(x, mu = 0)

# 两独立样本 t 检验
t.test(x ~ group, data = df, var.equal = TRUE)    # 等方差
t.test(x ~ group, data = df, var.equal = FALSE)   # Welch 校正

# 配对 t 检验
t.test(before, after, paired = TRUE)
```

#### 方差分析

```r
# 单因素 ANOVA
fit <- aov(y ~ group, data = df)
summary(fit)

# 两因素 ANOVA（含交互项）
fit <- aov(y ~ A * B, data = df)
summary(fit)

# 重复测量 ANOVA
fit <- aov(y ~ time + Error(subject/time), data = df)
summary(fit)

# 事后多重比较 (Tukey HSD)
TukeyHSD(fit)
```

#### 回归分析

```r
# 线性回归
lm(y ~ x1 + x2, data = df)
summary(lm_fit)

# Logistic 回归
glm(y ~ x1 + x2, data = df, family = binomial)
summary(glm_fit)

# 逐步回归
step(lm_fit)
```

### 生存分析 (survival 包)

```r
library(survival)
library(survminer)

# 创建生存对象
# Surv(时间, 事件指示)
surv_obj <- Surv(time, event)

# Kaplan-Meier 估计
km_fit <- survfit(surv_obj ~ group, data = df)
summary(km_fit)

# 绘制 KM 曲线
ggsurvplot(km_fit, data = df,
           pval = TRUE,             # 显示 Log-rank p 值
           conf.int = TRUE,         # 置信区间
           risk.table = TRUE,       # 风险表
           xlab = "生存时间",
           ylab = "生存概率")

# Log-rank 检验
survdiff(surv_obj ~ group, data = df)

# Cox 比例风险模型
cox_fit <- coxph(surv_obj ~ age + sex + treatment, data = df)
summary(cox_fit)

# 比例风险假设检验
cox.zph(cox_fit)
```

---

## SPSS 操作要点

### 数据导入

- **File → Open → Data**：支持 .sav, .xlsx, .csv 格式
- **Variable View**：定义变量名、类型、值标签（如 1=男, 2=女）
- **Data View**：录入或粘贴数据

### 常用分析路径

#### 描述统计

```
Analyze → Descriptive Statistics → Frequencies / Descriptives / Explore
```
- Frequencies：频数表、柱状图
- Descriptives：均数、标准差、最小值、最大值
- Explore：正态性检验（Shapiro-Wilk）、箱线图

#### t 检验

| 类型 | 菜单路径 |
|------|---------|
| 单样本 t 检验 | Analyze → Compare Means → One-Sample T Test |
| 独立样本 t 检验 | Analyze → Compare Means → Independent-Samples T Test |
| 配对 t 检验 | Analyze → Compare Means → Paired-Samples T Test |

#### 方差分析

```
Analyze → General Linear Model → Univariate
```
- **Dependent Variable**：响应变量
- **Fixed Factor(s)**：分类自变量
- **Post Hoc**：事后多重比较（LSD, Tukey, Bonferroni）
- **Options**：描述统计、方差齐性检验

#### 卡方检验

```
Analyze → Descriptive Statistics → Crosstabs
  → Statistics → Chi-square
```

#### 回归分析

```
Analyze → Regression → Linear / Binary Logistic
```

- **Linear**：连续因变量的线性回归
- **Binary Logistic**：二分类因变量的 Logistic 回归
- **Cox Regression**：生存分析的 Cox 模型

#### 生存分析

```
Analyze → Survival → Kaplan-Meier / Cox Regression
```

- **Kaplan-Meier**：Time 填入生存时间，Status 填入事件指示（需 Define Event）
- **Cox Regression**：Time 和 Status 设置与 KM 相同，Covariates 填入协变量

### 输出解读要点

| SPSS 输出表 | 核心内容 |
|------------|---------|
| **Descriptive Statistics** | 均数、标准差、样本量 |
| **Independent Samples Test** | Levene 方差齐性检验 + t 检验结果 |
| **ANOVA** | 组间/组内 SS、F 值、p 值 |
| **Tests of Between-Subjects Effects** | 多因素 ANOVA 的 Type III SS |
| **Variables in the Equation** | Logistic 回归的 B、Exp(B) |
| **Omnibus Tests of Model Coefficients** | 模型整体显著性 |
| **Survival Table** | KM 生存表 |
| **Categorical Variable Codings** | Cox 模型分类变量的编码方式 |

---

## 两种软件对比

| 对比项 | R | SPSS |
|--------|---|------|
| **价格** | 免费 | 商业授权（昂贵） |
| **操作方式** | 命令行/脚本 | 菜单界面为主 + 语法 |
| **图形质量** | 高度可定制 (ggplot2) | 基础图形，较简便 |
| **可重复性** | 脚本完全可重复 | 需保存 .sps 语法 |
| **方法覆盖** | 最全面（CRAN 数万包） | 基础统计方法 |
| **学习曲线** | 陡峭 | 平缓 |
| **大样本处理** | 依赖内存 | 较优 |
| **社区支持** | 活跃且开放 | 官方文档为主 |
| **医学论文认可** | 逐渐普及 | 传统常用 |

**选择建议：** 若追求可重复性和前沿方法，选 R；若追求快速出结果和图形化操作，选 SPSS。

> **要点总结：** R 适合深度统计分析、可重复研究和自定义可视化，SPSS 适合快速标准分析和医学论文的传统流程。两者并不互斥——许多研究者用 SPSS 做基础分析，用 R 做高级建模和绘图。
