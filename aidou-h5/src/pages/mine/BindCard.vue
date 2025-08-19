<template>
  <div class="container page">
    <van-nav-bar title="填写收款卡" class="nav-bar">
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="back()"/>
      </template>
    </van-nav-bar>
    <div class="main-box">
      <div class="label">请输入您的收款卡信息</div>
      <van-cell-group>
        <van-field v-model="bankid" label="银行卡号" type="digit" placeholder="请输入真实银行卡号" />
        <van-field v-model="bank" label="银行名称" readonly placeholder="请选择银行" @click="showSelectBanks()"/>
      </van-cell-group>
      <p>尊敬的用户,为了保障您的资金安全,请您绑定您的真实姓名和设置取款密码,如果姓名与开户名不一致,将无法取款</p>
    </div>
    <van-button class="bindCard" type="default" @click="bindCard()">确认绑卡</van-button>
    <van-popup v-model="showBank" round position="bottom" :style="{ height: '35%' }" >
      <van-picker
          show-toolbar
          :columns="banks"
          @confirm="onConfirm"
          @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banks: [],
      showBank:false,
      userInfo:{},
      bankid:"",
      bank:""
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    bindCard(){
      if(this.userInfo.bankid){
        this.$toast("请输入银行卡号！");
        return true;
      }
      if(this.bank === "" || this.bank === null || this.bank === undefined){
        this.$toast.fail("请选择银行！");
        return false;
      }
      this.$http({
        method: 'post',
        data:{bankid:this.bankid,bank:this.bank},
        url: 'user_set_bank'
      }).then(res=>{
        if(res.code === 200){
          this.$router.push({path:'/Mine'})
          this.$toast(res.msg);
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
    },
    showSelectBanks(){
      this.showBank = true;
    },
    getUserInfo(){
      this.$http({
        method: 'get',
        url: 'user_info'
      }).then(res=>{
        if(res.code === 200){
          this.userInfo = res.data;
          this.name = res.data.name;
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
    },
    getBankList(){
      this.$http({
        method: 'get',
        url: 'sys_get_banks'
      }).then(res=>{
        if(res.code === 200){
          this.banks = res.data;
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
    },
    onConfirm(value) {
      this.bank = value.text
      this.showBank = false;
    },
    onCancel() {
      this.showBank = false;
    },
    getUserBankInfo(){
      this.$http({
        method: 'get',
        url: 'user_get_bank'
      }).then(res=>{
        if(res.code === 200){
          if(res.data.is_bank){
            this.is_bind = true;
          }else {
            this.is_bind = false;
          }
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
      this.getUserInfo();
      this.getBankList();
      this.getUserBankInfo();
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";
.van-cell {
  font-size: 32px;
  line-height: 80px;
}
.van-hairline--bottom::after {
  border-bottom-width: 3px;
}
.bankbox{
  padding: 15px;
  color: #000;
  background-color: #fff;
}
.bankbox .title{
  padding: 8px 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 28px;
}
.main-box{
  background: #fff;

}
.main-box .label{
  padding: 20px;
  font-size: 35px;
  color: #797878;
}
::v-deep .van-picker__toolbar {
  height: 50px;
}
::v-deep .van-picker__cancel, .van-picker__confirm {
  padding: 0 20px;
  font-size: 20px;
}
::v-deep .van-picker-column {
  font-size: 40px;
}
.main-box p{
  padding: 0 20px;
  font-size: 30px;
  color: #ee0a24;
}
.bindCard {
  margin: 20px 30px 0;
  height: 80px;
  line-height: 1.22667rem;
  border-radius: 50px;
  color: #fff;
  font-size: 30px;
  font-weight: bolder;
  border: none;
  background: linear-gradient(
      90deg,#e6c3a1,#7e5678);
}
</style>
