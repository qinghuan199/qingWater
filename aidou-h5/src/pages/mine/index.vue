<template>
  <div class="mine page">
    <!-- <div class="page-bg" ></div> -->
    <div class="wrapper">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
         <div class="header">
           <van-nav-bar class="nav-bar">
             <template #right>
               <van-icon name="setting-o" @click="showSetting()" color="#fff"/>
             </template>
           </van-nav-bar>
           <div class="user-wrapper" @click="doLogin()">
             <van-image round class="user_img" src="img/mine/timibbs_user_img.jpg">
               <template v-slot:loading>
                 <van-loading type="spinner"/>
               </template>
             </van-image>
             <div class="login-content">
               <p class="login-btn" >{{this.userInfo.username}}</p>
               <!-- <p class="login-label">{{this.userInfo.ip}}</p> -->
             </div>
           </div>
         </div>
         <div class="content">
            <div class="finance">
            <div class="finance-item"  @click="doPay()">
              <van-icon class="icon" style="" name="peer-pay" />
              <span class="text">充值</span>
            </div>
            <div class="line"></div>
            <div class="finance-item"  @click="doWithdrawal()">
              <van-icon class="icon" name="idcard" />
              <span class="text">提现</span>
            </div>
          </div>
            <div v-if="this.userInfo.money" class="wallet">
                <div class="part-1 van-hairline--bottom">
                  <p class="flex-1 font-28 font-primary-color">我的钱包</p>
                  <span class="font-28 font-gray">详情</span>
                  <van-icon class="font-gray" style="font-size: 28px" name="arrow" />
                </div>
                <div class="part-2">
                  <p class="balance van-ellipsis">{{this.userInfo.money}}</p>
                  <span class="font-28 font-gray">余额(元)</span>
                  <div class="refresh-btn" @click="refresh()"><van-icon name="replay" /></div>
                </div>
            </div>
            <div :style="{ marginTop: menu_top +'px'}" class="menu" >
              <div class="menu-item" @click="$router.push({path:'/Personalreport'});">
                <van-image class="menu-item-icon" src="img/mine/baobiao.svg">
                  <template v-slot:loading>
                    <van-loading type="spinner"/>
                  </template>
                </van-image>
                <span class="menu-item-label" >个人报表</span>
              </div>
              <div class="menu-item" @click="exit()">
                <van-image class="menu-item-icon" src="img/mine/mingxi.svg">
                  <template v-slot:loading>
                    <van-loading type="spinner"/>
                  </template>
                </van-image>
                <span class="menu-item-label" >账户明细</span>
              </div>
              <div class="menu-item" @click="$router.push({path:'/GameRecord'});">
                <van-image class="menu-item-icon" src="img/mine/youxi.svg">
                  <template v-slot:loading>
                    <van-loading type="spinner"/>
                  </template>
                </van-image>
                <span class="menu-item-label" >打榜记录</span>
              </div>
              <div class="menu-item" @click="$router.push({path:'/Infomation'});">
                <van-image class="menu-item-icon" src="img/mine/user.svg">
                  <template v-slot:loading>
                    <van-loading type="spinner"/>
                  </template>
                </van-image>
                <span class="menu-item-label" >个人中心</span>
              </div>
              <div class="menu-item" @click="toNotice()">
                <van-image class="menu-item-icon" src="img/mine/gonggao.svg">
                  <template v-slot:loading>
                    <van-loading type="spinner"/>
                  </template>
                </van-image>
                <span class="menu-item-label" >信息公告</span>
              </div>
              <div class="menu-item" @click="toService()">
                <van-image class="menu-item-icon" src="img/mine/kefu_1.svg">
                  <template v-slot:loading>
                    <van-loading type="spinner"/>
                  </template>
                </van-image>
                <span class="menu-item-label" >在线客服</span>
              </div>
            </div>
         </div>
      </van-pull-refresh>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      userInfo:{
      },
      menu_top:40,
      isLoading: false,
    };
  },
  methods: {
    refresh(){
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        if(localStorage.getItem('token')){
          this.$toast("刷新成功");
        }else{
          this.$router.push({path:'/Login'})
        }
      }, 500);
    },
    exit(){
      this.$toast("请完成任务单后进入");
    },
    showSetting() {
      if(localStorage.getItem('token')){
        this.$router.push({path:'/Setting'})
      }else{
        this.$router.push({path:'/Login'})
      }
    },
    toNotice(){
      if(localStorage.getItem('token')){
        this.$router.push({path:'/Notice'})
      }else{
        this.$router.push({path:'/Login'})
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        if(localStorage.getItem('token')){
            this.getUserInfo();
            this.$toast("刷新成功");
        }else{
            this.$router.push({path:'/Login'})
        }
      }, 500);
    },
    doLogin(){
        if(localStorage.getItem('token')){
            this.$router.push({path:'/Infomation'});
        }else {
            this.$router.push({path:'/Login'})
        }
    },
    doPay(){
      this.$toast("请联系客服充值");
      return false;
    },
    doWithdrawal(){
      this.$http({
        method: 'get',
        url: 'user_get_bank'
      }).then(res=>{
          if(res.data.is_bank){
            this.$router.push("withdraw");
          }else {
            this.$router.push("Setbank");
            this.$toast.fail("请设置收款卡!");
          }
      })
    },
    toService(){
      if(this.$store.getters.getBaseInfo.iskefu == 1){
        this.$router.push("ServiceOnline");
      }else {
        this.$toast.fail("功能已禁用!");
      }
    },
    getUserInfo(){
      this.$http({
        method: 'get',
        url: 'user_info'
      }).then(res=>{
        if(res.code === 200){
            this.userInfo = res.data;
            this.menu_top = 15;
            if(this.userInfo.status !== 1){
              this.$toast("账号下线");
              localStorage.clear()
              this.$router.push({path:'/Login'})
            }
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
    },
  },
  created() {
    if(localStorage.getItem('token')){
        this.getUserInfo();
    }else {
      this.userInfo.username = "登录/注册";
      this.userInfo.ip = "登录可享受更多服务！";
      this.userInfo.header_img = "img/mine/timibbs_user_img.jpg";
    }
  }
};
</script>

<style scoped>
.van-pull-refresh{
  height: 100%;
}
.page{
  position: absolute!important;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f2f2f5;
}
.mine{
  position: relative;
  bottom: 10px;
  background: #f2f2f5;
}
.mine .wrapper{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.nav-bar{
  background: linear-gradient(
      90deg,#7e5678,#e6c3a1);
}
.mine .header{
  /* background: linear-gradient(
      90deg,#7e5678,#e6c3a1); */
  padding-bottom: 100px;
}
::v-deep .van-nav-bar__content {
  height: 100px;
}
::v-deep .van-hairline--bottom::after {
  border-bottom-width: 0px;
}
.mine .header .van-nav-bar .van-icon {
  font-size: 45px;
}
.mine .header .user-wrapper{
  display: flex;
  align-items: center;
  margin: 0px 40px 0px 40px;

}
.mine .user_img{
  height: 130px;
  width: 130px;
}
::v-deep .van-loading__spinner {
  height: 50px;
  width: 50px;
}
::v-deep .van-image__error-icon {
  font-size: 70px;
}
.mine  .header .user-wrapper .login-content{
  flex: 1;
  margin-left: 30px;
}
.mine  .header .user-wrapper .login-content .login-btn{
  display: inline-block;
  font-size: 40px;
  line-height: 0px;
  color: #fff;
}
.mine .header .user-wrapper .login-content .login-label{
  margin-top: -13px;
  font-size: 28px;
  color: hsla(0,0%,100%,.6);
}
.mine .page-bg{
  height: 500px;
  background: linear-gradient(
      90deg,#7e5678,#e6c3a1);
}
.mine .content{
  position: relative;
  padding: 10px 30px 30px;
  min-height: 500px;
  /* background-color: #f2f2f5; */
}

::v-deep .van-pull-refresh__track .van-pull-refresh__head *{
  color: #ffffff;
  font-size: 35px;
}

.mine .wrapper .content .finance {
  position: absolute;
  display: flex;
  align-items: center;
  top: -55px;
  left: 30px;
  right: 30px;
  height: 120px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 1.5px 1px 0 #e4e4e7;
}
.mine .wrapper .content .finance .line{
  width: 3px;
  height: 40px;
  background-color: #ccc;
}
.mine .wrapper .content .finance .finance-item{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.mine .wrapper .content .finance .finance-item .text{
  margin-left: 30px;
  font-size: 30px;
  color: #000;
  font-weight: 500;
}
.mine .wrapper .content .finance .finance-item .icon{
  font-size: 50px;
}
.mine .wrapper .content .menu{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 1.5px 1px 0 #e4e4e7;
}
.mine .wrapper .content .menu .menu-item{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50%;
  height: 130px;
}
.mine .wrapper .content .menu .menu-item .menu-item-label{
  font-size: 30px;
  color: #868686;
  font-weight: 500;
}
.mine .wrapper .content .menu .menu-item .menu-item-icon{
  margin: 25px;
  width: 60px;
  height: 60px;
  -o-object-fit: contain;
  object-fit: contain;
}
.mine .wrapper .content .wallet{
  margin-top: 80px;
  padding: 0 30px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 1.5px 1px 0 #e4e4e7;
}
.mine .wrapper .content .wallet .part-1{
  display: flex;
  align-items: center;
  height: 100px;
}
.mine .wrapper .content .wallet .font-primary-color{
  color: #000;
}
.font-gray {
  color: #868686;
}
.mine .wrapper .content .wallet .part-2{
  display: flex;
  align-items: center;
  height: 150px;
}
.mine .wrapper .content .wallet .part-2 .balance{
  flex: 1;
  font-size: 60px;
  color: #7e5678;
  font-weight: 700;
}
.mine .wrapper .content .wallet .van-hairline--bottom::after {
  border-bottom-width: 3px;
}
.mine .wrapper .content .wallet .part-2 .refresh-btn{
  margin-left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 30px;
  border-radius: 50%;
  color: #ffffff;
  background-color: #e6c3a1;
}
</style>
