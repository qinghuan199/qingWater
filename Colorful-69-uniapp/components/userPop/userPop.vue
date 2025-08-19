<template>
	<view>

		<view @click="onPopShow" class="img-to-mask icon-50"
			style="mask-image: url(/static/home/ic_like_select.png); background: #fff;"></view>
		<u-popup mode="right" :show="popShow" bgColor="transparent" @close="popShow=false">
			<scroll-view  :scroll-y="true" class="width-600 u-flex-y font-size-14  u-flex-between content1" style="">
				<view class="u-flex-y">
					<view class="p-40 text-center u-flex u-flex-content-center u-flex-items-center"
						style="height: 86rpx;">
						<text class="font-size-18 font-bold"
							style="color:#fff;position: absolute;right: 30rpx;top: 20rpx;" @click="close">✕</text>
						<!-- 	<image src="/static//logo/1.png" mode="widthFix" style="margin: 0px auto;" class="width-220">
							</image> -->
					</view>
					<view class="userInfo p-t-80 u-flex-y text-center u-flex-items-center u-flex-column">
						<image :src="userInfo.headimg" mode="widthFix"
							class="width-180 height-180 u-flex-self-center radius-full border-white "
							style="position: absolute;top: -90rpx;">
						</image>
						<view class="m-t-40 u-flex-items-center">
							<text class="font-bold font-size-20"
								style="vertical-align: middle;">{{userInfo.username}}</text>
							<image :src="userInfo.vip.logo" style="vertical-align: middle;" mode="aspectFit"
								class="icon-50 m-l-10"></image>
							<!-- <view class="m-t-20">
									<text class="m-t-20 font-bold">{{userInfo.phone}}</text>
								</view> -->
						</view>
						<view class="u-flex u-flex-items-center m-t-30 m-b-20 u-margin-center-auto" style="width:90%;">
							<view class=" font-black  m-r-10 font-size-16 text-center "
								style="flex-shrink: 0; color: #237aff;">
								{{$t('user.credit_score')}}
							</view>
							<view class="radius-12 m-t-5" style="background-color: #c8c8c8;width: 350rpx">
								<view class="u-flex u-flex-items-center creditBg " style="position: relative; "
									:style="{width:`${userInfo.credit_value}%`}">
									<view class=" font-bold  font-white creditNum">
										{{userInfo.credit_value}}%
									</view>
								</view>
							</view>
						</view>
						<view class="u-flex-x u-flex-around width-full font-size-14 m-t-30">
							<view class="u-flex-y u-flex-items-center width-220">
								<view class="font-size-12 width-180 text-center  " style=" color:#237aff">
									Referral Code <br />
									<!-- 									<text style="opacity: 0;">(USDT)</text> -->
								</view>
								<view class="font-bold m-t-10 font-size-14 text-center"
									style="font-family: Microsoft YaHei;" @click="copyUserid"><text class="notranslate">
										{{userInfo.userid}}
									</text></view>
							</view>
							<u-line direction="col" class="height-80" color="#237aff"></u-line>
							<view class="u-flex-y u-flex-items-center width-220">
								<view class="font-size-12 width-180 text-center  " style=" color:#237aff">
									{{$t('user.today_income')}}
								</view>
								<view class="font-bold m-t-10 font-size-14 text-center"
									style="font-family: Microsoft YaHei;"><text class="notranslate">
										USDT {{userInfo.today_income}}
									</text></view>
							</view>
							<u-line direction="col" class="height-80" color="#237aff"></u-line>
							<view class="u-flex-y u-flex-items-center width-220">
								<view class="font-size-12 width-180 text-center  " style=" color:#237aff">
									{{$t('user.wallet')}}
								</view>
								<view class="font-bold m-t-10 font-size-14 text-center"
									style="font-family: Microsoft YaHei;"> <text class="notranslate">
										USDT {{userInfo.wallet}}
									</text></view>
							</view>
						</view>
						<view class="width-600">
							<navigator url="/pages/start/start">
								<view class="p-30 u-flex-x m-t-20"
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/BG-038.jpg" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">Create Data </text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<view class="font-bold p-30 u-flex-x " style="border-bottom: 2rpx solid #e6e6e6 ;">
								{{$t('user_info')}}
							</view>

							<!-- 個人資料 -->
							<navigator url="/pages/user_info/user_info">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/18.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('user.info')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<navigator :url="`/pages/content/content?title=Agent Mode&key=agent`">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/23.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">Agent Mode</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<navigator url="/pages/vip/vip">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/29.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">User Level</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<!-- 		<navigator url="/pages/password/password">
									<view class="p-30 u-flex-x "
										style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
										<view style="display: flex;justify-content: flex-start;align-items: center;">
											<image src="/static/pro/SEND/BG-034.png" mode="widthFix" class="width-50">
											</image>
											<text class="font-size-14 m-l-40">Change Password & Pin</text>
										</view>
								
										<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
									</view>
								</navigator> -->



							<view class="font-bold p-30 u-flex-x " style="border-bottom: 2rpx solid #e6e6e6 ;">
								{{$t('wallet_log')}}
							</view>
							<navigator url="/pages/card_bind/card_bind">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/28.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('user.card')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<navigator url="/pages/recharge/recharge">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/21.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('user.recharge')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<!-- 提現 -->
							<navigator url="/pages/withdraw/withdraw">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/14.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('user.withdraw')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>

							<navigator url="/pages/wallet_log/wallet_log">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/15.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('wallet_log')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<!-- 通知 -->
							<navigator url="/pages/message/message">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/20.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('user.notifications')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<navigator :url="`/pages/content/content?title=Latest Event&key=activity`">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/22.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">Latest Event</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>

							<navigator url="/pages/check_in/check_in">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/19.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">Check In/Salary</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>




							<view class="font-bold p-30 u-flex-x " style="border-bottom: 2rpx solid #e6e6e6 ;">
								About Us
							</view>

							<!-- 	<view @click="showPop(3)" class="p-30 u-flex-x "
										style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
										<view style="display: flex;justify-content: flex-start;align-items: center;">
											<image src="/static/de/30.png" mode="widthFix" class="width-50"></image>
											<text class="font-size-14 m-l-40">{{$t('index.panel8')}}</text>
										</view>
							
										<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
									</view> -->
							<navigator :url="`/pages/content/content?title=${$t('index.panel2')}&key=certificate`">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/15.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('index.panel2')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<navigator
								:url="`/pages/content/content?title=${encodeURIComponent($t('index.panel5'))}&key=agreement_desc`">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/24.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('index.panel5')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<navigator :url="`/pages/content/content?title=${$t('index.panel5')}&key=help`">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/25.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">{{$t('index.panel7')}}</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator>
							<!-- 聯係我們 -->
							<!-- 			<view @click="openWin('customer')" class="p-30 u-flex-x "
								style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
								<view style="display: flex;justify-content: flex-start;align-items: center;">
									<image src="/static/pro/SEND/BG-01.png" mode="widthFix" class="width-50"></image>
									<text class="font-size-14 m-l-40">{{$t('user.contact')}}</text>
								</view>

								<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
							</view>

					
							<navigator url="/pages/invitation/invitation">
								<view class="p-30 u-flex-x "
									style="border-bottom: 2rpx solid #e6e6e6 ;justify-content: space-between;align-items: center;">
									<view style="display: flex;justify-content: flex-start;align-items: center;">
										<image src="/static/pro/SEND/BG-021.png" mode="widthFix" class="width-50">
										</image>
										<text class="font-size-14 m-l-40">Invite Friends</text>
									</view>

									<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
								</view>
							</navigator> -->

							<view @click="onLogout" class="width-289  text-center p-20  radius-5 m-t-50"
								style="margin: 20rpx auto;background-color: #ce0c29;color: #ffffff;">
								<text>{{$t('public.logout')}} </text>
							</view>
							<view class=" text-center" style="padding: 30rpx 10rpx;">
								<text class="font-size-10 " style="color: #666;">
									{{$t('login.banquan')}}
								</text>
							</view>
						</view>


					</view>
				</view>

			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "userPop",
		data() {
			return {
				popShow: false,
				userInfo: getApp().getCache('userInfo'),
				show: false,
				title: '',
				cancelText: 'Cancel',
				confirmText: 'Confirm',
				message: 'Logout now?',
				passive:true
			};

		},
		watch: {
			popShow(n, v) {
				if (n) {
					this.userInfo = getApp().getCache('userInfo');
					document.body.addEventListener('touchmove', this.preventScroll, {
						passive: false
					});
				} else {
					document.body.removeEventListener('touchmove', this.preventScroll);
				}
			}
		},

		methods: {
			preventScroll(e) {
				e.preventDefault();
			},
			close() {
				this.popShow = false
			},
			closePopup() {
				this.popShow = false;
			},
			onPopShow() {
				this.popShow = true
				this.initDatas()
			},
			initDatas() {
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
							confirmText: that.$t('public.confirm'),
							cancelText: that.$t('public.cancel'),
							confirmColor: '#009BE0'
						});
					} else {
						var userInfo1 = res.data.userInfo;
						userInfo = userInfo1;
						getApp().setCache('userInfo', userInfo1);
						uni.$emit('refreshStartUserinfo');
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
							confirmColor: '#00B8D4'
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
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
			onLogout() {
				var that = this;
				uni.showModal({
					title: getApp().globalData.appname,
					content: that.$t('user.toast4'),
					confirmColor: '#00B8D4',
					cancelText: that.$t('public.cancel'),
					confirmText: that.$t('public.confirm'),
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
			}
		}
	}
</script>

<style lang="scss">
	.content1 {
		background-color: #fff;
		color: #000;
		height: 100vh;
		background-image: url(@/static/pro/SEND/BG-019.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
	}

	::v-deep.u-modal__content {
		background-color: rgba(51, 55, 85, 1);
	}

	::v-deep.u-popup__content {
		background-color: rgba(51, 55, 85, 1);
		border-radius: 50rpx !important;
	}

	.userInfo {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-color: #fff;
		margin-top: 100rpx;
		position: relative;
		// height: 100vh;
		border-radius: 30rpx 30rpx 0 0;

	}

	.uslider1 {
		// position: absolute;
		width: 80%;
		// top: 10%;
		// left: 25%;
	}

	.uslider {
		width: 100%;
		height: 10rpx;
		background-color: #f4c9c9;

		// border: 1px solid #efefef;
		border-radius: 30rpx;

	}

	.uslider2 {
		// z-index: 10;
		position: relative;
		height: 10rpx;
		// border-top-right-radius: 27px;
		// border-bottom-right-radius: 27px;
		background: #a9d85b;
		border-radius: 30rpx;

	}

	.usliderBut {
		width: 80rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 60rpx;
		background: #a9d85b;
		position: absolute;
		right: -53px;
		top: 50%;
		color: #fff;
		font-size: 24rpx;
		transform: translate(-50%, -50%);
	}

	.creditBg {
		background-color: #237aff;
		height: 12rpx;
		border-radius: 30rpx;
	}

	.creditNum {
		width: 80rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #237aff;
		font-size: 10px;
		position: absolute;
		right: -40rpx;
	}
</style>