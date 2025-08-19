<template>
	<!-- <movable-area>
		<movable-view :x="x" :y="y" direction="all" @change="onChange">
			<view @click="openWin('customer')" class="radius-full p-20 cust" style="background-color: #0279FE; box-shadow: 1px 1px 6px rgba(0, 0, 0, .3);
			">
				<image src="/static/icon/31.png" class="u-flex icon-70" mode="aspectFit"></image>
			</view>
		</movable-view>
	</movable-area> -->
	<!-- follow="right,left" -->
	<drag-button-follow className="drag-button" :followNum="10" class="drag-button" follow=""  @btnClick="openWin('customer')">
		<view class="radius-full p-20 cust" style="background-color: #fff; box-shadow: 1px 1px 6px rgba(0, 0, 0, .3);
		">
			<image src="/static/pro/SEND/BG-01.png" class="u-flex icon-70" mode="aspectFit"></image>
		</view>
	</drag-button-follow>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				x: 0,
				y: 0,
				old: {
					x:'',
					y:'',
				},
				red_dot: "../../static/touming_dot.png",
				show: false,
				isNavKey: false,
				pop: {
					bgPath: '',
					title: '',
					content: '',
					show: false,
					show_id: '',
				},
			};
		},
		props: {
			title: {
				type: String,
				default: '',
			},
			id: {
				type: Number,
			}
		},
		onLoad() {
			uni.$on('chearMessageCount', function(data) {
				that.red_dot = "../../static/touming_dot.png";
			});
		},

		methods: {
			onChange(e) {
				this.old.x = e.detail.x
				this.old.y = e.detail.y
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
			back() {
				let canNavBack = getCurrentPages()
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					history.back();
				}
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
			openWin(path) {
				this.show = false;
				uni.navigateTo({
					url: '../' + path + '/' + path + '?&id=1'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.drag-button{
		 box-shadow: 0 5rpx 10rpx 0 rgba(0,0,0,0.08);
		font-size: 24rpx;
		position: fixed;
		right: 40rpx;
		bottom: 100rpx;
		z-index: 9;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	@media screen and (min-width: 750px) {
		.drag-button {
			// transform: translate(-50%,-50%);
			right: 50% !important;
			bottom: 200rpx !important;
			margin-right: -220px;
		}
	}
</style>