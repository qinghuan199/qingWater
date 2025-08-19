<template>
	<view class="game-page">
		<!-- 顶部信息区域 -->
		<view class="game-header">
			<!-- 轮播图 -->
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(banner, index) in bannerList" :key="index">
					<image class="banner-img" :src="banner" mode="aspectFill"></image>
				</swiper-item>
			</swiper>

			<!-- 公告 -->
			<view class="notice-container" v-if="notice">
				<u-notice-bar :text="notice" color="#000" bgColor="#eee"></u-notice-bar>
			</view>

			<!-- 功能按钮区域 -->
			<view class="function-buttons">
				<view class="function-btn" @click="goTransfer">
					<image class="btn-icon" src="../../static/home/ic_game_transfer.png" mode="aspectFit"></image>
					<text class="btn-text">转账</text>
				</view>
				<view class="function-btn" @click="goWithdraw">
					<image class="btn-icon" src="../../static/home/ic_game_withdraw.png" mode="aspectFit"></image>
					<text class="btn-text">提现</text>
				</view>
				<view class="function-btn" @click="goCustomerService">
					<image class="btn-icon" src="../../static/home/ic_game_service.png" mode="aspectFit"></image>
					<text class="btn-text">客服</text>
				</view>
			</view>
		</view>

		<!-- 游戏内容区域 -->
		<view class="game-content">
			<!-- 左侧分类菜单 -->
			<view class="category-menu">
				<view v-for="(category, index) in gameCategories" :key="category.id"
					:class="['category-item', { 'active': selectedCategoryId === category.id }]"
					@click="selectCategory(category.id, index)">
					<image class="category-icon" :src="category.icon" mode="aspectFit"></image>
					<text class="category-name">{{ category.name }}</text>
				</view>
			</view>

			<!-- 右侧游戏列表 -->
			<view class="game-list">
				<!-- 真人游戏（id为2时一行显示两个） -->
				<view v-if="isRealPersonGame" class="real-person-grid">
					<view v-for="game in currentGames" :key="game.id" class="real-person-item" @click="enterGame(game)">
						<image class="real-person-img" :src="game.img" mode="aspectFill"></image>
						<text class="real-person-name">{{ game.name }}</text>
					</view>
				</view>

				<!-- 普通游戏网格 -->
				<view v-else class="game-grid">
					<view v-for="game in currentGames" :key="game.id" class="game-item" @click="enterGame(game)">
						<image class="game-img" :src="game.img" mode="widthFix"></image>
					</view>
				</view>

				<!-- 暂无游戏提示 -->
				<view v-if="currentGames.length === 0" class="no-games">
					<text class="no-games-text">暂无游戏</text>
				</view>
			</view>
		</view>
		<!-- 加载提示 -->
		<view v-if="loading" class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>
		<userNav  :title='0' />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				bannerList: [],
				notice: '',
				gameCategories: [],
				selectedCategoryIndex: 0,
				selectedCategoryId: null,
				userInfo: null,
				basicInfo: {}
			}
		},
		computed: {
			// 当前选中分类的游戏列表
			currentGames() {
				if (this.gameCategories.length > 0 && this.selectedCategoryIndex < this.gameCategories.length) {
					return this.gameCategories[this.selectedCategoryIndex].games || [];
				}
				return [];
			},
			// 判断是否为真人游戏（id为2）
			isRealPersonGame() {
				if (this.gameCategories.length > 0 && this.selectedCategoryIndex < this.gameCategories.length) {
					return this.gameCategories[this.selectedCategoryIndex].id === 2;
				}
				return false;
			}
		},
		onLoad() {
			this.userInfo = getApp().getCache('userInfo');
			this.initData();
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
			}
		},
		methods: {
			// 初始化数据
			initData() {
				this.getGameInfo();
				this.getGameList();
				this.getBasicInfo();
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

			// 获取游戏顶部信息
			getGameInfo() {
				var that = this;
				var postData = {
					token: that.userInfo.token
				};
				getApp().getData('api/game/info', postData, function(res) {
					if (res.code === 200) {
						// 设置轮播图，如果没有则使用默认图片
						if (res.data.banner_img && res.data.banner_img.length > 0) {
							that.bannerList = res.data.banner_img;
						} else {
							that.bannerList = ['/static/03.png'];
						}

						// 设置公告，过滤HTML标签
					let noticeText = res.data.notice || '';
					// 移除HTML标签
					noticeText = noticeText.replace(/<[^>]*>/g, '');
					that.notice = noticeText;
					} else {
						// 使用默认图片
						that.bannerList = ['/static/03.png'];
						console.error('获取游戏信息失败:', res.msg);
					}
				}, function(error) {
					// 网络错误时使用默认图片
					that.bannerList = ['/static/03.png'];
					console.error('获取游戏信息网络错误:', error);
				});
			},

			// 获取游戏列表
			getGameList() {
				var that = this;
				that.loading = true;

				var postData = {
					token: that.userInfo.token
				};

				getApp().getData('api/game/list', postData, function(res) {
					that.loading = false;
					if (res.code === 200) {
						that.gameCategories = res.data || [];
						// 默认选中第一个分类
						if (that.gameCategories.length > 0) {
							that.selectedCategoryIndex = 0;
							that.selectedCategoryId = that.gameCategories[0].id;
						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg || '获取游戏列表失败',
							showCancel: false
						});
					}
				}, function(error) {
					that.loading = false;
					uni.showModal({
						title: '提示',
						content: '网络错误，请稍后重试',
						showCancel: false
					});
					console.error('获取游戏列表网络错误:', error);
				});
			},

			// 选择分类
			selectCategory(categoryId, index) {
				this.selectedCategoryId = categoryId;
				this.selectedCategoryIndex = index;
			},

			// 进入游戏
			enterGame(game) {
				var that = this;

				uni.showLoading({
					title: '正在进入游戏...'
				});

				var postData = {
					token: that.userInfo.token,
					id: game.id
				};

				getApp().getData('api/game/login', postData, function(res) {
					uni.hideLoading();
					if (res.code === 200 && res.data.url) {
						// 跳转到游戏页面
						// #ifdef H5
						window.open(res.data.url, '_blank');
						// #endif

						// #ifdef APP-PLUS
						plus.runtime.openURL(res.data.url);
						// #endif

						// #ifdef MP
						uni.showModal({
							title: '提示',
							content: '请在浏览器中打开游戏链接',
							showCancel: false
						});
						// #endif
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg || '进入游戏失败',
							showCancel: false
						});
					}
				}, function(error) {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: '网络错误，请稍后重试',
						showCancel: false
					});
					console.error('进入游戏网络错误:', error);
				});
			},

			// 转账
			goTransfer() {
				uni.navigateTo({
					url: '/pages/game-select/game-select'
				});
			},

			// 提现
			goWithdraw() {
				uni.navigateTo({
					url: '/pages/game-select/game-select?type=withdraw'
				});
			},

			// 客服
			goCustomerService() {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.game-page {
		background-color: #fafafa;
		min-height: 100vh;
	}

	// 顶部信息区域
	.game-header {
		background-color: #fafafa;
		margin-bottom: 20rpx;
	}

	// 轮播图
	.banner-swiper {
		height: 300rpx; /* 手机端默认高度 */
		width: 100%;
	}

	.banner-img {
		width: 100%;
		height: 100%;
	}

	/* 电脑端适配 */
	@media screen and (min-width: 768px) {
		.banner-swiper {
			height: 400rpx;
		}
	}

	// 公告
	.notice-container {
		padding: 20rpx;
		background-color: #eee;
		border-radius: 20rpx;
		margin:10rpx 20rpx;

		border-top: 1rpx solid #f0f0f0;
	}

	// 功能按钮区域
	.function-buttons {
		display: flex;
		justify-content: space-around;
		padding: 30rpx 20rpx;
	}

	.function-btn {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 30rpx 20rpx;
		border-radius: 15rpx;
		background-color: #eee;
		transition: all 0.3s;
		min-width: 230rpx;
	}

	.function-btn:active {
		background-color: #e9ecef;
		transform: scale(0.95);
	}

	.btn-icon {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 10rpx;
	}

	.btn-text {
		font-size: 32rpx;
		color: #000;
	}

	// 游戏内容区域
	.game-content {
		flex: 1;
		display: flex;
		background-color: #fff;
		margin: 0 20rpx;
		border-radius: 20rpx;
	}

	// 左侧分类菜单
	.category-menu {
		width: 200rpx;
		background-color: #f8f9fa;
		border-right: 1rpx solid #e9ecef;
	}

	.category-item {
		padding: 30rpx 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		// border-bottom: 1rpx solid #e9ecef;
		cursor: pointer;
		border-radius: 15rpx;
		margin-bottom: 10rpx;
		transition: all 0.3s;
		background-image: url('/static/home/ic_game_class_normal.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.category-item.active {
		background-image: url('/static/home/ic_game_class_select.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		// border-right: 4rpx solid #007bff;
	}

	.category-item:hover {
		background-color: #e9ecef;
	}

	.category-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}

	.category-name {
		font-size: 28rpx;
		color: #000;
		text-align: center;
	}

	.category-item.active .category-name {
		color: #fff;
		font-weight: 500;
	}

	// 右侧游戏列表
	.game-list {
		flex: 1;
		padding:0 0 0 15rpx;
		overflow-y: auto;
		background-color: #f9f9f9;
	}

	.game-grid {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	// 真人游戏网格（一行显示两个）
	.real-person-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		justify-content: space-between;
	}

	.real-person-item {
		width: calc(50% - 10rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx;
		border-radius: 15rpx;
		background-color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.3s;
	}

	.real-person-item:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.real-person-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 15rpx;
		margin-bottom: 15rpx;
	}

	.real-person-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		text-align: center;
	}

	.game-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #fff;
		cursor: pointer;
		border-radius: 30rpx;
		transition: all 0.3s;
		width: 100%;
	}

	.game-item:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.game-img {
		width: 100%;
		height: 100%;
		flex-shrink: 0;
	}

	.game-name {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
		flex: 1;
	}

	// 暂无游戏提示
	.no-games {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.no-games-text {
		font-size: 28rpx;
		color: #999;
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

	// 响应式设计
	@media screen and (max-width: 750rpx) {
		.category-menu {
			width: 160rpx;
		}

		.category-icon {
			width: 50rpx;
			height: 50rpx;
		}

		.category-name {
			font-size: 22rpx;
		}

		.game-item {
			padding: 20rpx;
		}

		.game-img {
			width: 100rpx;
			height: 100rpx;
		}

		.game-name {
			font-size: 28rpx;
		}

		.function-buttons {
			padding: 25rpx 15rpx;
		}

		.function-btn {
			padding: 15rpx;
			min-width: 100rpx;
		}

		.btn-icon {
			width: 45rpx;
			height: 45rpx;
		}

		.btn-text {
			font-size: 22rpx;
		}
	}
</style>