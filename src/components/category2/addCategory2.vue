<template>
    <div id="main">
        <h3>添加二级分类</h3>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="二级分类ID">
                <el-input v-model="ruleForm.ccid" placeholder="请输入二级分类ID"></el-input>
            </el-form-item>
            <el-form-item label="电影类型">
                <el-input v-model="ruleForm.type" placeholder="请输入电影类型"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findCategory2')">返回</el-button>
                <el-button type="primary" @click="addCategory2()">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `addCategory2`,
        data(){
            return{
                ruleForm:{
                    ccid:'',
                    type:''
                },
                rules:{
                    ccid: [
                        { required: true, message: '请输入一级分类ID', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入地区/国家分类', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            addCategory2:function() {
                let ccid=this.ruleForm.ccid;
                let type=this.ruleForm.type;
                // 将参数传到后台
                this.$http.get("http://localhost:8081/category2/addCategory2?ccid="+ccid+"&type="+type).then(req=>{
                    if (req.data==true){
                        alert("添加成功!即将返回!");
                        location.reload();
                        this.$router.push("findCategory2");
                    }
                })
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

</style>