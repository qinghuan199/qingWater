import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

    state: {
        //这里放全局参数
        userInfo: {},
        baseInfo:{}

    },
    mutations: {
        setUserInfoValue(state,Value){
            state.userInfo = Value
        },
        setBaseInfoValue(state,Value){
            state.baseInfo = Value
        }
    },
    getters: {
        //get方法
        getUserInfo: state => state.userInfo,
        getBaseInfo: state => state.baseInfo,
    },
    actions: {
        //这个部分我暂时用不上
    },
    modules: {
        //这里是我自己理解的是为了给全局变量分组，所以需要写提前声明其他store文件，然后引入这里
    }
})