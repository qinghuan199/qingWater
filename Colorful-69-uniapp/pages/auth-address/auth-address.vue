<template>
	<view class="address-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="title">{{ getTitle() }}</text>
			<view class="placeholder"></view>
		</view>

		<!-- 面包屑导航 -->
		<view v-if="currentLevel > 0" class="breadcrumb">
			<text v-if="selectedProvince" class="breadcrumb-item">{{ selectedProvince }}</text>
			<text v-if="selectedCity && currentLevel === 2" class="breadcrumb-separator"> > </text>
			<text v-if="selectedCity && currentLevel === 2" class="breadcrumb-item">{{ selectedCity }}</text>
		</view>

		<!-- 地址列表 -->
		<view class="address-list">
			<!-- 全国选项（仅在省级选择时显示） -->
			<view v-if="currentLevel === 0" class="address-item" @click="selectNational">
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
		<view v-if="!loading && addressList.length === 0 && currentLevel > 0" class="no-data">
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
				hasSelectedCity: false, // 是否已选择城市
				selectedProvince: '', // 选择的省份名称
				selectedCity: '', // 选择的城市名称
				selectedProvinceId: 0, // 选择的省份ID
				selectedCityId: 0, // 选择的城市ID
			currentLevel: 0, // 当前选择级别：0-省，1-市，2-区
			from: '' // 来源页面标识
			}
		},
		onLoad(options) {
			// 获取传入的pid参数
			if (options.pid) {
				this.currentPid = parseInt(options.pid);
				// 根据pid判断当前级别
				if (this.currentPid > 0) {
					this.currentLevel = 1; // 市级
					this.hasSelectedProvince = true;
				}
			}

			// 获取级别参数
			if (options.level) {
				this.currentLevel = parseInt(options.level);
			}

			// 获取已选择的省市信息
			if (options.provinceName) {
				this.selectedProvince = decodeURIComponent(options.provinceName);
				this.hasSelectedProvince = true;
			}
			if (options.provinceId) {
				this.selectedProvinceId = parseInt(options.provinceId);
			}
			if (options.cityName) {
				this.selectedCity = decodeURIComponent(options.cityName);
				this.hasSelectedCity = true;
			}
			if (options.cityId) {
				this.selectedCityId = parseInt(options.cityId);
			}

			// 获取来源页面标识
			if (options.from) {
				this.from = options.from;
			}

			this.getAddressList();
		},
		methods: {
			// 获取标题
			getTitle() {
				switch(this.currentLevel) {
					case 0: return '选择省份';
					case 1: return '选择城市';
					case 2: return '选择地区';
					default: return '选择地址';
				}
			},

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
				if (this.currentLevel === 0) {
					// 选择省份，进入城市选择
					this.selectedProvince = item.name;
					this.selectedProvinceId = item.id;
					this.hasSelectedProvince = true;
					this.currentLevel = 1;
					this.currentPid = item.id;
					this.getAddressList();
				} else if (this.currentLevel === 1) {
					// 选择城市，进入地区选择
					this.selectedCity = item.name;
					this.selectedCityId = item.id;
					this.hasSelectedCity = true;
					this.currentLevel = 2;
					this.currentPid = item.id;
					this.getAddressList();
				} else if (this.currentLevel === 2) {
					// 选择地区，完成三级选择
					this.completeSelection(item);
				}
			},

			// 完成地址选择
			completeSelection(areaItem) {
				console.log('地址选择调试信息:', {
					from: this.from
				});
				
				if (this.from === 'shopAuth') {
					// 来自茶铺认证页面，保存完整的三级地址信息
					const addressData = {
						province_id: this.selectedProvinceId, // 省份ID
						city_id: this.selectedCityId, // 城市ID
						area_id: areaItem.id, // 地区ID
						fullAddress: this.selectedProvince + ' ' + this.selectedCity + ' ' + areaItem.name
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
				} else if (this.from === 'teapostAuth') {
					// 来自发布茶贴页面，保存完整的三级地址信息
					const addressData = {
						province_id: this.selectedProvinceId, // 省份ID
						city_id: this.selectedCityId, // 城市ID
						area_id: areaItem.id, // 地区ID
						fullAddress: this.selectedProvince + ' ' + this.selectedCity + ' ' + areaItem.name
					};
					uni.setStorageSync('teapostAuthSelectedAddress', addressData);
					
					uni.showToast({
						title: '地址选择成功',
						icon: 'success'
					});

					// 返回发布茶贴页面
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else if (this.from === 'personalAuth') {
					// 来自个人认证页面，保存完整的三级地址信息
					const addressData = {
						province_id: this.selectedProvinceId, // 省份ID
						city_id: this.selectedCityId, // 城市ID
						area_id: areaItem.id, // 地区ID
						fullAddress: this.selectedProvince + ' ' + this.selectedCity + ' ' + areaItem.name
					};
					uni.setStorageSync('personalAuthSelectedAddress', addressData);

					uni.showToast({
						title: '地址选择成功',
						icon: 'success'
					});

					// 返回个人认证页面
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				}
			},

			// 选择全国
			selectNational() {
				if (this.from === 'shopAuth') {
					// 来自茶铺认证页面
					const addressData = {
						province_id: 0,
						city_id: 0,
						area_id: 0,
						fullAddress: '全国'
					};
					uni.setStorageSync('shopAuthSelectedAddress', addressData);
					
					uni.showToast({
						title: '已选择全国',
						icon: 'success'
					});

					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else if (this.from === 'teapostAuth') {
					// 来自发布茶贴页面
					const addressData = {
						province_id: 0,
						city_id: 0,
						area_id: 0,
						fullAddress: '全国'
					};
					uni.setStorageSync('teapostAuthSelectedAddress', addressData);
					
					uni.showToast({
						title: '已选择全国',
						icon: 'success'
					});

					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else if (this.from === 'personalAuth') {
					// 来自个人认证页面
					const addressData = {
						province_id: 0,
						city_id: 0,
						area_id: 0,
						fullAddress: '全国'
					};
					uni.setStorageSync('personalAuthSelectedAddress', addressData);
					
					uni.showToast({
						title: '已选择全国',
						icon: 'success'
					});

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

	/* 面包屑导航 */
	.breadcrumb {
		padding: 20rpx 40rpx;
		background-color: #f8f8f8;
		border-bottom: 1rpx solid #e0e0e0;
		display: flex;
		align-items: center;
	}

	.breadcrumb-item {
		font-size: 28rpx;
		color: #666;
	}

	.breadcrumb-separator {
		font-size: 24rpx;
		color: #999;
		margin: 0 10rpx;
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
		border-bottom: 1rpx solid #666;
	}

	.address-item:active {
		background-color: #f0f0f0;
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