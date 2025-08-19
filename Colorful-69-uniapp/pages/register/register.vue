<template>
	<view class="content u-flex-y u-flex-items-center">
		<!-- 	<nav-bar class="header" :backState="2000" type="transparentFixed" :scrollTop="scrollTop"
		transparentFixedFontColor="#FFF" bgColor="#FFF">
		<view class="transparent_fixed_preview" slot="transparentFixedRight" @click="onLanguage">
			游客登录
		</view>
	</nav-bar> -->
		<view class="header">
			<view class="back-btn" @click="handleBack">
				<uni-icons type="arrowleft" size="24" color="#FFF"></uni-icons>
			</view>
		<!-- 	<view class="" @click="handleGuestLogin">
				游客登录
			</view> -->
		</view>
		<!-- 		<nav-bar class="header" :backState="2000" type="transparentFixed" :scrollTop="scrollTop"
			transparentFixedFontColor="#FFF" bgColor="#FFF">
			<view class="transparent_fixed_preview" slot="transparentFixedRight" @click="onLanguage">
				{{$t('locale.language')}}
			</view>
			<view class="preview" slot="right" @click="onLanguage">{{$t('locale.language')}}</view>
		</nav-bar> -->
		<view class="">
			<view class="height-120">

			</view>
			<image src="@/static/logo.png" mode="widthFix" class="width-150 "></image>
		</view>
		<view class="u-flex-y p-0-20 width-690 " style="margin-top: 10vh;">
			<view class="font-size-20 font-white m-30-0 ">
				{{$t('login.desc')}}
			</view>
			<view class="font-size-15   font-white  m-b-50  ">
				欢迎来到69传媒。
			</view>

		</view>

		<view class="login-form u-flex-y   ">
			<!-- <view class="u-flex-y p-30">
				<view class="u-flex-y u-flex-between">
					<view class="font-size-24 font-bold">{{$t('login.title')}}</view>
					<view class="font-size-12 p-t-20" style="color: #999999;">
						Please login to get access of our features 
					</view>
				</view>
			</view>
			<u-line></u-line> -->
			<view class="u-flex-x u-flex-items-center p-20-30 m-t-30 login-input ">
				<view class="">
					<!-- <view class="font-error u-label">{{$t('login.account')}}</view> -->
					<!-- <image src="../../static/SENDd/Profitero-Logo-02.png" mode="" class="icon-45 m-t-10"></image> -->
				</view>
				<input class=" p-l-30" placeholder-style="color:#666 ; " type="text"
					placeholder="请输入昵称" v-model="nickname" />
			</view>
			<view class="u-flex-x u-flex-items-center p-20-30 m-t-30 login-input ">
				<input class=" p-l-30" placeholder-style="color:#666 ; " type="text" maxlength="11"
					:placeholder="$t('login.account_desc')" v-model="phone" />
			</view>
			<view class="u-flex-x p-20-30 u-flex-items-center  m-t-30 login-input ">
				<input v-if='input_type == "password"' class="p-l-30 " type="password"
					:placeholder="$t('login.password_desc')" v-model="password" placeholder-style="color:#666;" />
				<input v-else class=" p-l-30" type="text" :placeholder="$t('login.password_desc')" v-model="password"
					placeholder-style="color:#000" />
				<!-- 	<uni-icons :type="input_type == 'password' ?'eye-filled':'eye-slash-filled'" class="eye p-t-10"
					size="22" @click="onEye" style="position: absolute; top: 13px; right: 10px;">
				</uni-icons> -->
			</view>
			<view class="u-flex-x u-flex-items-center p-20-30 m-t-30 login-input m-b-100">
				<view class="">
				</view>
				<input class=" p-l-30" placeholder-style="color:#666 ; " type="text"
					placeholder="邀请码（选填）" v-model="invite_code" />
			</view>
			<!-- 	<view @click="onCustomer" class="u-flex-x font-size-13 text-right "
				style="padding: 30rpx 30rpx 50rpx; text-decoration:underline; ">
				Forgot Password?
			</view> -->

			<view class="u-flex u-flex-center">
				<view @click="onRegister" class="login-btn u-flex-x  u-flex-center u-flex-items-center m-b-50">
					登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from "@/components/zhouWei-navBar";
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js";
	export default {
		onShow() {
			var that = this;
			var isLogin = getApp().getCache('isLogin');
			if (!getApp().isEmpty(isLogin)) {
				uni.reLaunch({
					url: '../index/index',
				});
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			var that = this;
			that.logo = getApp().globalData.logo;
			that.appname = getApp().globalData.appname;
			// that.$i18n.locale = 'en'
		},
		components: {
			navBar,
			w_md5,
		},
		data() {
			return {
				nickname: "",
				phone: "",
				password: "",
				invite_code: "",
				appname: "",
				scrollTop: 0,
				input_type: "password",
				modalForm: {
					show: false,
					bgImg: true,
					content: '',
				}
			}
		},
		methods: {
			openWin(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
			onEye() {
				var that = this;
				if (that.input_type == "password") {
					that.input_type = "text";
				} else {
					that.input_type = "password";
				}
			},
			onCustomer() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = new Object();
				postData.token = userInfo.token;
				postData.userid = userInfo.userid;
				postData.requesTime = getApp().getTime();
				getApp().getData('api/Login/getCustomer', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: "Cancel",
							confirmText: "Confirm",
							confirmColor: '#092B8E'
						});
					} else {
						var buttons = new Array();
						var customer_list = res.data;
						for (var i = 0; i < customer_list.length; i++) {
							buttons[i] = customer_list[i].name;
						}
						uni.showActionSheet({
							itemList: buttons,
							success: function(res) {
								getApp().openUrl(customer_list[res.tapIndex].url);
							}
						});
					}
				});
			},
			onRegister() {
				var that = this;
				var postData = new Object();
				// postData.requesTime = getApp().getTime();
				postData.nickname = that.nickname;
				postData.phone = that.phone;
				postData.password = that.password;
				postData.type = 2;
				postData.invite_code = that.invite_code;
				// 按顺序验证表单字段
				if (getApp().isEmpty(postData.nickname)) {
					uni.showToast({
						title: '请先输入昵称',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (getApp().isEmpty(postData.phone)) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (getApp().isEmpty(postData.password)) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				getApp().getData('api/register', postData, function(res) {
					// 根据API文档，成功登录返回code: 200
					if (res.code == 200) {
						// 登录成功
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
						getApp().setCache("isLogin", 1);
						// 保存token到用户信息中
						var userInfo = {
							token: res.data,
							phone: that.phone
						};
						getApp().setCache("userInfo", userInfo);
						setTimeout(function() {
							uni.reLaunch({
								url: '../index/index',
								success: function() {
									uni.$emit('refreshUserPage');
								}
							});
						}, 500)
					} else {
						// 登录失败
						uni.showToast({
							title: res.msg || 'Login failed',
							icon: 'none',
							duration: 2000
						});

					}
				});
			},
			handleBack() {
				uni.navigateBack(); // 返回上一页
			},
			handleGuestLogin() {
				console.log("游客登录");
			},
			onLanguage() {
				var that = this;
				uni.showActionSheet({
					itemList: [that.$t('locale.hk'), that.$t('locale.en')],
					success: function(res) {
						var language = "en";
						switch (res.tapIndex) {
							case 0:
								language = "zh-Hant";
								break;
							case 1:
								language = "en";
								break;
							default:
								break;
						}
						if (that.isAndroid) {
							uni.showModal({
								content: that.$t('locale.language-change-confirm'),
								success: (res) => {
									if (res.confirm) {
										uni.setLocale(language);
									}
								}
							})
						} else {
							uni.setLocale(language);
							that.$i18n.locale = language;
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		color: #000;

		min-height: 100vh;
	}

	/* 确保左右布局对齐 */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;
		width: 100%;
		padding: 10rpx;
	}

	/* 左侧返回按钮样式 */
	.back-btn {
		padding: 10px;
	}

	/* 右侧游客登录按钮样式 */
	.transparent_fixed_preview {
		padding: 10px;
		color: #FFF;
	}

	.u-flex-x input {
		width: 100%;
	}

	.preview,
	.transparent_fixed_preview {
		padding: 0 10px;
	}

	.content {
		min-height: 100vh;
		background-image: url("@/static/bg.jpg");
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #eaeaea;
	}



	.login-input {
		background-color: #fff;
		border-radius: 45rpx;
		width: 676rpx;
		height: 89rpx;
		margin: 0 auto;


	}

	.login-form {
		width: 100%;
		height: 100%;
		position: relative;
		// box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
		// background-color: #fff;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
	}

	.login-btn {
		width: 633rpx;
		height: 96rpx;
		background: linear-gradient(to bottom, #fd2e42, #fc1071);
		border-radius: 30rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #fff;
		margin: 0 auto;
	}

	.login-btn1 {
		width: 633rpx;
		height: 96rpx;
		border-radius: 30rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		margin: 0 auto;
		border: 2rpx solid #fff;
		color: #fff;
	}

	.bottom-text {
		color: #636363;
	}



	.u-label {
		width: 50%;
		color: #606060;
	}
</style>