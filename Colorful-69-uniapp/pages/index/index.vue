<template>
	<view class="page-container">
		<!-- 下载APP弹窗 -->
		<view class="app-download-modal" v-if="showDownloadModal" @click="closeDownloadModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">下载APP，观看实时直播</text>
					<text class="close-btn" @click="closeDownloadModal">×</text>
				</view>
				<view class="modal-body">
					<text class="modal-desc">播放更流畅，全网唯一无广告无码平台</text>
					<view class="download-section">
						<text class="download-text" @click="downloadApp">点击下载APP</text>
						<image class="qr-code" src="https://69cm.me/app/pictrue/code.jpg" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 吸顶导航 -->
		<view class="sticky-header">
			<!-- 自定义标签页 -->
			<view class="tab-container">
				<view class="tab-item" :class="{ active: currentTab === '外围包养' }" @click="switchTab('外围包养')">
					<text class="tab-text">外围/包养</text>
				</view>
				<view class="tab-item" :class="{ active: currentTab === '创作' }" @click="switchTab('创作')">
					<text class="tab-text">创作</text>
				</view>
				<view class="tab-item" :class="{ active: currentTab === '缴费' }" @click="switchTab('缴费')">
					<text class="tab-text">缴费</text>
				</view>
				<view class="tab-item" :class="{ active: currentTab === '楼凤' }" @click="switchTab('楼凤')">
					<text class="tab-text">楼凤</text>
				</view>
			</view>
			<view class="location-btn" @click="goToAddress"
				v-if="currentTab !== '创作' && currentTab !== '缴费' && currentTab !== '楼凤'">
				<image class="icon-25" src="/static/home/ic_location.png" mode="aspectFit"></image>
				<text class="location-text">{{selectedAddress}}</text>
			</view>
			<!-- 发布创作区域 -->
			<view class="publish-creation-section" v-if="currentTab == '创作' ">
				<view class="publish-creation-btn" @click="goToPublish">
					<text class="publish-creation-text">发布创作</text>
				</view>
			</view>
		</view>


		<!-- 可滚动内容区域 -->
		<scroll-view class="content" scroll-y="true" @scrolltolower="loadMorePopularExperts" lower-threshold="100">
			<view class="height-120">
			</view>
			<!-- 轮播图 -->
			<view class="banner-section" v-if="currentTab === '外围包养'">
				<swiper class="banner-swiper" :autoplay="true" :interval="3000" :duration="500" :circular="true"
					indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
					<swiper-item v-for="(item, index) in bannerList" :key="index">
						<image class="banner-image" :src="item" mode="widthFix"></image>
					</swiper-item>
				</swiper>
			</view>

			<!-- 达人相关内容 -->
			<view v-if="currentTab === '外围包养'">
				<!-- 推荐达人模块 -->
				<view class="expert-section" v-if="expertList.length > 0">
					<view class="section-title">
						<text class="title-text">热门推荐</text>
						<!-- <text class="more-text" @click="goToExpertList">更多 ></text> -->
					</view>
					<scroll-view class="expert-scroll" scroll-x="true" show-scrollbar="false">
						<view class="expert-list">
							<view class="expert-item" v-for="(item, index) in expertList" :key="index"
								@click="goToExpertDetail(item.id)">
								<view class="expert-image-container">
									<image class="expert-image" :src="item.img_url[0]" mode="aspectFill"></image>
								</view>
								<!-- 	<view class="expert-info">
									<text class="expert-name">{{item.xuanfei_name}}</text>
								</view> -->
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 人气达人模块 -->
				<view class="popular-expert-section">
					<view class="section-title">
						<text class="title-text">人气达人</text>
						<!-- <text class="more-text" @click="goToExpertList">更多 ></text> -->
					</view>
					<view class="popular-expert-scroll">
						<view class="popular-expert-grid">
							<view class="popular-expert-item" v-for="(item, index) in popularExpertList" :key="index"
								@click="goToExpertDetail(item.id)">
								<view class="popular-expert-image-container">
									<image class="popular-expert-image" :src="item.img_url[0]" mode="aspectFill">
									</image>
								</view>
								<view class="popular-expert-info">
									<text class="popular-expert-name">{{item.xuanfei_name}}</text>
									<view class="popular-expert-views">
										<image class="icon-20" src="/static/home/ic_hot.png" mode="aspectFill"></image>
										<text class="m-l-5 font-size-13 font-black"> {{item.chakan}}</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 加载更多状态 -->
						<view class="load-more" v-if="popularExpertList.length > 0">
							<text v-if="popularLoading">加载中...</text>
							<text v-else-if="popularNoMore">没有更多了</text>
							<text v-else>上拉加载更多</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 创作页面 -->
			<view v-if="currentTab === '创作'" class="creation-page">
				<scroll-view class="video-scroll-view" scroll-y="true" @scrolltolower="loadMoreShortVideos"
					refresher-enabled="true" :refresher-triggered="shortVideoRefreshing"
					@refresherrefresh="onRefreshShortVideo" lower-threshold="100">

					<!-- 视频列表 -->
					<view class="list-container">
						<view v-if="shortVideoLoading && shortVideoList.length === 0" class="loading-container">
							<text class="loading-text">加载中...</text>
						</view>

						<view v-else-if="shortVideoList.length === 0 && !shortVideoLoading" class="empty-container">
							<text class="empty-text">暂无视频内容</text>
						</view>

						<view v-else class="grid-container">
							<view v-for="(item, index) in shortVideoList" :key="item.id" class="grid-item"
								@click="goToShortVideo(index)">
								<image class="grid-cover"
									:src="item.cover || item.header_img || '/static/icon/default-avatar.png'"
									mode="aspectFill"></image>
								<view class="grid-info">
									<text class="grid-title">{{ item.name || '未知视频' }}</text>
									<view class="grid-stats">
										<view class="stat-item">
											<image class="stat-icon" src="/static/home/ic_video_collect_normal.png"
												mode="aspectFit"></image>
											<text class="stat-num">{{ item.likenumber || '0' }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 加载更多提示 -->
					<view v-if="shortVideoLoading && shortVideoList.length > 0" class="loading-more">
						<text class="loading-more-text">加载中...</text>
					</view>
					<view v-else-if="!shortVideoHasMore && shortVideoList.length > 0" class="no-more">
						<text class="no-more-text">没有更多了</text>
					</view>
				</scroll-view>
			</view>

			<!-- 楼凤页面 -->
			<view v-if="currentTab === '楼凤'" class="loufeng-page">
				<!-- 顶部两个按钮 -->
				<view class="top-buttons">
					<view class="button-item" @click="goToAgentAuth">
						<image class="button-icon" src="/static/home/ic_girl1.png" mode="aspectFit"></image>
						<text class="button-text">代理认证</text>
					</view>
					<view class="button-item" @click="goToPublishTeapost">
						<image class="button-icon" src="/static/home/ic_girl2.png" mode="aspectFit"></image>
						<text class="button-text">发布茶贴</text>
					</view>
				</view>
				<!-- 金牌认证 -->
				<view class="section-title">
					<text class="title-text">金牌认证</text>
				</view>
				<!-- 茶友分享标题 -->
				<view class="section-title">
					<text class="title-text">茶友分享</text>
				</view>

				<!-- 楼凤列表 -->
				<view class="loufeng-list">
					<view v-for="(item, index) in loufengList" :key="item.id" class="loufeng-item"
						@click="goToLoufengDetail(item.id)">
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
							<image v-if="item.is_list === 1" class="hot-icon" src="/static/home/ic_video_hot.png"
								mode="aspectFit"></image>
						</view>
					</view>
				</view>
			</view>

			<!-- 生活服务页面 -->
			<view v-if="currentTab === '缴费'" class="life-service-page">
				<view class="p-30-0 title-text ">生活服务</view>
				<!-- 服务网格 -->
				<view class="service-grid">
					<view v-for="(item, index) in rechargeProductList" :key="item.id" class="service-item"
						@click="goToService(item.id)">
						<view class="service-content">
							<image class="service-icon" :src="item.thumb_img || '/static/home/ic_default_recharge.png'"
								mode="aspectFit"></image>
							<text class="service-text">{{ item.name }}</text>
						</view>
					</view>
				</view>

				<!-- 服务说明 -->
				<view class="service-notice">
					<text class="notice-title">服务说明：</text>
					<text class="notice-text">1、请认准69传媒官方渠道，避免财产损失。</text>
					<text class="notice-text">2、下单请仔细核对充值金额，并认真填写充值账号。</text>
				</view>
			</view>
		</scroll-view>
		<userNav :title='1' />
	</view>
</template>

<script>
	import {
		checkUpdate
	} from "@/components/yzhua006-update/js/app-update-check.js";
	import SearchBox from '@/components/SearchBox/SearchBox.vue';
	export default {
		components: {
			SearchBox
		},
		onPullDownRefresh() {
			var that = this;
			// that.initData();
			uni.stopPullDownRefresh();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		data() {
			return {
				userInfo: getApp().getCache('userInfo'),
				showDownloadModal: false, // 控制下载弹窗显示
				bannerList: [], // 轮播图列表
				expertList: [], // 推荐达人列表
				popularExpertList: [], // 人气达人列表
				popularPage: 1, // 人气达人当前页码
				popularLoading: false, // 人气达人加载状态
				popularNoMore: false, // 人气达人是否没有更多
				selectedAddress: '选择城市', // 选中的地址
				address_id: null, // 选中的城市ID
				selectCityFieldName: '', // 从service-recharge页面传递的字段名
				currentTab: '外围包养', // 当前选中的选项卡
				shortVideoList: [], // 短视频列表
				shortVideoPage: 1, // 短视频当前页码
				shortVideoLoading: false, // 短视频加载状态
				shortVideoHasMore: true, // 短视频是否还有更多数据
				shortVideoLimit: 10, // 短视频每页数量
				shortVideoRefreshing: false, // 短视频列表刷新状态
				rechargeProductList: [], // 充值产品列表
				loufengList: [], // 楼凤列表
				loufengPage: 1, // 楼凤当前页码
				loufengLoading: false, // 楼凤加载状态
				loufengHasMore: true, // 楼凤是否还有更多数据
				loufengLimit: 10, // 楼凤每页数量
				list1: [{
					name: '外围包养',
				}, {
					name: '创作',
				}, {
					name: '楼凤'
				}, {
					name: '缴费'
				}]
			}
		},
		onShow() {
			var that = this;

			// 检查缓存的地址信息
			var selectedAddress = uni.getStorageSync('selectedAddress');
			if (selectedAddress && selectedAddress.name) {
				that.selectedAddress = selectedAddress.name;
				that.address_id = selectedAddress.id; // 同时设置address_id
			} else {
				// 如果没有缓存地址，默认显示全国
				that.selectedAddress = '选择城市';
				that.address_id = null; // 重置address_id
			}

			// 检查是否已经关闭过下载弹窗
			var hasClosedDownloadModal = uni.getStorageSync('hasClosedDownloadModal');
			if (!hasClosedDownloadModal) {
				// 显示下载APP弹窗
				setTimeout(() => {
					that.showDownloadModal = true;
				}, 500);
			}

			// that.initUserInfo();
			that.getConfigInfo(); // 获取配置信息
			that.getRecommendExperts(); // 获取推荐达人
			that.getPopularExperts(); // 获取人气达人
			that.getShortVideoList(); // 获取短视频列表
		},
		onLoad(options) {
			var that = this;
			// 检查是否是从service-recharge页面跳转过来选择城市
			if (options.selectCity === 'true' && options.fieldName) {
				// 存储字段名，用于返回时设置数据
				this.selectCityFieldName = options.fieldName;
				// 直接跳转到地址选择页面
				uni.navigateTo({
					url: '/pages/address/address'
				});
				return;
			}

			uni.$on('chearMessageCount', function(data) {
				that.red_dot = "../../static/touming_dot.png";
			});
			uni.$on('refreshUserinfo', function() {
				that.userInfo = getApp().getCache('userInfo');
			});
			// 监听短视频列表刷新事件
			uni.$on('shortVideoListRefresh', function() {
				that.refreshShortVideoList();
			});
			// 监听地址选择事件
			uni.$on('addressSelected', (address) => {
				this.selectedAddress = address.name;
				this.address_id = address.id;
				// 缓存选中的地址
				uni.setStorageSync('selectedAddress', address);

				// 重新加载数据
				this.getPopularExperts();
				this.getShortVideoList();

				// 如果是从service-recharge页面跳转过来的，需要返回并传递数据
				if (this.selectCityFieldName) {
					// 获取当前页面栈
					const pages = getCurrentPages();
					// 找到service-recharge页面
					for (let i = pages.length - 1; i >= 0; i--) {
						if (pages[i].route.includes('service-recharge')) {
							// 设置返回数据
							pages[i].data = pages[i].data || {};
							pages[i].data.selectedCity = address.name;
							pages[i].data.fieldName = this.selectCityFieldName;
							break;
						}
					}
					// 返回到service-recharge页面
					uni.navigateBack({
						delta: 2
					});
					return;
				}
			});
			that.getAppInfo(0); //获取线上APP版本信息  参数type 0自动检查  1手动检查（手动检查时，之前Cancel更新的版本也会提示出来）
		},
		methods: {
			// 关闭下载弹窗
			closeDownloadModal() {
				this.showDownloadModal = false;
				// 记录用户已经关闭过弹窗，下次不再显示
				uni.setStorageSync('hasClosedDownloadModal', true);
			},
			// 下载APP
			downloadApp() {
				// 跳转到下载页面
				uni.showToast({
					title: '正在跳转下载...',
					icon: 'none'
				});

				// 跳转到指定网址
				// #ifdef H5
				window.open('http://69cm.me');
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openWeb('http://69cm.me');
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: 'http://69cm.me',
					success: () => {
						uni.showToast({
							title: '下载链接已复制',
							icon: 'success'
						});
					}
				});
				// #endif
			},
			//获取线上APP版本信息
			getAppInfo(type) {
				var that = this;
				const system_info = uni.getSystemInfoSync();
				let params = {
					os: system_info.platform //本机设备操作系统  （android || ios）
				}
				if (params.os != 'ios' && params.os != 'android') false; //如果不是安卓或ios 返回false

				//这里自行请求API获取版本信息 建议传入操作系统标识，返回本机对应的操作系统最新版本信息，也就是安卓的返回就是安卓的版本信息  ios返回就是ios的版本信息

				//请求获取最新版本
				// #ifdef APP-PLUS
				setTimeout(() => {
					var postData = new Object();
					postData.version = getApp().globalData.version;
					postData.requesTime = getApp().getTime();
					getApp().getData('api/Login/getNewVersion', postData, function(res) {
						if (res.status == 0) {
							uni.showModal({
								title: getApp().globalData.appname,
								content: res.message,
								showCancel: false,
								cancelText: that.$t('public.cancel'),
								confirmText: that.$t('public.confirm'),
								confirmColor: '#e22e50'
							});
						} else {
							if (!getApp().isEmpty(res.data)) {
								let update_info = res.data;
								checkUpdate(update_info, type).then(res => {
									if (res.msg) {
										plus.nativeUI.toast(res.msg);
									}
								}); ///检查更新
								//checkUpdate 这个方法会做什么？：线上版本号 与 本地版本号做对比 ，如果需要更新  根据静默，强制、wifi等信息执行静默更新或跳转到升级页面
								//跳转升级页面的前提是，需要新建并在pages.json中配置升级页面，配置方法请查看插件详情
							}
						}
					});
				}, 200);
				// #endif
			},

			initUserInfo() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.token = userInfo.token;
				getApp().getData('api/getuserinfo', postData, function(res) {
					var newUserInfo = res.data.userInfo;
					that.userInfo = newUserInfo;
				});
			},

			// 跳转到搜索页面
			goToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			// 跳转到地址页面
			goToAddress() {
				uni.navigateTo({
					url: '/pages/address/address?fromIndex=true'
				});
			},
			// 跳转到代理认证页面
			goToAgentAuth() {
				uni.navigateTo({
					url: '/pages/agent-auth/agent-auth'
				});
			},
			// 跳转到发布茶贴页面
			goToPublishTeapost() {
				uni.navigateTo({
					url: '/pages/publish-teapost/publish-teapost'
				});
			},
			// 获取配置信息
			getConfigInfo() {
				var that = this;
				uni.request({
					url: getApp().globalData.baseUrl + 'api/configinfo',
					method: 'GET',
					header: {
						'Content-Type': 'application/json'
					},
					success: function(res) {
						if (res.data.code == 200) {
							const banners = res.data.data.banners || [];
							that.bannerList = banners.map(item => item.url);
						} else {
							console.log('获取配置信息失败:', res.data.msg);
						}
					},
					fail: function(err) {
						console.log('获取配置信息请求失败:', err);
					}
				});
			},
			// 获取推荐达人
			getRecommendExperts() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');

				// 使用GET方式请求推荐达人接口
				uni.request({
					url: getApp().globalData.baseUrl + 'api/expert/recommend',
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + userInfo.token,
						'Content-Type': 'application/json'
					},
					success: function(res) {
						if (res.data.code == 200) {
							that.expertList = res.data.data || [];
						} else {
							console.log('获取推荐达人失败:', res.data.msg);
						}
					},
					fail: function(err) {
						console.log('请求失败:', err);
					}
				});
			},
			// 跳转到达人列表页面
			goToExpertList() {
				uni.navigateTo({
					url: '/pages/expert/expert'
				});
			},
			// 跳转到达人详情页面
			goToExpertDetail(expertId) {
				uni.navigateTo({
					url: '/pages/expert-detail/expert-detail?id=' + expertId
				});
			},
			// 跳转到茶贴详情页面
			goToLoufengDetail(loufengId) {
				uni.navigateTo({
					url: '/pages/loufeng-detail/loufeng-detail?id=' + loufengId
				});
			},
			// 获取人气达人
			getPopularExperts(isLoadMore = false) {
				var that = this;
				var userInfo = getApp().getCache('userInfo');

				// 如果不是加载更多，重置状态
				if (!isLoadMore) {
					that.popularPage = 1;
					that.popularNoMore = false;
				}

				that.popularLoading = true;

				uni.request({
					url: getApp().globalData.baseUrl + 'api/expert/list',
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						page: that.popularPage,
						limit: 10,
						address_id: that.address_id
					},
					success: function(res) {
						that.popularLoading = false;
						if (res.data.code == 200) {
							const newData = res.data.data.data || [];
							if (isLoadMore) {
								// 加载更多，追加数据
								that.popularExpertList = that.popularExpertList.concat(newData);
							} else {
								// 首次加载，替换数据
								that.popularExpertList = newData;
							}

							// 判断是否还有更多数据
							if (newData.length < 10) {
								that.popularNoMore = true;
							}
						} else {
							console.log('获取人气达人失败:', res.data.msg);
						}
					},
					fail: function(err) {
						that.popularLoading = false;
						console.log('请求失败:', err);
					}
				});
			},

			// 加载更多人气达人
			loadMorePopularExperts() {
				var that = this;

				// 只有在'外围包养'标签页时才加载更多人气达人
				if (that.currentTab !== '外围包养') {
					return;
				}

				// 如果正在加载或没有更多数据，直接返回
				if (that.popularLoading || that.popularNoMore) {
					return;
				}

				// 页码加1
				that.popularPage++;

				// 加载更多数据
				that.getPopularExperts(true);
			},

			// 处理标签切换事件
			switchTab(tabName) {
				var that = this;
				if (that.currentTab === tabName) return;
				that.currentTab = tabName;

				if (tabName === '创作') {
					// 获取短视频列表
					that.getShortVideoList();
				} else if (tabName === '外围包养') {
					// 可以添加其他跳转逻辑
					console.log('点击了外围包养');
				} else if (tabName === '楼凤') {
					// 获取楼凤列表
					that.getLoufengList();
				} else if (tabName === '缴费') {
					// 获取充值产品列表
					that.getRechargeProductList();
				}
			},

			// 获取短视频列表
			getShortVideoList() {
				var that = this;
				if (that.shortVideoLoading) return;

				that.shortVideoLoading = true;

				getApp().getData('api/video/member/short/square', {
					page: that.shortVideoPage,
					limit: that.shortVideoLimit,
					type: 1, // 推荐类型
					address_id: that.address_id
				}, (res) => {
					that.shortVideoLoading = false;
					that.shortVideoRefreshing = false;
					if (res.code === 200) {
						const data = res.data;
						if (that.shortVideoPage === 1) {
							that.shortVideoList = data.data || [];
						} else {
							that.shortVideoList = that.shortVideoList.concat(data.data || []);
						}
						that.shortVideoHasMore = that.shortVideoPage < data.last_page;
					} else {
						uni.showToast({
							title: res.msg || '获取视频列表失败',
							icon: 'none'
						});
					}
				}, () => {
					that.shortVideoLoading = false;
					that.shortVideoRefreshing = false;
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				});
			},

			// 刷新短视频列表
			refreshShortVideoList() {
				this.shortVideoPage = 1;
				this.getShortVideoList();
			},

			onRefreshShortVideo() {
				this.shortVideoRefreshing = true;
				this.refreshShortVideoList();
			},

			onRestoreShortVideo() {
				this.shortVideoRefreshing = false;
			},

			// 加载更多短视频
			loadMoreShortVideos() {
				var that = this;
				if (!that.shortVideoHasMore || that.shortVideoLoading) return;
				that.shortVideoPage++;
				that.getShortVideoList();
			},

			// 跳转到短视频播放页面
			goToShortVideo(index) {
				// 将视频列表和当前索引传递给详情页
				uni.navigateTo({
					url: '/pages/short-video/short-video?index=' + index + '&videoList=' + encodeURIComponent(JSON
						.stringify(this.shortVideoList))
				});
			},

			// 跳转到发布视频页面
			goToPublish() {
				uni.navigateTo({
					url: '/pages/publish-video/publish-video'
				});
			},

			// 获取充值产品列表
			getRechargeProductList() {
				var that = this;
				uni.request({
					url: getApp().globalData.baseUrl + '/api/product/recharge/list',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
					},
					success: function(res) {
						if (res.data.code === 200) {
							that.rechargeProductList = res.data.data || [];
							console.log('充值产品列表获取成功:', that.rechargeProductList);
						} else {
							uni.showToast({
								title: res.data.msg || '获取产品列表失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						console.error('获取充值产品列表失败:', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},

			// 获取楼凤列表
			getLoufengList(refresh = false) {
				var that = this;
				if (that.loufengLoading) return;

				// 如果是刷新，重置页码
				if (refresh) {
					that.loufengPage = 1;
					that.loufengHasMore = true;
				}

				// 如果没有更多数据，直接返回
				if (!that.loufengHasMore && !refresh) {
					return;
				}

				that.loufengLoading = true;

				uni.request({
					url: getApp().globalData.baseUrl + '/api/loufeng/data/getlist',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						token: getApp().getCache('token') || ''
					},
					data: {
						page: that.loufengPage,
						limit: that.loufengLimit,
						name: '',
						address_id: that.address_id || ''
					},
					success: function(res) {
						that.loufengLoading = false;
						if (res.data.code === 200) {
							const newData = res.data.data.data || [];

							if (refresh || that.loufengPage === 1) {
								that.loufengList = newData;
							} else {
								that.loufengList = that.loufengList.concat(newData);
							}

							// 判断是否还有更多数据
							if (newData.length < that.loufengLimit) {
								that.loufengHasMore = false;
							}

							console.log('楼凤列表获取成功:', that.loufengList);
						} else {
							uni.showToast({
								title: res.data.msg || '获取楼凤列表失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						that.loufengLoading = false;
						console.error('获取楼凤列表失败:', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},

			// 跳转到服务页面
			goToService(serviceType) {
				if (serviceType === 'douyin') {
					// 抖音红包直接显示支付界面
					uni.navigateTo({
						url: '/pages/service-pay/service-pay?type=' + serviceType
					});
				} else {
					// 其他服务跳转到充值界面
					uni.navigateTo({
						url: '/pages/service-recharge/service-recharge?type=' + serviceType
					});
				}
			},


		}
	}
</script>

<style lang="scss" scoped>
	page {
		color: #000;
		background-color: #fff;
		height: 100%;

	}

	.page-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
	}

	.content {
		flex: 1;
		overflow-y: auto;
		padding: 0;
		margin: 0;
	}

	.sticky-header {
		padding: 20rpx;
		margin: 0;
		background-color: #fff;
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: space-between;
		top: 0;
		height: 120rpx;
		z-index: 2;

	}

	/* 轮播图样式 */
	.banner-section {
		width: 100%;
		height: 400rpx;
		/* 手机端默认高度 */
	}

	.banner-swiper {
		width: 100%;
		height: 100%;
	}

	.banner-image {
		width: 100%;
		height: 400rpx;
		/* 手机端默认高度 */
	}

	/* 电脑端适配 */
	@media screen and (min-width: 768px) {
		.banner-section {
			height: 800rpx;
		}

		.banner-image {
			height: 800rpx;
		}
	}


	/* 自定义标签页样式 */
	.tab-container {
		display: flex;
		width: 500rpx;
		background-color: #fff;
	}

	.tab-item {
		flex: 1;
		padding: 30rpx 0;
		white-space: nowrap;
		text-align: center;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-item.active .tab-text {
		color: #fd3642;
		font-weight: bold;
		font-size: 36rpx;
		transform: scale(1.1);
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		// background-color: #fd3642;
		border-radius: 2rpx;
	}

	.tab-text {
		font-size: 30rpx;
		color: #000;
		transition: transform 0.3s ease;
		display: inline-block;
		/* 关键，保证 transform 生效 */
		transform-origin: center center;
		/* 放大从中心 */
	}

	.location-btn {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.location-icon {
		width: 24rpx;
		height: 24rpx;
	}

	.location-text {
		font-size: 32rpx;
		color: #000;
	}

	/* 发布创作区域样式 */
	.publish-creation-section {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
	}

	.publish-creation-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(to bottom, #fc303d 0%, #fc1074 100%);
		border-radius: 15rpx;
		height: 65rpx;
		padding: 0 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(238, 90, 36, 0.3);
		transition: all 0.3s ease;
	}

	.publish-creation-btn:active {
		transform: scale(0.95);
		box-shadow: 0 2rpx 6rpx rgba(238, 90, 36, 0.2);
	}

	.publish-creation-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
		filter: brightness(0) invert(1);
	}

	.publish-creation-text {
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		font-weight: bold;
	}





	/* 达人推荐模块样式 */
	.expert-section {
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.title-text {
		font-size: 38rpx;
		font-weight: bold;
		color: #fd313d;
	}

	.more-text {
		font-size: 28rpx;
		color: #999;
	}

	.expert-scroll {
		white-space: nowrap;
	}

	.expert-list {
		display: flex;
		flex-direction: row;
	}

	.expert-item {
		display: inline-block;
		width: 200rpx;
		margin-right: 20rpx;
		vertical-align: top;
	}

	.expert-image-container {
		position: relative;
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.expert-image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.expert-badge {
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

	.expert-info {
		padding: 10rpx 0;
	}

	.expert-name {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.expert-location {
		margin-bottom: 6rpx;
	}

	.location-text {
		font-size: 32rpx;
		color: #666;
	}

	.expert-stats {}

	.stats-text {
		font-size: 20rpx;
		color: #999;
	}

	/* 短视频页面样式 */
	.video-page {
		background-color: #fff;
		flex: 1;
	}

	.video-scroll-view {
		height: calc(100vh - 240rpx);
	}

	/* 列表容器 */
	.list-container {}

	.loading-container,
	.empty-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.loading-text,
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 网格布局样式 */
	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		background-color: #f5f5f5;
		margin: 10rpx;
	}

	.grid-item {
		width: 365rpx;
		margin-bottom: 10rpx;
		border-radius: 15rpx;
		background-color: #f5f5f5;
		overflow: hidden;
		position: relative;
	}

	.grid-cover {
		width: 100%;
		border-radius: 15rpx;
		height: 350rpx;
	}


	.play-btn {
		width: 30rpx;
		height: 30rpx;
	}

	.grid-info {
		padding: 0 20rpx 20rpx 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.grid-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.grid-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-item {
		display: flex;
		align-items: center;
	}

	.stat-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 6rpx;
	}

	.stat-num {
		font-size: 24rpx;
		color: #666;
	}

	/* 加载更多 */
	.load-more {
		padding: 30rpx;
		text-align: center;
		background-color: #fff;
		border-top: 1rpx solid #f0f0f0;
	}

	.load-more-text {
		font-size: 28rpx;
		color: #007AFF;
	}



	.item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 16px;
	}

	.bullet {
		font-size: 20px;
		margin-right: 8px;
		line-height: 1;
	}

	.text-container {
		flex: 1;
	}

	.link {
		color: #0270e0;
	}

	.bottom-image {
		width: 100%;
		margin-top: 16px;
	}

	.scroll-content3 {
		animation: rowScroll3 20s linear infinite;
	}

	.pop_box {
		background-color: #FFFFFF;
		width: 690rpx;
		border-radius: 15px;
		box-sizing: border-box;
		position: relative;
		color: #FFFFFF;
		padding: 30rpx;

	}

	.pop_box .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 17px;
	}

	.pop_box .header .close {
		width: 20px;
	}

	/* 人气达人模块样式 */
	.popular-expert-section {
		padding: 10rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.popular-expert-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.popular-expert-item {
		width: 49.5%;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.popular-expert-image-container {
		width: 100%;
		height: 360rpx;
		position: relative;
		overflow: hidden;
		border-radius: 20rpx;
	}

	.popular-expert-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.popular-expert-info {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.popular-expert-name {
		font-size: 32rpx;
		color: #333;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 10rpx;
	}

	.popular-expert-views {
		font-size: 24rpx;
		color: #999;
		flex-shrink: 0;
	}

	/* 发布创作按钮样式 */
	.publish-section {
		padding: 30rpx 20rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.publish-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #ff6b6b, #ee5a24);
		border-radius: 50rpx;
		height: 80rpx;
		box-shadow: 0 8rpx 20rpx rgba(238, 90, 36, 0.3);
		transition: all 0.3s ease;
	}

	.publish-btn:active {
		transform: scale(0.95);
		box-shadow: 0 4rpx 10rpx rgba(238, 90, 36, 0.2);
	}

	.publish-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
		filter: brightness(0) invert(1);
	}

	.publish-text {
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}

	.popular-expert-scroll {
		/* 移除固定高度限制，让内容自适应高度跟随页面滚动 */
	}

	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		font-size: 28rpx;
		color: #999;
	}

	/* 生活服务页面样式 */
	.life-service-page {
		background-color: #fff;
		min-height: 100vh;
		padding: 0 5rpx;
	}

	.service-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		// gap: 10rpx;
	}

	.service-item {
		width: 49.5%;
		height: 180rpx;
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		background-color: #eee;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 0 0 0 30rpx;
		transition: all 0.3s ease;
		border: 1rpx solid #e9ecef;
	}

	.service-item:active {
		transform: scale(0.95);
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.service-content {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.service-icon {
		width: 100rpx;
		height: 100rpx;
		flex-shrink: 0;
	}

	.service-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		flex: 1;
		line-height: 1.4;
	}

	.service-notice {
		margin-top: 40rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.notice-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #000;
		margin-bottom: 20rpx;
		display: block;
	}

	.notice-text {
		font-size: 28rpx;
		color: #000;
		line-height: 1.6;
		margin-bottom: 15rpx;
		display: block;
	}

	.notice-text:last-child {
		margin-bottom: 0;
	}

	/* 下载APP弹窗样式 */
	.app-download-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
	}

	/* 楼凤页面样式 */
	.loufeng-page {
		padding: 30rpx;
	}

	.top-buttons {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
		gap: 20rpx;
	}

	.button-item {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 40rpx 20rpx 0rpx 20rpx;
		background-color: #eeeeee;
		border-radius: 20rpx;
		gap: 20rpx;
	}

	.button-icon {
		width: 80rpx;
		height: 80rpx;
		flex-shrink: 0;
	}

	.button-text {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.section-title {
		margin-bottom: 30rpx;
	}

	.title-text {
		font-size: 36rpx;
		font-weight: bold;
		color: #f5434c;
	}

	.loufeng-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.loufeng-item {
		display: flex;
		background-color: #faf7f2;
		border-radius: 15rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		gap: 20rpx;
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

	.modal-header {
		padding: 30rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
	}

	.close-btn {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 50rpx;
		color: #fff;
		cursor: pointer;
		line-height: 1;
	}

	.modal-body {
		padding: 40rpx 30rpx;
		text-align: center;
	}

	.modal-desc {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 30rpx;
		display: block;
		line-height: 1.5;
	}

	.download-section {
		margin-top: 30rpx;
	}

	.download-text {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}

	.qr-code {
		width: 300rpx;
		height: 300rpx;
		border-radius: 10rpx;
		border: 2rpx solid #eee;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.qr-code:active {
		transform: scale(0.95);
	}
</style>