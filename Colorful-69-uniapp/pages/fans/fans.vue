<template>
	<view class="fans-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">我的粉丝</text>
			<view class="placeholder"></view>
		</view>

		<!-- 粉丝列表 -->
		<view class="list-container">
			<view v-if="loading && fansList.length === 0" class="loading-container">
				<text class="loading-text">加载中...</text>
			</view>

			<view v-else-if="fansList.length === 0" class="empty-container">
				<text class="empty-text">暂无粉丝</text>
			</view>

			<view v-else class="expert-list">
				<view v-for="(item, index) in fansList" :key="item.id || index" class="expert-item"
					@click="goToUserDetail(item)">
					<image class="expert-avatar" :src="item.header_img || '/static/icon/default-avatar.png'"
						mode="aspectFill"></image>
					<view class="expert-info">
						<text class="expert-name">{{ item.nickname || '未知用户' }}</text>
						<!-- <text class="expert-phone">{{ item.phone || '未绑定手机' }}</text> -->
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore && !loading" class="load-more" @click="loadMore">
				<text class="load-more-text">加载更多</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fansList: [],
				loading: false,
				currentPage: 1,
				hasMore: true,
				limit: 10
			}
		},
		onLoad() {
			this.loadFansList();
		},
		onShow() {
			// 检查登录状态
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return;
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 加载粉丝列表
			loadFansList() {
				if (this.loading) return;

				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				this.loading = true;

				uni.request({
					url: getApp().globalData.baseUrl + 'api/member/my/fans',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						page: this.currentPage,
						limit: this.limit
					},
					success: (res) => {
						this.loading = false;
						if (res.data.code === 200) {
							const data = res.data.data;
							const newData = data.data || [];
							if (this.currentPage === 1) {
								this.fansList = newData;
							} else {
								this.fansList = [...this.fansList, ...newData];
							}

							// 判断是否还有更多数据
							this.hasMore = this.currentPage < data.last_page;
						} else {
							uni.showToast({
								title: res.data.msg || '获取粉丝列表失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						this.loading = false;
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 加载更多
			loadMore() {
				if (!this.hasMore || this.loading) return;
				this.currentPage++;
				this.loadFansList();
			},

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp * 1000);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},

			// 跳转到用户详情
			goToUserDetail(item) {
				uni.navigateTo({
					url: `/pages/user-profile/user-profile?id=188`
				});
			}
		}
	}
</script>

<style scoped>
	.fans-page {
		background-color: #fff;
		min-height: 100vh;
	}

	/* 头部导航 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
	}

	.back-btn {
		padding: 10rpx;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.header-title {
		font-size: 32rpx;
		color: #333;
	}

	.placeholder {
		width: 60rpx;
	}

	/* 列表容器 */
	.list-container {
		padding: 0 20rpx;
	}

	.loading-container,
	.empty-container {
		padding: 100rpx 0;
		text-align: center;
	}

	.loading-text,
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 达人列表样式 */
	.expert-list {
		padding-bottom: 20rpx;
	}

	.expert-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		margin-top: 10rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.expert-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 30rpx;
		border: 2rpx solid #e0e0e0;
	}

	.expert-info {
		flex: 1;
	}

	.expert-name {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.expert-phone {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 15rpx;
		display: block;
	}

	/* 加载更多 */
	.load-more {
		padding: 30rpx;
		text-align: center;
		margin: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.load-more-text {
		font-size: 28rpx;
		color: #007AFF;
	}
</style>