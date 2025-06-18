<template>
    <div id="main">
        <h3>添加新用户收藏</h3>
        <el-form :model="ruleForm"   label-width="100px" class="demo-ruleForm">
            <el-form-item label="收藏ID" >
                <el-input v-model="ruleForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" >
                <el-input v-model="ruleForm.uname.uname" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="电影名称" >
                <el-input v-model="ruleForm.name.name" placeholder="请输入电影名称" show-password></el-input>
            </el-form-item>
            <el-form-item label="添加时间" prop="time">
                <el-date-picker v-model="ruleForm.time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }"
                ></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findUser')">返回</el-button>
                <el-button type="primary" @click="addUserCollection()">提交</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: `addUserCollection`,
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
                },
                rules:{
                    id: [
                        { required: true, message: '请输入收藏ID', trigger: 'blur' },
                        { min: 0, max: 5, message: '长度在 0 到 5 个字符', trigger: 'blur' }
                    ],
                    uname: [
                        { required: true, message: '请输入用户姓名', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ],
                    upwd: [
                        { required: true, message: '请输入电影名称', trigger: 'blur' },
                        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请选择时间', trigger: 'blur' }
                    ]
                }
            }
        },

        methods:{
            addUserCollection:function() {
                let id = this.ruleForm.id;
                let uname = this.ruleForm.uname.uname;
                let name = this.ruleForm.name.name;
                let time = this.ruleForm.time;
                // 将参数传到后台
                this.$http.get("http://localhost:8081/userCollection/addUserCollection?id="+id+"&uname="+uname+"&name="+name+"&time="+time).then(req=>{
                    if (req.data==true){
                        alert("添加成功!即将返回!");
                        this.$router.push("findUserCollection");
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