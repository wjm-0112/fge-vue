<template>
    <div class="search-container">
        <!-- 顶部导航栏（与首页保持一致） -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <img src="../assets/img/logo.jpg" alt="帧光引擎" @click="goToHome">
                </div>
                <div class="search-box">
                    <el-input
                            placeholder="搜索电影、电视剧、综艺"
                            v-model="searchQuery"
                            @keyup.enter="handleSearch"
                            clearable
                            @clear="handleClearSearch"
                    >
                        <template #append>
                            <el-button
                                    icon="el-icon-search"
                                    @click="handleSearch"
                                    type="primary"
                            ></el-button>
                        </template>
                    </el-input>
                </div>
                <div class="nav-links">
                    <router-link to="/">首页</router-link>
                    <router-link to="/category">分类</router-link>
                    <router-link to="/home">个人中心</router-link>
                    <div class="user-info" v-if="uname" @click="loginout">
                        {{uname}} 退出登录
                    </div>
                    <router-link v-else to="/LoginAndRegister" class="active">登录/注册</router-link>
                </div>
            </div>
        </header>

        <!-- 搜索内容区域 -->
        <div class="search-content">
            <!-- 搜索状态指示器 -->
            <div class="search-status-indicator">
                <transition name="fade">
                    <div v-if="searching" class="searching-indicator">
                        <i class="el-icon-loading"></i>
                        <span>正在搜索中...</span>
                    </div>
                </transition>
            </div>

            <!-- 搜索结果标题 -->
            <div class="search-header">
                <transition name="fade" mode="out-in">
                    <h2 v-if="searchResults && searchQuery">
                        <span class="search-query">"{{searchQuery}}"</span> 的搜索结果
                        <span class="result-count">{{searchResults.list.length}} 个结果</span>
                    </h2>
                    <h2 v-else-if="!searchQuery && !searchResults">
                        <i class="el-icon-search"></i>
                        请输入搜索内容
                    </h2>
                    <h2 v-else>
                        <i class="el-icon-search"></i>
                        探索更多电影
                    </h2>
                </transition>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading-container">
                <el-skeleton :rows="6" animated />
            </div>

            <!-- 无结果提示 -->
            <div v-else-if="!loading && searchResults && searchResults.list.length === 0" class="no-result">
                <el-empty description="没有找到相关电影">
                    <el-button
                            type="primary"
                            size="small"
                            @click="resetSearch"
                    >
                        重新搜索
                    </el-button>
                </el-empty>
            </div>

            <!-- 搜索结果列表 -->
            <div v-else-if="searchResults" class="result-list">
                <transition-group name="list" tag="div">
                    <div
                            class="movie-item"
                            v-for="movie in searchResults.list"
                            :key="movie.mid"
                            @click="goToMovieDetail(movie.mid)"
                    >
                        <div class="poster-container">
                            <img
                                    :src="require('../assets/img/' + movie.poster)"
                                    :alt="movie.name"
                                    class="movie-poster"
                            />
                            <div class="movie-rating">
                                <el-rate
                                        v-model="movie.score"
                                        disabled
                                        :max="5"
                                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                        text-color="#ff9900"
                                        disabled-void-color="#c0c4cc"
                                />
                                <span>{{ (movie.score * 2).toFixed(1) }}</span>
                            </div>
                            <div class="movie-hover-overlay">
                                <el-button type="primary" size="mini" round>
                                    查看详情
                                </el-button>
                            </div>
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">{{ movie.name }}</h3>
                            <div class="meta">
                                <span><i class="el-icon-date"></i> {{ formatYear(movie.year) }}</span>
                                <span><i class="el-icon-location-information"></i> {{ movie.category1?.area || '未知地区' }}</span>
                                <span><i class="el-icon-collection-tag"></i> {{ movie.category2?.type || '未知类型' }}</span>
                                <span><i class="el-icon-time"></i> {{ movie.time }}分钟</span>
                            </div>
                            <div class="director">
                                <i class="el-icon-video-camera"></i>
                                <span>导演：{{ movie.director || '未知' }}</span>
                            </div>
                            <div class="actor">
                                <i class="el-icon-user"></i>
                                <span>主演：{{ movie.actor || '未知' }}</span>
                            </div>
                            <div class="description">
                                <p>剧情简介:{{ movie.description || '暂无剧情简介' }}</p>
                            </div>
                            <div class="stats">
                                <span class="stat-item">
                                    <i class="el-icon-view"></i>
                                    {{ formatViewCount(movie.seen) }}人看过
                                </span>
                                <span class="stat-item">
                                    <i class="el-icon-star-off"></i>
                                    {{ formatViewCount(movie.collection) }}人收藏
                                </span>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>

            <!-- 搜索历史（新增） -->
            <div v-if="!searchQuery && !searchResults && searchHistory.length > 0" class="search-history">
                <h3 class="history-title">
                    <i class="el-icon-time"></i>
                    搜索历史
                </h3>
                <div class="history-tags">
                    <el-tag
                            v-for="(item, index) in searchHistory"
                            :key="index"
                            closable
                            @click="handleHistoryClick(item)"
                            @close="removeHistoryItem(index)"
                    >
                        {{ item }}
                    </el-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';


    export default {
        name: `search`,
        data() {
            return {
                userInfo: {},
                uname: '',
                searchQuery: '', // 搜索关键词
                searchResults: null, // 搜索结果数据
                loading: false, // 加载状态
                searching: false, // 搜索中状态
                searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [], // 搜索历史

            }
        },
        created() {
            // 从路由参数中获取搜索关键词
            this.searchQuery = this.$route.query.name || '';
            // 如果有搜索关键词，则执行搜索
            if (this.searchQuery) {
                this.fetchSearchResults();
            }

            // 初始化用户信息
            const userData = localStorage.getItem('userInfo');
            if (userData) {
                try {
                    this.userInfo = JSON.parse(userData);
                    this.uname = this.userInfo.uname || '';
                } catch (e) {
                    console.error('解析用户信息失败:', e);
                    localStorage.removeItem('userInfo');
                }
            }
        },
        watch: {
            // 监听路由变化，当搜索关键词变化时重新搜索
            '$route'(to) {
                this.searchQuery = to.query.name || '';
                if (this.searchQuery) {
                    this.fetchSearchResults();
                } else {
                    this.searchResults = null;
                }
            }
        },
        methods: {
            /**
             * 获取搜索结果
             */
            async fetchSearchResults() {
                if (!this.searchQuery.trim()) return;

                this.loading = true;
                this.searching = true;
                try {
                    const response = await axios.get('http://localhost:8081/movie/findMovieMo', {
                        params: {
                            name: this.searchQuery
                        }
                    });
                    this.searchResults = response.data;

                    // 添加到搜索历史
                    this.addToSearchHistory(this.searchQuery);
                } catch (error) {
                    console.error('搜索失败:', error);
                    this.$message.error('搜索失败，请稍后重试');
                    this.searchResults = null;
                } finally {
                    this.loading = false;
                    this.searching = false;
                }
            },

            /**
             * 添加到搜索历史
             * @param {string} query - 搜索关键词
             */
            addToSearchHistory(query) {
                if (!query.trim()) return;

                // 去重
                const index = this.searchHistory.indexOf(query);
                if (index !== -1) {
                    this.searchHistory.splice(index, 1);
                }

                // 添加到数组开头
                this.searchHistory.unshift(query);

                // 限制历史记录数量
                if (this.searchHistory.length > 10) {
                    this.searchHistory = this.searchHistory.slice(0, 10);
                }

                // 保存到本地存储
                localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
            },

            /**
             * 移除搜索历史项
             * @param {number} index - 索引
             */
            removeHistoryItem(index) {
                this.searchHistory.splice(index, 1);
                localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
            },

            /**
             * 点击历史记录
             * @param {string} query - 搜索关键词
             */
            handleHistoryClick(query) {
                this.searchQuery = query;
                this.handleSearch();
            },

            /**
             * 处理搜索
             */
            handleSearch() {
                if (this.searchQuery.trim()) {
                    // 如果已经在搜索页面，则直接搜索
                    if (this.$route.path === '/search') {
                        this.$router.replace({
                            path: '/search',
                            query: { name: this.searchQuery }
                        });
                        this.fetchSearchResults();
                    } else {
                        // 否则跳转到搜索页面
                        this.$router.push({
                            path: '/search',
                            query: { name: this.searchQuery }
                        });
                    }
                } else {
                    this.$message.warning('请输入搜索内容');
                }
            },

            /**
             * 处理清除搜索
             */
            handleClearSearch() {
                this.searchResults = null;
                if (this.$route.path === '/search') {
                    this.$router.replace({ path: '/search' });
                }
            },

            /**
             * 重置搜索
             */
            resetSearch() {
                this.searchQuery = '';
                this.searchResults = null;
                this.$router.replace({ path: '/search' });
            },



            /**
             * 格式化年份
             */
            formatYear(date) {
                if (!date) return '未知年份';
                return date.split('-')[0];
            },

            /**
             * 格式化观看人数
             */
            formatViewCount(count) {
                if (!count) return '0';
                if (count >= 10000) {
                    return (count / 10000).toFixed(1) + '万';
                }
                return count.toString();
            },

            /**
             * 跳转到电影详情页
             */
            goToMovieDetail(mid) {
                this.$router.push({
                    name: 'MovieDetail',
                    params: { mid: mid }
                });
            },

            /**
             * 跳转到首页
             */
            goToHome() {
                this.$router.push('/');
            },

            /**
             * 处理退出登录
             */
            loginout() {
                this.$confirm('确定要退出登录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.removeItem('userInfo');
                    this.userInfo = {};
                    this.uname = '';
                    this.$message.success('退出登录成功');
                    location.reload();
                }).catch(() => {
                    // 用户取消退出
                });
            }
        }
    }
</script>

<style scoped>
    /* 基础容器样式 */
    .search-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
        margin-top: -50px;
    }

    /* 顶部导航栏样式（与首页保持一致） */
    .header {
        background-color: rgba(120, 159, 204, 0.84);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .header-content {
        display: flex;
        align-items: center;
        height: 80px;
        padding: 0 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .logo img {
        width: 150px;
        height: 50px;
        object-fit: contain;
        transition: all 0.3s;
        cursor: pointer;
    }

    .logo img:hover {
        transform: scale(1.05);
    }

    .search-box {
        flex: 1;
        max-width: 500px;
        margin: 0 40px;
    }

    .search-box >>> .el-input-group__append {
        background-color: #00b51d;
        border-color: #00b51d;
    }

    .search-box >>> .el-icon-search {
        color: white;
    }

    .nav-links {
        display: flex;
        align-items: center;
    }

    .nav-links a {
        margin: 0 15px;
        color: #333;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;
        position: relative;
    }

    .nav-links a:hover {
        color: #222bb5;
    }

    .nav-links a.router-link-exact-active {
        color: #222bb5;
    }

    .nav-links a.router-link-exact-active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #00b51d;
        animation: underline 0.3s ease-out;
    }

    @keyframes underline {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
    }

    .user-info {
        margin: 0 15px;
        color: #333;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.3s;
    }

    .user-info:hover {
        color: #222bb5;
    }

    /* 搜索内容区域样式 */
    .search-content {
        margin-top: 30px;
        padding: 30px;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s;
    }

    .search-content:hover {
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    }

    /* 搜索状态指示器 */
    .search-status-indicator {
        height: 30px;
        margin-bottom: 15px;
    }

    .searching-indicator {
        display: inline-flex;
        align-items: center;
        padding: 5px 15px;
        background-color: #f5f7fa;
        border-radius: 15px;
        color: #606266;
        font-size: 14px;
    }

    .searching-indicator i {
        margin-right: 8px;
        animation: rotating 2s linear infinite;
    }

    @keyframes rotating {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* 搜索标题样式 */
    .search-header {
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }

    .search-header h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
        display: flex;
        align-items: center;
    }

    .search-header h2 i {
        margin-right: 10px;
        color: #409EFF;
    }

    .search-query {
        color: #409EFF;
        font-weight: 600;
        margin: 0 5px;
    }

    .result-count {
        font-size: 16px;
        color: #909399;
        margin-left: 10px;
        font-weight: normal;
    }

    /* 加载状态样式 */
    .loading-container {
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    /* 无结果提示样式 */
    .no-result {
        margin: 50px 0;
        text-align: center;
        padding: 40px;
        background: #f5f7fa;
        border-radius: 8px;
    }

    /* 搜索结果列表样式 */
    .result-list {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    /* 电影项样式 */
    .movie-item {
        display: flex;
        gap: 25px;
        padding: 25px;
        border-radius: 12px;
        background-color: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .movie-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .movie-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #409EFF, #00b51d);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .movie-item:hover::before {
        opacity: 1;
    }

    /* 海报容器样式 */
    .poster-container {
        flex: 0 0 200px;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .movie-poster {
        width: 100%;
        height: 280px;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .movie-item:hover .movie-poster {
        transform: scale(1.05);
    }

    /* 评分样式 */
    .movie-rating {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .movie-rating >>> .el-rate {
        height: 16px;
    }

    .movie-rating span {
        color: #FF9900;
        font-size: 14px;
        font-weight: bold;
    }

    /* 悬停遮罩层 */
    .movie-hover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .movie-item:hover .movie-hover-overlay {
        opacity: 1;
    }

    /* 电影信息样式 */
    .movie-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .movie-title {
        font-size: 22px;
        margin: 0 0 15px;
        color: #333;
        font-weight: 600;
        transition: color 0.3s;
    }

    .movie-item:hover .movie-title {
        color: #409EFF;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #666;
    }

    .meta span {
        display: flex;
        align-items: center;
    }

    .meta i {
        margin-right: 5px;
        font-size: 14px;
        color: #409EFF;
    }

    .director {
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
    }

    .director i {
        margin-right: 5px;
        color: #409EFF;
    }

    .actor {
        margin-bottom: 15px;
        font-size: 14px;
        color: #666;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .actor i {
        margin-right: 5px;
        color: #409EFF;
    }

    .description {
        flex: 1;
        margin-bottom: 15px;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-align: left;
    }

    .stats {
        display: flex;
        gap: 20px;
        font-size: 13px;
        color: #999;
    }

    .stat-item {
        display: flex;
        align-items: center;
    }

    .stats i {
        margin-right: 5px;
        font-size: 14px;
    }

    /* 搜索历史样式 */
    .search-history {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }

    .history-title {
        font-size: 18px;
        color: #333;
        margin: 0 0 15px;
        display: flex;
        align-items: center;
    }

    .history-title i {
        margin-right: 8px;
        color: #409EFF;
    }

    .history-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .history-tags >>> .el-tag {
        cursor: pointer;
        transition: all 0.3s;
    }

    .history-tags >>> .el-tag:hover {
        background-color: #ecf5ff;
        color: #409EFF;
        transform: translateY(-2px);
    }

    /* 过渡动画 */
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .list-enter-active, .list-leave-active {
        transition: all 0.5s;
    }
    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
    .list-move {
        transition: transform 0.5s;
    }

    /* 响应式设计 */
    @media (max-width: 992px) {
        .movie-item {
            gap: 20px;
            padding: 20px;
        }

        .poster-container {
            flex: 0 0 180px;
        }

        .movie-poster {
            height: 250px;
        }
    }

    @media (max-width: 768px) {
        .header-content {
            height: 60px;
            padding: 0 10px;
        }

        .logo img {
            width: 120px;
        }

        .search-box {
            margin: 0 15px;
        }

        .nav-links a {
            margin: 0 8px;
            font-size: 14px;
        }

        .search-content {
            padding: 20px;
        }

        .movie-item {
            flex-direction: column;
        }

        .poster-container {
            flex: 0 0 auto;
            width: 100%;
        }

        .movie-poster {
            height: auto;
            max-height: 350px;
            width: 100%;
        }
    }

    @media (max-width: 576px) {
        .header-content {
            flex-wrap: wrap;
            height: auto;
            padding: 10px;
        }

        .logo {
            order: 1;
            width: 100%;
            margin-bottom: 10px;
            text-align: center;
        }

        .search-box {
            order: 3;
            width: 100%;
            margin: 10px 0;
        }

        .nav-links {
            order: 2;
            width: 100%;
            justify-content: center;
            margin-bottom: 10px;
        }

        .search-content {
            padding: 15px;
        }

        .meta {
            gap: 8px;
        }

        .stats {
            flex-direction: column;
            gap: 8px;
        }
    }
</style>