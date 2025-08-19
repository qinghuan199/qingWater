<template>
	<view class="video-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">短视频</text>
			<view class="placeholder"></view>
		</view>

		<!-- 视频列表 -->
		<view class="list-container">
			<view v-if="loading" class="loading-container">
				<text class="loading-text">加载中...</text>
			</view>

			<view v-else-if="videoList.length === 0" class="empty-container">
				<text class="empty-text">暂无视频内容</text>
			</view>

			<view v-else class="grid-container">
				<view v-for="(item, index) in videoList" :key="item.id" class="grid-item"
					@click="goToVideoDetail(index)">
					<image class="grid-cover" :src="item.cover || item.header_img || '/static/icon/default-avatar.png'"
						mode="aspectFill"></image>
					<view class="play-icon">
						<image class="play-btn" src="/static/icon/play.png" mode="aspectFit"></image>
					</view>
					<view class="grid-info">
						<text class="grid-title">{{ item.name || '未知视频' }}</text>
						<view class="grid-stats">
							<view class="stat-item">
								<image class="stat-icon" src="/static/home/ic_like_normal.png" mode="aspectFit"></image>
								<text class="stat-num">{{ item.likenumber || '0' }}</text>
							</view>
							<view class="stat-item">
								<image class="stat-icon" src="/static/home/ic_video_look.png" mode="aspectFit"></image>
								<text class="stat-num">{{ item.comments || '0' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载更多 -->
		<view v-if="hasMore && !loading" class="load-more" @click="loadMore">
			<text class="load-more-text">加载更多</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoList: [], // 视频列表
				loading: false, // 加载状态
				currentPage: 1, // 当前页码
				hasMore: true, // 是否还有更多数据
				limit: 10 // 每页数量
			}
		},
		onLoad() {
			this.loadVideoList();
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 加载视频列表
			loadVideoList() {
				if (this.loading) return;

				this.loading = true;

				const postData = {
					page: this.currentPage,
					limit: this.limit,
					type: 1 // 推荐类型
				};

				getApp().getData('api/video/member/short/square', postData, (res) => {
					this.loading = false;
					if (res.code === 200) {
						const data = res.data;
						if (this.currentPage === 1) {
							this.videoList = data.data || [];
						} else {
							this.videoList = this.videoList.concat(data.data || []);
						}

						// 判断是否还有更多数据
						this.hasMore = this.currentPage < data.last_page;
					} else {
						uni.showToast({
							title: res.msg || '获取视频列表失败',
							icon: 'none'
						});
					}
				});
			},

			// 加载更多
			loadMore() {
				if (!this.hasMore || this.loading) return;
				this.currentPage++;
				this.loadVideoList();
			},

			// 跳转到短视频详情页
			goToVideoDetail(index) {
				// 将视频列表和当前索引传递给详情页
				uni.navigateTo({
					url: '/pages/short-video/short-video?index=' + index + '&videoList=' + encodeURIComponent(JSON.stringify(this.videoList))
				});
			}
		}
	}
</script>

<style scoped>
	.video-page {
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
		border-bottom: 1rpx solid #e0e0e0;
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

	/* 列表容器 */
	.list-container {
		padding: 20rpx;
	}

	.loading-container,
	.empty-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.loading-text,
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
		width: 48%;
		margin-bottom: 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.grid-cover {
		width: 100%;
		height: 200rpx;
	}

	.play-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60rpx;
		height: 60rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-btn {
		width: 30rpx;
		height: 30rpx;
	}

	.grid-info {
		padding: 0 20rpx 20rpx 20rpx;
	}

	.grid-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.grid-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-item {
		display: flex;
		align-items: center;
	}

	.stat-icon {
		width: 20rpx;
		height: 20rpx;
		margin-right: 6rpx;
	}

	.stat-num {
		font-size: 24rpx;
		color: #666;
	}

	/* 加载更多 */
	.load-more {
		padding: 30rpx;
		text-align: center;
		background-color: #fff;
		border-top: 1rpx solid #f0f0f0;
	}

	.load-more-text {
		font-size: 28rpx;
		color: #007AFF;
	}
</style>