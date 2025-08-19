<template>
	<view class="content u-flex-y">

		<HeaderTitle :title='title'></HeaderTitle>

		<view class=" text-center font-black m-t-40" style="position: relative;">
			<!-- <view class="p-t-90 font-bold font-size-24">
				My Profile
			</view> -->

			<!-- <view class="u-flex u-flex-center m-t-30">
				<view class="u-flex u-flex-between u-flex-items-center p-l-30 width-690">
					<view class="">
						<view class="label notranslate" style="">{{$t('user.parent')}} : 
						<text class="font-bold m-l-10">{{userInfo.userid}}</text>
							</view>
					</view>
					<view @click="copyUserid" class="p-20 font-white font-size-12 radius-8" style="background-color: #2fb7ec;">
						Copy Code
					</view>
				</view>
			</view> -->
			<view class="width-690 u-margin-center-auto img-a">

				<view class=" radius-12 p-30 font-white " style="margin-top: 20rpx;">
					<view class="u-flex-x  u-flex-items-center">
						<view class="" @click="changeHeadimg" style="position: relative;">
							<image :lazy-load="true"
								class="width-100 height-100 u-flex-self-center radius-full border-white"
								:src="userInfo.headimg" mode="widthFix"></image>
							<image src="/static/gof/g-9-69.png" mode="heightFix" class="height-20"
								style="position: absolute;bottom: 8rpx ;right: 8rpx;"></image>
						</view>
						<view class="m-l-30 u-flex u-flex-between width-400">
							<view class="u-flex-y " style="text-align: left !important;">
								<view class="font-bold">{{userInfo.username}}</view>
								<view class="font-size-12" @click="copyUserid">
									{{$t('user.parent')}} : {{userInfo.userid}}
								</view>
							</view>
							<view class="u-flex u-flex-items-center">
								<!-- <text class="font-size-14">{{userInfo.vip.name}}</text> -->
								<image class="icon-70 m-l-10" :src="userInfo.vip&&userInfo.vip.logo" mode="widthFix">
								</image>

							</view>
						</view>

					</view>
					<!-- <text class="m-t-20 font-bold font-size-12" @click="copyUserid" style="color: #2fb7ec;"><text
							class="label notranslate" style="color: rgba(127, 57, 217,1);">{{$t('user.parent')}}</text>: {{userInfo.userid}}</text> -->
					<view class="    font-size-12 p-t-20 "
						style="flex-shrink: 0; color: #fff; text-align: left !important;">Credit score:
					</view>
					<view class="u-flex u-flex-items-center m-t-30 m-b-30 u-margin-center-auto" style="width:80%;">

						<view class="radius-12" style="background-color:#656c78;width: 100%;">
							<view class="u-flex u-flex-items-center creditBg u-flex-x-left" style="position: relative; "
								:style="{width:`${userInfo.credit_value}%`}">
								<view class=" font-bold  font-white creditNum">
									{{userInfo.credit_value}}%
								</view>
							</view>
						</view>
					</view>


					<view class="u-flex-x u-flex-around width-full font-size-14 p-t-30">
						<!-- <view class="u-flex-y u-flex-items-center width-220">
							<view class="font-bold">USDT {{userInfo.frozen_balance}}</view>
							<view class="m-t-10 label" style="color: rgba(127, 57, 217,1);">Frozen Balance</view>
						</view>
						<u-line direction="col" class="height-80"></u-line> -->
						<view class="u-flex-y u-flex-items-center">
							<view class=" label font-size-13" style="color: #fff;">{{$t('user.parent')}} </view>
							<view class=" m-t-10 font-size-14">{{userInfo.userid}}</view>
						</view>
						<u-line direction="col" class="height-80"></u-line>
						<view class="u-flex-y u-flex-items-center">
							<view class=" label font-size-13" style="color: #fff;">{{$t('user.today_income')}}</view>
							<view class=" m-t-10 font-size-14">USDT {{userInfo.today_income}}</view>
						</view>
						<u-line direction="col" class="height-80"></u-line>
						<view class="u-flex-y u-flex-items-center">

							<view class=" label font-size-13" style="color: #fff;">{{$t('user.wallet')}}</view>
							<view class=" m-t-10 font-size-14">USDT {{userInfo.wallet}}</view>
						</view>

					</view>
				</view>
			</view>
			<!-- <view class="" style="position: absolute; bottom: -100px;left:50%; transform: translate(-50%,-50%);">
				<image :lazy-load="true" class="width-220 height-220 u-flex-self-center radius-full border-white"
					:src="userInfo.headimg" mode="widthFix"></image>
			</view> -->
		</view>


		<!-- <view class="u-flex u-flex-center">
			<view class=" width-690 u-flex u-flex-between">
				<navigator class="text-center"
					:url="`/pages/content/content?&title=${('Terms & Conditions').replace('&','%26')}&key=agreement_desc&src=/static/term.png`">
					<view class="u-flex u-flex-items-center u-flex-center">
						<view class="width-100 height-100 radius-full u-flex u-flex-center u-flex-items-center" style="background-color: #fff;
						box-shadow: 0px 2px 4px 1px rgba(0, 194, 44, 0.15);">
							<image src="/static/sky/SEND/BG-03.png" mode="heightFix" class="height-60"></image>
						</view>
					</view>
					<view class=" font-size-12 font-bold p-t-20 text-center">
						T&C
					</view>
				</navigator>

				<navigator class="text-center" :url="`/pages/content/content?title=FAQs&key=help&src=/static/faq.png`">
					<view class="u-flex u-flex-items-center u-flex-center">
						<view class="width-100 height-100 radius-full u-flex u-flex-center u-flex-items-center" style="background-color: #fff;
						box-shadow: 0px 2px 4px 1px rgba(0, 194, 44, 0.15);">
							<image src="../../static/sky/SEND/BG-04.png" mode="heightFix" class="height-60"></image>
						</view>
					</view>
					<view class=" font-size-12 font-bold p-t-20 text-center">
						FAQs
					</view>
				</navigator>

				<navigator class="text-center" url="/pages/about/about">
					<view class="u-flex u-flex-items-center u-flex-center">
						<view class="width-100 height-100 radius-full u-flex u-flex-center u-flex-items-center" style="background-color: #fff;
						box-shadow: 0px 2px 4px 1px rgba(0, 194, 44, 0.15);">
							<image src="../../static/sky/SEND/BG-05.png" mode="heightFix" class="height-60"></image>
						</view>
					</view>
					<view class=" font-size-12 font-bold p-t-20 text-center">
						About Us
					</view>
				</navigator>

				<navigator class="text-center" :url="`/pages/content/content?title=Latest Event &key=activity&src=''`">
					<view class="u-flex u-flex-items-center u-flex-center">
						<view class="width-100 height-100 radius-full u-flex u-flex-center u-flex-items-center" style="background-color: #fff;
						box-shadow: 0px 2px 4px 1px rgba(0, 194, 44, 0.15);">
							<image src="../../static/sky/SEND/BG-06.png" mode="heightFix" class="height-60"></image>
						</view>
					</view>
					<view class=" font-size-12 font-bold p-t-20 text-center">
						Latest Event
					</view>
				</navigator>
			</view>


		</view> -->
		<view class="u-flex-y u-flex-wrap width-690 u-flex-self-center m-t-20   radius-12" style="text-align: center;">
			<view class="u-flex p-20-0 u-flex-items-center nav-item font-size-20 font-bold">My Financial</view>
			<!-- <u-line color="#eee"></u-line> -->
			<view class="img-aa ">
				<navigator url="/pages/withdraw/withdraw"
					class="u-flex p-30-0 u-flex-items-center nav-item u-flex-between">
					<view class="u-flex u-flex-items-center">
						<image src="/static/gof/g-9-62.png" mode="aspectFit" class="icon-50 m-r-30 bg-white">
						</image>
						<text class="font-size-16">{{$t('user.withdraw')}}</text>
					</view>
					<u-icon name="arrow-right" color="#5b6cfa" size="18"></u-icon>
				</navigator>

				<u-line color="#000"></u-line>
				<navigator url="/pages/wallet_log/wallet_log"
					class="u-flex p-30-0 u-flex-items-center nav-item u-flex-between">
					<view class="u-flex u-flex-items-center">
						<image src="@/static/gof/g-9-64.png" mode="aspectFit" class="icon-50 m-r-30 bg-white">
						</image>
						<text class="font-size-16">{{$t('user.wallet_log')}}</text>
					</view>
					<u-icon name="arrow-right" color="#5b6cfa" size="18"></u-icon>
				</navigator>
			</view>

			<!-- <view class="img-aa">
			<navigator :url="`/pages/content/content?title=Salary &key=salary&src=''`" class="u-flex p-20-0 u-flex-items-center nav-item u-flex-between">
				<view class="u-flex u-flex-items-center">
					<image src="@/static/salary.png" mode="aspectFit" class="icon-60 m-r-30 bg-white"></image>
					<text class="font-size-16">Salary</text>
				</view>
				<u-icon name="arrow-right" color="#2fb7ec" size="18"></u-icon>
			</navigator>
			<u-line color="#000"></u-line>
			<navigator url="/pages/wallet_log/wallet_log" class="u-flex p-20-0 u-flex-items-center nav-item u-flex-between">
				<view class="u-flex u-flex-items-center">
					<image src="@/static/sky/SEND/BG-09.png" mode="aspectFit" class="icon-60 m-r-30 bg-white"></image>
					<text class="font-size-16">{{$t('user.wallet_log')}}</text>
				</view>
				<u-icon name="arrow-right" color="#2fb7ec" size="18"></u-icon>
			</navigator>
			</view> -->
			<!-- <u-line color="#eee"></u-line> -->

			<view class="u-flex p-20-0 u-flex-items-center nav-item font-size-20 font-bold m-t-40">My Detail</view>
			<!-- <u-line color="#eee"></u-line> -->
			<view class="img-aa ">
				<navigator url="/pages/user_info/user_info"
					class="u-flex p-30-0 u-flex-items-center nav-item u-flex-between">
					<view class="u-flex u-flex-items-center">
						<image src="@/static/nfc/icon/BG-16.png" mode="aspectFit" class="icon-50 m-r-30 bg-white">
						</image>
						<text class="font-size-16">Edit Profile</text>
					</view>
					<u-icon name="arrow-right" color="#5b6cfa" size="18"></u-icon>
				</navigator>
				<u-line color="#000"></u-line>
				<navigator @click="openPop" class="u-flex p-30-0 u-flex-items-center nav-item u-flex-between">
					<view class="u-flex u-flex-items-center">
						<image src="@/static/gof/g-9-65.png" mode="aspectFit" class="icon-50 m-r-30 bg-white">
						</image>
						<text class="font-size-16">{{$t('user.card')}}</text>
					</view>
					<u-icon name="arrow-right" color="#5b6cfa" size="18"></u-icon>
				</navigator>
			</view>
			<!-- <u-line color="#eee"></u-line> -->
			<view class="u-flex p-20-0 u-flex-items-center nav-item font-size-20 font-bold m-t-40">Other</view>
			<!-- <u-line color="#eee"></u-line> -->
			<view class="img-aa ">
				<view @click="openWin('customer')"
					class="u-flex p-30-0 u-flex-items-center u-flex-items-center nav-item u-flex-between">
					<view class="u-flex u-flex-items-center">
						<image src="@/static/gof/g-9-67.png" mode="aspectFit" class="icon-50 m-r-30 bg-white">
						</image>
						<text class="font-size-16">{{$t('user.contact')}}</text>
					</view>
					<u-icon name="arrow-right" color="#5b6cfa" size="18"></u-icon>
				</view>
				<u-line color="#000"></u-line>
				<navigator url="/pages/message/message"
					class="u-flex p-30-0 u-flex-items-center nav-item u-flex-between">
					<view class="u-flex u-flex-items-center">
						<image src="@/static/gof/g-9-66.png" mode="aspectFit" class="icon-50 m-r-30 bg-white">
						</image>
						<text class="font-size-16">{{$t('user.message')}}</text>
					</view>
					<u-icon name="arrow-right" color="#5b6cfa" size="18"></u-icon>
				</navigator>
			</view>
			<!-- 	<u-line color="#eee"></u-line>
			<navigator url="/pages/message/message" class="u-flex p-30-0 u-flex-items-center nav-item u-flex-between">
				<view class="u-flex u-flex-items-center">
					<image src="@/static/sky/SEND/BG-013.png" mode="aspectFit" class="icon-60 m-r-30 bg-white"></image>
					<text class="font-size-16">{{$t('user.message')}}</text>
				</view>
				<u-icon name="arrow-right" color="#2fb7ec" size="18"></u-icon>
			</navigator> -->

			<!-- <u-line color="#eee"></u-line> -->
			<!-- <view class="u-flex-y p-30-0 font-size-14 font-gray " style="text-align: left;">
				<text class="font-size-18 font-black">Important notes:</text>
				<text class="p-10-0">Our official communication regarding data-drive platform matters is strictly limited to our designated customer service channels. We do not utilize any other WhatsApp/Telegram contact number or social media platforms for such purposes, except for the WhatsApp and Telegram links provided on our platform. To ensure accurate and reliable information, please refer to the current customer service contact details available on our platform.</text>
				
			</view> -->





			<!-- <u-line color="#eee"></u-line> -->
			<view @click="onLogout" class="u-flex  u-flex-items-center img-aaa m-t-40" style="margin: 0 auto;">
				<!-- <image src="/static/Icon-024.png" mode="aspectFit" class="icon-70 m-r-30 bg-white"></image> -->
				<view class="font-size-18 u-flex u-flex-center  font-bold">
					<view class="text-center">
						{{$t('user.logout')}}
					</view>
				</view>
			</view>
		</view>

		<text class="u-flex-self-center font-size-12 m-80-0" style="color: #000;"> Copyright © 2024 Profitero All Rights
			Reserved</text>
		<userNav :title='4' />
		<uni-popup ref="popup" type="bottom">
			<scroll-view class="pop_box" :scroll-y="true">
				<view class="header font-white">
					<text>{{$t('user.withdraw_psw_title')}}</text>
					<image class="close" src="/static/close.png" mode="widthFix" @click="closePop"></image>
				</view>
				<view class="input_item margin_top_15 font-size-12">
					<text class="label">{{$t('user.withdraw_psw')}}</text>
					<input v-if='input_type == "password"' class="uni-input" maxlength="15" type="password"
						:placeholder="$t('user.withdraw_psw_desc')" v-model="pay_password" />
					<input v-else class="uni-input" maxlength="15" type="text"
						:placeholder="$t('user.withdraw_psw_desc')" v-model="pay_password" />
					<uni-icons v-if='input_type == "password"' class="eye" type="eye-filled" size="22" @click="onEye">
					</uni-icons>
					<uni-icons v-else class="eye" type="eye-slash-filled" size="22" @click="onEye"></uni-icons>
				</view>
				<view class="btn u-flex u-flex-center" @click="onCardBind">
					<view class="img-aaaa width-320">
						{{$t('user.withdraw_psw_btn')}}
					</view>
				</view>
				<view class="zhanwei"></view>
			</scroll-view>
		</uni-popup>
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
				title: 'PROFILE',
			}
		},
		methods: {
			initData() {
				var that = this;
				var postData = new Object();
				postData.requesTime = getApp().getTime();
				postData.userid = that.userInfo.userid;
				postData.token = that.userInfo.token;
				getApp().getData('api/getuserinfo', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#FF6A6C'
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
			copyUserid() {
				var that = this;
				uni.setClipboardData({
					data: that.userInfo.userid,
					showToast: false,
					success: function() {
						uni.showToast({
							title: that.$t('user.toast1'),
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
						title: that.$t('user.toast2'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (userInfo.pay_password != w_md5.hex_md5_32(that.pay_password)) {
					uni.showToast({
						title: that.$t('user.toast3'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				that.closePop();
				that.openWin('card_bind');
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
							cancelText: "Cancel",
							confirmText: "Confirm",
							confirmColor: '#009BE0'
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
				var that = this;
				uni.showModal({
					title: getApp().globalData.appname,
					content: that.$t('user.toast4'),
					confirmColor: '#092B8E',
					cancelText: that.$t('public.cancel'),
					confirmText: that.$t('public.logout'),
					success: function(res) {
						if (res.confirm) {
							getApp().removeCache('isLogin');
							getApp().removeCache('userInfo');
							uni.reLaunch({
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
			},
			changeHeadimg: function() {
				var userInfo = getApp().getCache('userInfo');
				var that = this;
				var postData = new Object();
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				uni.chooseImage({
					count: 1, //默認9
					sizeType: ['original', 'compressed'], //可以指定是原圖還是壓縮圖，默認二者都有
					sourceType: ['album'], //從相冊選擇
					success: function(res) {
						getApp().uploadImg('api/User/updHeadimg', postData, res.tempFilePaths[0], function(
							res) {
							if (res.status == 0) {
								uni.showModal({
									title: getApp().globalData.appname,
									content: res.message,
									showCancel: false,
									cancelText: that.$t('public.cancel'),
									confirmText: that.$t('public.confirm'),
									confirmColor: '#e7526e'
								});
							} else {
								var path = res.data;
								userInfo.headimg = path;
								that.userInfo.headimg = path;
								getApp().setCache('userInfo', userInfo);
								uni.$emit('refreshUserinfo');
							}
						});
					}
				});
			},

		}
	}
</script>

<style lang="scss">
	page {
		color: #333;
		min-height: 100%;
		// background-image: url("@/static/nfc/pic/BG-7.png");
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	.img-a {
		background-color: #111e2e;
		// background-image: url('@/static/nfc/button/BG-3.png');
		background-size: 100% 100%;
		// background-position: 100% 100%;
		background-repeat: no-repeat;
		// border-bottom-left-radius: 60rpx;
		// border-bottom-right-radius: 60rpx;
		border-radius: 15rpx;
	}

	.img-aa {
		background-color: #f8f9fa;
		border: 2rpx solid #000;
		// background-image: url('@/static/nfc/button/BG-12.png');
		background-size: 100% 100%;
		// background-position: 100% 100%;
		background-repeat: no-repeat;
		padding: 0 30rpx;
		border-radius: 15rpx;
	}

	.img-aaa {
		// width: 300rpx;
		background-color: #5b6cfa;
		color: #fff;
		padding: 30rpx 160rpx;
		text-align: center;
		// background-image: url('@/static/nfc/button/BG-5.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.img-aaaa {
		background-color: #5b6cfa;
		color: #fff;
		// width: 300rpx;
		padding: 30rpx 30rpx;
		text-align: center;
		// background-image: url('@/static/nfc/button/BG-5.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.content {
		height: 100%;
		// background-image: url("@/static/Element/SEND/Icon-025.png");
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
		font-size: 12px;
		color: #ffffff;
		margin-top: 3px;
	}

	.box1 .panel .info .data .desc {
		font-size: 15px;
		font-weight: 600;
	}

	.box1 .panel .info .data .desc::before {
		font-size: 12px;
		content: "USDT";
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
		box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
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
		background-color: #0f1b2d;
		padding: 15px;
		border-radius: 15px 15px 0 0;
		height: 40vh;
		box-sizing: border-box;
		// overflow-y: auto;
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
		// background-color: #2fb7ec;
		color: #000;
		text-align: center;
		height: 46px;
		// line-height: 46px;
		// border-radius: 25px;
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
		background-color: #ffffff;
		border: 1px solid #1a52c5;
		height: 46px;
		line-height: 46px;
		border-radius: 10px;
		padding-left: 120px;
		padding-right: 42px;
		text-align: right;
	}

	.infoBox {
		// box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);

	}

	.bg-color {
		// background-color: #ffffff;
		color: #333333;

	}

	.bg-color .label {
		color: #000;
		font-size: 12px;
	}

	.red {
		color: #ff0000;
	}

	.creditBg {
		background-color: #5b6cfa;
		// width: 100%;
		height: 10rpx;
		border-radius: 30rpx;
	}

	.creditNum {
		width: 80rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #5b6cfa;
		font-size: 20rpx;
		position: absolute;
		right: 0rpx;

	}
</style>