<template>
	<view class="content u-flex-y">
		<meta name="theme-color" content="#0a172b">
		<HeaderTitle title='Profile'></HeaderTitle>
		<customer></customer>
		<view class="u-flex-y width-690 u-flex-self-center m-t-80">
			<image :lazy-load="true" class="width-150 height-150 u-flex-self-center radius-full border-white"
				:src="userInfo.headimg" mode="widthFix"></image>
			<view class="bg-white radius-12 p-30 u-flex-y text-center" style="margin-top: -65rpx">
				<view class="u-flex-x m-t-50 u-flex-self-center u-flex-items-center">
					<!-- <text class="font-bold">{{userInfo.phone}}</text> -->
					<text class="font-bold">{{userInfo.username}}</text>
					<!-- <image :src="userInfo.vip.logo" mode="aspectFit" class="icon-50 m-l-20"></image> -->
				</view>
				<!-- 	<navigator url="../invitation/invitation" class="u-flex-x  width-520"
					style="margin: 0 auto; text-align: center; align-items: center; justify-content: center;">
					<view class="font-size-10  text-center">{{$t('user.parent')}}:</view>
					<view class="font-bold  font-size-13 m-l-20">{{userInfo.userid}}
					</view>
				</navigator> -->
				<!-- 信誉 -->
				<view class="u-flex u-flex-items-center   uslider1 width-full m-t-50  p-r-20" style="margin: 0 auto;">
					<view class=" font-size-14 width-450 text-center p-r-20">{{$t('user.credit_score')}}
					</view>
					<view class="width-full  uslider ">
						<view class="uslider2" :style="{'width': userInfo.credit_value +'%'}">
							<view class="usliderBut">{{userInfo.credit_value}}%</view>
						</view>
					</view>
				</view>
				<view class="u-flex-x u-flex-around width-full font-size-14 m-t-50">
					<view class="u-flex-y u-flex-items-center width-220">
						<view class="font-size-10 width-280 text-center font-main-color"> My Referral
						</view>
						<view class="font-main-color font-size-12">Code</view>
						<view class="font-bold m-t-10 font-size-13">{{userInfo.userid}}
						</view>
					</view>
					<u-line direction="col" class="height-80"></u-line>
					<view class="u-flex-y u-flex-items-center width-220">
						<view class="font-size-12 width-280 text-center font-main-color">{{$t('user.today_income')}}
						</view>
						<view class="font-main-color font-size-12">(USDT)</view>
						<view class="font-bold m-t-10 font-size-13"> {{userInfo.today_income}}
						</view>
					</view>
					<u-line direction="col" class="height-80"></u-line>
					<view class="u-flex-y u-flex-items-center width-220">
						<view class="font-size-10 width-280 text-center font-main-color">{{$t('user.wallet')}}</view>
						<view class="font-main-color font-size-12">(USDT)</view>
						<view class="font-bold m-t-10 font-size-13"> {{userInfo.wallet}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="u-flex-y  p-30  width-690 u-flex-self-center m-t-30">
			<text class="font-bold">Transaction</text>
			<!-- <u-line class="m-t-30"></u-line>
			<navigator url="/pages/invitation/invitation" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="../../static/Elements/ReferralCode.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.parent')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#014587"></u-icon>
			</navigator> -->
			<u-line class="m-t-30"></u-line>
			<!-- 	<navigator url="/pages/recharge/recharge" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="../../static/BG-020.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.recharge')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line> -->
			<navigator url="/pages/withdraw/withdraw" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-032.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.withdraw')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>

			<navigator url="/pages/wallet_log/wallet_log" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-033.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.wallet_log')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>
			<navigator url="/pages/check_in/check_in" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-020.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20"> Check In
					</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>
			<text class="font-bold m-t-30">Profile</text>
			<u-line class="m-t-30"></u-line>
			<navigator url="/pages/user_info/user_info" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-014.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.info')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>
			<navigator url="/pages/pay_password/pay_password" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-034.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20"> Change Password & Pin</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>
			<navigator url="/pages/card_bind/card_bind" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/11.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.card')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>
			<text class="font-bold m-t-30"> About Us</text>
			<u-line class="m-t-30"></u-line>
			<view @click="openWin('customer')" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-01.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20">{{$t('user.contact')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</view>
			<u-line class="m-t-30"></u-line>
			<navigator url="/pages/message/message" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<!-- <image src="/static/pro/SEND/BG-015.png" mode="aspectFit" class="icon-50"></image> -->
					<text class="m-l-20">{{$t('user.notifications')}}</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</navigator>
			<u-line class="m-t-30"></u-line>
			<view @click="openWin('invitation')" class="u-flex-x u-flex-items-center u-flex-between m-t-30">
				<view class="u-flex-x u-flex-items-center">
					<image src="/static/pro/SEND/BG-021.png" mode="aspectFit" class="icon-50"></image>
					<text class="m-l-20"> Invite Friends</text>
				</view>
				<u-icon size="15" bold name="arrow-right" color="#000"></u-icon>
			</view>
			<u-line class="m-t-30"></u-line>
			<view @click="logoutModalForm.show = true"
				class="width-full m-t-30 text-center  height-100 u-flex u-flex-items-center u-flex-center font-white radius-10 font-bold" style="background-color: #237aff;">
				{{$t('user.logout')}}
			</view>
		</view>
		<text class="text-center font-size-12 m-80-0">
			© Profitero 2024 | All Rights Reserved
		</text>
		<userTabbar></userTabbar>
		<uni-popup ref="popup" type="bottom">
			<scroll-view class="pop_box" :scroll-y="true">
				<view class="header">
					<text>{{$t('user.withdraw_psw_title')}}</text>
					<image class="close" src="../../static/close.png" mode="widthFix" @click="closePop"></image>
				</view>
				<view class="input_item margin_top_15">
					<text class="label">{{$t('user.withdraw_psw')}}</text>
					<input v-if='input_type == "password"' class="uni-input" maxlength="15" type="password"
						:placeholder="$t('user.withdraw_psw_desc')" v-model="pay_password" />
					<input v-else class="uni-input" maxlength="15" type="text"
						:placeholder="$t('user.withdraw_psw_desc')" v-model="pay_password" />
					<uni-icons v-if='input_type == "password"' class="eye" type="eye-filled" size="22" @click="onEye">
					</uni-icons>
					<uni-icons v-else class="eye" type="eye-slash-filled" size="22" @click="onEye"></uni-icons>
				</view>
				<view class="btn" @click="onCardBind">{{$t('user.withdraw_psw_btn')}}</view>
				<view class="zhanwei"></view>
			</scroll-view>
		</uni-popup>
		<userNav :title='4' />

		<selfModalLogut :logoutModalForm="logoutModalForm"></selfModalLogut>
	</view>
</template>

<script>
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js";
	import navBar from "@/components/zhouWei-navBar";
	export default {
		components: {
			w_md5
		},
		onShow() {
			var that = this;
			console.log(getApp().getCache('userInfo'))
			// that.getuserinfo()
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			} else {
				that.initData();
			}
		},
		onPullDownRefresh() {
			var that = this;
			that.initData();
			uni.stopPullDownRefresh();
		},
		onLoad() {
			var that = this;
			uni.$on('refreshUserinfo', function() {
				that.userInfo = getApp().getCache('userInfo');
			});
			uni.$on('chearMessageCount', function(data) {
				that.red_dot = "../../static/touming_dot.png";
			});

		},
		components: {
			navBar
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		data() {
			return {
				scrollTop: 0,
				userInfo: getApp().getCache('userInfo'),
				red_dot: "../../static/touming_dot.png",
				pay_password: "",
				input_type: "password",
				logoutModalForm: {
					show: false
				}
			}
		},
		methods: {
			// getuserinfo() {
			// 	var that = this;
			// 	var postData = new Object();
			// 	var userInfo = getApp().getCache('userInfo');
			// 	postData.requesTime = getApp().getTime();
			// 	postData.userid = userInfo.userid;
			// 	postData.token = userInfo.token;
			// 	getApp().getData('api/getuserinfo', postData, function(res) {
			// 		that.userInfo = res.data.userInfo
			// 		console.log(that.userInfo)
			// 		getApp().setCache('userInfo',that.userInfo)
			// 	});
			// },
			initData() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/getuserinfo', postData, function(res) {
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
						var userInfo = res.data.userInfo;
						that.userInfo = userInfo;
						getApp().setCache('userInfo', userInfo);
						if (res.data.no_read_message > 0) {
							that.red_dot = "../../static/red_dot.png";
						}
						uni.$emit('refreshStartUserinfo');
					}
				});
			},
			openWin(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
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
			copyUserid() {
				var that = this;
				uni.setClipboardData({
					data: that.userInfo.userid,
					showToast: false,
					success: function() {
						uni.showToast({
							title: this.$t('transfer_usdt.toast5'),
							icon: 'none',
							duration: 1000
						});
					}
				});
			},
			onCardBind() {
				var that = this;
				var userInfo = that.userInfo;
				if (getApp().isEmpty(that.pay_password)) {
					uni.showToast({
						title: this.$t('user.toast2'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (userInfo.pay_password != w_md5.hex_md5_32(that.pay_password)) {
					uni.showToast({
						title: this.$t('user.toast3'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				that.closePop();
				that.openWin('card_bind');
			},
			onLogout() {
				uni.showModal({
					title: getApp().globalData.appname,
					content: this.$t('user.toast4'),
					confirmColor: '#083643',
					cancelText: this.$t('public.cancel'),
					confirmText: this.$t('public.logout'),
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
			openPop() {
				this.$refs.popup.open('bottom');
			},
			closePop() {
				this.$refs.popup.close('bottom');
			},
			onEye() {
				var that = this;
				if (that.input_type == "password") {
					that.input_type = "text";
				} else {
					that.input_type = "password";
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ecfbff;
		// height: 100%;
		// background-image: url(/static/Icon-026.png);
		// background-size: 100% auto;
		// background-repeat: no-repeat;
	}

	.content {
		height: 100%;
		// background-image: url(/static/BG-015.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
	}

	.header .logo {
		width: 6rem;
		display: block;
	}

	.header .message {
		width: 1.4rem;
		display: block;
	}

	.right {
		position: relative;
	}

	.header .right .red_dot {
		position: absolute;
		width: 1rem;
		top: -4px;
		right: -4px;
	}

	.preview_left {
		padding-left: 10px;
	}

	.box1 {
		position: relative;
		margin-top: 20px;
	}

	.box1 .panel {
		width: 100%;
		padding: 0 15px;
		box-sizing: border-box;
	}

	.box1 .panel .info {
		background-image: url(../../static/mine_bg.png);
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 10px;
		padding: 15px;
		color: #ffffff;
	}

	.box1 .panel .info .userInfo {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.box1 .panel .info .userInfo .headImg {
		width: 50px;
		margin-right: 10px;
		border-radius: 30px;
	}

	.box1 .panel .info .userInfo .userid {
		font-size: 9pt;
		background-color: #f1ad00;
		color: #fff;
		padding: 2px 5px;
		border-radius: 3px;
	}

	.box1 .panel .info .userInfo .username {
		font-size: 15px;
	}

	.box1 .panel .info .userInfo .vip {
		font-size: 12px;
		color: #fff;
		background-image: linear-gradient(to right, #FFAB2A, #FF5F2E);
		padding: 1px 8px;
		border-radius: 15px;
		display: flex;
		align-items: center;
		height: 18px;
		margin-top: 3px;
	}

	.box1 .panel .info .userInfo .vip image {
		width: 14px;
		margin-right: 5PX;
	}

	.box1 .panel .info .data {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		margin-top: 20px;
	}

	.box1 .panel .info .data view {
		width: 100%;
	}

	.box1 .panel .info .data .label {
		font-size: 13px;
		color: #ffffff;
		margin-top: 3px;
	}

	.box1 .panel .info .data .desc {
		font-size: 15px;
		font-weight: 600;
	}

	.box1 .panel .info .data .desc::before {
		font-size: 12px;
		content: "HKD";
		margin-right: 5px;
	}

	.box2 {
		padding: 0 15px;
		margin-bottom: 20px;
		margin-top: 20px;
	}

	.box2 .lists {
		background-color: #ffffff;
		padding: 0 15px;
		border-radius: 10px;
		box-shadow: 0px 2px 4px 1px rgba(194, 0, 42, 0.15);
	}

	.box2 .lists .list {
		padding: 14px 0;
		font-size: 15px;
		border-bottom: 1px solid #efefef;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.box2 .lists .logout {
		color: #ff0000;
		padding: 6px 0;
	}

	.box2 .lists .list:last-child {
		border: 0;
	}

	.box2 .lists .list .icon {
		width: 28px;
		margin-right: 15px;
	}

	.pop_box {
		background-color: #FFFFFF;
		padding: 15px;
		border-radius: 15px 15px 0 0;
		height: 40vh;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.pop_box .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 17px;
	}

	.pop_box .header .close {
		width: 16px;
	}

	.pop_box .btn {
		width: 100%;
		background-color: #237aff;
		color: #fff;
		text-align: center;
		height: 46px;
		line-height: 46px;
		border-radius: 25px;
		font-size: 15px;
		margin-top: 20px;
	}

	.pop_box .input_item {
		position: relative;
		margin-bottom: 20px;
	}

	.pop_box .input_item .label {
		position: absolute;
		top: 13px;
		left: 20px;
		font-size: 15px;
		height: 20px;
		line-height: 20px;
	}

	.pop_box .input_item .eye {
		position: absolute;
		top: 13px;
		right: 10px;
	}

	.pop_box .uni-input {
		background-color: #F1F1F1;
		height: 46px;
		line-height: 46px;
		border-radius: 10px;
		padding-left: 120px;
		padding-right: 42px;
		text-align: right;
	}

	.start-bg {
		background: linear-gradient(to bottom, #1E1719, #6D53A6);
	}

	.uslider1 {
		// position: absolute;
		width: 90%;
		// top: 10%;
		// left: 25%;
	}

	.uslider {
		width: 100%;
		height: 10rpx;
		background-color: #e0f0f0;

		// border: 1px solid #efefef;
		border-radius: 30rpx;

	}

	.uslider2 {
		// z-index: 10;
		position: relative;
		height: 10rpx;
		// border-top-right-radius: 27px;
		// border-bottom-right-radius: 27px;
		background-color: #237aff;
		border-radius: 30rpx;

	}

	.usliderBut {
		width: 80rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 60rpx;
		background-color: #237aff;
		position: absolute;
		right: -31px;
		top: 50%;
		color: #fff;
		font-size: 24rpx;
		transform: translate(-50%, -50%);
	}
</style>