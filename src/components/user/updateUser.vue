<template>
    <div id="main">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="ID">
                <el-input v-model="ruleForm.id" disabled ></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="ruleForm.uname"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="ruleForm.upwd"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="ruleForm.role" placeholder="请选择用户类型">
                    <el-option label="管理员" value="1"></el-option>
                    <el-option label="普通用户" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="收藏数">
                <el-input v-model="ruleForm.collection"></el-input>
            </el-form-item>
            <el-form-item label="已看数">
                <el-input v-model="ruleForm.seen"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findUser')">返回</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `updateUser`,
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
                }
            }
        },

        mounted(){
            // 获取 id
            let id = this.$route.params.id;
            alert("即将跳转至修改界面!")
            // 根据 id 查询数据
            this.$http.get("http://localhost:8081/user/findById?id="+id).then(req=>{
                this.ruleForm = req.data;

            })
        },

        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //  获取data中的数据
                        let id = this.ruleForm.id;
                        let uname = this.ruleForm.uname;
                        let upwd = this.ruleForm.upwd;
                        let role = this.ruleForm.role;
                        let email = this.ruleForm.email;
                        let collection = this.ruleForm.collection;
                        let seen = this.ruleForm.seen;
                        // 将数据提交至后台
                        if (confirm("是否修改数据?")){
                            this.$http.get("http://localhost:8081/user/updateUser?id="+id+"&uname="+uname+"&upwd="+upwd+"&role="+role+"&email="+email+"&collection="+collection+"&seen="+seen).then(req=>{
                                if (req.data==true){
                                    alert("修改成功!");
                                    location.reload();
                                    this.$router.push("findUser");
                                }
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
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
    #main {
        width: 500px;
        height: 400px;
        margin: 0 auto;
    }

</style>