import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import jquery from 'jquery'
import echarts from 'echarts'

Vue.config.productionTip = false
// 重新定义axios
Vue.prototype.$http=axios
Vue.prototype.$=jquery
Vue.prototype.$echarts=echarts

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
