<template>
	<view class="order-page">
		<!-- 自定义头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="header-title">我的订单</text>
			<view class="placeholder"></view>
		</view>

		<!-- 订单类型选择 -->
		<scroll-view class="order-types" scroll-x="true" show-scrollbar="false">
			<view class="type-list">
				<view class="type-item" :class="{ active: selectedType === 'normal' }" @click="selectType('normal')">
					<text class="type-text">普通订单</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'expert' }" @click="selectType('expert')">
					<text class="type-text">选妃</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'recharge_product' }"
					@click="selectType('recharge_product')">
					<text class="type-text">充值</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'member_video' }"
					@click="selectType('member_video')">
					<text class="type-text">会员视频</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'game_recharge' }"
					@click="selectType('game_recharge')">
					<text class="type-text">游戏充值</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'game_withdrawal' }"
					@click="selectType('game_withdrawal')">
					<text class="type-text">游戏提现</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'loufeng_auth' }"
					@click="selectType('loufeng_auth')">
					<text class="type-text">楼凤认证</text>
				</view>
				<view class="type-item" :class="{ active: selectedType === 'loufeng' }"
					@click="selectType('loufeng')">
					<text class="type-text">楼凤预约</text>
				</view>
			</view>
		</scroll-view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view v-if="loading && currentPage === 1" class="loading-state">
				<text class="loading-text">加载中...</text>
			</view>
			<view v-else-if="orderList.length === 0" class="empty-state">
				<text class="empty-text">暂无订单</text>
			</view>

			<view v-for="(order, index) in orderList" :key="index" class="order-item">
				<view class="order-main">
					<!-- 左侧信息 -->
					<view class="order-left">
						<!-- 普通订单显示 -->
						<template v-if="order.type === 'normal'">
							<text class="info-text">{{ order.info_name || '普通会员' }}</text>
							<text class="info-text">{{ order.price }}</text>
							<text class="info-text">{{ formatTime(order.create_time) }}</text>
						</template>

						<!-- 充值订单显示 -->
						<template v-else-if="order.type === 'recharge_product'">
							<!-- 有fields数据时显示fields内容 -->
							<template v-if="order.fields && order.fields.length > 0">
								<text class="info-text" v-for="(field, fieldIndex) in order.fields" :key="fieldIndex">
									{{ field.label }}: {{ field.value }}
								</text>
								<text class="info-text">时间：{{ formatTime(order.create_time) }}</text>
							</template>
							<!-- 无fields数据时显示普通订单格式 -->
							<template v-else>
								<text class="info-text">商品：{{ order.info_name }}</text>
								<text class="info-text">金额：¥{{ order.price }}</text>
								<text class="info-text">时间：{{ formatTime(order.create_time) }}</text>
							</template>
						</template>

						<!-- 会员视频订单显示 -->
						<template v-else-if="order.type === 'member_video'">
							<text class="info-text">{{ order.info_name }}</text>
							<text class="info-text">{{ order.price }}</text>
							<text class="info-text">{{ formatTime(order.create_time) }}</text>
						</template>

						<!-- 游戏充值订单显示 -->
						<template v-else-if="order.type === 'game_recharge'">
							<text class="info-text">{{ order.info_name }}</text>
							<text class="info-text">{{ order.price }}</text>
							<text class="info-text">{{ formatTime(order.create_time) }}</text>
						</template>

						<!-- 游戏提现显示 -->
						<template v-else-if="order.type === 'game_withdrawal'">
							<text class="info-text">{{ order.info_name }}</text>
							<text class="info-text">{{ order.price }}</text>
							<text class="info-text">{{ formatTime(order.create_time) }}</text>
						</template>
						<!-- 其他订单类型 -->
						<template v-else>
							<text class="info-text">订单：{{ order.info_name }}</text>
							<text class="info-text">金额：¥{{ order.price }}</text>
							<text class="info-text">时间：{{ formatTime(order.create_time) }}</text>
						</template>
					</view>

					<!-- 右侧状态 -->
					<view class="order-right">
						<text class="status-text"
							:class="getStatusClass(order.status, order.type)">{{ getStatusText(order.status, order.type) }}</text>
					</view>
				</view>

				<!-- 订单操作按钮 -->
				<view v-if="order.status == '1'" class="order-actions">
					<view class="action-btn cancel-btn" @click="cancelOrder(order)">
						<text class="btn-text">取消支付</text>
					</view>
					<view class="action-btn pay-btn" @click="payOrder(order)">
						<text class="btn-text">去支付</text>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more">
				<text class="load-text">加载更多...</text>
			</view>
			<view v-else-if="orderList.length > 0" class="no-more">
				<text class="no-more-text">没有更多订单了</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedType: 'normal', // 选中的订单类型
				orderList: [], // 订单列表
				currentPage: 1, // 当前页码
				totalPages: 1, // 总页数
				lastPage: 1, // 最后一页
				hasMore: true, // 是否还有更多数据
				loading: false // 是否正在加载
			};
		},

		onLoad() {
			this.loadOrderList();
		},
		onPullDownRefresh() {
			this.currentPage = 1;
			this.orderList = [];
			this.hasMore = true;
			this.loadOrderList(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			this.loadMore();
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
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 选择订单类型
			selectType(type) {
				this.selectedType = type;
				this.currentPage = 1;
				this.orderList = [];
				this.hasMore = true;
				this.loadOrderList();
			},

			// 获取字段值
			getFieldValue(fields, key) {
				if (!fields || !Array.isArray(fields)) {
					return '';
				}

				// 根据API返回的数据结构，fields中只有label和value字段
				// 需要根据label来匹配对应的字段
				const labelMap = {
					'account': '充值账户',
					'amount': '充值金额',
					'realname': '账户姓名',
					'type': '运营商'
				};

				const targetLabel = labelMap[key];
				if (!targetLabel) {
					return '';
				}

				const field = fields.find(item => item.label === targetLabel);
				return field ? field.value : '';
			},

			// 加载订单列表
			loadOrderList(callback) {
				if (this.loading) return;
				this.loading = true;

				getApp().getData('api/order/list', {
					page: this.currentPage,
					limit: 10,
					type: this.selectedType
				}, (res) => {
					this.loading = false;
					if (typeof callback === 'function') {
						callback();
					}
					if (res.code === 200) {
						const responseData = res.data;
						if (this.currentPage === 1) {
							this.orderList = responseData.data || [];
						} else {
							this.orderList = this.orderList.concat(responseData.data || []);
						}
						// 更新分页信息
						this.lastPage = responseData.last_page;
						this.hasMore = responseData.current_page < responseData.last_page;
					} else {
						uni.showToast({
							title: res.msg || '获取订单列表失败',
							icon: 'none'
						});
					}
				}, (err) => {
					this.loading = false;
					if (typeof callback === 'function') {
						callback();
					}
					console.error('获取订单列表失败:', err);
					uni.showToast({
						title: '网络错误，请重试',
						icon: 'none'
					});
				});
			},

			// 加载更多
			loadMore() {
				if (!this.hasMore || this.loading) return;
				// 检查当前页是否小于最后一页，如果不是则不加载更多
				if (this.currentPage >= this.lastPage) {
					this.hasMore = false;
					return;
				}
				this.currentPage++;
				this.loadOrderList();
			},

			// 取消订单
			cancelOrder(order) {
				uni.showModal({
					title: '确认取消',
					content: '确定要取消这个订单吗？',
					success: (res) => {
						if (res.confirm) {
							this.performCancelOrder(order);
						}
					}
				});
			},

			// 执行取消订单
			performCancelOrder(order) {
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
					title: '取消中...'
				});

				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/cancel',
					method: 'POST',
					header: {
						'token': token,
						'Content-Type': 'application/json'
					},
					data: {
						id: order.id,
						type: order.type
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 200) {
							uni.showToast({
								title: '取消成功',
								icon: 'success'
							});
							// 刷新订单列表
							this.currentPage = 1;
							this.orderList = [];
							this.hasMore = true;
							this.loadOrderList();
						} else {
							uni.showToast({
								title: res.data.msg || '取消失败',
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
			payOrder(order) {
				// 跳转到支付页面或显示支付选择
				uni.showActionSheet({
					itemList: ['余额支付', '微信支付', '支付宝支付'],
					success: (res) => {
						const payTypes = [0, 1, 2]; // 对应微信、支付宝、USDT
						const payType = payTypes[res.tapIndex];
						this.performPayOrder(order, payType);
					}
				});
			},

			// 执行支付订单
			performPayOrder(order, payType) {
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
						id: order.id,
						paytype: payType,
						type: order.type
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 200) {
							if (payType === 0) {
								// 余额支付成功
								uni.showToast({
									title: '支付成功',
									icon: 'success'
								});
								// 刷新订单列表
								this.currentPage = 1;
								this.orderList = [];
								this.hasMore = true;
								this.loadOrderList();
							} else {
								// 第三方支付，处理支付地址
								this.handlePaymentResult(res.data.data, payType);
							}
						} else if (res.data.code === 401) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
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

			// 处理支付结果
			handlePaymentResult(data, payType) {
				if (payType === 3) {
					// USDT支付
					uni.showModal({
						title: 'USDT支付信息',
						content: `汇率: ${data.exchange_rate}\n地址: ${data.usdt_address}\n金额: ${data.usdt_money} USDT`,
						showCancel: false,
						confirmText: '确定'
					});
				} else {
					// 微信/支付宝支付
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
				}
			},

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp * 1000);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},

			// 获取订单状态文本
			getStatusText(status, type) {
				if (type === 'recharge_product') {
					// 充值订单状态：0-未支付 1-已支付(待充值) 2-充值中 3-已付款 4-充值成功 5-充值失败 6-退款成功 7-退款中 8-退款失败 9-已过期 10-已取消
					const rechargeStatus = {
						0: '未支付',
						1: '已支付(待充值)',
						2: '充值中',
						3: '已付款',
						4: '充值成功',
						5: '充值失败',
						6: '退款成功',
						7: '退款中',
						8: '退款失败',
						9: '已过期',
						10: '已取消'
					};
					return rechargeStatus[status] || '未知状态';
				} else {
					// 普通订单状态：1-已下单 2-已支付 3-已取消 4-支付中
					const normalStatus = {
						1: '已下单',
						2: '已支付',
						3: '已取消',
						4: '支付中'
					};
					return normalStatus[status] || '未知状态';
				}
			},

			// 获取订单状态样式类
			getStatusClass(status, type) {
				if (type === 'recharge' || type === 'recharge_product') {
					if ([0, 1, 2, 4].includes(status)) return 'status-processing';
					if ([3, 4].includes(status)) return 'status-success';
					if ([5, 8, 9, 10].includes(status)) return 'status-failed';
					if ([6, 7].includes(status)) return 'status-refund';
				} else {
					if ([1, 4].includes(status)) return 'status-processing';
					if (status === 2) return 'status-success';
					if (status === 3) return 'status-failed';
				}
				return 'status-default';
			},

			// 获取支付方式文本
			getPaymentText(payType) {
				// 支付方式：0-余额支付 1-微信 2-支付宝 3-usdt 4-后台下单
				const paymentTypes = {
					0: '余额支付',
					1: '微信支付',
					2: '支付宝',
					3: 'USDT支付',
					4: '后台下单'
				};
				return paymentTypes[payType] || '未知支付方式';
			},

			// 判断是否可以取消
			canCancel(status, type) {
				if (type === 'recharge' || type === 'recharge_product') {
					return [0, 1, 2].includes(status); // 未支付、已支付(待充值)、充值中
				} else {
					return [1, 4].includes(status); // 已下单、支付中
				}
			},

			// 判断是否可以支付
			canPay(status, type) {
				if (type === 'recharge' || type === 'recharge_product') {
					return status === 0; // 未支付
				} else {
					return status === 1; // 已下单
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.order-page {
		background-color: #fff;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 头部导航 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
		position: sticky;
		top: 0;
		z-index: 10;
		height: 88rpx;
		box-sizing: border-box;
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

	/* 订单类型选择 */
	.order-types {
		background-color: #eee;
		border-bottom: 1rpx solid #f0f0f0;
		position: sticky;
		top: 88rpx;
		z-index: 10;
	}

	.type-list {
		display: flex;
		padding: 0 30rpx;
		white-space: nowrap;
	}

	.type-item {
		padding: 30rpx 40rpx;
		margin-right: 20rpx;
		position: relative;
		transition: all 0.3s;
	}

	.type-item.active {
		color: #fd313d;
	}

	.type-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		// background-color: #fd313d;
		border-radius: 2rpx;
	}

	.type-text {
		font-size: 32rpx;
		color: #666;
	}

	.type-item.active .type-text {
		color: #fd313d;
		font-weight: 600;
	}

	/* 订单列表 */
	.order-list {
		flex: 1;
		padding: 20rpx 30rpx;
	}

	.loading-state,
	.empty-state {
		padding: 100rpx 0;
		text-align: center;
	}

	.loading-text,
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.order-item {
		background-color: #eeeeee;
		border-radius: 12rpx;
		margin-bottom: 10rpx;
		padding: 30rpx;
		width: 690rpx;
	}

	/* 订单主体 */
	.order-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
		gap: 20rpx;
	}

	.order-left {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.info-text {
		font-size: 28rpx;
		color: #999;
		display: block;
		margin-bottom: 8rpx;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 1.4;
	}

	.order-right {
		flex-shrink: 0;
		max-width: 200rpx;
	}

	.status-text {
		font-size: 32rpx;
		padding: 8rpx 12rpx;
		border-radius: 20rpx;
		color: #fc1765;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		display: inline-block;
	}

	.status-processing {
		color: #fc1765;
	}

	.status-success {
		color: #fc1765;
	}

	.status-failed {
		color: #fc1765;
	}

	.status-refund {
		color: #fc1765;
	}

	/* 订单内容 */
	.order-content {
		margin-bottom: 20rpx;
		word-wrap: break-word;
		word-break: break-all;
	}

	.product-info {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
		gap: 20rpx;
	}

	.product-name {
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
		flex: 1;
		min-width: 0;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 1.4;
	}

	.product-price {
		font-size: 32rpx;
		color: #ff6b35;
		font-weight: 600;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.extra-fields {
		margin-bottom: 20rpx;
	}

	.field-item {
		display: flex;
		margin-bottom: 10rpx;
		align-items: flex-start;
		gap: 10rpx;
	}

	.field-label {
		font-size: 28rpx;
		color: #666;
		width: 160rpx;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.field-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
		min-width: 0;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 1.4;
	}

	.payment-info {
		text-align: right;
	}

	.payment-method {
		font-size: 24rpx;
		color: #999;
	}

	/* 订单操作按钮 */
	.order-actions {
		display: flex;
		justify-content: flex-start;
		gap: 20rpx;
		flex-wrap: wrap;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
	}

	.action-btn {
		padding: 16rpx 32rpx;
		border-radius: 40rpx;
		border: 2rpx solid;
		transition: all 0.3s;
		flex-shrink: 0;
		min-width: 120rpx;
		text-align: center;
		background-color: #fc1765;
	}

	.cancel-btn {
		border-color: #fc1765;
		background-color: #fc1765;
	}

	.cancel-btn .btn-text {
		color: white;
		font-size: 28rpx;
	}

	.pay-btn {
		border-color: #fc1765;
		background-color: #fc1765;
	}

	.pay-btn .btn-text {
		color: white;
		font-size: 28rpx;
	}

	/* 加载更多 */
	.load-more,
	.no-more {
		padding: 40rpx 0;
		text-align: center;
	}

	.load-text,
	.no-more-text {
		font-size: 28rpx;
		color: #999;
	}
</style>