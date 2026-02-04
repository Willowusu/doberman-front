import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import axios from 'axios';
import { createPinia } from 'pinia'

axios.defaults.baseURL = 'https://doberman-back.onrender.com/api/v1'; 
axios.defaults.withCredentials = true; // Essential for sessions/cookies

const app = createApp(App)
const pinia = createPinia() 

app.use(router) 
app.use(pinia) 

app.mount('#app')