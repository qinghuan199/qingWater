<template>
	<view>
		<!-- <userPop :popShow='popS.show' @colsePop='colsePop' @onLogout='onLogout' :vip_list='vip_list'></userPop> -->
		<!-- <uni-nav-bar :leftWidth="150" :rightWidth="50" background-color="transparent" class="header" fixed="true"> -->
		<view class="content-box">
			<!-- <view class="header u-flex u-flex-between u-flex-items-center m-t-60"> -->
			<view class="u-flex-x u-flex-items-center" @click="openWin('index')">
				<image src="@/static/pro/Profitero-Logo-03.png" mode="widthFix" class="width-200  "></image>
			</view>
			<view class="u-flex-x u-flex-items-center btns" style="justify-content: center;">
				<!-- <image class="width-290" src="/static/logo/3.png" mode="widthFix"></image> -->
			</view>

			<view class="u-flex-x u-flex-items-center">
				<!-- <view class="" @click="showPopS"> -->
				<view class="u-flex u-flex-center u-flex-items-center" @click="openWin('user')">
					<image class="width-50 " src="@/static/pro/SEND/BG-014.png" mode="widthFix"></image>
					<view class="font-size-13 text-underline m-l-20">
						My Profile
					</view>
				</view>
			</view>
			<!-- </view> -->

		</view>

		<view class="height-140">

		</view>

		<u-modal :show="show" @confirm="fn" :showConfirmButton="false" :content='content'>
			<view class="u-flex-y brns">
				<view class="">
					<!-- <image src="../../static/Elements/logo/BG-1.png" mode="widthFix" class="width-330"></image> -->
				</view>
				<view class="text-center p-30-10 font-white ">
					{{content}}
				</view>
				<view class="u-flex-x u-flex-around width-500">
					<u-button @click="show=false" text="Cancel" class="u-m-c-auto width-200 bg-black colis m-b-30"
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
				popS: {
					show: false,
				},
				vip_list: []
			};
		},
		onLoad() {
			uni.$on('chearMessageCount', function(data) {
				that.red_dot = "../../static/touming_dot.png";
			});

		},
		computed: {
			fn() {
				if (this.index == 1) {
					this.confirms()
				} else if (this.index == 2) {
					this.confirmss()
				} else if (this.index == 3) {
					this.confirmsss()
				} else if (this.index == 5) {

					this.openWin('order')
				}
				return () => {
					this.show = false;
				}

			}
		},

		methods: {
			getVipList() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/User/getVipList', postData, function(res) {
					if (res.status == 0) {
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
						// console.log(vip_list, 999898);
					}
				});
			},
			confirms() {
				// uni.navigateTo({
				// 	url: '/pages/order/order'
				// });
				this.show = false
				this.index = 0
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
				// console.log('this.$refs.openUserPop', this.$refs.openUserPop.open())
				this.popS.show = true
				this.getVipList()
			},
			colsePop() {
				this.popS.show = false;
			},

			// showPopS() {
			// 	this.$emit('showPopS')
			// },
			onCustomer() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = new Object();
				postData.token = userInfo.token;
				postData.userid = userInfo.userid;
				postData.requesTime = getApp().getTime();
				getApp().getData('api/User/getCustomer', postData, function(res) {
					if (res.status == 0) {
						// this.show=true
						// this.content = res.message
						// this.confirmText = 'Confirm'
						// this.index=1
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#083643'
						});
					} else {
						var buttons = new Array();
						var customer_list = res.data;
						for (var i = 0; i < customer_list.length; i++) {
							buttons[i] = customer_list[i].name;
						}
						uni.showActionSheet({
							itemList: buttons,
							success: function(res) {
								getApp().openUrl(customer_list[res.tapIndex].url);
							}
						});
					}
				});
			},
			onLogout() {
				this.colsePop()
				// this.show=true
				// this.content = this.$t('user.toast4')
				// this.confirmText = 'Confirm'
				// this.index=2
				uni.showModal({
					title: getApp().globalData.appname,
					content: this.$t('user.toast4'),
					confirmColor: '#06D6A0',
					cancelText: this.$t('public.cancel'),
					confirmText: this.$t('user.logout'),
					success: function(res) {
						if (res.confirm) {
							getApp().removeCache('isLogin');
							getApp().removeCache('userInfo');
							uni.redirectTo({
								url: '/pages/login/login'
							})
						}
					}
				});
			},

			initData(page) {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.pageNow = page;
				postData.pageSize = '10';
				getApp().getData('api/User/getMessage', postData, function(res) {
					if (res.status == 0) {
						// this.show=true
						// this.content = res.message
						// this.confirmText = 'Confirm'
						// this.index=1
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: 'Cancel',
							confirmText: 'Confirm',
							confirmColor: '#06D6A0'
						});
					} else {
						if (page == 1) {
							that.list = res.data.totalPages;
						} else {
							var pageDatas = (that.list).concat(res.data.list);
							that.list = pageDatas;
						}
						// if (res.data.list.length == 0) {
						// 	uni.showToast({
						// 		title: 'More data can’t be found out',
						// 		icon: 'none',
						// 		duration: 2000
						// 	});
						// 	return;
						// }
						uni.$emit('chearMessageCount');
						that.totalSize = res.data.totalElements;
						that.totalPage = res.data.totalPages;
						that.mCurrentPage = res.data.pageNow;
						console.log('value', that.list)
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
		// background-image: url('../../static/gof/bg_title.png') !important;
		background-color: #0a172b;
		height: 120rpx;
		width: 100%;
		position: fixed;
		top: 0;
		padding: 0 30rpx;
		display: flex;
		z-index: 99;
		justify-content: space-between;
		align-items: center;
		color: #fff;

	}

	.header {
		// width: 90%;
		// padding: 12px 15px;
		// background-color: #ffffff;
		// display: flex;
		// justify-content: space-between;
		// // position: fixed;
		// // z-index: 2;
		// color: #000;
		// border-radius: 12rpx;
		// box-shadow: 0px 3px 10px 3px rgba(0,0,0,.1);
		// background-image: url('../../static/Semnexus-34.png');
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
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
		// background-image: url('../../static/123.png'); 
		background-repeat: no-repeat;
		background-size: 107% 124%;
		background-position: center;

	}

	.brns {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.colis {
		color: #000 !important;
		font-weight: 700;
	}
</style>