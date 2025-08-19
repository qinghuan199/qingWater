<template>
	<view class="follows-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">我的关注</text>
			<view class="placeholder"></view>
		</view>

		<!-- 切换选项卡 -->
		<view class="tab-container">
			<view class="tab-item" :class="{ active: currentTab === 2 }" @click="switchTab(2)">
				<text class="tab-text">用户</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 1 }" @click="switchTab(1)">
				<text class="tab-text">达人</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 3 }" @click="switchTab(3)">
				<text class="tab-text">主播</text>
			</view>
		</view>

		<!-- 关注列表 -->
		<view class="list-container">
			<view v-if="loading" class="loading-container">
				<text class="loading-text">加载中...</text>
			</view>

			<view v-else-if="followsList.length === 0" class="empty-container">
				<text class="empty-text">{{ getEmptyText() }}</text>
			</view>

			<view v-else>
				<!-- 达人列表 -->
				<view v-if="currentTab === 1" class="grid-container">
					<view v-for="item in followsList" :key="item.id" class="grid-item" @click="goToExpertDetail(item)">
						<image class="grid-avatar" :src="item.cover[0] || '/static/icon/default-avatar.png'"
							mode="aspectFill"></image>
						<view class="grid-info">
							<text class="grid-name">{{ item.name || '未知达人' }}</text>
							<view class="grid-popularity">
								<image class="fire-icon" src="/static/home/ic_hot.png" mode="aspectFit"></image>
								<text class="popularity-num">{{ item.num || '0' }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 用户列表 -->
				<view v-if="currentTab === 2" class="expert-list">
					<view v-for="item in followsList" :key="item.id" class="expert-item" @click="goToUserProfile(item)">
						<image class="expert-avatar" :src="item.header_img || '/static/icon/default-avatar.png'"
							mode="aspectFill"></image>
						<view class="expert-info">
							<text class="expert-name">{{ item.nickname || '未知用户' }}</text>
						</view>
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
				currentTab: 1, // 当前选中的标签页：1-达人，2-用户，3-主播
				followsList: [], // 关注列表
				loading: false, // 是否正在加载
				currentPage: 1, // 当前页码
				hasMore: true, // 是否还有更多数据
				limit: 10 // 每页显示条数
			}
		},
		onPullDownRefresh() {
			this.currentPage = 1;
			this.hasMore = true;
			this.loadFollowsList(() => {
				uni.stopPullDownRefresh();
			});
		},
		onLoad() {
			this.loadFollowsList();
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

			// 切换标签页
			switchTab(tab) {
				if (this.currentTab === tab) return;
				this.currentTab = tab;
				this.currentPage = 1;
				this.hasMore = true;
				this.followsList = [];
				this.loadFollowsList();
			},

			// 加载关注列表
			loadFollowsList(callback) {
				if (this.loading) return;

				// 主播标签页显示暂无数据
				if (this.currentTab === 3) {
					this.followsList = [];
					this.hasMore = false;
					return;
				}

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

				// 根据标签页选择不同的接口
				let apiUrl;
				if (this.currentTab === 1) {
					apiUrl = 'api/favorite/list'; // 达人
				} else if (this.currentTab === 2) {
					apiUrl = 'api/member/my/follows'; // 用户
				}

				// 构建请求参数
				let requestData = {
					page: this.currentPage,
					limit: this.limit
				};

				// 达人标签页需要传type参数
				if (this.currentTab === 1) {
					requestData.type = 1;
				}

				getApp().getData(apiUrl, requestData, (res) => {
					this.loading = false;
					if (res.code === 200) {
						const data = res.data;
						const newData = data.data || [];

						if (this.currentPage === 1) {
							this.followsList = newData;
						} else {
							this.followsList = [...this.followsList, ...newData];
						}

						// 判断是否还有更多数据
						this.hasMore = this.currentPage < data.last_page;
					} else {
						uni.showToast({
							title: res.msg || '获取关注列表失败',
							icon: 'none'
						});
					}
					if (callback) callback();
				}, () => {
					this.loading = false;
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
					if (callback) callback();
				});
			},

			// 加载更多
			loadMore() {
				if (!this.hasMore || this.loading) return;
				this.currentPage++;
				this.loadFollowsList();
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

			// 跳转到达人详情
			goToExpertDetail(item) {
				uni.navigateTo({
					url: `/pages/expert-detail/expert-detail?id=${item.id}`
				});
			},

			// 跳转到用户详情
			goToUserProfile(item) {
				uni.navigateTo({
					url: `/pages/user-profile/user-profile?id=${item.id}`
				});
			},

			// 获取空状态文本
			getEmptyText() {
				switch (this.currentTab) {
					case 1:
						return '暂无关注的达人';
					case 2:
						return '暂无关注的用户';
					case 3:
						return '暂无数据';
					default:
						return '暂无数据';
				}
			}
		}
	}
</script>

<style scoped>
	.follows-page {
		background-color: #eee;
		min-height: 100vh;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.back-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.header-title {
		font-size: 36rpx;
		color: #333;
	}

	.placeholder {
		width: 60rpx;
	}

	/* 标签页样式 */
	.tab-container {
		display: flex;
		background-color: #eee;
		border-bottom: 1rpx solid #eee;
		padding: 0 30rpx;
		position: sticky;
		top: 88rpx; /* header高度 */
		z-index: 999;
	}

	.tab-item {
		flex: 1;
		padding: 30rpx 0;
		text-align: center;
		position: relative;
	}

	.tab-item.active .tab-text {
		color: #fd3642;
		font-weight: bold;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		border-radius: 2rpx;
	}

	.tab-text {
		font-size: 30rpx;
		color: #666;
		transition: color 0.3s;
	}

	.list-container {}

	.loading-container,
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.loading-text {
		font-size: 28rpx;
		color: #666;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 网格布局样式 */
	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: 100%;
		margin-bottom: 10rpx;
		overflow: hidden;
	}

	.grid-avatar {
		width: 100%;
		height: 350rpx;
		border-radius: 15rpx;
		margin-bottom: 15rpx;
	}

	.grid-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 20rpx 20rpx;
	}

	.grid-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		max-width: 120rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.grid-popularity {
		display: flex;
		align-items: center;
	}

	.fire-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 6rpx;
	}

	.popularity-num {
		font-size: 24rpx;
		color: #000;
	}

	.expert-phone {
		font-size: 26rpx;
		color: #666;
	}

	/* 视频列表样式 */
	.video-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.video-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.video-cover {
		width: 120rpx;
		height: 90rpx;
		border-radius: 12rpx;
		margin-right: 24rpx;
	}

	.video-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.video-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		line-height: 1.4;
	}

	/* 短视频网格样式 */
	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10rpx;
	}

	.grid-item {
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}


	.grid-info {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.grid-name {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 12rpx;
		text-align: center;
		line-height: 1.3;
	}

	.grid-popularity {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
	}

	.fire-icon {
		width: 24rpx;
		height: 24rpx;
	}

	.popularity-num {
		font-size: 24rpx;
		color: #ff6b6b;
		font-weight: 500;
	}

	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		margin-top: 20rpx;
	}

	.load-more-text {
		font-size: 28rpx;
		color: #007aff;
	}
	
	.expert-item{
		display: flex;
		align-items: center;
		padding: 20rpx;
		margin-bottom: 10rpx;
		background-color: #fff;
	}
	.expert-avatar{
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}
	.expert-info{
		margin-left: 20rpx;
	}
</style>