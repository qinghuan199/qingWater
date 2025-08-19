<template>
	<u-tabbar :fixed="true" :placeholder="true" :safeAreaInsetBottom="true"
		class="u-flex-x  font-size-12 tabbarBox " backgroundColor="#fff" :border="false">
		<u-tabbar-item class="u-flex-self-end m-b-10">
			<view class="u-flex-y u-flex-items-center" slot="inactive-icon" @click="navigateToIndex">
				<u-image class="m-b-5" mode="aspectFit" width="30" height="30" :src="getTabIcon('index')">
				</u-image>
				<text :class="{ 'active-text': currentTab === 'index' }">首页</text>
			</view>
		</u-tabbar-item>
		<u-tabbar-item class="u-flex-self-end m-b-10">
			<view class="u-flex-y u-flex-items-center" slot="inactive-icon" @click="navigateToGame">
				<u-image class="m-b-5" mode="aspectFit" width="30" height="30" :src="getTabIcon('game')">
				</u-image>
				<text :class="{ 'active-text': currentTab === 'game' }">游戏</text>
			</view>
		</u-tabbar-item>
		<u-tabbar-item class="u-flex-self-end m-b-10">
			<view class="u-flex-y u-flex-items-center" slot="inactive-icon" @click="navigateToVideo">
				<u-image class="m-b-5" mode="aspectFit" width="30" height="30" :src="getTabIcon('video')">
				</u-image>
				<text :class="{ 'active-text': currentTab === 'video' }">视频</text>
			</view>
		</u-tabbar-item>

		<u-tabbar-item class="u-flex-self-end m-b-10">
			<view class="u-flex-y u-flex-items-center" slot="inactive-icon" @click="navigateToMy">
				<u-image class="m-b-5" mode="aspectFit" width="30" height="30" :src="getTabIcon('my')">
				</u-image>
				<text :class="{ 'active-text': currentTab === 'my' }">我的</text>
			</view>
		</u-tabbar-item>
	</u-tabbar>
</template>

<script>
	export default {
		name: "userTabbar",
		props: {
			current: {
				type: String,
				default: 'index'
			}
		},
		onLoad() {
			var that = this;
			that.bgId = 1;
			that.initCurrentTab();
		},
		onShow() {
			// 页面显示时重新初始化当前标签页状态
			this.initCurrentTab();
		},
		data() {
			return {
				bgId: 1,
				currentTab: 'index',
				tabIcons: {
					index: {
						normal: '/static/home/ic_tab_home.png',
						selected: '/static/home/ic_tab_home_select.png'
					},
					game: {
						normal: '/static/home/ic_tab_game.png',
						selected: '/static/home/ic_tab_game_select.png'
					},
					video: {
						normal: '/static/home/ic_tab_video.png',
						selected: '/static/home/ic_tab_video_select.png'
					},
					my: {
						normal: '/static/home/ic_tab_mine.png',
						selected: '/static/home/ic_tab_mine_select.png'
					}
				}
			};
		},
		mounted() {
			this.bgId = getApp().getCache('bgId');
			this.initCurrentTab();
		},
		created() {
			this.initCurrentTab();
		},
		watch: {
			current(newVal) {
				this.currentTab = newVal;
			}
		},
		methods: {
			initCurrentTab() {
				// 根据当前页面路径设置当前标签页
				const pages = getCurrentPages();
				if (pages.length > 0) {
					const currentPage = pages[pages.length - 1];
					const route = currentPage.route;
					console.log('当前页面路径:', route);

					if (route.includes('index')) {
						this.currentTab = 'index';
						console.log('设置当前标签页为: index');
					} else if (route.includes('game')) {
						this.currentTab = 'game';
						console.log('设置当前标签页为: game');
					} else if (route.includes('video')) {
						this.currentTab = 'video';
						console.log('设置当前标签页为: video');
					} else if (route.includes('my')) {
						this.currentTab = 'my';
						console.log('设置当前标签页为: my');
					} else {
						console.log('未匹配到标签页，保持当前状态:', this.currentTab);
					}
				}
			},
			getTabIcon(tabName) {
				const icons = this.tabIcons[tabName];
				return this.currentTab === tabName ? icons.selected : icons.normal;
			},
			setCurrentTab(tabName) {
				this.currentTab = tabName;
				getApp().setCache('currentTab', tabName);
			},
			navigateToIndex() {
				this.setCurrentTab('index');
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			navigateToVideo() {
				this.setCurrentTab('video');
				uni.reLaunch({
					url: '/pages/video/video'
				});
			},
			navigateToGame() {
				const isLogin = getApp().getCache('isLogin');
				if (isLogin != '1') {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
					return;
				}
				this.setCurrentTab('game');
				uni.reLaunch({
					url: '/pages/game/game'
				});
			},
			navigateToMy() {
				const isLogin = getApp().getCache('isLogin');
				if (isLogin != '1') {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1000);
					return;
				}
				this.setCurrentTab('my');
				uni.reLaunch({
					url: '/pages/my/my'
				});
			},
			openWin(path, id) {
				getApp().setCache('bgId', id);
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			}
		}
	}
</script>

<style scoped>
	page {
		z-index: 999999;
	}

	.tabbarBox {
		background-color: #fff;
	}
	::v-deep .u-tabbar__content{
		padding: 25rpx 15rpx 5rpx 15rpx;
		background-color: #fff;
		
	}

	.bottom-item {
		width: 100%;
		height: 110px;
		padding: 0 40rpx;
		background-size: 100% auto;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	/* 选中状态的文字样式 */
	.active-text {
		color: #fc4618 !important;
		font-weight: bold;
	}

	/* 默认文字样式 */
	text {
		color: #666;
		transition: color 0.3s ease;
	}
</style>