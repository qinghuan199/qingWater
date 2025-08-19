<template>
  <div class="home-container">
    <van-nav-bar class="nav-bar">
      <!-- <template #left>
        <span style="font-size: 4.667vw;color: #be9f80;">全国</span>
      </template> -->
      <template #title>
        <div style="display: flex;align-items: center;">
          <span style="color: #f3c7a2;font-size: 4.667vw">{{ tip.title }}</span>
        </div>
      </template>
      <!-- <template #right>
        <van-icon class="van-icon van-icon-location-o" color="#be9f80"></van-icon>
        <span style="font-size: 4.667vw;color: #be9f80;">切换地区</span>
      </template> -->
    </van-nav-bar>
    <!-- <div class="linear-bg"></div> -->
    <div class="home-scroll">
      <div class="banner">
        <swiper class="banner_swiper" :options="bannerSwiperOption">
          <swiper-slide v-for="item in banners" :key="item.id">
            <van-image class="banner_img" :round="true" :src="item.url">
              <template v-slot:loading>
                <van-loading type="circular" />
              </template>
            </van-image>
          </swiper-slide>
        </swiper>
      </div>
      <div class="sm">
        <div>
          <div class="left">
            <p>{{ tip.title }}</p>
            <span>{{ tip.subtitle }}</span>
          </div>
          <div class="right">
            <p>
              {{ tip.illustrate }}
            </p>
          </div>
        </div>
        <span>{{ tip.initiate }}</span>
      </div>



      <div class="nav">
        <p class="nav-item" :class="{ 'active': active == 0 }" @click="active = 0">{{ tip.title }}</p>
        <p class="nav-item" :class="{ 'active': active == 1 }" @click="active = 1">服务条款</p>
        <p class="nav-item" :class="{ 'active': active == 2 || hasSelectedAddress }"  @click="$router.push('/Address')" >{{ selectedAddressName }}</p>
      </div>
      <van-pull-refresh border="false" class="list-wrapper" v-model="isLoading" @refresh="onRefresh" v-if="active == 0">
        <van-grid :column-num="2" :gutter="10">
          <van-grid-item @click="addgo(item.id)" v-for="(item, index) in datalist" :key="index">
            <van-image class="game_item_img" :src="item.img_url" radius="10">
              <template v-slot:loading>
                <van-loading type="circular" />
              </template>
            </van-image>
            <span class="rig-name"> {{ item.title }} </span>
          </van-grid-item>
        </van-grid>
        <div style="text-align: center;">
          <van-button round @click="gotoMenu('/Choose')" class="button" color="#be9f80">查看更多</van-button>
        </div>
        <!-- <div class="hot-recommend-more" @click="gotoMenu('/Choose')">查看更多</div> -->
      </van-pull-refresh>
      <div v-else>
        <div class="item tiaokuan">
          <ul>
            <li>
              <div>
                <p>平台资源</p> <span>网红丶模特丶空姐丶嫩模丶大学生，只有您想不到，没有本平台办不到</span>
              </div>
              <div>
                <p>服务范围</p> <span>同城约炮，任意地点空降，国内一二线城市当地均有，三线城市也可以通过上级预约安排。</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      notice: "获取中......",
      banners: [{}],
      basicData: [],
      gameitem: [{}, {}, {}, {}],
      movielist_0: [{}, {}, {}, {}],
      movielist_1: [{}, {}, {}, {}, {}, {}, {}, {}],
      isLoading: false,
      selectedAddressName: '地区选择',
      hasSelectedAddress: false,
      movielistSwiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        slidesPerGroup: 1,
      },
      bannerSwiperOption: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        speed: 800,
        autoplay: true,
        coverflowEffect: {
          rotate: 50,
          stretch: 10,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }
      },
      datalist: [],
      tip: {
        'title': '爱豆世纪传媒传媒',
        'subtitle': '华人第一福利品牌',
        'illustrate': '为了会员权益，网站只展示1%资源并且不定期更新只为展示实力，如需查询预约更多资源请联系上级接待.',
        'initiate': '本平台所有资源真实丶安全点丶可靠，全国空降丶同城约炮选取你心仪的她，与您零距离邂逅，快加入我们吧'
      }
    };
  },
  methods: {
    addgo(id) {
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/Login' });
      } else {
        this.$router.push({ path: `/profile?id=${id}` });
      }
    },
    gotoMenu(router) {
      this.$router.replace(router)
    },
    toLottery(key, id) {
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/Login' })
      } else {
        this.$router.push({ path: '/Lottery?key=' + key + "&id=" + id })
      }

    },
    toPlayVideo(id) {
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/Login' })
      } else {
        this.$router.push({ path: '/PlayVideo?id=' + id })
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.getBasicConfig();
        this.isLoading = false;
        this.$toast("刷新成功");
      }, 500);
    },
    getBasicConfig() {
      this.$http({
        method: 'get',
        url: 'sys_config'
      }).then(res => {
        this.basicData = res.data;
        this.getNotice(this.basicData);//获取公告
        this.getBanner(this.basicData);//获取banner
        this.getGameItem();//获取首页游戏列表
        this.getMovieList_0(this.basicData);//获取首页视频0
        this.getMovieList_1(this.basicData);//获取首页视频1

        this.getxuanfeilist();
      })

    },
    getxuanfeilist() {
      this.$http({
        method: 'get',
        url: 'xuanfeilist',
        data: { id: this.$route.query.addressId || 1 }
      }).then(res => {
        this.datalist = res.data;
      });
    },
    getNotice(data) {
      this.notice = data.notice;
    },
    getGameItem() {
      this.$http({
        method: 'get',
        url: 'lottery_hot'
      }).then(res => {
        this.gameitem = res.data
      })
    },
    getMovieList_0(data) {
      this.movielist_0 = data.movielist_0
    },
    getMovieList_1(data) {
      this.movielist_1 = data.movielist_1
    },
    getBanner(data) {
      this.banners = data.banners;
    },
    gettip() {
      this.$http({
        method: 'get',
        url: 'sys_tip',
      }).then(res => {
        this.tip = res.data;
      });
    },
  },
  mounted() {

  },
  created() {
    // 检查路由参数中是否有地区名称
    if (this.$route.query.addressName) {
      this.selectedAddressName = this.$route.query.addressName;
      this.hasSelectedAddress = true;
    }
    this.getBasicConfig();
    this.gettip();
    this.getxuanfeilist();
  }
}

</script>

<style lang='less' scoped>
@notice-bar-size: 30px;
@movie-list-item-bottom-size: 25px;
::v-deep .game_item_img {
    display: block;
    width: 100%;
    height: 60vw;
}
::v-deep .van-grid-item__content--surround::after {
    border-width: 0px !important;
}
.van-grid-item__content::after {
    z-index: 1;
    border-width: 0px !important;
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

.tiaokuan {
  padding: 15px;
}

.item.tiaokuan ul li {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.item ul li {
  float: left;
  width: 100%;
  margin-top: 1.333vw;
  min-height: 1.867vw;
  background: linear-gradient(120deg, #212121, #313131);
  position: relative;
  overflow: hidden;
  margin-bottom: 1.333vw;
  border-radius: 1.333vw;
  border: 1px solid #7e6a56;
  padding: 1.333vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item ul li:after {
  width: 13.333vw;
  left: 40%;
}

.item ul li:after,
.item ul li:before {
  content: "";
  position: absolute;
  top: -100%;
  height: 400%;
  background: linear-gradient(90deg, rgba(74, 70, 70, .1), transparent);
  transform: rotate(50deg);
}

.item ul li:before {
  width: 8vw;
  left: 1%;
}

.item.tiaokuan ul li p {
  color: #e1be9c;
  background-image: -webkit-linear-gradient(top, #f8dbae, #edbd71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3.733vw;
  font-weight: 600;
  text-align: left;
  padding: 1.333vw 0;
}

.item.tiaokuan ul li span {
  font-size: 3vw;
  color: #fff;
}

.nav {
  display: flex;
  padding: 15px;

  .nav-item {
    font-size: 3.5vw;
    padding: 1.333vw 2vw;
    border-radius: 6.667vw;
    margin-right: 1.867vw;
    background: linear-gradient(90deg, #5b606c, #2b2b2b);
    color: #fff;
    margin-bottom: 1.333vw;

    &.active {
      background: linear-gradient(#fde3ca, #e7b486);
      color: #c96708;
    }
  }
}


.nav-bar {
  background: linear-gradient(120deg, #212121, #313131);
}

::v-deep .van-grid-item__content {
  background: linear-gradient(120deg, #212121, #313131);
  padding: 0;
}

.sm {
  min-height: 1rem;
  border-radius: 1.333vw;
  border: 1px solid #766350;
  margin: 1.333vw 0;
  background: linear-gradient(120deg, #212121, #313131);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.333vw;
  position: relative;
  overflow: hidden;
  margin: 15px;

  &:after,
  &:before {
    content: "";
    position: absolute;
    width: 137.4vw;
    height: 19.2vw;
    background: linear-gradient(0deg, rgba(74, 70, 70, .29), transparent);
    transform: rotate(139deg);
  }

  &:after {
    left: -35%;
    z-index: 0;
  }

  &:before {
    left: -4%;
  }

  &>div {
    position: relative;
    z-index: 99;
    display: flex;

    .left {
      width: 32%;
      position: relative;
      z-index: 99;

      &::after {
        content: "";
        position: absolute;
        width: 0.02rem;
        height: 100%;
        background: #f6d5a1;
        right: 0;
        top: 0;
      }

      p,
      span {
        color: #ddb285;
        font-size: 3vw;
        padding-top: 1.333vw;
        text-align: center;
      }

      p {
        font-weight: 1000;
        background-image: -webkit-linear-gradient(top, #f8dbae, #edbd71);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 4.267vw;
        text-align: center;
        margin-top: 3vw;
      }

      span {
        line-height: 3.2vw;
      }
    }

    .right {
      flex: 1;
      padding-left: 1.333vw;

      p {
        color: #dadada;
        font-size: 3vw;
        line-height: 6.4vw;
      }
    }
  }

  &>span {
    color: #ddb285;
    font-size: 3vw;
    padding-top: 1.333vw;
    text-align: center;
    line-height: 5.067vw;
  }
}

.linear-bg {
  height: 200px;
  background: linear-gradient(270deg, #e6c3a1, #7e5678);
}

.home-container {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(120deg, #212121, #313131);
  height: 100%;
}

.linear-gradient {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, rgba(126, 86, 120, 0), rgb(230, 195, 161), rgba(126, 86, 120, 0));
}

::v-deep .van-notice-bar__left-icon,
.van-notice-bar__right-icon {
  min-width: 40px;
}

.notice-swipe {
  width: calc(100% - 50px);
  height: 85px;
  font-size: @notice-bar-size;
}

::v-deep .van-icon-bullhorn-o::before {
  transform: scale(2.5);
}

.banner {
  width: 100%;
}

.banner_swiper {
  height: 100%;
  width: 100%;

  .swiper-slide {
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 620px;
    height: 300px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    background-color: #ffffff;
    background-position: center;
    background-size: cover;
    color: #ffffff;
  }
}

::v-deep .swiper-container-3d .swiper-slide-shadow-left {
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
}

::v-deep .swiper-container-3d .swiper-slide-shadow-right {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
}

.banner_img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.hot-game {
  width: 100%;
  height: 100%;
}

.hot-title-div {
  width: calc(100% - 50px);
  margin: 0 auto;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hot-title-div>div:first-child {
  width: 130px;
}

.hot-title-div div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hot-title-div>div:nth-child(2) span {
  font-size: 20px;
  color: #979799;
}

.hot-title-div>div:first-child span {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hot-title-div>div:first-child span {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 10px;
  font-weight: 700;
  color: #000;
}

.hot-title-div>div:first-child span {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 28px;
  font-weight: 700;
  color: #000;
}

.hot-title-div>div:nth-child(2) span {
  font-size: 25px;
  color: #979799;
}

.hot-title-div>div:first-child span:before {
  content: "";
  display: block;
  width: 5px;
  height: 30px;
  background-color: #7e5678;
  border-radius: 1px;
  margin-right: 5px;
}

.hot-game .hot-items-div {
  margin-top: -3px;
}

.hot-game .hot-items-div span {
  margin-top: 10px;
  font-size: 28px;
  color: #000;
}

.hot-recommend {
  width: 100%;
  flex: 1;
  background-color: #f2f2f5;
}

.movie_swiper {
  .swiper-slide {
    width: 80%;
  }
}

.movie_list_0 {
  width: calc(100% - 50px);
  margin: 0 auto;
}

.movie_cover {
  border-radius: 10px;
  width: 550px;
  height: 330px
}

.movie_list_0 .movie-list-item-bottom {
  position: relative;
  width: 550px;
  bottom: 43px;
}

.movie_list_0 .movie-list-item-bottom .movie-time-div {
  background-color: rgba(0, 0, 0, .4);
}

.movie_list_0 .movie-list-item-bottom>div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.movie_list_0 .movie-list-item-bottom .movie-time-div .van-count-down {
  font-size: 28px;
  color: #fff;
}

.movie_list_0 .movie-time-div {
  color: #fff;
  border-radius: 0 0 10px 10px;
}

.movie_list_0 .movie_swiper .hot {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 80px;
}

.movie_list_0 span {
  font-size: 30px;
}

.movie_list_1 {
  display: flex;
  width: calc(100% - 50px);
  margin: 0 auto;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.movie_list_1 .movie-list-item .cover_img {
  border-radius: 10px;
  width: 335px;
  height: 290px;
}

.home-scroll {
  padding-bottom: 150px;
  height: 100%;
}

.movie_list_1 .movie-list-item {
  margin-bottom: -10px;
}

.movie_list_1 .movie-list-item-bottom {
  position: relative;
  width: 335px;
  bottom: 42px;

}

.movie_list_1 .movie-list-item:nth-child(odd) {
  margin-right: 25px;
}

.movie_list_1 .movie-list-item-bottom .movie-time-div {
  background-color: rgba(0, 0, 0, .4);
}

.movie_list_1 .movie-list-item-bottom>div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.movie_list_1 .movie-list-item-bottom .movie-time-div .van-count-down {
  color: #fff;
}

.movie_list_1 .movie-time-div {
  color: #fff;
  border-radius: 0 0 10px 10px;
  height: 35px;
}

.movie_list_1 .movie_swiper .hot {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 5px;
}

.movie_list_1 .movie-list-item .movie-time-div span:first-child {
  overflow: hidden;
  white-space: nowrap;
  width: 180px;
  padding-left: 8px;
  font-size: 25px;
}

.movie_list_1 .movie-list-item .movie-time-div span:last-child {
  overflow: hidden;
  white-space: nowrap;
  width: 0px;
  padding-right: 110px;
  font-size: 22px;
}

.movie_list_0 .movie-time-div span:first-child {
  overflow: hidden;
  white-space: nowrap;
  width: 350px;
  padding-left: 10px;
  font-size: 25px;
}

.hot-recommend-more {
  width: 100%;
  padding-bottom: 20px;
  text-align: center;
  color: #be9f80;
  font-size: 30px;
}

.hot-items-div .game_item_img {
  /* width: 100px;
  height: 100px; */
}

::v-deep .hot-items-div .game_item_img .van-image__img {
  border-radius: 20px;
}

::v-deep .van-pull-refresh__track .van-pull-refresh__head * {
  color: #000000;
  font-size: 35px;
}
</style>
