<template>
	<view class="expert-detail-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<view class="header-title">达人详情</view>
			<view class="header-right">
				<!-- <view class="share-btn" @click="shareExpert">
					<image class="share-icon" src="../../static/icon/share.png" mode="widthFix"></image>
				</view> -->
			</view>
		</view>
		<!-- 相册轮播图 -->
		<view class="gallery-section" v-if="expertInfo.img_url && expertInfo.img_url.length > 0">
			<view class="section-title">
				<text class="title-text">相册 ({{expertInfo.img_url.length}})</text>
			</view>
			<swiper class="gallery-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
				<swiper-item v-for="(image, index) in expertInfo.img_url" :key="index">
					<image class="swiper-image" :src="image" mode="aspectFill" @click="previewImage(index)"></image>
				</swiper-item>
			</swiper>

			<!-- 互动按钮 -->
			<view class="interaction-buttons">
				<view class="interaction-btn" @click="showCommentModal">
					<image class="icon-40" src="../../static/home/ic_comment.png" mode="aspectFill"></image>
					<text class="btn-count">{{expertInfo.comments || 0}}</text>
				</view>
				<view class="interaction-btn" @click="toggleFavorite">
					<image class="icon-40"
						:src="expertInfo.is_favorite ? '../../static/home/ic_video_collect_select.png' : '../../static/home/ic_video_collect_normal.png'"
						mode="aspectFill"></image>
					<text class="btn-count">{{expertInfo.favorites || 0}}</text>
				</view>
				<view class="interaction-btn" @click="toggleLike">
					<image class="icon-40"
						:src="expertInfo.is_likenumber ? '../../static/home/ic_like_select.png' : '../../static/home/ic_like_normal.png'"
						mode="aspectFill"></image>
					<text class="btn-count">{{expertInfo.likenumber || 0}}</text>
				</view>
			</view>
		</view>

		<scroll-view class="content" scroll-y="true" v-if="expertInfo">


			<!-- 详细介绍 -->
			<view class="description-section" v-if="expertInfo.remark">
				<!-- <view class="section-title">
					<text class="title-text">详细介绍</text>
				</view> -->
				<view class="description-content">
					<rich-text :nodes="expertInfo.remark"></rich-text>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions" v-if="expertInfo">
			<view class="appointment-container">
				<view class="appointment-btn" @click="makeAppointment">
					<text class="appointment-text">{{ getAppointmentText() }}</text>
				</view>
				<view class="appointment-tips">
					<text class="tip-text">1，因咨询量过大需成为平台会员后方可预约</text>
					<text class="tip-text">2，预约费用可抵扣中介费</text>
				</view>
			</view>
		</view>

		<!-- 加载中 -->
		<view class="loading" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 评论弹窗 -->
		<view class="comment-modal" v-if="showComments" @click="hideCommentModal">
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
									<image v-if="comment.vip && comment.vip > 0" class="width-70"
										:src="`/static/icon/vip${comment.vip}.jpg`" mode="widthFix"></image>
								</view>
								<view class="comment-time">{{comment.address}}
									{{formatTime(comment.create_time)}}
								</view>
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
				expertId: '',
				expertInfo: {
					img_url: [],
					comments: 0,
					favorites: 0,
					likenumber: 0,
					is_favorite: false,
					is_likenumber: false,
					remark: '',
					xuanfei_name: '',
					chakan: 0
				},
				loading: true,
				showComments: false,
				commentList: [],
				newComment: '',
				commentLoading: false
			}
		},
		onLoad(options) {
			if (options.id) {
				this.expertId = options.id;
				this.getExpertDetail();
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
			// 分享达人
			shareExpert() {
				uni.showActionSheet({
					itemList: ['分享到微信', '分享到朋友圈', '复制链接'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								// 分享到微信
								break;
							case 1:
								// 分享到朋友圈
								break;
							case 2:
								// 复制链接
								uni.setClipboardData({
									data: `达人详情：${this.expertInfo.xuanfei_name}`,
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
			// 获取达人详情
			getExpertDetail() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = {
					token: userInfo.token,
					id: this.expertId
				};

				getApp().getData('api/expert/detail', postData, function(res) {
					that.loading = false;
					if (res.code == 200) {
						that.expertInfo = res.data;
						// 增加观看次数
						that.expertInfo.chakan = (that.expertInfo.chakan || 0) + 1;
					} else {
						uni.showToast({
							title: res.msg || '获取详情失败',
							icon: 'none'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				});
			},
			// 预览图片
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.expertInfo.img_url
				});
			},
			// 切换点赞状态
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

				var postData = {
					token: userInfo.token,
					id: this.expertId
				};

				getApp().getData('api/likenumber/operate', postData, function(res) {
					if (res.code == 200) {
						that.expertInfo.is_likenumber = that.expertInfo.is_likenumber ? 0 : 1;
						that.expertInfo.likenumber += that.expertInfo.is_likenumber ? 1 : -1;
						uni.showToast({
							title: that.expertInfo.is_likenumber ? '点赞成功' : '取消点赞',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.msg || '操作失败',
							icon: 'none'
						});
					}
				});
			},
			// 切换关注状态
			toggleFollow() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = {
					token: userInfo.token,
					id: this.expertId
				};

				getApp().getData('api/expert/follow', postData, function(res) {
					if (res.code == 200) {
						that.expertInfo.is_follow = that.expertInfo.is_follow ? 0 : 1;
						uni.showToast({
							title: that.expertInfo.is_follow ? '关注成功' : '取消关注',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.msg || '操作失败',
							icon: 'none'
						});
					}
				});
			},
			// 预约
			makeAppointment() {
				// 检查登录状态
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				// 根据预约状态决定调用哪个接口
				const appointmentStatus = this.expertInfo.is_make_an_appointment;
				if (appointmentStatus === 0 || appointmentStatus === 2) {
					// 未预约或重新预约，需要先创建订单再支付
					this.createExpertOrder();
				} else if (appointmentStatus === 1) {
					// 已预约待付款，直接支付
					this.payExistingOrder();
				} else {
					// 默认情况，创建订单并支付
					this.createExpertOrder();
				}
			},

			// 支付已存在的订单（已预约待付款状态）
			payExistingOrder() {
				// 显示支付方式选择弹窗
				uni.showActionSheet({
					itemList: ['余额支付', '微信支付', '支付宝支付'],
					success: (res) => {
						const payTypes = [0, 1, 2]; // 对应余额、微信、支付宝
						const payType = payTypes[res.tapIndex];
						// 直接调用支付接口，使用专家ID作为订单ID
						this.performExpertPayment(this.expertId, payType);
					}
				});
			},

			// 创建专家预约订单
			createExpertOrder() {
				uni.showLoading({
					title: '创建订单中...'
				});

				const postData = {
					type: 'expert',
					info_id: this.expertId
				};

				getApp().getData('/api/order/create', postData, (res) => {
					uni.hideLoading();
					if (res.code === 200) {
						const orderId = res.data;
						// 创建订单成功，进行支付
						this.payExpertOrder(orderId);
					} else {
						uni.showToast({
							title: res.msg || '创建订单失败',
							icon: 'none'
						});
					}
				});
			},

			// 支付专家预约订单 - 显示支付方式选择
			payExpertOrder(orderId) {
				// 显示支付方式选择弹窗
				uni.showActionSheet({
					itemList: ['余额支付', '微信支付', '支付宝支付'],
					success: (res) => {
						const payTypes = [0, 1, 2]; // 对应余额、微信、支付宝
						const payType = payTypes[res.tapIndex];
						this.performExpertPayment(orderId, payType);
					}
				});
			},

			// 执行专家预约支付
			performExpertPayment(orderId, payType) {
				uni.showLoading({
					title: '处理支付中...'
				});

				const postData = {
					id: orderId,
					paytype: payType,
					type: 'expert'
				};

				getApp().getData('/api/order/pay', postData, (res) => {
					uni.hideLoading();
					if (res.code === 200) {
						if (payType === 0) {
							// 余额支付成功
							uni.showToast({
								title: '支付成功',
								icon: 'success',
								duration: 1000 // 默认是 1500ms，可以设置 1000ms（1秒）
							});
							// 1秒后刷新页面数据
							setTimeout(() => {
								this.getExpertDetail();
							}, 1000); // 1000ms = 1秒
						} else {
							// 第三方支付，处理支付结果
							this.handleExpertPaymentResult(res.data);
						}
					} else {
						uni.showToast({
							title: res.msg || '支付失败',
							icon: 'none'
						});
					}
				});
			},

			// 处理专家预约支付结果
			handleExpertPaymentResult(data) {
				// 微信支付
				if (data.payUrl) {
					// 跳转到支付页面
					uni.showModal({
						title: '支付提示',
						content: '请在新页面完成支付',
						showCancel: false,
						confirmText: '确定',
						success: function(res) {
							if (res.confirm) {
								// 打开支付网址
								// #ifdef H5
								window.open(data.payUrl, '_blank');
								// #endif
								// #ifdef APP-PLUS
								plus.runtime.openURL(data.payUrl);
								// #endif
								// #ifdef MP
								uni.setClipboardData({
									data: data.payUrl,
									success: function() {
										uni.showToast({
											title: '支付链接已复制到剪贴板',
											icon: 'none'
										});
									}
								});
								// #endif
							}
						}
					});
				}
			},
			// 获取预约按钮文本
			getAppointmentText() {
				if (!this.expertInfo) return '预约达人';

				switch (this.expertInfo.is_make_an_appointment) {
					case 0:
						return '预约达人';
					case 1:
						return '已预约，待付款';
					case 2:
						return '重新预约';
					default:
						return '预约达人';
				}
			},
			// 显示评论弹窗
			showCommentModal() {
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
				this.showComments = true;
				this.getCommentList();
			},
			// 隐藏评论弹窗
			hideCommentModal() {
				this.showComments = false;
				this.newComment = '';
			},
			// 获取评论列表
			getCommentList() {
				var that = this;
				var postData = {
					type: 1, // 达人类型
					info_id: this.expertId,
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
					type: 1, // 达人类型
					operate: 1, // 评论操作
					info_id: this.expertId,
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
						if (that.expertInfo.comments) {
							that.expertInfo.comments++;
						} else {
							that.expertInfo.comments = 1;
						}
						// 通知列表页面刷新
						uni.$emit('expertListRefresh');
					} else {
						uni.showToast({
							title: res.msg || '评论失败',
							icon: 'none'
						});
					}
				});
			},
			// 切换收藏状态
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

				// 判断当前是否已收藏
				const operate = that.expertInfo.is_favorite === 1 ? 2 : 1; // 1:收藏 2:取消收藏

				const postData = {
					type: 1, // 达人类型
					operate: operate, // 1:收藏 2:取消收藏
					info_id: this.expertId
				};

				getApp().getData('api/favorite/operate', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: operate === 1 ? '收藏成功' : '取消收藏',
							icon: 'success'
						});
						// 更新本地状态
						that.expertInfo.is_favorite = operate === 1 ? 1 : 0;
						// 更新收藏数
						that.expertInfo.favorites += operate === 1 ? 1 : -1;
						// 通知列表页面刷新
						uni.$emit('expertListRefresh');
					} else {
						uni.showToast({
							title: res.msg || '操作失败',
							icon: 'none'
						});
					}
				});
			},
			// 切换点赞状态
			toggleLike() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (!userInfo || !userInfo.token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				// 判断当前是否已点赞
				const operate = that.expertInfo.is_likenumber === 1 ? 2 : 1; // 1:点赞 2:取消点赞

				const postData = {
					type: 1, // 达人类型
					operate: operate, // 1:点赞 2:取消点赞
					info_id: this.expertId
				};

				getApp().getData('api/likenumber/operate', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: operate === 1 ? '点赞成功' : '取消点赞',
							icon: 'success'
						});
						// 更新本地状态
						that.expertInfo.is_likenumber = operate === 1 ? 1 : 0;
						// 更新点赞数
						that.expertInfo.likenumber += operate === 1 ? 1 : -1;
						// 通知列表页面刷新
						uni.$emit('expertListRefresh');
					} else {
						uni.showToast({
							title: res.msg || '操作失败',
							icon: 'none'
						});
					}
				});
			},
			// 格式化时间
			formatTime(timestamp) {
				const date = new Date(timestamp * 1000);
				const now = new Date();
				const diff = now - date;
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.expert-detail-page {
		height: 100%;
		background-color: #eee;
		position: relative;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
	}

	.header-left,
	.header-right {
		width: 80rpx;
		display: flex;
		align-items: center;
	}

	.back-icon,
	.share-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.header-title {
		font-size: 32rpx;
		color: #333;
	}

	.content {
		height: calc(100vh - 30rpx);
		margin-top: 40rpx;
		margin-bottom: 160rpx;
	}

	.expert-info-section {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.expert-header {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.expert-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		overflow: hidden;
		margin-right: 30rpx;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
	}

	.expert-basic {
		flex: 1;
	}

	.expert-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 15rpx;
	}

	.expert-location {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.location-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 10rpx;
	}

	.location-text {
		font-size: 26rpx;
		color: #666;
	}

	.expert-price {
		display: flex;
		align-items: center;
	}

	.price-label {
		font-size: 26rpx;
		color: #666;
	}

	.price-value {
		font-size: 32rpx;
		font-weight: bold;
		color: #ea2d38;
	}

	.stats-row {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
		border-top: 1rpx solid #eee;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-number {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: #999;
	}

	.personal-info-section,
	.video-section,
	.gallery-section,
	.description-section {
		margin-bottom: 20rpx;
	}

	.gallery-swiper {
		height: 750rpx;
		width: 100%;
		overflow: hidden;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
	}

	.section-title {
		margin-bottom: 20rpx;
	}

	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.info-grid {
		display: flex;
		flex-wrap: wrap;
	}

	.info-item {
		width: 50%;
		display: flex;
		margin-bottom: 20rpx;
	}

	.info-label {
		font-size: 28rpx;
		color: #666;
		width: 120rpx;
	}

	.info-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}

	.video-container {
		width: 100%;
		height: 400rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.intro-video {
		width: 100%;
		height: 100%;
	}

	.gallery-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.gallery-item {
		width: 32%;
		height: 200rpx;
		margin-bottom: 10rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.gallery-image {
		width: 100%;
		height: 100%;
	}

	.description-content {
		font-size: 28rpx;
		line-height: 1.6;
		padding:0 20rpx;
		color: #333;
	}

	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 250rpx;
		background-color: #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		z-index: 100;
	}

	.appointment-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.appointment-btn {
		width: 690rpx;
		height: 110rpx;
		background: linear-gradient(to bottom, #fd2f3e, #fc106f);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 15rpx;
	}

	.appointment-tips {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.tip-text {
		font-size: 24rpx;
		color: #fb2c2c;
		font-weight: bold;
	}

	.appointment-text {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
	}

	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.loading-text {
		font-size: 28rpx;
		color: #999;
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

	/* 互动按钮样式 */
	.interaction-buttons {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 20rpx;
		gap: 30rpx;
	}

	.interaction-btn {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-radius: 10rpx;
		min-width: 80rpx;
	}

	.icon-60 {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 8rpx;
	}

	.btn-text {
		font-size: 22rpx;
		color: #333;
		margin-bottom: 4rpx;
	}

	.btn-count {
		color: #666;
	}
</style>