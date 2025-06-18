<template>
    <div id="main">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="一级分类ID">
                <el-input v-model="ruleForm.cid" placeholder="请输入一级分类ID"></el-input>
            </el-form-item>
            <el-form-item label="地区/国家分类">
                <el-input v-model="ruleForm.area" placeholder="请输入地区/国家分类"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findCategory1')">返回</el-button>
                <el-button type="primary" @click="addCategory1()">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `addCategory1`,
        data(){
            return{
                ruleForm:{
                    cid:'',
                    area:''
                },
                rules:{
                    cid: [
                        { required: true, message: '请输入一级分类ID', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    area: [
                        { required: true, message: '请输入地区/国家分类', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            addCategory1:function() {
                let cid=this.ruleForm.cid;
                let area=this.ruleForm.area;
                // 将参数传到后台
                this.$http.get("http://localhost:8081/category1/addCategory1?cid="+cid+"&area="+area).then(req=>{
                    if (req.data==true){
                        alert("添加成功!即将返回!");
                        location.reload();
                        this.$router.push("findCategory1");
                    }
                })
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

</style>