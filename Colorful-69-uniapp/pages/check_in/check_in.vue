<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>
		<view class="text-center font-white">
			<!-- <view class="p-t-100 font-bold font-size-22">
				Check In
			</view> -->
			<!-- 	<view class="u-flex u-flex-center u-flex-items-center " style="margin-top: 20rpx;">
				<image src="../../static/sky/SEND/BG-028.png" mode="heightFix" class="height-60"></image>
				<text class="p-l-20 " style=" text-decoration: underline;"> {{userInfo.username}}</text>
			</view> -->
			<view class="m-t-20">
				Basic Salary (USDT)
			</view>
			<view class="m-30 font-bold font-size-24">
				{{userInfo.basic_salary || '0.00'}}
			</view>
			<view @click="checkIn"
				class=" font-bold   u-margin-center-auto radius-10 text-center height-80 font-white font-size-16"
				style="line-height: 80rpx;background-color:#237aff; width: 90%;">
				Check In Now
			</view>
		</view>
		<view class="box width-690 p-10-10   u-margin-center-auto radius-20">
			<view class=" sign_in p-30 " style=" margin: 20rpx auto ; line-height: 1.3; font-size: 26rpx;">
				<view class="u-flex-y  text-center  width-full m-b-50" style=" margin: 10rpx auto 0; ">
					<text class=" font-bold   " style="">
						How to {Check In}:
					</text>
					<text class=" font-bold  " style=" ">
						Complete two sets of data within the same day
					</text>
					<br />
					<text class="  font-bold  " style="">
						How to get your salary {Check In} :
					</text>
					<text class=" font-bold  " style=" ">
						Continuously checking in the corresponding
					</text>
					<text class=" font-bold  " style=" ">
						number of days to receive the salary
					</text>
					<br />
					<text class="   " style=" ">
						*The salary will be credited to your account within
						24 hours*
					</text>
					<!-- 	<view class="height-1 width-600 m-t-40" style="border-bottom: 1px solid #fff; margin: 0 auto;">
					</view> -->
				</view>

				<view class="sign_date u-flex-y u-flex-center u-flex-items-center " v-for="(item, index) in 30"
					:key="index">
					<!-- v-if="item == 5 || item ==15 ||item == 30" -->
					<!-- <view class="width-120 height-120" v-if="item == 3 || item ==5 ||item == 1">
						<image v-if="checkList >= item" style="border-radius:20rpx;" class="width-120 height-120 m-t-20"
							:src="`/static/sky/SEND/2.png`" mode="scaleToFill"></image>
						
					</view> -->
					<view class=" ">
						<view class="radius-full "
							:class="[ (item == 3||item == 5||item==15 || item==30)&&checkList< item ? 'border-main-color overlay-square' :  checkList >= item ? ' sel_sign' : 'overlay-square' ]">

							<image class=" width-60 m-t-5 "
								:src=" (item == 3||item == 5||item==15 || item==30)&&checkList< item ?`/static/pro/SEND/13.png`:`/static/pro/SEND/${checkList>= item ?'19':'19'}.png`"
								:style="{opacity:checkList >= item ?'1':'.5'}" mode="widthFix">
							</image>
						</view>
					</view>

					<!-- checkList.length>index -->
					<!-- <image class="width-120 height-120 m-t-20" v-else
						:src="`/static/sky/SEND/BG-025.png`" mode="aspectFit"></image> -->
					<view class="height-80" style="white-space: nowrap;">
						<view class=" m-t-10 font-size-13 font-bold"
							:style="{ color:checkList >= item  ?'#000':'#969696'}">
							Day
							{{item}}
						</view>
						<view v-if="item == 3" class="  font-size-13 font-bold"
							:style="{ color:checkList >= item  ?'#000':'#969696'}">
							200 USDT
						</view>
						<view v-if="item == 5" class="  font-size-13 font-bold"
							:style="{ color:checkList >= item  ?'#000':'#969696'}">
							500 USDT
						</view>
						<view v-if="item == 15" class="  font-size-13 font-bold"
							:style="{ color:checkList >= item  ?'#000':'#969696'}">
							2100 USDT
						</view>
						<view v-if=" item==30" class="  font-size-13 font-bold"
							:style="{ color:checkList >= item  ?'#000':'#969696'}">
							2100 USDT
						</view>
					</view>

				</view>
			</view>
			<!-- <view class="text-center m-t-30 p-b-10" style=" color: #000; font-size: 24rpx;">
				Kindly contact the customer service to claim your rewards after 7 days of check in.
			</view> -->
		</view>
		<view class="width-690" style="margin: 0 auto;">
			<view class="u-flex u-flex-items-center p-b-20" style="border-bottom: 1px solid #999;">
				<view class="font-size-13 m-l-20" style="flex: 1;">
					<view class="font-bold" style="color: #237aff;">
						Completed Consecutive
					</view>
					<view class="font-bold m-t-10">
						3 Days
					</view>
				</view>
				<view class="font-bold font-size-25" style=" color: #237aff;">
					200 USDT
				</view>
			</view>
			<view class="u-flex u-flex-items-center p-20-0" style="border-bottom: 1px solid #999;">
				<view class="font-size-13 m-l-20" style="flex: 1;">
					<view class="font-bold" style="color: #237aff;">
						Completed Consecutive
					</view>
					<view class="font-bold m-t-10">
						5 Days
					</view>
				</view>
				<view class="font-bold font-size-25" style=" color: #237aff;">
					500 USDT
				</view>
			</view>
			<view class="u-flex u-flex-items-center p-20-0" style="border-bottom: 1px solid #999;">
				<view class="font-size-13 m-l-20" style="flex: 1;">
					<view class="font-bold" style="color: #237aff;">
						Completed Consecutive
					</view>
					<view class="font-bold m-t-10">
						15 Days
					</view>
				</view>
				<view class="font-bold font-size-25" style=" color: #237aff;">
					2100 USDT
				</view>
			</view>
			<view class="u-flex u-flex-items-center p-20-0" style="border-bottom: 1px solid #999;">
				<view class="font-size-13 m-l-20" style="flex: 1;">
					<view class="font-bold" style="color: #237aff;">
						Completed Consecutive
					</view>
					<view class="font-bold m-t-10">
						30 Days
					</view>
				</view>
				<view class="font-bold font-size-25" style=" color: #237aff;">
					2100 USDT
				</view>
			</view>
			<!-- 		<view class="u-flex u-flex-items-center p-20-0" style="border-bottom: 1px solid #999;">
				<view class="font-bold font-size-40" style="flex: 1; color: #237aff;">
					29th
				</view>
				<view class="font-size-13 m-l-20" style="flex: 1;">
					<view class="" style="color: #237aff;">
						Check-In
					</view>
					<view class="font-bold">
						1st Day
					</view>
				</view>
				<view class="" style="flex: 2;">
					<text class="font-size-12">
						• Premium User 1 Day
						• Gift Voucher 20
						• Extra Bonus USDT 150
					</text>
				</view>
			</view> -->
		</view>

		<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto; line-height: 150rpx;">
			<view class="bottom-text font-size-12 "> © Profitero 2024 | All Rights Reserved</view>
		</view>

		<!-- <view class="width-690 u-margin-center-auto ">
			<view class="font-size-22 font-bold m-t-30 p-b-10 font-main-color">
				Note
			</view>
			<text class="font-size-14 " style="color:#fff;">
				-Only after completing 76 product per day, will be able to check in
				-Checks in need to be used daily otherwise the days will be recalculated
			</text>
		</view> -->
		<!-- <userNav :title='3' /> -->

		<view :class="'loading1 '+is_alert_img" catchtouchmove="true">
			<view class="zhezhao_box">
				<img class="img u-flex" :src="config.check_in" />
				<image @click="closeAlert" class="close" src="../../static/close.png" mode="widthFix"></image>
			</view>
		</view>

		<!-- 	<u-modal :show="show" :closeOnClickOverlay="true" :title="title" cancelText="Cancel" :confirmText="confirmText" confirmButtonShape="square" @close="show = false"
			confirmColor="#fff" cancelColor="#1b1b1b" @confirm="fn" @cancel="show=false">
			<view class=" u-fle-y">
				<view class="text-center" style="margin-top:50rpx; width: 660rpx;">
					<image src="/static/checkin4.png" class="icon-60" style=""></image>
				</view>
				<view class="u-flex-x u-flex-center u-flex-items-center" style="margin-top: 30rpx;">
					<view class=""
						style="font-size: 24rpx;width: 80%; margin: 0 auto;font-weight: lighter; text-align: center;">
						{{message}}
					</view>
				</view>
			</view>
		</u-modal> -->
	</view>
</template>

<script>
	export default {
		onLoad() {
			var that = this;
			that.initDataUserInfo()
			this.getCheck();
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			} else {
				that.initDataUserInfo()
			}
		},
		data() {
			return {
				title: 'Check In',
				checkList: 0,
				index: null,
				str: '',
				confirm: true,
				show: false,
				cancelText: 'Cancel',
				confirmText: 'Confirm',
				message: '',
				is_alert_img: 'hidden',
				config: getApp().getCache('config'),
				userInfo: getApp().getCache('userInfo'),

			}
		},
		methods: {

			initDataUserInfo() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/getuserinfo', postData, function(res) {
					var userInfo = res.data.userInfo;
					that.userInfo = userInfo;
					getApp().setCache('userInfo', userInfo);

				});
			},
			closeAlert() {
				var that = this;
				that.is_alert_img = 'hidden';
			},
			fn() {
				if (this.index == 1) {
					this.confirms()
				} else if (this.index == 2) {
					this.confirmss()
				} else if (this.index == 3) {
					this.confirmsss()
				} else if (this.index == 5) {
					this.show = false;
				} else {

				}
			},

			checkIn() {
				// if (!this.isDayCheckIn) return;
				var that = this;
				that.$emit('colse')
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				// console.log('userInfo', userInfo)
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/user/checkin', postData, function(res) {
					let d = res.data;
					if (res.status == 1) {
						console.log(111)
						// that.initData()
						that.getCheck()
					} else {
						console.log(3331)
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: "Cancel",
							confirmText: "Confirm",
							confirmColor: '#F5333E'
						});

					}

				});
			},
			getCheck() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/user/checklist', postData, function(res) {
					that.checkList = res.data.length
					// let list = that.sign_list
					// that.checkList.forEach((item, index) => {
					// 	for (let i = 0; i < list.length; i++) {
					// 		if (index === i) {
					// 			item.img = list[i]
					// 		}
					// 	}
					// })


				});
			},

		}
	}
</script>

<style lang="scss">
	page {
		color: #000;
		min-height: 100%;
		// background-image: url("@/static/nfc/pic/BG-7.png");
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	.img-a {
		background-color: #0e1b2d;
		// background-image: url('@/static/sky/SEND/BG-019.png');
		background-size: 749rpx auto;
		background-position: top center;
		background-repeat: no-repeat;
		border-bottom-left-radius: 60rpx;
		border-bottom-right-radius: 60rpx;
	}

	.border-main-color {
		border-color: #237aff;
	}

	.content {
		min-height: 100vh;
		// background: url(/static//check_in/body_bg.png) no-repeat top center / cover; 
	}


	img {
		margin: 0 auto;
		display: block;
	}

	.sign_in {

		display: flex;
		flex-wrap: wrap;
		background-position: center center;
		// background-image: url('/static/nfc/button/BG-2.png');
		background-color: rgba(234, 249, 241, .3);
		// box-shadow: 3px 3px 3px rgba(0, 0, 0, .2);
		border-radius: 30rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		justify-content: center;
		// padding-top: 10px;
		color: #000;

		.sign_date {
			width: 20%;
			// background-color: #fff;
			margin-bottom: 20rpx;
			text-align: center;
			// line-height: 140px;
			position: relative;
			// scale: .8;

			.sign_top {}

			.sign_bgc {
				position: absolute;
				top: 0;
				left: 0;
				width: 200rpx;
				height: 200rpx;
				background-color: #237aff;
				border-radius: 30rpx;
				z-index: 99;
			}

			.sign_img {
				width: 100rpx;
				height: 100rpx;
			}

			.sel_sign {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				height: 100rpx;
				background-color: #c3e1ff;
			}

			.overlay-square {
				width: 100rpx;
				height: 100rpx;
				background-color: #fefefe;
				/* Semi-transparent white background */
				background-blend-mode: overlay;
				background-size: cover;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				// image {
				// 	opacity: 1;
				// }

			}
		}
	}



	::v-deep .u-modal__content {
		// padding-top: 0rpx !important;
		padding: 0rpx 50rpx 20rpx 50rpx !important;
	}

	::v-deep .u-popup__content {
		display: contents !important;
	}

	::v-deep .u-line {
		opacity: 0 !important;
	}

	::v-deep .u-modal__button-group__wrapper__text {
		margin-top: 60rpx;
	}

	::v-deep.u-modal__button-group__wrapper {
		background: #17173a00;
		margin: 20rpx 200rpx;
		height: 100rpx !important;
		border-radius: 0 !important;
	}

	::v-deep.u-modal {
		// background-image: url('/static/001.png');
		border-radius: 25rpx !important;
		background-position: center;
		background-size: 100% 100%;
		color: black;
	}

	.loading1 {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		color: #fff;
		background: rgba(0, 0, 0, 0.4);
		left: 0;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99999;
	}

	.loading1 .zhezhao_box {
		max-width: 80vw;
		position: relative;
	}

	.loading1 .zhezhao_box .close {
		position: absolute !important;
		top: -10px;
		right: -10px;
		width: 26px;
	}

	.loading1 .img {
		max-width: 80vw;
		max-height: 80vh;
		width: 100%;
		border-radius: 10px;
	}
</style>