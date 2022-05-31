import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user';
import HomeView from '@/views/Home.vue' // these components will be pre-loaded rather than lazy loaded
import LoginView from '@/views/Login.vue'
// const userStore = useUserStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      requiredAuth: 'auth'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      requiredAuth: 'guest'
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUp.vue'),
      requiredAuth: 'guest'
    },
    // {
    //   path: '/postDetail/:id',
    //   name: 'postDetail',
    //   component: () => import('../views/PostDetailView.vue')
    // }
  ]
})
// .beforeEach(async (to, from) => {
//   if (to.requiresAuth) {
//     if (useUserStore().userStore.getAuth.token) {
//       next()
//       return
//     }
//     next('/login')
//   } else {
//     next()
//   }

// })

export default router
