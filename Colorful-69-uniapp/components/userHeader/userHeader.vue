<template>
	<view class="header">
		
		<view class="u-flex u-flex-items-center" @click="openWin('user')">
			<image class="icon-50 m-r-10" src="@/static/Element/SEND/Icon-020.png" mode="aspectFit"></image>
			<!-- <text class="font-size-15 font-white" style="text-decoration: underline;">{{$t('user_info')}}</text> -->
		</view>
		<view >
			<image class="height-80" src="@/static/Element/Pontem-Logo-01.png" mode="heightFix" style="position: relative;"></image>
		</view>
		<view class="u-flex u-flex-items-center" @click="openWin('message')">
			<image class="icon-50 m-r-10" src="@/static/Element/SEND/Icon-018.png" mode="aspectFit"></image>
			<!-- <text class="font-size-15 font-white" style="text-decoration: underline;">{{$t('user_info')}}</text> -->
		</view>
	</view>
</template>

<script>
	export default {
		name: "headerPage",
		data() {
			return {
				popShow: false,
			};
		},
		methods: {
			showPopS() {
				this.popShow = true
			},
			openWin(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
			colsePop() {
				this.popShow = false
			},
			onCustomer() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = new Object();
				postData.token = userInfo.token;
				postData.userid = userInfo.userid;
				postData.requesTime = getApp().getTime();
				getApp().getData('api/User/getCustomer', postData, function(res) {
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
				this.colsePop();
				uni.showModal({
					title: getApp().globalData.appname,
					content: this.$t('user.toast4'),
					confirmColor: '#092B9C',
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
		},
	}
</script>

<style>
	.header {
		position: relative;
		padding: 10rpx 30rpx;
		background-color: rgba(128, 57, 218,1) !important;
		display: flex;
		width: 100%;
		justify-content: space-between;
		color: #000;
		align-items: center;
		background-color: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, .15);
	}
</style>
