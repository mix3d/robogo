import Vue from 'vue'
// this didn't seem to work for some reason
// import VueNativeSock from 'vue-native-websocket'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false
// Vue.use(VueNativeSock, 'ws://localhost:8001/api/streams/robots/positions/?interval=3000&num_robots=1', { format: 'json' })

new Vue({
  render: h => h(App),
}).$mount('#app')
