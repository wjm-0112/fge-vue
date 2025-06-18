<template>
    <div id="main">
        <el-form :model="ruleForm"   label-width="100px" class="demo-ruleForm">
            <el-form-item label="ID" >
                <el-input v-model="ruleForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="姓名" >
                <el-input v-model="ruleForm.uname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="密码" >
                <el-input v-model="ruleForm.upwd" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="ruleForm.role" placeholder="请选择用户类型">
                    <el-option label="管理员" value="1"></el-option>
                    <el-option label="普通用户" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱" >
                <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="收藏数" >
                <el-input v-model="ruleForm.collection" placeholder="请输入收藏数"></el-input>
            </el-form-item>
            <el-form-item label="已看数" >
                <el-input v-model="ruleForm.seen" placeholder="请输入已看数"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findUser')">返回</el-button>
                <el-button type="primary" @click="addUser()">提交</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: `addUser`,
        data(){
            return{
                ruleForm:{
                    id:'',
                    uname:'',
                    upwd:'',
                    role:'',
                    email:'',
                    collection:'',
                    seen:''
                },
                rules:{
                    id: [
                        { required: true, message: '请输入ID', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    uname: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                    ],
                    upwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请选择角色类型', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    collection: [
                        { required: true, message: '请输入收藏数', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    seen: [
                        { required: true, message: '请输入已看数', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ]
                }
            }
        },

        methods:{
            addUser:function() {
                let id=this.ruleForm.id;
                let uname=this.ruleForm.uname;
                let upwd=this.ruleForm.address;
                let role=this.ruleForm.role;
                let email=this.ruleForm.email;
                let collection=this.ruleForm.collection;
                let seen=this.ruleForm.seen;
                // 将参数传到后台
                this.$http.get("http://localhost:8081/user/addUser?id="+id+"&uname="+uname+"&upwd="+upwd+"&role="+role+"&email="+email+"&collection="+collection+"&seen="+seen).then(req=>{
                    if (req.data==true){
                        alert("添加成功!即将返回!");
                        location.reload();
                        this.$router.push("findUser");
                    }
                })
            },
            return1(){
                //   返回
                if (confirm("是否返回?")){
                    this.$router.push("findUser");
                }
            }
        }
    }
</script>

<style scoped>
    #main{
        width: 500px;
        height: 1500px;
        margin: 0 auto;
    }
</style>