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

        <!-- 个人中心内容区域 -->
        <div class="personal-content">
            <!-- 登录后才显示的内容 -->
            <template v-if="uname">
                <!-- 加载状态 -->
                <div v-if="loading" class="loading-container">
                    <el-skeleton :rows="10" animated />
                </div>

                <!-- 内容区域 -->
                <template v-else>
                    <!-- 用户资料卡片 -->
                    <div class="user-profile-card">
                        <!-- 顶部展示区 -->
                        <div class="profile-header">
                            <!-- 头像区域 -->
                            <div class="avatar-container">
                                <img :src="userInfo.avatar || defaultAvatar" alt="用户头像" class="user-avatar">
                                <div class="avatar-actions">
                                    <el-button type="text" icon="el-icon-camera" size="small">更换头像</el-button>
                                </div>
                            </div>

                            <!-- 基本信息展示 -->
                            <div class="profile-basic">
                                <!-- 用户名 -->
                                <div class="username-display">
                                    <h2 v-if="!isEditing">{{ userInfo.uname }}</h2>
                                    <el-input
                                            v-else
                                            v-model="editForm.uname"
                                            placeholder="用户名"
                                            size="medium"
                                    ></el-input>
                                </div>

                                <!-- 统计数据 -->
                                <div class="profile-stats">
                                    <div class="stat-item">
                                        <span class="stat-value">{{ collections.length || 0 }}</span>
                                        <span class="stat-label">收藏</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">{{ comments.length || 0 }}</span>
                                        <span class="stat-label">评论</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">{{ watchedMovies.length || 0 }}</span>
                                        <span class="stat-label">看过</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 详细信息区域 -->
                        <div class="profile-details">
                            <!-- 基本信息部分 -->
                            <div class="detail-section">
                                <h3 class="section-title">基本信息</h3>
                                <div class="detail-form">
                                    <!-- 用户名 -->
                                    <div class="form-row">
                                        <span class="form-label">用户名：</span>
                                        <div class="form-value">
                                            <span v-if="!isEditing">{{ userInfo.uname }}</span>
                                            <el-input
                                                    v-else
                                                    v-model="editForm.uname"
                                                    placeholder="用户名"
                                                    size="small"
                                            ></el-input>
                                        </div>
                                    </div>

                                    <!-- 邮箱 -->
                                    <div class="form-row">
                                        <span class="form-label">邮箱：</span>
                                        <div class="form-value">
                                            <span v-if="!isEditing">{{ userInfo.email || '未设置' }}</span>
                                            <el-input
                                                    v-else
                                                    v-model="editForm.email"
                                                    placeholder="邮箱"
                                                    size="small"
                                            ></el-input>
                                        </div>
                                    </div>

                                    <!-- 密码 -->
                                    <div class="form-row">
                                        <span class="form-label">密码：</span>
                                        <div class="form-value">
                                            <span v-if="!isEditing">******</span>
                                            <el-input
                                                    v-else
                                                    v-model="editForm.upwd"
                                                    type="password"
                                                    placeholder="新密码"
                                                    size="small"
                                                    show-password
                                            ></el-input>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="action-buttons">
                                <!-- 编辑按钮 -->
                                <el-button
                                        v-if="!isEditing"
                                        type="primary"
                                        size="medium"
                                        @click="startEditing"
                                        icon="el-icon-edit"
                                >
                                    编辑资料
                                </el-button>

                                <!-- 编辑状态下的按钮 -->
                                <template v-else>
                                    <el-button
                                            type="success"
                                            size="medium"
                                            @click="saveUserInfo"
                                            :loading="saving"
                                            icon="el-icon-check"
                                    >
                                        保存修改
                                    </el-button>
                                    <el-button
                                            size="medium"
                                            @click="cancelEditing"
                                            icon="el-icon-close"
                                    >
                                        取消
                                    </el-button>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- 选项卡区域 -->
                    <div class="profile-tabs">
                        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                            <!-- 我的收藏标签页 -->
                            <el-tab-pane label="我的收藏" name="collection">
                                <div class="movie-grid" v-if="collections.length > 0">
                                    <div
                                            v-for="movie in collections"
                                            :key="movie.mid"
                                            class="movie-card"
                                            @click="goToMovieDetail(movie.mid)"
                                    >
                                        <div class="poster-container">
                                            <img :src="require('../assets/img/' + movie.poster)" :alt="movie.name">
                                            <div class="movie-rating">
                                                {{ movie.score.toFixed(1) }}
                                            </div>
                                        </div>
                                        <div class="movie-info">
                                            <h3>{{ movie.name }}</h3>
                                            <p class="meta">{{ movie.year }} · {{ movie.type || '未知' }}</p>
                                            <div class="collection-time" v-if="movie.time">
                                                <i class="el-icon-star-on"></i>
                                                收藏于 {{ formatDate(movie.time) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <el-empty v-else description="暂无收藏电影"></el-empty>
                            </el-tab-pane>

                            <!-- 我的评论标签页 -->
                            <el-tab-pane label="我的评论" name="comment">
                                <div class="comment-list" v-if="comments.length > 0">
                                    <div class="comment-item" v-for="(comment, index) in comments" :key="index">
                                        <div class="comment-header">
                                            <div class="comment-movie">
                                                <img :src="require('../assets/img/' + comment.poster)" class="movie-thumb">
                                                <div>
                                                    <h4 @click="goToMovieDetail(comment.mid)">{{ comment.name }}</h4>
                                                    <div class="comment-rating">
                                                        <el-rate
                                                                :value="comment.score / 2"
                                                                disabled
                                                                :max="5"
                                                                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                                        ></el-rate>
                                                        <span class="rating-text">{{ comment.score.toFixed(1) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="comment-time">{{ formatTime(comment.ctime) }}</div>
                                        </div>
                                        <div class="comment-content">
                                            <p>{{ comment.content || '暂无评论内容' }}</p>
                                        </div>
                                    </div>
                                </div>
                                <el-empty v-else description="暂无评论记录"></el-empty>
                            </el-tab-pane>

                            <!-- 观看记录标签页 -->
                            <el-tab-pane label="观看记录" name="watched">
                                <div class="movie-grid" v-if="watchedMovies.length > 0">
                                    <div
                                            v-for="movie in watchedMovies"
                                            :key="movie.mid"
                                            class="movie-card"
                                            @click="goToMovieDetail(movie.mid)"
                                    >
                                        <div class="poster-container">
                                            <img :src="require('../assets/img/' + movie.poster)" :alt="movie.name">
                                            <div class="movie-rating">
                                                {{ movie.score.toFixed(1) }}
                                            </div>
                                        </div>
                                        <div class="movie-info">
                                            <h3>{{ movie.name }}</h3>
                                            <p class="meta">{{ movie.year }} · {{ movie.type || '未知' }}</p>
                                            <div class="watched-time" v-if="movie.time">
                                                <i class="el-icon-time"></i>
                                                观看于 {{ formatDate(movie.time) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <el-empty v-else description="暂无观看记录"></el-empty>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </template>
            </template>

            <!-- 未登录时的提示 -->
            <div v-else class="login-prompt">
                <div class="prompt-content">
                    <h3>登录后查看个人中心</h3>
                    <p>登录后可以查看收藏记录、评论历史和观影记录</p>
                    <router-link to="/LoginAndRegister">
                        <el-button type="success" size="medium">立即登录</el-button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: `home`,
        data() {
            return {
                searchQuery: '', // 搜索关键词
                uname: '', // 当前登录用户名
                activeTab: 'collection', // 当前激活的标签页
                loading: false, // 数据加载状态
                isEditing: false, // 是否处于编辑模式
                saving: false, // 保存中状态

                // 用户信息
                userInfo: {
                    id: '',
                    uname: '',
                    upwd: '',
                    email: '',
                    avatar: ''
                },

                // 编辑表单数据
                editForm: {
                    id: '',
                    uname: '',
                    upwd: '',
                    email: ''
                },

                collections: [], // 收藏列表
                comments: [], // 评论列表
                watchedMovies: [], // 观看记录

                // 默认头像
                defaultAvatar: require('../assets/img/用户头像.jpg')
            }
        },

        /**
         * 组件创建时钩子函数
         * 初始化用户数据
         */
        created() {
            this.initUserData();
        },

        methods: {
            /**
             * 初始化用户数据
             * 从本地存储获取用户信息并加载相关数据
             */
            async initUserData() {
                const userData = localStorage.getItem('userInfo');
                if (userData) {
                    try {
                        // 解析本地存储的用户信息
                        this.userInfo = JSON.parse(userData);
                        this.uname = this.userInfo.uname || '';
                        this.id = this.userInfo.id || ''; // 确保有用户ID

                        if (this.uname) {
                            this.loading = true;
                            // 并行加载用户收藏、评论和观看记录
                            await Promise.all([
                                this.fetchCollections(),
                                this.fetchComments(),
                                this.fetchWatchedMovies()
                            ]);
                        }
                    } catch (e) {
                        console.error('解析用户信息失败:', e);
                        // 解析失败清除无效的用户信息
                        localStorage.removeItem('userInfo');
                    } finally {
                        this.loading = false;
                    }
                }
            },

            /**
             * 获取用户收藏列表
             */
            async fetchCollections() {
                try {
                    const response = await axios.get(`http://localhost:8081/userCollection/selectCollectionsByUser?uname=${this.uname}`);
                    this.collections = response.data || [];
                } catch (error) {
                    console.error('获取收藏电影失败:', error);
                    this.$message.error('获取收藏列表失败');
                    this.collections = [];
                }
            },

            /**
             * 获取用户评论列表
             */
            async fetchComments() {
                try {
                    const response = await axios.get(`http://localhost:8081/comment/selectCommentsByUser?uname=${this.uname}`);
                    this.comments = response.data || [];
                } catch (error) {
                    console.error('获取用户评论失败:', error);
                    this.$message.error('获取评论列表失败');
                    this.comments = [];
                }
            },

            /**
             * 获取用户观看记录
             */
            async fetchWatchedMovies() {
                try {
                    const response = await axios.get(`http://localhost:8081/userSeen/selectUserSeenByUser?uname=${this.uname}`);
                    this.watchedMovies = response.data || [];
                } catch (error) {
                    console.error('获取观看记录失败:', error);
                    // this.$message.error('获取观看记录失败');
                    this.watchedMovies = [];
                }
            },

            /**
             * 进入编辑模式
             */
            startEditing() {
                this.isEditing = true;
                // 初始化编辑表单数据
                this.editForm = {
                    id: this.userInfo.id,
                    uname: this.userInfo.uname,
                    upwd: this.userInfo.upwd,
                    email: this.userInfo.email
                };
            },

            /**
             * 取消编辑
             */
            cancelEditing() {
                this.isEditing = false;
            },

            /**
             * 保存用户信息
             */
            async saveUserInfo() {
                // 验证表单数据
                if (!this.editForm.uname) {
                    this.$message.warning('用户名不能为空');
                    return;
                }

                if (this.editForm.email && !/^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(this.editForm.email)) {
                    this.$message.warning('请输入正确的邮箱格式');
                    return;
                }

                this.saving = true;
                try {
                    const mydata = {
                        id: this.editForm.id,
                        uname: this.editForm.uname,
                        upwd: this.editForm.upwd,
                        email: this.editForm.email
                    };
                    const response = await axios.post(`http://localhost:8081/user/updateInformation?id=${mydata.id}&uname=${mydata.uname}&upwd=${mydata.upwd}&email=${mydata.email}`, mydata);

                    if (response.data) {
                        this.$message.success('用户信息更新成功');
                        // 更新本地用户信息
                        Object.assign(this.userInfo, this.editForm);
                        this.uname = this.editForm.uname;
                        // 更新本地存储
                        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                        this.isEditing = false;
                    } else {
                        console.log('用户信息更新失败');
                    }
                } catch (error) {
                    alert(this.id)
                } finally {
                    this.saving = false;
                }
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
             * 退出登录
             */
            loginout() {
                this.$confirm('确定要退出登录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 清除用户信息和token
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('token');
                    this.uname = '';
                    // 跳转到首页
                    this.$router.push('/');
                }).catch(() => {
                    // 用户取消退出
                });
            },

            /**
             * 切换标签页
             * @param {Object} tab - 标签页对象
             */
            handleTabClick(tab) {
                this.activeTab = tab.name;
            },

            /**
             * 跳转到电影详情页
             * @param {String} mid - 电影ID
             */
            goToMovieDetail(mid) {
                this.$router.push({
                    name: 'MovieDetail',
                    params: { mid: mid }
                });
            },

            /**
             * 格式化日期
             * @param {String} dateStr - 日期字符串
             * @returns {String} 格式化后的日期
             */
            formatDate(dateStr) {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            },

            /**
             * 格式化时间为相对时间
             * @param {String} timeStr - 时间字符串
             * @returns {String} 相对时间描述
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
            }
        }
    }
</script>

<style scoped>
    /* 新增评论评分文本样式 */
    .rating-text {
        margin-left: 10px;
        font-size: 14px;
        color: #F7BA2A;
    }
    /* 基础容器样式 */
    .home-container {
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

    .user-info {
        margin: 0 15px;
        color: #333;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
    }

    .user-info:hover {
        color: #222bb5;
    }

    /* 个人中心内容区域样式 */
    .personal-content {
        margin-top: 30px;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    /* 用户资料卡片样式 */
    .user-profile-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        margin-bottom: 30px;
    }

    /* 顶部展示区样式 */
    .profile-header {
        display: flex;
        align-items: center;
        padding: 30px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    /* 头像区域样式 */
    .avatar-container {
        position: relative;
        margin-right: 30px;
        flex-shrink: 0;
    }

    .user-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .avatar-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        padding: 5px;
        border-bottom-left-radius: 60px;
        border-bottom-right-radius: 60px;
    }

    .avatar-actions .el-button {
        color: #fff;
    }

    /* 基本信息展示区样式 */
    .profile-basic {
        flex: 1;
    }

    .username-display h2 {
        margin: 0 0 10px;
        font-size: 28px;
        color: #333;
        font-weight: 600;
    }

    /* 统计数据样式 */
    .profile-stats {
        display: flex;
        gap: 30px;
        margin-top: 15px;
    }

    .stat-item {
        text-align: center;
        min-width: 80px;
    }

    .stat-value {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 5px;
    }

    .stat-label {
        font-size: 14px;
        color: #666;
    }

    /* 详细信息区域样式 */
    .profile-details {
        padding: 30px;
    }

    .detail-section {
        margin-bottom: 30px;
    }

    .section-title {
        font-size: 18px;
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    /* 详情表单样式 */
    .detail-form {
        max-width: 600px;
    }

    .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .form-label {
        width: 100px;
        font-weight: 500;
        color: #666;
        flex-shrink: 0;
    }

    .form-value {
        flex: 1;
    }

    .form-value .el-input {
        width: 100%;
        max-width: 300px;
    }

    /* 操作按钮区域样式 */
    .action-buttons {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }

    /* 标签页区域样式 */
    .profile-tabs {
        margin-top: 20px;
    }

    .profile-tabs >>> .el-tabs__item {
        font-size: 16px;
        font-weight: 500;
    }

    .profile-tabs >>> .el-tabs__item.is-active {
        color: #00b51d;
    }

    .profile-tabs >>> .el-tabs__active-bar {
        background-color: #00b51d;
    }

    /* 电影网格样式 */
    .movie-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .movie-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .movie-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

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

    .watched-time,
    .collection-time {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
        display: flex;
        align-items: center;
    }

    .watched-time i,
    .collection-time i {
        margin-right: 5px;
    }

    /* 评论列表样式 */
    .comment-list {
        padding: 10px 0;
    }

    .comment-item {
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .comment-movie {
        display: flex;
        align-items: center;
    }

    .movie-thumb {
        width: 60px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 15px;
    }

    .comment-movie h4 {
        margin: 0;
        font-size: 16px;
        cursor: pointer;
        transition: color 0.3s;
    }

    .comment-movie h4:hover {
        color: #00b51d;
    }

    .comment-rating {
        margin-top: 5px;
    }

    .comment-time {
        font-size: 12px;
        color: #999;
    }

    .comment-content {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
    }

    /* 未登录提示样式 */
    .login-prompt {
        text-align: center;
        padding: 60px 0;
    }

    .prompt-content {
        max-width: 400px;
        margin: 0 auto;
    }

    .prompt-content h3 {
        font-size: 24px;
        margin-bottom: 15px;
        color: #333;
    }

    .prompt-content p {
        font-size: 16px;
        color: #666;
        margin-bottom: 25px;
    }

    /* 响应式设计 */
    @media (max-width: 992px) {
        /* 中等屏幕适配 */
        .profile-header {
            flex-direction: column;
            text-align: center;
            padding: 20px;
        }

        .avatar-container {
            margin-right: 0;
            margin-bottom: 20px;
        }

        .profile-stats {
            justify-content: center;
        }

        .form-row {
            flex-direction: column;
            align-items: flex-start;
        }

        .form-label {
            margin-bottom: 5px;
        }

        .form-value .el-input {
            max-width: 100%;
        }

        .movie-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        /* 平板设备适配 */
        .profile-stats {
            gap: 15px;
        }

        .stat-item {
            min-width: 60px;
        }

        .stat-value {
            font-size: 20px;
        }

        .movie-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 576px) {
        /* 手机设备适配 */
        .profile-header {
            padding: 15px;
        }

        .user-avatar {
            width: 80px;
            height: 80px;
        }

        .username-display h2 {
            font-size: 22px;
        }

        .profile-stats {
            flex-wrap: wrap;
            justify-content: space-around;
        }

        .stat-item {
            min-width: 45%;
            margin-bottom: 10px;
        }

        .profile-details {
            padding: 20px 15px;
        }

        .action-buttons .el-button {
            width: 100%;
            margin-bottom: 10px;
        }

        .movie-grid {
            grid-template-columns: 1fr;
        }

        .header-content {
            flex-wrap: wrap;
            height: auto;
            padding: 10px;
        }

        .logo {
            order: 1;
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
        }

        .search-box {
            order: 3;
            width: 100%;
            margin: 10px 0;
        }

        .nav-links {
            order: 2;
            margin-left: auto;
        }
    }
</style>