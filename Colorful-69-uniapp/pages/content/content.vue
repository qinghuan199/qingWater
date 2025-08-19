<template>
	<view class="content ">
		<meta name="theme-color" content="#0a172b">
		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>
		<view class="u-flex-y btns" style="padding-bottom: 70rpx;" v-if="this.key == 'agreement_desc'">
			<!-- 	<view class=" u-flex m-t-30" style="margin:0 auto; justify-content: center;">
				<image :src="img" mode="widthFix" class="width-620"></image>
			</view> -->
			<view class="u-flex-x-center font-bold font-size-20 m-30-0" style="color: #0279fe;">
				<!-- {{title}} -->
				T&C
			</view>
			<!-- <view class="text_rich  ">
				<rich-text class="" :nodes="content"></rich-text>
			</view> -->
			<view class="" style="overflow: auto; height: 700rpx; margin-bottom: 0;">
				<u-collapse :accordion='true'>
					<u-collapse-item :isLink="false" disabled @click.native="open(item.question,item.answer)"
						:title="item.question" :name="item.question" v-for="(item,index) in tc">
						<rich-text :nodes="item.answer"></rich-text>
					</u-collapse-item>
				</u-collapse>
			</view>

		</view>
		<view class="u-flex-y width-full btns" style="padding-bottom: 60rpx;" v-else-if="this.key == 'help'">
			<!-- <view class=" u-flex m-t-30" style="margin:0 auto; justify-content: center;">
				<image :src="img" mode="widthFix" class="width-600"></image>
			</view> -->
			<view class="u-flex-x-center font-bold font-size-20 m-30-0" style="color: #0279fe;">
				Frequently Asked Questions
			</view>
			<!-- <view class="text_rich  ">
				<rich-text class="" :nodes="content"></rich-text>
			</view> -->
			<view class="" style="overflow: auto; height: 980rpx; margin-bottom: 200;">
				<u-collapse :accordion='true'>
					<u-collapse-item :isLink="false" disabled @click.native="open(item.question,item.answer)"
						:title="item.question" :name="item.question" v-for="(item,index) in faq">
						<rich-text :nodes="item.answer"></rich-text>
					</u-collapse-item>
				</u-collapse>
			</view>
		</view>
		<!-- 	<view class="u-flex-y width-full btns"  v-else-if="this.title == 'Salary'">
			
			<view class="u-flex-x-center font-bold font-size-20 font-black m-30-0">
				{{title}}
			</view> 
			<view class="text_rich">
				<rich-text class="" :nodes="content"></rich-text>
			</view>
		</view> -->

		<view class="u-flex-y width-full btns2 p-l-10 p-r-10" style="" v-else-if="this.key == 'activity'">
			<!-- 	<view class="width-620 u-flex m-t-30" v-if="img" style="margin:0 auto; justify-content: center;">
				<image :src="img" mode="widthFix" class="width-630"></image>
			</view> -->
			<!-- <view class="u-flex-x-center font-bold font-size-20 font-black m-30-0">
				{{title}}
			</view> -->
			<view class="text_rich p-0" style="margin:30rpx 17rpx;">
				<rich-text class="" :nodes="content"></rich-text>
			</view>
		</view>
		<view class="u-flex u-flex-items-center u-flex-center" v-else-if="this.key == 'agent'">
			<view class="u-flex-y width-full btns">
				<view class="font-black text-center font-size-20 p-t-10">
					<image src="/static/pro/Profitero-Logo-01.png" mode="widthFix" class="width-400"></image>
				</view>
				<!-- 	<view class="u-flex-x-center font-bold font-size-20 font-black m-30-0">
					{{title}}
				</view> -->
				<view class="text_rich" style="overflow: auto;  margin-bottom: 200;padding: 20rpx 0rpx 20rpx 5rpx;">
					<rich-text class="" :nodes="content"></rich-text>
				</view>
			</view>
		</view>
		<view class="u-flex u-flex-items-center u-flex-center" v-else>
			<view class="u-flex-y width-full btns">
				<view class="font-black text-center font-size-20 p-t-10">
					<image src="/static/pro/Profitero-Logo-01.png" mode="widthFix" class="width-400"></image>
				</view>
				<!-- 	<view class="u-flex-x-center font-bold font-size-20 font-black m-30-0">
					{{title}}
				</view> -->
				<view class="text_rich" style="overflow: auto;  margin-bottom: 200;padding: 40rpx 0rpx 20rpx 10rpx;">
					<rich-text class="" :nodes="content"></rich-text>
				</view>
			</view>
		</view>

		<u-popup :show="show" @close="close" class="ccat" mode="center">
			<view class="width-690   bg-white"
				style="box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);border-radius: 60rpx;padding: 30rpx">
				<view class="fl_between p-30-0 font-bold">
					<u-icon  name="close" size="14"  style="opacity: 0;"></u-icon>
					<text style="color: #0279fe;">{{poptitle}}</text>
					<u-icon  name="close" size="14" @click="close"></u-icon>
				</view>
				<view class="" style="overflow: scroll;height: 75vh;margin-left: -15rpx;margin-right: 10rpx;"><rich-text class=""
						:nodes="popcontent"></rich-text>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			var that = this;
			// console.log(e.title,'q213123')
			// if (e.key == 'agreement_desc') {
			// 	that.initData()
			// } else {
			// 	that.initData1()
			// }

			that.initData();
			uni.setNavigationBarTitle({
				title: e.title
			})
			that.title = e.title
			that.img = e.img
			// console.log(that.img)

			that.key = e.key;
			var config = getApp().getCache('config');
			if (e.key === 'agreement_desc' || e.key === 'en_agreement_desc') {
				that.initData();
			} else {
				that.content = config[e.key];
				console.log(that.content, 999);
			}
			that.initData1()
			// that.initData()

		},
		data() {
			return {
				userInfo: getApp().getCache('userInfo'),
				tc: [],
				faq: [],
				content: "",
				key: '',
				title: '',
				img: '',
				show: false,
				poptitle: '',
				popcontent: ''
			}
		},
		methods: {
			open(title, content) {
				console.log('open');
				this.poptitle = title
				this.popcontent = content
				this.show = true
			},
			close() {
				this.show = false
				// console.log('close');
			},
			initData1() {
				var that = this;
				var postData = new Object();
				postData.requesTime = getApp().getTime();
				postData.userid = that.userInfo.userid;
				postData.token = that.userInfo.token;
				getApp().getData('api/login/question', postData, function(res) {

					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#2d7af0'
						});
					} else {
						console.log(res);
						let d = res.data,
							temp = [
								[],
								[]
							];

						d.forEach(item => {
							item.answer = that.addTextBeforeA(item.answer)
							// console.log(item.answer,2121212);
							temp[item.type].push(item);
						})
						let s = (v1, v2) => {
							console.log(v1.weigh, v2.weigh, v1.weigh > v2.weigh, 444);
							if (v1.weigh > v2.weigh) {
								return -1
							} else if (v1.weigh < v2.weigh) {
								return 1
							} else {
								return 0
							}
						}

						that.tc = temp[0].sort(s) //res.data.tc;
						that.faq = temp[1].sort(s) //res.data.faq

						// console.log(that.faq,888777788);
					}
				});
			},

			addTextBeforeA(str) {
				return str.replace(/&nbsp;/g, '&nbsp;<br>');
			},

			initData() {
				var that = this;
				var postData = new Object();
				postData.requesTime = getApp().getTime();
				getApp().getData('api/login/getConfig', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.logout'),
							confirmColor: '#2868FF'
						});
					} else {
						console.log('当前语言', uni.getLocale());
						var config = res.data;
						switch (uni.getLocale()) {
							case 'zh-Hant':
								break;
							case 'en':
								break;
							default:
								break;
						}
						that.content = config[that.key];
						getApp().setCache('config', config);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
		min-height: 100vh;
	}

	::v-deep.u-collapse-item {
		background-color: #9708CC00;
	}

	::v-deep .u-cell__body {
		padding: 30rpx;
	}

	::v-deep.u-collapse-item__content__text {
		color: #000;
	}
	.ccat ::v-deep .u-popup__content {  background: transparent;}

	::v-deep .u-cell__title-text {
		color: #000;
		font-weight: bold;
		text-align: center;
		// font-size: 14px;
	}

	::v-deep .u-cell--clickable {
		background-color: rgba(0, 0, 0, .1);
	}

	.content {}

	.text_rich {
		padding-top: 200rpx;
		padding: 20rpx;
		font-size: 14px;
		color: #000;
	}

	.text_rich p {
		min-height: 22px;
	}

	.text_rich img {
		max-width: 100%;
	}

	.btns {
		padding: 20rpx 20rpx 50rpx;
		background: #fff;
		border-radius: 20rpx;
		width: 690rpx;
		overflow: auto;
		margin: 50rpx auto;
		box-shadow: 2px 2px 12px rgba(0, 0, 0, .3);
	}

	.btns2 {
		// padding: 20rpx 20rpx 50rpx;
		// background-image: url(/static/icon/51.png);
		// background-size: 100% auto;
		// background-repeat: no-repeat;
		width: 100%;
		// overflow: auto;
		// margin: 50rpx auto;
	}

	::v-deep.u-icon__icon--info[data-v-2ee87dc9] {
		color: #0279fe;
	}

	::v-deep.u-transition {
		background-color: rgba(0, 0, 0, 0) !important;
	}
</style>