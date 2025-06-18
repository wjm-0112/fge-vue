<template>
    <div id="main">
        <h3>用户已看列表Mo</h3>
        <div id="findMo">
            <input type="text" v-model="mname1" placeholder="请输入电影名称">&nbsp;
            <button v-on:click="findMo()">查询</button>&nbsp;
            <button v-on:click="addUserSeen()">添加</button>
        </div>

        <el-table :data="tableData" height="300" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="编号" width="80"></el-table-column>
            <el-table-column prop="uname" label="用户姓名" width="100"></el-table-column>
            <el-table-column prop="mid.mid" label="电影编号" width="100"></el-table-column>
            <el-table-column prop="mname" label="电影名称" width="140"></el-table-column>
            <el-table-column prop="time" label="收藏时间" width="160"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delUserSeen(scope.row.id)" class="el-icon-delete" type="danger">删除</el-button>
                    <el-button v-on:click="updateUserSeen(scope.row.id)" class="el-icon-edit" type="primary">修改</el-button>
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
        name: `findUserSeenMo`,
        data(){
            return{
                index:'',
                tableData:[],
                mname1:'',
            }
        },

        mounted(){
            let mname1 = localStorage.getItem("mname");
            // 将取到的参数给 data 中的 uname1 赋值
            this.mname1 = mname1;
            this.$http.get("http://localhost:8081/userSeen/findUserSeenMo1?index=1"+"&mname="+mname1).then(req=>{
                // 给 data 中的 list 赋值
                this.tableData = req.data.list;
            })
        },

        methods:{
            changePage:function (index) {
                this.$http.get("http://localhost:8081/userSeen/findUserSeenMo1?index="+index).then(req=>{
                    this.index=req.data.index;
                    this.tableData=req.data.list;
                })
            },

            findMo:function(){
                let uname1 = this.uname1;
                // 1.跳转至模糊查询的页面 并将 uname1 传给模糊查询页面  通过在模糊查询页面中根据 uname1 中查询数据
                // this.$router.push({name:'findUserMo',params:{uname:uname1}});
                // 2.通过sessionStorage传参
                // sessionStorage.setItem("uname",uname1);
                localStorage.setItem("uname",uname1);
                this.$router.push('findUserSeenMo');
            },

            delUserSeen:function (id) {
                // 根据 id 删除数据
                if (confirm("是否删除数据?")){
                    this.$http.get("http://localhost:8081/userSeen/delUserSeen?id="+id).then(req=>{
                        if (req.data==true){
                            alert("删除成功!")
                            // 删除成功后刷新页面
                            location.reload();
                        }
                    })
                }
            },

            updateUserSeen:function (id) {
                // 跳转至修改页面
                this.$router.push({name:"updateUserSeen",params:{id:id}});
            },

            addUserSeen:function () {
                alert("即将跳转至添加界面!")
                // 跳转至添加页面
                this.$router.push({name:"addUserSeen"});
            }
        }
    }
</script>

<style scoped>
    #main {
        width: 900px;
        height: 400px;
        margin: 0 auto;
    }
    #findMo{
        width: 400px;
        margin-left: -85px;
    }
</style>