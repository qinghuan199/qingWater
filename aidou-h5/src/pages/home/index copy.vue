<template>
  <div class="home-container">
    <div class="linear-bg"></div>
    <div class="home-scroll">
      <div class="banner">
        <swiper class="banner_swiper" :options="bannerSwiperOption">
          <swiper-slide v-for="(v,key) in banners" :key="key">
            <van-image class="banner_img" round :src="v.url">
              <template v-slot:loading>
                <van-loading type="circular"/>
              </template>
            </van-image>
          </swiper-slide>
        </swiper>
      </div>
      <div class="notice-bar">
        <van-notice-bar
            class="notice-swipe"
            left-icon="bullhorn-o"
            background="#ffffff"
            color="#7e5678"
            :text="this.notice"
        />
        <div class="linear-gradient"></div>
      </div>
      <div class="hot-game">
        <div class="hot-title-div">
          <div>
            <span>推荐任务</span></div>
          <div @click="gotoMenu('/Game')">
            <span>查看更多</span>
            <van-icon name="arrow" color="#979799" />
          </div>
        </div>
        <div class="hot-items-div">
          <van-grid :border = false :column-num="4" :icon-size="20">
            <van-grid-item @click="toLottery(v.key,v.id)" v-for="(v,key) in gameitem" :key="key">
              <van-image class="game_item_img" :src="v.ico">
                <template v-slot:loading>
                  <van-loading type="circular"/>
                </template>
              </van-image>
              <span>{{v.name}}</span>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="hot-recommend">
          <div class="hot-title-div">
            <div>
              <span>人气排行</span></div>
            <div>
              <span @click="gotoMenu('/Video')">查看更多</span>
              <van-icon name="arrow" color="#979799" />
            </div>
          </div>
          <div class="movie_list_0">
            <swiper class="movie_swiper" :options="movielistSwiperOption">
              <swiper-slide v-for="(v,key) in movielist_0" :key="key" >
                <van-image class="movie_cover" @click="toPlayVideo(v.id)"  round :src="v.cover">
                  <template v-slot:loading>
                    <van-loading type="circular" />
                  </template>
                </van-image>
                <img class="hot" v-if="key === 0" src="/img/home/no1.png">
                <img class="hot" v-if="key === 1" src="/img/home/no2.png">
                <img class="hot" v-if="key === 2" src="/img/home/no3.png">
                <div class="movie-list-item-bottom">
                  <div class="movie-time-div">
                    <span>{{v.title}}</span>
                    <div class="van-count-down">{{v.time}}</div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="hot-title-div">
            <div>
              <span>热门推荐</span></div>
            <div @click="gotoMenu('/Video')">
              <span>查看更多</span>
              <van-icon name="arrow" size="25" color="#979799" />
            </div>
          </div>
          <div class="movie_list_1">
            <div class="movie-list-item" v-for="(v,key) in movielist_1" :key="key" @click="toPlayVideo(v.id)">
              <van-image class="cover_img"  round :src="v.cover">
                <template v-slot:loading>
                  <van-loading type="circular"/>
                </template>
              </van-image>
              <div class="movie-list-item-bottom">
                <div class="movie-time-div">
                  <span>{{v.title}}</span>
                  <span>播放:{{v.count}}</span>
                </div>
              </div>
            </div>
            <div class="hot-recommend-more" @click="gotoMenu('/Video')">查看更多</div>
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
      notice: "获取中......",
      banners: [{}],
      basicData:[],
      gameitem: [{},{},{},{}],
      movielist_0: [{},{},{},{}],
      movielist_1: [{},{},{},{},{},{},{},{}],
      isLoading: false,
      movielistSwiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        slidesPerGroup : 1,
      },
      bannerSwiperOption: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        speed:800,
        autoplay:true,
        coverflowEffect: {
          rotate: 50,
          stretch: 10,
          depth: 100,
          modifier: 1,
          slideShadows : true
        }
      }
    };
  },
  methods:{
    gotoMenu(router){
      this.$router.replace(router)
    },
    toLottery(key,id){
      if(!localStorage.getItem('token')){
        this.$router.push({path:'/Login'})
      }else {
        this.$router.push({path:'/Lottery?key='+key+"&id="+id})
      }

    },
    toPlayVideo(id){
      if(!localStorage.getItem('token')){
        this.$router.push({path:'/Login'})
      }else {
        this.$router.push({path:'/PlayVideo?id='+id})
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.getBasicConfig();
        this.isLoading = false;
        this.$toast("刷新成功");
      }, 500);
    },
    getBasicConfig(){
      this.$http({
        method: 'get',
        url: 'sys_config'
      }).then(res=>{
        this.basicData = res.data;
        this.getNotice(this.basicData);//获取公告
        this.getBanner(this.basicData);//获取banner
        this.getGameItem();//获取首页游戏列表
        this.getMovieList_0(this.basicData);//获取首页视频0
        this.getMovieList_1(this.basicData);//获取首页视频1
      })

    },
    getNotice(data){
      this.notice = data.notice;
    },
    getGameItem(){
      this.$http({
        method: 'get',
        url: 'lottery_hot'
      }).then(res=>{
        this.gameitem = res.data
      })
    },
    getMovieList_0(data){
      this.movielist_0 = data.movielist_0
    },
    getMovieList_1(data){
      this.movielist_1 = data.movielist_1
    },
    getBanner(data){
      this.banners = data.banners;
    }
  },
  mounted () {

  },
  created() {
    this.getBasicConfig();
  }
}

</script>

<style lang='less' scoped>
@notice-bar-size:30px;
@movie-list-item-bottom-size:25px;
.linear-bg{
  height: 200px;
  background: linear-gradient(
      270deg,#e6c3a1,#7e5678);
}
.home-container{
  position: absolute!important;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
}
.linear-gradient{
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, rgba(126, 86, 120, 0), rgb(230, 195, 161), rgba(126, 86, 120, 0));
}
::v-deep .van-notice-bar__left-icon, .van-notice-bar__right-icon {
  min-width:40px;
}
.notice-swipe{
  width: calc(100% - 50px);
  height: 85px;
  font-size: @notice-bar-size;
}
::v-deep .van-icon-bullhorn-o::before {
  transform: scale(2.5);
}
.banner{
  width: 100%;
  margin-top: -23%;
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
.banner_img{
  border-radius: 10px;
  width: 100%;
  height: 100%;
}
.hot-game{
  width: 100%;
  height:  100%;
}
.hot-title-div{
  width: calc(100% - 50px);
  margin: 0 auto;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hot-title-div> div:first-child{
  width: 130px;
}
.hot-title-div div{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.hot-title-div>div:nth-child(2) span{
  font-size: 20px;
  color: #979799;
}
.hot-title-div>div:first-child span{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 10px;
  font-weight: 700;
  color: #000;
}

.hot-title-div>div:first-child span{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 28px;
  font-weight: 700;
  color: #000;
}
.hot-title-div > div:nth-child(2) span{
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
.hot-game .hot-items-div{
  margin-top: -3px;
}
.hot-game .hot-items-div span{
  margin-top: 10px;
  font-size: 28px;
  color: #000;
}
.hot-recommend{
  width: 100%;
  flex: 1;
  background-color: #f2f2f5;
}
.movie_swiper{
  .swiper-slide {
    width: 80%;
  }
}
.movie_list_0{
  width: calc(100% - 50px);
  margin: 0 auto;
}
.movie_cover{
  border-radius: 10px;
  width:550px;
  height:330px
}
.movie_list_0 .movie-list-item-bottom{
  position: relative;
  width: 550px;
  bottom: 43px;
}
.movie_list_0 .movie-list-item-bottom .movie-time-div{
  background-color: rgba(0,0,0,.4);
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
  border-radius:  0 0 10px 10px;
}
.movie_list_0 .movie_swiper .hot{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 80px;
}
.movie_list_0 span{
  font-size: 30px;
}
.movie_list_1{
  display: flex;
  width: calc(100% - 50px);
  margin: 0 auto;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.movie_list_1 .movie-list-item .cover_img{
  border-radius: 10px;
  width:335px;
  height:290px;
}
.home-scroll{
  padding-bottom: 110px;
}
.movie_list_1 .movie-list-item{
  margin-bottom: -10px;
}

.movie_list_1 .movie-list-item-bottom{
  position: relative;
  width: 335px;
  bottom: 42px;

}
.movie_list_1 .movie-list-item:nth-child(odd){
  margin-right: 25px;
}
.movie_list_1 .movie-list-item-bottom .movie-time-div{
  background-color: rgba(0,0,0,.4);
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
.movie_list_1 .movie_swiper .hot{
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
  padding-right:110px;
  font-size: 22px;
}
.movie_list_0 .movie-time-div span:first-child {
  overflow: hidden;
  white-space: nowrap;
  width: 350px;
  padding-left: 10px;
  font-size: 25px;
}

.hot-recommend-more{
  width: 100%;
  padding-bottom: 20px;
  text-align: center;
  color: #979799;
  font-size: 30px;
}
.hot-items-div .game_item_img{
  width: 100px;
  height: 100px;
}
::v-deep .hot-items-div .game_item_img .van-image__img{
  border-radius: 20px;
}

::v-deep .van-pull-refresh__track .van-pull-refresh__head *{
  color: #000000;
  font-size: 35px;
}
</style>
