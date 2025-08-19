<template>
  <div class="convention-hall page">
    <van-nav-bar class="nav-bar" title="直播大厅" />
    <div class="convention-item">
      <div style="padding: 0 30px;">
        <van-search shape="round" v-model="searchId" placeholder="请输入主播编号" @input="onSearch" />
      </div>
      <van-tabs v-model="active" swipeable animated>
        <van-tab title="推荐主播">
          <van-pull-refresh border="false" class="list-wrapper" v-model="isLoading" @refresh="onRefresh">
            <van-grid :column-num="2" :gutter="10" v-if="datalist.length">
				<van-grid-item @click="addgo(item.id)" v-for="(item, index) in datalist" :key="index">
				<van-image class="game_item_img" :src="item.img_url" radius="10">
				<template v-slot:loading>
					<van-loading type="circular" />
				</template>
				</van-image>
				<span class="rig-name"> {{ item.title }} </span>
			</van-grid-item>
			</van-grid>
			<van-empty description="暂无内容" v-else/>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="在线直播" style="height: 100vh;">
          <!-- <van-image src="https://www.yzcbo.com/img/3.10b51698.jpg" radius="0" width="100%" height="100%">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image> -->
          <div class="container">
			<video
				class="background-video"
				src="https://timibbs-videos.oss-cn-beijing.aliyuncs.com/video/2.mp4"
				autoplay
				loop
				muted
				playsinline
				webkit-playsinline
				x5-video-player-type="h5"
				x5-video-player-fullscreen="false"
				x5-video-orientation="portraint"
				style="width: 100%; height: 100%; object-fit: cover;">
			</video>
		</div>
          <div class="live-box" style="padding: 0 20px;">
            <van-field style="height: 40px;padding: 10px;" v-model="value" placeholder="请输入会员密钥" center />
            <van-button class="button" color="linear-gradient(#fde3ca,#e7b486)" @click="$toast('会员密钥错误')">确定</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <Float />
  </div>
</template>

<script>
import Float from '../../common/Float.vue';
import { Toast } from 'vant';
export default {
  components: { Float },
  data() {
    return {
      gameitem: [{}, {}, {}, {}],
      lotteryitem: [{}, {}, {}, {}],
      isLoading: false,
      active: 0,
      value: '',
      datalist: [],
      searchId: ''
    };
  },
  methods: {
    onSearch(val) {
      this.getxuanfeilist(val);
    },
    addgo(id) {
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/Login' });
      } else {
        this.$router.push({ path: `/profile?id=${id}` });
      }
    },
    getxuanfeilist() {
      this.$http({
        method: 'get',
        url: 'xuanfeilist',
        data: { id: this.$route.query.id || 1,uid:this.searchId }
      }).then(res => {
        // console.log(res.data)
        this.datalist = res.data;
      });
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
    toLottery(key, id) {
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/Login' })
      } else {
        this.$router.push({ path: '/Lottery?key=' + key + "&id=" + id })
      }
    },
    getGameItem() {
      this.$http({
        method: 'get',
        url: 'lottery_list'
      }).then(res => {
        this.gameitem = res.data;
      })
    },
    onChange(index) {
      this.$http({
        method: 'get',
        data: { class: index },
        url: 'lottery_list'
      }).then(res => {
        this.gameitem = res.data;
      })
    },
    getLotteryItem() {
      this.$http({
        method: 'get',
        url: 'lottery_class'
      }).then(res => {
        this.lotteryitem = res.data;
      })
    }
  },
  created() {
    // this.getGameItem();//获取首页游戏列表
    // this.getLotteryItem();
    this.getxuanfeilist();
  }
};
</script>

<style lang='less' scoped>
::v-deep .game_item_img {
    display: block;
    width: 100%;
    height: 60vw;
}	
/* 设置视频背景样式 */
  .background-video {
	/* position: fixed; */
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1; /* 确保视频在其他内容的后面 */
  }
  
  /* 设置页面内容样式 */
  .container {
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
  }

::v-deep .van-search__content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding-left: 1.6vw;
    background-color: #5d5d5d;
    /* border-radius: 0.267vw; */
}
.van-search {
  background-color: #4d4d4d00;
}
::v-deep .van-field__left-icon .van-icon,
.van-field__right-icon .van-icon {
  display: block;
  font-size: 6.133vw;
  line-height: initial;
  margin-left: 4px;
  color: #bababa;
}
::v-deep .van-field__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
	padding: -1px !important;
    color: #323233;
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
    font-size: 4.2vw;
    margin-top: 2px;
}
::v-deep .van-grid-item__content--surround::after {
  border-width: 0px !important;
}

.van-grid-item__content::after {
  z-index: 1;
  border-width: 0px !important;
}

* {
  margin: 0;
  padding: 0;
}

.box {
  width: 100%;
  height: calc(100vh - 40px);
  background-color: rgb(141, 130, 130);
  position: relative;
}

.video {
  height: calc(100vh - 40px);
  background-size: 100% 100%;
  width: 100%;
  position: absolute;
  /* filter: blur(3px); */
  top: 0;
  left: 0;
}

.rig-name {
  background: linear-gradient(#fde3ca, #e7b486);
  color: #525252;
  width: 94%;
  margin: 1vw;
  flex: 1;
  border-radius: 0.667vw;
  text-align: center;
  font-size: 3vw;
  padding: 1vw;
}

.van-cell {
  width: 80%;
  font-size: 40px;
  text-align: center;
}

.button {
  border-radius: 10px;
  width: 80%;
  margin-top: 10px;
}

::v-deep .van-tab__pane {
  position: relative;
  height: 100%;
}

.live-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

::v-deep .van-tabs {
  height: 100%;
}

::v-deep .timibbs_zaixianzhibo {
  height: 100%;
}

::v-deep .van-tabs__wrap {
  height: auto;
}

::v-deep .van-tabs__line {
  bottom: 2vw;
  width: 7.333vw;
  height: 0.933vw;
  border-radius: 0;
  background-color: #ddb285;
}

::v-deep .van-tabs__nav {
  background-color: transparent;
}

::v-deep .van-tab {
  color: #ddb285;
  font-size: 4vw;
  line-height: inherit;
  padding: 30px 0;
}

::v-deep .van-tab--active {
  color: #ddb285;
  font-weight: 500;
}

.page {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
}

.nav-bar {
  background: linear-gradient(90deg, #7e5678, #e6c3a1);
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

.van-sidebar-item {
  font-size: 35px;
  text-align: center;
  padding: 50px;
  background-color: #ffffff;
}

.van-sidebar-item--select,
.van-sidebar-item--select:active {
  background-color: #f2f2f5;
}

.convention-item {
  /* background: linear-gradient(120deg, #212121, #313131); */
  // padding-bottom: 180px;
  height: 100%;
}

.convention-hall {
  display: flex;
  flex-direction: column;
  bottom: 0;
  background: linear-gradient(120deg, #212121, #313131);
}

.convention-item .left {
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.convention-item .right {
  height: 100%;
  flex: 1;
  background-color: #f2f2f5;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.convention-item .right .list-wrapper {
  padding: 20px 20px;
  min-height: 800px;
}

.convention-item .right .list-wrapper .game_item_img {
  /* width: 200px;
  height: 200px; */
}

.convention-item .right .list-wrapper span {
  margin-top: 10px;
  font-size: 30px;
  color: #000;
}

.convention-item .right .list-wrapper span:last-child {
  margin-top: 10px;
  font-size: 24px;
  color: #000;
}

.van-grid-item {
  padding: 10px;
  
}

::v-deep .van-grid-item__content--center {
  border-radius: 15px;
  padding: 0;
}


::v-deep .van-pull-refresh__track .van-pull-refresh__head * {
  color: #000000;
  font-size: 35px;
  bottom: 90px;
  position: relative;
}

::v-deep .van-grid-item__content {
  background-color: black !important;
}
</style>
