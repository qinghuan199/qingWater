<template>
	<view class="address-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="title">选择城市</text>
			<view class="placeholder"></view>
		</view>

		<!-- 已选择省份提示 -->
	<!-- 	<view v-if="hasSelectedProvince && selectedProvince" class="selected-province">
			<text class="province-text">{{ selectedProvince }}</text>
		</view> -->

		<!-- 地址列表 -->
		<view class="address-list">
			<!-- 全国选项（仅在顶级显示） -->
			<view v-if="!hasSelectedProvince" class="address-item" @click="selectNational">
				<text class="address-name">全国</text>
				<!-- <text class="address-arrow">›</text> -->
			</view>

			<view v-for="item in addressList" :key="item.id" class="address-item" @click="selectAddress(item)">
				<text class="address-name">{{ item.name }}</text>
				<!-- <text class="address-arrow">›</text> -->
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>

		<!-- 暂无数据 -->
		<view v-if="!loading && addressList.length === 0 && hasSelectedProvince" class="no-data">
			<text class="no-data-text">暂无数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
				currentPid: 0, // 当前父级ID，0表示省级
				loading: false,
				breadcrumb: [], // 面包屑导航
				hasSelectedProvince: false, // 是否已选择省份
				selectedProvince: '', // 选择的省份名称
				selectCity: false, // 是否来自城市选择
				fieldName: '', // 字段名
				fromIndex: false, // 是否来自首页
				from: '' // 来源页面标识
			}
		},
		onLoad(options) {
			// 获取传入的pid参数
			if (options.pid) {
				this.currentPid = parseInt(options.pid);
				// 如果有pid参数，说明已经选择了省份
				this.hasSelectedProvince = true;
			}

			// 获取城市选择相关参数
			if (options.selectCity) {
				this.selectCity = options.selectCity === 'true';
			}
			if (options.fieldName) {
				this.fieldName = options.fieldName;
			}
			if (options.fromIndex) {
				this.fromIndex = options.fromIndex === 'true';
			}
			if (options.from) {
				this.from = options.from;
			}

			this.getAddressList();
		},
		methods: {
			// 获取地址列表
			getAddressList() {
				this.loading = true;
				uni.request({
					url: getApp().globalData.baseUrl + 'api/expert/address',
					method: 'GET',
					data: {
						pid: this.currentPid
					},
					success: (res) => {
						this.loading = false;
						if (res.data.code === 200) {
							this.addressList = res.data.data;
						} else {
							uni.showToast({
								title: res.data.msg || '获取地址失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						this.loading = false;
						console.error('获取地址失败:', err);
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 选择地址
			selectAddress(item) {
				if (this.currentPid === 0) {
					// 当前是省级，标记已选择省份并切换到市区级
					this.hasSelectedProvince = true;
					this.currentPid = item.id;
					this.selectedProvince = item.name;
					// 重新获取市区级数据
					this.getAddressList();
				} else {
				// 当前是市区级，选择完成
				console.log('地址选择调试信息:', {
					selectCity: this.selectCity,
					fieldName: this.fieldName,
					fromIndex: this.fromIndex,
					from: this.from
				});
				if (this.selectCity && this.fieldName) {
					uni.setStorageSync('selectedRechargeAddress', {
						id: item.id,
						name: item.name
					});
					// 来自service-recharge页面，返回到充值页面
					const pages = getCurrentPages();
					const prevPage = pages[pages.length - 2]; // 获取上一个页面

					if (prevPage && prevPage.route === 'pages/service-recharge/service-recharge') {
						// 使用$set确保响应式更新
						prevPage.$vm.$set(prevPage.$vm.formData, this.fieldName, item.name);
					}

					uni.showToast({
						title: '地址选择成功',
						icon: 'success'
					});

					// 返回到service-recharge页面
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else if (this.from === 'shopAuth') {
					// 来自茶铺认证页面
					const addressData = {
						province_id: this.currentPid, // 省份ID
						city_id: item.id, // 城市ID
						area_id: 0, // 地区ID（暂时为0）
						fullAddress: this.selectedProvince + ' ' + item.name
					};
					uni.setStorageSync('shopAuthSelectedAddress', addressData);

					uni.showToast({
						title: '地址选择成功',
						icon: 'success'
					});

					// 返回茶铺认证页面
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else if (this.fromIndex) {
					// 来自首页，保存地址并返回首页
					uni.setStorageSync('selectedAddress', {
						id: item.id,
						name: item.name
					});
					
					

					// 触发全局事件通知首页更新
					uni.$emit('addressSelected', {
						id: item.id,
						name: item.name
					});

					uni.showToast({
						title: '地址选择成功',
						icon: 'success'
					});

					// 返回首页
					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						});
					}, 1000);
				}
			}
			},

			// 选择全国
			selectNational() {
				if (this.selectCity && this.fieldName) {
					// 来自service-recharge页面
					const pages = getCurrentPages();
					const prevPage = pages[pages.length - 2];

					if (prevPage && prevPage.route === 'pages/service-recharge/service-recharge') {
						// 使用$set确保响应式更新
						prevPage.$vm.$set(prevPage.$vm.formData, this.fieldName, '全国');
					}

					uni.showToast({
						title: '已选择全国',
						icon: 'success'
					});

					// 返回到service-recharge页面
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else {
					// 来自首页或其他页面
					// 清除缓存的地址信息
					uni.removeStorageSync('selectedAddress');

					// 触发全局事件通知首页更新为全国
					uni.$emit('addressSelected', {
						id: 0,
						name: '全国'
					});

					uni.showToast({
						title: '已选择全国',
						icon: 'success'
					});

					// 返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				}
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped>
	.address-page {
		background-color: #f5f5f5;
		min-height: 100vh;
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

	/* 已选择省份提示 */
	.selected-province {
		padding: 20rpx 40rpx;
		background-color: #f8f8f8;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.province-text {
		font-size: 28rpx;
		color: #666;
	}

	.address-list {
		margin-top: 10rpx;
	}

	.address-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 40rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #000;
	}

	/* 当已选择省份时（即选择市级时），取消底部边框 */
	.address-item:last-child {
		border-bottom: none;
	}

	.address-item:active {
		background-color: #fff;
	}

	.address-name {
		font-size: 30rpx;
		color: #333;
		flex: 1;
	}

	.address-arrow {
		font-size: 32rpx;
		color: #999;
		font-weight: bold;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.no-data {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 400rpx;
	}

	.no-data-text {
		font-size: 32rpx;
		color: #666;
		padding: 60rpx;
		color: #999;
		font-size: 28rpx;
	}
</style>