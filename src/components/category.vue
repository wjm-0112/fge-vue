<template>
    <div class="category-container">
        <!-- 顶部导航栏（与首页一致） -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <img src="../assets/img/logo.jpg" alt="帧光引擎">
                </div>
                <div class="search-box">
                    <el-input
                            placeholder="搜索电影、电视剧、综艺"
                            v-model="searchQuery"
                            @keyup.enter="handleSearch"
                    >
                        <template #append>
                            <el-button icon="el-icon-search" @click="handleSearch"></el-button>
                        </template>
                    </el-input>
                </div>
                <div class="nav-links">
                    <router-link to="/">首页</router-link>
                    <router-link to="/category" class="active">分类</router-link>
                    <router-link to="/home">个人中心</router-link>
                    <!-- 登录状态显示 -->
                    <div class="user-info" v-if="uname" @click="loginout">
                        {{uname}} 退出登录
                    </div>
                    <router-link v-else to="/LoginAndRegister" class="active">登录/注册</router-link>
                </div>
            </div>
        </header>

        <!-- 分类筛选区域 - 优化后的样式 -->
        <div class="filter-container">
            <!-- 类型筛选 -->
            <div class="filter-section">
                <h3 class="filter-title">
                    <i class="el-icon-collection-tag"></i>
                    类型：
                </h3>
                <div class="filter-tags">
                    <span
                            v-for="type in movieTypes"
                            :key="type.ccid"
                            :class="{ 'active': selectedType === type.ccid }"
                            @click="selectType(type.ccid)"
                    >
                        {{ type.type }}
                        <transition name="fade">
                            <i v-if="selectedType === type.ccid" class="el-icon-check"></i>
                        </transition>
                    </span>
                </div>
            </div>

            <!-- 地区筛选 -->
            <div class="filter-section">
                <h3 class="filter-title">
                    <i class="el-icon-location-information"></i>
                    地区：
                </h3>
                <div class="filter-tags">
                    <span
                            v-for="region in movieRegions"
                            :key="region.cid"
                            :class="{ 'active': selectedRegion === region.cid }"
                            @click="selectRegion(region.cid)"
                    >
                        {{ region.area }}
                        <transition name="fade">
                            <i v-if="selectedRegion === region.cid" class="el-icon-check"></i>
                        </transition>
                    </span>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="filter-actions">
                <el-button
                        type="primary"
                        size="small"
                        @click="resetFilters"
                        :disabled="!hasFilters"
                        plain
                        icon="el-icon-refresh"
                >
                    重置筛选
                </el-button>
            </div>
        </div>

        <!-- 电影展示区域 -->
        <div class="movie-display">
            <!-- 筛选结果标题 -->
            <div class="result-header">
                <h2 v-if="hasFilters">
                    {{ resultTitle }}
                    <span class="result-count">(共 {{ filteredMovies.length }} 部)</span>
                </h2>
                <h2 v-else>
                    <i class="el-icon-film"></i>
                    全部电影
                    <span class="result-count">(共 {{ filteredMovies.length }} 部)</span>
                </h2>

                <!-- 排序选项 -->
                <div class="sort-options">
                    <el-select
                            v-model="sortBy"
                            placeholder="排序方式"
                            size="small"
                            @change="handleSortChange"
                            popper-class="sort-select-dropdown"
                    >
                        <el-option
                                v-for="item in sortOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading-container">
                <el-skeleton :rows="6" animated />
            </div>

            <!-- 电影列表 -->
            <div v-else class="movie-grid">
                <div
                        class="movie-card"
                        v-for="movie in paginatedMovies"
                        :key="movie.mid"
                        @click="goToMovieDetail(movie.mid)"
                >
                    <div class="poster-container">
                        <img
                                :src="require('../assets/img/'+movie.poster)"
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
                                    :show-score="false"
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
                        <p class="meta">
                            <span><i class="el-icon-date"></i> {{ formatYear(movie.year) }}</span>
                            <span><i class="el-icon-collection-tag"></i> {{ movie.category2?.type || '未知类型' }}</span>
                            <span><i class="el-icon-location-information"></i> {{ movie.category1?.area || '未知地区' }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- 分页控件 -->
            <div class="pagination" v-if="filteredMovies.length > pageSize">
                <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="filteredMovies.length"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        @current-change="handlePageChange"
                        :pager-count="5"
                />
            </div>

            <!-- 无结果提示 -->
            <div v-if="!loading && filteredMovies.length === 0" class="empty-result">
                <el-empty description="没有找到符合条件的电影">
                    <el-button type="primary" size="small" @click="resetFilters">重置筛选条件</el-button>
                </el-empty>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: `category`,
        data() {
            return {
                userInfo: {},
                uname: '',
                searchQuery: '',
                loading: false,

                // 分类筛选数据
                movieTypes: [], // 从后端获取的电影类型
                movieRegions: [], // 从后端获取的地区分类
                selectedType: null, // 当前选中的类型ID
                selectedRegion: null, // 当前选中的地区ID

                // 电影数据
                allMovies: [], // 从后端获取的所有电影

                // 分页相关
                currentPage: 1,
                pageSize: 10,

                // 排序相关
                sortBy: 'score_desc', // 默认按评分降序
                sortOptions: [
                    { value: 'score_desc', label: '评分从高到低' },
                    { value: 'score_asc', label: '评分从低到高' },
                    { value: 'year_desc', label: '年份从新到旧' },
                    { value: 'year_asc', label: '年份从旧到新' },
                    { value: 'seen_desc', label: '热度从高到低' }
                ]
            }
        },
        mounted() {
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
        computed: {
            /**
             * 是否有筛选条件
             */
            hasFilters() {
                return this.selectedType !== null || this.selectedRegion !== null;
            },

            /**
             * 结果标题
             */
            resultTitle() {
                const type = this.movieTypes.find(t => t.ccid === this.selectedType)?.type || '';
                const region = this.movieRegions.find(r => r.cid === this.selectedRegion)?.area || '';

                if (type && region) {
                    return `${region} · ${type}电影`;
                } else if (type) {
                    return `${type}电影`;
                } else if (region) {
                    return `${region}电影`;
                }
                return '全部电影';
            },

            /**
             * 筛选后的电影列表
             */
            filteredMovies() {
                let movies = [...this.allMovies];

                // 类型筛选
                if (this.selectedType !== null) {
                    movies = movies.filter(movie =>
                        movie.category2?.ccid === this.selectedType
                    );
                }

                // 地区筛选
                if (this.selectedRegion !== null) {
                    movies = movies.filter(movie =>
                        movie.category1?.cid === this.selectedRegion
                    );
                }

                // 排序处理
                return this.sortMovies(movies);
            },

            /**
             * 分页后的电影列表
             */
            paginatedMovies() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.filteredMovies.slice(start, end);
            }
        },
        async created() {
            // 初始化数据
            await this.fetchCategories();
            await this.fetchMovies();
        },
        methods: {
            /**
             * 获取分类数据
             */
            async fetchCategories() {
                this.loading = true;
                try {
                    // 获取地区分类
                    const regionResponse = await axios.get('http://localhost:8081/category1/findCategory1');
                    this.movieRegions = regionResponse.data.list || [];

                    // 获取电影类型
                    const typeResponse = await axios.get('http://localhost:8081/category2/findCategory2');
                    this.movieTypes = typeResponse.data.list || [];
                } catch (error) {
                    console.error('获取分类数据失败:', error);
                    this.$message.error('获取分类数据失败');
                } finally {
                    this.loading = false;
                }
            },

            /**
             * 获取电影数据
             */
            async fetchMovies() {
                this.loading = true;
                try {
                    const response = await axios.get('http://localhost:8081/movie/findMovie');
                    this.allMovies = response.data.list || [];

                    // 为电影添加默认评分(5分制)
                    this.allMovies.forEach(movie => {
                        movie.score = movie.score ? movie.score / 2 : 0;
                    });
                } catch (error) {
                    console.error('获取电影数据失败:', error);
                    this.$message.error('获取电影数据失败');
                } finally {
                    this.loading = false;
                }
            },


            /**
             * 格式化年份，只保留年份部分
             */
            formatYear(date) {
                if (!date) return '未知年份';
                return date.split('-')[0];
            },

            /**
             * 选择电影类型
             */
            selectType(ccid) {
                this.selectedType = this.selectedType === ccid ? null : ccid;
                this.currentPage = 1; // 重置到第一页
            },

            /**
             * 选择地区
             */
            selectRegion(cid) {
                this.selectedRegion = this.selectedRegion === cid ? null : cid;
                this.currentPage = 1; // 重置到第一页
            },

            /**
             * 重置筛选条件
             */
            resetFilters() {
                this.selectedType = null;
                this.selectedRegion = null;
                this.currentPage = 1;
            },

            /**
             * 处理排序
             */
            sortMovies(movies) {
                const [field, order] = this.sortBy.split('_');

                return [...movies].sort((a, b) => {
                    let valueA, valueB;

                    if (field === 'year') {
                        valueA = a.year ? parseInt(a.year.split('-')[0]) : 0;
                        valueB = b.year ? parseInt(b.year.split('-')[0]) : 0;
                    } else {
                        valueA = a[field] || 0;
                        valueB = b[field] || 0;
                    }

                    if (order === 'desc') {
                        return valueB - valueA;
                    } else {
                        return valueA - valueB;
                    }
                });
            },

            /**
             * 排序方式改变
             */
            handleSortChange() {
                this.currentPage = 1;
            },

            /**
             * 分页变化
             */
            handlePageChange(page) {
                this.currentPage = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },

            /**
             * 跳转到电影详情
             */
            goToMovieDetail(mid) {
                this.$router.push({
                    name: 'MovieDetail',
                    params: { mid: mid }
                });
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
            },

            /**
             * 处理搜索
             */
            handleSearch() {
                if (this.searchQuery.trim()) {
                    this.$router.push({
                        path: '/search',
                        query: { name: this.searchQuery }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    /* 基础容器样式 */
    .category-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
        margin-top: -50px;
    }

    /* 顶部导航栏样式 */
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

    /* 筛选区域样式 - 优化后的样式 */
    .filter-container {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        padding: 25px;
        margin: 25px 0;
        transition: all 0.3s;
    }

    .filter-container:hover {
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    }

    .filter-section {
        margin-bottom: 25px;
    }

    .filter-section:last-child {
        margin-bottom: 0;
    }

    .filter-title {
        font-size: 16px;
        color: #333;
        margin: 0 0 15px 0;
        font-weight: 600;
        display: flex;
        align-items: center;
    }

    .filter-title i {
        margin-right: 8px;
        color: #409EFF;
    }

    .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .filter-tags span {
        padding: 8px 18px;
        background: #f5f7fa;
        border-radius: 18px;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    .filter-tags span:hover {
        background: #ecf5ff;
        color: #409EFF;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .filter-tags span.active {
        background: #409EFF;
        color: #fff;
        padding-right: 35px;
    }

    .filter-tags span i {
        position: absolute;
        right: 10px;
        font-size: 12px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .filter-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    /* 结果区域样式 */
    .movie-display {
        margin-top: 30px;
    }

    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }

    .result-header h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
        display: flex;
        align-items: center;
    }

    .result-header h2 i {
        margin-right: 10px;
        color: #409EFF;
    }

    .result-count {
        font-size: 16px;
        color: #909399;
        margin-left: 8px;
        font-weight: normal;
    }

    /* 排序选项样式 */
    .sort-options {
        margin-left: 20px;
    }

    /* 电影网格样式 - 优化后的样式 */
    .movie-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 25px;
    }

    .movie-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        cursor: pointer;
        position: relative;
    }

    .movie-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .poster-container {
        position: relative;
        padding-top: 140%;
        overflow: hidden;
    }

    .movie-poster {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .movie-card:hover .movie-poster {
        transform: scale(1.05);
    }

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

    .movie-card:hover .movie-hover-overlay {
        opacity: 1;
    }

    .movie-info {
        padding: 15px;
    }

    .movie-title {
        font-size: 16px;
        margin: 0 0 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
        color: #333;
    }

    .meta {
        font-size: 12px;
        color: #909399;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .meta span {
        display: flex;
        align-items: center;
    }

    .meta i {
        margin-right: 3px;
        font-size: 12px;
    }

    /* 分页样式 - 优化后的样式 */
    .pagination {
        margin-top: 40px;
        display: flex;
        justify-content: center;
    }

    .pagination >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #409EFF;
        color: #fff;
    }

    .pagination >>> .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #409EFF;
    }

    /* 空状态样式 */
    .empty-result {
        margin: 60px 0;
        text-align: center;
        background: #fff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }

    /* 加载状态样式 */
    .loading-container {
        padding: 30px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }

    /* 响应式设计 */
    @media (max-width: 992px) {
        .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
        }
    }

    @media (max-width: 768px) {
        .header-content {
            flex-wrap: wrap;
            height: auto;
            padding: 15px;
        }

        .logo {
            order: 1;
            width: 100%;
            text-align: center;
            margin-bottom: 15px;
        }

        .search-box {
            order: 3;
            width: 100%;
            margin: 15px 0;
        }

        .nav-links {
            order: 2;
            margin-left: auto;
        }

        .filter-tags span {
            padding: 6px 15px;
            font-size: 13px;
        }

        .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }

        .sort-options {
            margin-left: 0;
            width: 100%;
        }
    }

    @media (max-width: 576px) {
        .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }

        .filter-tags {
            gap: 8px;
        }

        .filter-tags span {
            padding: 5px 12px;
            font-size: 12px;
        }

        .result-header h2 {
            font-size: 20px;
        }
    }
</style>

<style>
    /* 全局下拉菜单样式 */
    .sort-select-dropdown {
        border-radius: 8px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12) !important;
        border: none !important;
    }

    .sort-select-dropdown .el-select-dropdown__item {
        padding: 0 20px !important;
        height: 36px !important;
        line-height: 36px !important;
    }

    .sort-select-dropdown .el-select-dropdown__item.selected {
        color: #409EFF !important;
        font-weight: 500;
    }

    .sort-select-dropdown .el-select-dropdown__item:hover {
        background-color: #f5f7fa !important;
    }
</style>