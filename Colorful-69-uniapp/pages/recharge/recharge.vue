<template>
	<view class="recharge-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">余额充值</text>
			<view class="placeholder"></view>
		</view>

		<!-- 余额显示 -->
		<view class="balance-container">
			<text class="balance-label">余额：</text>
			<text class="balance-amount">{{ userInfo.money || '0.00' }}</text>
		</view>

		<!-- 充值金额选择 -->
		<view class="amount-container">
			<view class="amount-grid">
				<!-- 预设金额按钮 -->
				<view v-for="amount in presetAmounts" :key="amount" class="amount-item"
					:class="{ active: selectedAmount === amount && !isCustomActive }" @click="selectAmount(amount)">
					<text class="amount-text">{{ amount }}</text>
				</view>
				<!-- 自定义金额按钮 -->
				<view class="amount-item custom-btn" :class="{ active: isCustomActive }" @click="selectCustom">
					<text class="amount-text">自定义</text>
				</view>
			</view>

			<!-- 充值金额显示/输入 -->
			<view class="final-amount-container">
				<input ref="amountInput" placeholder="请输入金额" v-model="selectedAmount" @input="onAmountInput"
					class="amount-value"></input>
			</view>
		</view>

		<!-- 支付方式选择 -->
		<view class="payment-container">
			<view class="payment-methods">
				<view v-for="method in paymentMethods" :key="method.type" class="payment-item"
					:class="{ active: selectedPayment === method.type }" @click="selectPayment(method.type)">
					<view class="payment-info">
						<view class="checkbox" :class="{ checked: selectedPayment === method.type }">
							<text v-if="selectedPayment === method.type" class="check-mark">✓</text>
						</view>
						<text class="payment-name">{{ method.name }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 充值按钮 -->
		<view class="recharge-btn-container">
			<button class="recharge-btn" @click="recharge" :disabled="!canRecharge">充值</button>
		</view>

		<!-- USDT支付信息弹窗 -->
		<view v-if="showUsdtDialog" class="usdt-dialog-overlay" @click="closeUsdtDialog">
			<view class="usdt-dialog" @click.stop>
				<view class="dialog-header">
					<text class="dialog-title">USDT充值</text>
					<view class="close-btn" @click="closeUsdtDialog">
						<text class="close-icon">×</text>
					</view>
				</view>

				<view class="dialog-content" v-if="usdtPaymentInfo">
					<!-- 汇率信息 -->
					<view class="info-item">
						<text class="info-label">汇率：</text>
						<text class="info-value">{{ usdtPaymentInfo.exchange_rate }}</text>
					</view>

					<!-- 收款地址 -->
					<view class="info-item">
						<text class="info-label">收款地址：</text>
						<text class="info-value address-text">{{ usdtPaymentInfo.usdt_address }}</text>
					</view>

					<!-- 应付金额 -->
					<view class="info-item">
						<text class="info-label">应付金额：</text>
						<text class="info-value amount-text">{{ usdtPaymentInfo.money }} CNY</text>
					</view>

					<!-- USDT金额 -->
					<view class="info-item">
						<text class="info-label">USDT金额：</text>
						<text class="info-value usdt-amount">{{ usdtPaymentInfo.usdt_money }} USDT</text>
					</view>

					<!-- 地址输入框 -->
					<view class="input-container">
						<text class="input-label">请输入您的USDT转账地址：</text>
						<textarea class="address-input" v-model="usdtAddress" placeholder="请输入USDT转账地址" maxlength="200"></textarea>
					</view>

					<!-- 提交按钮 -->
					<view class="dialog-footer">
						<button class="cancel-btn" @click="closeUsdtDialog">取消</button>
						<button class="submit-btn" @click="submitUsdtAddress">提交</button>
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
				userInfo: {},
				presetAmounts: [50, 100, 200, 300, 500],
				selectedAmount: 0,
				isCustomActive: false,
				selectedPayment: 1, // 默认选择微信支付
				paymentMethods: [{
						type: 1,
						name: '微信支付',
						icon: '/static/icon/wechat.png'
					},
					{
						type: 2,
						name: '支付宝支付',
						icon: '/static/icon/alipay.png'
					},
					{
						type: 3,
						name: 'USDT支付',
						icon: '/static/icon/usdt.png'
					}
				],
				loading: false,
				currentOrderId: null, // 当前订单ID
				showUsdtDialog: false, // USDT弹窗显示状态
				usdtAddress: '', // 用户输入的USDT地址
				usdtPaymentInfo: null // USDT支付信息
			}
		},
		computed: {
			finalAmount() {
				return this.selectedAmount || '0';
			},
			canRecharge() {
				return this.selectedAmount > 0 && this.selectedPayment && !this.loading;
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		onShow() {
			// 检查登录状态
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return;
			}
		},

		methods: {

			selectAmount(amount) {
				this.selectedAmount = amount;
				this.isCustomActive = false;
			},

			// 获取用户信息
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
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

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 选择预设金额
			selectAmount(amount) {
				this.selectedAmount = amount;
				this.isCustomActive = false; // 取消自定义按钮高亮
			},
			// 选择自定义金额
			selectCustom() {
				this.selectedAmount = 0; // 清零输入框
				this.isCustomActive = true; // 激活自定义按钮高亮
				// 自动聚焦到输入框
				this.$nextTick(() => {
					const input = this.$refs.amountInput;
					if (input) {
						input.focus();
					}
				});
			},
			// 处理金额输入
			onAmountInput() {
				// 如果用户直接在输入框输入，且当前不是自定义状态，则激活自定义状态
				if (!this.isCustomActive) {
					this.isCustomActive = true;
				}
			},
			// 选择支付方式
			selectPayment(type) {
				this.selectedPayment = type;
			},
			// 充值方法
			recharge() {
				if (!this.canRecharge) {
					uni.showToast({
						title: '请选择充值金额和支付方式',
						icon: 'none'
					});
					return;
				}

				const amount = this.selectedAmount;
				if (amount <= 0) {
					uni.showToast({
						title: '充值金额必须大于0',
						icon: 'none'
					});
					return;
				}

				// 创建订单
				this.createOrder(amount);
			},

			// 创建订单
			createOrder(amount) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '创建订单中...'
				});

				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/create',
					method: 'POST',
					header: {
						'token': token,
						'Content-Type': 'application/json'
					},
					data: {
						type: 'recharge',
						amount: amount.toString()
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 200) {
							const orderId = res.data.data;
							// 创建订单成功，进行支付
							this.payOrder(orderId, amount);
						} else {
							uni.showToast({
								title: res.data.msg || '创建订单失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 支付订单
			payOrder(orderId, amount) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				// 保存订单ID，用于后续complete接口
				this.currentOrderId = orderId;

				uni.showLoading({
					title: '处理支付中...'
				});

				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/pay',
					method: 'POST',
					header: {
						'token': token,
						'Content-Type': 'application/json'
					},
					data: {
						id: orderId,
						paytype: this.selectedPayment,
						type: 'recharge'
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 200) {
							if (this.selectedPayment === 0) {
								// 余额支付成功
								uni.showToast({
									title: '充值成功',
									icon: 'success'
								});
								// 刷新用户信息
								this.getUserInfo();
							} else {
								// 第三方支付，处理支付地址
								this.handlePaymentResult(res.data.data);
							}
						} else {
							uni.showToast({
								title: res.data.msg || '支付失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			handlePaymentResult(data) {
				if (this.selectedPayment === 3) {
					// USDT支付 - 直接使用pay接口返回的数据
					this.usdtPaymentInfo = data;
					this.showUsdtDialog = true;
				} else {
					// 微信/支付宝支付
					if (data.payUrl) {
						uni.showModal({
							title: '支付提示',
							content: '请在新页面完成支付',
							showCancel: false,
							success: (res) => {
								if (res.confirm) {
									// 平台差异处理
									// #ifdef H5
									window.open(data.payUrl, '_blank');
									// #endif
									// #ifdef APP-PLUS
									plus.runtime.openURL(data.payUrl);
									// #endif
									// #ifdef MP
									uni.setClipboardData({
										data: data.payUrl,
										success: () => {
											uni.showToast({
												title: '支付链接已复制',
												icon: 'none'
											});
										}
									});
									// #endif
								}
							}
						});
					}
				}
			},



			// 关闭USDT对话框
			closeUsdtDialog() {
				this.showUsdtDialog = false;
				this.usdtAddress = '';
				this.usdtPaymentInfo = null;
			},

			// 提交USDT地址
			submitUsdtAddress() {
				if (!this.usdtAddress || !this.usdtAddress.trim()) {
					uni.showToast({
						title: '请输入USDT转账地址',
						icon: 'none'
					});
					return;
				}
				this.completeUsdtPayment();
			},

			// 完成USDT充值
			completeUsdtPayment() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '提交中...'
				});

				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/complete',
					method: 'POST',
					header: {
						'token': token,
						'Content-Type': 'application/json'
					},
					data: {
						id: this.currentOrderId, // 使用create接口返回的data作为id
						type: 'recharge',
						usdt_address: this.usdtAddress.trim()
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 200) {
							uni.showToast({
								title: '充值申请已提交，请等待审核',
								icon: 'success',
								duration: 2000
							});
							// 关闭对话框并清空数据
							this.closeUsdtDialog();
							this.currentOrderId = null;
							// 刷新用户信息
							setTimeout(() => {
								this.getUserInfo();
							}, 2000);
						} else {
							uni.showToast({
								title: res.data.msg || '提交失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
								title: '网络错误',
								icon: 'none'
							});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.amount-input {
		width: 100%;
		text-align: center;
		font-size: 36rpx;
		color: #e84840;
		font-weight: bold;
		padding: 20rpx 0;
	}

	.recharge-page {
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
		width: 40rpx;
		height: 40rpx;
	}

	.header-title {
		font-size: 32rpx;
		color: #333;
	}

	.placeholder {
		width: 40rpx;
		height: 40rpx;
	}

	/* 余额显示 */
	.balance-container {
		padding: 30rpx;
		background-color: #e84840;
		margin-bottom: 20rpx;
		text-align: center;
		align-items: center;
		height: 150rpx;
		line-height: 150rpx;
		display: flex;
		font-size: 32rpx;
		width: 690rpx;
		margin: 30rpx auto;
		border-radius: 20rpx;
	}

	.balance-label {
		color: #fff;
		display: block;
	}

	.balance-amount {
		font-weight: 600;
		color: #fff;
		display: block;
	}

	/* 金额选择 */
	.amount-container {
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 30rpx;
		display: block;
	}

	.amount-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	/* 自定义金额输入框样式 */
	.custom-amount {
		margin-top: 20rpx;
	}

	.custom-label {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 15rpx;
		display: block;
	}

	.custom-input {
		width: 100%;
		padding: 25rpx 20rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		font-size: 32rpx;
		background-color: #fff;
		box-sizing: border-box;
	}

	.custom-input:focus {
		border-color: #e84840;
	}

	.amount-item {
		text-align: center;
		border: 2rpx solid #e0e0e0;
		border-radius: 15rpx;
		background-color: #fff;
		transition: all 0.3s;
		height: 150rpx;
		line-height: 150rpx;
	}

	.amount-item.active {
		border-color: #e84840;
	}

	.amount-text {
		font-size: 32rpx;
		color: #999;
	}

	.amount-item.active .amount-text {
		color: #e84840;
	}



	/* 支付方式 */
	.payment-container {
		margin-bottom: 40rpx;
		width: 690rpx;
		margin: 0 auto;
	}

	.payment-methods {
		display: flex;
		flex-direction: column;

	}

	.payment-item {
		display: flex;
		align-items: center;
		padding: 30rpx 15rpx;
		margin-bottom: 10rpx;
		border-radius: 12rpx;
		background-color: #fff;
		transition: all 0.3s;
	}

	.payment-item.active {
		background-color: #fff;
	}

	.payment-info {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.payment-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	.payment-name {
		font-size: 32rpx;
		margin-left: 20rpx;
		font-weight: bold;
		color: #333;
	}

	.checkbox {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #ccc;
		border-radius: 50%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkbox.checked {
		border-color: #fc1665;
		background-color: #fc1665;
	}

	.check-mark {
		color: #fff;
		font-size: 20rpx;
		font-weight: bold;
	}

	/* 充值金额显示 */
	.final-amount-container {
		margin: 20rpx 30rpx;
		border-bottom: 1rpx solid #000;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.amount-label {
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
	}

	.amount-value {
		font-size: 36rpx;
		color: #e84840;
		text-align: left;
		font-weight: bold;
	}

	/* 充值按钮 */
	.recharge-btn-container {
		padding: 0 30rpx 40rpx;
		margin-top: 30rpx;
	}

	.recharge-btn {
		width: 100%;
		padding: 10rpx;
		background-color: #e84840;
		color: #fff;
		font-size: 36rpx;
		border-radius: 15rpx;
		border: none;
		transition: all 0.3s;
	}

	.recharge-btn[disabled] {
		background-color: #fc1d5d;
		color: #fff;
	}

	/* USDT支付对话框样式 */
	.usdt-dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.usdt-dialog {
		width: 90%;
		max-width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		background-color: #e84840;
	}

	.dialog-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.close-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.2);
	}

	.close-icon {
		font-size: 40rpx;
		color: #fff;
		font-weight: bold;
	}

	.dialog-content {
		padding: 30rpx;
		flex: 1;
		overflow-y: auto;
	}

	.info-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
		padding: 15rpx 0;
	}

	.info-label {
		font-size: 28rpx;
		color: #666;
		min-width: 140rpx;
		flex-shrink: 0;
	}

	.info-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
		word-break: break-all;
	}

	.address-text {
		font-family: monospace;
		background-color: #f8f8f8;
		padding: 10rpx;
		border-radius: 8rpx;
	}

	
	.usdt-amount {
		color: #ff9500;
		font-weight: bold;
	}

	.qr-container {
		display: flex;
		justify-content: center;
		margin: 20rpx 0;
		padding: 20rpx;
		background-color: #f8f8f8;
		border-radius: 15rpx;
	}

	.qr-image {
		width: 300rpx;
		height: 300rpx;
		border-radius: 10rpx;
	}

	.input-container {
		margin-top: 30rpx;
	}

	.input-label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 15rpx;
		display: block;
	}

	.address-input {
		width: 100%;
		height: 120rpx;
		border-radius: 10rpx;
		padding: 15rpx;
		font-size: 26rpx;
		color: #333;
		background-color: #fafafa;
		box-sizing: border-box;
		resize: none;
	}

	.address-input:focus {
		border-color: #e84840;
		background-color: #fff;
	}

	.dialog-footer {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;
		padding-top: 30rpx;
	}

	.cancel-btn,
	.submit-btn {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		border: none;
		cursor: pointer;
		transition: all 0.3s;
	}

	.cancel-btn {
		background-color: #f5f5f5;
		color: #666;
	}
	.cancel-btn::after {
		border: none;
	
	}
	

	.cancel-btn:hover {
		background-color: #e0e0e0;
	}

	.submit-btn {
		background-color: #e84840;
		color: #fff;
	}

	.submit-btn:hover {
		background-color: #d63031;
	}
</style>