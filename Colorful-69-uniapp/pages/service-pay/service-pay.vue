<template>
	<view class="page-container">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="nav-back" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="nav-title">抖音红包</text>
		</view>

		<!-- 服务标题 -->
		<view class="service-header">
			<view class="service-icon-container">
				<image class="service-icon" src="/static/icon/douyin.png" mode="aspectFit"></image>
			</view>
			<text class="service-title">抖音红包</text>
			<text class="service-desc">快速获取抖音红包奖励</text>
		</view>

		<!-- 最优报价 -->
		<view class="price-section">
			<text class="price-title">最优报价</text>
			<view class="payment-options">
				<view class="payment-option" @click="selectPayment('balance')">
					<image class="payment-icon" :src="selectedPayment === 'balance' ? '/static/home/ic_recharge_pay_select.png' : '/static/home/ic_recharge_pay_normal.png'" mode="aspectFit"></image>
					<text class="option-text">余额支付</text>
				</view>
				<view class="payment-option" @click="selectPayment('alipay')">
					<view class="option-checkbox" :class="{ checked: selectedPayment === 'alipay' }">
						<image v-if="selectedPayment === 'alipay'" class="check-icon" src="/static/icon/check.png" mode="aspectFit"></image>
					</view>
					<text class="option-text">支付宝支付</text>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-section">
			<button class="submit-btn" @click="submitPayment">立即获取</button>
			<view class="submit-tip">
				<image class="tip-icon" src="/static/home/ic_tips.png" mode="aspectFit"></image>
				<text class="tip-text">确认信息无误</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedPayment: 'balance'
		}
	},
	onLoad(options) {
		// 可以根据传入的type参数做不同处理
		console.log('Service type:', options.type);
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		// 选择支付方式
		selectPayment(payment) {
			this.selectedPayment = payment;
		},
		// 提交支付
		submitPayment() {
			uni.showLoading({
				title: '处理中...'
			});

			// 模拟API调用
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '红包获取成功',
					icon: 'success'
				});
				
				// 延迟返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}, 2000);
		}
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.nav-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
}

.nav-back {
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

.nav-title {
	flex: 1;
	text-align: center;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-right: 60rpx;
}

.service-header {
	background-color: #fff;
	padding: 60rpx 30rpx;
	margin-bottom: 20rpx;
	text-align: center;
}

.service-icon-container {
	width: 120rpx;
	height: 120rpx;
	margin: 0 auto 30rpx;
	border-radius: 60rpx;
	background: linear-gradient(135deg, #ff6b6b, #fd2e41);
	display: flex;
	align-items: center;
	justify-content: center;
}

.service-icon {
	width: 80rpx;
	height: 80rpx;
}

.service-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.service-desc {
	font-size: 28rpx;
	color: #666;
	display: block;
}

.price-section {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.price-title {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 30rpx;
	display: block;
}

.payment-options {
	display: flex;
	gap: 40rpx;
	justify-content: center;
}

.payment-option {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 20rpx;
	border-radius: 10rpx;
	transition: background-color 0.3s;
}

.payment-option:hover {
	background-color: #f9f9f9;
}

.payment-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}

.option-checkbox {
	width: 40rpx;
	height: 40rpx;
	border: 2rpx solid #ddd;
	border-radius: 50%;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	transition: all 0.3s;
}

.option-checkbox.checked {
	border-color: #fd2e41;
	background-color: #fd2e41;
}

.check-icon {
	width: 24rpx;
	height: 24rpx;
}

.option-text {
	font-size: 30rpx;
	color: #333;
}

.submit-section {
	padding: 30rpx;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #fd2e41, #ff6b6b);
	color: #fff;
	border: none;
	border-radius: 44rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 20rpx rgba(253, 46, 65, 0.3);
	transition: all 0.3s;
}

.submit-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 10rpx rgba(253, 46, 65, 0.3);
}

.submit-tip {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tip-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #333;
}
</style>