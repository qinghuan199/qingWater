<template>
	<view class="user-profile-page">
		<!-- 顶部容器 -->
		<view class="top-container">
			<!-- 头部导航 -->
			<view class="header">
				<view class="back-btn" @click="goBack">
					<image class="width-40" src="/static/home/ic_common_back.png" mode="widthFix"></image>
				</view>
				<view class="placeholder"></view>
			</view>

			<!-- 用户信息头部 -->
			<view class="user-header">
				<view class="user-info">
					<image class="user-avatar" :src="userInfo.header_img || '/static/icon/default-avatar.png'"
						mode="aspectFill"></image>
					<text class="user-name">{{ userInfo.username || userInfo.name || '未知用户' }}</text>
					<view class="follow-btn" @click="toggleFollow" :class="{ 'followed': userInfo.is_follow }">
						<text class="follow-text">{{ userInfo.is_follow ? '已关注' : '关注' }}</text>
					</view>
				</view>
			</view>

			<!-- 统计信息 -->
			<view class="stats-container">
				<view class="stats-item">
					<text class="stats-label">关注</text>
					<text class="stats-number">{{ userInfo.follows_num || 0 }}</text>
				</view>
				<view class="stats-item">
					<text class="stats-label">粉丝</text>
					<text class="stats-number">{{ userInfo.fans_num || 0 }}</text>
				</view>
				<view class="stats-item">
					<text class="stats-label">作品</text>
					<text class="stats-number">{{ userInfo.original_num || 0 }}</text>
				</view>
			</view>
		</view>

		<!-- 作品列表（使用scroll-view包裹） -->
		<scroll-view scroll-y class="works-container" :scroll-top="scrollTop" @scroll="saveScrollPosition"
			refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="refreshing" @scrolltolower="loadMore">
			<view class="list-container">
				<view v-if="loading && worksList.length === 0" class="loading-container">
					<text class="loading-text">加载中...</text>
				</view>

				<view v-else-if="worksList.length === 0" class="empty-container">
					<text class="empty-text">暂无作品</text>
				</view>

				<view v-else class="grid-container">
					<view v-for="(item, index) in worksList" :key="item.id" class="grid-item"
						@click="goToVideoDetail(index)">
						<image class="grid-cover"
							:src="item.cover || item.header_img || '/static/icon/default-avatar.png'" mode="aspectFill">
						</image>
						<view class="grid-info">
							<text class="grid-title">{{ item.name || '未知视频' }}</text>
							<view class="grid-stats">
								<view class="stat-item">
									<image class="stat-icon" src="/static/home/ic_video_collect_normal.png"
										mode="aspectFit"></image>
									<text class="stat-num">{{ item.likenumber || '0' }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多提示 -->
			<view v-if="loading && worksList.length > 0" class="loading-more">
				<text class="loading-more-text">加载中...</text>
			</view>
			<view v-else-if="!hasMore && worksList.length > 0" class="no-more">
				<text class="no-more-text">没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: '',
				userInfo: {},
				worksList: [],
				loading: false,
				currentPage: 1,
				hasMore: true,
				limit: 10,
				followLoading: false,
				scrollTop: 0, // 新增：滚动位置
				refreshing: false // 下拉刷新状态
			}
		},
		onLoad(options) {
			if (options.id) {
				this.userId = options.id;
				this.getUserInfo();
				this.getWorksList(); // 只在初始化加载
			}
		},
		onShow() {
			// 仅检查登录状态
			if (!getApp().getCache('isLogin')) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;

				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				uni.request({
					url: getApp().globalData.baseUrl + 'api/getotheruserinfo',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						member_id: this.userId
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.userInfo = res.data.data || {};
						} else {
							uni.showToast({
								title: res.data.msg || '获取用户信息失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},
			getWorksList(isRefresh = false) {
				if (this.loading) return;

				const token = getApp().getCache('userInfo')?.token;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				this.loading = true;
				if (isRefresh) {
					this.currentPage = 1;
					this.refreshing = true;
				}

				uni.request({
					url: getApp().globalData.baseUrl + 'api/video/othermember/datalist',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						page: this.currentPage,
						limit: this.limit,
						member_id: this.userId
					},
					success: (res) => {
						if (res.data.code === 200) {
							const data = res.data.data;
							if (isRefresh) {
								this.worksList = data.data || [];
							} else {
								this.worksList = [...this.worksList, ...(data.data || [])];
							}
							this.hasMore = this.currentPage < data.last_page;
						}
					},
					complete: () => {
						this.loading = false;
						this.refreshing = false;
						if (isRefresh) {
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			loadMore() {
				if (!this.hasMore || this.loading) return;
				this.currentPage++;
				this.getWorksList();
			},
			onRefresh() {
				this.getWorksList(true);
			},
			saveScrollPosition(e) {
				this.scrollTop = e.detail.scrollTop;
			},
			toggleFollow() {
				if (this.followLoading) return;

				const token = getApp().getCache('userInfo')?.token;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				this.followLoading = true;
				const url = this.userInfo.is_follow ? 'api/member/unfollow' : 'api/member/follow';

				uni.request({
					url: getApp().globalData.baseUrl + url,
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						follow_id: this.userId
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.userInfo.is_follow = !this.userInfo.is_follow;
							this.userInfo.fans_num = this.userInfo.is_follow ?
								(this.userInfo.fans_num || 0) + 1 :
								Math.max((this.userInfo.fans_num || 0) - 1, 0);
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: () => {
						this.followLoading = false;
					}
				});
			},
			goToVideoDetail(index) {
				uni.navigateTo({
					url: '/pages/short-video/short-video?index=' + index + '&videoList=' +
						encodeURIComponent(JSON.stringify(this.worksList))
				});
			}
		}
	}
</script>

<style scoped>
	.user-profile-page {
		background-color: #f5f5f5;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.top-container {
		background-image: url('/static/home/ic_game_class_normal.png');
		background-size: cover;
		background-position: center;
		flex-shrink: 0;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: transparent;
	}

	.back-btn {
		padding: 10rpx;
	}

	.width-40 {
		width: 40rpx;
		height: 40rpx;
	}

	.placeholder {
		width: 60rpx;
	}

	.user-header {
		padding: 40rpx 30rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 30rpx;
	}

	.user-name {
		flex: 1;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.follow-btn {
		width: 130rpx;
		height: 45rpx;
		line-height: 45rpx;
		text-align: center;
		border-radius: 10rpx;
		background-color: #ff6b6b;
		border: 2rpx solid #ff6b6b;
	}

	.follow-btn.followed {
		background-color: #fff;
		border-color: #ddd;
	}

	.follow-text {
		font-size: 24rpx;
		color: #fff;
	}

	.follow-btn.followed .follow-text {
		color: #666;
	}

	.stats-container {
		display: flex;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.stats-item {
		display: flex;
		margin-right: 30rpx;
		align-items: baseline;
	}

	.stats-label {
		font-size: 28rpx;
		color: #666;
	}

	.stats-number {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-left: 5rpx;
	}

	.works-container {
		flex: 1;
		background-color: #fff;
		overflow: hidden;
	}

	.list-container {
		padding: 0;
	}

	.loading-container,
	.empty-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200rpx;
	}

	.loading-text,
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: calc(50% - 10rpx);
		margin-bottom: 20rpx;
		border-radius: 15rpx;
		overflow: hidden;
	}

	.grid-cover {
		width: 100%;
		height: 350rpx;
		border-radius: 10rpx;
	}

	.grid-info {
		padding: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.grid-title {
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.grid-stats {
		display: flex;
		justify-content: flex-end;
	}

	.stat-item {
		display: flex;
		align-items: center;
	}

	.stat-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}

	.stat-num {
		font-size: 24rpx;
		color: #666;
	}

	.loading-more,
	.no-more {
		padding: 30rpx;
		text-align: center;
	}

	.loading-more-text,
	.no-more-text {
		font-size: 28rpx;
		color: #999;
	}
</style>