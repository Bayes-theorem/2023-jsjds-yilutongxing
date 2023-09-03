import { createApp } from 'vue'
import App from './App.vue'

import router from "@/router";
import store from "@/store"
import elementIcon from './plugins/icons'
import './assets/styles/icon/iconfont.css'
import { ElMessage } from 'element-plus'
const app = createApp(App)

app.use(router)
app.use(store)
app.use(elementIcon)
app.use(ElMessage)
app.mount('#app')
