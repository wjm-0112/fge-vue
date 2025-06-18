<template>
    <el-container class="index-container">
        <!--头部-->
        <el-header>
            <div class="header-left">
                <el-button
                        type="text"
                        class="menu-toggle"
                        @click="toggleCollapse"
                >
                    <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
                </el-button>
                <div class="head-logo">
                    <span>帧光引擎管理系统</span>
                </div>
            </div>
            <div class="head-right">
                <div class="user-info">
                    <span>欢迎您！&nbsp;{{ userName }}</span>&nbsp;&nbsp;
                    <el-tooltip class="item" effect="light" :content="tooltipContent" placement="bottom">
                        <el-tag size="small" :type="userRole === 1 ? 'success' : 'info'">{{ userRole === 1 ? '超级管理员' : '普通用户' }}</el-tag>
                    </el-tooltip>
                </div>
                <div class="head-button">
                    <el-button type="info" @click="loginOut">退出</el-button>
                </div>
            </div>
        </el-header>


        <!--页面主体区域-->
        <el-container>
            <!--页面左侧区域-->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!--侧边栏菜单区域-->
                <el-menu
                        background-color="#EFEFEF"
                        text-color="#666666"
                        active-text-color="#7B68EE"
                        active-background-color="#F0EBFF"
                        :router="true"
                        :unique-opened="true"
                        :collapse="isCollapse">
                    <!--一级菜单-->
                    <el-submenu index="1">
                        <!--一级菜单模板区-->
                        <template slot="title">
                            <!--图标-->
                            <i class="el-icon-user"></i>
                            <!--文本-->
                            <span>用户管理</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item index="findUser">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>用户列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="findUserCollection">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>收藏列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="findUserSeen">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>已看列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <!--种类管理菜单-->
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-s-order"></i>
                            <span>种类管理</span>
                        </template>
                        <el-menu-item index="findCategory1">
                            <template slot="title">
                                <i class="el-icon-s-promotion"></i>
                                <span>地区列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="findCategory2">
                            <template slot="title">
                                <i class="el-icon-s-flag"></i>
                                <span>类型列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <!--电影管理菜单-->
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-video-camera-solid"></i>
                            <span>电影管理</span>
                        </template>
                        <el-menu-item index="findMovie">
                            <template slot="title">
                                <i class="el-icon-s-platform"></i>
                                <span>电影列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <!--影评管理菜单-->
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>影评管理</span>
                        </template>
                        <el-menu-item index="findRank">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>排行列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="findComment">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>评论列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <!--统计分析菜单-->
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-s-marketing"></i>
                            <span>统计分析</span>
                        </template>
                        <el-menu-item index="echartsMovie">
                            <template slot="title">
                                <i class="el-icon-s-data"></i>
                                <span>电影数据</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="echartsUser">
                            <template slot="title">
                                <i class="el-icon-s-data"></i>
                                <span>用户数据</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="echartsComment">
                            <template slot="title">
                                <i class="el-icon-s-opportunity"></i>
                                <span>评论数据</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>


            <!--页面右侧区域-->
            <el-main class="main-content">
                <!-- 新增面包屑导航 -->
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/index1' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
                        {{ item.title }}
                    </el-breadcrumb-item>
                </el-breadcrumb>

                <!--路由的占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: `index1`,
        data() {
            return {
                // 侧边栏折叠状态
                isCollapse: false,
                userInfo: {},
                userName: '未登录用户',
                userId: '',
                userRole: 0,
                breadcrumbs: [] // 面包屑导航数据
            }
        },
        computed: {
            // 计算属性：用户ID提示内容
            tooltipContent() {
                return `用户ID: ${this.userId}`;
            }
        },
        mounted() {
            this.loadUserInfo();
            // 监听路由变化，更新面包屑
            this.$router.afterEach(this.updateBreadcrumbs);
            this.updateBreadcrumbs(this.$route);
        },
        beforeDestroy() {
            // 移除路由监听
            this.$router.afterEach(this.updateBreadcrumbs);
        },
        methods: {
            // 加载用户信息
            loadUserInfo() {
                const userData = localStorage.getItem('userInfo');
                if (userData) {
                    this.userInfo = JSON.parse(userData);
                    this.userName = this.userInfo.uname || '未登录用户';
                    this.userId = this.userInfo.id || '';
                    this.userRole = this.userInfo.role || 0;
                }
            },
            // 折叠状态切换
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },
            // 更新面包屑导航
            updateBreadcrumbs(route) {
                let matched = route.matched;
                if (!matched.length) {
                    matched = route.name ? [{ meta: { title: route.name } }] : [];
                }

                this.breadcrumbs = matched.map(item => {
                    return {
                        title: item.meta.title || item.name,
                        path: item.path
                    };
                });
            },
            loginOut(){
                this.$confirm('是否退出系统?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 清除本地存储的用户信息
                    localStorage.removeItem('userInfo');
                    // 退出成功提示
                    this.$message.success('退出成功!');
                    // 跳转到登录页面
                    this.$router.push("/LoginAndRegister");
                })
            }
        }
    }
</script>

<style scoped>
    .index-container{
        height: 100vh;
        margin: 0;
    }
    .el-header{
        background-color: #E0E0E0;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;
        color: #333333;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        height: 60px;
    }
    .header-left {
        display: flex;
        align-items: center;
    }
    .menu-toggle {
        color: #666666;
        margin-right: 10px;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    .menu-toggle:hover {
        background-color: #EEEEEE;
    }
    .head-logo{
        display: flex;
        align-items: center;
    }
    .head-logo span{
        font-size: 18px;
        font-weight: 500;
        margin: 0;
    }
    .head-right {
        display: flex;
        align-items: center;
    }
    .user-info {
        margin-right: 20px;
        color: #333333;
        font-size: 14px;
        display: flex;
        align-items: center;
    }
    .head-button{
        margin: 0;
    }
    .el-aside{
        background-color: #EFEFEF;
        color: #666666;
        border-right: 1px solid #EEEEEE;
        box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
        transition: width 0.3s;
    }
    .el-main{
        background-color: #F9F9F9;
        padding: 20px;
        box-sizing: border-box;
        transition: all 0.3s;
    }
    .main-content{
        background-color: #FFFFFF;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        min-height: calc(100vh - 60px);
        padding: 20px;
    }
    /* 优化菜单样式 */
    .el-menu {
        border-right: none;
    }
    .el-menu-item, .el-submenu__title {
        height: 48px;
        line-height: 48px;
        padding-left: 20px;
        color: #666666;
        transition: all 0.3s;
        font-size: 14px;
    }
    .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #F5F2FF;
        color: #7B68EE;
    }
    .el-menu-item i, .el-submenu__icon i {
        color: #999999;
        margin-right: 10px;
        width: 20px;
        text-align: center;
        transition: color 0.3s;
    }
    .el-menu-item.is-active, .el-submenu.is-active .el-submenu__title {
        color: #7B68EE;
        background-color: #F0EBFF;
        border-right: 3px solid #9C88FF;
    }
    .el-menu-item.is-active i, .el-submenu.is-active .el-submenu__icon i {
        color: #7B68EE;
    }
    .el-submenu__icon-arrow {
        color: #999999;
        transition: transform 0.3s, color 0.3s;
    }
    .el-submenu.is-active .el-submenu__icon-arrow {
        color: #7B68EE;
    }
    /* 折叠菜单样式优化 */
    .el-menu--collapse .el-submenu .el-submenu__title span {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
    }
    .el-menu--collapse .el-submenu .el-submenu__title .el-submenu__icon-arrow {
        display: none;
    }
    .el-menu--collapse .el-menu-item {
        padding: 0 20px !important;
    }
    .el-menu--collapse .el-menu-item span {
        display: none;
    }
    /* 面包屑样式调整 */
    .el-breadcrumb {
        margin-bottom: 20px;
        font-size: 14px;
    }
</style>