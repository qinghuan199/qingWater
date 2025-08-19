<template>
	<view class="settings-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">设置</text>
			<view class="placeholder"></view>
		</view>
		<!-- 头像设置 -->
		<view class="settings-container">
			<view class="setting-item" @click="changeAvatar">
				<text class="setting-label">头像</text>
				<view class="setting-value">
					<image class="avatar-preview" :src="userInfo.header_img || '/static/icon/default-avatar.png'"
						mode="aspectFill"></image>
					<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<!-- 设置项列表 -->
		<view class="settings-container">


			<!-- 昵称设置 -->
			<view class="setting-item" @click="changeNickname">
				<text class="setting-label">昵称</text>
				<view class="setting-value">
					<text class="setting-text">{{ userInfo.name || '未设置' }}</text>
					<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 性别设置 -->
			<view class="setting-item" @click="showGenderPicker = true">
				<text class="setting-label">性别</text>
				<view class="setting-value">
					<text class="setting-text">{{ getGenderText() }}</text>
					<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 性别选择器 -->
			<u-picker :show="showGenderPicker" :columns="genderColumns" @confirm="onGenderConfirm"
				@cancel="showGenderPicker = false" title="性别"></u-picker>

			<!-- 手机号设置 -->
			<view class="setting-item">
				<text class="setting-label">手机号</text>
				<view class="setting-value">
					<text class="setting-text">{{ userInfo.phone || '未绑定' }}</text>
				</view>
			</view>

			<!-- 个人简介设置 -->
			<view class="setting-item" @click="changeBrief">
				<text class="setting-label">个人简介</text>
				<view class="setting-value">
					<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
				</view>
			</view>
			<text class="setting-text brief-text">{{ userInfo.brief_introduction || '未设置' }}</text>

			<!-- 原创视频 -->
			<!-- <view class="setting-item" @click="goToOriginalVideos">
				<text class="setting-label">原创视频</text>
				<view class="setting-value">
					<image class="arrow-icon" src="/static/home/ic_arrow_right.png" mode="aspectFit"></image>
				</view>
			</view> -->
		</view>

		<!-- 退出登录按钮 -->
		<view class="logout-container">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: getApp().getCache('userInfo'),
				showGenderPicker: false,
				genderColumns: [
					['未知', '男', '女']
				]
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		onShow() {
			// 检查登录状态
			var isLogin = getApp().getCache('isLogin');
			if (getApp().isEmpty(isLogin)) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return;
			}
			
			// 页面显示时重新获取用户信息，以便显示最新的个人简介
			this.getUserInfo();
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					this.clearUserData();
					return;
				}

				uni.request({
					url: getApp().globalData.baseUrl + 'api/getuserinfo',
					method: 'POST',
					header: {
						'token': token
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.userInfo = res.data.data;
						} else {
							uni.showToast({
								title: res.data.msg || '获取用户信息失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 获取性别文本
			getGenderText() {
				switch (this.userInfo.sex) {
					case '0':
					case 0:
						return '未知';
					case '1':
					case 1:
						return '男';
					case '2':
					case 2:
						return '女';
					default:
						return '未知';
				}
			},

			// 修改头像
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0];
						this.uploadAvatar(tempFilePath);
					}
				});
			},

			// 上传头像
			uploadAvatar(filePath) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				uni.showLoading({
					title: '上传中...'
				});

				uni.uploadFile({
					url: getApp().globalData.baseUrl + 'api/upload/image',
					filePath: filePath,
					name: 'image',
					header: {
						'token': token
					},
					success: (res) => {
						uni.hideLoading();
						const data = JSON.parse(res.data);
						if (data.code === 200) {
							this.setAvatar(data.data);
						} else {
							uni.showToast({
								title: data.msg || '上传失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					}
				});
			},

			// 设置头像
			setAvatar(imageUrl) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				uni.request({
					url: getApp().globalData.baseUrl + 'api/setheadimg',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						header_img: imageUrl
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '头像更新成功',
								icon: 'success'
							});
							this.userInfo.header_img = imageUrl;
						} else {
							uni.showToast({
								title: res.data.msg || '设置失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 修改昵称
			changeNickname() {
				uni.navigateTo({
					url: '/pages/nickname-edit/nickname-edit?nickname=' + encodeURIComponent(this.userInfo.name ||
						'')
				});
			},

			// u-picker性别选择确认
			onGenderConfirm(e) {
				const selectedIndex = e.indexs[0];
				const genderValue = selectedIndex; // 0=未知, 1=男, 2=女
				this.saveGender(genderValue);
				this.showGenderPicker = false;
			},

			// 保存性别
			saveGender(genderValue) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				uni.request({
					url: getApp().globalData.baseUrl + 'api/setsex',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						sex: genderValue
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '性别更新成功',
								icon: 'success'
							});
							this.userInfo.sex = genderValue;
						} else {
							uni.showToast({
								title: res.data.msg || '设置失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},



			// 修改个人简介
			changeBrief() {
				uni.navigateTo({
					url: '/pages/brief-edit/brief-edit?brief=' + encodeURIComponent(this.userInfo
						.brief_introduction || '')
				});
			},

			// 跳转到原创视频页面
			goToOriginalVideos() {
				uni.navigateTo({
					url: '/pages/original-videos/original-videos'
				});
			},



			// 保存个人简介
			saveBrief(content) {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;

				uni.request({
					url: getApp().globalData.baseUrl + 'api/set/brief/introduction',
					method: 'POST',
					header: {
						'token': token
					},
					data: {
						content: content
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '简介更新成功',
								icon: 'success'
							});
							this.userInfo.brief_introduction = content;
							// 更新缓存中的用户信息
							getApp().setCache('userInfo', this.userInfo);
						} else {
							uni.showToast({
								title: res.data.msg || '设置失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},

			// 退出登录
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							this.performLogout();
						}
					}
				});
			},

			// 执行退出登录
			performLogout() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					this.clearUserData();
					return;
				}

				uni.request({
					url: getApp().globalData.baseUrl + 'api/logout',
					method: 'POST',
					header: {
						'token': token
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '退出成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data.msg || '退出失败',
								icon: 'none'
							});
						}
						this.clearUserData();
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
						this.clearUserData();
					}
				});
			},

			// 清除用户数据
			clearUserData() {
				uni.removeStorageSync('isLogin');
				uni.removeStorageSync('userInfo');
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style scoped>
	.settings-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/deep/ .u-toolbar__wrapper__confirm {
		color: #909193 !important;
	}

	/deep/ .u-toolbar {
		border-bottom: 1rpx solid #eee !important;
	}

	/* 头部导航 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.back-btn {
		padding: 10rpx;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.header-title {
		font-size: 32rpx;
		color: #333;
	}

	.placeholder {
		width: 60rpx;
	}

	/* 设置项容器 */
	.settings-container {
		background-color: #fff;
		padding: 20rpx;
		margin: 20rpx 0;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
		transition: background-color 0.3s;
	}

	.setting-item:last-child {
		border-bottom: none;
	}

	.setting-item:active {
		background-color: #f8f8f8;
	}

	.setting-label {
		font-size: 32rpx;
		color: #333;
	}

	.setting-value {
		display: flex;
		align-items: center;
	}

	.setting-text {
		font-size: 32rpx;
		color: #B4B4B4;
		margin-right: 20rpx;
	}

	.brief-text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		/* 限制显示2行 */
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 28rpx;
		color: #999;
		margin-top: 10rpx;
		line-height: 1.4;
		word-break: break-all;
		/* 允许单词内换行 */
	}

	.avatar-preview {
		width: 92rpx;
		height: 92rpx;
		border-radius: 46rpx;
		margin-right: 20rpx;
		border: 2rpx solid #e0e0e0;
	}

	.arrow-icon {
		width: 30rpx;
		height: 30rpx;
	}

	/* 退出登录按钮 */
	.logout-container {
		padding: 40rpx 20rpx;
	}

	.logout-btn {
		width: 630rpx;
		height: 100rpx;
		background: linear-gradient(to bottom, #fc303d 0%, #fc1074 100%);
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		border-radius: 20rpx;
		line-height: 100rpx;
		border: none;
		transition: background-color 0.3s;
	}

	.logout-btn:active {
		background-color: #ff3742;
	}

	/* 弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		padding: 10rpx;
	}

	.close-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.modal-body {
		padding: 30rpx;
	}

	.input-field {
		width: 100%;
		height: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		box-sizing: border-box;
	}

	.textarea-field {
		width: 100%;
		height: 200rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 30rpx;
		box-sizing: border-box;
		resize: none;
	}

	.char-count {
		font-size: 24rpx;
		color: #999;
		text-align: right;
		margin-top: 10rpx;
	}

	.gender-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.gender-option:last-child {
		border-bottom: none;
	}

	.gender-text {
		font-size: 32rpx;
		color: #333;
	}

	.radio {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 20rpx;
		position: relative;
	}

	.radio.active {
		border-color: #007AFF;
	}

	.radio.active::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 20rpx;
		height: 20rpx;
		background-color: #007AFF;
		border-radius: 10rpx;
	}

	.modal-footer {
		display: flex;
		padding: 30rpx;
		border-top: 1rpx solid #e0e0e0;
		gap: 20rpx;
	}

	.cancel-btn,
	.confirm-btn {
		flex: 1;
		height: 80rpx;
		border-radius: 10rpx;
		border: none;
		font-size: 30rpx;
	}

	.cancel-btn {
		background-color: #f0f0f0;
		color: #666;
	}

	.confirm-btn {
		background-color: #007AFF;
		color: #fff;
	}
</style>