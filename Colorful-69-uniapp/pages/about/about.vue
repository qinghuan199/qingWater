<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>
		<view class="height-100"></view>
		
		
		<view class="width-690 u-m-c-auto">

			<view class="m-t-50 text-center">
				<image src="/static/pro/SEND/BG-09.png" mode="widthFix" class="width-490"></image>
			</view>
			<view class="  width-690 u-m-c-auto m-t-100">
				<h1 class=" "> Demand more action 

			
				</h1>
				<h1 class=""> from your data
				</h1>
				<view class="p-t-50 font-size-18">
					Profitero connects data, insight and action to 
					accelerate profitable growth for the world's leading 
					brands across 1,200+ retailers in 70+ countries.
				</view>
				<view class="p-t-50 font-size-18 font-bold">
					4k+ brands trust us as their 
					end-to-end system for 
					commerce acceleration
				</view>
			</view>
			<view class="  width-690 u-m-c-auto m-t-100">
				<view class="m-t-50 text-center">
					<image src="/static/pro/SEND/BG-08.png" mode="widthFix" class="width-490"></image>
				</view>
				
				<view class="p-t-50 font-size-14 font-bold">
					GET AN ACCURATE VIEW OF THE MARKET
				</view>
				<view class="p-t-50 font-size-14 font-bold">
					• Analyze, measure and enhance your product 
					positioning, pricing & performance on a foundation of 
					reliable digital shelf data that spans 1,200+ retailers 
					in 70+ countries
				</view>
				<view class="p-t-50 font-size-14 font-bold">
					• Validate decisions, quantify opportunities and drive 
					sales on Amazon using highly accurate 1P & 3P 
					competitor sales & market share insights
				</view>
				<view class="p-t-50 font-size-14 font-bold">
					• Isolate availability issues, track price trends and 
					capture share at specific stores and regions
				</view>
				<view class="p-t-50 font-size-14 font-bold">
					• Unlock incremental value and efficiencies by 
					combining our analytics with your other data 
					solutions via our Open Commerce Ecosystem
				</view>
				<view class="p-t-80 font-size-22 font-bold">
					Who we help
				</view>
				
			</view>
			<u-swiper :list="list1" class="m-t-100" height="100rpx"  bgColor="transparent" imgMode="heightFIx"
				previousMargin="100rpx" nextMargin="100rpx"></u-swiper>
			<view class="m-t-80 ">
				<view class="      ">
					<view class="font-size-22 font-bold">
						Customer ROI
					</view>
					<view class="font-bold u-flex  font-size-13 m-t-40">
						<view class="" style="flex: 1;">
							<view class="font-size-32" style="color: #2279ff;">
								2X
							</view>
							<view class="">
								<text>
									eCommerce growth Henkel 
									saw in multiple countries 
									by using Profitero 
									scorecards
								</text>
							</view>
						</view>
						<view class="" style="flex: 1;">
							<view class="font-size-32" style="color: #2279ff;">
								68%
							</view>
							<view class="">
								<text>
									Sales growth Bayer saw 
									from optimizing its 
									Amazon portfolio & 
									product content
								</text>
							</view>
						</view>
					</view>
					<view class="font-bold u-flex  font-size-13 m-t-40">
						<view class="" style="flex: 1;">
							<view class="font-size-32" style="color: #2279ff;">
								$500K
							</view>
							<view class="">
								<text>
									Sales Master Lock gained 
									by minimizing out-of-
									stocks for a single product
								</text>
							</view>
						</view>
						<view class="" style="flex: 1;">
							<view class="font-size-32" style="color: #2279ff;">
								+28%
							</view>
							<view class="">
								<text>
									New-to-brand orders for 
									Kraft Heinz on Walmart 
									through daily Shelf 
									Intelligent Media 
									optimizations
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			
		</view>
		

		<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto;">
			<view class="bottom-text font-size-12 m-20-0"> © Profitero 2024 | All Rights Reserved</view>
		</view>

	</view>
</template>

<script>
	export default {
		onLoad(e) {
			var that = this;

		},
		data() {
			return {
				title: ' About Us',
				list1: [
					'/static/pro/SEND/BG-03.png',
					'/static/pro/SEND/BG-04.png',
					'/static/pro/SEND/BG-05.png',
					'/static/pro/SEND/BG-06.png',
					'/static/pro/SEND/BG-07.png',
				]
			}
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
			initData() {
				var that = this;
				var postData = new Object();
				postData.requesTime = getApp().getTime();
				getApp().getData('api/login/getConfig', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.logout'),
							confirmColor: '#2868FF'
						});
					} else {
						var config = res.data;

						that.content = config.register_desc;
						getApp().setCache('config', config);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		color: #000;
		/* // background-color: #0e0e24; */
		// background-color: #fff;
		// background-image: url('/static/gof/g-9-45.png');
		// background-size: 100% auto;
		// background-repeat: no-repeat;
	}


::v-deep.uni-swiper-slides {
	inset: 0px 110px !important;
}




	.box-bg {
		width: 690rpx;
		margin: 0 auto;
		border-radius: 10rpx;
		background-color: #f8f9fa;
		border: 2rpx solid #c1c1c1;
		padding: 50rpx;
		margin-top: 70rpx;
	}

	.scroll {
		// background-image: url(@/static/Boopin-477.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding: 20rpx 0;
	}

	.text_rich {
		padding: 15px;
		font-size: 14px;
		color: #000;

	}

	.text_rich p {
		min-height: 22px;
	}

	.text_rich img {
		max-width: 100%;
	}

	// .btns {
	// 	padding: 20rpx 20rpx 50rpx;
	// 	background-image: url(/static/icon/51.png);
	// 	background-size: 100% auto;
	// 	background-repeat: no-repeat;
	// 	width: 730rpx;
	// 	overflow: auto;
	// 	margin: 50rpx auto;
	// }

	::v-deep.u-collapse-item {
		background-color: #9708CC00;
	}

	::v-deep.u-collapse-item__content__text {
		color: #000;
	}

	::v-deep .u-cell__title-text {
		color: #000;
	}

	::v-deep .u-cell--clickable {
		background-color: rgba(0, 0, 0, .1);
	}

	::v-deep.u-icon__icon--info[data-v-2ee87dc9] {
		color: #005CBF;
	}
</style>