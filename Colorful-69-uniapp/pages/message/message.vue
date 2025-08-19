<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>
		<view class="message_num u-flex u-flex-center">
			<text class="font-size-12 m-t-20" style="color: #B4B4B4;">{{list.length}} {{$t('message.records')}}</text>
		</view>
		<view class="lists">
			<view class=" img-a radius-9 m-b-30 p-40 list " v-for="(item,index) in list" :key="index">
				<navigator
					:url="`/pages/message_log/message_log?title=${item.title}&content=${item.content}&create_time=${item.create_time}`">
					<view class="u-flex-x u-flex-items-center u-flex-between">
						<view class="u-flex-y">
							<view class="desc font-bold">
								<rich-text :nodes="item.content"></rich-text>
							</view>
							<view class="time font-size-12 font-gray m-t-20">{{item.create_time}}</view>
						</view>
						<u-icon name="arrow-right" color="#237aff" size="28"></u-icon>
					</view>
				</navigator>
			</view>
		</view>
		<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto; margin-top: 10vh;" >
			<view class="bottom-text font-size-12 m-20-0"> © Profitero 2024 | All Rights Reserved</view>
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
				list1: [{
					content: 'sadasdasd',
					create_time: '200-9-9',
				}],
				totalSize: 0,
				totalPage: 0,
				mCurrentPage: 0,
				title: 'NOTIFICATIONS'
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
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#003A7E'
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
		min-height: 100%;
		background-image: none;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
		/* background-color: #eaf9f1; */
	}

	.img-a {
		background-color: #f9fafb;
		/* border: 2rpx solid #000; */
		/* background-image: url('@/static/nfc/button/BG-3.png'); */
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.lists {
		padding: 10px 20px 20px 20px;
	}

	.lists .list {
		padding: 20px;
		/* background: #fff; */
		border-radius: 10px;
		margin-bottom: 15px;
		box-shadow: 0px 0px 10px 0px rgba(35, 122, 255, .1);
	}

	.lists .list .icon {
		width: 40px;
		height: 40px;
		margin-right: 15px;
	}

	.lists .list .info .title {
		font-size: 14px;
	}

	.lists .list .info .time {
		font-size: 12px;
		color: #919191;
		margin-top: 8px;
	}

	.lists .list .info .no_read {
		color: #f03e2a;
		margin-right: 5px;
	}

	.lists .list .desc {
		font-size: 14px;
		color: #000;
		width: 100%;
		overflow: hidden;
		overflow-wrap: break-word;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.message_num {

		/* padding-left: 25px; */
	}
</style>