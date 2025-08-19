<template>
	<view class="content u-flex-y">
		<meta name="theme-color" content="#0a172b">
		<eNav2></eNav2>
		<customer></customer>
		<view class="u-flex-y u-flex-self-center " style="width:100%;">
			<view
				class="u-flex-x u-flex-between u-m-c-auto u-flex-items-center font-bold p-10-0  width-690  font-white">
				<text class="font-size-18" style="opacity: 0;">Starting</text>
				<!-- 	<view class="u-flex-x u-flex-items-center">
					<text class="font-size-14">{{userInfo.username}}</text>
					<image :src="userInfo.vip.logo" mode="aspectFit" class="icon-50 "></image>
				</view> -->

			</view>
		


		</view>
		<view class="u-flex-y u-flex-around width-690 u-flex-self-center  bg-white shadow-gray radius-15 p-40-0 ">

			<view class="box4">
				<view class="image-container">
					<image v-for="(image, index) in images" :key="index"
							:class="['image-item', { active: currentImageIndex === index, 'slide': currentImageIndex !== index && lastImageIndex === index }, getSlideDirectionClass()]"
							:src="`/static/start/${image}.jpg`" mode="aspectFit">
					</image>
				</view>
		
			</view>
			<view class="box3 p-0-30">
	<!-- 			<view class="btn " @click="onStart">{{$t('start.title')}}
					({{userInfo.task_finish}}/{{userInfo.vip.task_everyday}})
					</view> -->
			</view>
			<view class="fl_between p-r-40">
				<view></view>
				<view class="u-flex-x " @click="openWin('order')" style="z-index: 2;">
					<text class="font-size-14"> {{$t('order')}}</text>
					<uni-icons type="right" size="16" class="font-bold" color="#237aff"></uni-icons>
				</view>
			</view>

			<view class="u-flex-y u-flex-items-center u-flex-between text-center  p-b-10 m-b-40 "
				style="border-bottom: 2rpx solid #e6e6e6;margin-top: -18px;">
				<image src="/static/pro/SEND/10.png" mode="aspectFit" class="icon-70">
				</image>
				<view class="">
					<view class="p-10-0 font-size-12" style="color: #000;">{{$t('start.wallet')}}</view>
					<view class="font-bold font-size-14 p-t-10  text-center font-main-color"
						style="font-family: Microsoft YaHei;">USDT
						{{userInfo.wallet}}
					</view>
				</view>
				<view class="font-gray2 width-320  font-size-12 p-t-10">{{$t('start.wallet_desc')}}</view>
			</view>
			<view class="u-flex text-center u-flex-items-center u-flex-between p-0-20">

				<view class="u-flex-y text-center u-flex-items-center  u-flex-between   ">
					<!-- <image src="../../static/pro/SEND/11.png" mode="aspectFit" class="icon-70"></image> -->
					<view class="">
						<view class="p-10-0 font-size-12" style="color: #000;">{{$t('start.today_income')}}</view>
						<view class="font-bold font-size-14 p-t-10  font-main-color"
							style="font-family: Microsoft YaHei;">USDT {{userInfo.today_income}}
						</view>
					</view>
					<view class="font-gray2 width-300 p-t-10  font-size-12">{{$t('start.today_income_desc')}}
					</view>
				</view>

				<view class="u-flex-y u-flex-items-center u-flex-between   ">
					<image src="/static/pro/SEND/12.png" mode="aspectFit" class="icon-70">
					</image>
					<view class="">
						<view class="p-10-0 font-size-12" style="color: #000;"> On hold </view>
						<view class="font-bold font-size-14 p-t-10  text-center font-main-color"
							style="font-family: Microsoft YaHei;">USDT
							{{userInfo.frozen_money}}
						</view>
					</view>
					<view class="font-gray2 width-320  font-size-12 p-t-10">
						Pinned balance where
						there is a pending
						combination product
						in process.
					</view>
				</view>
			</view>

		</view>
		<view class="u-flex-y width-690 u-flex-self-center m-50-30 text-center pc">
			<text class=" font-bold font-size-14">{{$t('start.tips')}}</text>
			<text class="m-t-10 font-size-12 ">- {{$t('start.tips_time2')}} -</text>
			<text class="m-t-10 font-size-12 ">- {{$t('start.tips_time')}} -</text>
			<text class="m-t-10 font-size-12 ">- {{$t('start.tips_desc')}} -</text>
		</view>
		<userNav :title='2' />
		<uni-popup ref="popup" type="center" :mask-click="true">
			<view class="pop_box">
				<!-- <view class="header">
					<text>{{$t('start.popup')}}</text>
					<image class="close" src="../../static/close.png" mode="widthFix" @click="closePop"></image>
				</view> -->
				<view class="product_img">
					<image class="width-250 height-250" :lazy-load="true" :src="order.img" mode="aspectFit"></image>
				</view>
				<view class="height-150"></view>
				<view class="title">{{order.title}}</view>
				<view class="info">
					<view>
						<view class="label">{{$t('start.order_price')}}</view>
						<view class="desc"> {{order.price}}</view>
					</view>

					<view>
						<view class="label">Profit</view>
						<view class="desc"> {{order.rate}}</view>
					</view>
				</view>
				<view class="row">
					<view class="label">{{$t('start.order_income')}}</view>
					<view class="desc"> {{order.income}} USDT</view>
				</view>
				<!-- 	<view class="row">
					<text class="label">{{$t('start.order_time')}}</text>
					<text class="desc">{{order.create_time}}</text>
				</view> -->
				<view class="row">
					<text class="label">Total Refund</text>
					<text class="desc">{{totalIncomePrice}}</text>
				</view>
				<view class="p-t-20 p-b-20 u-margin-center-auto row">
					<text class="label font-bold" style="">Products Ratings</text>
					<view class="u-flex u-flex-between u-flex-item-center">
						<image @click="setRateValue(index)"
							:src="value>=index?'/static/pro/48.png':'/static/pro/49.png'" v-for="index in 5"
							mode="aspectFit" class="icon-40 m-r-10"></image>
					</view>
					<!-- <u-rate active-color="#bf0000" :touchable="false" count='5' v-model="value" inactive-color="#b3b3b3" gutter="10"></u-rate> -->
				</view>
				<view class="u-margin-center-auto p-30-0   font-black commentgood">
					<u-collapse accordion>
						<u-collapse-item>
							<text slot="title" class="u-page__item__title__slot-title font-white">Comment Good
								Review</text>
							<u-radio-group v-model="comment" placement="column" @change="groupChange"
								class="font-white">
								<u-radio :customStyle="{marginBottom: '8px',color:'#000'}"
									v-for="(item, index) in getComment" :key="index" :label="item.name"
									:name="item.name">
								</u-radio>
							</u-radio-group>
							<u-textarea v-model="comment" placeholder="Please enter content"></u-textarea>
						</u-collapse-item>
					</u-collapse>
				</view>
				<view class="btn" @click="submitOrder">{{$t('start.order_submit')}}</view>
				<view class="zhanwei"></view>
			</view>
		</uni-popup>
		<u-popup :show="commentShow" mode="bottom">
			<view class="">
				<view class="u-flex u-flex-between p-30" style="border-bottom: 1px solid #cad2dc;">
					<text class="font-bold font-size-20">Good Review</text>
					<u-icon @click="commentShow = false" name="close" color="#0094ff" bold></u-icon>
				</view>
				<scroll-view scroll-y="true" style="height: 70vh;">
					<view @click="choose(item)" v-for="(item,i) in getComment" :key="i"
						style="border-bottom: 1px solid #cad2dc;color: #6d6d6d;">
						<view class="p-30 font-size-14">
							{{item.content}}
						</view>

					</view>
				</scroll-view>
			</view>
		</u-popup>
		<view :class="'loading '+loading_class" catchtouchmove="true">
			<image src="../../static/loading.svg" mode="width-570"></image>
		</view>

	</view>
</template>

<script>
	export default {
		onLoad() {
			var that = this;
			if (!getApp().globalData.startInitData) {
				getApp().globalData.startInitData = 1;

				uni.$on('refreshStartData', function() {
					that.initData();
				});
				uni.$on('refreshStartUserinfo', function() {
					that.userInfo = getApp().getCache('userInfo');

				});
				uni.$on('chearMessageCount', function(data) {
					that.red_dot = "../../static/touming_dot.png";
				});
			}
		},
		onShow() {
			var that = this;
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			} else {
				// that.initData();
				// that.initListData()
			}
		},
		onPullDownRefresh() {
			var that = this;
			that.initData();
			that.initListData()
			uni.stopPullDownRefresh();
		},
		data() {
			return {
				icon_array: [
					[
						// 'SKYWORTH', 'ZANUSSI', 'BIMIX', 'Jimmy Choo', 'Kryolan', 'YVES SAINT',
						'Apple TV Remote',
						'Apple Watch 42mm',  'Chair', 'Desk Chair', 'EKERO Shiftebu chair',
						'Forehill Wall Table', 'Gaming Chair', 'Klorane Nettle Shampoo', 'R32S Air Conditioner',
						'Redmi', 'Samsung Galaxy Tab A8', 'Smart Watch', 'Apple Watch SE 44mm',
					],
				],
				icon_array1: [
					[
						'Leather Chair', 'Lenovo', 'MAC', 'Marble Wine Cabinet', 'Medusa TV Sideboard',
						'Moroccan Argan Oil', 'Motorola',
						'Multimedia Speaker', 'Nike', 'Nolar Loft Floor Lamp', 'Nutrafol', 'Office Chair',
						'R32S Air Conditioner', 'Redmi', 'Samsung Galaxy Tab A8', 'Smart Watch',
						'Tmal Genie Smart Speaker', 'Wholesale Fish Tea Table', 'Wireless Bass Speaker', 'Zapatos'
					],
				],
				images: ['b (1)','b (2)','b (3)','b (4)','b (5)','b (6)','b (7)','b (8)','b (9)','b (10)','b (11)','b (12)',
							'b (13)','b (14)','b (15)','b (16)','b (17)','b (18)','b (19)','b (20)','b (21)','b (22)','b (23)','b (24)',
							'b (25)','b (26)','b (27)','b (28)','b (29)','b (30)','b (31)','b (32)','b (33)',
				],
				currentImageIndex: 0,
				lastImageIndex: 0,
				lastDirection: '', // 上次方向
				slideDirection: 'slide-from-left', // 当前方向		
				loading_class: "hidden",
				order: [],
				orderList: [],
				userInfo: getApp().getCache('userInfo'),
				goods_cate: [],
				red_dot: "../../static/touming_dot.png",
				value: 0,
				getComment: [{
						name: "Very good! I have personally used this product and must praise it!",
						id: 1,
						title: "ExcellentVery good",
						type: 1,
					},
					{
						name: "I have used this product and the results are not very good, there are improvements to be made",
						id: 2,
						title: "improvements ",
						type: 2,
					},
					{
						name: "Opps! I have not used this product and can not give a good review",
						id: 24,
						title: "Opps",
						type: 1
					},
				],
				index: null,
				comment: '',
				comment_id: '',
				commentShow: false,

			}
		},
		mounted() {
			this.startSlideshow();
		},
		computed: {
			totalIncomePrice() {
				const total = Number(this.order.income) + Number(this.order.price);
				return parseFloat(total.toFixed(2));
			}
		},
		methods: {
			getSlideDirectionClass() {
				return this.slideDirection;
			},
			startSlideshow() {
				setInterval(() => {
					this.lastImageIndex = this.currentImageIndex;
					this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
					this.setSlideDirection();
				}, 5000); // 每5秒切换一次图片
			},
			setSlideDirection() {
				// 所有可能的方向
				const directions = ['slide-from-left', 'slide-from-right', 'slide-from-top', 'slide-from-bottom'];
				// 获取相反方向的索引
				const oppositeDirectionMap = {
					'slide-from-left': 'slide-from-right',
					'slide-from-right': 'slide-from-left',
					'slide-from-top': 'slide-from-bottom',
					'slide-from-bottom': 'slide-from-top'
				};

				// 过滤掉上次的方向和相反方向
				const possibleDirections = directions.filter(
					dir => dir !== this.lastDirection && dir !== oppositeDirectionMap[this.lastDirection]
				);
				// 随机选择一个方向
				this.slideDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
				// 更新上次的方向
				this.lastDirection = this.slideDirection;
			},
			choose(item) {
				this.comment_id = item.id
				this.comment = item.name
				this.commentShow = false
			},
			setRateValue(value) {
				this.value = value;
			},
			groupChange(e) {
				console.log(e, '选择')
			},
			initData() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/User/initStartData', postData, function(res) {
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
						userInfo.today_income = res.data.today_income;
						userInfo.wallet = res.data.wallet;
						userInfo.frozen_money = res.data.frozen_money;
						userInfo.task_finish = res.data.task_finish;
						that.userInfo = userInfo;
						console.log(that.userInfo)
						getApp().setCache('userInfo', userInfo);
						uni.$emit('refreshUserinfo');
						that.goods_cate = res.data.goods_cate;
					}
				});
			},

			onStart() {
				var that = this;
				that.loading_class = "show";
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				that.value = 0;
				getApp().getData('api/User/getGoods', postData, function(res) {
					if (res.status == 0) {
						that.loading_class = "hidden";
						that.initListData()
						let flag = false;
						if (res.message.indexOf('Please submit the previous') >= 0) {
							flag = true;
						}
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: flag ? 'Go to Record' : that.$t('public.confirm'),
							confirmColor: '#083643',
							success: function(res) {
								if (res.confirm && flag) {
									uni.navigateTo({
										url: '../order/order'
									});
								}
							}
						});

					} else if (res.status == 2) {
						that.loading_class = "hidden";
						that.initListData()
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#083643',
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../customer/customer'
									});
								}
							}
						});
					} else {
						//var close_time = getApp().randomNum(1000,3000);
						var close_time = 0;
						that.order = res.data;
						// userInfo.wallet = getApp().money(userInfo.wallet - res.data.price);
						// that.userInfo = userInfo
						// getApp().setCache('userInfo', userInfo);
						setTimeout(function() {
							that.openPop();
						}, close_time);
					}
					that.initData();
					that.initListData()
				}, false, true);
			},
			openPop() {
				this.loading_class = "hidden";
				this.$refs.popup.open();
			},
			closePop() {
				this.$refs.popup.close();
			},
			close() {
				this.initListData()
			},
			submitOrder() {
				var that = this;
				that.loading_class = "show";
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.order_id = that.order.id;
				postData.comment_id = that.comment_id
				getApp().getData('api/User/submitGoodsOrder', postData, function(res) {
					if (res.status == 0) {
						that.loading_class = "hidden";
						that.initListData()
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#083643'
						});
					} else if (res.status == 2) {
						that.loading_class = "hidden";
						that.initListData()
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#083643',
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../recharge/recharge'
									});
								}
							}
						});
					} else {
						var order = res.data;
						var close_time = getApp().randomNum(1000, 3000);
						setTimeout(function() {
							that.loading_class = "hidden";
							uni.showToast({
								title: that.$t('start.toast1'),
								icon: 'none',
								duration: 2000
							});
							that.closePop();
							that.initData();
							that.initListData()
							if (order.liandan_status == 1) {
								that.onStart();
							}
						}, close_time);
					}
				}, false, true);
			},
			openWin(path) {
				uni.navigateTo({
					url: '../' + path + '/' + path
				});
			},
			initListData() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.pageNow = 1;
				postData.pageSize = '3';
				postData.status = that.status;
				getApp().getData('api/User/getOrderList', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#ff4f8b'
						});
					} else {
						that.orderList = res.data.list;

					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		// background-image: url('/static/BG-015.png');
		// background-repeat: no-repeat;
		// background-size: 100% auto;
	}

	.bg-gradient-right {
		background: linear-gradient(to right, #F5EFE5, #FFFFFF);
	}

	.bg-gradient-left {
		background: linear-gradient(to left, #F5EFE5, #FFFFFF);
	}

	.start {
		overflow: hidden;
		// width: 100%;
		margin-top: 50rpx;

		.start-item {
			color: #fff;
			text-align: center;

			width: 350rpx;
			margin: 0 auto; // background-color: #009ADF;
			margin-left: 50rpx;

			image {
				width: 220rpx;
				height: 220rpx;
				border-radius: 50%;
			}

		}

		.start-item1 {
			color: #000;
			text-align: center;

			width: 450rpx;
			margin: 0 auto; // background-color: #009ADF;
			margin-left: 19rpx;

			image {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
			}

			.text {
				// width: 180rpx;
			}
		}
	}

	.pop_box {
		// background-color: #FFFFFF;
		background-color: rgba(0, 0, 0, 0.8);
		width: 690rpx;
		// padding: 15px;
		border-radius: 15px;
		// height: 75vh;
		box-sizing: border-box;
		// overflow-y: auto;
		position: relative;
		color: #FFFFFF;
		padding: 0 40rpx;

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

	.pop_box .product_img {
		display: flex;
		justify-content: center;
		align-items: center;
		// padding: 16px 0 10px 0;
		width: 250rpx;
		height: 250rpx;
		border-radius: 50%;
		background-color: #FFFFFF;
		position: absolute;
		top: -77px;
		left: 50%;
		transform: translateX(-50%);
	}

	.pop_box .product_img image {
		width: 80rpx;
		border-radius: 50%;
	}

	.pop_box .title {
		text-align: center;
		font-size: 15px;
		font-weight: 600;
	}

	.pop_box .info {
		display: flex;
		justify-content: space-around;
		text-align: center;
		margin-top: 30px;
		border-bottom: 1px solid #efefef;
		padding-bottom: 15px;

	}

	.pop_box .info .label {
		font-size: 13px;
		color: #237aff;
	}

	.pop_box .info .desc {
		font-size: 15px;
		font-weight: 600;
		margin-top: 3px;
	}

	.pop_box .row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 0;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}

	.pop_box .row .label {
		color: #fff;
	}

	.pop_box .btn {
		width: 100%;
		background-color: #237aff;
		color: #fff;
		text-align: center;
		height: 50px;
		line-height: 50px;
		border-radius: 12px;
		font-size: 15px;
		margin-top: 20px;
	}

	.pop_box .zhanwei {
		height: 50px;
	}

	.loading {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		color: #fff;
		background: rgba(0, 0, 0, 0.4);
		left: 0;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99999;
	}

	.loading image {
		width: 85%;
	}

	.background_start {
		background-color: #fff;
		border-radius: 50%;
		padding: 20rpx;
	}

	.header {
		padding: 30rpx 35rpx;
		background: #ffffff;
		display: flex;
		width: 100%;
		justify-content: space-between;
		color: #009ADF;
	}

	.panel {
		margin-top: 40px;
	}

	.panel .lists {}

	.panel .lists .list {
		text-align: center;
		margin-bottom: 10px;
		width: 25%;
	}

	.panel .lists .list .img {
		height: 65px;
		width: 65px;
		border-radius: 6px;
		margin: 0 auto 5px auto;
	}

	.panel .lists .list .text {
		font-size: 13px;
	}

	.box3 {
		width: 690rpx;
		margin: 10px auto 25px;
	}

	.box3 .btn {
		width: 100%;
		background-color: #237aff;
		color: #fff;
		text-align: center;
		height: 55px;
		line-height: 55px;
		border-radius: 12px;
		font-size: 16px;
	}

	.box3 .data {
		text-align: center;
		font-size: 17px;
		margin-top: 10px;
	}

	.box4 {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 600rpx;
		height: 600rpx;
		overflow: hidden;
		margin: 0 auto;
	}

	.box4::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/static/pro/35.png');
		background-repeat: no-repeat;
		background-size: cover;
		opacity: 1;
	}





	.scroll-item {
		width: 100%;
		max-width: 749rpx;
		text-align: center;
	}

	.scroll-content {
		animation: rowScroll 40s linear infinite;

	}

	.scroll-content1 {
		animation: rowScroll1 40s linear infinite;

	}

	@keyframes rowScroll {
		0% {
			transform: translateX(1);
		}

		100% {
			transform: translateX(-2000rpx);
		}
	}


	@keyframes rowScroll1 {
		0% {
			transform: translateX(-2500rpx);
		}

		100% {
			transform: translateX(1);
		}
	}

	::v-deep .u-collapse .u-line {
		border-bottom: none !important;
	}

	.commentgood {
		border-bottom: 1px solid #fff;
	}

	::v-deep .u-cell__body {
		padding: 0;
	}

	.pc {
		color: #000;
	}

	@media screen and (min-width:769px) {
		.pc {
			// color: #fff;
		}

	}

	.image-container {
		position: relative;
		width: 300px;
		height: 300px;
		overflow: hidden;

	}

	.image-item {
		position: absolute;
		width: 200px;
		height: 200px;
		transition: transform 0.7s ease-in-out, opacity 0s ease-in-out;
		opacity: 0;
		background-color: #fff;
		border-radius: 50%;
		padding: 40px;
		margin: 10px ;
		box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, .2);
	}
	
	.image-item.active {
		opacity: 1;
		transform: translate(0, 0);
	}
	
	.image-item.slide {
		transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
		opacity: 0;
	}
	
	.slide-from-left {
		transform: translateX(-100%);
	}
	
	.slide-from-right {
		transform: translateX(100%);
	}
	
	.slide-from-top {
		transform: translateY(-100%);
	}
	
	.slide-from-bottom {
		transform: translateY(100%);
	}
</style>