import Vue from 'vue';
import App from './App.vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router';
import http from './http';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import common from './common/function'
import 'swiper/swiper-bundle.css'
import store from './store'


import 'video.js/dist/video-js.css'


//

Vue.prototype.$http = http
Vue.prototype.common = common
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
Vue.use(Vant);
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
