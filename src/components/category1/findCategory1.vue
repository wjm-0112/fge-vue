<template>
    <div id="main">
        <h3>一级列表</h3>
        <div id="button1">
<!--            <button v-on:click="addCategory1()">添加</button>-->
        </div>

        <el-table :data="tableData" height="300" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="cid" label="一级分类编号" width="80"></el-table-column>
            <el-table-column prop="area" label="地区/国家分类" width="150"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delCategory1(scope.row.cid)" class="el-icon-delete" type="danger">删除</el-button>
                    <el-button v-on:click="updateCategory1(scope.row.cid)" class="el-icon-edit" type="primary">修改</el-button>
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
        name: `findCategory1`,
        data(){
            return{
                index:'',
                tableData:[]
            }
        },
        mounted(){
            this.$http.get("http://localhost:8081/category1/findCategory1?index=1").then(req=>{
                // 给 data 中的 list 赋值
                this.tableData = req.data.list;
            })
        },
        methods:{
            changePage:function (index) {
                this.$http.get("http://localhost:8081/category1/findCategory1?index="+index).then(req=>{
                    this.index=req.data.index;
                    this.tableData=req.data.list;
                })
            },
            delCategory1:function (cid) {
                // 根据 id 删除数据
                if (confirm("是否删除数据?")){
                    this.$http.get("http://localhost:8081/category1/delCategory1?cid="+cid).then(req=>{
                        if (req.data==true){
                            alert("删除成功!")
                            // 删除成功后刷新页面
                            location.reload();
                        }
                    })
                }
            },

            updateCategory1:function (cid) {
                // 跳转至修改页面
                this.$router.push({name:"updateCategory1",params:{cid:cid}});
            },

            addCategory1:function () {
                alert("即将跳转至添加界面!")
                // 跳转至添加页面
                this.$router.push({name:"addCategory1"});
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
    #button1{
        width: 400px;
        margin-left: -85px;
    }
</style>