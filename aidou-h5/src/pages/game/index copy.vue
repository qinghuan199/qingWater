<template>
<div class="convention-hall page">
  <van-nav-bar
      class="nav-bar"
      title="预约大厅"
  />
  <div class="convention-item">
    <div class="left">
      <van-sidebar @change="onChange" v-model="activeKey">
        <van-sidebar-item title="全部" />
        <van-sidebar-item v-for="(v,key) in lotteryitem" :key="key" :title="v.name" />
      </van-sidebar>
    </div>
    <div class="right">
      <van-pull-refresh :border="false" class="list-wrapper" v-model="isLoading" @refresh="onRefresh">
        <van-grid :column-num="2">
          <van-grid-item @click="toLottery(v.key,v.id)" v-for="(v,key) in gameitem" :key="key">
            <van-image class="game_item_img" :src="v.ico">
              <template v-slot:loading>
                <van-loading type="circular"/>
              </template>
            </van-image>
            <span>{{v.name}}</span>
            <span>{{v.desc}}</span>
          </van-grid-item>
        </van-grid>
      </van-pull-refresh>
    </div>
  </div>
</div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      gameitem: [{},{},{},{}],
      lotteryitem: [{},{},{},{}],
      isLoading: false,
      activeKey: 0,
    };
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
    toLottery(key,id){
      if(!localStorage.getItem('token')){
        this.$router.push({path:'/Login'})
      }else {
        this.$router.push({path:'/Lottery?key='+key+"&id="+id})
      }
    },
    getGameItem(){
      this.$http({
        method: 'get',
        url: 'lottery_list'
      }).then(res=>{
        this.gameitem = res.data;
      })
    },
    onChange(index) {
      this.$http({
        method: 'get',
        data:{class:index},
        url: 'lottery_list'
      }).then(res=>{
        this.gameitem = res.data;
      })
    },
    getLotteryItem(){
      this.$http({
        method: 'get',
        url: 'lottery_class'
      }).then(res=>{
        this.lotteryitem = res.data;
      })
    }
  },
  created() {
    this.getGameItem();//获取首页游戏列表
    this.getLotteryItem();
  }
};
</script>

<style lang='less' scoped>
.page{
  position: absolute!important;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f2f2f5;
}
.nav-bar{
  background: linear-gradient(
      90deg,#7e5678,#e6c3a1);
  height: 100px;

}
.van-nav-bar {
  line-height: 50px;
}

::v-deep .van-nav-bar__title {
  max-width: 60%;
  margin: 0 auto;
  color: #ffffff;
  font-size: 35px;
}
::v-deep .van-nav-bar__content {
  height: 100px;
}
.van-sidebar {
  width: 180px;
}
.van-sidebar-item--select::before {
  left: 10px;
  height: 44%;
  background-color: #7e5678;
  border-radius: 5px;
  width: 10px;
}

.van-sidebar-item--select {
  color: #7e5678;
  font-size: 35px;
  text-align: center;
}
.van-sidebar-item{
  font-size: 35px;
  text-align: center;
  padding: 50px;
  background-color: #ffffff;
}
.van-sidebar-item--select, .van-sidebar-item--select:active {
  background-color: #f2f2f5;;
}
.convention-item{
  display: flex;
  align-items: center;
  height: calc(100% - 15px);
}
.convention-hall{
  display: flex;
  flex-direction: column;
  bottom: 20px;
  background: #f2f2f5;
}
.convention-item .left{
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.convention-item .right{
  height: 100%;
  flex: 1;
  background-color: #f2f2f5;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.convention-item .right .list-wrapper{
  padding: 20px 20px;
  min-height: 800px;
}
.convention-item .right .list-wrapper .game_item_img{
  width: 200px;
  height: 200px;
}
.convention-item .right .list-wrapper span{
  margin-top: 10px;
  font-size: 30px;
  color: #000;
}
.convention-item .right .list-wrapper span:last-child{
  margin-top: 10px;
  font-size: 24px;
  color: #000;
}
.van-grid-item {
  padding: 10px;

}
::v-deep .van-grid-item__content--center {
  border-radius: 15px;
}
::v-deep .van-image__img{
  border-radius: 40px;
}
::v-deep .van-pull-refresh__track .van-pull-refresh__head *{
  color: #000000;
  font-size: 35px;
}

</style>
