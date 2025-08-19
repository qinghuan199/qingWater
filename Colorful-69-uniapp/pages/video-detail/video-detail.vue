<template>
	<view class="video-detail-page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">视频详情</text>
			<view class="placeholder"></view>
		</view>
		<!-- 视频播放器 -->
		<view class="video-player">
			<video v-if="videoDetail.vod_play_url" :src="videoDetail.vod_play_url" class="player" controls
				:poster="getImageUrl(videoDetail.vod_pic)" @error="onVideoError" @play="onVideoPlay"></video>
			<view v-else class="video-placeholder">
				<image class="placeholder-img" :src="getImageUrl(videoDetail.vod_pic)" mode="aspectFill"></image>
				<view class="play-btn" @click="playVideo">
					<text class="play-text">播放</text>
				</view>
			</view>
		</view>

		<!-- 视频信息 -->
		<view class="video-info">
			<view class="video-title">
				<text class="title-text">{{ videoDetail.vod_name }}</text>
			</view>


			<!-- 操作按钮 -->
			<view class="action-buttons">
				<view class="action-btn" @click="showCommentModal">
					<image class="action-icon" src="/static/home/ic_comment.png" mode="aspectFit"></image>
					<text class="action-text">{{ videoDetail.comments || 0 }}</text>
				</view>
				<view class="action-btn" @click="toggleFavorite">
					<image class="action-icon"
						:src="videoDetail.is_favorite == 1 ? '/static/home/ic_video_collect_select.png' : '/static/home/ic_video_collect_normal.png'"
						mode="aspectFit"></image>
					<text class="action-text">{{ videoDetail.favorites || 0 }}</text>
				</view>

				<view class="action-btn" @click="toggleLike">
					<image class="action-icon"
						:src="videoDetail.is_likenumber == 1 ? '/static/home/ic_like_select.png' : '/static/home/ic_like_normal.png'"
						mode="aspectFit"></image>
					<text class="action-text">{{ videoDetail.likenumber || 0 }}</text>
				</view>
				<view class="action-btn">
					<image class="action-icon" src="/static/home/ic_video_look.png" mode="aspectFit"></image>
					<text class="action-text font-size-13">{{ videoDetail.vod_score_num || 0 }}</text>
				</view>




			</view>
		</view>

		<!-- 相关视频 -->
		<view class="related-videos" v-if="relatedVideos.length > 0">
			<view class="section-title">
				<text class="title-text">精彩视频</text>
			</view>

			<scroll-view class="related-scroll" scroll-y="true">
				<view class="related-list">
					<view v-for="video in relatedVideos" :key="video.id" class="related-item" @click="goToVideo(video)">
						<view class="related-cover">
							<image class="cover-img" :src="getImageUrl(video.vod_pic)" mode="aspectFill"></image>
							<view class="hot-tag" v-if="video.vod_hot === 1">
								<text class="hot-text">热门</text>
							</view>
						</view>
						<view class="related-info">
							<text class="related-title">{{ video.vod_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 加载提示 -->
		<view v-if="loading" class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 评论弹窗 -->
		<view class="comment-modal" v-if="showCommentsPopup" @click="hideCommentModal">
			<view class="comment-content" @click.stop>
				<view class="comment-header">
					<text class="comment-title">评论 ({{commentList.length}})</text>
					<image class="close-btn" src="../../static/icon/close.png" mode="widthFix"
						@click="hideCommentModal"></image>
				</view>

				<scroll-view class="comment-list" scroll-y="true" v-if="commentList.length > 0">
					<view class="comment-item" v-for="(comment, index) in commentList" :key="index">
						<view class="comment-user">
							<view class="avatar-container">
								<image class="user-avatar" :src="comment.header_img" mode="aspectFill"></image>
							</view>
							<view class="user-info">
								<view class="u-flex ">
									<text class="user-name">{{comment.member_name}}</text>
									<image v-if="comment.vip && comment.vip > 0" class="width-70" :src="`/static/icon/vip${comment.vip}.jpg`" mode="widthFix"></image>
								</view>
								<view class="comment-time">{{comment.address}}
									{{formatTime(comment.create_time)}}</view>
							</view>
						</view>
						<text class="comment-content-text">{{comment.content}}</text>
					</view>
				</scroll-view>

				<view class="empty-comments" v-else>
					<text class="empty-text">暂无评论，快来抢沙发吧~</text>
				</view>

				<view class="comment-input-area">
					<input class="comment-input" v-model="newComment" placeholder="请输入评论内容" />
					<view class="submit-btn" @click="submitComment">
						<text class="submit-text">提交</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				videoId: null,
				videoDetail: {},
				relatedVideos: [],
				userInfo: null,
				showCommentsPopup: false,
				commentList: [],
				newComment: '',
				commentLoading: false
			}
		},
		onLoad(options) {
			this.videoId = options.id;
			this.userInfo = getApp().getCache('userInfo');
			if (this.videoId) {
				this.initData();
			} else {
				uni.showModal({
					title: '提示',
					content: '视频ID不能为空',
					showCancel: false,
					success: () => {
						uni.navigateBack();
					}
				});
			}
		},
		onShow() {
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			// 初始化数据
			initData() {
				this.getVideoDetail();
			},

			// 获取视频详情
			getVideoDetail() {
				var that = this;
				that.loading = true;

				var postData = {
					id: that.videoId
				};

				getApp().getData('api/video/detail', postData, function(res) {
					that.loading = false;
					if (res.code === 200) {
						that.videoDetail = res.data || {};
						// 设置页面标题
						uni.setNavigationBarTitle({
							title: that.videoDetail.vod_name || '视频详情'
						});
						// 获取相关视频
						if (that.videoDetail.vod_class_id) {
							that.getRelatedVideos();
						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg || '获取视频详情失败',
							showCancel: false,
							success: () => {
								uni.navigateBack();
							}
						});
					}
				}, function(error) {
					that.loading = false;
					uni.showModal({
						title: '提示',
						content: '网络错误，请稍后重试',
						showCancel: false,
						success: () => {
							uni.navigateBack();
						}
					});
					console.error('获取视频详情网络错误:', error);
				});
			},

			// 获取相关视频
			getRelatedVideos() {
				var that = this;

				var postData = {
					vod_class_id: that.videoDetail.vod_class_id,
					id: that.videoId
				};

				getApp().getData('api/video/relation', postData, function(res) {
					if (res.code === 200) {
						that.relatedVideos = res.data || [];
					} else {
						console.error('获取相关视频失败:', res.msg);
					}
				}, function(error) {
					console.error('获取相关视频网络错误:', error);
				});
			},

			// 播放视频
			playVideo() {
				if (this.videoDetail.vod_play_url) {
					// 这里可以添加播放逻辑
					console.log('播放视频:', this.videoDetail.vod_play_url);
				} else {
					uni.showToast({
						title: '视频地址无效',
						icon: 'none'
					});
				}
			},

			// 视频播放事件
			onVideoPlay() {
				console.log('视频开始播放');
			},

			// 视频错误事件
			onVideoError(e) {
				console.error('视频播放错误:', e);
				uni.showToast({
					title: '视频播放失败',
					icon: 'none'
				});
			},

			// 切换点赞
			toggleLike() {
				var that = this;
				const isLogin = getApp().getCache('isLogin');
			if (isLogin != '1') {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
					return;
				}
				
				var userInfo = getApp().getCache('userInfo');

				// 判断当前是否已点赞
				const operate = that.videoDetail.is_likenumber === 1 ? 2 : 1; // 1:点赞 2:取消点赞

				uni.request({
					url: getApp().globalData.baseUrl + 'api/likenumber/operate',
					method: 'POST',
					header: {
						'token': userInfo.token,
						'Content-Type': 'application/json'
					},
					data: {
						type: 2, // 视频类型
						operate: operate, // 1:点赞 2:取消点赞
						info_id: this.videoId
					},
					success: function(res) {
						if (res.data.code == 200) {
							uni.showToast({
								title: operate === 1 ? '点赞成功' : '取消点赞',
								icon: 'success'
							});
							// 更新本地状态
							that.videoDetail.is_likenumber = operate === 1 ? 1 : 0;
							// 更新点赞数
							that.videoDetail.likenumber += operate === 1 ? 1 : -1;
						} else {
							uni.showToast({
								title: res.data.msg || '操作失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						console.log('点赞操作请求失败:', err);
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			},

			// 切换收藏
			toggleFavorite() {
				var that = this;
				const isLogin = getApp().getCache('isLogin');
			if (isLogin != '1') {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
					return;
				}
				
				var userInfo = getApp().getCache('userInfo');

				// 判断当前是否已收藏
				const operate = that.videoDetail.is_favorite === 1 ? 2 : 1; // 1:收藏 2:取消收藏

				uni.request({
					url: getApp().globalData.baseUrl + 'api/favorite/operate',
					method: 'POST',
					header: {
						'token': userInfo.token,
						'Content-Type': 'application/json'
					},
					data: {
						type: 2, // 视频类型
						operate: operate, // 1:收藏 2:取消收藏
						info_id: this.videoId
					},
					success: function(res) {
						if (res.data.code == 200) {
							uni.showToast({
								title: operate === 1 ? '收藏成功' : '取消收藏',
								icon: 'success'
							});
							// 更新本地状态
							that.videoDetail.is_favorite = operate === 1 ? 1 : 0;
							// 更新收藏数
							that.videoDetail.favorites += operate === 1 ? 1 : -1;
						} else {
							uni.showToast({
								title: res.data.msg || '操作失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						console.log('收藏操作请求失败:', err);
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			},

			// 显示评论弹窗
			showCommentModal() {
				this.showCommentsPopup = true;
				this.getCommentList();
			},
			// 隐藏评论弹窗
			hideCommentModal() {
				this.showCommentsPopup = false;
				this.newComment = '';
			},

			// 获取评论列表
			getCommentList() {
				var that = this;
				var postData = {
					type: 2, // 视频类型
					info_id: this.videoId,
					page: 1,
					limit: 50
				};

				getApp().getData('api/comments/info', postData, function(res) {
					if (res.code == 200) {
						that.commentList = res.data.data || [];
					} else {
						console.log('获取评论列表失败:', res.msg);
					}
				});
			},

			// 提交评论
			submitComment() {
				const isLogin = getApp().getCache('isLogin');
			if (isLogin != '1') {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
					return;
				}
				
				if (!this.newComment.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}

				if (this.commentLoading) return;

				this.commentLoading = true;
				var that = this;
				var postData = {
					type: 2, // 视频类型
					operate: 1, // 评论操作
					info_id: this.videoId,
					content: this.newComment.trim()
				};

				getApp().getData('api/comments/operate', postData, function(res) {
					that.commentLoading = false;
					if (res.code == 200) {
						uni.showToast({
							title: '评论成功',
							icon: 'success'
						});
						that.newComment = '';
						that.getCommentList(); // 重新获取评论列表
						// 更新评论数量
						if (that.videoDetail.comments) {
							that.videoDetail.comments++;
						} else {
							that.videoDetail.comments = 1;
						}
					} else {
						uni.showToast({
							title: res.msg || '评论失败',
							icon: 'none'
						});
					}
				});
			},

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp * 1000);
				const now = new Date();
				const diff = now - date;

				if (diff < 60000) {
					return '刚刚';
				} else if (diff < 3600000) {
					return Math.floor(diff / 60000) + '分钟前';
				} else if (diff < 86400000) {
					return Math.floor(diff / 3600000) + '小时前';
				} else {
					return date.getFullYear() + '-' + 
						   String(date.getMonth() + 1).padStart(2, '0') + '-' + 
						   String(date.getDate()).padStart(2, '0');
				}
			},

			// 分享视频
			shareVideo() {
				uni.showActionSheet({
					itemList: ['分享到微信', '分享到朋友圈', '复制链接'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								uni.showToast({
									title: '分享到微信',
									icon: 'none'
								});
								break;
							case 1:
								uni.showToast({
									title: '分享到朋友圈',
									icon: 'none'
								});
								break;
							case 2:
								uni.setClipboardData({
									data: this.videoDetail.vod_play_url || '',
									success: () => {
										uni.showToast({
											title: '链接已复制',
											icon: 'success'
										});
									}
								});
								break;
						}
					}
				});
			},

			// 跳转到其他视频
			goToVideo(video) {
				uni.redirectTo({
					url: `/pages/video-detail/video-detail?id=${video.id}`
				});
			},

			// 格式化播放次数
			formatPlayCount(count) {
				if (!count) return '0';
				if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万';
				}
				return count.toString();
			},

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				var date = new Date(timestamp * 1000);
				var now = new Date();
				var diff = now.getTime() - date.getTime();
				var days = Math.floor(diff / (24 * 3600 * 1000));

				if (days === 0) {
					return '今天';
				} else if (days === 1) {
					return '昨天';
				} else if (days < 7) {
					return days + '天前';
				} else {
					return date.getMonth() + 1 + '月' + date.getDate() + '日';
				}
			},

			// 获取完整的图片URL
			getImageUrl(imageUrl) {
				if (!imageUrl) return '/static/03.png';

				// 开发环境直接使用原始路径（假设图片服务器可访问）
				if (process.env.NODE_ENV === 'development') {
					return imageUrl.startsWith('/') ?
						`http://103.43.71.158${imageUrl}` // 补全开发环境地址
						:
						imageUrl;
				}

				// 生产环境
				return imageUrl.startsWith('/') ?
					`http://103.43.71.18${imageUrl}` :
					imageUrl;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.back-btn {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		font-size: 40rpx;
		color: #333;
		font-weight: bold;
	}

	.header-title {
		font-size: 36rpx;
		color: #333;
	}

	.video-detail-page {
		background-color: #eeeeee;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	// 视频播放器
	.video-player {
		position: relative;
		width: 100%;
		height: 400rpx;
		background-color: #000;
	}

	.player {
		width: 100%;
		height: 100%;
		height: 400rpx;
	}

	.video-placeholder {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.placeholder-img {
		width: 100%;
		height: 100%;
	}

	.play-btn {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120rpx;
		height: 120rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-text {
		color: #fff;
		font-size: 28rpx;
	}

	// 视频信息
	.video-info {
		background-color: #eeeeee;
		padding: 30rpx;
	}

	.video-title {
		margin-bottom: 20rpx;
	}

	.title-text {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.video-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.stats-left {
		display: flex;
		flex-direction: column;
	}

	.play-count {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.create-time {
		font-size: 24rpx;
		color: #999;
	}

	.duration {
		font-size: 28rpx;
		color: #007bff;
		font-weight: 500;
	}

	// 操作按钮
	.action-buttons {
		display: flex;
		align-items: center;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx;
		margin-right: 10rpx;
		transition: all 0.3s;
	}

	.action-btn:active {
		transform: scale(0.95);
	}

	.action-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.action-text {
		font-size: 32rpx;
		color: #666;
		margin-left: 5rpx;
	}

	// 相关视频
	.related-videos {
		flex: 1;
		background-color: #eee;
		display: flex;
		flex-direction: column;
	}

	.section-title {
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.section-title .title-text {
		font-size: 36rpx;
		color: #ff4757;
		font-weight: bold;
	}

	.related-scroll {
		flex: 1;
		overflow: hidden;
	}

	.related-list {
		padding: 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.related-item {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		width: 48%;
		border-radius: 15rpx;
		transition: all 0.3s;
	}

	.related-item:active {
		transform: scale(0.98);
		background-color: #e9ecef;
	}

	.related-cover {
		position: relative;
		width: 100%;
		height: 300rpx;
		border-radius: 10rpx;
		overflow: hidden;
		flex-shrink: 0;
		margin-bottom: 15rpx;
	}

	.cover-img {
		width: 100%;
		height: 100%;
	}

	.hot-tag {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		background-color: #ff4757;
		border-radius: 6rpx;
		padding: 4rpx 8rpx;
	}

	.hot-text {
		font-size: 20rpx;
		color: #eee;
	}

	.related-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.related-title {
		font-size: 26rpx;
		color: #333;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-top: 5rpx;
	}

	.related-stats {
		font-size: 24rpx;
		color: #666;
		margin-top: 10rpx;
	}

	// 加载提示
	.loading-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 10rpx;
		z-index: 9999;
	}

	.loading-text {
		font-size: 28rpx;
	}

	/* 评论弹窗样式 */
	.comment-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		align-items: flex-end;
	}

	.comment-content {
		width: 100%;
		max-height: 80%;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		display: flex;
		flex-direction: column;
	}

	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.comment-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		width: 40rpx;
		height: 40rpx;
	}

	.comment-list {
		flex: 1;
		max-height: 600rpx;
		padding: 0 30rpx;
	}

	.comment-item {
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.comment-user {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.avatar-container {
		position: relative;
		margin-right: 20rpx;
	}

	.user-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}

	.vip-badge {
		position: absolute;
		bottom: -5rpx;
		right: -5rpx;
		width: 30rpx;
		height: 15rpx;
		border-radius: 4rpx;
		border: 1rpx solid #fff;
	}

	.user-info {
		flex: 1;
	}

	.user-name {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}

	.comment-time {
		font-size: 24rpx;
		color: #999;
		display: block;
	}

	.comment-content-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.empty-comments {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.comment-input-area {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
		background-color: #fff;
	}

	.comment-input {
		flex: 1;
		height: 70rpx;
		padding: 0 20rpx;
		border: 1rpx solid #666;
		border-radius: 35rpx;
		font-size: 28rpx;
		background-color: #fff;
	}

	.submit-btn {
		margin-left: 20rpx;
		padding: 10rpx 50rpx;
		background-color: #ff4757;
		border-radius: 35rpx;
	}

	.submit-text {
		font-size: 28rpx;
		color: #fff;
	}

	.u-flex {
		display: flex;
		align-items: center;
	}

	.width-70 {
		width: 70rpx;
		height: auto;
	}
</style>