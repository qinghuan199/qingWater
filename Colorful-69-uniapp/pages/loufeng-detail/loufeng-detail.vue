<template>
	<view class="loufeng-detail-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<view class="header-title">{{loufengInfo.title}}</view>
			<view class="header-right">
				<!-- <view class="share-btn" @click="shareLoufeng">
					<image class="share-icon" src="../../static/icon/share.png" mode="widthFix"></image>
				</view> -->
			</view>
		</view>
		<!-- 相册轮播图 -->
		<view class="gallery-section" v-if="loufengInfo.img_url && loufengInfo.img_url.length > 0">
		<!-- 	<view class="section-title">
				<text class="title-text">相册 ({{loufengInfo.img_url.length}})</text>
			</view> -->
			<view class="gallery-container">
				<swiper class="gallery-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
					<swiper-item v-for="(image, index) in loufengInfo.img_url" :key="index">
						<image class="swiper-image" :src="image" mode="aspectFill" @click="previewImage(index)"></image>
					</swiper-item>
				</swiper>

				<!-- 互动按钮 -->
				<view class="interaction-buttons">
					<view class="interaction-btn" @click="showCommentModal">
						<image class="icon-40" src="../../static/home/ic_comment.png" mode="aspectFill"></image>
						<text class="btn-count">{{loufengInfo.comments || 0}}</text>
					</view>
					<view class="interaction-btn" @click="toggleFavorite">
						<image class="icon-40"
							:src="loufengInfo.is_favorite ? '../../static/home/ic_video_collect_select.png' : '../../static/home/ic_video_collect_normal.png'"
							mode="aspectFill"></image>
						<text class="btn-count">{{loufengInfo.favorites || 0}}</text>
					</view>
					<view class="interaction-btn" @click="toggleLike">
						<image class="icon-40"
							:src="loufengInfo.is_likenumber ? '../../static/home/ic_like_select.png' : '../../static/home/ic_like_normal.png'"
							mode="aspectFill"></image>
						<text class="btn-count">{{loufengInfo.likenumber || 0}}</text>
					</view>
				</view>
			</view>
		</view>

		<scroll-view class="content" scroll-y="true" v-if="loufengInfo">
			<!-- 详细信息 -->
			<view class="info-section">
				<view class="info-item">
					<text class="info-label">年龄：</text>
					<text class="info-value">{{loufengInfo.age}}岁</text>
				</view>
				<view class="info-item">
					<text class="info-label">类型：</text>
					<text class="info-value">{{loufengInfo.type}}</text>
				</view>
				<view class="info-item">
					<text class="info-label">服务项目：</text>
					<text class="info-value">{{loufengInfo.service_project}}</text>
				</view>
				<view class="info-item">
					<text class="info-label">消费情况：</text>
					<text class="info-value">{{loufengInfo.consumption_situation}}</text>
				</view>
				<view class="info-item">
					<text class="info-label">是否包赔：</text>
					<text class="info-value">{{loufengInfo.is_gpc ? '是' : '否'}}</text>
				</view>
			</view>
			<!-- 详细介绍 -->
			<view class="description-section" v-if="loufengInfo.description">
				<!-- <view class="section-title">
					<text class="title-text">详细介绍</text>
				</view> -->
				<view class="description-content">
					<rich-text :nodes="loufengInfo.description"></rich-text>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions" v-if="loufengInfo">
			<view class="appointment-container">
		<!-- 		<view class="appointment-btn" @click="makeAppointment">
					<text class="appointment-text">预约茶贴</text>
				</view> -->
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
				loufengId: '',
				loufengInfo: {
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
				this.loufengId = options.id;
				this.getLoufengDetail();
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
			// 分享茶贴
			shareLoufeng() {
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
									data: `茶贴详情：${this.loufengInfo.xuanfei_name}`,
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
			// 获取茶贴详情
			getLoufengDetail() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = {
					token: userInfo.token,
					id: this.loufengId
				};

				getApp().getData('api/loufeng/data/detail', postData, function(res) {
					that.loading = false;
					if (res.code == 200) {
						that.loufengInfo = res.data;
						// 处理图片数组
						if (that.loufengInfo.image && Array.isArray(that.loufengInfo.image)) {
							that.loufengInfo.img_url = that.loufengInfo.image;
						}
						// 处理详细描述
						if (that.loufengInfo.description) {
							that.loufengInfo.remark = that.loufengInfo.description;
						}
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
					urls: this.loufengInfo.img_url
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
					id: this.loufengId
				};

				getApp().getData('api/likenumber/operate', postData, function(res) {
					if (res.code == 200) {
						that.loufengInfo.is_likenumber = that.loufengInfo.is_likenumber ? 0 : 1;
						that.loufengInfo.likenumber += that.loufengInfo.is_likenumber ? 1 : -1;
						uni.showToast({
							title: that.loufengInfo.is_likenumber ? '点赞成功' : '取消点赞',
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
				const operate = that.loufengInfo.is_favorite === 1 ? 2 : 1; // 1:收藏 2:取消收藏

				const postData = {
					type: 4, // 茶贴类型
					operate: operate, // 1:收藏 2:取消收藏
					info_id: this.loufengId
				};

				getApp().getData('api/favorite/operate', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: operate === 1 ? '收藏成功' : '取消收藏',
							icon: 'success'
						});
						// 更新本地状态
						that.loufengInfo.is_favorite = operate === 1 ? 1 : 0;
						// 更新收藏数
						that.loufengInfo.favorites += operate === 1 ? 1 : -1;
						// 通知列表页面刷新
						uni.$emit('loufengListRefresh');
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
				const operate = that.loufengInfo.is_likenumber === 1 ? 2 : 1; // 1:点赞 2:取消点赞

				const postData = {
					type: 4, // 茶贴类型
					operate: operate, // 1:点赞 2:取消点赞
					info_id: this.loufengId
				};

				getApp().getData('api/likenumber/operate', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: operate === 1 ? '点赞成功' : '取消点赞',
							icon: 'success'
						});
						// 更新本地状态
						that.loufengInfo.is_likenumber = operate === 1 ? 1 : 0;
						// 更新点赞数
						that.loufengInfo.likenumber += operate === 1 ? 1 : -1;
						// 通知列表页面刷新
						uni.$emit('loufengListRefresh');
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

				// 直接创建订单并支付
				this.createLoufengOrder();
			},

			// 创建茶贴预约订单
			createLoufengOrder() {
				uni.showLoading({
					title: '创建订单中...'
				});

				const postData = {
					type: 'loufeng_auth',
					info_id: this.loufengId
				};

				getApp().getData('/api/order/create', postData, (res) => {
					uni.hideLoading();
					if (res.code === 200) {
						const orderId = res.data;
						// 创建订单成功，进行支付
						this.payLoufengOrder(orderId);
					} else {
						uni.showToast({
							title: res.msg || '创建订单失败',
							icon: 'none'
						});
					}
				});
			},

			// 支付茶贴预约订单 - 显示支付方式选择
			payLoufengOrder(orderId) {
				// 显示支付方式选择弹窗
				uni.showActionSheet({
					itemList: ['余额支付', '微信支付', '支付宝支付'],
					success: (res) => {
						const payTypes = [0, 1, 2]; // 对应余额、微信、支付宝
						const payType = payTypes[res.tapIndex];
						this.performLoufengPayment(orderId, payType);
					}
				});
			},

			// 执行茶贴预约支付
			performLoufengPayment(orderId, payType) {
				uni.showLoading({
					title: '处理支付中...'
				});

				const postData = {
					id: orderId,
					paytype: payType,
					type: 'loufeng_auth'
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
								this.getLoufengDetail();
							}, 1000); // 1000ms = 1秒
						} else {
							// 第三方支付，处理支付结果
							this.handleLoufengPaymentResult(res.data);
						}
					} else {
						uni.showToast({
							title: res.msg || '支付失败',
							icon: 'none'
						});
					}
				});
			},

			// 处理茶贴预约支付结果
			handleLoufengPaymentResult(data) {
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
				if (!this.loufengInfo) return '预约';

				switch (this.loufengInfo.is_make_an_appointment) {
					case 0:
						return '立即预约';
					case 1:
						return '去支付';
					case 2:
						return '重新预约';
					default:
						return '预约';
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
				if (this.commentLoading) return;

				this.commentLoading = true;
				var userInfo = getApp().getCache('userInfo');
				var postData = {
					token: userInfo.token,
					type: 4, // 茶贴类型
					info_id: this.loufengId,
					page: 1,
					limit: 50
				};

				var that = this;
				getApp().getData('api/comments/info', postData, function(res) {
					that.commentLoading = false;
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
					type: 4, // 茶贴类型
					operate: 1, // 评论操作
					info_id: this.loufengId,
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
						if (that.loufengInfo.comments) {
							that.loufengInfo.comments++;
						} else {
							that.loufengInfo.comments = 1;
						}
						// 通知列表页面刷新
						uni.$emit('loufengListRefresh');
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
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
			}
		}
	}
</script>

<style scoped>
	.loufeng-detail-page {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 200rpx;
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

	.header-left {
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

	.header-right {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.share-btn {
		width: 40rpx;
		height: 40rpx;
	}

	.share-icon {
		width: 100%;
		height: 100%;
	}

	.gallery-section {
		margin-bottom: 20rpx;
	}

	.section-title {
		margin-bottom: 20rpx;
	}

	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
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

	.icon-40 {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 8rpx;
	}

	.btn-count {
		color: #666;
	}

	.content {
		flex: 1;
		padding: 0 30rpx 100rpx;
	}

	.info-section {
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.info-label {
		font-size: 28rpx;
		color: #666;
		width: 160rpx;
		flex-shrink: 0;
	}

	.info-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}

	.description-section {
		margin-bottom: 20rpx;
	}

	.description-content {
		font-size: 28rpx;
		line-height: 1.6;
		color: #333;
	}

	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #f5f5f5;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	}

	.appointment-container {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
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
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200rpx;
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
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
		display: flex;
		align-items: flex-end;
	}

	.comment-content {
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
		width: 100%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.comment-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.close-btn {
		width: 40rpx;
		height: 40rpx;
	}

	.comment-list {
		flex: 1;
		padding: 0 30rpx;
		max-height: 50vh;
	}

	.comment-item {
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.comment-user {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.avatar-container {
		margin-right: 20rpx;
	}

	.user-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}

	.user-info {
		flex: 1;
	}

	.u-flex {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.user-name {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.width-70 {
		width: 70rpx;
		height: auto;
	}

	.comment-time {
		font-size: 24rpx;
		color: #999;
		margin-top: 5rpx;
	}

	.comment-content-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.empty-comments {
		padding: 100rpx 0;
		text-align: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.comment-input-area {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-top: 1rpx solid #eee;
		gap: 20rpx;
	}

	.comment-input {
		flex: 1;
		background-color: #f5f5f5;
		border-radius: 25rpx;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		border: none;
		outline: none;
	}

	.submit-btn {
		background-color: #ff4757;
		padding: 20rpx 30rpx;
		border-radius: 35rpx;
	}

	.submit-text {
		color: #fff;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>