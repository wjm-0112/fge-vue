<template>
    <div class="home-container">
        <!-- 顶部导航栏 -->
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
                    <router-link to="/category">分类</router-link>
                    <router-link to="/home">个人中心</router-link>
                    <!-- 登录状态显示 -->
                    <div class="user-info" v-if="uname" @click="loginout">
                        {{uname}} 退出登录
                    </div>
                    <router-link v-else to="/LoginAndRegister" class="active">登录/注册</router-link>
                </div>

            </div>
        </header>

        <!-- 轮播图区域（保持不变） -->
        <div class="banner-container"
             @mousedown="startDrag"
             @mousemove="handleDrag"
             @mouseup="endDrag"
             @mouseleave="endDrag"
             @touchstart="startDrag"
             @touchmove="handleDrag"
             @touchend="endDrag">
            <div class="custom-carousel">
                <div
                        class="carousel-track"
                        :style="{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease'
          }"
                >
                    <div
                            class="carousel-item"
                            v-for="(banner, index) in banners"
                            :key="banner.id"
                            :class="{ 'active': currentIndex === index }"
                    >
                        <img :src="banner.image" :alt="banner.title" />
                        <div class="banner-info">
                            <h3>{{ banner.title }}</h3>
                            <p>{{ banner.description }}</p>
                            <el-rate
                                    v-model="banner.rating"
                                    disabled
                                    show-score
                                    :max="10"
                                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                            ></el-rate>
                        </div>
                    </div>
                </div>
                <div class="carousel-controls">
                    <div class="control prev" @click="prevSlide">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="control next" @click="nextSlide">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
                <div class="carousel-indicators">
          <span
                  v-for="(item, index) in banners"
                  :key="index"
                  :class="{ active: currentIndex === index }"
                  @click="goToSlide(index)"
          ></span>
                </div>
            </div>
        </div>

        <!-- 电影内容区域 -->
        <div class="movie-content">
            <!-- 热门电影区域 -->
            <div class="movie-main">
                <div class="movie-nav">
                    <div class="section-header">
                        <h2>热门电影</h2>
                        <div class="nav-tabs">
              <span
                      v-for="tab in movieTabs"
                      :key="tab.value"
                      :class="{ 'active': activeMovieTab === tab.value }"
                      @click="changeMovieTab(tab.value)"
              >
                {{ tab.label }}
              </span>
                        </div>
                    </div>
                </div>

                <!-- 电影列表 -->
                <div class="movie-list">
                    <!-- 加载状态 -->
                    <div v-if="loading" class="loading-container">
                        <el-skeleton :rows="6" animated />
                    </div>

                    <!-- 电影列表内容 -->
                    <template v-else>
                        <div class="movie-grid">
                            <div
                                    class="movie-card"
                                    v-for="movie in paginatedMovies"
                                    :key="movie.mid"
                                    @click="goToMovieDetail(movie.mid)"
                            >
                                <div class="poster-container">
                                    <img :src="require('../assets/img/'+movie.poster)" :alt="movie.name" />
                                    <div class="movie-rating">
                                        <span>{{ movie.score?.toFixed(1) || '0.0' }}</span>
                                    </div>
                                </div>
                                <div class="movie-info">
                                    <h3>{{ movie.name }}</h3>
                                    <!-- 显示年份和类型，从后端数据结构中提取 -->
                                    <p class="meta">{{ formatYear(movie.year) }} · {{ getMovieType(movie) }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- 分页控件 -->
                        <div class="pagination" v-if="filteredMovies.length > pageSize">
                            <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    :total="filteredMovies.length"
                                    :page-size="pageSize"
                                    :current-page="currentPage"
                                    @current-change="handlePageChange"
                            />
                        </div>
                    </template>
                </div>
            </div>

            <!-- 电影排行榜 -->
            <div class="movie-rank">
                <div class="rank-header">
                    <h2>电影排行榜</h2>
                    <div class="rank-tabs">
            <span
                    :class="{ active: rankType === 'rating' }"
                    @click="rankType = 'rating'"
            >
              评分排行
            </span>
                        <span
                                :class="{ active: rankType === 'views' }"
                                @click="rankType = 'views'"
                        >
              播放排行
            </span>
                    </div>
                </div>

                <!-- 排行榜加载状态 -->
                <div v-if="loading" class="loading-container">
                    <el-skeleton :rows="5" animated />
                </div>

                <!-- 排行榜内容 -->
                <div v-else class="rank-list">
                    <div
                            class="rank-item"
                            v-for="(movie, index) in rankedMovies"
                            :key="movie.mid"
                            @click="goToMovieDetail(movie.mid)"
                    >
            <span class="rank-index" :class="{ top3: index < 3 }">
              {{ index + 1 }}
            </span>
                        <span class="rank-title">{{ movie.name }}</span>
                        <span class="rank-value">
              {{ rankType === 'rating' ? movie.score?.toFixed(1) || '0.0' : formatViewCount(movie.seen) }}
            </span>
                    </div>
                </div>
            </div>

            <!-- 新增：动态广告区域 -->
            <div class="ad-container" v-show="showAd" :class="{ 'ad-animate': isAdAnimating }">
                <div class="ad-content">
            <span class="ad-close" @click="closeAd">
                <i class="el-icon-close"></i>
            </span>
                    <a href="https://www.hua.com/?sid=bing-j001-PC-22846565754&utm_source=bing&utm_medium=cpc&utm_term=PC-{keywordid}-A001-%E7%BD%91%E4%B8%8A%E8%B4%AD%E8%8A%B1&msclkid=f9c3c872e6981b4f4eeba03b74a743d8" target="_blank">
                        <img :src="require('../assets/img/' + currentAdImage)" :alt="'广告' + (currentAdIndex + 1)">
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: `index`,
        data() {
            return {
                userInfo: {},
                uname: '',
                // 搜索相关
                searchQuery: '',

                // 电影列表相关
                loading: false,
                movies: [], // 从后端获取的所有电影数据

                // 分类标签
                movieTabs: [
                    { value: 'all', label: '全部' },
                    { value: 'Chinese', label: '中国大陆' },
                    { value: 'America', label: '美国' },
                    { value: 'Japan', label: '日本' },
                    { value: 'Korea', label: '韩国' },
                    { value: 'Britain', label: '英国' },
                    { value: 'France', label: '法国' },
                    { value: 'India', label: '印度' }
                ],
                activeMovieTab: 'all', // 当前选中的电影分类

                // 分页相关
                currentPage: 1,
                pageSize: 6, // 每页显示6部电影

                // 排行榜相关
                rankType: 'rating', // rating-评分排行 views-热度排行

                // 轮播图相关（保持不变）
                banners: [
                    {
                        id: 1,
                        image: 'https://x0.ifengimg.com/ucms/2023_35/4E90ECD5902D7222140B691453F8B54B397B8201_size576_w1600_h2370.jpg',
                        title: '奥本海默',
                        description: '美国理论物理学家罗伯特·奥本海默在二战期间领导曼哈顿计划...',
                        rating: 8.8
                    },
                    {
                        id: 2,
                        image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.SQOgClQRwdpVLkBhFWpK7AHaKb?r=0&rs=1&pid=ImgDetMain',
                        title: '流浪地球2',
                        description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器...',
                        rating: 8.3
                    },
                    {
                        id: 3,
                        image: 'https://x0.ifengimg.com/ucms/2023_23/F3EA2C0074CF6D607B37EA3C2EEF2D70A30C8B65_size588_w1024_h1395.jpg',
                        title: '封神第一部',
                        description: '商王殷寿与狐妖妲己勾结，暴虐无道，引发天谴...',
                        rating: 7.8
                    },
                    {
                        id: 4,
                        image: 'https://th.bing.com/th/id/R.e9ece525cc756dc7daa60e5d24e32473?rik=Mmxn5yeoCrjciQ&riu=http%3a%2f%2fpuui.qpic.cn%2fvcover_vt_pic%2f0%2fc2seabnsfozypl81523522065%2f0&ehk=QQZly%2bd5Tbd4Oq511mmYT0oaV7fHNuIHCSZg6tjn4EU%3d&risl=&pid=ImgRaw&r=0',
                        title: '星际穿越',
                        description: '一群探险家利用他们针对虫洞的新发现，超越人类对于太空旅行的极限...',
                        rating: 9.3
                    },
                    {
                        id: 5,
                        image: 'https://img0.sucaisucai.com/08/68/08468730_1.jpg',
                        title: '盗梦空间',
                        description: '一名能够潜入人们梦境窃取潜意识秘密的盗梦者...',
                        rating: 9.3
                    }
                ],
                currentIndex: 1,
                translateX: 0,
                isDragging: false,
                startX: 0,
                currentTranslate: 0,
                dragOffset: 0,
                carouselInterval: null,

                // 新增：广告相关数据
                showAd: true, // 控制广告显示
                isAdAnimating: false, // 控制广告动画
                adTimer: null, // 广告定时器
                closeTimer: null, // 关闭后重新显示的定时器
                currentAdIndex: 0, // 当前显示的广告索引
                adImages: [ // 五张广告图片
                    '广告1.jpg',
                    '广告2.jpg',
                    '广告3.jpg',
                    '广告4.jpg',
                    '广告5.jpg'
                ]
            }
        },
        computed: {
            // 新增：当前广告图片计算属性
            currentAdImage() {
                return this.adImages[this.currentAdIndex];
            },
            /**
             * 筛选后的电影列表
             * 根据当前选中的地区标签筛选电影
             */
            filteredMovies() {
                if (this.activeMovieTab === 'all') {
                    return this.movies;
                }

                // 根据当前选中的标签筛选电影
                return this.movies.filter(movie => {
                    // 从category1中获取地区信息
                    const area = movie.category1?.area || '';
                    // 将地区转换为英文进行比较
                    const areaMap = {
                        '美国': 'America',
                        '日本': 'Japan',
                        '韩国': 'Korea',
                        '英国': 'Britain',
                        '中国大陆':'Chinese',
                        '法国':'France',
                        '印度':'India'
                    };
                    return areaMap[area] === this.activeMovieTab;
                });
            },

            /**
             * 分页后的电影列表
             */
            paginatedMovies() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.filteredMovies.slice(start, end);
            },

            /**
             * 排行榜电影列表
             */
            rankedMovies() {
                // 根据当前排行类型排序
                const sorted = [...this.movies].sort((a, b) => {
                    if (this.rankType === 'rating') {
                        return (b.score || 0) - (a.score || 0);
                    } else {
                        return (b.seen || 0) - (a.seen || 0);
                    }
                });

                // 只返回前10名
                return sorted.slice(0, 10);
            }
        },
        async created() {
            // 组件创建时获取电影数据
            await this.fetchMovies();
        },
        mounted() {
            // 初始化用户信息
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.uname = this.userInfo.uname;

            // 初始化轮播图
            this.startCarousel();
            this.calculateTranslateX();

            // 新增：启动广告动画
            this.startAdAnimation();
        },
        beforeUnmount() {
            // 清除轮播图定时器
            clearInterval(this.carouselInterval);

            // 新增：清除广告相关定时器
            clearInterval(this.adTimer);
            clearTimeout(this.closeTimer);
        },
        methods: {

            /**
             * 从后端获取电影数据
             * 根据您提供的后端数据结构进行调整
             */
            async fetchMovies() {
                this.loading = true;
                try {
                    // 发送GET请求获取电影数据
                    const response = await axios.get('http://localhost:8081/movie/selectByCategory');
                    this.movies = response.data;
                } catch (error) {
                    console.error('获取电影数据失败:', error);
                    this.$message.error('获取电影数据失败，请稍后重试');
                } finally {
                    this.loading = false;
                }
            },


            /**
             * 从电影数据中提取类型信息
             * @param {Object} movie - 电影对象
             * @returns {string} 电影类型字符串
             */
            getMovieType(movie) {
                // 从category2中获取类型信息
                return movie.category2?.type || '未知类型';
            },

            /**
             * 格式化年份，只保留年份部分
             * @param {string} date - 日期字符串，如"1997-05-20"
             * @returns {string} 年份，如"1997"
             */
            formatYear(date) {
                if (!date) return '未知年份';
                return date.split('-')[0];
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
                    location.reload()
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
            },

            /**
             * 跳转到电影详情页
             * @param {number} mid - 电影ID
             */
            goToMovieDetail(mid) {
                // 使用路由跳转到详情页，传递电影ID
                this.$router.push({
                    name: 'MovieDetail',
                    params: { mid: mid }
                });
            },

            /**
             * 切换电影分类标签
             * @param {string} tab - 选中的标签值
             */
            changeMovieTab(tab) {
                this.activeMovieTab = tab;
                this.currentPage = 1; // 切换分类时重置到第一页
            },

            /**
             * 处理分页变化
             * @param {number} page - 新的页码
             */
            handlePageChange(page) {
                this.currentPage = page;
                // 滚动到电影列表顶部，提升用户体验
                this.$nextTick(() => {
                    const movieList = document.querySelector('.movie-list');
                    if (movieList) {
                        movieList.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            },

            /**
             * 格式化观看人数
             * @param {number} seen - 观看人数
             * @returns {string} 格式化后的观看人数
             */
            formatViewCount(seen) {
                if (!seen) return '0';
                if (seen >= 10000) {
                    return (seen / 10000).toFixed(1) + '万';
                }
                return seen.toString();
            },

            // 以下是轮播图相关方法（保持不变）
            startCarousel() {
                this.carouselInterval = setInterval(() => {
                    this.nextSlide();
                }, 10000);
            },
            prevSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
                this.calculateTranslateX();
                this.resetCarouselInterval();
            },
            nextSlide() {
                this.currentIndex = (this.currentIndex + 1) % this.banners.length;
                this.calculateTranslateX();
                this.resetCarouselInterval();
            },
            goToSlide(index) {
                this.currentIndex = index;
                this.calculateTranslateX();
                this.resetCarouselInterval();
            },
            calculateTranslateX() {
                const itemWidth = 600; // 轮播图项宽度
                const containerWidth = document.querySelector('.banner-container')?.offsetWidth || 1200;
                this.translateX = containerWidth / 2 - itemWidth / 2 - this.currentIndex * itemWidth;
            },
            resetCarouselInterval() {
                clearInterval(this.carouselInterval);
                this.startCarousel();
            },
            startDrag(e) {
                this.isDragging = true;
                this.startX = e.clientX || e.touches[0].clientX;
                this.currentTranslate = this.translateX;
                this.dragOffset = 0;
                document.body.style.cursor = 'grabbing';
            },
            handleDrag(e) {
                if (!this.isDragging) return;
                e.preventDefault();
                const currentX = e.clientX || e.touches[0].clientX;
                this.dragOffset = currentX - this.startX;
                this.translateX = this.currentTranslate + this.dragOffset;
            },
            endDrag() {
                if (!this.isDragging) return;
                this.isDragging = false;
                document.body.style.cursor = '';

                if (Math.abs(this.dragOffset) > 100) {
                    if (this.dragOffset > 0) {
                        this.prevSlide();
                    } else {
                        this.nextSlide();
                    }
                } else {
                    this.calculateTranslateX();
                }
            },

            /**
             * 启动广告动画和轮换
             */
            startAdAnimation() {
                // 每2秒切换一次广告
                this.adTimer = setInterval(() => {
                    if (this.showAd) {
                        // 切换到下一张广告
                        this.currentAdIndex = (this.currentAdIndex + 1) % this.adImages.length;

                        // 执行缩放动画
                        this.isAdAnimating = true;
                        setTimeout(() => {
                            this.isAdAnimating = false;
                        }, 1000);
                    }
                }, 3000); // 3秒切换一次
            },

            /**
             * 关闭广告
             */
            closeAd() {
                this.showAd = false;
                // 5秒后重新显示广告
                this.closeTimer = setTimeout(() => {
                    this.showAd = true;
                    // 重置广告索引为0
                    this.currentAdIndex = 0;
                }, 5000);
            }
        }
    }
</script>

<style scoped>
    /* 原有样式保持不变 */
    .home-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
        margin-top: -50px;
    }

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
    }

    /* Logo样式 */
    .logo img {
        width: 150px;
        height: 50px;
        object-fit: contain;
        transition: all 0.3s;
    }

    /* 搜索框样式 */
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

    /* 导航链接样式 */
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
    }

    .nav-links a:hover {
        color: #222bb5;
    }

    .nav-links a.router-link-exact-active {
        color: #222bb5;
        border-bottom: 2px solid #00b51d;
    }

    /* 轮播图容器样式 */
    .banner-container {
        margin: 30px 0 50px;
        position: relative;
        overflow: hidden;
        height: 450px;
        width: 100%;
        cursor: grab;
        user-select: none;
    }

    .banner-container:active {
        cursor: grabbing;
    }

    /* 轮播图轨道样式 */
    .custom-carousel {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .carousel-track {
        display: flex;
        height: 100%;
        align-items: center;
        will-change: transform;
    }

    /* 轮播图项样式 */
    .carousel-item {
        flex: 0 0 60%;
        height: 80%;
        position: relative;
        transition: all 0.5s ease;
        cursor: pointer;
        margin: 0 -10%;
        z-index: 1;
        transform-origin: center center;
    }

    .carousel-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    /* 当前活动轮播图项样式 */
    .carousel-item.active {
        flex: 0 0 80%;
        height: 100%;
        z-index: 2;
        margin: 0 -5%;
        opacity: 1;
        transform: scale(1);
    }

    /* 非活动轮播图项样式 */
    .carousel-item:not(.active) {
        opacity: 0.7;
        transform: scale(0.9);
        filter: brightness(0.8);
    }

    /* 轮播图信息样式 */
    .banner-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        color: white;
        border-radius: 0 0 12px 12px;
    }

    .banner-info h3 {
        font-size: 28px;
        margin-bottom: 10px;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    }

    .banner-info p {
        font-size: 16px;
        margin-bottom: 15px;
        max-width: 70%;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    /* 轮播图控制按钮样式 */
    .carousel-controls {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        z-index: 3;
    }

    .control {
        width: 50px;
        height: 50px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .control:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }

    .control i {
        color: white;
        font-size: 24px;
        font-weight: bold;
    }

    /* 轮播图指示器样式 */
    .carousel-indicators {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        gap: 12px;
        z-index: 3;
    }

    .carousel-indicators span {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .carousel-indicators span.active {
        background-color: white;
        transform: scale(1.3);
    }

    /* 电影内容区域布局 */
    .movie-content {
        display: flex;
        gap: 30px;
        position: relative; /* 新增：为广告定位提供参考 */
    }

    /* 主内容区域 */
    .movie-main {
        flex: 1;
    }

    /* 电影分类导航样式 */
    .movie-nav {
        margin-bottom: 20px;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }

    .section-header h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
        font-weight: 600;
    }

    /* 分类标签样式 */
    .nav-tabs {
        display: flex;
        margin-left: 30px;
    }

    .nav-tabs span {
        margin-left: 25px;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        position: relative;
        padding-bottom: 5px;
        font-weight: 500;
    }

    .nav-tabs span:hover {
        color: #00b51d;
    }

    .nav-tabs span.active {
        color: #00b51d;
        font-weight: bold;
    }

    .nav-tabs span.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #00b51d;
    }

    /* 电影列表样式 - 每行3部电影 */
    .movie-list {
        margin-bottom: 50px;
    }

    .movie-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
    }

    /* 电影卡片样式 */
    .movie-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .movie-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    /* 海报容器样式 */
    .poster-container {
        position: relative;
        padding-top: 140%;
        overflow: hidden;
    }

    .poster-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .movie-card:hover .poster-container img {
        transform: scale(1.05);
    }

    /* 电影评分样式 */
    .movie-rating {
        position: absolute;
        right: 10px;
        top: 10px;
        background-color: rgba(0, 181, 29, 0.9);
        color: white;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: center;
    }

    /* 电影信息样式 */
    .movie-info {
        padding: 15px;
    }

    .movie-info h3 {
        font-size: 16px;
        margin: 0 0 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
    }

    .movie-info .meta {
        font-size: 13px;
        color: #999;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 36px;
    }

    /* 排行榜区域样式 */
    .movie-rank {
        width: 280px;
    }

    .rank-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }

    .rank-header h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
        font-weight: 600;
    }

    /* 排行榜标签样式 */
    .rank-tabs {
        display: flex;
        gap: 15px;
    }

    .rank-tabs span {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
    }

    .rank-tabs span:hover {
        color: #00b51d;
    }

    .rank-tabs span.active {
        color: #00b51d;
        font-weight: bold;
        background-color: rgba(0, 181, 29, 0.1);
    }

    /* 排行榜列表样式 */
    .rank-list {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        padding: 15px;
    }

    .rank-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: all 0.2s;
    }

    .rank-item:last-child {
        border-bottom: none;
    }

    .rank-item:hover {
        background-color: #f9f9f9;
    }

    /* 排行榜序号样式 */
    .rank-index {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 50%;
        margin-right: 15px;
        font-size: 14px;
        color: #666;
    }

    .rank-index.top3 {
        background-color: #00b51d;
        color: white;
        font-weight: bold;
    }

    /* 排行榜标题样式 */
    .rank-title {
        flex: 1;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* 排行榜数值样式 */
    .rank-value {
        font-size: 14px;
        color: #00b51d;
        font-weight: bold;
        margin-left: 10px;
    }

    /* 新增：广告区域样式 */
    .ad-container {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 300px;
        height: 600px;
        z-index: 100;
    }

    .ad-content {
        position: relative;
        border-radius: 8px;
        margin-top: 20px;
        overflow: hidden;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }

    .ad-content img {
        width: 100%;
        height: 400px;
        display: block;
        transition: transform 0.3s;
    }

    .ad-content:hover img {
        transform: scale(1.02);
    }

    .ad-close {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 24px;
        height: 24px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 101;
        transition: all 0.3s;
    }

    .ad-close:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    .ad-close i {
        color: white;
        font-size: 14px;
    }

    /* 广告动画效果 */
    .ad-animate {
        animation: adPulse 1s ease-in-out;
    }

    @keyframes adPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    /* 响应式设计 */
    @media (max-width: 992px) {
        .movie-content {
            flex-direction: column;
        }

        .movie-rank {
            width: 100%;
            margin-top: 30px;
        }

        /* 新增：响应式调整广告位置 */
        .ad-container {
            position: static;
            width: 100%;
            margin-top: 30px;
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

        .banner-container {
            height: 300px;
            margin: 20px 0 30px;
        }

        .banner-info h3 {
            font-size: 20px;
        }

        .banner-info p {
            font-size: 14px;
            max-width: 90%;
        }

        .movie-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
    }

    @media (max-width: 576px) {
        .movie-grid {
            grid-template-columns: 1fr;
        }

        .nav-tabs {
            margin-left: 15px;
        }

        .nav-tabs span {
            margin-left: 15px;
            font-size: 14px;
        }

        /* 加载状态样式 */
        .loading-container {
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        /* 分页样式 */
        .pagination {
            margin-top: 30px;
            display: flex;
            justify-content: center;
        }

        /* 默认海报样式 */
        .movie-card img {
            background-color: #f5f5f5;
        }

        /* 响应式设计调整 */
        @media (max-width: 768px) {
            .pagination {
                margin-top: 20px;
            }

            .movie-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }

        @media (max-width: 480px) {
            .movie-grid {
                grid-template-columns: 1fr !important;
            }
        }
    }
</style>