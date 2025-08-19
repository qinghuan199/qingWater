<template>
	<view class="collections-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">我的收藏</text>
			<view class="placeholder"></view>
		</view>
		
		<!-- 切换选项卡 -->
		<view class="tab-container">
			<view class="tab-item" :class="{ active: currentTab === 2 }" @click="switchTab(2)">
				<text class="tab-text">视频</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 1 }" @click="switchTab(1)">
				<text class="tab-text">达人</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 3 }" @click="switchTab(3)">
				<text class="tab-text">短视频</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 4 }" @click="switchTab(4)">
				<text class="tab-text">茶贴</text>
			</view>
		</view>

		<!-- 收藏列表 -->
		<view class="list-container">
			<view v-if="loading && currentPage === 1" class="loading-container">
				<text class="loading-text">加载中...</text>
			</view>

			<view v-else-if="collectionList.length === 0" class="empty-container">
				<text class="empty-text">暂无收藏内容</text>
			</view>

			<view v-else>
				<!-- 视频列表 -->
				<view v-if="currentTab === 2" class="video-list">
					<view v-for="item in collectionList" :key="item.id" class="video-item"
						@click="goToVideoDetail(item)">
						<image class="video-cover" :src="item.cover[0] || '/static/icon/default-avatar.png'"
							mode="aspectFill"></image>
						<view class="video-info">
							<text class="video-title">{{ item.name || '未知视频' }}</text>
						</view>
					</view>
				</view>

				<!-- 达人列表 -->
				<view v-if="currentTab === 1" class="grid-container">
					<view v-for="item in collectionList" :key="item.id" class="grid-item"
						@click="goToExpertDetail(item)">
						<image class="grid-avatar" :src="item.cover[0] || '/static/icon/default-avatar.png'"
							mode="aspectFill"></image>
						<view class="grid-info">
							<text class="grid-name">{{ item.name || '未知达人' }}</text>
							<view class="grid-popularity">
								<image class="fire-icon" src="/static/icon/15.png" mode="aspectFit"></image>
								<text class="popularity-num">{{ item.num || '0' }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 短视频列表 -->
				<view v-if="currentTab === 3" class="grid-container">
					<view v-for="(item, index) in collectionList" :key="item.id" class="grid-item"
						@click="goToShortVideo(index)">
						<image class="grid-avatar" :src="item.cover|| '/static/icon/default-avatar.png'"
							mode="aspectFill"></image>
						<view class="grid-info">
							<text class="grid-name">{{ item.name || '未知视频' }}</text>
							<view class="grid-popularity">
								<image class="fire-icon" src="/static/home/ic_video_collect_normal.png" mode="aspectFit"></image>
								<text class="popularity-num">{{ item.likenumber || '0' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 茶贴列表 -->
			<view v-if="currentTab === 4" class="teapost-list">
				<teapost-item v-for="item in collectionList" :key="item.id" :item="item"></teapost-item>
			</view>
		</view>

		<!-- 加载更多 -->
		<view v-if="!hasMore && collectionList.length > 0" class="load-more">
			<text class="load-more-text">没有更多数据了</text>
		</view>
	</view>
</template>

<script>
	import teapostItem from '@/components/teapost-item/teapost-item.vue';
	export default {
		components: {
			teapostItem
		},
		data() {
			return {
				currentTab: 1, // 当前选中的标签页：1-达人，2-视频，3-用户视频
				collectionList: [], // 收藏列表
				loading: false, // 加载状态
				currentPage: 1, // 当前页码
				hasMore: true, // 是否还有更多数据
				limit: 10, // 每页数量
			}
		},
		onLoad() {
			this.loadCollectionList();
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
		onPullDownRefresh() {
			this.currentPage = 1;
			this.hasMore = true;
			this.collectionList = [];
			this.loadCollectionList(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			this.loadMore();
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
				this.collectionList = [];
				this.loadCollectionList();
			},

			// 加载收藏列表
			loadCollectionList(callback) {
				if (this.loading) return;
				this.loading = true;

				const apiUrl = 'api/favorite/list';

				getApp().getData(apiUrl, {
					type: this.currentTab,
					page: this.currentPage,
					limit: this.limit
				}, (res) => {
					this.loading = false;
					if (typeof callback === 'function') {
						callback();
					}
					if (res.code === 200) {
						const data = res.data;
						if (this.currentPage === 1) {
							this.collectionList = data.data || [];
						} else {
							this.collectionList = this.collectionList.concat(data.data || []);
						}
						this.hasMore = this.currentPage < data.last_page;
					} else {
						uni.showToast({
							title: res.msg || '获取收藏列表失败',
							icon: 'none'
						});
					}
				}, (err) => {
					this.loading = false;
					if (typeof callback === 'function') {
						callback();
					}
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				});
			},

			// 加载更多
			loadMore() {
				if (!this.hasMore || this.loading) return;
				this.currentPage++;
				this.loadCollectionList();
			},

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp * 1000);
				const now = new Date();
				const diff = now - date;

				if (diff < 60000) { // 1分钟内
					return '刚刚';
				} else if (diff < 3600000) { // 1小时内
					return Math.floor(diff / 60000) + '分钟前';
				} else if (diff < 86400000) { // 1天内
					return Math.floor(diff / 3600000) + '小时前';
				} else {
					return date.getFullYear() + '-' +
						String(date.getMonth() + 1).padStart(2, '0') + '-' +
						String(date.getDate()).padStart(2, '0');
				}
			},

			// 跳转到达人详情
			goToExpertDetail(item) {
				uni.navigateTo({
					url: '/pages/expert-detail/expert-detail?id=' + item.id
				});
			},

			// 跳转到视频详情
			goToVideoDetail(item) {
				uni.navigateTo({
					url: '/pages/video-detail/video-detail?id=' + item.id
				});
			},

			// 跳转到短视频页面
			goToShortVideo(index) {
				// 获取短视频列表（当前标签页为短视频时）
				const shortVideoList = this.currentTab === 3 ? this.collectionList : [];
				// 将视频列表和当前索引传递给详情页
				uni.navigateTo({
					url: '/pages/short-video/short-video?index=' + index + '&videoList=' + encodeURIComponent(JSON.stringify(shortVideoList))
				});
			},



			// 切换关注状态
			toggleFollow(item) {
				// TODO: 实现关注/取消关注功能
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.collections-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* 头部导航 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		position: sticky;
		top: 0;
		z-index: 99;
		height: 88rpx;
		box-sizing: border-box;
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
		font-weight: bold;
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
		top: 88rpx; /* 与头部高度一致 */
		z-index: 99;
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

	/* 列表容器 */
	.list-container {
		padding: 20rpx 0;
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

	/* 视频列表样式 */
		.video-list {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.video-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #fff;
	}

	.video-cover {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 30rpx;
		border: 2rpx solid #e0e0e0;
	}

	.video-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.video-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.4;
	}

	.video-desc {
		font-size: 26rpx;
		color: #666;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.3;
	}

	/* 网格布局样式 */
	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: 49.5%;
		margin-bottom: 30rpx;
		overflow: hidden;
	}

	.grid-avatar {
		width: 100%;
		height: 370rpx;
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



	/* 加载更多 */
	.load-more {
		padding: 30rpx;
		text-align: center;
	}

	.load-more-text {
		font-size: 28rpx;
		color: #999;
	}
</style>