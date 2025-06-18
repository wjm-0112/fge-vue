<template>
    <div class="user-analysis-container">
        <h2 class="page-title">用户数据分析</h2>
        <div class="chart-grid">
            <!-- 角色分布 -->
            <div class="chart-card">
                <h3 class="chart-title">用户角色分布</h3>
                <div ref="roleChart" class="chart-content"></div>
            </div>
            <!-- 收藏分布 -->
            <div class="chart-card">
                <h3 class="chart-title">用户收藏电影数分布</h3>
                <div ref="collectionChart" class="chart-content"></div>
            </div>
            <!-- 已看分布 -->
            <div class="chart-card">
                <h3 class="chart-title">用户已看电影数分布</h3>
                <div ref="seenChart" class="chart-content"></div>
            </div>
            <!-- 活跃度趋势 -->
            <div class="chart-card">
                <h3 class="chart-title">用户活跃度趋势</h3>
                <div ref="activityChart" class="chart-content"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: `echartsUser`,
        data() {
            return {
                roleChart: null,
                collectionChart: null,
                seenChart: null,
                activityChart: null,
                userData: [],
                collectionData: [],
                seenData: []
            };
        },
        mounted() {
            this.initCharts();
            this.fetchData();
        },
        methods: {
            // 初始化图表（带优化的配色体系）
            initCharts() {
                // 数据可视化配色方案
                const theme = {
                    // 主色调：专业蓝色（代表数据）
                    primaryColor: '#165DFF',

                    // 辅助色：根据数据类型区分
                    secondaryColors: {
                        role: ['#165DFF', '#722ED1'],  // 角色分布：蓝色-紫色
                        collection: '#FF7D00',        // 收藏分布：橙色（代表兴趣）
                        seen: '#36CBCB',              // 已看分布：青色（代表完成）
                        activity: ['#FF7D00', '#36CBCB'] // 活跃度：橙色-青色
                    },

                    // 中性色：用于背景、边框、文本
                    neutralColors: {
                        background: '#F5F7FA',
                        card: '#FFFFFF',
                        border: '#E5E6EB',
                        text: {
                            primary: '#1D2129',
                            secondary: '#4E5969',
                            tertiary: '#86909C'
                        }
                    },

                    // 图表全局配置
                    tooltip: {
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderColor: '#E5E6EB',
                        borderWidth: 1,
                        textStyle: { color: '#4E5969' },
                        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 4px;'
                    },
                    title: { textStyle: { color: '#1D2129' } },
                    axisLine: { lineStyle: { color: '#E5E6EB' } },
                    axisLabel: { textStyle: { color: '#86909C' } },
                    splitLine: { lineStyle: { color: '#F2F3F5' } },
                    legend: { textStyle: { color: '#4E5969' } }
                };

                // 角色分布（环形饼图）
                this.roleChart = this.$echarts.init(this.$refs.roleChart, null, { renderer: 'canvas' });
                this.roleChart.setOption({
                    color: theme.secondaryColors.role,
                    tooltip: theme.tooltip,
                    title: theme.title,
                    series: [
                        {
                            type: 'pie',
                            radius: ['30%', '60%'],
                            label: {
                                show: true,
                                formatter: '{b}\n{d}%',
                                textStyle: {
                                    color: theme.neutralColors.text.secondary,
                                    fontSize: 12
                                }
                            },
                            labelLine: { lineStyle: { color: theme.neutralColors.border } },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                                }
                            },
                            data: []
                        }
                    ]
                });

                // 收藏分布（柱状图）
                this.collectionChart = this.$echarts.init(this.$refs.collectionChart, null, { renderer: 'canvas' });
                this.collectionChart.setOption({
                    color: [theme.secondaryColors.collection],
                    tooltip: theme.tooltip,
                    title: theme.title,
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: theme.axisLine,
                        axisLabel: theme.axisLabel
                    },
                    yAxis: {
                        type: 'value',
                        name: '用户数',
                        nameTextStyle: { color: theme.neutralColors.text.secondary },
                        axisLine: theme.axisLine,
                        axisLabel: theme.axisLabel,
                        splitLine: theme.splitLine
                    },
                    series: [
                        {
                            type: 'bar',
                            barWidth: '40%',
                            label: {
                                show: true,
                                position: 'top',
                                color: theme.neutralColors.text.primary,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                borderRadius: [4, 4, 0, 0],
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#FF9D3C' },
                                        { offset: 1, color: '#FF7D00' }
                                    ]
                                }
                            },
                            data: []
                        }
                    ]
                });

                // 已看分布（柱状图）
                this.seenChart = this.$echarts.init(this.$refs.seenChart, null, { renderer: 'canvas' });
                this.seenChart.setOption({
                    color: [theme.secondaryColors.seen],
                    tooltip: theme.tooltip,
                    title: theme.title,
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: theme.axisLine,
                        axisLabel: theme.axisLabel
                    },
                    yAxis: {
                        type: 'value',
                        name: '用户数',
                        nameTextStyle: { color: theme.neutralColors.text.secondary },
                        axisLine: theme.axisLine,
                        axisLabel: theme.axisLabel,
                        splitLine: theme.splitLine
                    },
                    series: [
                        {
                            type: 'bar',
                            barWidth: '40%',
                            label: {
                                show: true,
                                position: 'top',
                                color: theme.neutralColors.text.primary,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                borderRadius: [4, 4, 0, 0],
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#56D9D9' },
                                        { offset: 1, color: '#36CBCB' }
                                    ]
                                }
                            },
                            data: []
                        }
                    ]
                });

                // 活跃度趋势（折线图）
                this.activityChart = this.$echarts.init(this.$refs.activityChart, null, { renderer: 'canvas' });
                this.activityChart.setOption({
                    color: theme.secondaryColors.activity,
                    tooltip: theme.tooltip,
                    title: theme.title,
                    legend: {
                        data: ['收藏', '观看'],
                        top: 'top',
                        textStyle: theme.legend.textStyle
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: theme.axisLine,
                        axisLabel: theme.axisLabel
                    },
                    yAxis: {
                        type: 'value',
                        name: '活动次数',
                        nameTextStyle: { color: theme.neutralColors.text.secondary },
                        axisLine: theme.axisLine,
                        axisLabel: theme.axisLabel,
                        splitLine: theme.splitLine
                    },
                    series: [
                        {
                            name: '收藏',
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                width: 3,
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#FF9D3C' },
                                        { offset: 1, color: '#FF7D00' }
                                    ]
                                }
                            },
                            symbol: 'circle',
                            symbolSize: 8,
                            itemStyle: { color: '#FF7D00' },
                            areaStyle: {
                                opacity: 0.2,
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#FF9D3C' },
                                        { offset: 1, color: '#FF7D00' }
                                    ]
                                }
                            },
                            data: []
                        },
                        {
                            name: '观看',
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                width: 3,
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#56D9D9' },
                                        { offset: 1, color: '#36CBCB' }
                                    ]
                                }
                            },
                            symbol: 'circle',
                            symbolSize: 8,
                            itemStyle: { color: '#36CBCB' },
                            areaStyle: {
                                opacity: 0.2,
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#56D9D9' },
                                        { offset: 1, color: '#36CBCB' }
                                    ]
                                }
                            },
                            data: []
                        }
                    ]
                });
            },

            // 获取数据（保持原有逻辑）
            async fetchData() {
                try {
                    const [userRes, collectionRes, seenRes] = await Promise.all([
                        this.$http.get('http://localhost:8081/user/getAllUser'),
                        this.$http.get('http://localhost:8081/user/getAllUserCollection'),
                        this.$http.get('http://localhost:8081/user/getAllUserSeen')
                    ]);
                    this.userData = userRes.data;
                    this.collectionData = collectionRes.data;
                    this.seenData = seenRes.data;

                    this.updateUserCharts();
                    this.updateActivityChart();
                } catch (error) {
                    console.error('数据加载失败:', error);
                }
            },

            // 更新图表（保持原有逻辑）
            updateUserCharts() {
                // 角色分布
                const roleData = this.processRoleData();
                this.roleChart.setOption({ series: [{ data: roleData }] });

                // 收藏分布
                const collectionData = this.processCollectionData();
                this.collectionChart.setOption({
                    xAxis: { data: collectionData.map(item => item.name) },
                    series: [{ data: collectionData.map(item => item.value) }]
                });

                // 已看分布
                const seenData = this.processSeenData();
                this.seenChart.setOption({
                    xAxis: { data: seenData.map(item => item.name) },
                    series: [{ data: seenData.map(item => item.value) }]
                });
            },

            updateActivityChart() {
                const activityData = this.processActivityData();
                if (activityData) {
                    this.activityChart.setOption({
                        xAxis: { data: activityData.dates },
                        series: [
                            { name: '收藏', data: activityData.collectionCount },
                            { name: '观看', data: activityData.seenCount }
                        ]
                    });
                }
            },

            // 数据处理函数（保持原有逻辑）
            processRoleData() {
                const roleMap = new Map([['管理员', 0], ['普通用户', 0]]);
                this.userData.forEach(user => {
                    roleMap.set(user.role === 1? '管理员' : '普通用户', roleMap.get(user.role === 1? '管理员' : '普通用户') + 1);
                });
                return Array.from(roleMap).map(([name, value]) => ({ name, value }));
            },

            processCollectionData() {
                const collectionMap = new Map();
                this.userData.forEach(user => {
                    const count = user.collection;
                    collectionMap.set(count, (collectionMap.get(count) || 0) + 1);
                });
                return Array.from(collectionMap).map(([name, value]) => ({ name, value })).sort((a, b) => a.name - b.name);
            },

            processSeenData() {
                const seenMap = new Map();
                this.userData.forEach(user => {
                    const count = user.seen;
                    seenMap.set(count, (seenMap.get(count) || 0) + 1);
                });
                return Array.from(seenMap).map(([name, value]) => ({ name, value })).sort((a, b) => a.name - b.name);
            },

            processActivityData() {
                if (!this.collectionData ||!this.seenData) return null;

                const allDates = new Set();
                this.collectionData.forEach(item => allDates.add(item.time));
                this.seenData.forEach(item => allDates.add(item.time));

                const dates = Array.from(allDates).sort();

                const collectionCount = dates.map(date =>
                    this.collectionData.filter(item => item.time === date).length
                );
                const seenCount = dates.map(date =>
                    this.seenData.filter(item => item.time === date).length
                );

                return { dates, collectionCount, seenCount };
            }
        },

        beforeDestroy() {
            // 销毁图表释放资源
            this.roleChart && this.roleChart.dispose();
            this.collectionChart && this.collectionChart.dispose();
            this.seenChart && this.seenChart.dispose();
            this.activityChart && this.activityChart.dispose();
        }
    };
</script>

<style scoped>
    /* 容器布局 */
    .user-analysis-container {
        padding: 2rem;
        background: #F5F7FA;
    }

    /* 页面标题 */
    .page-title {
        text-align: center;
        font-size: 1.8rem;
        color: #1D2129;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #E5E6EB;
    }

    /* 图表栅格布局（响应式） */
    .chart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    /* 图表卡片样式 */
    .chart-card {
        background: #FFFFFF;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
        transition: all 0.3s ease;
        border: 1px solid #F2F3F5;
    }

    .chart-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }

    /* 图表标题 */
    .chart-title {
        font-size: 1.2rem;
        color: #1D2129;
        margin-bottom: 1rem;
        padding-left: 0.6rem;
        border-left: 4px solid #165DFF;
        font-weight: 500;
    }

    /* 图表内容容器 */
    .chart-content {
        height: 320px;
        min-width: 260px;
    }

    /* 响应式适配 */
    @media (max-width: 768px) {
        .chart-grid {
            grid-template-columns: 1fr;
        }
        .chart-content {
            height: 280px;
        }
    }
</style>