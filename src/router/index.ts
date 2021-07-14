import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuard } from 'vue-router';
import Layout from '../components/Layout.vue';
import Home from '../views/Home.vue';
import myCalendar from '../views/myCalendar.vue';
import Followed from '../views/Followed.vue';
import authRouter from '../nmb/oauth2-mobile-wx/routes/index';
import rely from '../nmb/oauth2-mobile-wx/oauth2rely';

const Login: NavigationGuard = (to, from, next) => {
    rely.checkLogin(to, next);
    next();
};

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        beforeEnter: Login,
        component: Layout,
        redirect: 'home',
        children: [
            {
                path: 'home',
                component: Home,
            },
        ],
    },
    {
        path: '/followedInfo/:UserGUID',
        beforeEnter: Login,
        component: Followed,
        meta: {
            title: '日历关注审核',
        },
    },
    {
        path: '/test',
        beforeEnter: Login,
        component: myCalendar,
        meta: {
            title: 'dome',
        },
    },
    authRouter(),
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title as any;
    }
    next();
});

export default router;
