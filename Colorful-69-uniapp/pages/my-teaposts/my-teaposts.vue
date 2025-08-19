<template>
	<view class="my-teaposts-page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-content">
				<view class="back-btn" @click="goBack">
					<image class="back-icon" src="/static/icon/back.png" mode="aspectFit"></image>
				</view>
				<text class="navbar-title">我的茶贴</text>
				<view class="placeholder"></view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 楼凤列表 -->
			<view class="loufeng-list" v-if="loufengList.length > 0">
				<view v-for="(item, index) in loufengList" :key="item.id" class="loufeng-item" @click="goToLoufengDetail(item.id)">
					<!-- 左侧信息 -->
					<view class="left-info">
						<!-- 省市区标签 -->
						<view class="location-tag">
							{{item.title}}
						</view>
						<!-- 详细信息 -->
						<view class="info-list">
							<view class="info-item">
								<text class="info-label">类型：</text>
								<view class="info-value">{{item.type}}</view>
							</view>
							<view class="info-item">
								<text class="info-label">所在地区：</text>
								<view class="info-value">{{item.province.name}}
									{{item.city.name}}{{item.area.name}}
								</view>
							</view>
							<view class="info-item">
								<text class="info-label">服务项目：</text>
								<view class="info-value">{{item.service_project}}</view>
							</view>
							<view class="info-item">
								<text class="info-label">消费情况：</text>
								<view class="info-value">{{item.consumption_situation}}</view>
							</view>
						</view>
					</view>

					<!-- 右侧图片 -->
					<view class="right-image">
						<image class="item-image"
							:src="item.image && item.image.length > 0 ? item.image[0] : '/static/icon/logo.png'"
							mode="aspectFill"></image>
						<!-- 热门标识 -->
						<image v-if="item.is_list === 1" class="hot-icon" src="/static/home/ic_girl_tips.png"
							mode="aspectFit"></image>
						
						<!-- 上架/下架按钮 -->
						<view class="shelf-buttons">
							<!-- 上架按钮 -->
							<view v-if="item.is_list === 0" class="shelf-btn" @click.stop="handleShelfOperate(item, 1)">
								<text class="shelf-btn-text">上架</text>
							</view>
							<!-- 下架按钮 -->
							<view v-if="item.is_list === 1" class="shelf-btn" @click.stop="handleShelfOperate(item, 0)">
								<text class="shelf-btn-text">下架</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-else-if="!loading">
				<image class="empty-icon" src="/static/icon/empty.png" mode="aspectFit"></image>
				<text class="empty-text">暂无茶贴数据</text>
			</view>

			<!-- 加载状态 -->
			<view class="loading-state" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loufengList: [],
				loading: false,
				currentPage: 1,
				limit: 10,
				total: 0,
				hasMore: true
			};
		},
		onLoad() {
			this.loadLoufengList();
		},
		onPullDownRefresh() {
			this.currentPage = 1;
			this.hasMore = true;
			this.loadLoufengList(true);
		},
		onReachBottom() {
			if (this.hasMore && !this.loading) {
				this.currentPage++;
				this.loadLoufengList();
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 加载楼凤列表
			loadLoufengList(refresh = false) {
				if (this.loading) return;
				
				this.loading = true;
				
				const userInfo = getApp().getCache('userInfo');
				if (!userInfo || !userInfo.token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					this.loading = false;
					return;
				}

				const params = {
					page: this.currentPage,
					limit: this.limit
				};

				uni.request({
					url: getApp().globalData.baseUrl + 'api/loufeng/member/datalist',
					method: 'POST',
					header: {
						'token': userInfo.token
					},
					data: params,
					success: (res) => {
						this.loading = false;
						
						if (refresh) {
							uni.stopPullDownRefresh();
						}
						
						if (res.data.code === 200) {
							const data = res.data.data;
							this.total = data.total;
							
							if (refresh || this.currentPage === 1) {
								this.loufengList = data.data || [];
							} else {
								this.loufengList = [...this.loufengList, ...(data.data || [])];
							}
							
							// 判断是否还有更多数据
							this.hasMore = this.currentPage < data.last_page;
						} else {
							uni.showToast({
								title: res.data.msg || '获取数据失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						this.loading = false;
						
						if (refresh) {
							uni.stopPullDownRefresh();
						}
						
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 跳转到楼凤详情页面
			goToLoufengDetail(id) {
				uni.navigateTo({
					url: `/pages/loufeng-detail/loufeng-detail?id=${id}`
				});
			},

			// 处理上架/下架操作
			handleShelfOperate(item, status) {
				const userInfo = getApp().getCache('userInfo');
				if (!userInfo || !userInfo.token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				const actionText = status === 1 ? '上架' : '下架';
				
				uni.showModal({
					title: '确认操作',
					content: `确定要${actionText}这个茶贴吗？`,
					success: (res) => {
						if (res.confirm) {
							this.performShelfOperate(item, status);
						}
					}
				});
			},

			// 执行上架/下架操作
			performShelfOperate(item, status) {
				const userInfo = getApp().getCache('userInfo');
				const actionText = status === 1 ? '上架' : '下架';
				
				uni.showLoading({
					title: `${actionText}中...`
				});

				uni.request({
					url: getApp().globalData.baseUrl + 'api/loufeng/data/shelfoperate',
					method: 'POST',
					header: {
						'token': userInfo.token
					},
					data: {
						id: item.id,
						is_list: status
					},
					success: (res) => {
						uni.hideLoading();
						
						if (res.data.code === 200) {
							uni.showToast({
								title: res.data.msg || `${actionText}成功`,
								icon: 'success'
							});
							
							// 更新本地数据
							const index = this.loufengList.findIndex(loufeng => loufeng.id === item.id);
							if (index !== -1) {
								this.loufengList[index].is_list = status;
							}
						} else {
							uni.showToast({
								title: res.data.msg || `${actionText}失败`,
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
	};
</script>

<style scoped>
	.my-teaposts-page {
		background-color: #eee;
		min-height: 100vh;
	}

	/* 自定义导航栏样式 */
	.custom-navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.navbar-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding: 0 30rpx;
		padding-top: var(--status-bar-height);
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

	.navbar-title {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}

	.placeholder {
		width: 60rpx;
	}

	/* 内容区域 */
	.content-container {
		padding-top: calc(88rpx + var(--status-bar-height));
	}

	/* 楼凤列表样式 */
	.loufeng-list {
		display: flex;
		flex-direction: column;
	}

	.loufeng-item {
		display: flex;
		background-color: #faf7f2;
		margin-top: 15rpx;
		padding: 40rpx 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.left-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.location-tag {
		background-color: #f4c88f;
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #fff;
		align-self: flex-start;
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.info-label {
		font-size: 26rpx;
		color: #b4b4b4;
		flex-shrink: 0;
		min-width: 120rpx;
	}

	.info-value {
		font-size: 26rpx;
		color: #b4b4b4;
		flex: 1;
		white-space: nowrap;
	}

	.right-image {
		margin-top: 50rpx;
		width: 150rpx;
		height: 150rpx;
		flex-shrink: 0;
	}

	.item-image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.hot-icon {
		position: absolute;
		top: 0;
		right: 0;
		width: 80rpx;
		height: 80rpx;
	}

	/* 空状态样式 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-icon {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 30rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 加载状态样式 */
	.loading-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 50rpx 0;
	}

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 上架/下架按钮样式 */
	.shelf-buttons {
		margin-top: 10rpx;
		display: flex;
		justify-content: center;
	}

	.shelf-btn {
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		/* border: 2rpx solid #ff4444; */
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 80rpx;
	}

	.shelf-btn-text {
		font-size: 24rpx;
		color: #ff4444;
		font-weight: bold;
	}
</style>