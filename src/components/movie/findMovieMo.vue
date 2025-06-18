<template>
    <div id="main">
        <h3>电影列表Mo</h3>
        <div id="findMo">
            <!--            <el-input type="text" v-model="uname1"/>-->
            <input type="text" v-model="name1" placeholder="请输入类型">&nbsp;&nbsp;
            <button v-on:click="findMo()">查询</button>
            <!--            <el-button type="info" v-on:click="findMo()">查询</el-button>-->
        </div>

        <el-table :data="tableData" height="300" border stripe style="width: 100%" v-loading="loading">
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
        name: `findMovieMo`,
        data(){
            return{
                name1:'',
                tableData:[],
                index:'',
            }
        },
        mounted(){
            let name1 = localStorage.getItem("name");
            // 将取到的参数给 data 中的 uname1 赋值
            this.name1 = name1;

            // 访问后端 将 name1 传递至后台
            this.$http.get("http://localhost:8081/movie/findMovieMo?index=1"+"&name="+name1).then(req=>{
                // 给 tableData 赋值
                this.tableData=req.data.list;
            })
        },
        methods:{
            changePage:function (index) {
                let name1 = this.name1;

                this.$http.get("http://localhost:8081/movie/findMovieMo?index="+index+"&name="+name1).then(req=>{
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
        width: 1400px;
        height: 2500px;
        margin: 0 auto;
    }
    #findMo{
        width: 400px;
        margin-left: -85px;
    }
</style>