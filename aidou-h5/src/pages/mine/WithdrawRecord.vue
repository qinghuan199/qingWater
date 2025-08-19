<template>
  <div class="container page">
    <div class="header">
      <van-nav-bar title="提现记录" class="nav-bar">
        <template #left>
          <van-icon name="arrow-left" color="#fff" @click="back()"/>
        </template>
      </van-nav-bar>
    </div>
    <div class="main">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-empty v-if="list.length === 0" description="数据为空！" />
          <div v-else class="item_list" v-for="(v,key) in list" :key="key">
            <div class="topInfo">
              <span v-if="v.status === 2" style="color: #07c160">{{v.status_text}}</span>
              <span v-else >{{v.status_text}}</span>
              <span>金额：-{{v.money}}</span>
            </div>
            <div class="desc">
              <span>说明：{{v.desc}}</span>
            </div>
            <div class="time">
              <span>提交时间：{{v.create_time}}</span>
            </div>
            <div class="time">
              <span>审核时间：{{v.update_time}}</span>
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
      isLoading: false,
      list:[]
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
    getUserWithdrawList(){
      this.$http({
        method: 'get',
        url: 'user_get_withdraw_list'
      }).then(res=>{
        if(res.code === 200){
          this.list = res.data;
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
      this.getUserWithdrawList();
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";
::v-deep .van-pull-refresh__track .van-pull-refresh__head *{
  color: #000000;
  font-size: 35px;
}

::v-deep .van-loading__text {
  color: #000000;
  font-size: 35px;
}
.container .main{
  position: relative;
  overflow: auto;
  background-color: #f2f2f5;
  height: 100%;
  padding: 0 10px;
}

.item_list{
  padding: 15px 15px;
  margin: 30px 10px;
  background: #fff;
  border-radius: 10px;
  line-height: 60px;
}

.item_list .topInfo span{
  flex: 1;
  font-size: 35px;
  font-weight: 700;
  color: #ff253f;
}
.item_list .time span{
  flex: 1;
  font-size: 25px;
  font-weight: 500;
  color: #000;
}

.item_list .topInfo span:last-child{
  float: right;
}
.item_list .desc span{
  font-size: 25px;
  font-weight: 700;
  color: #9b9b9b;
}

</style>
