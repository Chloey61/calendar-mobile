import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuard } from 'vue-router';
import myCalendar from '../views/myCalendar.vue';

const Login: NavigationGuard = (to: any, from: any, next: any) => {
    next();
};

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        beforeEnter: Login,
        component: myCalendar,
        meta: {
            title: 'dome',
        },
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

router.beforeEach((to: any, from: any, next: any) => {
    if (to.meta.title) {
        document.title = to.meta.title as any;
    }
    next();
});

export default router;
