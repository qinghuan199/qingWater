<template>
	<view class="content">
		<view class="lists">
			<view class="list" v-for="(item, index) in list" :key="index">

				<view class="flex_start align_center">
					<!-- <view><image class="icon" src="../../static/message_2.png" mode="aspectFit"></image></view> -->
					<view class="info">
						<view class="title"><text class="no_read" v-if="item.is_read == 0">[Unread]</text>{{item.title}}
						</view>
						<view class="time">{{item.create_time}}</view>
					</view>
				</view>
				<view class="desc">
					<rich-text :nodes="item.content"></rich-text>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function() {
			var that = this;
			that.initData(1);
		},
		data() {
			return {
				list: [],
				totalSize: 0,
				totalPage: 0,
				mCurrentPage: 0
			}
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
		methods: {
			gotoNot(item) {
				console.log(item);
				uni.navigateTo({
					url: '/pages/notifications/notifications?item=' + encodeURIComponent(JSON.stringify(item))
				})
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
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
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

	}

	.lists {
		padding: 30rpx;
	}

	.lists .list {
		padding: 15px;
		background-color: #FFFFFF;
		border-radius: 10px;
		margin-bottom: 15px;
		box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
	}

	.lists .list .icon {
		width: 40px;
		height: 40px;
		margin-right: 15px;
	}

	.lists .list .info .title {
		font-size: 16px;
		color: #333;
		font-weight: bold;
	}

	.lists .list .info .time {
		font-size: 12px;
		color: #919191;
		margin: 20rpx 0;
	}

	.lists .list .info .no_read {
		color: #f03e2a;
		margin-right: 5px;
	}

	.lists .list .desc {
		font-size: 14px;
		border-radius: 15px;
		color: #666;
	}
</style>