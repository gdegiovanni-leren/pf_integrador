import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)


axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
      config.headers["Authorization"] = `Bearer ${token}`
      return config
})


axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    console.log('@ axios response interceptor catch error @')
    console.log(error.response.data)

    if (error.response.status == 403) {
      //FIXME
      if(window.location.pathname != '/register'){
      router.push('/login')
      }
    }
    return Promise.reject(error)
  })

app.mount('#app')
