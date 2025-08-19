import App from './App'
import uView from '@/uni_modules/uview-ui'
import messages from './locale/index'
import zhHant from '@/locale/zh-Hant.json'
import {
	getUser,
	setCacheCheck,
	getCacheCheck,
	initswipToVerify
} from "./common/common.js"

let i18nConfig = {
	locale: 'zh-Hant',
	fallbackLocale: 'zh-Hant',
	messages
}


// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.use(uView)
Vue.prototype.$setCacheCheck = setCacheCheck
Vue.prototype.$getCacheCheck = getCacheCheck
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
	...App
})
//去除console.log控制输出
if (location.hostname.indexOf('localhost') == -1 && location.hostname.indexOf('192.168.') == -1 && location.hostname
	.indexOf('127.0.0.1') == -1) {
	console.log = () => {}
}
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import {
	createI18n
} from 'vue-i18n'
// const i18n = createI18n(i18nConfig)
export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(uView)
	return {
		app
	}
}
// #endif