<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">

		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>

		<view class="uni-padding-wrap uni-common-mt p-20-0">
			<uni-segmented-control :current="current" :values="items" :style-type="styleType"
				:active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<u-line></u-line>
		<view class="content1 m-t-30">
			<view v-if="current === 0">
				<view class="box1 u-flex u-flex-center">
					<view class="info width-690 p-60-30" style="position: relative;">
						<view class="label">{{$t('withdraw.wallet')}}</view>
						<view class="desc font-bold">USDT {{userInfo.wallet}}</view>
						<view class="u-flex-y label font-size-12 margin_top_10">
							<text>*You will receive your withdrawal within an hour</text>
						</view>
						<!-- 	<view class="text-center" style="position: absolute; top: 30rpx ; right: 30rpx;">
							<image src="@/static/gof/g-9-41.png" mode="widthFix" class="width-150"></image>
						</view> -->
					</view>
				</view>

				<view class="box2 m-t-50">
					<view class="font-black">
						<view class=" u-flex u-flex-items-center">
							<image src="/static/11.png" mode="widthFix" class="width-40"></image>
							<view class="title m-l-20">
								Withdrawal
								Method
							</view>
						</view>
						<view class="panel desc">Withdrawals will be transferred to the address provided</view>
					</view>
					<!-- <view class="text-center" style="">
						<image src="@/static/sky/SEND/11.png" mode="widthFix" style="margin-top: -60rpx;" class="width-120"></image>
					</view> -->
					<!-- <view class="info p-30 font-bold text-center">
						<view class="label">{{$t('withdraw.wallet')}}</view>
						<view class="desc font-size-30 m-t-40">USDT {{userInfo.wallet}}</view>
						<view class="u-flex-y label margin_top_20">
							<text>*Your will receive your withdrawal within 5-30 minutes!</text>
						</view>
					</view> -->
					<view class="login-form u-flex-y  radius-12 m-t-50">
						<view class="font-error u-label width-370 font-bold"
							style="color:#404759; font-size:26rpx; flex-shrink: 0;">
							Withdraw Amount (USDT)
						</view>
						<view class="u-flex-x p-30 u-flex-items-center bg-white radius-8 m-t-20">

							<input class="m-l-20 uni-input width-full money" maxlength="15"
								placeholder-style="color:#ddd" type="text"
								:placeholder="$t('withdraw.withdraw_money_desc')" v-model="withdraw_money" />
							<text class="font-bold text-underline" style="color: #237aff;"
								@click="withdraw_money = userInfo.wallet">All</text>
						</view>
						<!-- <u-line></u-line> -->

						<view class="font-error u-label width-270 m-t-50 font-bold"
							style="white-space: nowrap;color:#404759;  font-size:26rpx; flex-shrink: 0;">Withdrawal
							Pin</view>
						<view class="u-flex-x p-30 u-flex-items-center  bg-white radius-8 m-t-20">

							<input class="m-l-20 uni-input width-full money" maxlength="15" type="password"
								:placeholder="$t('withdraw.withdraw_psw_desc')" v-model="pay_password"
								placeholder-style="color:#ddd" />
						</view>
					</view>

				</view>
				<view class="recharge">
					<view class="button" @click="onWithdraw()">
						{{$t('withdraw.submit')}}
					</view>
				</view>
			</view>
			<view v-if="current === 1">

				<view class="box1" style="border-bottom: 1px solid #999;">
					<view class="">
						<view class="u-flex-y label text-center font-size-12 margin_top_20 " style="margin: 0 auto;">
							<text>*You will receive your withdrawal within an hour</text>
						</view>
					</view>
				</view>
				<view class="content-1">
					<view class="content-1-flex" style="border-bottom: 1px solid 999;" v-for="(item, index) in list"
						:key="index">
						<view>
							<view style="font-weight: 500;" class="font-black">{{item.create_time}}</view>
							<view class="font-main-color m-30-0" style="font-weight: bold; color: #000;">Withdraw Amount
							</view>
							<view style="font-weight: 800;font-size: 40rpx; color: #000;">USDT {{item.money}}</view>
						</view>
						<view class="content-1-border">
							<button v-if="item.status === 0" size="mini"
								style="border: 1px solid #d5d5d5; color:#9f9f9f; background-color: transparent;border-radius: 80rpx;">Pending</button>
							<button v-if="item.status === 1" size="mini"
								style="border: 1px solid #07b363;color:#07b363; background-color: transparent;border-radius: 80rpx;">Completed</button>
							<button v-if="item.status === 2" size="mini"
								style="border: 1px solid #dc959b;color:#dc959b;background-color: transparent;border-radius: 80rpx;">Rejected</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<selfModal :modal-form="modalForm"></selfModal>
	</view>
</template>

<script>
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js";
	export default {
		components: {
			w_md5
		},
		onLoad() {
			var that = this;
		},
		onShow() {
			var that = this;
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: '../withdraw_log/withdraw_log'
			});
		},
		data() {
			return {
				pay_password: "",
				withdraw_money: "",
				userInfo: getApp().getCache('userInfo'),
				items: ['Withdraw Now', 'Withdraw History'],
				current: 0,
				activeColor: '#526cfd',
				styleType: 'text',
				list: [],
				list1: [{
						create_time: '2022-2-2',
						money: '200',
						status: 2
					},
					{
						create_time: '2022-2-2',
						money: '200',
						status: 0
					},
					{
						create_time: '2022-2-2',
						money: '200',
						status: 1
					},
				],
				totalSize: 0,
				totalPage: 0,
				mCurrentPage: 0,
				title: 'Withdraw',
				modalForm: {
					show: false,
					bgImg: true,
					content: 'resort ideal for those seeking',

				}
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
					console.log(this.current);
				}
				if (e.currentIndex === 1) {
					var that = this;
					that.initData(1)
				}
			},
			onWithdraw() {
				var that = this;
				var withdraw_money = 0;
				if (that.userInfo.card_bind_status == 0) {
					uni.showModal({
						title: getApp().globalData.appname,
						content: that.$t('withdraw.toast1'),
						confirmColor: '#092B8E',
						cancelText: that.$t('public.cancel'),
						confirmText: that.$t('public.bind'),
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../card_bind/card_bind'
								});
							}
						}
					});
					return;
				}
				uni.showModal({
					title: getApp().globalData.appname,
					content: that.$t('withdraw.toast2'),
					confirmColor: '#092B8E',
					cancelText: that.$t('public.cancel'),
					confirmText: that.$t('public.confirm'),
					success: function(res) {
						withdraw_money = +that.withdraw_money;
						if (res.confirm) {
							if (getApp().isEmpty(withdraw_money)) {
								uni.showToast({
									title: that.$t('withdraw.toast3'),
									icon: 'none',
									duration: 2000
								});
								return;
							}
							if (!that.verify_money(withdraw_money)) {
								uni.showToast({
									title: that.$t('withdraw.toast4'),
									icon: 'none',
									duration: 2000
								});
								return;
							}
							if (withdraw_money > that.userInfo.wallet) {
								uni.showToast({
									title: that.$t('withdraw.toast5'),
									icon: 'none',
									duration: 2000
								});
								return;
							}
							that.withdraw_money = withdraw_money;
							that.withdraw();
						}
					}
				});
			},
			withdraw() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.money = that.withdraw_money;
				postData.pay_password = w_md5.hex_md5_32(that.pay_password);
				getApp().getData('api/User/withdraw', postData, function(res) {
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
						// uni.showToast({
						// 	title: that.$t('withdraw.toast6'),
						// 	icon: 'none',
						// 	duration: 2000
						// });
						that.modalForm = {
							show: true,
							bgImg: true,
							content: res.message,

						}
						userInfo.wallet = that.money(userInfo.wallet - that.withdraw_money);
						getApp().setCache('userInfo', userInfo);
						that.userInfo = userInfo;
						uni.$emit('refreshUserinfo');
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
				getApp().getData('api/User/getWithdrawLog', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.logout'),
							confirmColor: '#092B8E'
						});
					} else {
						if (page == 1) {
							that.list = res.data.list;
						} else {
							var pageDatas = (that.list).concat(res.data.list);
							that.list = pageDatas;
						}
						if (res.data.list.length == 0) {
							uni.showToast({
								title: that.$t('public.no_data'),
								icon: 'none',
								duration: 2000
							});
							return;
						}
						that.totalSize = res.data.totalElements;
						that.totalPage = res.data.totalPages;
						that.mCurrentPage = res.data.pageNow;
					}
				})
			},
			verify_money(money) {
				var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
				if (reg.test(money)) {
					return true;
				} else {
					return false;
				};
			},
			money(price) {
				return getApp().money(price);
			},
			onAll() {
				var that = this;
				that.withdraw_money = that.userInfo.wallet;
			},
			openWin(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
			onBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		color: #000;
		// min-height: 100%;
		background-image: none;
		background-color: #ecfbff;
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// background-attachment: fixed;
	}

	.box1 {
		padding: 15px;
		padding-top: 0px !important;
		position: relative;
	}

	.box1 image {
		width: 100%;
	}

	::v-deep.segmented-control__text {
		color: #807c72 !important;
		font-weight: bold;
	}

	::v-deep.segmented-control__item--text {
		color: #237aff !important;
		font-weight: bold;
		// border-bottom: none !important;
	}

	.box1 .info {
		background-image: url("@/static/pro/SEND/BG-019.png");
		background-repeat: no-repeat;
		background-size: 100% auto;
		border-radius: 10px;
		padding: 20px 15px;
		color: #fff;
	}

	.box1 .info .label {
		font-size: 14px;
	}

	.box1 .info .desc {
		font-size: 20px;
		margin-top: 5px
	}

	.box2 {
		width: 690rpx;
		margin: 0 auto;
		border-radius: 30rpx;
		// padding: 30rpx;
		// background: transparent;
		// background: linear-gradient(to bottom, #bfc9d6, transparent);
	}

	.box2 .bg {
		padding: 15px 5px 15px 15px;
		background-color: #FFFFFF;
		border-radius: 10px;
	}

	.box2 .title {
		font-size: 16px;
		font-weight: 700;
	}

	.box2 .all {
		font-weight: normal;
		margin-right: 15px;
		font-size: 14px;
		color: $main-color;
	}

	.box2 .demo-uni-row {
		width: 100%;
	}

	.box2 .panel {
		padding-right: 10px;
		margin-top: 12px;
	}

	.box2 .panel .money {
		background-color: #ffffff;
		height: 55px;
		line-height: 55px;
		padding: 0 20px;
		border-radius: 15px;
		box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
		font-size: 15px;
	}

	.recharge {
		display: flex;
		justify-content: center;
		margin-top: 30px;
		margin-bottom: 10px;
	}

	.recharge .button {
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		// position: absolute;
		background-color: #237aff;
		border-radius: 30rpx;
		// background-image: url('@/static/nfc/button/BG-5.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		// bottom: -80rpx;
		// left: 50%;
		// transform: translate(-50%,-50%);
		color: #fff;
	}

	.box2 .desc {
		font-size: 13px;
	}

	.actived {
		background-color: $main-color !important;
		color: #FFFFFF !important;
	}

	.actived .desc {
		color: #FFFFFF !important;
	}

	.title-1 {
		border-bottom: 1px solid #999;
		padding: 30rpx;
	}

	.content-1 {
		padding-bottom: 40rpx;
	}

	.content-1-flex {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1px solid #999;
	}

	.tips {
		font-size: 12px;
		text-align: start;
		color: #858585;
		margin-bottom: 10rpx;
		padding: 10rpx 30rpx;
	}
</style>