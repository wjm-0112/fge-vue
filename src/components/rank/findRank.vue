<template>
    <div id="main">
        <h3>排行列表</h3>

        <el-table :data="tableData" height="300" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="rid" label="编号" width="80"></el-table-column>
            <el-table-column prop="name" label="电影名称" width="150"></el-table-column>
            <el-table-column prop="score" label="评分" width="180"></el-table-column>
            <el-table-column prop="collection" label="收藏数" width="80"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delRank(scope.row.rid)" class="el-icon-delete" type="danger">删除</el-button>
                    <el-button v-on:click="updateRank(scope.row.rid)" class="el-icon-edit" type="primary">修改</el-button>
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
        name: `findRank`,
        data(){
            return{
                index:'',
                tableData:[],
            }
        },

        mounted(){
            this.$http.get("http://localhost:8081/rank/findRank?index=1").then(req=>{
                // 给 data 中的 list 赋值
                this.tableData = req.data.list;
            })
        },

        methods:{
            changePage:function (index) {
                this.$http.get("http://localhost:8081/rank/findRank?index="+index).then(req=>{
                    this.index=req.data.index;
                    this.tableData=req.data.list;
                })
            },

            delRank:function () {
                // 根据 id 删除数据
                // if (confirm("是否删除数据?")){
                //     this.$http.get("http://localhost:8081/user/delUser?rid="+rid).then(req=>{
                //         if (req.data==true){
                //             alert("删除成功!")
                //             // 删除成功后刷新页面
                //             location.reload();
                //         }
                //     })
                // }
                alert("功能维护中，请联系管理员!")
            },

            updateRank:function () {
                // 跳转至修改页面
                // this.$router.push({name:"updateRank",params:{rid:rid}});
                alert("功能维护中，请联系管理员！")
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