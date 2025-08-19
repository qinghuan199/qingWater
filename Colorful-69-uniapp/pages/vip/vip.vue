<template>
	<view class="vip-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="title">会员中心</text>
			<view class="placeholder"></view>
		</view>

		<!-- 主要内容 -->
		<view class="content">
			<!-- 会员等级显示 -->
			<view class="vip-level-section">
				<view class="level-card">
					<text class="level-text">会员等级：</text>
					<image v-if="newUserInfo.vip > 0" class="vip-icon" :src="`/static/icon/vip${newUserInfo.vip}.jpg`"
						mode="aspectFit"></image>
				</view>
			</view>

			<!-- 会员到期时间 -->
			<view class="expire-section">
				<text class="expire-label">会员到期时间：</text>
				<text v-if="newUserInfo.vip > 0"
					class="expire-time">{{ formatExpireTime(newUserInfo.expire_time) }}</text>
			</view>

			<view class="bg-white">
				<!-- 产品选择区域 -->
				<view class="product-section">
					<!-- <text class="section-title">选择会员套餐</text> -->
					<view class="product-list">
						<view v-for="(product, index) in productList" :key="product.id" class="product-item"
							:class="{ 'selected': selectedProductId === product.id }" @click="selectProduct(product)">
							<view class="product-info">
								<text class="product-name">{{ product.name }}</text>
							</view>
							<text class="product-price">¥{{ product.price }}</text>
						</view>
					</view>
				</view>

				<!-- 会员权益描述 -->
				<view class="benefits-section">
					<!-- <text class="section-title">会员权益</text> -->
					<view class="benefits-list">
						<view class="benefit-item">
							<text class="benefit-text">1、免费观看视频。</text>
						</view>
						<view class="benefit-item">
							<text class="benefit-text">2、上传原创获得收益。</text>
						</view>
						<view class="benefit-item">
							<text class="benefit-text">3、拥有预约达人资格。</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 确认开通按钮 -->
			<view class="confirm-section">
				<button class="confirm-btn" @click="confirmPurchase">
					确认开通
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newUserInfo: {},
				productList: [],
				selectedProductId: null,
				selectedProduct: null
			}
		},
		onLoad() {
			this.getProductList();
			this.initUserInfo()
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
			initUserInfo() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.token = userInfo.token;
				getApp().getData('api/getuserinfo', postData, function(res) {
					that.newUserInfo = res.data;
				});
			},
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},

			// 获取产品列表
			getProductList() {
				const postData = {};

				getApp().getData('api/product/list', postData, (res) => {
					if (res.code === 200) {
						this.productList = res.data || []
					} else {
						uni.showToast({
							title: res.msg || '获取产品列表失败',
							icon: 'none'
						})
					}
				})
			},
			// 选择产品
			selectProduct(product) {
				this.selectedProductId = product.id
				this.selectedProduct = product
			},
			// 格式化到期时间
			formatExpireTime(timestamp) {
				if (!timestamp) {
					return '未开通会员'
				}
				const date = new Date(timestamp * 1000)
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${year}-${month}-${day}`
			},
			// 确认购买
			confirmPurchase() {
				if (!this.selectedProduct) {
					uni.showToast({
						title: '请选择会员套餐',
						icon: 'none'
					})
					return
				}

				uni.showModal({
					title: '确认开通',
					content: `确认开通${this.selectedProduct.name}会员？价格：¥${this.selectedProduct.price}`,
					success: (res) => {
						if (res.confirm) {
							this.createOrder()
						}
					}
				})
			},
			// 创建订单
			createOrder() {
				var that = this;
				uni.showLoading({
					title: '正在创建订单...'
				})

				var userInfo = getApp().getCache('userInfo');
				var postData = {
					token: userInfo.token,
					type: 'normal',
					info_id: that.selectedProduct.id,
					amount: that.selectedProduct.price
				};

				getApp().getData('api/order/create', postData, function(res) {
					if (res.code === 200) {
						// 创建订单成功，调用支付接口
						that.processPayment(res.data);
					} else {
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: res.msg || '创建订单失败',
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
					console.error('创建订单网络错误:', error);
				});
			},

			// 处理支付
			processPayment(orderId) {
				var that = this;

				var userInfo = getApp().getCache('userInfo');
				var postData = {
					token: userInfo.token,
					id: orderId,
					paytype: 0,
					type: 'normal'
				};

				getApp().getData('api/order/pay', postData, function(res) {
					uni.hideLoading();
					console.log('VIP支付返回结果:', res);
					console.log('状态码类型:', typeof res.code, '状态码值:', res.code);
					if (res.code === 200) {
						// 检查是否从短视频页面进入
						const fromShortVideo = uni.getStorageSync('fromShortVideo');
						if (fromShortVideo) {
							// 设置购买成功标记
							uni.setStorageSync('hasPurchasedVip', true);
							// 清除来源标记
							uni.removeStorageSync('fromShortVideo');
						}

						uni.showModal({
							title: '开通成功',
							content: `恭喜您成功开通${that.selectedProduct.name}会员！`,
							showCancel: false,
							success: function() {
								// 开通成功后刷新用户信息
								that.initUserInfo();
								// 如果是从短视频页面进入，返回短视频页面
								if (fromShortVideo) {
									uni.navigateBack();
								}
							}
						});
					} else if (res.code === 402 || res.code == 402) {
						console.log('检测到402状态码，准备跳转充值页面');
						// 余额不足，显示提示后跳转到充值页面
						uni.showToast({
							title: res.msg || '余额不足！',
							icon: 'none'
						});
						setTimeout(() => {
							console.log('开始跳转到充值页面');
							uni.navigateTo({
								url: '/pages/recharge/recharge'
							});
						}, 500);
					} else {
						uni.showModal({
							title: '开通失败',
							content: res.msg || '开通失败，请稍后重试',
							showCancel: false
						});
					}
				}, function(error) {
					uni.hideLoading();
					uni.showModal({
						title: '开通失败',
						content: '网络错误，请稍后重试',
						showCancel: false
					});
					console.error('支付网络错误:', error);
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		color: #000;
		min-height: 100%;
		background-image: none !important;
		background-color: #eee;
	}

	.vip-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
	}

	/* 头部导航 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background: #ffffff;
		border-bottom: 1rpx solid #f0f0f0;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.back-btn {
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

	.header .title {
		font-size: 36rpx;
		color: #333333;
	}

	.placeholder {
		width: 60rpx;
	}

	/* 主要内容 */
	.content {
		padding: 30rpx 0;
	}

	/* 会员等级区域 */
	.vip-level-section {
		margin-bottom: 40rpx;
	}

	.level-card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		display: flex;
		align-items: center;
	}

	.vip-icon {
		width: 120rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}

	.level-text {
		font-size: 32rpx;
		color: #000;
	}

	/* 到期时间区域 */
	.expire-section {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		height: 100rpx;
		line-height: 100rpx;
	}

	.expire-label {
		font-size: 32rpx;
		color: #000;
	}

	.expire-time {
		font-size: 32rpx;
		color: #000;
	}

	/* 产品选择区域 */
	.product-section {
		margin-bottom: 40rpx;
		padding: 30rpx;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 30rpx;
		display: block;
	}

	.product-list {
		display: flex;
		justify-content: space-between;



	}

	.product-item {
		background: #999;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		padding: 30rpx;
		display: flex;
		width: 215rpx;
		height: 225rpx;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.product-item.selected {
		border-color: #ff4757;
		background: #fd313d;
		color: #ffffff;
		box-shadow: 0 8rpx 25rpx rgba(255, 71, 87, 0.3);
	}

	.product-info {
		display: flex;
		flex-direction: column;
	}

	.product-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.product-item.selected .product-name {
		color: #ffffff;
	}

	.product-days {
		font-size: 28rpx;
		color: #666666;
	}

	.product-item.selected .product-days {
		color: rgba(255, 255, 255, 0.8);
	}

	.product-price {
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}

	.product-item.selected .product-price {
		color: #ffffff;
	}

	/* 会员权益区域 */
	.benefits-section {
		margin-bottom: 60rpx;
	}

	.benefits-list {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
	}

	.benefit-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
	}

	.benefit-item:last-child {
		border-bottom: none;
	}

	.benefit-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	.benefit-text {
		font-size: 30rpx;
		color: #333333;
	}

	/* 确认按钮区域 */
	.confirm-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30rpx;
		background: #ffffff;
	}

	.confirm-btn {
		width: 100%;
		height: 100rpx;
		background: linear-gradient(to bottom, #fc303d 0%, #fc1074 100%);
		color: #fff;
		border: none;
		border-radius: 15rpx;
		font-size: 34rpx;
		line-height: 100rpx;
		font-weight: bold;
		box-shadow: 0 8rpx 25rpx rgba(255, 71, 87, 0.3);
		transition: all 0.3s ease;
	}

	.confirm-btn:disabled {
		background: #cccccc;
		box-shadow: none;
	}

	.confirm-btn:active:not(:disabled) {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 15rpx rgba(255, 71, 87, 0.3);
	}
</style>