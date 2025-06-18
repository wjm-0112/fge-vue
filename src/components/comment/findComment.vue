<template>
    <div id="main">
        <h3>评论列表</h3>
        <div id="findMo">
            <input type="text" v-model="mname1" placeholder="请输入电影名称">&nbsp;
            <button v-on:click="findMo()">查询</button>&nbsp;
            <button v-on:click="addUser()">添加</button>
        </div>

        <el-table :data="tableData" height="400" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="cid" label="评论编号" width="80"></el-table-column>
            <el-table-column prop="uname" label="用户名" width="80"></el-table-column>
            <el-table-column prop="mid.mid" label="电影编号" width="100"></el-table-column>
            <el-table-column prop="mname" label="电影名称" width="80"></el-table-column>
            <el-table-column prop="content" label="内容" width="250"></el-table-column>
            <el-table-column prop="ctime" label="发表时间" width="100"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delComment(scope.row.cid)" class="el-icon-delete" type="danger">删除</el-button>
                    <el-button v-on:click="updateComment(scope.row.cid)" class="el-icon-edit" type="primary">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination background @current-change="changePage" layout="prev, pager, next" :total="50"></el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        name: `findComment`,
        data(){
            return{
                index:'',
                tableData:[],
                mname1:'',
            }
        },

        mounted(){
            this.$http.get("http://localhost:8081/comment/findComment?index=1").then(req=>{
                // 给 data 中的 list 赋值
                this.tableData = req.data.list;
            })
        },

        methods:{
            changePage:function (index) {
                this.$http.get("http://localhost:8081/comment/findComment?index="+index).then(req=>{
                    this.index=req.data.index;
                    this.tableData=req.data.list;
                })
            },

            findMo:function(){
                let mname1 = this.mname1;
                // 1.跳转至模糊查询的页面 并将 uname1 传给模糊查询页面  通过在模糊查询页面中根据 uname1 中查询数据
                // this.$router.push({name:'findUserMo',params:{uname:uname1}});
                // 2.通过sessionStorage传参
                // sessionStorage.setItem("uname",uname1);
                localStorage.setItem("mname",mname1);
                this.$router.push('findCommentMo');
            },

            delUser:function (cid) {
                // 根据 id 删除数据
                if (confirm("是否删除数据?")){
                    this.$http.get("http://localhost:8081/comment/delComment?cid="+cid).then(req=>{
                        if (req.data==true){
                            alert("删除成功!")
                            // 删除成功后刷新页面
                            location.reload();
                        }
                    })
                }
            },

            updateUser:function (cid) {
                // 跳转至修改页面
                this.$router.push({name:"updateComment",params:{cid:cid}});
            },

            addUser:function () {
                alert("即将跳转至添加界面!")
                // 跳转至添加页面
                this.$router.push({name:"addComment"});
            }
        }
    }
</script>

<style scoped>
    #main {
        width: 1000px;
        height: 400px;
        margin: 0 auto;
    }
    #findMo{
        width: 400px;
        margin-left: -85px;
    }
</style>