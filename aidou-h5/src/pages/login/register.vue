<template>
  <div class="bg-container page">
    <img class="bg-img" src="img/login/bg.jpg">
    <!-- <div class="container">
		<video
			class="background-video"
			src="https://timibbs-videos.oss-cn-beijing.aliyuncs.com/video/1.mp4"
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
	</div> -->
    <div class="bg-wrapper">
      <div class="register">
        <!-- <van-nav-bar class="nav-bar">
          <template #left>
            <van-icon name="arrow-left" color="#fff" @click="back()"/>
          </template>
</van-nav-bar> -->
        <div class="wrapper">
          <!-- <div class="logo-container">
            <div class="logo-wrapper">
              <img class="logo-img" :src="this.$store.getters.getBaseInfo.ico !==undefined ?this.$store.getters.getBaseInfo.ico:''">
            </div>
          </div> -->
          <div class="zhanwei"></div>
          <div class="title">注册</div>
          <div class="loginForm">
            <van-field v-model="username" clearable input-align="center" class="input"
              placeholder="请输入用户名(6-12个英文字母或数字)" />
            <van-field v-model="password" :type="passwordType" input-align="center" class="input"
              placeholder="请输入登录密码(6-12个英文字母或数字)">
              <template slot="right-icon">
                <van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'" @click="switchPasswordType" />
              </template>
            </van-field>
            <van-field v-model="code" clearable input-align="center" class="input" placeholder="请输入邀请码" />
            <div class="agreement">
              <van-checkbox v-model="checked" />
              <span class="agreement-text">我已经知晓并同意"开户协议"各项条约</span>
            </div>
            <van-button class="login-btn" type="primary" size="normal" @click="doRegister()">注册</van-button>
            <div class="back-btn" @click="back()">返回登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'inputValue',
    event: 'input'
  },
  props: {
    /**
     * 当前输入的值
     */
    inputValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checked: true,
      username: '',
      code: '',
      password: this.inputValue,
      passwordType: 'password',
    };
  },
  methods: {
    switchPasswordType() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    back() {
      return window.history.back();
    },
    doRegister() {
      if (this.username === "" || this.username === null || this.username === undefined) {
        this.$toast.fail("请输入用户名！");
        return false;
      }
      if (this.password === "" || this.password === null || this.password === undefined) {
        this.$toast.fail("请输入密码！");
        return false;
      }
      if (this.code === "" || this.code === null || this.code === undefined) {
        this.$toast.fail("请输入邀请码！");
        return false;
      }
      if (!this.checked) {
        this.$toast.fail("请勾选下方开户协议！");
        return false;
      }
      this.$http({
        method: 'post',
        data: {
          username: this.username,
          password: this.password,
          code: this.code
        },
        url: 'member_register'
      }).then(res => {
        if (res.code === 200) {
          this.$toast.success(res.msg);
          localStorage.setItem('token', res.data)
          this.$router.push("Home")
        } else {
          this.$toast.fail(res.msg);
        }
      })
    }
  },
  created() {
    if (localStorage.getItem('token')) {
      return window.history.back();
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";

/* 设置视频背景样式 */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* 确保视频在其他内容的后面 */
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

.register {
  height: 100%;
}

.bg-container .bg-wrapper .register .nav-bar {
  background: 0 0
}

::v-deep .bg-container .bg-wrapper {
  z-index: 100000;
}

.register .wrapper {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.logo-container {
  margin: 0 auto;
  width: 45%;
}

.logo-container .logo-wrapper {
  position: relative;
  padding-bottom: 62.5%;
}

.logo-container .logo-wrapper .logo-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -o-object-fit: contain;
  object-fit: contain;
}

.register .wrapper .title {
  line-height: 100px;
  text-align: center;
  font-size: 45px;
  font-weight: 700;
  color: #f2cba7;
  letter-spacing: 5px;
}

.register .wrapper .loginForm {
  padding: 60px;
}

.register .wrapper .loginForm .input {
  padding: 10px 20px;
  margin-top: 35px;
  border-radius: 50px;
  text-align: center;
  line-height: 70px;
  font-size: 30px;
  color: #4e4e4e;
}

::v-deep .van-field__right-icon .van-icon {
  font-size: 50px;
}

::v-deep .van-icon {
  font-size: 50px;
}

.register .wrapper .loginForm .reset-text {
  margin: 30px 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.register .wrapper .loginForm .reset-text span {
  color: #fff;
  font-size: 25px;
  font-weight: 500;
  line-height: 15px;
}

.register .wrapper .loginForm .register-text {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register .wrapper .loginForm .register-text span {
  color: #fff;
  font-size: 25px;
  font-weight: 500;
  line-height: 20px;
}

.register .wrapper .loginForm .login-btn {
  margin-top: 30px;
  width: 100%;
  height: 100px;
  border-radius: 50px;
  color: #fff;
  /* background-color: #7e5678; */
  background: linear-gradient(#fde3ca, #e7b486);
  font-size: 30px;
  font-weight: bolder;
  border: none;
}

.register .wrapper .loginForm .back-btn {
  font-size: 25px;
  font-weight: bolder;
  text-align: center;
  margin-top: 30px;
  color: #f2cba7;
  text-decoration: underline;


}

.register .wrapper .loginForm .agreement {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register .wrapper .loginForm .agreement .agreement-text {
  margin-left: 10px;
  font-size: 25px;
  color: #fff;
  font-weight: 500;
  line-height: 30px;
}

::v-deep .agreement .van-icon {
  font-size: 30px;
}

::v-deep .agreement .van-checkbox__icon {
  font-size: 38px;
}

::v-deep .agreement .van-checkbox__icon--checked .van-icon {
  color: #fff;
  /* border-color: rgb(126, 86, 120); */
  border-color: #e7b486;
  background: linear-gradient(#fde3ca, #e7b486);
}
</style>
