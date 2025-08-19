<template>
	<view class="agent-auth-page">
		<!-- 头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image src="/static/icon/back.png" class="back-icon"></image>
			</view>
			<view class="title">代理认证</view>
		</view>

		<!-- 内容区域 -->
		<view class="content">
			<!-- 茶铺代理 -->
			<view class="auth-option" @click="selectAuth('shop')">
				<image src="/static/home/ic_girl_tea.png" class="bg-image"></image>
				<view class="option-text">茶铺代理</view>
			</view>

			<!-- 个人认证 -->
			<view class="auth-option" @click="selectAuth('personal')">
				<image src="/static/home/ic_girl_person.png" class="bg-image"></image>
				<view class="option-text">个人认证</view>
			</view>
		</view>

		<!-- 底部提示 -->
		<view class="bottom-tips">
			<view class="tips-title">认证须知：</view>
			<view class="tips-item">1、认证通过后即可发布茶贴</view>
			<view class="tips-item">2、茶铺认证需缴纳{{authInfo.more}}元代理押金</view>
			<view class="tips-item">3、个人认证需缴纳{{authInfo.one}}元代理押金</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			authInfo: {
				one: 200, // 个人认证金额
				more: 1000 // 茶铺认证金额
			}
		};
	},
	onLoad() {
		this.getAuthInfo();
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 获取认证金额信息
		getAuthInfo() {
			var that = this;
			var userInfo = getApp().getCache('userInfo');
			if (!userInfo || !userInfo.token) {
				return;
			}

			var postData = {
				token: userInfo.token
			};

			getApp().getData('api/loufeng/info', postData, function(res) {
				if (res.code == 200 && res.data) {
					that.authInfo = res.data;
				}
			});
		},

		// 选择认证类型
		selectAuth(type) {
			if (type === 'shop') {
				// 茶铺代理跳转到茶铺认证页面
				uni.navigateTo({
					url: '/pages/shop-auth/shop-auth'
				});
				return;
			}
			
			if (type === 'personal') {
				// 个人认证跳转到个人认证页面
				uni.navigateTo({
					url: '/pages/personal-auth/personal-auth'
				});
				return;
			}
		},


	}
};
</script>

<style scoped>
.agent-auth-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	position: relative;
}

/* 头部样式 */
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 88rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
	border-bottom: 1rpx solid #eee;
}

.back-btn {
	position: absolute;
	left: 30rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
}

.title {
	font-size: 36rpx;
	color: #333;
}

/* 内容区域 */
.content {
	padding-top: 120rpx;
	padding: 120rpx 40rpx 40rpx;
}

.auth-option {
	position: relative;
	width: 500rpx;
	height: 250rpx;
	margin: 80rpx auto 0;
	border-radius: 15rpx;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: 1;
}

.option-text {
	position: relative;
	z-index: 2;
	font-size: 60rpx;
	color: #fff;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 底部提示 */
.bottom-tips {
	padding: 40rpx;
}

.tips-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.tips-item {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	margin-bottom: 10rpx;
}
</style>