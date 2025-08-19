<template>
	<view class="content">
		<!-- <hnav :title="title"></hnav> -->

		<!-- <eNav3></eNav3>
		<view class="" style="height: 150rpx;"></view>
		<eNav2></eNav2> -->
		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>
		<!-- <view  class="text_rich" :class="title==='Events'? '':title==='Cert'?'':'active'"> -->
		<view class="text_rich m-t-100">
			<view class="font-black text-center font-size-20 p-t-10">
				<!-- <text>{{title}}</text> -->
				<image src="/static/pro/Profitero-Logo-01.png" mode="widthFix" class="width-400"></image>
			</view>
			<view class="text1 m-t-20">
				<rich-text class="font-black" :nodes="content"></rich-text>
			</view>

		</view>
		<view class="u-flex u-flex-center height-100 " style="width: 100%; margin: 0 auto;">
			<view class="bottom-text font-size-12 m-20-0"> © Profitero 2024 | All Rights Reserved</view>
		</view>

	</view>
</template>

<script>
	export default {
		onLoad(e) {
			console.log('local', e.key);
			var that = this;
			uni.setNavigationBarTitle({
				title: e.title,
			})
			that.title = e.title

			var config = getApp().getCache('config');
			if (e.key === 'register_desc') {
				that.initData();
			} else {
				that.content = config[e.key];
			}

		},
		data() {
			return {
				content: "",
				title: '',
				active: 'active'
			}
		},
		methods: {
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
						that.content = config.register_desc;
						getApp().setCache('config', config);
					}
				});
			}
		}
	}
</script>

<style>
	page {
		color: #000;
		min-height: 100%;
		/* // background-image: url("@/static/nfc/pic/BG-7.png"); */
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;

	}

	.text_rich {
		padding: 40px 25px;
		font-size: 14px;
		background-color: #fff;
		color: #fff;
		width: 690rpx;
		height: 70vh;
		margin: 0 auto;
		border-radius: 30rpx;
		/* background-image: url("@/static/icon/57.png"); */
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: relative;
	}

	.text1 {
		height: 55vh;
		overflow: visible auto;
	}

	.text_rich p {
		min-height: 22px;
	}

	.text_rich img {
		max-width: 100%;
	}

	.active {
		background-color: rgba(255, 255, 255, .8);
	}

	.sign_bg {
		position: absolute;
		bottom: -25rpx;
		left: 50%;
		transform: translate(-50%, 0%);
		height: 100rpx;
		width: 280rpx;
		background-color: #aec0fe;
		border: 1px solid #000;
		border-radius: 18rpx;
		font-weight: 700;
		text-align: center;
		font-size: 18px;
		display: flex;
		flex-direction: column;
		justify-items: center;
		justify-content: center;
	}
</style>