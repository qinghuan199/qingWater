<template>
  <div class="container page">
    <van-nav-bar title="修改真实姓名" class="nav-bar">
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="back()"/>
      </template>
      <template #right>
        <span class="nav-right" @click="save()">保存</span>
      </template>
    </van-nav-bar>
    <van-cell-group>
      <van-field v-model="name" :readonly="userInfo.name !== ''" label="姓名" placeholder="请输入真实姓名" />
    </van-cell-group>
    <p>为了您账户安全,真实姓名需要与绑定银行卡姓名一致</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name:"",
      userInfo:{}
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    save(){
      if(this.userInfo.name){
        this.$toast("请勿重复设置！");
        return true;
      }
      if(this.name === "" || this.name === null || this.name === undefined){
        this.$toast.fail("请输入姓名！");
        return false;
      }
      this.$http({
        method: 'get',
        data:{name:this.name},
        url: 'user_set_name'
      }).then(res=>{
        if(res.code === 200){
          this.getUserInfo();
          this.name = this.userInfo.name;
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
          this.name = res.data.name;
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
.van-cell {
  font-size: 35px;
  line-height: 80px;
}
.container p{
  padding: 0 15px;
  margin-top: 15px;
  font-size: 30px;
  color: #dc2037;
}
</style>
