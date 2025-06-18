<template>
    <div id="main">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="二级分类ID">
                <el-input v-model="ruleForm.ccid" ></el-input>
            </el-form-item>
            <el-form-item label="电影类别">
                <el-input v-model="ruleForm.type"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findCategory2')">返回</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `updateCategory2`,
        data(){
            return{
                ruleForm:{
                    ccid:'',
                    type:''
                }
            }
        },
        mounted(){
            // 获取 ccid
            let ccid = this.$route.params.ccid;
            alert("即将跳转至修改界面!")
            // 根据 id 查询数据
            this.$http.get("http://localhost:8081/category2/findById?ccid="+ccid).then(req=>{
                this.ruleForm = req.data;

            })
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //  获取data中的数据
                        let ccid = this.ruleForm.ccid;
                        let type = this.ruleForm.type;
                        // 将数据提交至后台
                        if (confirm("是否修改数据?")){
                            this.$http.get("http://localhost:8081/category2/updateCategory2?ccid="+ccid+"&type="+type).then(req=>{
                                if (req.data==true){
                                    alert("修改成功!");
                                    this.$router.push("findCategory2");
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
                    this.$router.push("findCategory2");
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