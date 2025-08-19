<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle :title='title'></HeaderTitle>

		<view class=" box_bg">
			<view class="font-black  text-center  radius-12 u-flex-y u-flex-center u-flex-items-center" style="">
				<view class="font-size-14 " style="margin-top: 0rpx;">
					<image src="../../static/pro/Profitero-Logo-03.png" mode="widthFix" class="width-480"></image>
				</view>
			</view>
			<view class="u-flex u-flex-center " style="margin-top: 130rpx;">
				<image src="/static/pro/SEND/BG-01.png" mode="heightFix" class="height-150"></image>
			</view>
			<view class="u-flex-y text-center u-flex-center " style="margin-top: 70rpx;color: #001033;">
				<view class="font-size-24 font-bold p-b-30" style="">
					Let’s Join Us Now
				</view>
				<text class="text-center" style="font-weight: 500 !important;">
					If agent has any enquiry, kindly contact
					the Customer Service
				</text>
			</view>
			<view class="u-flex u-flex-center">

			</view>
			<view class="u-flex u-flex-center">
				<view @click="openWin(customerList[0].url)" class=" img-aaaa text-center font-size-14   m-t-40  m-b-10">

					Direct to WhatsApp


				</view>
			</view>
			<view class="u-flex u-flex-center">
				<view @click="openWin(customerList[1].url)" class=" img-aaaa text-center font-size-14   m-t-40  m-b-10">
			
					Direct to Telegram
			
			
				</view>
			</view>
			<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto;">
				<view class="bottom-text font-size-12 m-100-0"> © Profitero 2024 | All Rights Reserved</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: ' Contact Us',
				customerList: []
			};
		},
			onLoad() {
					this.onCustomer();
				},
		methods: {
			back() {
				let canNavBack = getCurrentPages()
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					history.back();
				}
			},
		onCustomer() {
						var that = this;
						var userInfo = getApp().getCache('userInfo');
						var postData = new Object();
						postData.token = userInfo.token;
						postData.userid = userInfo.userid;
						postData.requesTime = getApp().getTime();
						getApp().getData('api/User/getCustomer', postData, function(res) {
							if (res.status == 0) {
								uni.showModal({
									title: getApp().globalData.appname,
									content: res.message,
									showCancel: false,
									cancelText: that.$t('public.cancel'),
									confirmText: that.$t('public.confirm'),
									confirmColor: '#083643'
								});
							} else {
								var buttons = new Array();
								var customer_list = res.data;
								for (var i = 0; i < customer_list.length; i++) {
									buttons[i] = customer_list[i].name;
								}
								// uni.showActionSheet({
								// 	itemList: buttons,
								// 	success: function(res) {
								// 		getApp().openUrl(customer_list[res.tapIndex].url);
								// 	}
								// });
								that.customerList = customer_list;
								console.log('that.customerList',that.customerList);
							}
						});
					},
					openWin(url) {
						console.log(this.customerList[1].url)
						window.open(url)
						// location.href=url
						// getApp().openUrl(url);
					},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		color: #333;
		// min-height: 100%;
		// // background-image: url("@/static/nfc/pic/BG-7.png");
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// background-attachment: fixed;
	}

	.img-aaaa {
		width: 90%;
		background-color: #237aff;
		color: #fff;
		border-radius: 20rpx;
		padding: 40rpx 0rpx;
		text-align: center;
		// background-image: url('@/static/nfc/button/BG-5.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	::v-deep.uni-page-head {
		background-color: transparent !important;
		// z-index: 99999;
	}

	::v-deep.uni-page-head__title {
		color: #fff !important;
	}

	.content {
		// background: url('/static/body_bg.png') no-repeat center /cover;
		// font-weight: bold;
	}

	.box_bg {
		// margin: 100rpx auto;
		min-height: calc(100vh - 416rpx);
		background-color: transparent !important;
		border-radius: 30rpx 30rpx 0 0;
		padding: 60rpx 30rpx;
	}
</style>