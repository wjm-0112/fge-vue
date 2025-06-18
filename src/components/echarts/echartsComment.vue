<template>
    <div class="comment-analysis-container">
        <h2 class="page-title">评论数据分析</h2>
        <!-- 新增时间段选择下拉 -->
        <div class="time-selector">
            <label for="timeRange">选择时间段维度：</label>
            <select id="timeRange" v-model="timeDimension" @change="handleTimeDimensionChange">
                <option value="day">按日</option>
                <option value="month">按月</option>
                <option value="year">按年</option>
            </select>
        </div>
        <div class="chart-grid">
            <!-- 评论数按用户分布 -->
            <div class="chart-card" style="grid-area: userChart;">
                <h3 class="chart-title">用户评论数分布</h3>
                <div ref="userCommentChart" class="chart-content"></div>
            </div>
            <!-- 评论数按电影分布 -->
            <div class="chart-card" style="grid-area: movieChart;">
                <h3 class="chart-title">电影评论数分布</h3>
                <div ref="movieCommentChart" class="chart-content"></div>
            </div>
            <!-- 评论时间趋势 -->
            <div class="chart-card" style="grid-area: timeChart;">
                <h3 class="chart-title">评论时间趋势</h3>
                <div ref="commentTimeChart" class="chart-content"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: `echartsComment`,
        data() {
            return {
                userCommentChart: null,
                movieCommentChart: null,
                commentTimeChart: null,
                commentData: [],
                timeDimension: "day", // 默认按日
            };
        },
        mounted() {
            this.initCharts();
            this.fetchData();
        },
        methods: {
            // 初始化图表
            initCharts() {
                // 优化配色方案
                const defaultOption = {
                    color: ["#3a86ff", "#38b0de", "#5584ac", "#50c878", "#f72585"],
                    tooltip: {
                        trigger: "item",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderColor: "#e0e0e0",
                        borderWidth: 1,
                        textStyle: { color: "#333", fontSize: 12 },
                        padding: 10,
                        formatter: function (params) {
                            if (params.seriesType === "bar") {
                                return `${params.name}：${params.value} 条评论`;
                            } else if (params.seriesType === "line") {
                                let timeStr = "";
                                if (this.timeDimension === "day") {
                                    timeStr = new Date(params.value[0]).toLocaleDateString().replace(/\//g, "-");
                                } else if (this.timeDimension === "month") {
                                    timeStr = new Date(params.value[0]).toLocaleDateString().replace(/\//g, "-").slice(0, 7);
                                } else if (this.timeDimension === "year") {
                                    timeStr = new Date(params.value[0]).getFullYear();
                                }
                                return `${timeStr}：${params.value[1]} 条评论`;
                            }
                            return params.value;
                        }.bind(this), // 绑定this，方便访问timeDimension
                    },
                    grid: {
                        top: "15%",
                        bottom: "15%",
                        left: "8%",
                        right: "8%",
                        containLabel: true,
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: { show: true },
                        },
                    },
                    xAxis: {
                        axisLabel: {
                            color: "#666",
                            fontSize: 12,
                            interval: 0,
                            rotate: 45,
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#e0e0e0",
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                    },
                    yAxis: {
                        axisLabel: {
                            color: "#666",
                            fontSize: 12,
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#e0e0e0",
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#f0f0f0",
                            },
                        },
                    },
                };

                // 用户评论数分布（柱状图）
                this.userCommentChart = this.$echarts.init(this.$refs.userCommentChart);
                this.userCommentChart.setOption({
                    ...defaultOption,
                    xAxis: {
                        ...defaultOption.xAxis,
                        type: "category",
                    },
                    yAxis: {
                        ...defaultOption.yAxis,
                        type: "value",
                    },
                    series: [
                        {
                            type: "bar",
                            barWidth: "45%",
                            barRadius: 4,
                            label: {
                                show: true,
                                position: "top",
                                color: "#333",
                                fontSize: 12,
                                formatter: "{c}",
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 10,
                                    shadowColor: "rgba(0, 0, 0, 0.1)",
                                },
                            },
                            data: [],
                        },
                    ],
                });

                // 电影评论数分布（柱状图）
                this.movieCommentChart = this.$echarts.init(this.$refs.movieCommentChart);
                this.movieCommentChart.setOption({
                    ...defaultOption,
                    xAxis: {
                        ...defaultOption.xAxis,
                        type: "category",
                        // 优化电影评论数分布的 xAxis 显示，可根据实际需求微调 rotate、interval
                        axisLabel: {
                            ...defaultOption.xAxis.axisLabel,
                            rotate: 45,
                            interval: 0,
                        },
                    },
                    yAxis: {
                        ...defaultOption.yAxis,
                        type: "value",
                    },
                    series: [
                        {
                            type: "bar",
                            barWidth: "45%",
                            barRadius: 4,
                            label: {
                                show: true,
                                position: "top",
                                color: "#333",
                                fontSize: 12,
                                formatter: "{c}",
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 10,
                                    shadowColor: "rgba(0, 0, 0, 0.1)",
                                },
                            },
                            data: [],
                        },
                    ],
                });

                // 评论时间趋势（折线图）
                this.commentTimeChart = this.$echarts.init(this.$refs.commentTimeChart);
                this.commentTimeChart.setOption({
                    ...defaultOption,
                    xAxis: {
                        ...defaultOption.xAxis,
                        type: "time",
                        axisLabel: {
                            ...defaultOption.xAxis.axisLabel,
                            rotate: 45,
                            formatter: function (value) {
                                if (this.timeDimension === "day") {
                                    return new Date(value).toLocaleDateString().replace(/\//g, "-");
                                } else if (this.timeDimension === "month") {
                                    return new Date(value).toLocaleDateString().replace(/\//g, "-").slice(0, 7);
                                } else if (this.timeDimension === "year") {
                                    return new Date(value).getFullYear();
                                }
                                return value;
                            }.bind(this),
                        },
                    },
                    yAxis: {
                        ...defaultOption.yAxis,
                        type: "value",
                    },
                    series: [
                        {
                            type: "line",
                            smooth: true,
                            symbolSize: 6,
                            symbol: "circle",
                            label: {
                                show: true,
                                position: "top",
                                color: "#333",
                                fontSize: 12,
                            },
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        width: 2.5,
                                    },
                                    areaStyle: {
                                        color: {
                                            type: "linear",
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [
                                                {
                                                    offset: 0,
                                                    color: "rgba(58, 134, 255, 0.1)",
                                                },
                                                {
                                                    offset: 1,
                                                    color: "rgba(58, 134, 255, 0.05)",
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                            data: [],
                        },
                    ],
                });
            },

            // 获取评论数据
            async fetchData() {
                try {
                    const res = await this.$http.get("http://localhost:8081/comment/getAllComment");
                    this.commentData = res.data;
                    console.log("评论数据:", this.commentData); // 调试用
                    this.updateCharts();
                } catch (error) {
                    console.error("获取评论数据失败:", error);
                }
            },

            // 更新图表
            updateCharts() {
                // 处理用户评论数分布数据
                const userCommentData = this.processUserCommentData();
                this.userCommentChart.setOption({
                    xAxis: { data: userCommentData.map((item) => item.name) },
                    series: [{ data: userCommentData.map((item) => item.value) }],
                });

                // 处理电影评论数分布数据
                const movieCommentData = this.processMovieCommentData();
                this.movieCommentChart.setOption({
                    xAxis: { data: movieCommentData.map((item) => item.name) },
                    series: [{ data: movieCommentData.map((item) => item.value) }],
                });

                // 处理评论时间趋势数据
                const commentTimeData = this.processCommentTimeData();
                this.commentTimeChart.setOption({
                    series: [{ data: commentTimeData }],
                });
            },

            // 处理用户评论数分布 - 修改字段访问方式
            processUserCommentData() {
                const userMap = new Map();
                this.commentData.forEach((comment) => {
                    const uname = comment.uname;
                    userMap.set(uname, (userMap.get(uname) || 0) + 1);
                });
                return Array.from(userMap).map(([name, value]) => ({ name, value }));
            },

            // 处理电影评论数分布 - 修改字段访问方式
            processMovieCommentData() {
                const movieMap = new Map();
                this.commentData.forEach((comment) => {
                    const mname = comment.mname;
                    movieMap.set(mname, (movieMap.get(mname) || 0) + 1);
                });
                return Array.from(movieMap).map(([name, value]) => ({ name, value }));
            },

            // 处理评论时间趋势 - 注意ctime是字符串格式，根据维度分组
            processCommentTimeData() {
                const timeMap = new Map();
                this.commentData.forEach((comment) => {
                    let timeKey = "";
                    const ctime = new Date(comment.ctime);
                    if (this.timeDimension === "day") {
                        timeKey = ctime.toLocaleDateString().replace(/\//g, "-");
                    } else if (this.timeDimension === "month") {
                        timeKey = ctime.toLocaleDateString().replace(/\//g, "-").slice(0, 7);
                    } else if (this.timeDimension === "year") {
                        timeKey = ctime.getFullYear().toString();
                    }
                    timeMap.set(timeKey, (timeMap.get(timeKey) || 0) + 1);
                });

                // 按时间排序（字符串比较，不同维度适配）
                const sortedData = Array.from(timeMap).sort((a, b) => {
                    if (this.timeDimension === "day") {
                        return new Date(a[0]) - new Date(b[0]);
                    } else if (this.timeDimension === "month") {
                        return (
                            new Date(a[0] + "-01") - new Date(b[0] + "-01")
                        );
                    } else if (this.timeDimension === "year") {
                        return parseInt(a[0]) - parseInt(b[0]);
                    }
                    return 0;
                });

                // 转换为时间戳格式供ECharts使用，不同维度适配
                return sortedData.map(([time, count]) => {
                    let timeStamp;
                    if (this.timeDimension === "day") {
                        timeStamp = new Date(time).getTime();
                    } else if (this.timeDimension === "month") {
                        timeStamp = new Date(time + "-01").getTime();
                    } else if (this.timeDimension === "year") {
                        timeStamp = new Date(time + "-01-01").getTime();
                    }
                    return [timeStamp, count];
                });
            },

            // 监听时间段维度变化
            handleTimeDimensionChange() {
                this.updateCharts(); // 重新处理数据更新图表
            },
        },

        beforeDestroy() {
            // 销毁图表实例，释放资源
            if (this.userCommentChart) this.userCommentChart.dispose();
            if (this.movieCommentChart) this.movieCommentChart.dispose();
            if (this.commentTimeChart) this.commentTimeChart.dispose();
        },
    };
</script>

<style scoped>
    .comment-analysis-container {
        padding: 30px;
        background: #f9fafb;
    }
    .page-title {
        text-align: center;
        font-size: 24px;
        color: #1f2937;
        margin-bottom: 20px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10px;
    }
    /* 新增时间段选择器样式 */
    .time-selector {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .time-selector label {
        margin-right: 8px;
        font-size: 14px;
        color: #666;
    }
    .time-selector select {
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }
    /* 调整网格布局，让电影评论数分布单独成行 */
    .chart-grid {
        display: grid;
        grid-template-rows: auto auto auto;
        grid-template-areas:
                "userChart"
                "movieChart"
                "timeChart";
        gap: 24px;
    }
    .chart-card {
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 24px;
        transition: all 0.3s ease;
    }
    .chart-card:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
    }
    .chart-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 16px;
        border-left: 4px solid #3a86ff;
        padding-left: 12px;
    }
    .chart-content {
        height: 360px;
    }
</style>