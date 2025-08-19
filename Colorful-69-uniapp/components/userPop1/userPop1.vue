<template>
	<view class="">
		<view @click="popShow.show=true" class="img-to-mask icon-50"
			style="mask-image: url(/static/home/ic_like_select.png); background: #fff;"></view>
		<u-popup mode="right" :show="popShow.show" bgColor="transparent">
			<view class="content">
				<!-- <eNav1 :id="1" class="dddsa"></eNav1> -->
				<view class="uninavbarborder2 u-flex u-flex-between u-flex-items-center width-full font-black ">
					
					<image @click="openWin2('index')" class="width-300 m-l-30" v-if="title == ''"
						src="/static/pro/Profitero-Logo-01.png" mode="widthFix">
					</image>
					<image @click="popShow.show=false" class="width-60 m-r-30" v-if="title == ''"
						src="/static/icon/62.png" mode="widthFix">
					</image>
				</view>
				<view class=" bgBox u-flex-y u-flex-items-center u-flex-center">
					<view class="bgBox1 ">
						<view @click="openWin2('index')"
							class="u-flex-between width-600 height-120 u-flex u-flex-items-center bg-white radius-9"
							:class="animation?'btns':'' " style="box-shadow: 1px 2px 6px 2px #999;">
							<view class="u-flex-x">
								<image src="../../static/icon/15.png" mode="widthFix" class="width-60"></image>
								<text class="m-l-30 font-black" style="line-height: 70rpx;">Home</text>
							</view>
							<image src="../../static/icon/2.png" mode="widthFix" class="width-40"></image>
							<!-- <u-icon name="arrow-right" color="#0279fe" size="18"></u-icon> -->
						</view>
						<view @click="openWin2('start')"
							class="u-flex-between width-600 height-120 u-flex u-flex-items-center bg-white radius-9 m-t-30"
							:class="animation?'btns':'' "
							style="box-shadow: 1px 2px 6px 2px #999;background-color: #0279fe;">
							<view class="u-flex-x">
								<image src="../../static/pro/36.png" mode="widthFix" class="width-60"></image>
								<text class="m-l-30 font-white" style="line-height: 60rpx;">Get started</text>
							</view>
							<image src="../../static/icon/60.png" mode="widthFix" class="width-40"></image>
							<!-- <u-icon name="arrow-right" color="#0279fe" size="18"></u-icon> -->
						</view>
						<view @click="openWin2('user')"
							class="u-flex-between height-120 u-flex u-flex-items-center m-t-40"
							:class="animation?'btns':'' ">
							<view class="u-flex-x">
								<image src="../../static/icon/61.png" mode="widthFix" class="width-60"></image>
								<text class="m-l-30" style="line-height: 60rpx;">My profile</text>
							</view>

							<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>
						</view>

						<view class=" height-120 u-flex u-flex-items-center" :class="animation?'btns':'' ">
							<navigator :url="`../content/content?title=Agent Mode&key=agent`"
								class="u-flex-between width-full height-90 u-flex u-flex-items-center">
								<view class="u-flex-x">
									<image src="../../static/qq1.png" mode="widthFix" class="width-60"></image>
									<text class="m-l-30" style="line-height: 60rpx;">Agent Mode</text>
								</view>
								<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>

							</navigator>
						</view>

						<!-- 0 
					:url="`/pages/content/content?title=Certificate&key=${isEn?'en_':''}certificate`"-->
						<view class=" height-120 u-flex u-flex-items-center" :class="animation?'btns':'' ">
							<navigator
								:url="`../content/content?title=${encodeURIComponent('Terms & Conditions')}&key=agreement_desc&img=`+'/static/icon/50.png'"
								class="u-flex-between width-full height-90 u-flex u-flex-items-center">
								<view class="u-flex-x">
									<image src="../../static/home/ic_like_select.png" mode="widthFix" class="width-60"></image>
									<text class="m-l-30" style="line-height: 60rpx;">Terms & Conditions</text>
								</view>
								<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>

							</navigator>
						</view>
						<view class=" height-120 u-flex u-flex-items-center" :class="animation?'btns':'' ">
							<navigator :url="`../content/content?title=FAQs&key=help&img=`+'/static/icon/53.png'"
								class="u-flex-between width-full height-90 u-flex u-flex-items-center">
								<view class="u-flex-x">
									<image src="../../static/icon/17.png" mode="widthFix" class="width-60"></image>
									<text class="m-l-30" style="line-height: 60rpx;">FAQs</text>
								</view>
								<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>

							</navigator>
						</view>

						<view class=" height-120 u-flex u-flex-items-center" :class="animation?'btns':'' ">
							<navigator :url="`../content/content?title=Latest Event&key=activity&img=`+''"
								class="u-flex-between width-full height-90 u-flex u-flex-items-center">
								<view class="u-flex-x">
									<image src="../../static/icon/16.png" mode="widthFix" class="width-60"></image>
									<text class="m-l-30" style="line-height: 60rpx;">Latest Event</text>
								</view>
								<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>

							</navigator>
						</view>

						<!-- <view @click="menuPop(2)" class="u-flex-between height-90 u-flex u-flex-items-center">
						<view class="u-flex-x">
							<image src="../../static/at/26.png" mode="widthFix" class="width-40"></image>
							<text class="m-l-30">FAQs</text>
						</view>
						<u-icon name="arrow-right" color="#fff" size="18"></u-icon>
						
					</view>
				
					<view @click="menuPop(1)"  class="u-flex-between height-90 u-flex u-flex-items-center">
						<view class="u-flex-x">
							<image src="../../static/at/25.png" mode="widthFix" class="width-40"></image>
							<text class="m-l-30">Latest Event</text>
						</view>
						<u-icon name="arrow-right" color="#fff" size="18"></u-icon>
						
					</view> -->

						<!-- <navigator url="/pages/vip/vip" class="p-0-30 height-50 u-flex u-flex-items-center">Membership
					</navigator> -->



						<!-- </u-collapse-item> -->
						<!-- </u-collapse> -->

						<!-- <navigator url="/pages/user/user" class="p-0-30 height-50 u-flex u-flex-items-center">Profile
					</navigator> -->

						<!-- <view style="padding:  30rpx;"   :class="animation?'btns':'' ">
						<navigator :url="`../content/content?title=Salary&key=salary&img=`+''">
							<view class="u-flex u-flex-between u-flex-items-center">
								<view class="u-flex-x">
									<image src="../../static/home/ic_like_normal.png" mode="widthFix" class="width-60"></image>
									<text class="m-l-30">Salary</text>
								</view>
								<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>
							</view>
						</navigator>
					</view> -->


						<!-- <view @click="openWin2('customer')" style=""  class="u-flex-between height-120 u-flex u-flex-items-center"  :class="animation?'btns':'' ">
						<view class="u-flex-x">
							<image src="../../static/icon/33.png" mode="widthFix" class="width-60"></image>
							<text class="m-l-30">Contact US</text>
						</view>
						<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>
					</view> -->

						<view @click="openWin2('check_in')" class="u-flex-between height-120 u-flex u-flex-items-center"
							:class="animation?'btns':'' ">
							<view class="u-flex-x">
								<image src="../../static/icon/32.png" mode="widthFix" class="width-60"></image>
								<text class="m-l-30" style="line-height: 60rpx;">Check In/ Salary</text>
							</view>
							<u-icon name="arrow-right" color="#0279fe" size="18"></u-icon>

						</view>
					</view>
				</view>

			</view>
		</u-popup>



		<u-popup :closeOnClickOverlay="true" @click="showVip=false" mode="center" :show="showVip" bgColor="transparent">
			<view class="u-flex-y u-flex-items-center width-690">
				<text class="font-white font-bold p-b-30">{{$t('index.popVipTitle')}}</text>
				<scroll-view scroll-y="true" style="max-height: 86vh;">
					<view class="u-flex-y ">
						<view class="bg-white p-30 radius-12 u-flex-y u-flex-start p-30 m-b-30" style=""
							v-for="(pop,index) in vip_list" :key="index">
							<view class="u-flex-x">
								<image :src="pop.logo" mode="aspectFit" class="icon-100">
								</image>
								<text class="font-bold m-t-20 font-size-16 m-l-20">{{pop.name}}</text>
							</view>
							<scroll-view scroll-y="true" style="max-height: 280rpx;">

								<rich-text class="font-size-13" :nodes="pop.content">
								</rich-text>
							</scroll-view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "userPop",
		props: {
			popShow: {
				type: Object,
				default: () => {
					show: false
				}
			}

		},
		data() {
			return {
				animation: true,
				userInfo: getApp().getCache('userInfo'),
				show: false,
				showVip: false,
				title: '',
				vip_list: [],
				cancelText: 'Cancel',
				confirmText: 'Confirm',
				message: 'Confirm to log out?',
				isEn: true
			};

		},
		created() {
			this.initData();
		},
		methods: {
			openWin(path) {
				this.show = false;
				uni.navigateTo({
					url: '../content' + path + '/' + path + '?&id=1'
				});
			},
			openWin2(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
			menuPop(typeIndex) {
				var that = this;
				let title = [that.$t('index.panel5'), that.$t('index.panel6'), that.$t('index.panel7'), that.$t(
					'index.panel8')][typeIndex]
				let bgPath = [
					'/static/at/24.png',
					'/static/at/25.png',
					'/static/at/27.png',
					'/static/at/26.png'
				][typeIndex]
				let key = ['agreement_desc', 'activity', 'help', 'about_us'][typeIndex]
				let config = getApp().getCache('config')
				let content = config[key]
				this.pop.title = title
				this.pop.content = content
				this.pop.bgPath = bgPath
				this.pop.show_id = typeIndex
				this.pop.show = true
			},
			openUrl(url) {
				getApp().openUrl(url)
			},
			close() {
				this.popShow = false
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
			initData() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				console.log('userInfo', userInfo)
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/User/getIndex', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#003A7E'
						});
					} else {
						that.vip_list = res.data.vip_list;
						if (res.data.no_read_message > 0) {
							that.red_dot = "../../static/red_dot.png";
						}
						var config = res.data.config;
						getApp().setCache('config', config);
						that.alert_img = config.alert_img;
						console.log(that.alert_img);
						if (config.is_alert_img == 1 && !getApp().getCache('_OneLogin')) {
							getApp().setCache('_OneLogin', 1);
							that.is_alert_img = "show";
						}
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
			onLogout() {
				getApp().removeCache('isLogin');
				getApp().removeCache('userInfo');
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
	.content {
		background: #FBF7F0 url(/static/datahawk/pic/1.png) no-repeat center /contain;
		background-attachment: fixed;
		min-height: 100vh;
		width: 750rpx;
	}

	.dddsa ::v-deep .uninavbarborder2 {
		background: #FEFFFA;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
	}

	.uninavbarborder2 {
		// width: 460px;
		height: 180rpx;
		position: fixed;
		z-index: 4;
		background-image: url(/static/datahawk/pic/BG-44.png);
		// background-color: #000;
		// background-image: url(/static/at/tabars.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-position: center;
		// justify-content: space-between;
	}

	.bgBox {
		width: 100%;
		height: 1100rpx;
		margin-top: 14vh !important;
		border-radius: 12rpx;
		margin: 0 auto;
		padding: 30rpx;
		// background-image: url(/static/datahawk/pic/BG-11.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		overflow: auto;

	}

	// @media screen and (min-width: 750px) {
	// 	.bgBox {
	// 		width: 400px;
	// 	}
	// }

	.bgBox1 {
		width: 100%;
		height: 0;
		display: flex;
		font-size: 18px;
		flex-direction: column;
		font-weight: bold;
		justify-content: center;
		align-items: center;
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: 12px;
		padding-bottom: 50rpx;
		color: #000;

	}

	@keyframes show {
		0% {
			bottom: 0;
		}

		100% {
			bottom: 26%;
		}
	}

	.pop-bg {
		color: white;
		width: 690rpx;
		background-image: url(/static/at/22.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center;
		position: relative;
	}

	.bgBox1>view {
		padding: 20rpx 30rpx;
		width: 100%;
		border-bottom: 2px solid #c6c6c6;
	}

	::v-deep.u-popup__content {
		background-color: transparent;
	}

	.btns {
		animation: bounce 1s infinite;
	}

	@keyframes bounce {
		// 0% { transform: translateY(0); }
		// 50% { transform: translateY(-20px); } 
		// 100% { transform: translateY(0); }
	}
</style>