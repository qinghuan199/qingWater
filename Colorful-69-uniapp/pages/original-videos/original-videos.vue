<template>
	<view class="original-videos-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">原创视频</text>
			<view class="placeholder"></view>
		</view>

		<!-- 视频列表 -->
		<scroll-view class="scroll-container" scroll-y="true" @scrolltolower="loadMore" 
			@refresherrefresh="onRefresh" refresher-enabled="true" :refresher-triggered="refreshing">
			<view class="list-container">
				<view v-if="loading && videoList.length === 0" class="loading-container">
					<text class="loading-text">加载中...</text>
				</view>

				<view v-else-if="videoList.length === 0" class="empty-container">
					<text class="empty-text">暂无原创视频</text>
				</view>

				<view v-else class="video-list">
					<view v-for="item in videoList" :key="item.id" class="video-item" @click="goToVideoDetail(item)">
						<image class="video-cover" :src="item.cover || '/static/icon/default-avatar.png'" mode="aspectFill"></image>
						<view class="video-info">
							<text class="video-title">{{ item.name || '未知视频' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore && !loading" class="load-more">
				<text class="load-more-text">加载更多</text>
			</view>
			
			<view v-if="loading && videoList.length > 0" class="loading-more">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfos:{},
			videoList: [], // 视频列表
			loading: false, // 加载状态
			refreshing: false, // 刷新状态
			currentPage: 1, // 当前页码
			hasMore: true, // 是否还有更多数据
			limit: 10, // 每页数量
			member_id:null
		}
	},
	onLoad() {
		this.getUserInfo().then(() => {
			this.loadVideoList();
		});
	},
	onShow() {
		// 页面显示时可以刷新数据
		this.getUserInfo().then(() => {
			// 获取用户信息后可以进行其他操作
		}).catch(err => {
			console.error('获取用户信息失败:', err);
		});
	},
	methods: {
		getUserInfo() {
			return new Promise((resolve, reject) => {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					reject('未登录');
					return;
				}
				uni.request({
					url: getApp().globalData.baseUrl + 'api/getuserinfo',
					method: 'POST',
					header: {
						'token': token
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.userInfos = res.data.data;
							this.member_id = this.userInfos.id;
							console.log('获取用户ID:', this.userInfos.id);
							resolve(res.data.data);
						} else {
							uni.showToast({
								title: res.data.msg || '获取用户信息失败',
								icon: 'none'
							});
							reject(res.data.msg);
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
						reject(err);
					}
				});
			});
		},
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 加载视频列表
		loadVideoList(isRefresh = false) {
			if (this.loading) return;
			
			this.loading = true;
			
			if (isRefresh) {
				this.currentPage = 1;
				this.hasMore = true;
			}
			var userInfo = getApp().getCache('userInfo');
			const token = userInfo ? userInfo.token : null;
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				this.loading = false;
				return;
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
					member_id: this.member_id
				},
				success: (res) => {
					if (res.data.code === 200) {
						const newData = res.data.data.data || [];
						
						if (isRefresh) {
							this.videoList = newData;
						} else {
							this.videoList = [...this.videoList, ...newData];
						}
						
						// 判断是否还有更多数据
						this.hasMore = newData.length >= this.limit;
						
						if (this.hasMore) {
							this.currentPage++;
						}
					} else {
						uni.showToast({
							title: res.data.msg || '获取数据失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					console.error('获取原创视频列表失败:', err);
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				},
				complete: () => {
					this.loading = false;
					this.refreshing = false;
				}
			});
		},

		// 下拉刷新
		onRefresh() {
			this.refreshing = true;
			this.loadVideoList(true);
		},

		// 加载更多
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.loadVideoList();
			}
		},

		// 跳转到视频播放页面
		goToVideoDetail(item) {
			uni.navigateTo({
				url: `/pages/video-play/video-play?id=${item.id}&url=${encodeURIComponent(item.url || item.video_url || '')}`
			});
		},

		// 格式化时间
		formatTime(timestamp) {
			if (!timestamp) return '';
			
			const date = new Date(timestamp * 1000);
			const now = new Date();
			const diff = now - date;
			
			// 小于1分钟
			if (diff < 60000) {
				return '刚刚';
			}
			// 小于1小时
			else if (diff < 3600000) {
				return Math.floor(diff / 60000) + '分钟前';
			}
			// 小于1天
			else if (diff < 86400000) {
				return Math.floor(diff / 3600000) + '小时前';
			}
			// 大于1天
			else {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
		}
	}
}
</script>

<style scoped>
.original-videos-page {
	height: 100vh;
	background-color: #eee;
	display: flex;
	flex-direction: column;
}

/* 头部导航样式 */
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #e0e0e0;
	position: sticky;
	top: 0;
	z-index: 100;
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

/* 滚动容器 */
.scroll-container {
	flex: 1;
	height: 100%;
}

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

.video-meta {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.author-info {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.author-avatar {
	width: 50rpx;
	height: 50rpx;
	border-radius: 25rpx;
	border: 1rpx solid #e0e0e0;
}

.author-name {
	font-size: 26rpx;
	color: #666;
}

.video-stats {
	display: flex;
	align-items: center;
	gap: 30rpx;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-icon {
	width: 30rpx;
	height: 30rpx;
}

.stat-text {
	font-size: 24rpx;
	color: #999;
}

.video-time {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

/* 加载更多 */
.load-more,
.loading-more {
	padding: 30rpx 0;
	text-align: center;
}

.load-more-text {
	font-size: 28rpx;
	color: #666;
}
</style>