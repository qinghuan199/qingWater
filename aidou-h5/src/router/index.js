import Vue from 'vue'
import VueRouter from 'vue-router'
//首页
import Home from '../pages/home/index.vue'/* 首页 */
import Mine from '../pages/mine/index.vue'/* 我的 */
import Choose from '../pages/choose/index.vue'/* 选妃 */
import List from '../pages/choose/list.vue'/* 选妃列表 */
import Profile from '../pages/choose/profile.vue'/* 选妃详情 */
import Mandates from '../pages/choose/mandates.vue'/* 选妃任务 */
import Video from '../pages/video/index.vue'/* 视频 */
import Game from '../pages/game/index.vue'/* 游戏 */
import Login from '../pages/login/index.vue'/* 登录 */
import Register from '../pages/login/register.vue'/* 注册 */
import ServiceOnline from '../pages/mine/ServiceOnline.vue'/* 客服列表 */
import ServicePage from '../pages/mine/ServicePage.vue'/* 客服详情界面 */
import Setting from '../pages/mine/Setting.vue'/* 设置 */
import Infomation from '../pages/mine/Infomation.vue'/* 基本信息 */
import Setname from '../pages/mine/Setname.vue'/* 修改姓名 */
import Setsex from '../pages/mine/Setsex.vue'/* 修改姓名 */
import SetPayPassword from '../pages/mine/SetPayPassword.vue'/* 修改提现密码 */
import SetLoginPassword from '../pages/mine/SetLoginPassword.vue'/* 修改提现密码 */
import Lottery from '../pages/lottery/index.vue'/* 彩票详情 */
import Notice from '../pages/mine/Notice.vue'/* 公告 */
import NoticeDetail from '../pages/mine/NoticeDetail.vue'/* 公告详情 */
import PlayVideo  from '../pages/video/PlayVideo'/* 视频播放页面 */
import Setbank  from '../pages/mine/Setbank'/* 视频播放页面 */
import BindCard  from '../pages/mine/BindCard'/* 绑定银行卡界面 */
import Withdraw  from '../pages/mine/Withdraw'/* 绑定银行卡界面 */
import Personalreport  from '../pages/mine/Personalreport'/* 个人表报 */
import GameRecord  from '../pages/mine/GameRecord'/* 游戏记录 */
import WithdrawRecord  from '../pages/mine/WithdrawRecord'/* 提现记录 */
import Address from '../pages/address/index.vue' /* 地区选择 */




Vue.use(VueRouter)
const routes = [
    {path:'/',redirect:'/Home',component:Home,meta:{title:'首页'}},
    {path:'/Home',name:'home',component:Home,meta:{title:'首页'}},
	{path:'/Choose',name:'choose',component:Choose,meta:{title:'选妃'}},
	{path:'/List',name:'list',component:List,meta:{title:'选妃列表'}},
	{path:'/Profile',name:'profile',component:Profile,meta:{title:'选妃详情'}},
	{path:'/Mandates',name:'mandates',component:Mandates,meta:{title:'选妃任务'}},
    {path:'/Mine',name:'mine',component:Mine,meta:{title:'我的'}},
    {path:'/Video',name:'video',component:Video,meta:{title:'视频'}},
    {path:'/Game',name:'game',component:Game,meta:{title:'游戏'}},
    {path:'/Login',name:'login',component:Login,meta:{title:'登录'}},
    {path:'/Register',name:'register',component:Register,meta:{title:'注册'}},
    {path:'/ServiceOnline',name:'ServiceOnline',component:ServiceOnline,meta:{title:'在线客服'}},
    {path:'/ServicePage',name:'ServicePage',component:ServicePage,meta:{title:'在线客服'}},
    {path:'/Setting',name:'Setting',component:Setting,meta:{title:'设置'}},
    {path:'/Infomation',name:'Infomation',component:Infomation,meta:{title:'基本信息'}},
    {path:'/Setname',name:'Setname',component:Setname,meta:{title:'修改真实姓名'}},
    {path:'/Setsex',name:'Setsex',component:Setsex,meta:{title:'修改性别'}},
    {path:'/SetPayPassword',name:'SetPayPassword',component:SetPayPassword,meta:{title:'支付密码管理'}},
    {path:'/SetLoginPassword',name:'SetLoginPassword',component:SetLoginPassword,meta:{title:'登录密码管理'}},
    {path:'/Lottery',name:'Lottery',component:Lottery,meta:{title:'详情页面'}},
    {path:'/Notice',name:'Notice',component:Notice,meta:{title:'信息公告'}},
    {path:'/NoticeDetail/:id',name:'NoticeDetail',component:NoticeDetail,meta:{title:'公告详情'}},
    {path:'/PlayVideo',name:'PlayVideo',component:PlayVideo,meta:{title:'视频播放'}},
    {path:'/Setbank',name:'Setbank',component:Setbank,meta:{title:'填写收款卡'}},
    {path:'/BindCard',name:'BindCard',component:BindCard,meta:{title:'填写收款卡'}},
    {path:'/Withdraw',name:'Withdraw',component:Withdraw,meta:{title:'提现'}},
    {path:'/Personalreport',name:'Personalreport',component:Personalreport,meta:{title:'个人报表'}},
    {path:'/WithdrawRecord',name:'WithdrawRecord',component:WithdrawRecord,meta:{title:'提现记录'}},
    {path:'/GameRecord',name:'GameRecord',component:GameRecord,meta:{title:'任务记录'}},
    {path:'/Address',name:'Address',component:Address,meta:{title:'地区选择'}},


];

//生成路由实例
const router = new VueRouter({
    routes
})
router.beforeEach((to,from,next) => {         //修改标题路由配置加上这个
    document.title = to.matched[0].meta.title
    next()
})

export default router