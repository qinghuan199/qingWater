<template>
	<view class="like-details-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">点赞详情</text>
			<view class="placeholder"></view>
		</view>

		<!-- 内容标题 -->
		<view class="content-header">
			<text class="content-title">{{ contentName || '内容详情' }}</text>
			<text class="content-type">{{ getTypeText() }}</text>
		</view>

		<!-- 点赞列表 -->
		<view class="list-container">
			<view v-if="loading" class="loading-container">
				<text class="loading-text">加载中...</text>
			</view>
			
			<view v-else-if="likeDetailsList.length === 0" class="empty-container">
				<text class="empty-text">暂无点赞记录</text>
			</view>
			
			<view v-else class="like-list">
				<view v-for="item in likeDetailsList" :key="item.id" class="like-item">
					<image class="user-avatar" :src="item.header_img || '/static/icon/default-avatar.png'" mode="aspectFill"></image>
					<view class="user-info">
						<text class="user-name">{{ item.member_name || '匿名用户' }}</text>
						<text class="user-phone">{{ item.member_phone || '' }}</text>
						<text class="like-time">{{ formatTime(item.create_time) }}</text>
					</view>
					<view class="like-content">
						<text class="like-text">{{ item.name || '点赞了这个内容' }}</text>
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
			infoId: '', // 达人或视频的ID
			contentType: 1, // 类型：1-达人，2-视频，3-用户视频
			contentName: '', // 内容名称
			likeDetailsList: [], // 点赞详情列表
			loading: false, // 加载状态
			currentPage: 1, // 当前页码
			hasMore: true, // 是否还有更多数据
			limit: 10 // 每页数量
		}
	},
	onLoad(options) {
		this.infoId = options.id || '';
		this.contentType = parseInt(options.type) || 1;
		this.contentName = decodeURIComponent(options.name || '');
		
		if (this.infoId) {
			this.loadLikeDetails();
		} else {
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 获取类型文本
		getTypeText() {
			switch (this.contentType) {
				case 1:
					return '达人';
				case 2:
					return '视频';
				case 3:
					return '用户视频';
				default:
					return '内容';
			}
		},

		// 加载点赞详情列表
		loadLikeDetails() {
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
					url: getApp().globalData.baseUrl + 'api/likenumber/info',
				method: 'POST',
				header: {
					'token': token
				},
				data: {
					type: this.contentType,
					page: this.currentPage,
					limit: this.limit,
					info_id: this.infoId
				},
				success: (res) => {
					this.loading = false;
					if (res.data.code === 200) {
						const data = res.data.data;
						if (this.currentPage === 1) {
							this.likeDetailsList = data.data || [];
						} else {
							this.likeDetailsList = this.likeDetailsList.concat(data.data || []);
						}
						
						// 判断是否还有更多数据
						this.hasMore = this.currentPage < data.last_page;
					} else {
						uni.showToast({
							title: res.data.msg || '获取点赞详情失败',
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
			this.loadLikeDetails();
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
		}
	}
}
</script>

<style scoped>
.like-details-page {
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

/* 内容头部 */
.content-header {
	padding: 30rpx;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.content-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	display: block;
	line-height: 1.4;
}

.content-type {
	font-size: 26rpx;
	color: #007AFF;
	background-color: #E3F2FD;
	padding: 8rpx 16rpx;
	border-radius: 12rpx;
	display: inline-block;
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

/* 点赞列表样式 */
.like-list {
	padding-bottom: 20rpx;
}

.like-item {
	display: flex;
	align-items: flex-start;
	padding: 30rpx;
	margin-bottom: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	margin-right: 20rpx;
	border: 2rpx solid #e0e0e0;
	flex-shrink: 0;
}

.user-info {
	flex: 1;
	margin-right: 20rpx;
}

.user-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
	display: block;
}

.user-phone {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
	display: block;
}

.like-time {
	font-size: 22rpx;
	color: #999;
	display: block;
}

.like-content {
	flex-shrink: 0;
	max-width: 200rpx;
}

.like-text {
	font-size: 26rpx;
	color: #FF6B35;
	background-color: #FFF3E0;
	padding: 12rpx 20rpx;
	border-radius: 15rpx;
	text-align: center;
	display: block;
	line-height: 1.3;
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