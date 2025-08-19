<template>
  <div id="app">
      <router-view></router-view>
      <Footer/>
  </div>
</template>

<script>
import Footer from './common/Footer'
export default {
  name: 'app',
  components: {
    Footer
  },
  data() {
    return {
      status:0
    };
  },
  methods: {
    getBaseInfo(){
      this.$http({
        method: 'get',
        url: 'base_info'
      }).then(res=>{
        if(!localStorage.getItem('token')){
          this.$router.push({path:'/Login'})
        }
        this.$store.commit('setBaseInfoValue', res.data);
      })
    }

  },
  created(){
    this.getBaseInfo();
  }
}
</script>

<style lang="less">
@theme-color: #282828;

body .van-toast {
  font-size: 38px;
  padding: 30px;
  line-height: 50px;
  width: 230px;
}
body .van-toast .van-toast__icon {
  font-size: 50px;
}
*, :after, :before {
  box-sizing: border-box;
}
.nav-bar{
  background: @theme-color !important;
}
.van-tabbar{
  background-color: @theme-color !important;
}
.van-tabbar-item--active{
  background-color: @theme-color !important;
}
.van-nav-bar__title{
  color: #be9f80 !important;
}
.page{
  background-color: @theme-color !important;
  background: @theme-color !important;
}
</style>
