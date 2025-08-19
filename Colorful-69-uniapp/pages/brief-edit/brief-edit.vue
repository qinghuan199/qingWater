<template>
	<view class="brief-edit-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">个人简介</text>
			<view class="placeholder"></view>
		</view>

		<!-- 编辑区域 -->
		<view class="edit-container">
			<view class="edit-section">
				<textarea 
					class="textarea-field" 
					v-model="briefContent" 
					placeholder="请输入个人简介" 
					maxlength="100"
					auto-height
				></textarea>
				<!-- <text class="char-count">{{ briefContent.length }}/60</text> -->
			</view>
		</view>

		<!-- 完成按钮 -->
		<view class="submit-container">
			<button class="submit-btn" @click="submitBrief">完成</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			briefContent: ''
		}
	},
	onLoad(options) {
		// 获取传递过来的简介内容
		if (options.brief) {
			this.briefContent = decodeURIComponent(options.brief);
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 提交个人简介
		submitBrief() {
			if (!this.briefContent.trim()) {
				uni.showToast({
					title: '请输入个人简介',
					icon: 'none'
				});
				return;
			}

			// 检查字符长度（中文字符按2个字符计算）
			const content = this.briefContent.trim();
			const chineseCount = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
			const otherCount = content.length - chineseCount;
			const totalLength = chineseCount + otherCount;
			
			if (totalLength > 60) {
				uni.showToast({
					title: '不超过60汉字',
					icon: 'none'
				});
				return;
			}

			var userInfo = getApp().getCache('userInfo');
			const token = userInfo ? userInfo.token : null;
			
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}

			uni.showLoading({ title: '保存中...' });

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
					uni.hideLoading();
					if (res.data.code === 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
						
						// 更新缓存中的用户信息
						if (userInfo) {
							userInfo.brief_introduction = content;
							getApp().setCache('userInfo', userInfo);
						}
						
						// 延迟返回上一页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: res.data.msg || '保存失败',
							icon: 'none'
						});
					}
				},
				fail: () => {
					uni.hideLoading();
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				}
			});
		}
	}
}
</script>

<style scoped>
.brief-edit-page {
	background-color: #eee;
	min-height: 100vh;
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

/* 编辑区域 */
.edit-container {
	margin: 20rpx 0;
}

.edit-section {
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.textarea-field {
	width: 100%;
	min-height: 300rpx;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 30rpx;
	box-sizing: border-box;
	resize: none;
	line-height: 1.5;
}

.char-count {
	font-size: 24rpx;
	color: #999;
	text-align: right;
	margin-top: 10rpx;
	display: block;
}

/* 提交按钮 */
.submit-container {
	padding: 40rpx 60rpx;
	border-top: 1rpx solid #e0e0e0;
}

.submit-btn {
	width: 100%;
	height: 100rpx;
	background: linear-gradient(to bottom, #fc303d 0%, #fc1074 100%);
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 20rpx;
	border: none;
	line-height: 100rpx;
	transition: background-color 0.3s;
}

.submit-btn:active {
	background-color: #fd2d43;
}
</style>