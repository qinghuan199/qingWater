<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<!-- <nav-bar class="header" :backState="2000" type="transparentFixed" :scrollTop="scrollTop" transparentFixedFontColor="#FFF" bgColor="#FFF">
			<view class="title" slot="transparentFixed"><image class="logo" src="../../static/logo-01.png" mode="widthFix"></image></view>
			
			<view class="title" slot="default">Welcome</view>
		</nav-bar> -->
		<!-- <view class="box1">
			<image class="bg" src="../../static/welcome_bg2.png" mode="widthFix"></image>
			<view class="info">
				<view class="space_between align_center">
					<view>
						<view>Hi! Welcome to</view>
						<view class="margin_top_20"><image class="logo2" src="../../static/logo-01.png" mode="widthFix"></image></view>
					</view>
					<view class="customer" @click="onCustomer">
						<image src="../../static/welcome_customer.png" mode="widthFix"></image>
						<text>Support</text>
					</view>
				</view>
			</view>
		</view> -->
		<view class="box2">
			<view class=" u-flex u-flex-center" style="margin: 0 auto;">
				<image src="@/static/sky/BG-2.png" mode="heightFix" class="height-100"></image>
			</view>
			<view class="title font-white font-size-20">Welcome To</view>
			<view class="desc font-white font-size-20">Profitero Innovations</view>
			<!-- <view class="welcome_bg">
				<image class="welcome_bg" src="../../static/welcome_bg.png" mode="widthFix"></image>
			</view> -->
			<view class="desc font-white"><text class="font-white font-size-12">
					Build your sustainable, competitive advantage
					through data-driven creative.</text></view>
			<view class="btn" @click="onLogin" style="margin-top: 200rpx;">Login Now</view>
			<view class="btn btn2" @click="onRegister">Register Now</view>
			<view class="m-t-30 font-size-10 text-center" style="color:#000">
				Don't miss out on the opportunity to receive exciting registration bonuses of up to 50 USDT! Register
				now to claim your rewards.

			</view>
		</view>
		<view class="">
			<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto;">
				<view class="box3" style="color: #000;">
					 © Profitero 2024 | All Rights Reserved
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from "@/components/zhouWei-navBar";
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
		onLoad() {
			var that = this;
			that.logo = getApp().globalData.logo;
			that.appname = getApp().globalData.appname;
		},
		components: {
			navBar
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		data() {
			return {
				scrollTop: 0,
				appname: "",
				logo: ""
			}
		},
		methods: {
			onLogin() {
				uni.navigateTo({
					url: '../login/login'
				});
			},
			onRegister() {
				uni.navigateTo({
					url: '../register/register'
				});
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
			}
		}
	}
</script>

<style>
	page {
		color: #333333;
		background: url("@/static/sky/SEND/BG-018.png");
		background-size: 100% auto;
		background-repeat: no-repeat;
		min-height: 100vh;
		background-color: #eaeaea;

	}

	.header .logo {
		width: 5rem;
		display: block;
	}

	.header .message {
		width: 1.4rem;
		display: block;
	}

	.preview_right {
		padding-right: 10px;
	}

	.preview_left {
		padding-left: 10px;
	}

	.box1 {
		position: relative;
	}

	.box1 .logo2 {
		width: 10rem;
		display: block;
	}

	.box1 image {
		width: 100%;
	}

	.box1 .info {
		position: absolute;
		top: 64px;
		left: 0;
		padding: 0 20px;
		color: #ffffff;
		font-size: 16px;
		font-weight: 600;
		width: 100%;
		box-sizing: border-box;
	}

	.box1 .info .customer {
		background-color: #fff;
		color: #333;
		font-size: 14px;
		padding: 5px 15px;
		border-radius: 25px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.box1 .info .customer image {
		width: 22px;
		margin-right: 5px;
		display: block;
	}

	.box2 {
		margin: 0 15px;
		padding: 20px;
		border-radius: 20px;
		position: relative;
		top: 30px;
		/* background-color: #ffffff; */
		/* box-shadow: 0px 2px 4px 1px rgba(0,194,44,0.15); */
	}

	.box2 .title {
		/* font-size: 22px; */
		text-align: center;
		margin-top: 150rpx;
	}

	.box2 .desc {
		/* font-size: 22px; */
		margin-top: 5px;
		/* color: #092B8E; */
		text-align: center;
	}

	.box2 .welcome_bg {
		display: flex;
		justify-content: center;
	}

	.box2 .welcome_bg image {
		width: 70%;
		display: block;
		margin: 20px 0;
	}

	.box2 .btn {
		width: 100%;
		background-color: #2fb7ec;
		color: #fff;
		text-align: center;
		height: 50px;
		line-height: 50px;
		border-radius: 15px;
		font-size: 15px;
		margin-top: 15px;
	}

	.box2 .btn2 {
		background-color: rgba(36, 13, 66, 1);
		color: #fff;
	}

	.box3 {
		position: absolute;
		bottom: 60rpx;
		font-size: 12px;
		color: #666;
		text-align: center;
	}

	.text_center {
		text-align: center;
		color: #666666 !important;
	}
</style>