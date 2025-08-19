<template>
  <div class="container page">
    <div class="header">
      <van-nav-bar title="个人报表" class="nav-bar">
        <template #left>
          <van-icon name="arrow-left" color="#fff" @click="back()"/>
        </template>
      </van-nav-bar>
      <div class="info">
        <p class="title">盈利金额(元)</p>
        <p class="value">{{ this.win_money.toFixed(2) }}</p>
        <p class="tip">盈利计算公式 : 中奖金额 - 任务金额</p>
      </div>
      <div class="content">
        <div class="datalist">
          <div class="datalistitem">
            <div class="datalistitemValue">{{ this.personalreport.play_money }}</div>
            <div class="datalistitemKey">任务金额</div>
            <div class="datalistitemRightLine"></div>
          </div>
          <div class="datalistitem">
            <div class="datalistitemValue">{{ this.personalreport.recharge}}</div>
            <div class="datalistitemKey">充值金额</div>
            <div class="datalistitemRightLine"></div>
          </div>
          <div class="datalistitem">
            <div class="datalistitemValue">{{ this.personalreport.withdrawal }}</div>
            <div class="datalistitemKey">提现金额</div>
            <div class="datalistitemRightLine"></div>
          </div>
          <div class="datalistitem">
            <div class="datalistitemValue">{{ this.personalreport.win_money }}</div>
            <div class="datalistitemKey">中奖金额</div>
            <div class="datalistitemRightLine"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      win_money:0,
      personalreport:{}
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    getPersonalreport(){
      this.$http({
        method: 'get',
        url: 'user_get_personalreport'
      }).then(res=>{
        if(res.code === 200){
          this.personalreport = res.data;
          this.win_money = this.personalreport.win_money - this.personalreport.play_money;
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
    }
  },
  created() {
    if(!localStorage.getItem('token')){
      this.$router.push({path:'/Login'})
    }else {
      this.getPersonalreport();
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";
.container .header{
  background-color: #282828;
}
.container .header .info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  padding-top: 10px;
  margin: auto;
}
.container .header .info .title{
  font-size: 25px;
  color: #e5e5e5;
}
.container .header .info .value{
  margin: 10px auto;
  color: #fff;
  font-size: 50px;
  border-bottom: 1px solid #fff;
}
.container .header .info .tip{
  font-size: 30px;
  color: #e5e5e5;
}
.container .content{
  flex: 1;
  background-color: #282828;
}
.container .content .datalist{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}
.container .content .datalist .datalistitem{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 33.3%;
}
.container .content .datalist .datalistitem .datalistitemValue{
  color: #ff253f;
  font-size: 35px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.container .content .datalist .datalistitem .datalistitemKey{
  color: #979799;
  font-size: 25px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
