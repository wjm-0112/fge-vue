<template>
    <div id="main">
        <h3>修改用户收藏</h3>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="收藏编号">
                <el-input v-model="ruleForm.id" disabled ></el-input>
            </el-form-item>
            <el-form-item label="用户姓名">
                <el-input v-model="ruleForm.uname.uname"></el-input>
            </el-form-item>
            <el-form-item label="电影名称">
                <el-input v-model="ruleForm.name.name"></el-input>
            </el-form-item>
            <el-form-item label="更新时间" prop="time">
                <el-date-picker v-model="ruleForm.time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="return1('findUserCollection')">返回</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `updateUserCollection`,
        data(){
            return{
                ruleForm:{
                    id:'',
                    uname:{
                        uname:''
                    },
                    name:{
                      name:''
                    },
                    time:''
                }
            }
        },

        mounted(){
            // 获取 id
            let id = this.$route.params.id;
            alert("即将跳转至修改界面!")
            // 根据 id 查询数据
            this.$http.get("http://localhost:8081/userCollection/findById?id="+id).then(req=>{
                this.ruleForm = req.data;

            })
        },

        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //  获取data中的数据
                        let id = this.ruleForm.id;
                        let uname = this.ruleForm.uname.uname;
                        let name = this.ruleForm.name.name;
                        let time = this.ruleForm.time;
                        // 将数据提交至后台
                        if (confirm("是否修改数据?")){
                            this.$http.get("http://localhost:8081/userCollection/updateUserCollection?id="+id+"&uname="+uname+"&name="+name+"&time="+time).then(req=>{
                                if (req.data==true){
                                    alert("修改成功!");
                                    this.$router.push("findUserCollection");
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
                    this.$router.push("findUserCollection");
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