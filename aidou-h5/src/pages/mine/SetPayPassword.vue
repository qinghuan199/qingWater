<template>
  <div class="container page">
    <van-nav-bar title="设置资金密码" class="nav-bar">
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="back()"/>
      </template>
    </van-nav-bar>
    <div class="wrapper">
        <div class="item">
            <p class="title">请输入资金密码</p>
            <van-password-input
                :value="opw"
                :length="4"
                :gutter="10"
                :focused="oshowKeyboard"
                @focus="oshowKeyboard = true;tshowKeyboard = false;"
            />
            <van-number-keyboard
                v-model="opw"
                :show="oshowKeyboard"
                @input ="opw.length !== 3 ? oshowKeyboard = true  : tshowKeyboard=true;"
                @blur="oshowKeyboard = false"
            />
        </div>
        <div class="item">
        <p class="title">请再次输入资金密码</p>
        <van-password-input
            :value="tpw"
            :length="4"
            :gutter="10"
            :focused="tshowKeyboard"
            @focus="tshowKeyboard = true;oshowKeyboard=false;"
        />
        <van-number-keyboard
            v-model="tpw"
            :show="tshowKeyboard"
            @input ="tpw.length !== 3 ? tshowKeyboard = true  : tshowKeyboard = false;oshowKeyboard=false"
            @blur="tshowKeyboard = false"
        />
      </div>
        <van-button class="sub-btn" type="default" @click="setPayPassword()">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opw: '',
      tpw: '',
      oshowKeyboard: true,
      tshowKeyboard: false,
      userInfo:{}
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    setPayPassword() {
      this.oshowKeyboard = false;
      this.tshowKeyboard = false;
      if(this.opw.length !== 4){
        this.oshowKeyboard = true;
        this.$toast("请填写完整");
        return false;
      }
      if(this.tpw.length !== 4){
        this.tshowKeyboard = true;
        this.$toast("请填写完整");
        return false;
      }
      if(this.opw !== this.tpw){
        this.$toast("两次密码不一致！");
        return false;
      }else {
        this.$http({
          method: 'post',
          data:{paypassword:this.opw},
          url: 'user_set_paypw'
        }).then(res=>{
          if(res.code === 200){
            setTimeout(() => {
              this.$toast(res.msg);
            }, 500);
              this.$router.push("Mine")
          }else if(res.code ===401){
            this.$toast(res.msg);
          }
        })
      }
    },
    getUserInfo(){
      this.$http({
        method: 'get',
        url: 'user_info'
      }).then(res=>{
        if(res.code === 200){
          this.userInfo = res.data;
          this.radio = res.data.sex;
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
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";
.container .wrapper{
  height: 100%;
  //overflow-y: auto;
  background-color: #fff;
  //-webkit-overflow-scrolling: touch;
}
.container .wrapper .item .title{
  margin: 40px 0;
  line-height: 20px;
  font-size: 30px;
  font-weight: 500;
  color: #000;
  text-align: center;
}
::v-deep .van-password-input{
  width: 80%;
  height: 150px;
  margin: 0 auto;

}
::v-deep .van-password-input__security li {
  font-size: 30px;
  line-height: 30;
  background-color: #ebedf0;
}
::v-deep .van-password-input__security {
  height: 130px;
}
::v-deep .van-password-input .van-password-input__security .van-password-input__item {
  height: 100%;
  border: 0;
  text-align: center;
  border-radius: 30px;
}
.van-password-input__security i {
  width: 25px;
  height: 25px;
}
::v-deep .van-key {
  height: 100px;
  font-size: 55px;
  line-height: 20px;
  border-radius: 20px;
}
::v-deep .van-number-keyboard {
  z-index:100;
  width: 100%;
  padding-bottom: 30px;
  background-color: #f2f3f5;
}
::v-deep .van-key__collapse-icon {
   width: 50px;
   height: 50px;
 }
::v-deep .van-key__delete-icon {
  width: 50px;
  height: 50px;
}
.container .wrapper .sub-btn{
  margin: 110px 0 0 10%;
  height: 100px;
  width: 80%;
  font-size: 35px;
  border-radius: 50px;
  color: #fff;
  background: linear-gradient(
      270deg,#e6c3a1,#7e5678);
}
</style>
