<template>
    <div id="main">
        <h3>一级列表Mo</h3>
        <div id="findMo">
            <input type="text" v-model="type1" placeholder="请输入类型名称">&nbsp;
            <button v-on:click="findMo()">查询</button>&nbsp;
            <button v-on:click="addCategory2()">添加</button>
        </div>

        <el-table :data="tableData" height="300" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="ccid" label="二级分类编号" width="80"></el-table-column>
            <el-table-column prop="type" label="电影类型" width="150"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delCategory2(scope.row.ccid)" class="el-icon-delete" type="danger">删除</el-button>
                    <el-button v-on:click="updateCategory2(scope.row.ccid)" class="el-icon-edit" type="primary">修改</el-button>
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
        name: `findCategory2Mo`,
        data(){
            return{
                index:'',
                tableData:[],
                type1:''
            }
        },
        mounted(){
            let type1 = localStorage.getItem("type");
            this.type1 = type1;

            this.$http.get("http://localhost:8081/category2/findCategory2Mo?index=1"+"&type"+type1).then(req=>{
                // 给 data 中的 list 赋值
                this.tableData = req.data.list;
            })
        },
        methods:{
            changePage:function (index) {
                let type1 = this.type1;
                this.$http.get("http://localhost:8081/category2/findCategory2?index="+index+"&type="+type1).then(req=>{
                    this.index=req.data.index;
                    this.tableData=req.data.list;
                })
            },

            delCategory2:function (ccid) {
                // 根据 id 删除数据
                if (confirm("是否删除数据?")){
                    this.$http.get("http://localhost:8081/category2/delCategory2?ccid="+ccid).then(req=>{
                        if (req.data==true){
                            alert("删除成功!")
                            // 删除成功后刷新页面
                            location.reload();
                        }
                    })
                }
            },

            updateCategory2:function (ccid) {
                // 跳转至修改页面
                this.$router.push({name:"updateCategory2",params:{ccid:ccid}});
            },

            addCategory2:function () {
                alert("即将跳转至添加界面!")
                // 跳转至添加页面
                this.$router.push({name:"addCategory2"});
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