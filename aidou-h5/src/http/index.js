import axios from 'axios'
import api from './api'
import Vue from 'vue';
let Base64 = require('js-base64').Base64;
import { Toast } from 'vant';
import qs from "qs";

Vue.use(Toast);
//创建axios实例对象  
const  instance = axios.create({
    baseURL: 'https://www.laiyuan.cc/api/', //服务器地址
    timeout: 5000, //默认超时时长
})

//请求拦截器
instance.interceptors.request.use(config=>{
    if(config.method === "post"){
        config.headers = {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8', // 设置跨域头部
        }
    }
    if(localStorage.getItem('token')){
        config.headers = {
            'token': Base64.encode(localStorage.getItem('token')),
        }
    }
    return config
},err=>{
    console.error('请求失败',err)
})

//响应拦截器
instance.interceptors.response.use(res=>{
    //此处对响应数据做处理
    if(res.data.msg === "鉴权错误"){
        localStorage.clear();
        this.$router.push({path:'/Login'})
    }
    return res //该返回对象会传到请求方法的响应对象中
},err=>{
    // 响应错误处理
    return Promise.reject(err);
})

//封装axios请求方法，参数为配置对象
//option = {method,url,params} method为请求方法，url为请求接口，params为请求参数
async function http(option = {}) {
    let result = null
    if(option.method === 'get' || option.method === 'delete'){
        //处理get、delete请求
        await instance[option.method](
            api[option.url],
            {params: option.data}
        ).then(res=>{
            result = res.data
            result.data = JSON.parse(Base64.decode(result.data));
        }).catch(err=>{
            result = err
        })
    }else if(option.method === 'post' || option.method === 'put'){
        //处理post、put请求
        await instance[option.method](
                api[option.url],
            qs.stringify(option.data)
        ).then(res=>{
            result = res.data;
            result.data = JSON.parse(Base64.decode(result.data));
        }).catch(err=>{
            result = err
        })
    }
    return result
}

export default http

