<template>
  <div class="container page">
    <van-nav-bar title="性别修改" class="nav-bar">
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="back()"/>
      </template>
    </van-nav-bar>
    <div class="sex">
        <van-radio-group v-model="radio">
          <div class="item van-hairline--bottom" @click="chooesSex(1)">
              <van-radio name="1">男</van-radio>
          </div>
          <div class="item van-hairline--bottom" @click="chooesSex(2)">
            <van-radio name="2">女</van-radio>
          </div>
        </van-radio-group>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      radio:"",
      userInfo:{}
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    chooesSex(sex){
      this.$http({
        method: 'post',
        data:{sex:sex},
        url: 'user_set_sex'
      }).then(res=>{
        if(res.code === 200){
          this.getUserInfo();
          this.radio = sex;
          this.$toast(res.msg);
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
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
.container .sex{
  background-color: #fff;
  padding: 0 40px;
}
.container .sex .item{
  font-size: 35px;
  line-height: 50px;
  padding: 30px 0;
}
::v-deep .van-radio__label {
  line-height: 50px;
  margin-left: 30px;
}
::v-deep .van-radio__icon {
  font-size: 30px;
}
::v-deep .van-radio__icon--checked .van-icon {
  color: #fff;
  border-color: rgb(126, 86, 120);
  background-color: rgb(126, 86, 120);
}
.container .van-hairline--bottom::after {
  border-bottom-width: 3px;
}
</style>
