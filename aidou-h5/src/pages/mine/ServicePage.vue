<template>
  <div class="container page">
    <div class="header">
      <van-nav-bar title="在线客服" class="nav-bar">
        <template #left>
          <van-icon name="arrow-left" color="#fff" @click="back()"/>
        </template>
      </van-nav-bar>
    </div>
    <div class="ifrmae_page">
      <iframe width="100%" height="100%"  frameborder="0"  id="iframe_web"   :src="this.$store.getters.getBaseInfo.kefu !==undefined ?this.$store.getters.getBaseInfo.kefu:'https://hao.360.com/'"  ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    back(){
      return window.history.back();
    }
  },
  created() {

  },
  mounted(){
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('iframe_web');
    const deviceHeight = document.documentElement.clientHeight;
    oIframe.style.height = (Number(deviceHeight)-65) + 'px'; //数字是页面布局高度差
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";
</style>
