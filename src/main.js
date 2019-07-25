import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(function(config){
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
},function(error) {
  console.log(error);
})
Vue.prototype.$http = axios



import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'


Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

Vue.filter('dateFormat', function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}: ${mm}: ${ss}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
