# 生物医学统计知识库

融合《医学统计学》第八版(李康、贺佳)与《生物统计学》第六版(李春喜、姜丽娜)的系统化知识库。

## 知识体系

| 模块 | 内容 |
|------|------|
| 路线导览 | 知识路线总览与教材对照 |
| 统计基础 | 概率论、抽样分布、正态分布、定量/定性数据描述 |
| 统计推断 | 参数估计、假设检验框架、t检验、样本量估算 |
| 方差分析 | 单因素/多因素/重复测量/协方差分析 |
| 分类数据分析 | 卡方检验、Fisher精确检验、McNemar检验 |
| 非参数检验 | 符号检验、Wilcoxon、Mann-Whitney、Kruskal-Wallis |
| 回归与相关 | 直线/多元/Logistic回归、通径分析 |
| 试验设计与生存分析 | CRD/RBD/拉丁方/析因设计、KM曲线、Cox模型 |
| 统计软件栈 | Python(SciPy/Statsmodels)、R(survival)、SPSS |
| 拓展资料 | 推荐课程、书籍、论文、软件资源 |

## 技术栈

- **框架**: [VitePress 1.6.x](https://vitepress.dev/) (Vue 3 驱动静态站点生成器)
- **数学公式**: markdown-it-mathjax3 (LaTeX 渲染)
- **代码**: Python (SciPy/Statsmodels/Lifelines) + R 示例
- **部署**: GitHub Pages (GitHub Actions 自动部署)

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览构建结果
npm run docs:preview
```

## 目录结构

```
statistic-know/
├── package.json
├── .github/workflows/deploy.yml   # CI/CD
└── Statistical-Know/              # 站点源码
    ├── index.md                   # 首页
    ├── 知识图谱.md                # 知识依赖图
    ├── .vitepress/                # VitePress配置
    ├── 0-路线导览/                # 知识路线总览
    ├── 1-统计基础/                # 概率论、描述统计
    ├── 2-统计推断/                # 参数估计、假设检验、t检验
    ├── 3-方差分析/                # ANOVA系列
    ├── 4-分类数据分析/            # 卡方检验系列
    ├── 5-非参数检验/              # 秩和检验系列
    ├── 6-回归与相关/              # 回归模型系列
    ├── 7-试验设计与生存分析/       # 试验设计、生存分析
    ├── 8-统计软件栈/              # Python/R/SPSS操作
    └── 9-拓展资料/                # 课程、书籍、论文
```

## 许可证

MIT
