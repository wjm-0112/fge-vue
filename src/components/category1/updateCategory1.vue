<template>
    <div id="main">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="一级分类ID">
                <el-input v-model="ruleForm.cid" disabled ></el-input>
            </el-form-item>
            <el-form-item label="地区/国家分类">
                <el-input v-model="ruleForm.area"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findCategory1')">返回</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `updateCategory1`,
        data(){
            return{
                ruleForm:{
                    cid:'',
                    area:''
                }
            }
        },
        mounted(){
            // 获取 cid
            let cid = this.$route.params.cid;
            alert("即将跳转至修改界面!")
            // 根据 id 查询数据
            this.$http.get("http://localhost:8081/category1/findById?cid="+cid).then(req=>{
                this.ruleForm = req.data;

            })
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //  获取data中的数据
                        let cid = this.ruleForm.cid;
                        let area = this.ruleForm.area;
                        // 将数据提交至后台
                        if (confirm("是否修改数据?")){
                            this.$http.get("http://localhost:8081/category1/updateCategory1?cid="+cid+"&area="+area).then(req=>{
                                if (req.data==true){
                                    alert("修改成功!");
                                    this.$router.push("findCategory1");
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
                    this.$router.push("findCategory1");
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