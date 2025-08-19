<template>
	<view class="earnings-page">
		<!-- 自定义头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">收益明细</text>
			<view class="placeholder"></view>
		</view>

		<!-- 余额和充值区域 -->
		<view class="balance-section">
			<view class="balance-info">
				<text class="balance-label">余额：{{ userInfo.money || '0.00' }}</text>
			</view>
			<view class="recharge-btn" @click="goToRecharge">
				<text class="recharge-text">充值</text>
			</view>
		</view>

		<!-- 收益明细列表 -->
		<scroll-view class="earnings-list" scroll-y="true" @scrolltolower="loadMore" :lower-threshold="50"
			refresher-enabled="true" @refresherrefresh="onRefresh" :refresher-triggered="refreshing">
			<view v-if="earningsList.length === 0 && !loading" class="empty-state">
				<text class="empty-text">暂无收益明细</text>
			</view>

			<view v-for="(item, index) in earningsList" :key="index" class="earnings-item">
				<view class="earnings-main">
					<view class="earnings-left">
						<text class="earnings-source">{{ item.source }}</text>
						<text class="earnings-content">{{ item.content }}</text>
						<text class="earnings-time">{{ formatTime(item.create_time) }}</text>
					</view>
					<view class="earnings-right">
						<text class="earnings-amount">{{item.money }}</text>
					</view>
				</view>
			</view>
			<!-- 加载更多 -->
			<view v-if="loading && earningsList.length > 0" class="load-more">
				<text class="load-text">加载中...</text>
			</view>
			<view v-else-if="!hasMore && earningsList.length > 0" class="no-more">
				<text class="no-more-text">没有更多数据了</text>
			</view>

		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				earningsList: [],
				currentPage: 1,
				hasMore: true,
				loading: false,
				refreshing: false
			};
		},

		onLoad() {
			this.getUserInfo();
			this.loadEarningsList();
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
			// 获取用户信息
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
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
						}
					},
					fail: () => {
						console.error('获取用户信息失败');
					}
				});
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 跳转到充值页面
			goToRecharge() {
				uni.navigateTo({
					url: '/pages/recharge/recharge'
				});
			},

			// 加载收益明细列表
			loadEarningsList() {
				if (this.loading) return;

				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				this.loading = true;
				if (this.currentPage === 1) {
					uni.showLoading({
						title: '加载中...'
					});
				}

				uni.request({
					url: getApp().globalData.baseUrl + 'api/consumptiondetail',
					method: 'POST',
					header: {
						'token': token,
						'Content-Type': 'application/json'
					},
					data: {
						page: this.currentPage,
						limit: 10
					},
					success: (res) => {
						if (res.data.code === 200) {
							const responseData = res.data.data;
							const newData = responseData.data || [];

							// 第一页时直接替换数据
							if (this.currentPage === 1) {
								this.earningsList = newData;
							} else {
								// 后续页追加数据
								this.earningsList = this.earningsList.concat(newData);
							}

							// 关键修改：判断是否还有更多数据
							this.hasMore = this.currentPage < responseData.last_page;

							console.log('当前页:', this.currentPage,
								'总页数:', responseData.last_page,
								'是否有更多:', this.hasMore);
						}
					},
					complete: () => {
						this.loading = false;
						if (this.currentPage === 1) {
							uni.hideLoading();
						}
					}
				});
			},
			// 加载更多
			loadMore() {
				// 关键判断：只有在 hasMore 为 true 且不在加载状态时才加载下一页
				if (this.hasMore && !this.loading) {
					this.currentPage++;
					this.loadEarningsList();
				} else {
					console.log('已到达最后一页，停止加载');
				}
			},

			// 下拉刷新
			onRefresh() {
				this.refreshing = true;
				this.currentPage = 1;
				this.hasMore = true;
				this.earningsList = [];

				// 重新加载数据
				this.loadEarningsList();

				// 延迟结束刷新状态
				setTimeout(() => {
					this.refreshing = false;
				}, 1000);
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

			// 格式化金额
			formatAmount(money, action) {
				if (!money) return '¥0.00';
				// 处理负数金额（如果money本身带有负号）
				const num = parseFloat(money);
				const absNum = Math.abs(num);

				if (action === '增加') {
					return `+¥${absNum.toFixed(2)}`;
				} else {
					// 如果原始数据已经是负数，直接显示，否则添加负号
					if (num < 0) {
						return `¥${num.toFixed(2)}`;
					} else {
						return `-¥${num.toFixed(2)}`;
					}
				}
			},

			// 获取金额样式类
			getAmountClass(action) {
				if (!action) return 'amount-negative';
				return action === '增加' ? 'amount-positive' : 'amount-negative';
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #eeeeee;
	}

	.earnings-page {
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
		color: #333;
	}

	.placeholder {
		width: 40rpx;
		height: 40rpx;
	}

	/* 余额和充值区域 */
	.balance-section {
		background-color: #e84840;
		padding: 40rpx 30rpx;
		width: 690rpx;
		margin: 30rpx auto 0;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.balance-info {
		display: flex;
		gap: 10rpx;
	}

	.balance-label {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}


	.recharge-btn {
		padding: 20rpx 40rpx;
		border-radius: 40rpx;
	}

	.recharge-text {
		font-size: 36rpx;
		color: #f7fb87;
		font-weight: 600;
	}

	/* 收益明细列表 */
	.earnings-list {
		flex: 1;
		background-color: #fff;
		width: 690rpx;
		margin: 30rpx auto;
		border-radius: 5rpx;
		height: calc(100vh - 300rpx);
		/* 设置固定高度，减去头部和余额区域的高度 */
		max-height: 75vh;
		/* 设置最大高度 */
	}

	.empty-state {
		padding: 100rpx 0;
		text-align: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.earnings-item {
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		width: 690rpx;
		padding: 30rpx;
	}

	.earnings-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20rpx;
	}

	.earnings-left {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.earnings-source {
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 1.4;
	}

	.earnings-content {
		font-size: 28rpx;
		color: #000;
		display: block;
		margin-bottom: 8rpx;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 1.4;
	}

	.earnings-time {
		font-size: 28rpx;
		color: #999;
		display: block;
	}

	.earnings-right {
		flex-shrink: 0;
		max-width: 200rpx;
		margin-top: 40rpx;
	}

	.earnings-amount {
		font-size: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		color: #999;
		display: inline-block;
	}

	.amount-positive {
		color: #52c41a;
	}

	.amount-negative {
		color: #ff4d4f;
	}

	/* 加载更多 */
	.load-more {
		padding: 30rpx 0;
		text-align: center;
	}

	.load-text {
		font-size: 28rpx;
		color: #999;
	}

	.no-more {
		padding: 30rpx 0;
		text-align: center;
	}

	.no-more-text {
		font-size: 28rpx;
		color: #ccc;
	}
</style>