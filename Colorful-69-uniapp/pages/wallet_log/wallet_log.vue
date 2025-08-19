<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>

		<view class="u-flex u-flex-center">
			<view class="lists m-t-40">
				<view class="list width-690" v-for="(item, index) in list" :key="index">
					<view>
						<view class="" v-if="item.money > 0">
							<image class="icon" src="/static/pro/SEND/BG-031.png" mode="aspectFit"></image>
						</view>
						<view class="" v-else>
							<image class="icon" src="/static/pro/SEND/BG-032.png" mode="aspectFit"></image>
						</view>
					</view>
					<view class="info">
						<view class="space_between">
							<text class="title">{{item.title}}</text>
						</view>
						<view class="space_between">
							<text class="create_time">{{item.create_time}}</text>
							<text class="money green" v-if="item.money > 0">{{money(item.money)}}</text>
							<text class="money red" v-else>{{money(item.money)}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			var that = this;
			that.initData(1);
		},
		onReachBottom() {
			var that = this;
			if (that.mCurrentPage >= that.totalPage) {
				uni.showToast({
					title: that.$t('public.no_data'),
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
		data() {
			return {
				list: [],
				totalSize: 0,
				totalPage: 0,
				mCurrentPage: 0,
				title: 'Transaction History',
			}
		},
		methods: {
			initData(page) {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.pageNow = page;
				postData.pageSize = '10';
				getApp().getData('api/User/getWalletLog', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.logout'),
							confirmColor: '#092B8E'
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
								title: that.$t('public.no_data'),
								icon: 'none',
								duration: 2000
							});
							return;
						}
						that.totalSize = res.data.totalElements;
						that.totalPage = res.data.totalPages;
						that.mCurrentPage = res.data.pageNow;
					}
				});
			},
			money(wallet) {
				var money = getApp().money(wallet);
				if (money > 0) {
					money = '+' + money;
				}
				return money
			}
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100%;
		background-image: none !important;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
		color: #333333;
		// background-color: #eaf9f1;
	}

	.lists {
		padding: 15px;
	}

	.lists .list {
		// background-color: #FFFFFF;
		// background-image: url('@/static/nfc/button/BG-9.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-color: #f9fafb;
		box-shadow: 0px 2px 4px 2px rgba(226, 246, 224, .5);
		// border: 2rpx solid #000;
		color: #333333;
		padding: 15px;
		// border-radius: 15px;
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		align-items: center;
		margin-bottom: 15px;
		// box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
	}

	.lists .list .icon {
		width: 36px;
		height: 36px;
		border-radius: 18px;
		margin-right: 10px;
	}

	.lists .list .info {
		width: 100%;
	}

	.lists .list .info .title {
		font-size: 14px;
		font-weight: 580;
	}

	.lists .list .info .status {
		font-size: 12px;
		background-color: $main-color;
		padding: 2px 10px;
		color: #fff;
		border-radius: 3px;
	}

	.lists .list .info .create_time {
		font-size: 12px;
	}

	.lists .list .info .money {
		font-size: 14px;
		font-weight: 580;
	}

	.lists .list .info .status_0 {
		background-color: $main-color !important;
	}

	.lists .list .info .status_1 {
		background-color: $main-color;
	}

	.lists .list .info .status_2 {
		background-color: #555555;
	}

	.red {
		color: red;
	}

	.green {
		color: #18BC37;
	}
</style>