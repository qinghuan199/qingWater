<template>
	<view class="publish-page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-content">
				<view class="nav-left" @click="goBack">
					<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
				</view>
				<view class="nav-center">
					<text class="nav-title">发布动态</text>
				</view>
				<view class="nav-right"></view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 视频和封面上传区域 -->
			<view class="upload-row">
				<!-- 添加视频 -->
				<view class="upload-item">
					<!-- <text class="section-title red-title">添加视频</text>
					<text class="upload-tip">支持mp4、mov、avi等格式，最大5G</text> -->
					<view class="video-upload-area" @click="selectVideo">
						<view v-if="!videoPath" class="upload-placeholder">
							<image class="upload-icon" src="/static/home/ic_add_video.png" mode="aspectFit"></image>
							<text class="upload-text">添加视频</text>
						</view>
						<video v-else class="preview-video" :src="videoPath" controls></video>
					</view>
				</view>

				<!-- 添加视频封面 -->
				<view class="upload-item">
			<!-- 		<text class="section-title red-title">添加视频封面</text>
					<text class="upload-tip">支持jpg、png等格式，建议16:9比例</text> -->
					<view class="cover-upload-area" @click="selectCover">
						<view v-if="!coverPath" class="upload-placeholder">
							<image class="upload-icon" src="/static/home/ic_photo_add.png" mode="aspectFit"></image>
							<text class="upload-text">添加视频封面</text>
						</view>
						<image v-else class="preview-cover" :src="coverPath" mode="aspectFill"></image>
					</view>
				</view>
			</view>

			<!-- 视频标题 -->
			<view class="input-section">
				<view class="title-row">
					<text class="section-title red-title">视频标题</text>
					<text class="title-tip">好的标题可提升视频点击率</text>
				</view>
				<input class="title-input" v-model="videoTitle" placeholder="请输入视频标题" maxlength="100" />
				<!-- <text class="char-count">{{ videoTitle.length }}/50</text> -->
			</view>

			<!-- 设定价格 -->
			<view class="input-section">
				<view class="title-row">
					<text class="section-title red-title">设定价格</text>
					<text class="title-tip">原创主最高设置5元，UP主最高设置2元。</text>
				</view>
				<view class="price-input-container">
					<!-- <text class="currency-symbol">¥</text> -->
					<input class="price-input" v-model="videoPrice" placeholder="设置观看价格，不输则为免费" type="digit" />
				</view>
			</view>

			<!-- 视频标签 -->
			<view class="input-section">
				<view class="title-row">
					<text class="section-title red-title">视频标签</text>
					<text class="title-tip">设置符合视频内容的标签。</text>
				</view>
				<input class="tag-input" 
					v-model="selectedTagsText" 
					placeholder="请选择视频标签" 
					readonly
					@click="showTagSelector" />
			</view>

			<!-- 规则说明 -->
			<view class="rules-section">
				<text class="rules-text">1、视频内无其他平台网址及水印</text>
				<text class="rules-text">2、视频清晰，封面于内容一致</text>
				<text class="rules-text">3、真实原创收视率偏高</text>
				<text class="rules-text">4、单片付费观看返佣发布者70%</text>
			</view>

			<!-- 上传按钮 -->
			<view class="submit-section">
				<view class="submit-btn" :class="{ disabled: uploading }" @click="publishVideo">
					<text class="submit-text">{{ uploading ? '上传中...' : '上传视频' }}</text>
				</view>
			</view>
		</view>

		<!-- 标签选择弹窗 -->
		<view class="tag-popup" v-if="showTagPopup" @click="hideTagSelector">
			<view class="tag-popup-content" @click.stop>
				<view class="popup-header">
				<view class="popup-close" @click="hideTagSelector">
					<text class="popup-close-text">×</text>
				</view>
				<text class="popup-title">选择视频标签</text>
				<text class="popup-subtitle">最多选择3个标签</text>
			</view>
			<view class="popup-tags">
				<view class="popup-tag-item" 
					v-for="(tag, index) in availableTags" 
					:key="tag.id"
					:class="{ active: selectedTagIds.includes(tag.id) }"
					@click="toggleTag(tag)">
					<text class="popup-tag-text">{{ tag.name }}</text>
				</view>
			</view>
			<view class="popup-actions">
				<view class="popup-btn confirm" 
					:class="{ disabled: selectedTagIds.length === 0 }"
					@click="confirmTagSelection">
					<text class="popup-btn-text">确定</text>
				</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
		data() {
			return {
				videoPath: '', // 视频路径
				coverPath: '', // 封面路径
				videoTitle: '', // 视频标题
				videoPrice: '', // 视频价格
				selectedTagIds: [], // 选中的标签ID数组
				selectedTagsText: '', // 显示在输入框中的标签文本
				availableTags: [], // 可选标签列表
				showTagPopup: false, // 是否显示标签选择弹窗
				uploading: false, // 上传状态
				videoUrl: '', // 视频上传后的URL
				coverUrl: '', // 封面上传后的URL
				videoUploadUrl: '' // 视频上传地址
			};
		},
	onLoad() {
		// 获取基础信息，包括视频上传地址
		this.getBasicInfo();
		
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 获取基础信息
		getBasicInfo() {
			uni.request({
				url: getApp().globalData.baseUrl + 'api/basicinfo',
				method: 'GET',
				success: (res) => {
					if (res.data.code === 200) {
						this.videoUploadUrl = res.data.data.video_url;
					} else {
						uni.showToast({
							title: res.data.msg || '获取基础信息失败',
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

		// 选择视频
		selectVideo() {
			uni.chooseVideo({
				sourceType: ['camera', 'album'],
				maxDuration: 300, // 最大5分钟
				success: async (res) => {
					const fileSize = res.size;
					if (fileSize > 5000 * 1024 * 1024) { 
						uni.showToast({
							title: '视频大小不能超过5G',
							icon: 'none'
						});
						return;
					}
					this.videoPath = res.tempFilePath;
					
					// 立即上传视频
					try {
						uni.showLoading({ title: '上传视频中...' });
						this.videoUrl = await this.uploadVideo(this.videoPath);
						uni.hideLoading();
						uni.showToast({
							title: '视频上传成功',
							icon: 'success'
						});
					} catch (error) {
						uni.hideLoading();
						uni.showToast({
							title: error || '视频上传失败',
							icon: 'none'
						});
						// 上传失败时清空视频路径
						this.videoPath = '';
						this.videoUrl = '';
					}
				}
			});
		},

		// 选择封面
		selectCover() {
			uni.chooseImage({
				count: 1,
				sourceType: ['camera', 'album'],
				success: async (res) => {
					this.coverPath = res.tempFilePaths[0];
					
					// 立即上传封面
					try {
						uni.showLoading({ title: '上传封面中...' });
						this.coverUrl = await this.uploadImage(this.coverPath);
						uni.hideLoading();
						uni.showToast({
							title: '封面上传成功',
							icon: 'success'
						});
					} catch (error) {
						uni.hideLoading();
						uni.showToast({
							title: error || '封面上传失败',
							icon: 'none'
						});
						// 上传失败时清空封面路径
						this.coverPath = '';
						this.coverUrl = '';
					}
				}
			});
		},

		// 获取标签列表
		getTagList() {
			const userInfo = getApp().getCache('userInfo');
			if (!userInfo || !userInfo.token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}

			uni.request({
					url: getApp().globalData.baseUrl + 'api/video/member/label/list',
				method: 'POST',
				header: {
					'token': userInfo.token
				},
				data: {
					name: '' // 可选的名称搜索参数
				},
				success: (res) => {
					if (res.data.code === 200) {
						this.availableTags = res.data.data || [];
					} else {
						uni.showToast({
							title: res.data.msg || '获取标签列表失败',
							icon: 'none'
						});
						// 使用默认标签作为备选
						this.availableTags = [
							{ id: 1, name: '搞笑' },
							{ id: 2, name: '美食' },
							{ id: 3, name: '旅行' }
						];
					}
				},
				fail: (err) => {
					console.error('获取标签列表失败:', err);
					uni.showToast({
						title: '网络错误，请重试',
						icon: 'none'
					});
					// 使用默认标签作为备选
					this.availableTags = [
						{ id: 1, name: '搞笑' },
						{ id: 2, name: '美食' },
						{ id: 3, name: '旅行' }
					];
				}
			});
		},

		// 显示标签选择器
		showTagSelector() {
			// 清除之前的选择状态
			this.selectedTagIds = [];
			this.showTagPopup = true;
			// 获取标签列表
			this.getTagList();
		},

		// 隐藏标签选择器
		hideTagSelector() {
			this.showTagPopup = false;
		},

		// 切换标签选择
		toggleTag(tag) {
			const index = this.selectedTagIds.indexOf(tag.id);
			if (index > -1) {
				this.selectedTagIds.splice(index, 1);
			} else {
				if (this.selectedTagIds.length < 3) {
					this.selectedTagIds.push(tag.id);
				} else {
					uni.showToast({
						title: '最多选择3个标签',
						icon: 'none'
					});
				}
			}
		},

		// 确认标签选择
		confirmTagSelection() {
			// 检查是否至少选择了一个标签
			if (this.selectedTagIds.length === 0) {
				uni.showToast({
					title: '请至少选择一个标签',
					icon: 'none'
				});
				return;
			}
			
			// 更新显示文本
			const selectedTagNames = this.availableTags
				.filter(tag => this.selectedTagIds.includes(tag.id))
				.map(tag => tag.name);
			this.selectedTagsText = selectedTagNames.join(', ');
			
			// 关闭弹窗
			this.hideTagSelector();
		},



		// 上传图片
		uploadImage(filePath) {
			return new Promise((resolve, reject) => {
				const userInfo = getApp().getCache('userInfo');
				uni.uploadFile({
					url: 'http://103.43.71.158/api/upload/image',
					filePath: filePath,
					name: 'image',
					header: {
						'token': userInfo.token
					},
					success: (res) => {
						const data = JSON.parse(res.data);
						if (data.code === 200) {
							resolve(data.data);
						} else {
							reject(data.msg || '上传失败');
						}
					},
					fail: () => {
						reject('网络错误');
					}
				});
			});
		},

		// 上传视频
		uploadVideo(filePath) {
			return new Promise((resolve, reject) => {
				const userInfo = getApp().getCache('userInfo');
				if (!this.videoUploadUrl) {
					reject('视频上传地址未获取');
					return;
				}

				uni.uploadFile({
					url: this.videoUploadUrl + '/api/upload/video',
					filePath: filePath,
					name: 'video',
					header: {
						'token': userInfo.token
					},
					success: (res) => {
						const data = JSON.parse(res.data);
						if (data.code === 200) {
							resolve(data.data);
						} else {
							reject(data.msg || '上传失败');
						}
					},
					fail: () => {
						reject('网络错误');
					}
				});
			});
		},

		// 发布视频
		async publishVideo() {
			if (this.uploading) return;

			// 验证必填项
			if (!this.videoUrl) {
				uni.showToast({
					title: '请先选择并上传视频',
					icon: 'none'
				});
				return;
			}

			if (!this.coverUrl) {
				uni.showToast({
					title: '请先选择并上传封面',
					icon: 'none'
				});
				return;
			}

			if (!this.videoTitle.trim()) {
				uni.showToast({
					title: '请输入视频标题',
					icon: 'none'
				});
				return;
			}

			// 价格验证：如果输入了价格，必须大于0；如果没输入则默认为免费
			if (this.videoPrice && parseFloat(this.videoPrice) <= 0) {
				uni.showToast({
					title: '价格必须大于0，不输入则为免费',
					icon: 'none'
				});
				return;
			}

			this.uploading = true;

			try {
				// 发布视频
				uni.showLoading({ title: '发布中...' });
				await this.submitVideo();

				uni.hideLoading();
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);

			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: error || '发布失败',
					icon: 'none'
				});
			} finally {
				this.uploading = false;
			}
		},

		// 提交视频信息
		submitVideo() {
			return new Promise((resolve, reject) => {
				const userInfo = getApp().getCache('userInfo');
				
				// 将选中的标签ID转换为字符串
				const tagIds = this.selectedTagIds.join(',');
				
				uni.request({
					url: getApp().globalData.baseUrl + 'api/video/member/add',
					method: 'POST',
					header: {
						'token': userInfo.token
					},
					data: {
						name: this.videoTitle,
						url: this.videoUrl,
						cover: this.coverUrl,
						amount: parseFloat(this.videoPrice) || 0,
						scope: 1, // 默认所有人可见
						video_label_ids: tagIds
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'success'
							});
							resolve(res.data);
						} else {
							reject(res.data.msg || '发布失败');
						}
					},
					fail: () => {
						reject('网络错误');
					}
				});
			});
		}
	}
};
</script>

<style scoped>
.publish-page {
	background-color: #fff;
	min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background-color: #fafafa;
	padding-top: var(--status-bar-height);
}

.navbar-content {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
}

.nav-left, .nav-right {
	width: 80rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
}

.nav-center {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-title {
	color: #000;
	font-size: 36rpx;
}

/* 内容区域 */
.content-container {
	padding-top: calc(var(--status-bar-height) + 88rpx);
	padding: calc(var(--status-bar-height) + 88rpx) 30rpx 30rpx;
}

/* 上传区域 */
.upload-section {
	margin-bottom: 40rpx;
}

.upload-row {
	display: flex;
	gap: 20rpx;
	margin: 40rpx auto;
	
}

.upload-item {
	flex: 1;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	display: block;
}

.red-title {
	color: #fd2e41;
}

.title-row {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.title-tip {
	font-size: 24rpx;
	color: #999;
	flex-shrink: 0;
	margin-left: 20rpx;
}

.upload-tip {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 20rpx;
	display: block;
}

.video-upload-area {
	height: 300rpx;
	border: 2rpx dashed #ddd;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #eee;
}

.cover-upload-area {
	height: 300rpx;
	border: 2rpx dashed #ddd;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #eee;
}

.upload-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.upload-icon {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 20rpx;
	opacity: 0.6;
}

.upload-text {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.upload-tip {
	font-size: 24rpx;
	color: #999;
}

.preview-video {
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}

.preview-cover {
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}

/* 输入区域 */
.input-section {
	margin-bottom: 40rpx;
	position: relative;
}

.title-input {
	width: 100%;
	height: 80rpx;
	background-color: #eeeeee;
	border-radius: 20rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	color: #333;
	border: 2rpx solid #eee;
}

.char-count {
	position: absolute;
	right: 30rpx;
	top: 80rpx;
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.price-input-container {
	display: flex;
	align-items: center;
	background-color: #eee;
	border-radius: 20rpx;
	padding: 0 30rpx;
	height: 80rpx;
	border: 2rpx solid #eee;
}

.currency-symbol {
	font-size: 32rpx;
	color: #333;
	margin-right: 10rpx;
	font-weight: bold;
}

.price-input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	color: #333;
}

/* 标签区域 */
.tag-section {
	margin-bottom: 60rpx;
}

.tag-container {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.tag-item {
	padding: 15rpx 30rpx;
	border-radius: 40rpx;
	background-color: #fff;
	border: 2rpx solid #eee;
	transition: all 0.3s ease;
}

.tag-item.active {
	background: linear-gradient(to bottom, #fd2e41 0%, #fc1071 100%);
}

.tag-text {
	font-size: 26rpx;
	color: #666;
}

.tag-item.active .tag-text {
	color: #fff;
}

/* 规则说明 */
.rules-section {
	margin-bottom: 40rpx;
	padding: 30rpx;
	border-radius: 20rpx;
}

.rules-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.8;
	margin-bottom: 15rpx;
	display: block;
	font-weight: bold;
	text-align: left;
}

/* 提交按钮 */
.submit-section {
	margin-top: 60rpx;
}

.submit-btn {
	height: 100rpx;
	background: linear-gradient(to bottom, #fd2e41 0%, #fc1071 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.submit-btn:active {
	transform: scale(0.95);
}

.submit-btn.disabled {
	background: #ccc;
	box-shadow: none;
}

.submit-text {
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
}

/* 标签输入框 */
.tag-input {
	width: 100%;
	height: 80rpx;
	background-color: #eee;
	border-radius: 20rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	color: #333;
	border: 2rpx solid #eee;
	cursor: pointer;
}

/* 标签选择弹窗 */
.tag-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 2000;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.tag-popup-content {
	width: 100%;
	max-height: 80vh;
	background-color: #fff;
	border-radius: 40rpx 40rpx 0 0;
	padding: 40rpx 30rpx 60rpx;
	animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.popup-header {
	text-align: center;
	margin-bottom: 40rpx;
	border-bottom: 2rpx solid #f0f0f0;
	padding-bottom: 30rpx;
	position: relative;
}

.popup-close {
	position: absolute;
	top: -10rpx;
	right: 0;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.popup-close-text {
	font-size: 48rpx;
	color: #999;
	font-weight: bold;
	line-height: 1;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.popup-subtitle {
	font-size: 26rpx;
	color: #999;
	display: block;
}

.popup-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 60rpx;
	max-height: 400rpx;
	overflow-y: auto;
}

.popup-tag-item {
	padding: 20rpx 40rpx;
	border-radius: 40rpx;
	background-color: #f8f8f8;
	border: 2rpx solid #eee;
	transition: all 0.3s ease;
}

.popup-tag-item.active {
	background: linear-gradient(to bottom, #fd2e41 0%, #fc1071 100%);
	transform: scale(1.05);
}

.popup-tag-text {
	font-size: 28rpx;
	color: #666;
}

.popup-tag-item.active .popup-tag-text {
	color: #fff;
}

.popup-actions {
	display: flex;
}

.popup-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.popup-btn.confirm {
	background: linear-gradient(to bottom, #fd2e41 0%, #fc1071 100%);
}

.popup-btn.confirm.disabled {
	background: #ccc;
	box-shadow: none;
	cursor: not-allowed;
	opacity: 0.6;
}

.popup-btn:active {
	transform: scale(0.95);
}

.popup-btn-text {
	font-size: 30rpx;
	font-weight: bold;
}

.popup-btn.confirm .popup-btn-text {
	color: #fff;
}

.popup-btn.confirm.disabled .popup-btn-text {
	color: #999;
}
</style>