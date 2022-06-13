import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user';
import HomeView from '@/views/Home.vue' // these components will be pre-loaded rather than lazy loaded
import LoginView from '@/views/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresAuth: false },
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/SignUp.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/create',
            name: 'create',
            component: () => import('../views/Create.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/account',
            name: 'account',
            component: () => import('../views/Account.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/invite',
            name: 'invite',
            component: () => import('../views/Invite.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/invitation/:id',
            name: 'invitationSignup',
            component: () => import('../views/SignUp.vue'),
            meta: { requiresAuth: false },
        }
    ]
})
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    // console.log('to, from, next, logged in?', to.meta, from, next, userStore.getAuth)

    if (!userStore.getAuth && to.meta.requiresAuth) {
        next('/login')
    } else if (userStore.getAuth && !to.meta.requiresAuth) {
        // console.log('hide login page from authenticated users')
        next('/')
    } else {
        next();
    }
})


export default router
