<template>
	<view class="expert-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<view class="header-title">达人列表</view>
			<view class="header-right"></view>
		</view>

		<!-- 搜索和筛选 -->
		<view class="filter-section">
			<SearchBox placeholder="搜索达人名称..." iconSrc="../../static/home/ic_search.png" @search="onSearch" />
			<view class="filter-row">
				<view class="filter-item" @click="showAddressPicker">
					<text class="filter-text">{{selectedAddress || '选择地区'}}</text>
					<image class="filter-arrow" src="../../static/icon/arrow_down.png" mode="widthFix"></image>
				</view>
				<view class="filter-reset" @click="resetFilter">
					<text class="reset-text">重置</text>
				</view>
			</view>
		</view>

		<!-- 达人列表 -->
		<scroll-view class="expert-list-container" scroll-y="true" @scrolltolower="loadMore">
			<view class="expert-grid">
				<view class="expert-card" v-for="(item, index) in expertList" :key="index" @click="goToExpertDetail(item.id)">
					<view class="card-image-container">
						<image class="card-image" :src="item.img_url[0]" mode="aspectFill"></image>
						<view class="card-badge" v-if="item.amount">
							<text class="badge-text">¥{{item.amount}}</text>
						</view>
						<view class="card-video-icon" v-if="item.pvideo">
							<image class="video-icon" src="../../static/icon/play.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="card-info">
						<text class="card-name">{{item.xuanfei_name}}</text>
						<view class="card-location" v-if="item.province && item.city">
							<text class="location-text">{{item.province.name}} {{item.city.name}}</text>
						</view>
						<view class="card-stats">
							<text class="stats-text">观看 {{item.chakan || 0}}</text>
							<text class="stats-text">点赞 {{item.likenumber || 0}}</text>
						</view>
						<view class="card-actions">
							<view class="action-btn" @click.stop="toggleLike(item, index)">
								<image class="action-icon" 
									:src="item.is_likenumber == 1 ? '../../static/home/ic_like_select.png' : '../../static/home/ic_like_normal.png'" 
									mode="aspectFit"></image>
							</view>
							<view class="action-btn" @click.stop="toggleFavorite(item, index)">
								<image class="action-icon" 
									:src="item.is_favorite == 1 ? '../../static/home/ic_video_collect_select.png' : '../../static/home/ic_video_collect_normal.png'" 
									mode="aspectFit"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore">
				<text class="load-text">{{loading ? '加载中...' : '上拉加载更多'}}</text>
			</view>
			<view class="no-more" v-else-if="expertList.length > 0">
				<text class="no-more-text">没有更多了</text>
			</view>
			<view class="empty" v-else-if="!loading">
				<text class="empty-text">暂无达人数据</text>
			</view>
		</scroll-view>

		<!-- 地区选择器 -->
		<u-picker
			ref="addressPicker"
			v-model="showPicker"
			mode="linkage"
			:range="addressData"
			range-key="name"
			@confirm="onAddressConfirm"
			@cancel="showPicker = false"
		></u-picker>
	</view>
</template>

<script>
import SearchBox from '@/components/SearchBox/SearchBox.vue';

export default {
	components: {
		SearchBox
	},
	data() {
		return {
			expertList: [],
			addressData: [],
			selectedAddress: '',
			selectedAddressId: 0,
			searchKeyword: '',
			currentPage: 1,
			pageSize: 20,
			hasMore: true,
			loading: false,
			showPicker: false
		}
	},
	onLoad() {
		this.getAreaList();
		this.getExpertList();
		// 监听详情页的刷新事件
		uni.$on('expertListRefresh', () => {
			this.currentPage = 1;
			this.getExpertList(true);
		});
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
		
		// 页面显示时刷新列表，确保从详情页返回时状态正确
		if (this.expertList.length > 0) {
			this.currentPage = 1;
			this.getExpertList(true);
		}
	},
	onUnload() {
		// 页面卸载时移除事件监听
		uni.$off('expertListRefresh');
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		// 搜索
		onSearch(keyword) {
			this.searchKeyword = keyword;
			this.currentPage = 1;
			this.getExpertList(true);
		},
		// 显示地区选择器
		showAddressPicker() {
			this.showPicker = true;
		},
		// 地区选择确认
		onAddressConfirm(e) {
			const selectedItem = e.value[e.value.length - 1];
			this.selectedAddress = selectedItem.name;
			this.selectedAddressId = selectedItem.id;
			this.currentPage = 1;
			this.getExpertList(true);
			this.showPicker = false;
		},
		// 重置筛选
		resetFilter() {
			this.selectedAddress = '';
			this.selectedAddressId = 0;
			this.searchKeyword = '';
			this.currentPage = 1;
			this.getExpertList(true);
		},
		// 获取地区列表
		getAreaList() {
			var that = this;
			var userInfo = getApp().getCache('userInfo');
			var postData = {
				token: userInfo.token
			};
			
			getApp().getData('api/expert/address', postData, function(res) {
				if (res.code == 200) {
					that.addressData = res.data || [];
				} else {
					console.log('获取地区列表失败:', res.msg);
				}
			});
		},
		// 获取达人列表
		getExpertList(reset = false) {
			if (this.loading) return;
			
			this.loading = true;
			var that = this;
			var userInfo = getApp().getCache('userInfo');
			var postData = {
				token: userInfo.token,
				page: reset ? 1 : this.currentPage,
				limit: this.pageSize
			};
			
			// 添加筛选条件
			if (this.selectedAddressId) {
				postData.province_id = this.selectedAddressId;
			}
			if (this.searchKeyword) {
				postData.keyword = this.searchKeyword;
			}
			
			getApp().getData('api/expert/list', postData, function(res) {
				that.loading = false;
				if (res.code == 200) {
					if (reset) {
						that.expertList = res.data || [];
						that.currentPage = 1;
					} else {
						that.expertList = that.expertList.concat(res.data || []);
					}
					that.hasMore = res.data && res.data.length >= that.pageSize;
				} else {
					uni.showToast({
						title: res.msg || '获取列表失败',
						icon: 'none'
					});
				}
			});
		},
		// 加载更多
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.currentPage++;
				this.getExpertList();
			}
		},
		// 跳转到达人详情
		goToExpertDetail(expertId) {
			uni.navigateTo({
				url: '/pages/expert-detail/expert-detail?id=' + expertId
			});
		},
		// 切换点赞状态
		toggleLike(item, index) {
			var that = this;
			var userInfo = getApp().getCache('userInfo');
			if (!userInfo || !userInfo.token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			var postData = {
				type: 1, // 达人类型
				operate: item.is_likenumber == 1 ? 2 : 1, // 1点赞 2取消点赞
				info_id: item.id
			};
			
			getApp().getData('api/likenumber/operate', postData, function(res) {
				if (res.code == 200) {
					// 更新列表中的状态
					that.expertList[index].is_likenumber = that.expertList[index].is_likenumber == 1 ? 0 : 1;
					that.expertList[index].likenumber += that.expertList[index].is_likenumber == 1 ? 1 : -1;
					if (that.expertList[index].likenumber < 0) {
						that.expertList[index].likenumber = 0;
					}
					uni.showToast({
						title: that.expertList[index].is_likenumber == 1 ? '点赞成功' : '取消点赞',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: res.msg || '操作失败',
						icon: 'none'
					});
				}
			});
		},
		// 切换收藏状态
		toggleFavorite(item, index) {
			var that = this;
			var userInfo = getApp().getCache('userInfo');
			if (!userInfo || !userInfo.token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			var postData = {
				type: 1, // 达人类型
				operate: item.is_favorite == 1 ? 2 : 1, // 1收藏 2取消收藏
				info_id: item.id
			};
			
			getApp().getData('api/favorite/operate', postData, function(res) {
				if (res.code == 200) {
					// 更新列表中的状态
					that.expertList[index].is_favorite = that.expertList[index].is_favorite == 1 ? 0 : 1;
					that.expertList[index].favorites += that.expertList[index].is_favorite == 1 ? 1 : -1;
					if (that.expertList[index].favorites < 0) {
						that.expertList[index].favorites = 0;
					}
					uni.showToast({
						title: that.expertList[index].is_favorite == 1 ? '收藏成功' : '取消收藏',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: res.msg || '操作失败',
						icon: 'none'
					});
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.expert-page {
	height: 100vh;
	background-color: #f5f5f5;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
}

.header-left, .header-right {
	width: 80rpx;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
}

.header-title {
	font-size: 32rpx;
	color: #333;
}

.filter-section {
	padding: 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;
}

.filter-row {
	display: flex;
	align-items: center;
	margin-top: 20rpx;
}

.filter-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.filter-text {
	font-size: 28rpx;
	color: #333;
}

.filter-arrow {
	width: 24rpx;
	height: 24rpx;
}

.filter-reset {
	padding: 20rpx 30rpx;
	background-color: #ea2d38;
	border-radius: 10rpx;
}

.reset-text {
	font-size: 28rpx;
	color: #fff;
}

.expert-list-container {
	height: calc(100vh - 300rpx);
	padding: 0 20rpx;
}

.expert-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.expert-card {
	width: 48%;
	background-color: #fff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.card-image-container {
	position: relative;
	width: 100%;
	height: 300rpx;
}

.card-image {
	width: 100%;
	height: 100%;
}

.card-badge {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
	border-radius: 20rpx;
	padding: 4rpx 12rpx;
}

.badge-text {
	color: #fff;
	font-size: 20rpx;
	font-weight: bold;
}

.card-video-icon {
	position: absolute;
	bottom: 10rpx;
	right: 10rpx;
	width: 40rpx;
	height: 40rpx;
	background-color: rgba(0,0,0,0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.video-icon {
	width: 20rpx;
	height: 20rpx;
}

.card-info {
	padding: 20rpx;
}

.card-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-location {
	margin-bottom: 10rpx;
}

.location-text {
	font-size: 24rpx;
	color: #666;
}

.card-stats {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
}

.stats-text {
	font-size: 22rpx;
	color: #999;
}

.card-actions {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 20rpx;
}

.action-btn {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: #f8f8f8;
	transition: all 0.3s ease;
}

.action-btn:active {
	transform: scale(0.9);
	background-color: #e8e8e8;
}

.action-icon {
	width: 24rpx;
	height: 24rpx;
}

.load-more, .no-more, .empty {
	padding: 40rpx;
	text-align: center;
}

.load-text, .no-more-text, .empty-text {
	font-size: 28rpx;
	color: #999;
}
</style>