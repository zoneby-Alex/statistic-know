import { defineConfig } from 'vitepress'

const sidebar = {
  '/0-路线导览/': [
    { text: '路线导览总览', link: '/0-路线导览/' },
  ],
  '/1-统计基础/': [
    { text: '统计基础总览', link: '/1-统计基础/' },
    {
      text: '概率论',
      collapsed: false,
      items: [
        { text: '概率分布', link: '/1-统计基础/概率论/概率分布' },
        { text: '抽样分布', link: '/1-统计基础/概率论/抽样分布' },
        { text: '正态分布与应用', link: '/1-统计基础/概率论/正态分布与应用' },
      ]
    },
    {
      text: '定量数据描述',
      collapsed: true,
      items: [
        { text: '频数分布与直方图', link: '/1-统计基础/定量数据描述/频数分布与直方图' },
        { text: '集中趋势与离散程度', link: '/1-统计基础/定量数据描述/集中趋势与离散程度' },
        { text: '统计表与统计图', link: '/1-统计基础/定量数据描述/统计表与统计图' },
      ]
    },
    {
      text: '定性数据描述',
      collapsed: true,
      items: [
        { text: '率与构成比', link: '/1-统计基础/定性数据描述/率与构成比' },
        { text: '标准化法', link: '/1-统计基础/定性数据描述/标准化法' },
        { text: '常用统计指标', link: '/1-统计基础/定性数据描述/常用统计指标' },
      ]
    },
  ],
  '/2-统计推断/': [
    { text: '统计推断总览', link: '/2-统计推断/' },
    {
      text: '参数估计',
      collapsed: false,
      items: [
        { text: '点估计与区间估计', link: '/2-统计推断/参数估计/点估计与区间估计' },
        { text: '样本量估算', link: '/2-统计推断/参数估计/样本量估算' },
      ]
    },
    {
      text: '假设检验',
      collapsed: false,
      items: [
        { text: '假设检验框架', link: '/2-统计推断/假设检验/假设检验框架' },
      ]
    },
    {
      text: 't检验',
      collapsed: false,
      items: [
        { text: '单样本t检验', link: '/2-统计推断/t检验/单样本t检验' },
        { text: '独立样本t检验', link: '/2-统计推断/t检验/独立样本t检验' },
        { text: '配对t检验', link: '/2-统计推断/t检验/配对t检验' },
      ]
    },
  ],
  '/3-方差分析/': [
    { text: '方差分析总览', link: '/3-方差分析/' },
    { text: '单因素方差分析', link: '/3-方差分析/单因素方差分析' },
    { text: '多因素方差分析', link: '/3-方差分析/多因素方差分析' },
    { text: '重复测量方差分析', link: '/3-方差分析/重复测量方差分析' },
    { text: '协方差分析', link: '/3-方差分析/协方差分析' },
  ],
  '/4-分类数据分析/': [
    { text: '分类数据分析总览', link: '/4-分类数据分析/' },
    { text: '卡方检验原理', link: '/4-分类数据分析/卡方检验原理' },
    { text: 'Fisher与McNemar检验', link: '/4-分类数据分析/Fisher与McNemar检验' },
    { text: '列联表与关联度量', link: '/4-分类数据分析/列联表与关联度量' },
  ],
  '/5-非参数检验/': [
    { text: '非参数检验总览', link: '/5-非参数检验/' },
    { text: '符号检验与Wilcoxon', link: '/5-非参数检验/符号检验与Wilcoxon' },
    { text: 'Mann-Whitney检验', link: '/5-非参数检验/Mann-Whitney检验' },
    { text: 'Kruskal-Wallis与Friedman', link: '/5-非参数检验/Kruskal-Wallis与Friedman' },
  ],
  '/6-回归与相关/': [
    { text: '回归与相关总览', link: '/6-回归与相关/' },
    {
      text: '直线回归与相关',
      collapsed: false,
      items: [
        { text: '直线回归', link: '/6-回归与相关/直线回归/直线回归' },
        { text: '直线相关', link: '/6-回归与相关/直线回归/直线相关' },
      ]
    },
    { text: '多元线性回归', link: '/6-回归与相关/多元回归/多元线性回归' },
    { text: 'Logistic回归', link: '/6-回归与相关/Logistic回归/Logistic回归' },
  ],
  '/7-试验设计与生存分析/': [
    { text: '试验设计与生存分析总览', link: '/7-试验设计与生存分析/' },
    {
      text: '试验设计',
      collapsed: false,
      items: [
        { text: '完全随机与随机区组', link: '/7-试验设计与生存分析/试验设计/完全随机与随机区组' },
        { text: '拉丁方与交叉设计', link: '/7-试验设计与生存分析/试验设计/拉丁方与交叉设计' },
        { text: '析因与裂区设计', link: '/7-试验设计与生存分析/试验设计/析因与裂区设计' },
      ]
    },
    {
      text: '生存分析',
      collapsed: true,
      items: [
        { text: '生存数据与删失', link: '/7-试验设计与生存分析/生存分析/生存数据与删失' },
        { text: 'KM曲线与Logrank检验', link: '/7-试验设计与生存分析/生存分析/KM曲线与Logrank检验' },
        { text: 'Cox比例风险模型', link: '/7-试验设计与生存分析/生存分析/Cox比例风险模型' },
      ]
    },
  ],
  '/8-统计软件栈/': [
    { text: '统计软件栈总览', link: '/8-统计软件栈/' },
    { text: 'Python统计生态', link: '/8-统计软件栈/Python统计生态' },
    { text: 'R与SPSS操作', link: '/8-统计软件栈/R与SPSS操作' },
  ],
  '/9-拓展资料/': [
    { text: '拓展资料总览', link: '/9-拓展资料/' },
  ],
}

export default defineConfig({
  lang: 'zh-CN',
  title: '生物医学统计知识库',
  description: '医学统计学与生物统计学系统化知识库 | 从描述统计到生存分析',
  base: '/statistic-know/',
  srcDir: '.',
  outDir: '../dist',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '路线导览', link: '/0-路线导览/' },
      { text: '知识图谱', link: '/知识图谱' },
    ],
    sidebar: {
      '/0-路线导览/': sidebar['/0-路线导览/'],
      '/1-统计基础/': sidebar['/1-统计基础/'],
      '/2-统计推断/': sidebar['/2-统计推断/'],
      '/3-方差分析/': sidebar['/3-方差分析/'],
      '/4-分类数据分析/': sidebar['/4-分类数据分析/'],
      '/5-非参数检验/': sidebar['/5-非参数检验/'],
      '/6-回归与相关/': sidebar['/6-回归与相关/'],
      '/7-试验设计与生存分析/': sidebar['/7-试验设计与生存分析/'],
      '/8-统计软件栈/': sidebar['/8-统计软件栈/'],
      '/9-拓展资料/': sidebar['/9-拓展资料/'],
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '页面导航' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },
    editLink: {
      pattern: 'https://github.com/zoneby-Alex/statistic-know/edit/main/Statistical-Know/:path',
      text: '在 GitHub 上编辑此页',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],
  },
  markdown: { math: true, lineNumbers: true },
  vite: { server: { host: true, port: 5173 } },
})
