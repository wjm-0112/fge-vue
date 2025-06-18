<template>
    <div class="movie-detail-container">
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

        <!-- 电影详情主体内容 -->
        <div class="movie-main-content">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-container">
                <el-skeleton :rows="10" animated/>
            </div>

            <!-- 电影详情内容 -->
            <div v-else class="movie-detail-content">
                <!-- 电影基本信息区 -->
                <div class="movie-basic-info">
                    <!-- 海报 -->
                    <div class="poster-container">
                        <img :src="require('../assets/img/'+movie.poster)" :alt="movie.name" class="movie-poster">
                    </div>

                    <!-- 电影基本信息 -->
                    <div class="movie-info">
                        <h1 class="movie-title">{{ movie.name }}</h1>

                        <!-- 评分和基本信息 -->
                        <div class="meta-info">
                            <!-- 评分区域 -->
                            <div class="rating-container">
                                <div class="rating-display">
                                    <el-rate
                                            v-model="movie.score"
                                            disabled
                                            :max="5"
                                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                            text-color="#ff9900"
                                    />
                                    <span class="score-text">{{ (movie.score * 2).toFixed(1) }}分</span>
                                </div>

                                <!-- 统计信息 -->
                                <div class="rating-count">
                                    <span class="collect-count">{{ formatNumber(movie.collection) }}人收藏</span>
                                    <span class="seen-count">{{ formatNumber(movie.seen) }}人看过</span>
                                </div>

                                <!-- 操作按钮区域 - 调整后的布局 -->
                                <div class="action-buttons">
                                    <el-button
                                            type="danger"
                                            class="collect-btn"
                                            :icon="isCollected ? 'el-icon-star-on' : 'el-icon-star-off'"
                                            @click="toggleCollect"
                                            :loading="collectLoading">
                                        {{ isCollected ? '已收藏' : '收藏' }}
                                    </el-button>
                                    <el-button
                                            type="primary"
                                            class="seen-btn"
                                            :icon="isSeen ? 'el-icon-check' : 'el-icon-view'"
                                            @click="toggleSeen"
                                            :loading="seenLoading">
                                        {{ isSeen ? '已看过' : '看过' }}
                                    </el-button>
                                </div>
                            </div>

                            <!-- 电影元信息 -->
                            <div class="basic-meta">
                                <div class="meta-item">
                                    <i class="el-icon-date meta-icon"></i>
                                    <span class="meta-label">时间：</span>
                                    <span class="meta-value">{{ formatDate(movie.year) }}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="el-icon-time meta-icon"></i>
                                    <span class="meta-label">片长：</span>
                                    <span class="meta-value">{{ movie.time }} 分钟</span>
                                </div>
                                <div class="meta-item">
                                    <i class="el-icon-location-information meta-icon"></i>
                                    <span class="meta-label">地区：</span>
                                    <span class="meta-value">{{ movie.category1?.area || '未知' }}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="el-icon-collection-tag meta-icon"></i>
                                    <span class="meta-label">类型：</span>
                                    <span class="meta-value">{{ movie.category2?.type || '未知' }}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="el-icon-user-solid meta-icon"></i>
                                    <span class="meta-label">导演：</span>
                                    <span class="meta-value">{{ movie.director }}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="el-icon-user meta-icon"></i>
                                    <span class="meta-label">主演：</span>
                                    <span class="meta-value">{{ movie.actor }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 电影简介 -->
                <div class="movie-description">
                    <h2 class="section-title">
                        <i class="el-icon-notebook-2"></i>
                        剧情简介
                    </h2>
                    <p class="description-text">{{ movie.description || '暂无简介' }}</p>
                </div>

                <!-- 评论区域 -->
                <div class="comment-section">
                    <h2 class="section-title">
                        <i class="el-icon-chat-dot-round"></i>
                        观众评论
                    </h2>

                    <!-- 评论输入框 -->
                    <div class="comment-input">
                        <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="写下你的观后感..."
                                v-model="commentContent"
                                maxlength="200"
                                show-word-limit
                        ></el-input>
                        <div class="comment-actions">
                            <div class="rating-wrapper">
                                <span class="rating-label">评分：</span>
                                <el-rate
                                        v-model="commentRating"
                                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                ></el-rate>
                            </div>
                            <el-button
                                    type="primary"
                                    size="small"
                                    @click="submitComment"
                                    :disabled="!commentContent"
                                    class="submit-btn"
                            >
                                发表评论
                            </el-button>
                        </div>
                    </div>

                    <!-- 评论列表 -->
                    <div class="comment-list">
                        <div class="comment-item" v-for="comment in comments" :key="comment.id">
                            <div class="comment-user">
                                <img :src="comment.avatar || defaultAvatar" class="user-avatar">
                                <span class="user-name">{{ comment.uname }}</span>
                            </div>
                            <div class="comment-content">
                                <p class="comment-text">{{ comment.content }}</p>
                                <div class="comment-meta">
                                    <span class="comment-time">{{ formatTime(comment.ctime) }}</span>
                                    <div class="comment-actions">
                                        <el-button
                                                type="text"
                                                icon="el-icon-thumb"
                                                @click="likeComment(comment.id)"
                                                class="like-btn"
                                                :style="{color: comment.liked ? '#F56C6C' : '#666'}"
                                        >
                                            {{ comment.likes || 0 }}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 无评论提示 -->
                        <div class="empty-comment" v-if="comments.length === 0">
                            <el-empty description="暂无评论，快来发表第一条评论吧~"></el-empty>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: `MovieDetail`,
        data() {
            return {
                userInfo: {},
                uname: '',
                searchQuery: '',
                loading: false,
                collectLoading: false, // 收藏按钮加载状态
                seenLoading: false,   // 看过按钮加载状态
                movie: {
                    mid: 0,
                    name: '',
                    time: 0,
                    director: '',
                    actor: '',
                    category1: {},
                    category2: {},
                    description: '',
                    score: 0,
                    collection: 0,
                    seen: 0,
                    year: '',
                    poster: ''
                },
                isCollected: false, // 是否已收藏
                isSeen: false,     // 是否已看过
                comments: [],      // 评论列表
                commentContent: '', // 评论输入内容
                defaultAvatar: require('../assets/img/用户头像.jpg'),
                commentRating: 5,
            }
        },
        created() {
            // 从路由参数或本地存储获取电影ID
            const mid = this.$route.params.mid || localStorage.getItem('currentMovieId');

            if (mid) {
                // 保存当前电影ID到本地存储
                localStorage.setItem('currentMovieId', mid);
                this.fetchMovieDetail(mid);
                this.fetchComments(mid);
            } else {
                this.$message.error('无法获取电影ID');
                this.$router.push('/');
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
        beforeDestroy() {
            // 组件销毁时清除存储的movieId
            localStorage.removeItem('currentMovieId');
        },
        methods: {
            /**
             * 获取电影详情
             * @param {number} mid - 电影ID
             */
            async fetchMovieDetail(mid) {
                this.loading = true;
                try {
                    const response = await axios.get(`http://localhost:8081/movie/findById?mid=${mid}`);
                    this.movie = response.data;
                    // 将10分制转换为5分制显示(前端展示用)
                    this.movie.score = this.movie.score / 2;

                    // 检查是否已收藏和已看过
                    if (this.uname) {
                        await this.checkCollectionStatus(mid);
                        await this.checkSeenStatus(mid);
                    }
                } catch (error) {
                    console.error('获取电影详情失败:', error);
                    this.$message.error('获取电影详情失败');
                    this.$router.push('/');
                } finally {
                    this.loading = false;
                }
            },

            /**
             * 获取评论列表
             * @param {number} mid - 电影ID
             */
            async fetchComments(mid) {
                try {
                    const response = await axios.get(`http://localhost:8081/comment/findCommentMo?mid=${mid}`);
                    this.comments = response.data.list || [];
                    // 标记用户是否已点赞
                    if (this.uname) {
                        this.comments.forEach(comment => {
                            comment.liked = comment.likedBy && comment.likedBy.includes(this.uname);
                        });
                    }
                } catch (error) {
                    console.error('获取评论失败:', error);
                }
            },

            /**
             * 检查收藏状态
             * @param {number} mid - 电影ID
             */
            async checkCollectionStatus(mid) {
                try {
                    const response = await axios.get(`http://localhost:8081/userCollection/findUserCollectionMo?mid=${mid}`);
                    // 根据接口返回的数据结构判断是否已收藏
                    const userCollection = response.data.list?.find(item => item.uname === this.uname);
                    this.isCollected = !!userCollection;
                } catch (error) {
                    console.error('检查收藏状态失败:', error);
                }
            },

            /**
             * 检查看过状态
             * @param {number} mid - 电影ID
             */
            async checkSeenStatus(mid) {
                try {
                    const response = await axios.get(`http://localhost:8081/userSeen/findUserSeenMo?mid=${mid}`);
                    // 根据接口返回的数据结构判断是否已看过
                    const userSeen = response.data.list?.find(item => item.uname === this.uname);
                    this.isSeen = !!userSeen;
                } catch (error) {
                    console.error('检查看过状态失败:', error);
                }
            },

            /**
             * 切换收藏状态
             */
            async toggleCollect() {
                if (!this.uname) {
                    this.$message.warning('请先登录');
                    return;
                }

                this.collectLoading = true;
                try {
                    if (this.isCollected) {
                        // 取消收藏
                        const response = await axios.get(`http://localhost:8081/userCollection/delUserCollection?mid=${this.movie.mid}`);
                        if (response.data === true) {
                            this.isCollected = false;
                            this.movie.collection -= 1;
                            this.$message.success('已取消收藏');
                        }
                    } else {
                        // 调用收藏接口
                        const response = await axios.get(`http://localhost:8081/userCollection/addUserCollection?mid=${this.movie.mid}&uname=${this.uname}&mname=${this.movie.name}`);

                        if (response.data === true) {
                            this.isCollected = true;
                            this.movie.collection += 1;
                            this.$message.success('收藏成功');
                        }
                    }
                } catch (error) {
                    console.error('操作收藏失败:', error);
                    this.$message.error('操作失败');
                } finally {
                    this.collectLoading = false;
                }
            },

            /**
             * 切换看过状态
             */
            async toggleSeen() {
                if (!this.uname) {
                    this.$message.warning('请先登录');
                    return;
                }

                this.seenLoading = true;
                try {
                    if (this.isSeen) {
                        // 取消看过
                        const response = await axios.get(`http://localhost:8081/userSeen/delUserSeen?mid=${this.movie.mid}`);
                        if (response.data === true) {
                            this.isSeen = false;
                            this.movie.seen -= 1;
                            this.$message.success('已取消看过标记');
                        }
                    } else {
                        // 调用看过接口
                        const response = await axios.get(`http://localhost:8081/userSeen/addUserSeen?mid=${this.movie.mid}&uname=${this.uname}&mname=${this.movie.name}`);

                        if (response.data === true) {
                            this.isSeen = true;
                            this.movie.seen += 1;
                            this.$message.success('已标记为看过');
                        }
                    }
                } catch (error) {
                    console.error('操作看过状态失败:', error);
                    this.$message.error('操作失败');
                } finally {
                    this.seenLoading = false;
                }
            },

            /**
             * 提交评论
             */
            async submitComment() {
                if (!this.uname) {
                    this.$message.warning('请先登录');
                    return;
                }

                if (!this.commentContent.trim()) {
                    this.$message.warning('评论内容不能为空');
                    return;
                }

                try {
                    const rating = this.commentRating;

                    // 获取当前时间，格式化为YYYY-MM-DD
                    const commentData = {
                        mid: this.movie.mid,
                        uname: this.uname,
                        mname: this.movie.name,
                        content: this.commentContent,
                        rating: rating
                    };

                    // 调用添加评论接口
                    const response = await axios.post(`http://localhost:8081/comment/addComment?mid=${commentData.mid}&uname=${commentData.uname}&mname=${commentData.mname}&content=${commentData.content}&rating=${commentData.rating}`, commentData);

                    if (response.data === true) {
                        this.$message.success('评论成功');
                        // 添加新评论到列表顶部
                        this.comments.unshift({
                            uname: this.uname,
                            mid: this.movie.mid,
                            mname: this.movie.name,
                            content: this.commentContent,
                            likes: 0,
                            liked: false,
                            ctime: new Date().toISOString()
                        });
                        // 清空输入框
                        this.commentContent = '';
                        this.commentRating = 5;
                    } else {
                        this.$message.error('评论失败');
                    }
                } catch (error) {
                    console.error('提交评论失败:', error);
                    this.$message.error('评论失败');
                }
            },

            /**
             * 点赞评论
             * @param {number} commentId - 评论ID
             */
            async likeComment(commentId) {
                if (!this.uname) {
                    this.$message.warning('请先登录');
                    return;
                }

                try {
                    const comment = this.comments.find(c => c.id === commentId);
                    if (!comment) return;

                    // 如果已经点赞，则取消点赞
                    if (comment.liked) {
                        await axios.post(`http://localhost:8081/comment/unlike`, {
                            commentId: commentId,
                            uname: this.uname
                        });
                        comment.likes -= 1;
                        comment.liked = false;
                    } else {
                        // 否则点赞
                        await axios.post(`http://localhost:8081/comment/like`, {
                            commentId: commentId,
                            uname: this.uname
                        });
                        comment.likes += 1;
                        comment.liked = true;
                    }
                } catch (error) {
                    console.error('点赞操作失败:', error);
                    this.$message.error('操作失败');
                }
            },

            /**
             * 格式化日期
             * @param {string} dateStr - 日期字符串
             * @returns {string} 格式化后的日期
             */
            formatDate(dateStr) {
                if (!dateStr) return '未知';
                const date = new Date(dateStr);
                return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            },

            /**
             * 格式化数字
             * @param {number} num - 数字
             * @returns {string} 格式化后的字符串
             */
            formatNumber(num) {
                if (!num) return '0';
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            /**
             * 格式化时间
             * @param {string} timeStr - 时间字符串
             * @returns {string} 格式化后的时间
             */
            formatTime(timeStr) {
                if (!timeStr) return '';
                const date = new Date(timeStr);
                const now = new Date();
                const diff = now - date;

                if (diff < 60 * 1000) return '刚刚';
                if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`;
                if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
                if (diff < 30 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;

                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            },

            /**
             * 跳转到电影详情
             * @param {number} mid - 电影ID
             */
            goToMovieDetail(mid) {
                localStorage.setItem('currentMovieId', mid);
                this.$router.push({
                    name: 'MovieDetail',
                    params: { mid: mid }
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
    /* 基础样式 */
    .movie-detail-container {
        margin-top: -50px;
        background-color: #f5f7fa;
        min-height: 100vh;
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
        transition: color 0.3s;
    }

    .nav-links a:hover {
        color: #222bb5;
    }

    .nav-links a.router-link-exact-active {
        color: #222bb5;
        border-bottom: 2px solid #00b51d;
    }

    /* 电影详情主体内容 */
    .movie-main-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 20px;
    }

    /* 加载状态 */
    .loading-container {
        padding: 40px;
        background: #fff;
        border-radius: 8px;
        margin-top: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }

    /* 电影基本信息区 */
    .movie-basic-info {
        display: flex;
        margin-bottom: 40px;
        background: #fff;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        position: relative;
        overflow: hidden;
    }

    /* 海报容器样式 */
    .poster-container {
        position: relative;
        width: 280px;
        min-width: 280px;
        margin-right: 40px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s;
    }

    .poster-container:hover {
        transform: translateY(-5px);
    }

    .movie-poster {
        width: 100%;
        height: 400px;
        object-fit: cover;
        display: block;
    }

    /* 电影信息区域 */
    .movie-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .movie-title {
        font-size: 32px;
        margin: 0 0 20px 0;
        color: #333;
        font-weight: 600;
        line-height: 1.3;
    }

    /* 元信息区域 */
    .meta-info {
        display: flex;
        margin-bottom: 20px;
        gap: 40px;
    }

    /* 评分区域 */
    .rating-container {
        width: 280px;
        min-width: 280px;
        display: flex;
        flex-direction: column;
    }

    /* 评分显示区域 */
    .rating-display {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
    }

    .rating-display >>> .el-rate {
        margin-bottom: 5px;
    }

    .score-text {
        font-size: 24px;
        font-weight: bold;
        color: #FF9900;
        margin: 5px 0;
    }

    /* 统计信息 */
    .rating-count {
        display: flex;
        gap: 15px;
        font-size: 14px;
        color: #666;
        margin-bottom: 20px;
    }

    /* 操作按钮区域 - 调整后的布局 */
    .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }

    .collect-btn {
        width: 100%;
        font-weight: bold;
        border-radius: 20px;
        padding: 12px;
        font-size: 16px;
        transition: all 0.3s;
    }
    .seen-btn{
        width: 100%;
        font-weight: bold;
        border-radius: 20px;
        padding: 12px;
        font-size: 16px;
        transition: all 0.3s;
        margin-left: 0px;
    }

    .collect-btn {
        background-color: #F56C6C;
        border-color: #F56C6C;
    }

    .collect-btn:hover {
        background-color: #f78989;
        border-color: #f78989;
        transform: translateY(-2px);
    }

    .seen-btn {
        background-color: #409EFF;
        border-color: #409EFF;
    }

    .seen-btn:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
        transform: translateY(-2px);
    }

    /* 基本元信息 */
    .basic-meta {
        flex: 1;
    }

    .meta-item {
        display: flex;
        margin-bottom: 12px;
        line-height: 1.5;
        align-items: center;
    }

    .meta-icon {
        margin-right: 8px;
        color: #409EFF;
        font-size: 16px;
    }

    .meta-label {
        color: #666;
        width: 70px;
        font-size: 15px;
        flex-shrink: 0;
    }

    .meta-value {
        color: #333;
        font-size: 15px;
        flex: 1;
        text-align: left;
    }

    /* 电影简介区域 */
    .movie-description {
        background: #fff;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .section-title {
        font-size: 22px;
        margin: 0 0 20px 0;
        color: #333;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
    }

    .section-title i {
        margin-right: 10px;
        color: #409EFF;
    }

    .description-text {
        font-size: 16px;
        line-height: 1.8;
        color: #555;
        margin: 0;
        white-space: pre-line;
    }

    /* 评论区域 */
    .comment-section {
        background: #fff;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    /* 评论输入区域 */
    .comment-input {
        margin-bottom: 30px;
    }

    .comment-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .rating-wrapper {
        display: flex;
        align-items: center;
    }

    .rating-label {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
    }

    .submit-btn {
        padding: 10px 25px;
        border-radius: 20px;
        font-weight: 500;
    }

    /* 评论列表 */
    .comment-list {
        border-top: 1px solid #eee;
        padding-top: 20px;
    }

    .comment-item {
        display: flex;
        margin-bottom: 25px;
        padding-bottom: 25px;
        border-bottom: 1px solid #f5f5f5;
    }

    .comment-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
    }

    /* 评论用户信息 */
    .comment-user {
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;
    }

    .user-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .user-name {
        font-size: 14px;
        color: #666;
        text-align: center;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        width: 100%;
    }

    /* 评论内容区域 */
    .comment-content {
        flex: 1;
    }

    .comment-text {
        font-size: 15px;
        line-height: 1.7;
        color: #333;
        margin: 10px 0;
    }

    /* 评论元信息 */
    .comment-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .comment-time {
        font-size: 13px;
        color: #999;
    }

    .like-btn {
        padding: 0;
        transition: all 0.3s;
    }

    .like-btn:hover {
        color: #F56C6C !important;
    }

    /* 无评论提示 */
    .empty-comment {
        padding: 40px 0;
        text-align: center;
    }

    /* 响应式设计 */
    @media (max-width: 992px) {
        .movie-basic-info {
            flex-direction: column;
        }

        .poster-container {
            width: 100%;
            margin-right: 0;
            margin-bottom: 25px;
        }

        .meta-info {
            flex-direction: column;
            gap: 20px;
        }

        .rating-container {
            width: 100%;
            min-width: auto;
        }
    }

    @media (max-width: 768px) {
        .header-content {
            height: auto;
            padding: 15px;
            flex-wrap: wrap;
        }

        .logo {
            order: 1;
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

        .movie-main-content {
            padding: 15px;
        }

        .movie-basic-info,
        .movie-description,
        .comment-section {
            padding: 20px;
        }

        .movie-title {
            font-size: 26px;
        }
    }

    @media (max-width: 576px) {
        .nav-links a {
            margin: 0 8px;
            font-size: 14px;
        }

        .movie-title {
            font-size: 22px;
        }

        .section-title {
            font-size: 19px;
        }

        .description-text {
            font-size: 15px;
        }

        .comment-user {
            width: 80px;
            margin-right: 15px;
        }

        .user-avatar {
            width: 50px;
            height: 50px;
        }
    }
</style>