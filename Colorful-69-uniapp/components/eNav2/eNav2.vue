<template>
	<view>
		<!-- <userPop :popShow='popS.show' @colsePop='colsePop' @onLogout='onLogout' :vip_list='vip_list'></userPop> -->
		<!-- <uni-nav-bar :leftWidth="150" :rightWidth="50" background-color="transparent" class="header" fixed="true"> -->
		<view class="content-box">
			<!-- <view class="header u-flex u-flex-between u-flex-items-center m-t-60"> -->
			<view class="u-flex-x u-flex-items-center" @click="openWin('index')">
				<image src="@/static/pro/Profitero-Logo-03.png" mode="widthFix" class="width-200"></image>
			</view>
			<view class="u-flex-x u-flex-items-center btns" style="justify-content: center;">
				<!-- <image class="width-290" src="/static/logo/3.png" mode="widthFix"></image> -->
			</view>
			<!--  -->
			<view class="u-flex-x u-flex-items-center">
				<!-- <view class="" @click="showPopS"> -->
				<view class="u-flex u-flex-center u-flex-items-center" @click="openWin('message')">
					<!-- <image class="width-50" src="@/static/pro/SEND/BG-015.png" mode="widthFix"></image> -->
					<!-- <view class="font-size-13 text-underline m-l-20">
						My Profile
					</view> -->
				</view>
				<view class="m-l-20"  >
					<userPop :popShow="popShow" @colsePop="colsePop" @onLogout="onLogout" :isShow="true"></userPop>
				</view>
			</view>
			<!-- </view> -->

		</view>
	

		<view class="height-140"></view>

		<u-modal :show="show" @confirm="fn" :showConfirmButton="false" :content="content">
			<view class="u-flex-y brns">
				<view class="">
					<!-- <image src="../../static/Elements/logo/BG-1.png" mode="widthFix" class="width-330"></image> -->
				</view>
				<view class="text-center p-30-10 font-white ">
					{{ content }}
				</view>
				<view class="u-flex-x u-flex-around width-500">
					<u-button @click="show = false" text="Cancel" class="u-m-c-auto width-200 bg-black colis m-b-30"
						color="#5bf9b5"></u-button>
					<u-button :text="confirmText" @click="fn" class="u-m-c-auto width-200 bg-black colis"
						color="#5bf9b5"></u-button>
				</view>
			</view>
		</u-modal>

	</view>
</template>

<script>
	export default {
		name: "eNav",
		data() {
			return {
				index: 0,
				show: false,
				cancelText: true,
				confirmText: '',
				content: '',
				red_dot: "../../static/touming_dot.png",
				popShow: false,
				vip_list: [],
			};
		},
		onLoad() {
			const that = this;
			uni.$on('chearMessageCount', function(data) {
				that.red_dot = "../../static/touming_dot.png";
			});
		},
		computed: {
			fn() {
				return () => {
					switch (this.index) {
						case 1:
							this.confirms();
							break;
						case 2:
							this.confirmss();
							break;
						case 3:
							this.confirmsss();
							break;
						case 5:
							this.openWin('order');
							break;
						default:
							break;
					}
					this.show = false;
				};
			}
		},
		methods: {
			getVipList() {
				const that = this;
				const postData = new Object();
				const userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/User/getVipList', postData, function(res) {
					if (res.status === 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#092B8E'
						});
					} else {
						that.vip_list = res.data;
					}
				});
			},
			confirms() {
				this.show = false;
				this.index = 0;
			},
			confirmss() {
				getApp().removeCache('isLogin');
				getApp().removeCache('userInfo');
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			confirmsss() {
				uni.navigateTo({
					url: '/pages/withdraw/withdraw'
				});
			},
			showPopS() {
				this.popShow = true;
				this.getVipList();
			},
			colsePop() {
				this.popShow = false;
			},
			onCustomer() {
				const that = this;
				const userInfo = getApp().getCache('userInfo');
				const postData = new Object();
				postData.token = userInfo.token;
				postData.userid = userInfo.userid;
				postData.requesTime = getApp().getTime();
				getApp().getData('api/User/getCustomer', postData, function(res) {
					if (res.status === 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#083643'
						});
					} else {
						const buttons = res.data.map(customer => customer.name);
						uni.showActionSheet({
							itemList: buttons,
							success: function(res) {
								getApp().openUrl(res.data[res.tapIndex].url);
							}
						});
					}
				});
			},
			onLogout() {
				const that = this;
				this.colsePop();
				uni.showModal({
					title: getApp().globalData.appname,
					content: that.$t('user.toast4'),
					confirmColor: '#06D6A0',
					cancelText: that.$t('public.cancel'),
					confirmText: that.$t('user.logout'),
					success: function(res) {
						if (res.confirm) {
							getApp().removeCache('isLogin');
							getApp().removeCache('userInfo');
							uni.redirectTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			},
			initData(page) {
				const that = this;
				const postData = new Object();
				const userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.pageNow = page;
				postData.pageSize = '10';
				getApp().getData('api/User/getMessage', postData, function(res) {
					if (res.status === 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: 'Cancel',
							confirmText: 'Confirm',
							confirmColor: '#06D6A0'
						});
					} else {
						if (page === 1) {
							that.list = res.data.totalPages;
						} else {
							that.list = that.list.concat(res.data.list);
						}
						uni.$emit('chearMessageCount');
						that.totalSize = res.data.totalElements;
						that.totalPage = res.data.totalPages;
						that.mCurrentPage = res.data.pageNow;
					}
				});
			},
			openWin(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		background-color: #0a172b;
		height: 120rpx;
		width: 100%;
		position: fixed;
		padding: 0 30rpx;
		display: flex;
		z-index: 99;
		justify-content: space-between;
		align-items: center;
		top: 0;
		color: #fff;
	}

	.btns {
		width: 300rpx !important;
	}

	::v-deep .uni-navbar--border {
		border-bottom-color: transparent;
	}

	::v-deep.u-modal__content {
		padding: 12px 25px 0px 25px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		border: 3px solid #5bf9b5;
		background-repeat: no-repeat;
		background-size: 107% 108%;
		background-color: #0a172b;
	}

	.brns {
		background-color: #5bf9b5 !important;
		width: 500rpx;
		border: 1px solid #5bf9b5;
		border-radius: 12px;
	}

	.colis {
		border-radius: 8px;
	}
</style>