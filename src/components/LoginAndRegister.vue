<template>
    <div class="auth-container">
        <!-- 顶部导航栏（保持原样） -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <img src="../assets/img/logo.jpg" alt="帧光引擎">
                </div>
                <div class="nav-links">
                    <router-link to="/">首页</router-link>
                    <router-link to="/category">分类</router-link>
                    <router-link to="/home">个人中心</router-link>
                    <router-link to="/LoginAndRegister" class="active">登录/注册</router-link>
                </div>
            </div>
        </header>

        <!-- 登录注册主容器 -->
        <div class="auth-main">
            <!-- 切换标签 -->
            <div class="auth-tabs">
                <div
                        :class="{ 'active': activeTab === 'login' }"
                        @click="switchTab('login')"
                >
                    登录
                </div>
                <div
                        :class="{ 'active': activeTab === 'register' }"
                        @click="switchTab('register')"
                >
                    注册
                </div>
            </div>

            <!-- 登录表单 -->
            <div class="auth-form" v-show="activeTab === 'login'">
                <el-form
                        :model="loginForm"
                        :rules="loginRules"
                        ref="loginForm"
                        class="compact-form"
                >
                    <el-form-item label="用户名" prop="uname" class="form-item-inline">
                        <el-input
                                v-model="loginForm.uname"
                                placeholder="请输入用户名"
                                class="inline-input"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="upwd" class="form-item-inline">
                        <el-input
                                v-model="loginForm.upwd"
                                type="password"
                                placeholder="请输入密码"
                                class="inline-input"
                                show-password
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="角色" prop="role" class="form-item-inline">
                        <el-select
                                v-model="loginForm.role"
                                placeholder="请选择角色"
                                class="inline-select"
                        >
                            <el-option label="管理员" :value="1"></el-option>
                            <el-option label="普通用户" :value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="form-actions">
                        <el-button
                                type="primary"
                                @click="submitLogin"
                                class="submit-btn"
                                :loading="loading.login"
                        >
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>

                <div class="auth-footer">
                    <span @click="switchTab('register')">还没有账号？<span class="link-text">立即注册</span></span>
                    <span @click="showForgetPassword">忘记密码？</span>
                </div>
            </div>

            <!-- 注册表单 -->
            <div class="auth-form" v-show="activeTab === 'register'">
                <el-form
                        :model="registerForm"
                        :rules="registerRules"
                        ref="registerForm"
                        class="compact-form"
                >
                    <el-form-item label="用户账号" prop="id" class="form-item-inline">
                        <el-input
                                v-model="registerForm.id"
                                placeholder="请输入用户账号"
                                class="inline-input"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="用户名" prop="uname" class="form-item-inline">
                        <el-input
                                v-model="registerForm.uname"
                                placeholder="请输入用户名"
                                class="inline-input"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="upwd" class="form-item-inline">
                        <el-input
                                v-model="registerForm.upwd"
                                type="password"
                                placeholder="请输入密码"
                                class="inline-input"
                                show-password
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="confirmUpwd" class="form-item-inline">
                        <el-input
                                v-model="registerForm.confirmUpwd"
                                type="password"
                                placeholder="请再次输入密码"
                                class="inline-input"
                                show-password
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role" class="form-item-inline">
                        <el-select
                                v-model="loginForm.role"
                                placeholder="请选择角色"
                                class="inline-select"
                        >
                            <el-option label="管理员" :value="1"></el-option>
                            <el-option label="普通用户" :value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="电子邮箱" prop="email" class="form-item-inline">
                        <el-input
                                v-model="registerForm.email"
                                placeholder="请输入电子邮箱"
                                class="inline-input"
                        ></el-input>
                    </el-form-item>

                    <el-form-item class="form-actions">
                        <el-button
                                type="primary"
                                @click="submitRegister"
                                class="submit-btn"
                                :loading="loading.register"
                        >
                            注册
                        </el-button>
                    </el-form-item>
                </el-form>

                <div class="auth-footer">
                    <span @click="switchTab('login')">已有账号？<span class="link-text">立即登录</span></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoginAndRegister',
        data() {
            // 密码一致性验证
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.registerForm.upwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                activeTab: 'login', // 当前激活的标签页
                loading: {
                    login: false,
                    register: false
                },

                // 登录表单数据
                loginForm: {
                    uname: '',
                    upwd: '',
                    role: 0,

                },

                // 注册表单数据
                registerForm: {
                    id:'',
                    uname: '',
                    upwd: '',
                    confirmUpwd: '',
                    role: 0,
                    email: ''
                },

                // 登录验证规则
                loginRules: {

                    uname: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                    ],
                    upwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ]
                },

                // 注册验证规则
                registerRules: {
                    id: [
                        { required: true, message: '请输入用户账号', trigger: 'blur' },
                        { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
                    ],
                    uname: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                    ],
                    upwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3到 20 个字符', trigger: 'blur' }
                    ],
                    confirmUpwd: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ]
                }
            }
        },
        methods: {
            // 切换标签页
            switchTab(tab) {
                this.activeTab = tab;
            },

            // 提交登录表单
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading.login = true;

                        // 调用后端登录接口
                        this.$http.get("http://localhost:8081/user/login", {
                            params: {
                                uname: this.loginForm.uname,
                                upwd: this.loginForm.upwd,
                                role: this.loginForm.role
                            }
                        }).then(response => {
                            this.loading.login = false;
                            if (response.data) {
                                this.$message.success('登录成功');

                                localStorage.setItem('userInfo', JSON.stringify(response.data));
                                localStorage.setItem("uname",response.data.uname);
                                // 根据角色跳转不同页面
                                if (this.loginForm.role === 1) {
                                    this.$router.push('/index1'); // 管理员跳转后台
                                } else {
                                    this.$router.push('/'); // 普通用户跳转首页
                                }
                                this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
                                this.uname = this.userInfo.uname || 'guest';
                            } else {
                                this.$message.error(response.data.message || '登录失败');
                            }
                        }).catch(error => {
                            this.loading.login = false;
                            console.error('登录请求失败:', error);
                            this.$message.error('登录请求失败');
                        });
                    } else {
                        return false;
                    }
                });
            },

            // 提交注册表单
            submitRegister() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.loading.register = true;

                        // 调用后端注册接口
                        this.$http.get("http://localhost:8081/user/regUser", {
                            params: {
                                id:this.registerForm.id,
                                uname: this.registerForm.uname,
                                upwd: this.registerForm.upwd,
                                role: this.loginForm.role,
                                email: this.registerForm.email,
                                collection:0,
                                seen: 0
                            }
                        }).then(response => {
                            this.loading.register = false;

                            if (response.data) {
                                this.$message.success('注册成功');
                                // 注册成功后自动切换到登录标签页
                                this.activeTab = 'login';
                                // 自动填充用户名和邮箱
                                this.loginForm.uname = this.registerForm.uname;
                                this.loginForm.email = this.registerForm.email;
                            } else {
                                this.$message.error(response.data.message || '注册失败');
                            }
                        }).catch(error => {
                            this.loading.register = false;
                            console.error('注册请求失败:', error);
                            this.$message.error('注册请求失败');
                        });
                    } else {
                        return false;
                    }
                });
            },

            // 显示忘记密码提示
            showForgetPassword() {
                this.$message.info('请通过注册邮箱找回密码');
            }
        }
    }
</script>

<style scoped>
    /* 顶部导航栏样式（完全保持原样） */
    .auth-container {
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

    .logo img {
        width: 150px;
        height: 50px;
        object-fit: contain;
        transition: all 0.3s;
    }

    .nav-links {
        display: flex;
        margin-left: auto;
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

    .nav-links a.active {
        color: #222bb5;
        border-bottom: 2px solid #00b51d;
    }

    /* 主内容区样式 */
    .auth-main {
        max-width: 600px;
        margin: 40px auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
    }

    /* 切换标签样式 */
    .auth-tabs {
        display: flex;
        border-bottom: 1px solid #f0f0f0;
    }

    .auth-tabs div {
        flex: 1;
        text-align: center;
        padding: 16px 0;
        cursor: pointer;
        font-size: 18px;
        color: #666;
        transition: all 0.3s;
    }

    .auth-tabs div:hover {
        color: #409EFF;
    }

    .auth-tabs div.active {
        color: #409EFF;
        font-weight: bold;
        border-bottom: 2px solid #409EFF;
    }

    /* 表单样式 - 紧凑布局 */
    .compact-form {
        padding: 30px;
    }

    .form-item-inline {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .form-item-inline >>> .el-form-item__label {
        width: 100px;
        text-align: right;
        padding-right: 15px;
        line-height: 1;
        margin-bottom: 0;
    }

    .form-item-inline >>> .el-form-item__content {
        flex: 1;
        margin-left: 0 !important;
    }

    .inline-input {
        width: 100%;
    }

    .inline-select {
        width: 100%;
    }

    /* 按钮区域 */
    .form-actions {
        margin-top: 30px;
        text-align: center;
    }

    .submit-btn {
        width: 100%;
        height: 40px;
        font-size: 16px;
        border-radius: 4px;
    }

    /* 底部链接 */
    .auth-footer {
        display: flex;
        justify-content: space-between;
        padding: 0 30px 20px;
        font-size: 14px;
        color: #666;
    }

    .auth-footer span {
        cursor: pointer;
    }

    .link-text {
        color: #409EFF;
        font-weight: 500;
    }

    .link-text:hover {
        text-decoration: underline;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .auth-main {
            margin: 20px;
        }

        .compact-form {
            padding: 20px;
        }

        .form-item-inline {
            flex-direction: column;
            align-items: flex-start;
        }

        .form-item-inline >>> .el-form-item__label {
            width: auto;
            text-align: left;
            padding-right: 0;
            padding-bottom: 8px;
        }

        .auth-footer {
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
    }
</style>