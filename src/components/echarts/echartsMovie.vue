<template>
    <div class="movie-analysis-container">
        <!-- 一级标题 -->
        <h2 class="page-title">电影数据分析</h2>
        <div class="chart-grid">
            <!-- 地区分布 -->
            <div class="chart-card">
                <h3 class="chart-title">电影地区分布</h3>
                <div ref="areaChart" class="chart-content"></div>
            </div>
            <!-- 类型分布 -->
            <div class="chart-card">
                <h3 class="chart-title">电影类型分布</h3>
                <div ref="typeChart" class="chart-content"></div>
            </div>
            <!-- 评分分布 -->
            <div class="chart-card">
                <h3 class="chart-title">电影评分分布</h3>
                <div ref="scoreChart" class="chart-content"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'echartsMovie',
        data() {
            return {
                areaChart: null,
                typeChart: null,
                scoreChart: null
            };
        },
        mounted() {
            this.initCharts();
            this.fetchData();
        },
        methods: {
            initCharts() {
                // 使用全局挂载的 ECharts 实例
                this.areaChart = this.$echarts.init(this.$refs.areaChart);
                this.areaChart.setOption({
                    title: { text: '电影地区分布' },
                    tooltip: { trigger: 'item' },
                    series: [
                        {
                            name: '地区',
                            type: 'pie',
                            radius: '50%',
                            data: []
                        }
                    ]
                });

                this.typeChart = this.$echarts.init(this.$refs.typeChart);
                this.typeChart.setOption({
                    title: { text: '电影类型分布' },
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category' },
                    yAxis: { type: 'value' },
                    series: [
                        {
                            name: '数量',
                            type: 'bar',
                            data: []
                        }
                    ]
                });

                this.scoreChart = this.$echarts.init(this.$refs.scoreChart);
                this.scoreChart.setOption({
                    title: { text: '电影评分分布' },
                    tooltip: { trigger: 'item' },
                    xAxis: { type: 'value', name: '评分' },
                    yAxis: { type: 'value', name: '数量' },
                    series: [
                        {
                            name: '评分分布',
                            type: 'scatter',
                            data: []
                        }
                    ]
                });
            },
            async fetchData() {
                try {
                    // 使用全局挂载的 axios 实例
                    const response = await this.$http.get('http://localhost:8081/movieVo/getAllMovieVo');
                    const data = response.data;
                    this.updateCharts(data);
                } catch (error) {
                    console.error('获取数据失败:', error);
                }
            },
            updateCharts(movieData) {
                // 处理地区分布数据并更新饼图
                const areaData = this.processAreaData(movieData);
                this.areaChart.setOption({
                    series: [
                        {
                            data: areaData
                        }
                    ]
                });

                // 处理类型分布数据并更新柱状图
                const typeData = this.processTypeData(movieData);
                this.typeChart.setOption({
                    xAxis: { data: typeData.map(item => item.name) },
                    series: [
                        {
                            data: typeData.map(item => item.value)
                        }
                    ]
                });

                // 处理评分分布数据并更新散点图
                const scoreData = this.processScoreData(movieData);
                this.scoreChart.setOption({
                    series: [
                        {
                            data: scoreData
                        }
                    ]
                });
            },
            processAreaData(data) {
                const areaMap = new Map();
                data.forEach(movie => {
                    const area = movie.area;
                    areaMap.set(area, (areaMap.get(area) || 0) + 1);
                });
                return Array.from(areaMap).map(([name, value]) => ({ name, value }));
            },
            processTypeData(data) {
                const typeMap = new Map();
                data.forEach(movie => {
                    const type = movie.type;
                    typeMap.set(type, (typeMap.get(type) || 0) + 1);
                });
                return Array.from(typeMap).map(([name, value]) => ({ name, value }));
            },
            processScoreData(data) {
                const scoreMap = new Map();
                data.forEach(movie => {
                    const score = Math.floor(movie.score);
                    scoreMap.set(score, (scoreMap.get(score) || 0) + 1);
                });
                return Array.from(scoreMap).map(([score, count]) => [score, count]);
            }
        },
        beforeDestroy() {
            // 销毁图表实例，释放资源
            if (this.areaChart) this.areaChart.dispose();
            if (this.typeChart) this.typeChart.dispose();
            if (this.scoreChart) this.scoreChart.dispose();
        }
    };
</script>

<style scoped>
    .movie-analysis-container {
        padding: 30px;
        background: #f5f7fa;
    }
    .page-title {
        text-align: center;
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
        border-bottom: 2px solid #ddd;
        padding-bottom: 10px;
    }
    .chart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    .chart-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        padding: 20px;
    }
    .chart-title {
        font-size: 18px;
        color: #444;
        margin-bottom: 15px;
        border-left: 4px solid #2f54eb;
        padding-left: 10px;
    }
    .chart-content {
        height: 350px; /* 统一图表高度 */
    }
</style>