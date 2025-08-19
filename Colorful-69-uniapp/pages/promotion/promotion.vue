<template>
	<view class="promotion-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="title">邀请分享</text>
			<view class="placeholder"></view>
		</view>

		<!-- 主要内容 -->
		<view class="content">
			<!-- 标题区域 -->
			<view class="title-section">
				<text class="main-title">邀请一个用户充值即可无限看5天</text>
				<text class="main-title">邀请的用户充值返现40%</text>
			</view>

			<!-- 邀请码展示框 -->
			<view class="invite-card">
				<!-- Logo和品牌名 -->
				<view class="brand-section">
					<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
					<text class="brand-name">69传媒</text>
				</view>

				<!-- 下载二维码 -->
				<view class="qrcode-section">
					<!-- <view class="qrcode-title">扫码下载APP</view> -->
					<canvas 
						v-if="userInfo.app_download_url" 
						canvas-id="qrcode" 
						class="qrcode-canvas"
						:style="{width: qrcodeSize + 'px', height: qrcodeSize + 'px'}"
					></canvas>
					<text v-else class="no-url-text">暂无下载链接</text>
				</view>

				<!-- 邀请码显示框 -->
				<view class="invite-code-box">
					<text class="invite-code-label">你的邀请码:</text>
					<text class="invite-code-value">{{ userInfo.invite_code || '暂无邀请码' }}</text>
				</view>
			</view>

			<!-- 复制按钮 -->
			<view class="copy-section">
				<button class="copy-btn" @click="copyInviteCode">复制链接分享</button>
			</view>

			<!-- 推广图片 -->
			<view class="promotion-image-section">
				<image class="promotion-image" src="/static/icon/14.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
		return {
			userInfo: {},
			qrcodeSize: 200
		}
	},
		onLoad() {
			this.getUserInfo();
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 获取用户信息
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
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
					// 生成二维码
					if (this.userInfo.app_download_url) {
						this.$nextTick(() => {
							this.generateQRCode();
						});
					}
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

			// 复制邀请码
			copyInviteCode() {
			    if (!this.userInfo.invite_code) {
			        uni.showToast({
			            title: '暂无邀请码',
			            icon: 'none'
			        });
			        return;
			    }
			
			    const shareContent = `${this.userInfo.invite_code}`;
			
			    // 创建临时input元素
			    const input = document.createElement('input');
			    input.value = shareContent;
			    document.body.appendChild(input);
			    input.select();
			    
			    try {
			        const successful = document.execCommand('copy');
			        if (successful) {
			            uni.showToast({
			                title: '复制成功',
			                icon: 'success'
			            });
			        } else {
			            throw new Error('复制失败');
			        }
			    } catch (err) {
			        console.error('复制失败:', err);
			        uni.showToast({
			            title: '复制失败',
			            icon: 'none'
			        });
			    }
			    
			    document.body.removeChild(input);
			},
			// 生成二维码
			generateQRCode() {
				if (!this.userInfo.app_download_url) return;
				
				// 使用uni-app内置的二维码生成功能
				const ctx = uni.createCanvasContext('qrcode', this);
				
				// 简单的二维码生成实现
				// 这里使用第三方库或者调用在线二维码生成API
				this.drawQRCodeWithAPI(ctx);
			},
			
			// 使用在线API生成二维码
			drawQRCodeWithAPI(ctx) {
				const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${this.qrcodeSize}x${this.qrcodeSize}&data=${encodeURIComponent(this.userInfo.app_download_url)}`;
				
				// 下载二维码图片并绘制到canvas
				uni.downloadFile({
					url: qrUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							// 绘制二维码图片到canvas
							ctx.drawImage(res.tempFilePath, 0, 0, this.qrcodeSize, this.qrcodeSize);
							ctx.draw();
						} else {
							// 如果API失败，绘制文本替代
							this.drawTextQRCode(ctx);
						}
					},
					fail: () => {
						// 如果下载失败，绘制文本替代
						this.drawTextQRCode(ctx);
					}
				});
			},
			
			// 绘制文本替代二维码
			drawTextQRCode(ctx) {
				ctx.setFillStyle('#f0f0f0');
				ctx.fillRect(0, 0, this.qrcodeSize, this.qrcodeSize);
				
				ctx.setFillStyle('#333');
				ctx.setFontSize(16);
				ctx.setTextAlign('center');
				ctx.fillText('二维码', this.qrcodeSize / 2, this.qrcodeSize / 2 - 10);
				ctx.fillText('生成中...', this.qrcodeSize / 2, this.qrcodeSize / 2 + 10);
				
				ctx.draw();
			}
		}
	}
</script>

<style scoped>
	.promotion-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.back-btn {
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

	.placeholder {
		width: 60rpx;
	}

	.content {
		padding: 40rpx 30rpx;
	}

	/* 标题区域 */
	.title-section {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.main-title {
		font-size: 42rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
	}

	.sub-title {
		font-size: 32rpx;
		color: #666;
		display: block;
	}

	/* 邀请码展示框 */
	.invite-card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		border: 2rpx solid #bd9c8d;
	}

	/* Logo和品牌名 */
	.brand-section {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.logo {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
	}

	.brand-name {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}

	/* 二维码区域 */
	.qrcode-section {
		margin-bottom: 30rpx;
		text-align: center;
	}

	.qrcode-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: block;
	}

	.qrcode-canvas {
		border: 2rpx solid #e0e0e0;
		border-radius: 10rpx;
		margin: 0 auto;
		display: block;
	}

	.no-url-text {
		font-size: 28rpx;
		color: #999;
		padding: 40rpx;
		background-color: #f8f9fa;
		border-radius: 10rpx;
		display: block;
	}

	/* 邀请码显示框 */
	.invite-code-box {
		width: 500rpx;
		margin: 0 auto;
		background-color: #bd9c8d;
		padding:40rpx 30rpx;
		border-radius: 20rpx;
		text-align: center;
	}

	.invite-code-label {
		font-size: 32rpx;
		color: #fff;
		margin-bottom: 10rpx;
	}

	.invite-code-value {
		font-size: 36rpx;
		color: #fff;
		letter-spacing: 2rpx;
	}

	/* 复制按钮 */
	.copy-section {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.copy-btn {
		background-color: #555555;
		color: #fff;
		border: none;
		border-radius: 20rpx;
		padding: 20rpx ;
		width: 350rpx;
		margin: 0 auto;
		font-size: 32rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.3);
	}

	.copy-btn:active {
		background-color: #0056b3;
		transform: scale(0.98);
	}

	/* 推广图片 */
	.promotion-image-section {
		text-align: center;
	}

	.promotion-image {
		width: 100%;
		max-width: 320rpx;
		height: auto;
		border-radius: 15rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	}
</style>