<template>
    <div id="main">
        <h3>评论列表Mo</h3>
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
        name: `findMovieMo`,
        data(){
            return{
                mname1:'',
                tableData:[],
                index:'',
            }
        },
        mounted(){
            let mname1 = localStorage.getItem("mname");
            // 将取到的参数给 data 中的 uname1 赋值
            this.mname1 = mname1;

            // 访问后端 将 name1 传递至后台
            this.$http.get("http://localhost:8081/comment/findCommentMo1?index=1"+"&mname="+mname1).then(req=>{
                // 给 tableData 赋值
                this.tableData=req.data.list;
            })
        },
        methods:{
            changePage:function (index) {
                let mname1 = this.mname1;

                this.$http.get("http://localhost:8081/comment/findCommentMo1?index="+index+"&mname="+mname1).then(req=>{
                    // 给 tableData 赋值
                    this.tableData=req.data.list;
                    this.index=req.data.index;
                })
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