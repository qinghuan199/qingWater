<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle title='NOTIFICATIONS'></HeaderTitle>
		<customer></customer>
		<view class="u-flex-x-center img_box p-30">

		</view>

		<view class="message_text p-30">
			<view class="text_title">
				<text class="">{{title}}</text>
			</view>
			<view class="text_content">
				<text class="" v-html="content"></text>
			</view>


			<!-- <view class="m-t-50 font-size-12 ">
				<view class="">
					Kindly note: The platform will not be responsible for any loss of funds due If someone pretending to be a Customer Service agent contacts you and ask you to make a deposit. 
				</view>
				<view class="m-t-10">
					There is just a way to contact our Customer Service which is contact via platform,  always make sure you are visiting our platform-PontemInnovations website when entering sensitive data.
				</view>
			</view> -->
			<view class="text_time">
				<text>{{create_time}}</text>
			</view>


		</view>
		<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto; margin-top: 10vh;" >
			<view class="bottom-text font-size-12 m-20-0"> © Profitero 2024 | All Rights Reserved</view>
		</view>
		<!-- <view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto;">
			<view class="bottom-text font-size-12 m-100-0"> © Profitero 2024 | All Rights Reserved</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		onLoad: function(options) {
			// var that = this;
			// that.initData(1);
			console.log('options', options)
			this.title = options.title
			this.content = options.content
			this.create_time = options.create_time
		},
		data() {
			return {
				list: [],
				totalSize: 0,
				totalPage: 0,
				mCurrentPage: 0,
				title: '',
				create_time: '',
				content: '',
			}
		},
		onReachBottom() {
			var that = this;
			if (that.mCurrentPage >= that.totalPage) {
				uni.showToast({
					title: 'No more data is found',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			that.initData(that.mCurrentPage + 1);
		},
		onPullDownRefresh() {
			this.initData(1);
			uni.stopPullDownRefresh();
		},
		methods: {
			send(item) {
				console.log('xinxi', item)
			},
			initData(page) {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.pageNow = page;
				postData.pageSize = '10';
				getApp().getData('api/User/getMessage', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: "Cancel",
							confirmText: "Confirm",
							confirmColor: '#E63888'
						});
					} else {
						if (page == 1) {
							that.list = res.data.list;
						} else {
							var pageDatas = (that.list).concat(res.data.list);
							that.list = pageDatas;
						}
						if (res.data.list.length == 0) {
							uni.showToast({
								title: 'No more data is found',
								icon: 'none',
								duration: 2000
							});
							return;
						}
						uni.$emit('chearMessageCount');
						that.totalSize = res.data.totalElements;
						that.totalPage = res.data.totalPages;
						that.mCurrentPage = res.data.pageNow;
					}
				});
			},
		}
	}
</script>

<style>
	page {
		color: #333;
		min-height: 100%;
		background-image: none;
		/* 	background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed; */
		/* background-color: #eaf9f1; */
	}

	.content {
		/* padding: 40rpx; */
	}

	.img_box {
		background-image: url("/static/pro/Profitero-Logo-03.png"), url("/static/pro/SEND/BG-019.png");
		background-size: 50% auto, 100% auto;
		background-repeat: no-repeat;
		background-position: center center, center center;
		width: 690rpx;
		height: 390rpx;
		border-radius: 30rpx;
		margin: 20rpx 0rpx;
		margin: 0 auto;
		margin-bottom: 80rpx;
	}

	.message_text .text_title {
		color: #040E33;
		font-weight: bolder;
		font-size: 33rpx;
		margin-bottom: 30rpx;
	}

	.message_text .text_content {
		color: #040E33;
		font-size: 26rpx;
		margin-bottom: 40rpx;
	}

	.message_text .text_time {
		font-size: 26rpx;
		color: #000;
	}
</style>