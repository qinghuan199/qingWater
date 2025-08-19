<template>
	<view class="my-page">
		<!-- 顶部用户信息区域 -->
		<view class="user-header" @click="goToSettings">
			<view class="user-info">
				<image class="width-150 height-150 radius-full " :src="userInfo.header_img" mode="aspectFill"></image>
				<text class="username">{{ userInfo.name || '未设置昵称' }}</text>
				<image v-if="userInfo.vip && userInfo.vip > 0" class="vip-icon"
					:src="`/static/icon/vip${userInfo.vip}.jpg`" mode="aspectFit"></image>
			</view>
			<view class="settings-btn">
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 统计数据区域 -->
		<view class="stats-container">
			<view class="stats-item" @click="goToFollows">
				<text class="stats-number">{{ userInfo.follows_num || 0 }}</text>
				<text class="stats-label">我的关注</text>
			</view>
			<view class="stats-item" @click="goToCollections">
				<text class="stats-number">{{ getTotalCollections() }}</text>
				<text class="stats-label">我的收藏</text>
			</view>
			<view class="stats-item" @click="goToLikes">
				<text class="stats-number">{{ getTotalLikes() }}</text>
				<text class="stats-label">我的点赞</text>
			</view>
			<view class="stats-item" @click="goToFans">
				<text class="stats-number">{{ userInfo.fans_num || 0 }}</text>
				<text class="stats-label">我的粉丝</text>
			</view>
		</view>

		<!-- 功能导航区域 -->
		<view class="nav-container">
			<view class="nav-item" @click="goToVip">
				<image class="nav-icon" src="/static/home/ic_mine_member_center.png" mode="aspectFit"></image>
				<text class="nav-text">会员中心</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToOriginalVideo">
				<image class="nav-icon" src="/static/home/ic_mine_original_video.png" mode="aspectFit"></image>
				<text class="nav-text">原创视频</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToMyTeaposts">
				<image class="nav-icon" src="/static/home/ic_mine_order.png" mode="aspectFit"></image>
				<text class="nav-text">我的茶贴</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToOrders">
				<image class="nav-icon" src="/static/home/ic_mine_order.png" mode="aspectFit"></image>
				<text class="nav-text">我的订单</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToEarnings">
				<image class="nav-icon" src="/static/home/ic_mine_income_details.png" mode="aspectFit"></image>
				<text class="nav-text">收益明细</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToPromotion">
				<image class="nav-icon" src="/static/home/ic_mine_promotion_incentives.png" mode="aspectFit"></image>
				<text class="nav-text">推广激励</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToCustomerService">
				<image class="nav-icon" src="/static/home/ic_mine_customer_service.png" mode="aspectFit"></image>
				<text class="nav-text">专属客服</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
			<view class="nav-item" @click="goToSystemSettings">
				<image class="nav-icon" src="/static/home/ic_mine_system_settings.png" mode="aspectFit"></image>
				<text class="nav-text">系统设置</text>
				<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<!-- <view class="logout-container">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view> -->
		<userNav :title='4' />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				basicInfo: {}
			}
		},
		onLoad() {
			this.getBasicInfo();
		},
		onShow() {
			// 检查登录状态
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
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
			} else {
				this.getUserInfo();
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					this.clearUserData();
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
							this.userInfo = res.data.data;
						} else if (res.data.code === 401) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							this.clearUserData();
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

			// 获取基础信息
			getBasicInfo() {
				uni.request({
					url: getApp().globalData.baseUrl + 'api/basicinfo',
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.basicInfo = res.data.data;
						} else {
							console.error('获取基础信息失败:', res.data.msg);
						}
					},
					fail: (err) => {
						console.error('获取基础信息网络错误:', err);
					}
				});
			},

			// 计算总收藏数
			getTotalCollections() {
				const expert = this.userInfo.expert_collections_num || 0;
				const memberVideo = this.userInfo.member_video_collection_num || 0;
				const video = this.userInfo.video_collection_num || 0;
				return expert + memberVideo + video;
			},

			// 计算总点赞数
			getTotalLikes() {
				const expert = this.userInfo.expert_likes_num || 0;
				const memberVideo = this.userInfo.member_video_likes_num || 0;
				const video = this.userInfo.video_likes_num || 0;
				return expert + memberVideo + video;
			},

			// 跳转到设置页面
			goToSettings() {
				uni.navigateTo({
					url: '/pages/settings/settings'
				});
			},

			// 跳转到关注列表
			goToFollows() {
				uni.navigateTo({
					url: '/pages/follows/follows'
				});
			},

			// 跳转到收藏列表
			goToCollections() {
				uni.navigateTo({
					url: '/pages/collections/collections'
				});
			},

			// 跳转到点赞列表
			goToLikes() {
				uni.navigateTo({
					url: '/pages/likes/likes'
				});
			},

			// 跳转到粉丝列表
			goToFans() {
				uni.navigateTo({
					url: '/pages/fans/fans'
				});
			},

			// 跳转到会员中心
			goToVip() {
				uni.navigateTo({
					url: '/pages/vip/vip'
				});
			},

			// 开通会员
			openVip() {
				uni.navigateTo({
					url: '/pages/recharge/recharge'
				});
			},

			// 跳转到原创视频
			goToOriginalVideo() {
				uni.navigateTo({
					url: '/pages/original-videos/original-videos'
				});
			},

			// 跳转到我的茶贴
			goToMyTeaposts() {
				uni.navigateTo({
					url: '/pages/my-teaposts/my-teaposts'
				});
			},

			// 跳转到我的订单
			goToOrders() {
				uni.navigateTo({
					url: '/pages/order/order'
				});
			},

			// 跳转到收益明细
			goToEarnings() {
				uni.navigateTo({
					url: '/pages/earnings/earnings'
				});
			},

			// 跳转到推广激励
			goToPromotion() {
				uni.navigateTo({
					url: '/pages/promotion/promotion'
				});
			},

			// 跳转到专属客服
			goToCustomerService() {
				if (this.basicInfo.kefu) {
					const kefuUrl = this.basicInfo.kefu.trim();

					// 外部链接
					if (kefuUrl.startsWith('http://') || kefuUrl.startsWith('https://')) {
						// #ifdef APP-PLUS
						plus.runtime.openURL(kefuUrl);
						// #endif

						// #ifdef H5
						window.open(kefuUrl, '_blank');
						// #endif

						// #ifdef MP
						uni.showToast({
							title: '请在浏览器中打开',
							icon: 'none'
						});
						// #endif
					} else {
						// 内部页面跳转
						uni.navigateTo({
							url: kefuUrl
						});
					}
				} else {
					// 未开启客服
					uni.showToast({
						title: '暂无客服',
						icon: 'none'
					});
				}
			},

			// 跳转到系统设置
			goToSystemSettings() {
				uni.navigateTo({
					url: '/pages/settings/settings'
				});
			},

			// 退出登录
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							this.performLogout();
						}
					}
				});
			},

			// 执行退出登录
			performLogout() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					this.clearUserData();
					return;
				}

				uni.request({
					url: getApp().globalData.baseUrl + 'api/logout',
					method: 'POST',
					header: {
						'token': token
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '退出成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data.msg || '退出失败',
								icon: 'none'
							});
						}
						this.clearUserData();
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
						this.clearUserData();
					}
				});
			},

			// 清除用户数据
			clearUserData() {
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('isLogin');
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style scoped>
	.my-page {
		background-color: #fff;
		min-height: 100vh;
		padding: 20rpx;
	}

	/* 顶部用户信息区域 */
	.user-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.user-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
	}

	.username {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.vip-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 8rpx;
	}

	.vip-info {
		display: flex;
		flex-direction: column;
		gap: 5rpx;
	}



	.settings-btn {
		padding: 10rpx;
	}

	.arrow-icon {
		width: 35rpx;
		height: 35rpx;
	}

	/* 统计数据区域 */
	.stats-container {
		display: flex;
		background-color: #e84840;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.stats-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
		border-radius: 16rpx;
		transition: background-color 0.3s;
	}

	.stats-item:active {
		background-color: #f0f0f0;
	}

	.stats-number {
		font-size: 46rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 10rpx;
	}

	.stats-label {
		font-size: 24rpx;
		color: #fff;
	}

	/* 功能导航区域 */
	.nav-container {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.nav-item {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
		transition: background-color 0.3s;
	}

	.nav-item:last-child {
		border-bottom: none;
	}

	.nav-item:active {
		background-color: #f8f8f8;
	}

	.nav-icon {
		width: 52rpx;
		height: 46rpx;
		margin-right: 40rpx;
	}

	.nav-text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	/* 退出登录按钮 */
	.logout-container {
		padding: 20rpx 0;
	}

	.logout-btn {
		width: 100%;
		height: 100rpx;
		background: linear-gradient(to bottom, #fc303d 0%, #fc1074 100%);
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		border-radius: 20rpx;
		border: none;
		line-height: 100rpx;
		transition: background-color 0.3s;
	}

	.logout-btn:active {
		background-color: #ff3742;
	}
</style>