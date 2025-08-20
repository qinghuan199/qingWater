<template>
	<view class="u-flex-y  content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>

		<view class="u-flex-y  p-40 width-690 u-flex-items-center u-flex-self-center radius-8  bg-white"
			style="margin-top: 20vh;">
			<image src="/static/pro/Profitero-Logo-01.png" mode="widthFix" class="width-350 p-t-30"></image>
			<text class="font-bold m-t-50" style="font-size: 16px;">Let's Join Us Now</text>
			<text class="width-530 m-t-30 font-size-14 text-center" style="color: #000;">
				Copy referral code to join us now</text>
			<!-- <view class="codeBg"></view> -->

			<view class="u-flex-x   u-flex-between p-30 width-full radius-6 m-t-30"
				style="background:linear-gradient(to right,#e2f5c6,#fefefe)">
				<view class="u-flex-y font-bold ">
					<text class="font-size-12 ">Referral Code</text>
					<text class="m-t-10" style="color: #237aff;">{{userInfo.userid}}</text>
				</view>
				<view @click="copyUserid"
					class="font-white  font-size-13 font-bold u-flex-x u-flex-items-center p-20-30 radius-10"
					style="background-color: #237aff ;">
					Copy Code
				</view>
			</view>
		</view>
		<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto; margin-top: 10vh;">
			<view class="bottom-text font-size-12 m-20-0"> © Profitero 2024 | All Rights Reserved</view>
		</view>
		<!-- <text class="text-center font-gray2 font-size-12 m-80-0">
			{{$t('login.banquan')}}
		</text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: ' Invite Friends',
				userInfo: getApp().getCache('userInfo'),
			};
		},
		onLoad() {

		},
		methods: {
			copyUserid() {
				uni.setClipboardData({
					data: this.userInfo.userid,
					showToast: false,
					success: function() {
						uni.showToast({
							title: 'Copied successfully',
							icon: 'none',
							duration: 1000
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background-image: url("@/static/nfc/pic/BG-7.png");
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// height: 100%;
		// background-attachment: fixed;
		// height: calc(100vh - 40px);
		color: #000;
	}

	.bg-gradient-grey {
		background: linear-gradient(to top, #191b1d, #27292b);
	}

	.bg-gradient {
		background-color: #1364ff;
	}

	.qr-content {
		margin-top: -80px;
	}

	// .content {

	// 	background-image: url(/static/BG-6.png);
	// 	background-size: 100% auto;
	// 	background-repeat: no-repeat;
	// 	height: 100%;
	// }

	.codeBg {
		// background-image: url(/static/gof/g-9-42.png);
		background-size: 100% 100%;

		background-repeat: no-repeat;
		height: 580rpx;
		width: 550rpx;
	}
</style>