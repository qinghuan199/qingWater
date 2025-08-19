<template>
  <div class="container page">
    <van-nav-bar :title="this.videoInfo.vod_name" class="nav-bar">
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="back()"/>
      </template>
    </van-nav-bar>
    <div class="movie-video">
      <video id="my-video"  class="video-js">
      </video>
    </div>
    <div class="movie-content">
      <div class="movie-descript">
        <p>{{ this.videoInfo.vod_name}}</p>
        <span>{{this.videoInfo.count}}次播放</span>
      </div>

      <div class="movie-body">
        <div class="movie-title">
          <div>
            <span>热门推荐</span>
          </div>
        </div>
        <div class="movie-list">
          <div class="movie-play-item" @click="toPlayVideo(v.id)" v-for="(v,key) in moreVideoInfo" :key="key">
            <div>
              <img :src="v.vod_pic">
              <div>
                <div class="van-count-down">{{ v.time }}</div>
              </div>
            </div>
            <div>
              <p>{{ v.vod_name }}</p>
              <span>{{ v.count }}次播放</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
export default {
  data() {
    return {
      nowPlayVideoUrl: "",
      cover:"",
      userInfo:[],
      videoInfo:{},
      moreVideoInfo:{},
      player:null
    };
  },
  methods: {
    back(){
      this.$router.push({path:'Home'})
    },
    getVideoInfo(){
      this.$http({
        method: 'get',
        data:{id:this.$route.query.id},
        url: 'video_get_info'
      }).then(res=>{
        this.videoInfo = res.data;
        this.nowPlayVideoUrl = this.videoInfo.vod_play_url;
        this.cover = this.videoInfo.vod_pic;
        let videos = document.getElementById('my-video');
        videos.poster = this.cover;
        this.getVideo();
      })

    },
    toPlayVideo(id){
      if(!localStorage.getItem('token')){
        this.$router.push({path:'/Login'})
      }else {
        this.$router.push({path:'?id='+id})
        location.reload();
      }

    },
    getMoreVideoItem(){
      this.$http({
        method: 'get',
        url: 'video_get_more_item'
      }).then(res=>{
          this.moreVideoInfo = res.data;
      })
    },
    getVideo() {
      this.player = videojs("my-video",  {
        height:"200px",
        preload: "auto", // 预加载
        controls: true,  // 显示播放的控件
        multipleArray: [0.75, 1, 1.5, 2], // 倍速设置
      });
      this.player.src([{
        src: this.nowPlayVideoUrl,
        type: "application/x-mpegURL" // 告诉videojs,这是一个hls流
      }]);

    },
    getUserInfo(){
      this.$http({
        method: 'get',
        url: 'user_info'
      }).then(res=>{
        if(res.code === 200){
          this.userInfo = res.data;
          if(this.userInfo.status !== 1){
            this.$toast("账号下线");
            localStorage.clear()
            this.$router.push({path:'/Login'})
          }else {
            if(this.$store.getters.getBaseInfo.isplay == 1){
              this.getVideoInfo();
              this.getMoreVideoItem()
              if(this.userInfo.money <= "0.00"){
                this.$toast("请充值后观看视频！");
                this.$router.push({path:'/Home'})
              }
            }else {
              this.getVideoInfo();
              this.getMoreVideoItem();
            }
          }
        }else if(res.code ===401){
          this.$toast(res.msg);
        }
      })
    },
  },
  created() {
    if(!localStorage.getItem('token')){
      this.$router.push({path:'/Login'})
    }else {
      this.getUserInfo();
    }
  },
  destroyed () {
    this.player.dispose()
  }
};
</script>

<style scoped>
.video-js {
  width: 100%;
  /*height: 420px;*/
  font-size: 24px;
}
.movie-content{
  flex: 1;
  overflow-y: auto;
}
.movie-content .movie-descript{
  width: 100%;
  height: 140px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px;
}
.movie-content .movie-descript p{
  font-size: 30px;
  font-weight: 700;
  color: #000;
}
.movie-content .movie-descript span{
  color: #979799;
}
.movie-content .movie-body{
  width: calc(100% - 20px);
  margin: 0 auto;
}
::v-deep .movie-video .video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -100px;
}
.movie-content .movie-body .movie-title{
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.movie-content .movie-body .movie-title>div:first-child {
  width: 200px;
}
.movie-content .movie-body .movie-title>div:first-child span{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 30px;
  font-weight: 700;
  color: #000;
}
.movie-content .movie-body .movie-title>div:first-child span:before {
  content: "";
  display: block;
  width: 8px;
  height: 30px;
  background-color: #7e5678;
  border-radius: 25px;
  margin-right: 10px;
}
.movie-play-item{
  width: 100%;
  height: 200px;
  border-radius: 10px;
  position: relative;
  display: flex;
  background-color: #fff;
  margin-bottom: 20px;
}
.movie-play-item>div{
  height: 100%;
}
.movie-play-item>div:first-child {
  width: 200px;
  position: relative;
}
.movie-play-item>div:first-child>img{
  width: 100%;
  height: 100%;
  border-radius: 10px 0 0 10px;
}
.movie-play-item>div:first-child>div{
  position: absolute;
  width: 100%;
  height: 30px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  background-color: rgba(0,0,0,.4);
  border-radius: 0 0 0 10px;
}
.movie-play-item>div:first-child>div .van-count-down {
  color: #fff;
  font-size: 25px;
}
.movie-play-item>div:nth-child(2) p{
  width: 500px;
  height: 60px;
  font-size: 30px;
  line-height: 32px;
  word-break: break-all;
  overflow: hidden;
  color: #000;
}
.movie-play-item>div:nth-child(2) span{
  color: #000;
}
.movie-play-item>div:nth-child(2) {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
abbr, address, article, aside, audio, b, blockquote, body, canvas, caption, cite, code, dd, del, details, dfn, div, dl, dt, em, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, p, pre, q, samp, section, small, span, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, ul, var, video {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  box-sizing: border-box;
}
</style>