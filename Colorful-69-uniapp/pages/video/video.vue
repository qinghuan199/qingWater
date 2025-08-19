<template>
	<view class="video-page">
		<view class="search-container">
			<view class="search-box u-flex u-flex-between p-30">
				<view class="icon-50">

				</view>
				<image class="width-150" src="../../static/home/ic_video_title.png" mode="widthFix"></image>
				<view class="search-btn" >
					<image class="icon-45" src="../../static/home/ic_search.png" mode="aspectFit"></image>
				</view>
			</view>
			<!-- 热搜图标 -->
			<view class="hot-search-icon" @click="onSearch">
				<image src="/home/ic_video_hot.png" mode="aspectFit"></image>
			</view>
		</view>


		<!-- 顶部分类导航 -->
		<view class="category-nav">
			<scroll-view class="category-scroll" scroll-x="true" :show-scrollbar="false">
				<view class="category-list">
					<view v-for="(category, index) in categoryList" :key="category.id"
						:class="['category-item', { 'active': selectedCategoryId === category.id }]"
						@click="selectCategory(category)">
						<text class="category-name">{{ category.name }}</text>
					</view>
				</view>
			</scroll-view>
		</view>



		<!-- 视频列表 -->
		<view class="video-content">
			<scroll-view class="video-scroll" scroll-y="true" @scrolltolower="loadMore" :refresher-enabled="true"
				:refresher-triggered="refreshing" @refresherrefresh="onRefresh">
				<view class="video-list">
					<view v-for="video in videoList" :key="video.id" class="video-item" @click="goToVideoDetail(video)">
						<view class="video-cover">
							<image class="cover-img" :src="getImageUrl(video.vod_pic)" mode="aspectFill"
								@error="onImageError"></image>
							<view class="video-duration" v-if="video.vod_duration">
								<text class="duration-text">{{ video.vod_duration }}</text>
							</view>
								<image class="hot-tag" v-if="video.vod_hot === 1" src="/static/home/ic_video_hot.png" mode="aspectFill"></image>
						</view>
						<view class="video-info">
							<view class="video-stats">
								<text class="video-title">{{ video.vod_name }}</text>
								<!-- 		<view class="stats-left">
									<text class="play-count">{{ formatPlayCount(video.vod_score_num) }}次播放</text>
									<text class="create-time" v-if="video.create_time">{{ formatTime(video.create_time) }}</text>
								</view> -->
								<view class="stats-right">
									<image class="icon-30" src="/static/home/ic_video_look.png" mode="aspectFit"></image>
									<text class="play-text">{{video.vod_score_num }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 加载更多提示 -->
				<view class="load-more" v-if="hasMore">
					<text class="load-text" v-if="loading">加载中...</text>
					<text class="load-text" v-else>上拉加载更多</text>
				</view>
				<view class="no-more" v-else-if="videoList.length > 0">
					<text class="no-more-text">没有更多了</text>
				</view>
			</scroll-view>
		</view>

		<!-- 暂无数据提示 -->
		<view v-if="!loading && videoList.length === 0" class="no-data">
			<text class="no-data-text">暂无视频</text>
		</view>

		<!-- 加载提示 -->
		<view v-if="loading && videoList.length === 0" class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>
		<userNav :title='3' />
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
				loading: false,
				refreshing: false,
				categoryList: [],
				selectedCategoryId: null,
				videoList: [],
				searchKeyword: '',
				currentPage: 1,
				limit: 20,
				hasMore: true,
				userInfo: null
			}
		},
		onLoad() {
			this.userInfo = getApp().getCache('userInfo');
			this.initData();
		},
		onShow() {
		},
		methods: {
			// 初始化数据
			initData() {
				this.getCategoryList();
			},

			// 获取视频分类列表
			getCategoryList() {
				var that = this;

				getApp().getData('api/video/itemlist', {}, function(res) {
					if (res.code === 200) {
						that.categoryList = res.data || [];
						// 默认选中第一个分类
						if (that.categoryList.length > 0) {
							that.selectedCategoryId = that.categoryList[0].id;
							that.getVideoList();
						}
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg || '获取分类列表失败',
							showCancel: false
						});
					}
				}, function(error) {
					uni.showModal({
						title: '提示',
						content: '网络错误，请稍后重试',
						showCancel: false
					});
					console.error('获取分类列表网络错误:', error);
				});
			},

			// 获取视频列表
			getVideoList(isLoadMore = false) {
				var that = this;

				if (!isLoadMore) {
					that.loading = true;
					that.currentPage = 1;
					that.hasMore = true;
				}

				var postData = {
					vod_class_id: that.selectedCategoryId,
					page: that.currentPage,
					limit: that.limit
				};

				// 如果有搜索关键词，添加到请求参数
				if (that.searchKeyword.trim()) {
					postData.name = that.searchKeyword.trim();
				}

				getApp().getData('api/video/list', postData, function(res) {
					that.loading = false;
					that.refreshing = false;

					if (res.code === 200) {
						var newData = res.data.data || [];

						if (isLoadMore) {
							that.videoList = that.videoList.concat(newData);
						} else {
							that.videoList = newData;
						}

						// 判断是否还有更多数据
						that.hasMore = that.currentPage < res.data.last_page;
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg || '获取视频列表失败',
							showCancel: false
						});
					}
				}, function(error) {
					that.loading = false;
					that.refreshing = false;
					uni.showModal({
						title: '提示',
						content: '网络错误，请稍后重试',
						showCancel: false
					});
					console.error('获取视频列表网络错误:', error);
				});
			},

			// 选择分类
			selectCategory(category) {
				this.selectedCategoryId = category.id;
				this.searchKeyword = ''; // 清空搜索关键词
				this.getVideoList();
			},

			// 搜索输入
			onSearchInput() {
				// 可以在这里添加实时搜索逻辑
			},

			// 搜索
			onSearch() {
				uni.navigateTo({
					url: '/pages/hot-search/hot-search'
				});
			},

			// 下拉刷新
			onRefresh() {
				this.refreshing = true;
				this.getVideoList();
			},

			// 加载更多
			loadMore() {
				if (this.hasMore && !this.loading) {
					this.currentPage++;
					this.getVideoList(true);
				}
			},

			// 跳转到视频详情
			goToVideoDetail(video) {
				uni.navigateTo({
					url: `/pages/video-detail/video-detail?id=${video.id}`
				});
			},

			// 图片加载错误处理
			onImageError(e) {
				// 可以设置默认图片
				console.log('图片加载失败:', e);
			},

			// 格式化播放次数
			formatPlayCount(count) {
				if (!count) return '0';
				if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万';
				}
				return count.toString();
			},

			// 格式化时间
			formatTime(timestamp) {
				if (!timestamp) return '';
				var date = new Date(timestamp * 1000);
				var now = new Date();
				var diff = now.getTime() - date.getTime();
				var days = Math.floor(diff / (24 * 3600 * 1000));

				if (days === 0) {
					return '今天';
				} else if (days === 1) {
					return '昨天';
				} else if (days < 7) {
					return days + '天前';
				} else {
					return date.getMonth() + 1 + '月' + date.getDate() + '日';
				}
			},

			// 跳转到搜索页面
			goToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},

			// 获取完整的图片URL
			getImageUrl(imageUrl) {
				if (!imageUrl) return '/static/03.png';

				// 开发环境直接使用原始路径（假设图片服务器可访问）
				if (process.env.NODE_ENV === 'development') {
					return imageUrl.startsWith('/') ?
						`http://103.43.71.158${imageUrl}` // 补全开发环境地址
						:
						imageUrl;
				}

				// 生产环境
				return imageUrl.startsWith('/') ?
					`http://103.43.71.158${imageUrl}` :
					imageUrl;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video-page {
		background-color: #fff;
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	
	.search-container {
		position: relative;
	}
	
	.hot-search-icon {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 999;
	}
	
	.hot-search-icon image {
		width: 100%;
		height: 100%;
	}

	// 分类导航
	.category-nav {
	  background-color: #fff;
	  padding: 20rpx 0;
	  border-bottom: 1rpx solid #f0f0f0;
	  height: 80rpx; // 固定高度
	}
	
	.category-scroll {
	  white-space: nowrap;
	  padding: 0 20rpx;
	  box-sizing: border-box;
	  height: 100%;
	}
	
	.category-list {
	  display: flex;
	  align-items: center;
	  height: 100%;
	}
	
	.category-item {
	  padding: 15rpx 30rpx;
	  margin-right: 20rpx;
	  transition: all 0.3s;
	  flex-shrink: 0;
	}
	
	.category-name {
	  font-size: 28rpx;
	  color: #333;
	  white-space: nowrap;
	  transition: all 0.3s;
	  display: inline-block; // 必须设置为inline-block
	}
	
	.category-item.active .category-name {
	  color: #ff4757;
	  font-weight: 500;
	  transform: scale(1.5);
	}

	// 视频内容
	.video-content {
		flex: 1;
		overflow: hidden;
	}

	.video-scroll {
		height: 100%;
	}

	.video-list {
		padding: 20rpx;
	}

	.video-item {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 15rpx;
		margin-bottom: 30rpx;
		// box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		transition: all 0.3s;
	}

	.video-item:active {
		transform: scale(0.98);
	}

	.video-cover {
		position: relative;
		width: 100%;
		height: 380rpx;
		border-radius: 10rpx;
		overflow: hidden;
		/* 确保超出部分被隐藏 */
		margin-bottom: 15rpx;
	}

	.cover-img {
		width: 100%;
		height: 100%;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 6rpx;
		padding: 4rpx 8rpx;
	}

	.duration-text {
		font-size: 20rpx;
		color: #fff;
	}

	.hot-tag {
		position: absolute;
		top: 0;
		right: 0;
		width: 100rpx;
		height: 100rpx;
	
	}

	.hot-text {
		font-size: 24rpx;
		color: #fff;
		display: block;
		// transform: rotate(-30deg);
		/* 反向旋转文字使其水平 */
		text-align: center;
	}

	.video-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.video-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.video-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10rpx;
	}

	.video-stats .stats-left {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.video-stats .stats-right {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.play-count {
		font-size: 24rpx;
		color: #666;
	}

	.create-time {
		font-size: 24rpx;
		color: #999;
	}

	.eye-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.play-text {
		font-size: 24rpx;
		color: #666;
	}

	// 加载提示
	.load-more {
		padding: 30rpx;
		text-align: center;
	}

	.load-text {
		font-size: 28rpx;
		color: #666;
	}

	.no-more {
		padding: 30rpx;
		text-align: center;
	}

	.no-more-text {
		font-size: 28rpx;
		color: #999;
	}

	.no-data {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.no-data-text {
		font-size: 32rpx;
		color: #999;
	}

	.loading-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 10rpx;
		z-index: 9999;
	}

	.loading-text {
		font-size: 28rpx;
	}
</style>