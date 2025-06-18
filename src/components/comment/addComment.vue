<template>
    <div id="main">
        <el-form :model="ruleForm"   label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" >
                <el-input v-model="ruleForm.uname" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="电影编号" >
                <el-input v-model="ruleForm.mid.mid" placeholder="请输入电影编号"></el-input>
            </el-form-item>
            <el-form-item label="电影名称" >
                <el-input v-model="ruleForm.mname" placeholder="请输入电影名称"></el-input>
            </el-form-item>
            <el-form-item label="评论内容" >
                <el-input v-model="ruleForm.content" placeholder="请输入评论内容" ></el-input>
            </el-form-item>
            <el-form-item label="评论时间" >
                <el-input v-model="ruleForm.ctime" placeholder="请输入评论时间" ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findComment')">返回</el-button>
                <el-button type="primary" @click="addComment()">提交</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: `addComment`,
        data(){
            return{
                ruleForm:{
                    uname:'',
                    mid:{
                     mid:''
                    },
                    mname:'',
                    content:'',
                    ctime:''
                }
            }
        },

        methods:{
            addComment:function() {
                let uname=this.ruleForm.uname;
                let mid=this.ruleForm.mid;
                let mname=this.ruleForm.mname;
                let content=this.ruleForm.content;
                let ctime=this.rule.ctime;
                // 将参数传到后台
                this.$http.get("http://localhost:8081/comment/addComment?uname="+uname+"&mid="+mid+"&mname="+mname+"&content="+content+"&ctime="+ctime).then(req=>{
                    if (req.data==true){
                        alert("添加成功!即将返回!");
                        location.reload();
                        this.$router.push("findComment");
                    }
                })
            },
            return1(){
                //   返回
                if (confirm("是否返回?")){
                    this.$router.push("findComment");
                }
            }
        }
    }
</script>

<style scoped>
    #main{
        width: 600px;
        height: 1500px;
        margin: 0 auto;
    }
</style>