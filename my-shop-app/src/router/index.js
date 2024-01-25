import {  createRouter, createWebHistory } from 'vue-router'

console.log('ROUTER INITIALIZATION')
import { useAuthStore } from '../stores/AuthStore';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import('../views/LoginView.vue')
    },
    {
      path: "/register",
      name: "Register",
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: "/",
      name: "Home",
      component: () => import('../views/HomeView.vue'),
      meta:{
      requiresAuth: true
      }
    },
    {
      path: "/cart",
      name: "Cart",
      component: () => import('../views/ShopcartView.vue'),
      meta:{
      requiresAuth: true,
      roles : ['user']
      }
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import('../views/AdminView.vue'),
      meta:{
      requiresAuth: true,
      roles : ['admin']
      }
    },
    {
      path: "/products/:productId",
      name: "Product",
      component: () => import('../views/ProductView.vue'),
      meta:{
      requiresAuth: true
      }
    },
    {
      path: "/unauthorized",
      name: "Unauthorized",
      component: () => import('../views/UnauthorizedView.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  const auth = useAuthStore()
  //console.log(auth.user)

  if (to.matched.some(record => record.meta.requiresAuth)) {

    // this route requires auth, check if logged in
    if (!token) {
      // no token, redirect to login page
      next({ name: 'Login' })
    } else {
      // token exists, but check if user role is authorized for this view
      //console.log('comparing roles')
      //console.log('meta role: ',to.meta.roles)
      //console.log('user role: '+auth.user.role)
      if(to.meta.roles && to.meta.roles != auth.user.role){
        console.log(to.meta.roles+ ' NOT MATCH WITH '+auth.user.role)
        next({ name: 'Unauthorized'})
      }
      next()
    }
  } else {
    // this route does not require auth, allow access to all
    next()
  }
})


export default router
