<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<!-- <view class="text-center m-t-50 m-b-40">
			<image src="@/static/sky/SEND/BG-031.png" mode="widthFix" class="width-150"></image>
			<view class="font-bold m-20-0">
				Change Password
			</view>
			<view class="">
				Please enter your password
			</view>
		</view> -->
		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>
		<view class="p-30">
			<view class="u-flex u-flex-center">
				<view class=" width-690  login-form m-t-70">
					<view class="item_input">
						<text class="label flex-shrink">{{$t('password.old')}}</text>
						<view><input class="uni-input" type="password" :placeholder="$t('password.old_desc')"
								v-model="old_psw" /></view>
					</view>
					<u-line color="#e5e5e5"></u-line>
					<view class="item_input">
						<text class="label flex-shrink">{{$t('password.new')}}</text>
						<view><input class="uni-input" type="password" :placeholder="$t('password.new_desc')"
								v-model="new_psw1" /></view>
					</view>
					<u-line color="#e5e5e5"></u-line>
					<view class="item_input">
						<text class="label flex-shrink">{{$t('password.confirm')}}</text>
						<view><input class="uni-input" type="password" :placeholder="$t('password.confirm_desc')"
								v-model="new_psw2" /></view>
					</view>
				</view>
			</view>

			<view class="u-flex u-flex-center width-full">
				<view class="item_button width-full">
					<view class="button" @click="onSubmit">{{$t('password.save')}}</view>
				</view>
			</view>

			<view class="tips" style="" @click="onCustomer">
				{{$t('password.tips')}}
			</view>
		</view>
	</view>
</template>

<script>
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js";
	export default {
		components: {
			w_md5
		},
		onLoad(e) {
			var that = this;
		},
		data() {
			return {
				old_psw: "",
				new_psw1: "",
				new_psw2: "",
				title: ' Login Password',
			}
		},
		methods: {
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
			onSubmit() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (getApp().isEmpty(that.old_psw) || getApp().isEmpty(that.new_psw1) || getApp().isEmpty(that.new_psw2)) {
					uni.showToast({
						title: that.$t('password.toast1'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (userInfo.password != w_md5.hex_md5_32(that.old_psw)) {
					uni.showToast({
						title: that.$t('password.toast2'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (that.new_psw1 != that.new_psw2) {
					uni.showToast({
						title: that.$t('password.toast3'),
						icon: 'none',
						duration: 2000
					});
					return;
				}

				var postData = new Object();

				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.password = w_md5.hex_md5_32(that.new_psw1);
				getApp().getData('api/User/updPassword', postData, function(res) {
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
						uni.showToast({
							title: that.$t('password.toast4'),
							icon: 'none',
							duration: 1000
						});
						userInfo.password = postData.password;
						getApp().setCache('userInfo', userInfo);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100%;
		// background-color: #eaf9f1;
		background-image: none;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
		color: #333;
	}

	::v-deep.u-line {
		width: 90% !important;
		margin: 0 30rpx !important;
	}

	.content {
		// padding: 15px;
	}

	.login-form {
		// width: 90vw;
		background-color: #f8f9fa;
		box-shadow: 0px 2px 4px 2px rgba(35, 122, 255, .1);
		// border: 2rpx solid #000;
		margin: 0 auto;
		padding: 15rpx 0;
		border-radius: 12rpx;
		// background-image: url("@/static/nfc/button/BG-3.png");
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.item_textarea {
		background-color: #FFFFFF;
		border-radius: 15px;
		padding: 0 15px 15px 15px;
		margin-bottom: 10px;
	}

	.item_textarea .label {
		font-size: 14px;
		height: 55px;
		line-height: 55px;
	}

	.item_textarea .textarea {
		background-color: #ffffff;
		font-size: 14px;
		height: 70px;
		padding: 5px 10px;
		border-radius: 15px;
	}

	.item_input {
		padding: 0 20px;
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		align-items: center;
	}

	.item_input view {
		width: 100%;
	}

	.item_input .label {
		font-size: 14px;
		padding: 10px 0;
		color: #000;
	}

	.item_input .uni-input {
		height: 55px;
		line-height: 55px;
		width: 100%;
		font-size: 14px;
		text-align: right;
	}

	.item_button {
		padding: 30px 0;
	}

	.item_button .button {
		// background-image: url('@/static/nfc/button/BG-5.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		width: 100%;
		background-color: #237aff;
		color: #fff;
		text-align: center;
		height: 50px;
		line-height: 50px;
		border-radius: 15px;
		font-size: 15px;
	}

	.tips {
		font-size: 12px;
		text-align: center;
		color: #fe0000;
	}
</style>