<template>
	<view class="game-recharge-page">
		<!-- 自定义头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">游戏提现</text>
			<view class="placeholder"></view>
		</view>


		<!-- 充值表单 -->
		<view class="recharge-form">
			<!-- 提现金额输入 -->
			<view class="amount-input-section">
				<text class="input-label">提现金额</text>
				<view class="input-container">
					<text class="currency-symbol">¥</text>
					<input 
						class="amount-input" 
						v-model="withdrawAmount" 
						type="digit" 
						placeholder="请输入提现金额"
						@input="onAmountInput"
					/>
				</view>
			<view class="u-flex u-flex-between">
				<view class="balance-info">
					<text class="balance-label">游戏余额：</text>
					<text class="balance-amount">{{ gameBalance || '0.00' }}</text>
				</view>
				<!-- 最大金额按钮 -->
				<view class="max-amount-btn" @click="setMaxAmount">
					<text class="max-text">最大金额</text>
				</view>
				
			</view>
			</view>

			<!-- 快捷金额选择 -->
			<view class="quick-amounts">
				<text class="quick-label">快捷金额</text>
				<view class="quick-buttons">
					<view 
						v-for="amount in quickAmounts" 
						:key="amount" 
						class="quick-btn"
						@click="selectQuickAmount(amount)"
					>
						<text class="quick-btn-text">{{ amount }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 转账按钮 -->
		<view class="transfer-btn-container">
			<button 
				class="transfer-btn" 
				@click="handleWithdraw"
			>
				<text class="transfer-btn-text">提现</text>
			</button>
		</view>
		<view class="transfer-tips">
			<view class="">
				提示
			</view>
			<view class="">
				1、本次提现为游戏余额转入账户余额。
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameId: '',
				gameName: '',
				gameImg: '',
				userInfo: {},
				gameBalance: '0.00',
				withdrawAmount: '',
				quickAmounts: [10, 50, 100, 200, 500, 1000]
			};
		},
		
		computed: {
		},

		onLoad(options) {
			this.gameId = options.gameId || '';
			this.gameName = decodeURIComponent(options.gameName || '');
			this.gameImg = decodeURIComponent(options.gameImg || '');
			this.userInfo = getApp().getCache('userInfo') || {};
			this.getGameBalance();
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
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 获取游戏余额
			getGameBalance() {
				var that = this;
				var postData = {
					token: that.userInfo.token,
					id: that.gameId
				};
				
				getApp().getData('api/game/balance', postData, function(res) {
					if (res.code === 200) {
						that.gameBalance = res.data.balance || '0.00';
					}
				}, function(error) {
					console.error('获取游戏余额失败:', error);
				});
			},

			// 金额输入处理
			onAmountInput(e) {
				let value = e.detail.value;
				// 限制小数点后两位
				if (value.includes('.')) {
					const parts = value.split('.');
					if (parts[1] && parts[1].length > 2) {
						value = parts[0] + '.' + parts[1].substring(0, 2);
						this.withdrawAmount = value;
					}
				}
			},

			// 设置最大金额
			setMaxAmount() {
				const maxAmount = parseFloat(this.gameBalance || 0);
				this.withdrawAmount = maxAmount.toFixed(2);
			},

			// 选择快捷金额
			selectQuickAmount(amount) {
				this.withdrawAmount = amount.toString();
			},

			// 处理提现
			handleWithdraw() {
			
				
				const amount = parseFloat(this.withdrawAmount);
				const balance = parseFloat(this.gameBalance || 0);
				
				// if (amount <= 0) {
				// 	uni.showToast({
				// 		title: '请输入有效金额',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				
				// if (amount > balance) {
				// 	uni.showToast({
				// 		title: '余额不足',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				
				this.createOrder();
			},

			// 创建订单
			createOrder() {
				var that = this;
				
				var postData = {
					token: that.userInfo.token,
					type: 'game_withdrawal',
					info_id: that.gameId,
					amount: that.withdrawAmount
				};
				
				getApp().getData('api/order/create', postData, function(res) {
					if (res.code === 200) {
						// 创建订单成功，调用支付接口
						that.processPayment(res.data);
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg || '创建订单失败',
							showCancel: false
						});
					}
				}, function(error) {
					uni.showModal({
						title: '提示',
						content: '网络错误，请稍后重试',
						showCancel: false
					});
					console.error('创建订单网络错误:', error);
				});
			},

			// 处理支付
			processPayment(orderId) {
				var that = this;
				
				var postData = {
					token: that.userInfo.token,
					id: orderId,
					paytype: 0,
					type: 'game_withdrawal'
				};
				
				getApp().getData('api/order/pay', postData, function(res) {
					if (res.code === 200) {
						uni.showModal({
							title: '提现成功',
							content: `已成功从${that.gameName}提现¥${that.withdrawAmount}`,
							showCancel: false,
							success: function() {
								// 提现成功后返回上一页
								uni.navigateBack();
							}
						});
						// 刷新游戏余额
						that.getGameBalance();
					} else {
						uni.showModal({
							title: '提现失败',
							content: res.msg || '提现失败，请稍后重试',
							showCancel: false
						});
					}
				}, function(error) {
					uni.showModal({
							title: '提现失败',
							content: '网络错误，请稍后重试',
							showCancel: false
						});
					console.error('支付网络错误:', error);
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #f8f9fa;
	}

	.game-recharge-page {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 头部样式 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
		position: sticky;
		top: 0;
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

	/* 游戏信息 */
	.game-info {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #fff;
		margin: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.game-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.game-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	/* 充值表单 */
	.recharge-form {
		background-color: #fff;
		margin: 0 20rpx;
		border-radius: 12rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	/* 游戏余额 */
	.balance-info {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-radius: 12rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-bottom: 40rpx;
		color: #999;
	}

	.balance-label {
	}

	.balance-amount {
	}

	/* 转账金额输入 */
	.amount-input-section {
		margin-bottom: 40rpx;
	}

	.input-label {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
		gap: 15rpx;
	}

	.amount-input {
		flex: 1;
		height: 80rpx;
		padding: 0 20rpx;
		border: 2rpx solid #e9ecef;
		border-radius: 8rpx;
		font-size: 28rpx;
		background-color: #fff;
	}

	.currency-symbol {
		font-size: 28rpx;
		color: #666;
		font-weight: bold;
	}

	.max-amount-btn {
		padding: 15rpx 25rpx;
		border-radius: 6rpx;
		color: #fd2450;
		transition: all 0.3s;
	}

	.max-amount-btn:active {
		transform: scale(0.95);
	}

	.max-text {
		font-size: 24rpx;
		font-weight: 500;
	}

	/* 快捷金额 */
	.quick-amounts {
		margin-bottom: 40rpx;
	}

	.quick-label {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}

	.quick-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}

	.quick-btn {
		padding: 20rpx 30rpx;
		border: 2rpx solid #e9ecef;
		border-radius: 8rpx;
		background-color: #fff;
		transition: all 0.3s;
	}

	.quick-btn:active {
		border-color: #007bff;
		background-color: #f0f8ff;
		transform: scale(0.95);
	}

	.quick-btn-text {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
	}

	/* 转账按钮 */
	.transfer-btn-container {
		padding: 30rpx 20rpx;
	}

	.transfer-btn {
		width: 100%;
		height: 88rpx;
		background-color: #fc1b5e;
		border-radius: 15rpx;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
	}

	.transfer-btn:disabled {
		background-color: #fc1b5e;
		opacity: 0.5;
	}

	.transfer-btn:not(:disabled):active {
		background-color: #fc1b5e;
		transform: scale(0.98);
	}

	.transfer-btn-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: 600;
	}
	.transfer-tips{
		color: #fd313d;
		padding: 30rpx;
		font-weight: bold;
		font-size: 24rpx;
	}
</style>