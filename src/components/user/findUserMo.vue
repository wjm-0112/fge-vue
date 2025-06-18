<template>
    <div id="main">
        <h3>用户列表Mo</h3>
        <div id="findMo">
            <input type="text" v-model="uname1" placeholder="请输入姓名">&nbsp;&nbsp;
            <button v-on:click="findMo()">查询</button>
        </div>

        <el-table :data="tableData" height="300" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="编号" width="80"></el-table-column>
            <el-table-column prop="uname" label="姓名" width="150"></el-table-column>
            <el-table-column prop="upwd" label="密码" width="180"></el-table-column>
            <el-table-column prop="role" label="类型" width="80"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delUser(scope.row.id)" class="el-icon-delete" type="danger"></el-button>
                    <el-button v-on:click="updateUser(scope.row.id)" class="el-icon-edit" type="primary"></el-button>
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
        name: `findUserMo`,
        data(){
            return{
                uname1:'',
                tableData:[],
                index:'',
            }
        },
        mounted(){
            // 获取 findUser 传递的参数 uname1
            // let uname1 = this.$route.params.uname;
            // let uname1 = sessionStorage.getItem("uname");
            let uname1 = localStorage.getItem("uname");
            // 将取到的参数给 data 中的 uname1 赋值
            this.uname1 = uname1;

            // 访问后端 将 uname1 传递至后台
            this.$http.get("http://localhost:8081/user/findUserMo?index=1"+"&uname="+uname1).then(req=>{
                // 给 tableData 赋值
                this.tableData=req.data.list;
            })
        },
        methods:{
            changePage:function (index) {
                let uname1 = this.uname1;

                this.$http.get("http://localhost:8081/user/findUserMo?index="+index+"&uname="+uname1).then(req=>{
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
        width: 800px;
        height: 400px;
        margin: 0 auto;
    }
    #findMo{
        width: 400px;
        margin-left: -85px;
    }
</style>