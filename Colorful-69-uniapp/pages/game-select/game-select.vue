<template>
	<view class="game-select-page">
		<!-- 自定义头部 -->
		<view class="custom-header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">{{ type === 'withdraw' ? '选择游戏提现' : '选择游戏转账' }}</text>
			<view class="placeholder"></view>
		</view>
		
		<!-- 游戏内容区域 -->
		<view class="game-content">
			<!-- 左侧分类菜单 -->
			<view class="category-menu">
				<view 
					v-for="(category, index) in gameCategories" 
					:key="category.id" 
					:class="['category-item', { 'active': selectedCategoryId === category.id }]"
					@click="selectCategory(category.id, index)"
				>
					<image class="category-icon" :src="category.icon" mode="aspectFit"></image>
					<text class="category-name">{{ category.name }}</text>
				</view>
			</view>
			
			<!-- 右侧游戏列表 -->
			<view class="game-list">
				<!-- 真人游戏（id为2时一行显示两个） -->
				<view v-if="isRealPersonGame" class="real-person-grid">
					<view 
						v-for="game in currentGames" 
						:key="game.id" 
						class="real-person-item"
						@click="goToGameRecharge(game)"
					>
						<image class="real-person-img" :src="game.img" mode="widthFix"></image>
					</view>
				</view>
				
				<!-- 普通游戏网格 -->
				<view v-else class="game-grid">
					<view 
						v-for="game in currentGames" 
						:key="game.id" 
						class="game-item"
						@click="goToGameRecharge(game)"
					>
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
	</view>
</template>

<script>
	export default {
		data() {
				return {
					type: 'recharge', // 页面类型：recharge转账，withdraw提现
					loading: false,
					userInfo: null,
					gameCategories: [],
					selectedCategoryIndex: 0,
					selectedCategoryId: null
				};
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

		onLoad(options) {
			this.type = options.type || 'recharge'; // 默认为转账，可以是withdraw提现
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
				this.getGameList();
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
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
			
			// 跳转到游戏充值或提现页面
			goToGameRecharge(game) {
				if (this.type === 'withdraw') {
					// 跳转到提现页面
					uni.navigateTo({
						url: `/pages/game-withdraw/game-withdraw?gameId=${game.id}&gameName=${encodeURIComponent(game.name)}&gameImg=${encodeURIComponent(game.img)}`
					});
				} else {
					// 跳转到充值页面
					uni.navigateTo({
						url: `/pages/game-recharge/game-recharge?gameId=${game.id}&gameName=${encodeURIComponent(game.name)}&gameImg=${encodeURIComponent(game.img)}`
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 页面容器 */
	.game-select-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f8f9fa;
	}

	/* 自定义头部 */
	.custom-header {
		background-color: #fff;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		z-index: 100;
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
		font-weight: 600;
		color: #333;
	}

	.placeholder {
		width: 40rpx;
		height: 40rpx;
	}

	// 游戏内容区域
	.game-content {
		flex: 1;
		display: flex;
		background-color: #fff;
		margin:20rpx;
		border-radius: 20rpx;
		overflow: hidden;
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
		padding: 0 0 0 15rpx;
		padding-bottom: 120rpx; // 增加底部间距避免被底部导航栏遮挡
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
		width: 48%;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: auto;
		border-radius: 30rpx;
		background-color: #fff;
		cursor: pointer;
		transition: all 0.3s;
	}

	.real-person-item:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.real-person-img {
		width: 100%;
		height: 100%;
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
		border-radius: 30rpx;
		background-color: #fff;
		cursor: pointer;
		transition: all 0.3s;
		width: 100%;
		
	}

	.game-item:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.game-img {
		width: 100%;
		height: auto;
		border-radius: 15rpx;
		margin-right: 25rpx;
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
			margin-right: 20rpx;
		}
		
		.game-name {
			font-size: 28rpx;
		}
	}
</style>