<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<!-- <view @click="changeHeadimg" class="align_center u-flex u-flex-center u-flex-items-center" style="position: relative;">
			<image src="@/static/sky/SEND/BG-02.png" mode="aspectFill" class="height-50 width-50 radius-full edit"></image>
			<image  class="headimg" :src="userInfo.headimg" mode="aspectFill"></image>
		</view> -->

		<HeaderTitle :title='title'></HeaderTitle>
		<customer></customer>

		<view class="u-flex u-flex-center">
			<view class="lists m-t-50 img-a width-690">
				<view class="list m-0-30" @click="changeHeadimg" style="border-bottom: 1px solid #e5e5e5;">
					<view class="label font-black">{{$t('user_info.headimg')}}</view>
					<view class="align_center">
						<image class="headimg" :src="userInfo.headimg" mode="aspectFill"></image><uni-icons type="right"
							size="18" color="#237aff"></uni-icons>
					</view>
				</view>
				<view class="list m-0-30 " style="border-bottom: 1px solid #e5e5e5;">
					<view class="label">{{$t('user_info.username')}}</view>
					<view class="align_center"><text class="desc">{{userInfo.username}}</text></view>
				</view>
				<view class="list m-0-30" @click="changeSex">
					<view class="label">{{$t('user_info.sex')}}</view>
					<view class="align_center"><text class="desc">{{userInfo.sex_label}}</text><uni-icons type="right"
							size="18" color="#237aff"></uni-icons></view>
				</view>
			</view>

		</view>
		<view class="u-flex u-flex-center">
			<view class="lists img-a width-690" style="">
				<view class="list m-0-30" style="border-bottom: 1px solid #e5e5e5;" @click="onPassword">
					<view class="label">{{$t('user_info.login_psw')}}</view>
					<view class="align_center"><uni-icons type="right" size="18" color="#237aff"></uni-icons></view>
				</view>
				<view class="list m-0-30" @click="onPayPassword">
					<view class="label">{{$t('user_info.withdraw_psw')}}</view>
					<view class="align_center"><uni-icons type="right" size="18" color="#237aff"></uni-icons></view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		// 第壹次加載
		onLoad: function() {
			var that = this;
			that.dataView();
		},
		data() {
			return {
				userInfo: getApp().getCache('userInfo'),
				title: 'Edit Personal Information'
			}
		},
		methods: {
			dataView: function() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (userInfo.sex == 0) {
					userInfo.sex_label = that.$t('user_info.sex0');
				} else {
					userInfo.sex_label = that.$t('user_info.sex1');
				}
				this.userInfo = userInfo;
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
			changeInfo: function(type) {
				var that = this;
				uni.showModal({
					title: getApp().globalData.appname,
					placeholderText: that.$t('user_info.toast1'),
					confirmColor: '#e7526e',
					editable: true,
					cancelText: that.$t('public.cancel'),
					confirmText: that.$t('public.confirm'),
					success: function(res) {
						if (res.confirm) {
							if (getApp().isEmpty(res.content)) {
								uni.showToast({
									title: that.$t('user_info.toast2'),
									icon: 'none',
									duration: 2000
								});
								return;
							}
							that.updUserInfo(type, res.content);
						}
					}
				});
			},
			onLogout() {
				uni.showModal({
					title: getApp().globalData.appname,
					content: that.$t('user_info.toast3'),
					confirmColor: '#e7526e',
					cancelText: that.$t('public.cancel'),
					confirmText: that.$t('public.logout'),
					success: function(res) {
						if (res.confirm) {
							getApp().removeCache('isLogin');
							getApp().removeCache('userInfo');
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
			},
			changeSex: function() {
				var that = this;
				uni.showActionSheet({
					itemList: [that.$t('user_info.sex0'), that.$t('user_info.sex1')],
					success: function(res) {
						that.updUserInfo('sex', res.tapIndex);
						if (res.tapIndex == 0) {
							that.userInfo.sex_label = that.$t('user_info.sex0');
						} else {
							that.userInfo.sex_label = that.$t('user_info.sex1');
						}
					}
				});
			},
			updUserInfo: function(type, content) {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData[type] = content;
				getApp().getData('api/User/updUserInfo', postData, function(res) {
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
						uni.showToast({
							title: that.$t('user_info.toast4'),
							icon: 'none',
							duration: 2000
						});
						userInfo[type] = content;
						that.userInfo[type] = content;
						getApp().setCache('userInfo', userInfo);
						uni.$emit('refreshUserinfo');
					}
				});
			},
			onCard: function() {
				uni.navigateTo({
					url: '../card_bind/card_bind'
				});
			},
			onPassword: function() {
				uni.navigateTo({
					url: '../password/password'
				});
			},
			onPayPassword: function() {
				uni.navigateTo({
					url: '../pay_password/pay_password'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		color: #333;
		min-height: 100%;
		background-image: none;
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// background-attachment: fixed;
		background-color: #ecfbff;

	}

	.img-a {
		background-color: #f8f9fa;
		// border: 2rpx solid #000;
		// background-image: url('@/static/nfc/button/BG-3.png');
		background-size: 100% 100%;
		// background-position: 100% 100%;
		background-repeat: no-repeat;
		// border-bottom-left-radius: 60rpx;
		// border-bottom-right-radius: 60rpx;
	}

	.content {}

	.headimg {
		height: 120px;
		width: 120px;
		// margin-right: 5px;
		border-radius: 1800px;
	}

	.edit {
		position: absolute;
		z-index: 1;
		bottom: 0;
		left: 55%;
		background-color: #fff;
		padding: 20rpx;
	}

	.lists {
		margin: 0 15px 15px 15px;
		border-radius: 10px;
		box-shadow: 0px 2px 4px 2px rgba(35, 122, 255, .1);

	}

	.lists .list {
		padding: 40rpx 0rpx;
		display: flex;
		// background-color: #FFFFFF;

		justify-content: space-between;
		align-items: center;
		// border-bottom: 1px solid #eeeeee;
		// margin-bottom: 15px;
	}

	.lists .list:last-child {
		border-bottom: 0;
	}

	.lists .list .label {
		color: #000;
	}

	.lists .list .headimg {
		height: 36px;
		width: 36px;
		margin-right: 5px;
		border-radius: 18px;
	}

	.lists .list .desc {
		font-size: 14px;
		color: #000;
		margin-right: 5px;
	}

	.lists .list .status_0 {
		font-size: 14px;
		color: #e7526e;
		margin-right: 5px;
	}

	.lists .list .status_1 {
		font-size: 14px;
		color: $main-color;
		margin-right: 5px;
	}
</style>