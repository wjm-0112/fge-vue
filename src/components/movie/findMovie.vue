<template>
    <div id="main">
        <h3>电影列表</h3>
        <div id="findMo">
            <input type="text" v-model="name1" placeholder="请输入电影名称">&nbsp;
            <button v-on:click="findMo()">查询</button>&nbsp;
            <button v-on:click="addMovie()">添加</button>
        </div>

        <el-table :data="tableData" height="500" border stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="mid" label="电影编号" width="80"></el-table-column>
            <el-table-column prop="name" label="电影名称" width="80"></el-table-column>
<!--            <el-table-column prop="time" label="播放时长" width="80"></el-table-column>-->
            <el-table-column prop="director" label="导演" width="80"></el-table-column>
            <el-table-column prop="actor" label="主演" width="180"></el-table-column>
            <el-table-column prop="category1.area" label="地区" width="150"></el-table-column>
            <el-table-column prop="category2.type" label="类型" width="80"></el-table-column>
            <el-table-column prop="description" label="描述" width="150"></el-table-column>
            <el-table-column prop="score" label="评分" width="60"></el-table-column>
<!--            <el-table-column prop="collection" label="收藏数" width="60"></el-table-column>-->
<!--            <el-table-column prop="seen" label="已看过" width="60"></el-table-column>-->
            <el-table-column prop="year" label="上映年份" width="80"></el-table-column>
            <el-table-column prop="poster" label="海报" width="120">
                <template slot-scope="scope">
                    <img :src="require('../img/'+scope.row.poster)" style="width: 80px; height: 80px">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-on:click="delMovie(scope.row.mid)" class="el-icon-delete" type="danger">删除</el-button>
                    <el-button v-on:click="updateMovie(scope.row.mid)" class="el-icon-edit" type="primary">修改</el-button>
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
        name: `findMovie`,
        data(){
            return{
                index:'',
                tableData:[],
                name1:''
            }
        },
        mounted(){
            this.$http.get("http://localhost:8081/movie/findMovie?index=1").then(req=>{
                // 给 data 中的 list 赋值
                this.tableData = req.data.list;
            })
        },
        methods:{
            changePage:function (index) {
                this.$http.get("http://localhost:8081/movie/findMovie?index="+index).then(req=>{
                    this.index=req.data.index;
                    this.tableData=req.data.list;
                })
            },

            findMo:function(){
                let name1 = this.name1;
                localStorage.setItem("name",name1);
                this.$router.push('findMovieMo');
            },

            delMovie:function (mid) {
                // 根据 id 删除数据
                if (confirm("是否删除数据?")){
                    this.$http.get("http://localhost:8081/movie/delMovie?mid="+mid).then(req=>{
                        if (req.data==true){
                            alert("删除成功!")
                            // 删除成功后刷新页面
                            location.reload();
                        }
                    })
                }
            },

            updateMovie:function (mid) {
                // 跳转至修改页面
                this.$router.push({name:"updateMovie",params:{mid:mid}});
            },

            addMovie:function () {
                alert("即将跳转至添加界面!")
                // 跳转至添加页面
                this.$router.push({name:"addMovie"});
            }
        }
    }
</script>

<style scoped>
    #main {
        width: 1400px;
        height: 400px;
        margin: 0 auto;
    }
    #findMo{
        width: 400px;
        margin-left: -85px;
    }
</style>