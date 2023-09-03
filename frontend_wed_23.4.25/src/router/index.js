import {createRouter, createWebHashHistory} from 'vue-router'
import homeView from "@/views/homeView.vue";
import announcementView from "@/views/announcementView.vue";
import complainView from "@/views/complainView.vue";

import sixDimension from "@/views/sixDimension.vue";
import allPost from "@/views/allPost.vue";
import sensitivePost from "@/views/sensitivePost.vue";
import negativePost from "@/views/negativePost.vue";
import hospitalView from "@/views/hospitalView.vue";
//页面配置
const routes = [
    {
        path: '/home',
        name: 'home',
        component: homeView,
        children: [
            {path: 'hospital', component: hospitalView},//医院主页
            {path: 'announcement', component: announcementView},//公告
            {path: 'complain', component: complainView},//投诉
            {path: 'sixDimension', component: sixDimension},//热词
            {path: 'allPost', component: allPost},//所有帖
            {path: 'sensitivePost', component: sensitivePost},//敏感贴
            {path: 'negativePost', component: negativePost},//消极贴
        ]
    },
    {
        path: "/",
        name: "login",
        component: ()=>import("../views/loginView.vue")
    },
    {
        path: "/postDetailView/:postId",
        name: "postDetailView",
        component: () => import("../views/postDetailView.vue")
    },
    {
        path: "/complainDetail/:complainId",
        name: "complainDetail",
        component: () => import("../views/complainDetail.vue")
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router