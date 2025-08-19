<template>
	<view class="short-video-page">
		<!-- 视频容器 -->
		<swiper class="video-swiper" :current="currentIndex" vertical @change="onSwiperChange" :indicator-dots="false"
			:autoplay="false" :circular="false">
			<swiper-item v-for="(video, index) in videoList" :key="video.id" class="video-item">
				<!-- 视频播放器 -->
				<video :id="'video-' + index" class="video-player" :src="video.url" :poster="video.cover"
					:controls="false" :autoplay="index === currentIndex" :loop="true" :muted="false"
					@play="onVideoPlay(index)" @pause="onVideoPause(index)" @click="togglePlay(index)"
					@timeupdate="onTimeUpdate(index, $event)" @loadedmetadata="onLoadedMetadata(index, $event)"
					@ended="onVideoEnded(index)">
				</video>

				<!-- 视频进度条 -->
				<view v-if="index === currentIndex" class="video-progress-container">
					<view class="time-display">
						<text class="time-text">{{ formatTime(currentTime[index] || 0) }} </text>
					</view>
					<view class="progress-bar" :class="{dragging: isTouching}" @touchstart="onProgressTouchStart"
						@touchmove="onProgressTouchMove" @touchend="onProgressTouchEnd($event, index)"
						@click="seekTo($event, index)">
						<view class="progress-bg"></view>
						<view class="progress-fill" :style="{width: getProgressWidth(index)}"></view>
						<view class="progress-thumb" :style="{left: getProgressWidth(index)}"></view>
					</view>
					<!-- 时长显示 -->
					<view class="time-display">
						<text class="time-text">
							{{ formatTime(duration[index] || 0) }}</text>
					</view>
				</view>

				<!-- 播放/暂停按钮 -->
				<view v-if="!isPlaying[index]" class="play-overlay" @click="togglePlay(index)">
					<image class="play-icon" src="/static/home/ic_play.png" mode="aspectFit"></image>
				</view>

				<!-- 右侧操作栏 -->
				<view class="right-actions">
					<!-- 用户头像 -->
					<view class="user-avatar" @click="goToUserProfile(video)">
						<image class="avatar-img" :src="video.header_img || '/static/icon/default-avatar.png'"
							mode="aspectFill"></image>
						<view v-if="!video.is_follow" class="follow-btn" @click.stop="toggleFollow(video)">
							<text class="follow-text">+</text>
						</view>
					</view>

					<!-- 点赞 -->
					<view class="action-item" @click="toggleLike(video)">
						<image class="action-icon"
							:src="video.is_likenumber ? '/static/home/ic_plaza_like_select.png' : '/static/home/ic_plaza_like_normal.png'"
							mode="aspectFit"></image>
						<text class="action-text">{{ video.likenumber || '0' }}</text>
					</view>

					<!-- 评论 -->
					<view class="action-item" @click="showComments(video)">
						<image class="action-icon" src="/static/home/ic_plaza_comment.png" mode="aspectFit"></image>
						<text class="action-text">{{ video.comments || '0' }}</text>
					</view>

					<!-- 收藏 -->
					<view class="action-item" @click="toggleFavorite(video)">
						<image class="action-icon"
							:src="video.is_favorite ? '/static/home/ic_plaza_collect_select.png' : '/static/home/ic_plaza_collect_normal.png'"
							mode="aspectFit"></image>
						<text class="action-text">{{ video.favorites || '0' }}</text>
					</view>

					<!-- 分享 -->
					<view class="action-item" @click="shareVideo(video)">
						<image class="action-icon" src="/static/home/ic_plaza_share.png" mode="aspectFit"></image>
					</view>
				</view>

				<!-- 底部信息 -->
				<view class="bottom-info">
					<view class="user-info">
						<text class="username">{{ video.member_nickname || '未知用户' }}</text>
					</view>
					<view class="video-desc">
						<text class="desc-text">{{ video.name || '暂无描述' }}</text>
					</view>
				</view>

				<!-- 返回按钮 -->
				<view v-if="index === currentIndex" class="back-btn" @click="goBack">
					<image class="back-icon" src="/static/home/left.png" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>

		<!-- 评论弹窗 -->
		<view v-if="showCommentModal" class="comment-modal" @click="hideComments">
			<view class="comment-content" @click.stop>
				<view class="comment-header">
					<text class="comment-title">评论 ({{commentList.length}})</text>
					<view class="close-btn" @click="hideComments">
						<text class="close-text">×</text>
					</view>
				</view>
				<scroll-view class="comment-list" scroll-y="true" v-if="commentList.length > 0">
					<view class="comment-item" v-for="(comment, index) in commentList" :key="index">
						<view class="comment-user">
							<view class="avatar-container">
								<image class="comment-user-avatar" :src="comment.header_img" mode="aspectFill"></image>
							</view>
							<view class="user-info">
								<view class="u-flex">
									<text class="user-name">{{comment.member_name}}</text>
									<image v-if="comment.vip && comment.vip > 0" class="width-70"
										:src="`/static/icon/vip${comment.vip}.jpg`" mode="widthFix"></image>
								</view>
								<view class="comment-time">{{comment.address}}
									{{formatCommentTime(comment.create_time)}}</view>
							</view>
						</view>
						<text class="comment-content-text">{{comment.content}}</text>
					</view>
				</scroll-view>
				<view class="empty-comments" v-else>
					<text class="empty-text">暂无评论，快来抢沙发吧~</text>
				</view>
				<view class="comment-input">
					<input class="input-box" placeholder="说点什么..." v-model="commentText" />
					<view class="send-btn" @click="sendComment">
						<text class="send-text">发送</text>
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
				videoList: [], // 视频列表
				currentIndex: 0, // 当前视频索引
				isPlaying: {}, // 播放状态
				showCommentModal: false, // 评论弹窗显示状态
				currentVideo: {}, // 当前视频信息
				commentText: '', // 评论输入内容
				commentList: [], // 评论列表
				commentLoading: false, // 评论加载状态
				currentTime: {}, // 当前播放时间
				duration: {}, // 视频总时长
				isFullscreen: false, // 是否全屏
				isTouching: false, // 是否正在触摸进度条
				progressBarRect: null, // 进度条位置信息
				followLoading: false, // 关注操作加载状态
				userInfo: {}, // 用户信息
				vipCheckTimer: null, // VIP检查定时器
				currentVideoInfo: {}, // 当前播放的视频信息
				hasCheckedVip: {} // 记录每个视频是否已检查过VIP状态
			}
		},
		onLoad(options) {
			// 获取传递的参数
			if (options.index) {
				this.currentIndex = parseInt(options.index);
			}
			if (options.videoList) {
				try {
					this.videoList = JSON.parse(decodeURIComponent(options.videoList));
				} catch (e) {
					console.error('解析视频列表失败:', e);
					this.videoList = [];
				}
			}

			// 初始化播放状态
			this.videoList.forEach((video, index) => {
				this.$set(this.isPlaying, index, index === this.currentIndex);
			});
		},
		onReady() {
			// 页面准备完成后开始播放当前视频
			this.$nextTick(() => {
				this.playVideo(this.currentIndex);
			});
		},

		async onShow() {
			// 检查登录状态
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return;
			}

			// 检查是否从会员购买页面返回
			const hasPurchasedVip = uni.getStorageSync('hasPurchasedVip');
			if (hasPurchasedVip) {
				// 清除购买标记
				uni.removeStorageSync('hasPurchasedVip');
				// 重置VIP检查状态
				this.hasCheckedVip = {};
				// 继续播放当前视频
				this.playVideo(this.currentIndex);
				return;
			}

			// 页面显示时重新获取用户信息，检查VIP状态
			try {
				await this.getUserInfo();
				// 如果用户已经是VIP，重置VIP检查状态并继续播放
				if (this.userInfo && this.userInfo.vip && this.userInfo.vip !== 0) {
					// 重置所有视频的VIP检查状态
					this.hasCheckedVip = {};
					// 用户已经是VIP，继续播放
					this.playVideo(this.currentIndex);
				}
			} catch (error) {
				console.error('获取用户信息失败:', error);
			}
		},
		onUnload() {
			// 页面卸载时停止所有视频播放
			this.videoList.forEach((video, index) => {
				this.pauseVideo(index);
			});

			// 清除VIP检查定时器
			if (this.vipCheckTimer) {
				clearTimeout(this.vipCheckTimer);
				this.vipCheckTimer = null;
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// swiper切换事件
			onSwiperChange(e) {
				const newIndex = e.detail.current;
				// 暂停当前视频
				this.pauseVideo(this.currentIndex);
				// 更新当前索引
				this.currentIndex = newIndex;
				// 重置新视频的VIP检查状态
				this.$set(this.hasCheckedVip, newIndex, false);
				// 播放新视频
				this.playVideo(newIndex);
			},

			// 播放视频
			playVideo(index) {
				const videoContext = uni.createVideoContext('video-' + index, this);
				if (videoContext) {
					videoContext.play();
					this.$set(this.isPlaying, index, true);
				}
			},

			// 暂停视频
			pauseVideo(index) {
				const videoContext = uni.createVideoContext('video-' + index, this);
				if (videoContext) {
					videoContext.pause();
					this.$set(this.isPlaying, index, false);
				}
			},

			// 切换播放/暂停
			togglePlay(index) {
				if (this.isPlaying[index]) {
					this.pauseVideo(index);
				} else {
					// 检查是否已经播放超过15秒且非VIP用户
					const currentTime = this.currentTime[index] || 0;
					if (currentTime >= 15 && this.hasCheckedVip[index] &&
						this.userInfo && (this.userInfo.vip === 0 || !this.userInfo.vip)) {
						// 检查当前视频是否有权限
						const currentVideo = this.videoList[index];
						if (currentVideo.is_node !== 1) {
							// 非VIP用户且视频无权限，无法在15秒后继续播放
							this.showVipModalDialog();
							return;
						}
					}
					this.playVideo(index);
				}
			},

			// 视频播放事件
			async onVideoPlay(index) {
				this.$set(this.isPlaying, index, true);

				// 播放开始后调用userInfo接口
				try {
					await this.getUserInfo();
				} catch (error) {
					console.error('获取用户信息失败:', error);
					// 如果获取用户信息失败，确保userInfo不为undefined
					if (!this.userInfo) {
						this.userInfo = {
							vip: 0
						}; // 默认为非VIP用户
					}
				}

				// 设置当前播放的视频信息
				this.currentVideoInfo = this.videoList[index];

				// 清除之前的定时器
				if (this.vipCheckTimer) {
					clearTimeout(this.vipCheckTimer);
				}

				// 15秒后检查会员状态
				this.vipCheckTimer = setTimeout(() => {
					this.checkVipStatus(index);
				}, 15000);
			},

			// 视频暂停事件
			onVideoPause(index) {
				this.$set(this.isPlaying, index, false);

				// 暂停时清除VIP检查定时器
				if (this.vipCheckTimer) {
					clearTimeout(this.vipCheckTimer);
					this.vipCheckTimer = null;
				}
			},

			// 切换点赞
			toggleLike(video) {
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

				let that = this;
				const operate = video.is_likenumber ===1 ? 2 : 1; // 1:点赞 2:取消点赞
				const postData = {
					type: 3, // 1:楼凤 2:达人 3:视频
					info_id: video.id,
					operate: operate // 1:点赞 2:取消点赞
				};

				getApp().getData('api/likenumber/operate', postData, (res) => {
					if (res.code == 200) {
						uni.showToast({
							title: operate === 1 ? '点赞成功' : '取消点赞',
							icon: 'success',
							duration: 1000
						});
						// 更新点赞状态和数量
						video.is_likenumber = operate === 1 ? 1 : 0;
						if (operate === 1) {
							video.likenumber = (video.likenumber || 0) + 1;
						} else {
							video.likenumber = Math.max((video.likenumber || 0) - 1, 0);
						}
						// 通知首页列表刷新
						uni.$emit('shortVideoListRefresh');
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},

			// 切换收藏
			toggleFavorite(video) {
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

				let that = this;
				// 判断当前是否已收藏
				const operate = video.is_favorite === 1 ? 2 : 1; // 1:收藏 2:取消收藏

				const postData = {
					type: 3, // 1:达人 2:视频 3:短视频
					operate: operate, // 1:收藏 2:取消收藏
					info_id: video.id
				};

				getApp().getData('api/favorite/operate', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: operate === 1 ? '收藏成功' : '取消收藏',
							icon: 'success'
						});
						// 更新本地状态
						video.is_favorite = operate === 1 ? 1 : 0;
						// 更新收藏数
						video.favorites += operate === 1 ? 1 : -1;
						if (video.favorites < 0) {
							video.favorites = 0;
						}
						// 通知首页列表刷新
						uni.$emit('shortVideoListRefresh');
					} else {
						uni.showToast({
							title: res.msg || '操作失败',
							icon: 'none'
						});
					}
				});
			},

			// 切换关注
			toggleFollow(video) {
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

				let that = this;
				const postData = {
					follow_id: video.member_id
				};

				getApp().getData('api/member/follow', postData, function(res) {
					if (res.code == 200) {
						video.is_follow = video.is_follow ? 0 : 1;
						uni.showToast({
							title: video.is_follow ? '关注成功' : '取消关注',
							icon: 'success'
						});
						// 通知首页列表刷新
						uni.$emit('shortVideoListRefresh');
					} else {
						uni.showToast({
							title: res.msg || '操作失败',
							icon: 'none'
						});
					}
				});
			},

			// 显示评论
			showComments(video) {
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
				this.currentVideo = video;
				this.showCommentModal = true;
				this.getCommentList();
			},

			// 隐藏评论
			hideComments() {
				this.showCommentModal = false;
				this.commentText = '';
				this.commentList = [];
			},

			// 获取评论列表
			getCommentList() {
				var that = this;
				var postData = {
					type: 3, // 短视频类型
					info_id: this.currentVideo.id,
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

			// 发送评论
			sendComment() {
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

				if (!this.commentText.trim()) {
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
					type: 3, // 短视频类型
					operate: 1, // 评论操作
					info_id: this.currentVideo.id,
					content: this.commentText.trim()
				};

				getApp().getData('api/comments/operate', postData, function(res) {
					that.commentLoading = false;
					if (res.code == 200) {
						uni.showToast({
							title: '评论成功',
							icon: 'success',
							duration: 1000
						});
						that.commentText = '';
						that.getCommentList(); // 重新获取评论列表
						// 更新评论数量
						if (that.currentVideo.comments) {
							that.currentVideo.comments++;
						} else {
							that.currentVideo.comments = 1;
						}
					} else {
						uni.showToast({
							title: res.msg || '评论失败',
							icon: 'none'
						});
					}
				});
			},

			// 分享视频
			shareVideo(video) {
				// 直接跳转到推广激励页面
				uni.navigateTo({
					url: '/pages/promotion/promotion'
				});
			},

			// 跳转到用户主页
			goToUserProfile(video) {
				uni.navigateTo({
					url: '/pages/user-profile/user-profile?id=' + video.member_id
				});
			},

			// 时间更新事件
			onTimeUpdate(index, event) {
				const currentTime = event.detail.currentTime;
				this.$set(this.currentTime, index, currentTime);

				// 检查是否播放超过15秒且需要VIP检查
				if (currentTime >= 15 && !this.hasCheckedVip[index]) {
					// 检查用户信息和视频权限
					if (this.userInfo && (this.userInfo.vip === 0 || !this.userInfo.vip)) {
						const currentVideo = this.videoList[index];
						if (currentVideo.is_node !== 1) {
							// 非VIP用户且视频无权限，暂停播放并显示弹窗
							this.pauseVideo(index);
							// 将视频时间锁定在15秒
							const videoContext = uni.createVideoContext('video-' + index, this);
							if (videoContext) {
								videoContext.seek(15);
							}
							// 记录当前视频信息，用于购买单个视频
							this.currentVideoInfo = this.videoList[index];
							this.showVipModalDialog();
						}
					}
					this.$set(this.hasCheckedVip, index, true);
				}
			},

			// 视频元数据加载完成
			onLoadedMetadata(index, event) {
				this.$set(this.duration, index, event.detail.duration);
			},

			// 视频播放结束事件
			onVideoEnded(index) {
				// 重置VIP检查状态，以便下次循环播放时能再次检查
				this.$set(this.hasCheckedVip, index, false);
			},

			// 获取进度条宽度
			getProgressWidth(index) {
				const current = this.currentTime[index] || 0;
				const total = this.duration[index] || 1;
				const percentage = (current / total) * 100;
				return percentage + '%';
			},

			// 进度条触摸开始
			onProgressTouchStart(event) {
				this.isTouching = true;
				// 暂停当前视频
				this.pauseVideo(this.currentIndex);
				// 获取进度条位置信息
				uni.createSelectorQuery().in(this).select('.progress-bar').boundingClientRect((rect) => {
					this.progressBarRect = rect;
				}).exec();
			},

			// 进度条触摸移动
			onProgressTouchMove(event) {
				if (!this.isTouching || !this.progressBarRect) return;

				const touch = event.touches[0];
				const clickX = touch.clientX - this.progressBarRect.left;
				const progressWidth = this.progressBarRect.width;
				let percentage = clickX / progressWidth;

				// 限制百分比在0-1之间
				percentage = Math.max(0, Math.min(1, percentage));

				const targetTime = (this.duration[this.currentIndex] || 0) * percentage;

				// 实时更新进度显示
				this.$set(this.currentTime, this.currentIndex, targetTime);
			},

			// 进度条触摸结束
			onProgressTouchEnd(event, index) {
				if (!this.isTouching || !this.progressBarRect) return;

				const touch = event.changedTouches[0];
				const clickX = touch.clientX - this.progressBarRect.left;
				const progressWidth = this.progressBarRect.width;
				let percentage = clickX / progressWidth;

				// 限制百分比在0-1之间
				percentage = Math.max(0, Math.min(1, percentage));

				const targetTime = (this.duration[index] || 0) * percentage;

				// 检查是否拖拽到15秒后且需要VIP检查
				if (targetTime >= 15 && !this.hasCheckedVip[index]) {
					this.checkVipStatus(index);
					this.$set(this.hasCheckedVip, index, true);
					this.isTouching = false;
					this.progressBarRect = null;
					return; // 如果需要VIP检查，暂停拖拽
				}

				// 检查非VIP用户是否试图拖拽到15秒后
				if (targetTime >= 15 && this.userInfo && (this.userInfo.vip === 0 || !this.userInfo.vip)) {
					// 检查当前视频是否有权限
					const currentVideo = this.videoList[index];
					if (currentVideo.is_node !== 1) {
						// 非VIP用户且视频无权限，无法拖拽到15秒后，显示VIP弹窗
						this.showVipModalDialog();
						this.isTouching = false;
						this.progressBarRect = null;
						return;
					}
				}

				// 跳转到目标时间
				const videoContext = uni.createVideoContext('video-' + index, this);
				if (videoContext) {
					videoContext.seek(targetTime);
					// 跳转完成后恢复播放
					setTimeout(() => {
						this.playVideo(index);
					}, 100);
				}

				this.isTouching = false;
				this.progressBarRect = null;
			},

			// 跳转到指定时间（点击事件）
			seekTo(event, index) {
				if (this.isTouching) return; // 如果正在触摸，忽略点击事件

				uni.createSelectorQuery().in(this).select('.progress-bar').boundingClientRect((rect) => {
					const clickX = event.detail.x - rect.left;
					const progressWidth = rect.width;
					let percentage = clickX / progressWidth;

					// 限制百分比在0-1之间
					percentage = Math.max(0, Math.min(1, percentage));

					const targetTime = (this.duration[index] || 0) * percentage;

					// 检查是否拖拽到15秒后且需要VIP检查
					if (targetTime >= 15 && !this.hasCheckedVip[index]) {
						this.checkVipStatus(index);
						this.$set(this.hasCheckedVip, index, true);
						return; // 如果需要VIP检查，暂停拖拽
					}

					// 检查非VIP用户是否试图点击跳转到15秒后
					if (targetTime >= 15 && this.userInfo && (this.userInfo.vip === 0 || !this.userInfo.vip)) {
						// 检查当前视频是否有权限
						const currentVideo = this.videoList[index];
						if (currentVideo.is_node !== 1) {
							// 非VIP用户且视频无权限，无法点击跳转到15秒后，显示VIP弹窗
							this.showVipModalDialog();
							return;
						}
					}

					const videoContext = uni.createVideoContext('video-' + index, this);
					if (videoContext) {
						videoContext.seek(targetTime);
					}
				}).exec();
			},

			// 格式化时间
			formatTime(seconds) {
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = Math.floor(seconds % 60);
				return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
			},

			// 格式化评论时间
			formatCommentTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp * 1000);
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			},

			// 获取用户信息
			getUserInfo() {
				return new Promise((resolve, reject) => {
					var that = this;
					var postData = new Object();
					var userInfo = getApp().getCache('userInfo');
					if (!userInfo || !userInfo.token) {
						console.error('用户token不存在');
						reject('用户token不存在');
						return;
					}
					postData.token = userInfo.token;
					getApp().getData('api/getuserinfo', postData, function(res) {
						if (res) {
							that.userInfo = res.data;
							resolve(that.userInfo);
						} else {
							console.error('获取用户信息失败，响应数据格式错误');
							reject('响应数据格式错误');
						}
					}, function(err) {
						console.error('获取用户信息API调用失败:', err);
						reject(err);
					});
				});
			},

			// 检查VIP状态
			checkVipStatus(index) {
				// 检查userInfo是否存在，避免undefined错误
				if (!this.userInfo) {
					console.log('用户信息未加载，跳过VIP检查');
					return;
				}

				// 检查当前视频是否有权限
				const currentVideo = this.videoList[index];
				if (currentVideo.is_node === 1) {
					// 视频有权限，允许继续播放
					return;
				}

				// 如果会员等级为0，暂停播放并显示充值弹窗
				if (this.userInfo.vip === 0 || !this.userInfo.vip) {
					this.pauseVideo(index);
					// 禁止继续播放，将视频时间锁定在15秒
					const videoContext = uni.createVideoContext('video-' + index, this);
					if (videoContext) {
						videoContext.seek(15);
					}
					// 记录当前视频信息，用于购买单个视频
					this.currentVideoInfo = this.videoList[index];
					this.showVipModalDialog();
				}
				// 如果会员等级不为0，继续播放
			},

			// 购买会员
			buyVip() {
				// 设置进入购买会员页面的标记
				uni.setStorageSync('fromShortVideo', true);
				uni.navigateTo({
					url: '/pages/vip/vip'
				});
			},

			// 购买本视频
			buyCurrentVideo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;

				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				// 调用create接口创建订单
				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/create',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						type: 'member_video',
						info_id: this.currentVideoInfo.id,
						amount: this.currentVideoInfo.amount || '2.00'
					},
					success: (res) => {
						if (res.data.code === 200) {
							// 创建订单成功，调用支付接口
							this.payForVideo(res.data.data);
						} else {
							uni.showToast({
								title: res.data.msg || '创建订单失败',
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

			// 支付视频
			payForVideo(orderId) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;

				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/pay',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						id: orderId,
						paytype: 0,
						type: 'normal'
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							});
							// 更新当前视频的权限状态
							this.$set(this.videoList[this.currentIndex], 'is_node', 1);
							// 重置VIP检查状态，允许继续播放
							this.$set(this.hasCheckedVip, this.currentIndex, false);
							// 继续播放视频
							this.playVideo(this.currentIndex);
						} else if (res.data.code === 402) {
							// 余额不足，显示提示后跳转到充值页面
							uni.showToast({
								title: res.data.msg || '余额不足！',
								icon: 'none'
							});
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/recharge/recharge'
								});
							}, 500);
						} else {
							uni.showToast({
								title: res.data.msg || '支付失败',
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

			// 显示VIP弹窗
			showVipModalDialog() {
				uni.showModal({
					title: '温馨提示',
					content: `1：购买会员可以观看全部付费视频\n2：支付2.00元观看此片`,
					confirmText: '购买本视频',
					cancelText: '购买会员',
					success: (res) => {
						if (res.confirm) {
							// 用户点击购买本视频
							this.buyCurrentVideo();
						} else if (res.cancel) {
							// 用户点击购买会员
							this.buyVip();
						}
					}
				});
			},


		}
	}
</script>

<style scoped>
	.short-video-page {
		width: 100vw;
		height: 100vh;
		background-color: #000;
		position: relative;
	}

	.video-swiper {
		width: 100%;
		height: 100%;
	}

	.video-item {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.video-player {
		width: 100%;
		height: 100vh;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.play-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120rpx;
		height: 120rpx;
		/* background-color: rgba(0, 0, 0, 0.6); */
		border-radius: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.play-icon {
		width: 60rpx;
		height: 60rpx;
	}

	/* 右侧操作栏 */
	.right-actions {
		position: absolute;
		right: 20rpx;
		bottom: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 10;
	}

	.user-avatar {
		position: relative;
		margin-bottom: 60rpx;
	}

	.avatar-img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		border: 4rpx solid #fff;
	}

	.follow-btn {
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 35rpx;
		height: 35rpx;
		background-color: #ff4757;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.follow-text {
		color: #fff;
		font-size: 24rpx;
		font-weight: bold;
	}

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.action-icon {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 10rpx;
	}

	/* 视频进度条样式 - 仿抖音风格 */
	.video-progress-container {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		right: 0;
		z-index: 10;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.progress-bar {
		position: relative;
		height: 4rpx;
		margin-bottom: 0;
		cursor: pointer;
		padding: 15rpx 0;
		/* 增加触摸区域 */
		margin: -15rpx 0 0 0;
		/* 抵消padding对布局的影响 */
		flex: 1;
	}

	.progress-bg {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 4rpx;
		transform: translateY(-50%);
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 2rpx;
	}

	.progress-fill {
		position: absolute;
		top: 50%;
		left: 0;
		height: 4rpx;
		transform: translateY(-50%);
		background-color: #fff;
		border-radius: 2rpx;
	}

	.progress-thumb {
		position: absolute;
		top: 50%;
		width: 12rpx;
		height: 12rpx;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 50%;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.3);
	}

	.progress-bar.dragging .progress-thumb {
		width: 16rpx;
		height: 16rpx;
	}

	/* 时长显示样式 */
	.time-display {
		flex-shrink: 0;
	}

	.time-text {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5);
	}

	/* 拖拽状态下的进度条样式 */
	.progress-bar.dragging .progress-thumb {
		transform: translate(-50%, -50%) scale(1.3);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.4);
		opacity: 1;
	}

	.progress-bar.dragging .progress-fill {
		transition: none;
	}

	/* 悬停时显示拖拽点 */
	.progress-bar:active .progress-thumb {
		opacity: 1;
	}



	.action-text {
		color: #fff;
		font-size: 24rpx;
		text-align: center;
	}

	/* 底部信息 */
	.bottom-info {
		position: absolute;
		bottom: 150rpx;
		left: 30rpx;
		right: 150rpx;
		z-index: 10;
	}

	.user-info {
		margin-bottom: 20rpx;
	}

	.username {
		color: #fff;
		font-size: 36rpx;
		font-weight: bold;
	}

	.video-desc {
		max-height: 120rpx;
		overflow: hidden;
	}

	.desc-text {
		color: #fff;
		font-size: 28rpx;
		line-height: 1.4;
	}

	/* 返回按钮 */
	.back-btn {
		position: absolute;
		top: 50rpx;
		left: 30rpx;
		width: 60rpx;
		height: 60rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	/* 评论弹窗 */
	.comment-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-end;
		z-index: 1000;
	}

	.comment-content {
		width: 100%;
		max-height: 60vh;
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
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
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-text {
		font-size: 40rpx;
		color: #999;
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

	.comment-user-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
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

	.width-70 {
		width: 70rpx;
		height: auto;
		margin-left: 10rpx;
	}

	.u-flex {
		display: flex;
		align-items: center;
	}

	.comment-input {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
	}

	.input-box {
		flex: 1;
		height: 80rpx;
		padding: 0 20rpx;
		background-color: #f5f5f5;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.send-btn {
		margin-left: 20rpx;
		padding: 20rpx 30rpx;
		background-color: #007AFF;
		border-radius: 40rpx;
	}

	.send-text {
		color: #fff;
		font-size: 28rpx;
	}
</style>