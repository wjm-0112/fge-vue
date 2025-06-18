import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Router)
Vue.use(ElementUI)

import index1 from "@/components/index1.vue"

import findUser from "@/components/user/findUser"
import findUserMo from "@/components/user/findUserMo"
import updateUser from "@/components/user/updateUser"
import addUser from "@/components/user/addUser"

import findCategory1 from "@/components/category1/findCategory1"
import updateCategory1 from "@/components/category1/updateCategory1"
import addCategory1 from "@/components/category1/addCategory1"

import findCategory2 from "@/components/category2/findCategory2"
import findCategory2Mo from "@/components/category2/findCategory2Mo"
import updateCategory2 from "@/components/category2/updateCategory2"
import addCategory2 from "@/components/category2/addCategory2"

import findMovie from "@/components/movie/findMovie"
import findMovieMo from "@/components/movie/findMovieMo"
import updateMovie from "@/components/movie/updateMovie"
import addMovie from "@/components/movie/addMovie"

import findRank from "@/components/rank/findRank"

import findUserCollection from "@/components/userCollection/findUserCollection"
import findUserCollectionMo from "@/components/userCollection/findUserCollectionMo"
import updateUserCollection from "@/components/userCollection/updateUserCollection"
import addUserCollection from "@/components/userCollection/addUserCollection"

import findUserSeen from "@/components/userSeen/findUserSeen"
import findUserSeenMo from "@/components/userSeen/findUserSeenMo"

import findComment from "@/components/comment/findComment"
import findCommentMo from "@/components/comment/findCommentMo"
import addComment from "@/components/comment/addComment"


import echartsMovie from "@/components/echarts/echartsMovie"
import echartsUser from "@/components/echarts/echartsUser"
import echartsComment from "@/components/echarts/echartsComment"

import index from "@/components/index.vue"
import category from "@/components/category"
import search from "@/components/search"
import LoginAndRegister from "@/components/LoginAndRegister"
import MovieDetail from "@/components/MovieDetail"
import home from "@/components/home"


export default new Router({
    routes:[{
        path:'/',
        name:'index',
        component:index
    },{
        path:'/LoginAndRegister',
        name:'LoginAndRegister',
        component:LoginAndRegister
    },{
        path:'/category',
        name:'category',
        component:category
    },{
        path:'/search',
        name:'search',
        component:search
    },{
        path:'/MovieDetail',
        name:'MovieDetail',
        component:MovieDetail
    },{
        path:'/home',
        name:'home',
        component:home
    },{
        path:'/index1',
        name:'index1',
        component:index1,
        children:[{
            path:'/findUser',
            name:'findUser',
            component:findUser,
            meta:{title:'用户列表'}
        },{
            path:'/findUserMo',
            name:'findUserMo',
            component:findUserMo,
            meta:{title:'用户列表Mo'}
        },{
            path:'/updateUser',
            name:'updateUser',
            component:updateUser,
            meta:{title:'修改用户'}
        },{
            path:'/addUser',
            name:'addUser',
            component:addUser,
            meta:{title:'添加用户'}
        },{
            path:'/findCategory1',
            name:'findCategory1',
            component:findCategory1,
            meta:{title:'地区列表'}
        },{
            path:'/updateCategory1',
            name:'updateCategory1',
            component:updateCategory1,
            meta:{title:'修改地区'}
        },{
            path:'/addCategory1',
            name:'addCategory1',
            component:addCategory1,
            meta:{title:'添加地区'}
        },{
            path:'/findCategory2',
            name:'findCategory2',
            component:findCategory2,
            meta:{title:'种类列表'}
        },{
            path:'/findCategory2Mo',
            name:'findCategory2Mo',
            component:findCategory2Mo,
            meta:{title:'种类列表Mo'}
        },{
            path:'/updateCategory2',
            name:'updateCategory2',
            component:updateCategory2,
            meta:{title:'修改类型'}
        },{
            path:'/addCategory2',
            name:'addCategory2',
            component:addCategory2,
            meta:{title:'添加类型'}
        },{
            path:'/findMovie',
            name:'findMovie',
            component:findMovie,
            meta:{title:'电影列表'}
        },{
            path:'/findMovieMo',
            name:'findMovieMo',
            component:findMovieMo,
            meta:{title:'电影列表Mo'}
        },{
            path:'/updateMovie',
            name:'updateMovie',
            component:updateMovie,
            meta:{title:'修改电影'}
        },{
            path:'/addMovie',
            name:'addMovie',
            component:addMovie,
            meta:{title:'添加电影'}
        },{
            path:'/findRank',
            name:'findRank',
            component:findRank,
            meta:{title:'排行列表'}
        },{
            path:'/findUserCollection',
            name:'findUserCollection',
            component:findUserCollection,
            meta:{title:'收藏列表'}
        },{
            path:'/findUserCollectionMo',
            name:'findUserCollectionMo',
            component:findUserCollectionMo,
            meta:{title:'收藏列表Mo'}
        },{
            path:'/updateUserCollection',
            name:'updateUserCollection',
            component:updateUserCollection,
            meta:{title:'修改收藏'}
        },{
            path:'/addUserCollection',
            name:'addUserCollection',
            component:addUserCollection,
            meta:{title:'添加收藏'}
        },{
            path:'/findUserSeen',
            name:'findUserSeen',
            component:findUserSeen,
            meta:{title:'想看列表'}
        },{
            path:'/findUserSeenMo',
            name:'findUserSeenMo',
            component:findUserSeenMo,
            meta:{title:'想看列表Mo'}
        },{
            path:'/findComment',
            name:'findComment',
            component:findComment,
            meta:{title:'评论列表'}
        },{
            path:'/findCommentMo',
            name:'findCommentMo',
            component:findCommentMo,
            meta:{title:'评论列表Mo'}
        },{
            path:'/addComment',
            name:'addComment',
            component:addComment,
            meta:{title:'添加评论'}
        },{
            path:'/echartsMovie',
            name:'echartsMovie',
            component:echartsMovie,
            meta:{title:'电影分析'}
        },{
            path:'/echartsUser',
            name:'echartsUser',
            component:echartsUser,
            meta:{title:'用户分析'}
        },{
            path:'/echartsComment',
            name:'echartsComment',
            component:echartsComment,
            meta:{title:'评论列表'}
        }]
    }]
})