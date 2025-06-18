<template>
    <div id="main">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="电影编号">
                <el-input v-model="ruleForm.mid" disabled ></el-input>
            </el-form-item>
            <el-form-item label="电影名称">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="播放时长">
                <el-input v-model="ruleForm.time"></el-input>
            </el-form-item>
            <el-form-item label="导演">
                <el-input v-model="ruleForm.director"></el-input>
            </el-form-item>
            <el-form-item label="主演">
                <el-input v-model="ruleForm.actor"></el-input>
            </el-form-item>
            <el-form-item label="地区">
                <el-select v-model="ruleForm.category1.area" placeholder="请选择地区">
                    <el-option label="中国大陆" value="中国大陆"></el-option>
                    <el-option label="美国" value="美国"></el-option>
                    <el-option label="日本" value="日本"></el-option>
                    <el-option label="韩国" value="韩国"></el-option>
                    <el-option label="英国" value="英国"></el-option>
                    <el-option label="法国" value="法国"></el-option>
                    <el-option label="印度" value="印度"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="ruleForm.category2.type" placeholder="请选择类型">
                    <el-option label="动作" value="动作"></el-option>
                    <el-option label="喜剧" value="喜剧"></el-option>
                    <el-option label="悬疑" value="悬疑"></el-option>
                    <el-option label="科幻" value="科幻"></el-option>
                    <el-option label="动画" value="动画"></el-option>
                    <el-option label="剧情" value="剧情"></el-option>
                    <el-option label="爱情" value="爱情"></el-option>
                    <el-option label="恐怖" value="恐怖"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="评分">
                <el-input v-model="ruleForm.score"></el-input>
            </el-form-item>
            <el-form-item label="收藏数">
                <el-input v-model="ruleForm.collection"></el-input>
            </el-form-item>
            <el-form-item label="已看数">
                <el-input v-model="ruleForm.seen"></el-input>
            </el-form-item>
            <el-form-item label="上映年份">
                <el-input v-model="ruleForm.year"></el-input>
            </el-form-item>
            <el-form-item label="海报路径">
                <el-input v-model="ruleForm.poster"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="info" @click="return1('findMovie')">返回</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: `updateMovie`,
        data(){
            return{
                ruleForm:{
                    mid:'',
                    name:'',
                    time:'',
                    director:'',
                    actor:'',
                    category1:{
                      area:''
                    },
                    category2:{
                      type:''
                    },
                    description:'',
                    score:'',
                    collection:'',
                    seen:'',
                    year:'',
                    poster:''
                }
            }
        },

        mounted(){
            // 获取 id
            let mid = this.$route.params.mid;
            alert("即将跳转至修改界面!")
            // 根据 id 查询数据
            this.$http.get("http://localhost:8081/movie/findById?mid="+mid).then(req=>{
                this.ruleForm = req.data;

            })
        },

        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //  获取data中的数据
                        let mid = this.ruleForm.mid;
                        let name = this.ruleForm.name;
                        let time = this.ruleForm.time;
                        let director = this.ruleForm.director;
                        let actor = this.ruleForm.actor;
                        let category1 = this.ruleForm.area;
                        let category2 = this.ruleForm.type;
                        let description = this.ruleForm.description;
                        let score = this.ruleForm.score;
                        let collection = this.ruleForm.collection;
                        let seen = this.ruleForm.seen;
                        let year = this.ruleForm.year;
                        let poster = this.ruleForm.poster;
                        // 将数据提交至后台
                        if (confirm("是否修改数据?")){
                            this.$http.get("http://localhost:8081/movie/updateMovie?mid="+mid+"&name="+name+"&name="+"&time="+time+"&director="+director+"&actor="+actor+"&category1="+category1+
                                "&category2="+category2+"&description="+description+"&score="+score+"&collection="+collection+"&seen="+seen+"&year="+year+"&poster="+poster).then(req=>{
                                if (req.data==true){
                                    alert("修改成功!");
                                    this.$router.push("findMovie");
                                }
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            return1(){
                //   返回
                if (confirm("是否返回?")){
                    this.$router.push("findMovie");
                }
            }
        }
    }
</script>

<style scoped>
    #main {
        width: 1400px;
        height: 1500px;
        margin: 0 auto;
    }

</style>