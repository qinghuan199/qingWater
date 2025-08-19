<template>
	<view class="publish-teapost-page">
		<!-- 头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image src="/static/icon/back.png" class="back-icon"></image>
			</view>
			<view class="title">发布茶贴</view>
		</view>

		<!-- 表单内容 -->
		<view class="form-container">
			<!-- 标题 -->
			<view class="form-item" style="border-bottom: 10rpx solid #eee;">
				<view class="label">标茶贴题 </view>
				<input v-model="formData.title" placeholder="请输入茶贴标题" class="input" />
			</view>

			<!-- 年龄 -->
			<view class="form-item">
				<view class="label">年龄 </view>
				<input v-model="formData.age" placeholder="请输入年龄" class="input" type="number" />
			</view>

			<!-- 类型 -->
			<view class="form-item" @click="showTypeModal">
				<view class="label">类型 </view>
				<view class="input-like" :class="{ placeholder: !selectedType }">
					{{ selectedType || '请选择类型' }}
				</view>
				<image src="/static/icon/arrow-right.png" class="arrow-icon"></image>
			</view>

			<!-- 服务项目 -->
			<view class="form-item">
				<view class="label">服务项目 </view>
				<input v-model="formData.service_project" placeholder="请输入服务项目" class="input"></textarea>
			</view>

			<!-- 服务地区 -->
			<view class="form-item" @click="goToAddress">
				<view class="label">服务地区 </view>
				<view class="input-like" :class="{ placeholder: !selectedAddress }">{{ selectedAddress || '请选择服务地区' }}
				</view>
				<image src="/static/icon/arrow-right.png" class="arrow-icon"></image>
			</view>

			<!-- 消费情况 -->
			<view class="form-item">
				<view class="label">消费情况 </view>
				<input v-model="formData.consumption_situation" placeholder="1p 500 2p 800 包夜2000"
					class="input"></textarea>
			</view>
			<!-- 是否包赔 -->
			<view class="form-item">
				<view class="label">是否包赔 </view>
				<view class="switch-container">
					<switch v-model="formData.is_gpc" color="#fd264c" />
					<!-- <text class="switch-text">{{ formData.is_gpc ? '是' : '否' }}</text> -->
				</view>
			</view>

			<!-- 详细描述 -->
			<view class="form-items">
				<view class="labels">详细描述 </view>
				<textarea v-model="formData.description" placeholder="请输入详细描述" class="textarea"></textarea>
			</view>

			<!-- 视频上传 -->
			<view class="form-items">
				<view class="labels">上传视频 </view>
				<view class="video-tip m-b-20">(上传个人的真实视频)</view>
				<view class="video-upload">
					<view class="video-list">
						<view v-if="formData.video" class="video-item">
							<video :src="getVideoUrl(formData.video)" class="uploaded-video" controls></video>
							<view class="delete-btn" @click="deleteVideo">×</view>
						</view>
						<view v-if="!formData.video" class="add-video-btn" @click="chooseVideo">
							<image src="/static/home/ic_photo_add.png" class="add-icon"></image>
							<!-- <text class="add-text">添加视频</text> -->
						</view>
					</view>
				</view>
			</view>


			<!-- 图片上传 -->
			<view class="form-items ">
				<view class="labels ">上传图片 </view>
				<view class="image-tip m-b-20">(最多上传9张图片)</view>
				<view class="image-upload">
					<view class="image-list">
						<view v-for="(image, index) in formData.image" :key="index" class="image-item">
							<image :src="getImageUrl(image)" class="uploaded-image" mode="aspectFill"></image>
							<view class="delete-btn" @click="deleteImage(index)">×</view>
						</view>
						<view v-if="formData.image.length < 9" class="add-image-btn" @click="chooseImage">
							<image src="/static/home/ic_photo_add.png" class="add-icon"></image>
						</view>
					</view>
				</view>
			</view>


		</view>

		<!-- 底部提交按钮 -->
		<view class="bottom-actions">
			<button class="submit-btn" @click="submitTeapost">
				<text class="btn-text">立即发布</text>
			</button>
		</view>

		<!-- 类型选择弹窗 -->
		<view v-if="showTypeModalFlag" class="modal-overlay" @click="hideTypeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择类型</text>
					<text class="modal-close" @click="hideTypeModal">×</text>
				</view>
				<view class="modal-body">
					<view v-for="item in typeList" :key="item.id" class="type-item" @click="selectType(item)">
						<text class="type-name">{{ item.name }}</text>
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
				formData: {
					title: '', // 标题
					age: '', // 年龄
					type: 0, // 类型ID
					service_project: '', // 服务项目
					province_id: '', // 省份ID
					city_id: '', // 城市ID
					area_id: '', // 地区ID
					consumption_situation: '', // 消费情况
					description: '', // 详细描述
					is_gpc: false, // 是否包赔
					image: [], // 图片数组
					video: '' // 视频
				},
				typeList: [], // 类型列表
				showTypeModalFlag: false, // 是否显示类型弹窗
				selectedType: '', // 选中的类型名称
				selectedAddress: '', // 选中的地址
				videoUploadUrl: '' // 视频上传URL
			};
		},
		onLoad() {
			this.getTypeList();
			this.getBasicInfo();
		},
		onShow() {
			// 检查是否有地址选择返回的数据
			const selectedAddress = uni.getStorageSync('teapostAuthSelectedAddress');
			if (selectedAddress) {
				this.formData.province_id = selectedAddress.province_id;
				this.formData.city_id = selectedAddress.city_id;
				this.formData.area_id = selectedAddress.area_id;
				this.selectedAddress = selectedAddress.fullAddress;
				// 清除缓存
				uni.removeStorageSync('teapostAuthSelectedAddress');
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 获取基本信息
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

			// 获取类型列表
			getTypeList() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (!userInfo || !userInfo.token) {
					return;
				}

				var postData = {
					token: userInfo.token
				};

				getApp().getData('api/loufeng/type', postData, function(res) {
					if (res.code == 200 && res.data) {
						that.typeList = res.data;
					}
				});
			},

			// 显示类型选择弹窗
			showTypeModal() {
				this.showTypeModalFlag = true;
			},

			// 隐藏类型选择弹窗
			hideTypeModal() {
				this.showTypeModalFlag = false;
			},

			// 选择类型
			selectType(item) {
				this.formData.type = parseInt(item.id);
				this.selectedType = item.name;
				this.hideTypeModal();
			},

			// 跳转到地址选择页面
			goToAddress() {
				uni.navigateTo({
					url: '/pages/auth-address/auth-address?from=teapostAuth&level=0'
				});
			},

			// 选择图片
			chooseImage() {
				var that = this;
				uni.chooseImage({
					count: 9 - this.formData.image.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function(res) {
						// 逐个上传图片到服务器
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							try {
								uni.showLoading({
									title: '上传图片中...'
								});
								const imageData = await that.uploadImage(res.tempFilePaths[i]);
								// 从返回的数据中获取图片字段
								const imageUrl = imageData.url || imageData;
								that.formData.image.push(imageUrl);
								uni.hideLoading();
							} catch (error) {
								uni.hideLoading();
								uni.showToast({
									title: error || '图片上传失败',
									icon: 'none'
								});
								break;
							}
						}
					}
				});
			},

			// 选择视频
			chooseVideo() {
				var that = this;
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					maxDuration: 60,
					camera: 'back',
					success: async function(res) {
						try {
							uni.showLoading({
								title: '上传视频中...'
							});
							const videoData = await that.uploadVideo(res.tempFilePath);
							// 从返回的数据中获取视频字段
							const videoUrl = videoData.url || videoData;
							that.formData.video = videoUrl;
							uni.hideLoading();
						} catch (error) {
							uni.hideLoading();
							uni.showToast({
								title: error || '视频上传失败',
								icon: 'none'
							});
						}
					}
				});
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
							try {
								const data = JSON.parse(res.data);
								if (data.code === 200) {
									resolve(data.data);
								} else {
									reject(data.msg || '上传失败');
								}
							} catch (e) {
								reject('上传失败');
							}
						},
						fail: (err) => {
							reject('上传失败');
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
							try {
								const data = JSON.parse(res.data);
								if (data.code === 200) {
									resolve(data.data);
								} else {
									reject(data.msg || '上传失败');
								}
							} catch (e) {
								reject('上传失败');
							}
						},
						fail: (err) => {
							reject('上传失败');
						}
					});
				});
			},

			// 删除图片
			deleteImage(index) {
				this.formData.image.splice(index, 1);
			},

			// 删除视频
			deleteVideo() {
				this.formData.video = '';
			},

			// 获取图片URL
			getImageUrl(image) {
				if (image.startsWith('http')) {
					return image;
				}
				return 'http://103.43.71.158' + image;
			},

			// 获取视频URL
			getVideoUrl(video) {
				if (video.startsWith('http')) {
					return video;
				}
				return 'http://103.43.71.158' + video;
			},

			// 创建订单
			createOrder(infoId) {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var createData = {
					token: userInfo.token,
					type: 'loufeng_auth',
					info_id: infoId
				};
				
				getApp().getData('api/order/create', createData, function(createRes) {
					if (createRes.code == 200) {
						// 创建订单成功后调用支付接口
						that.processPayment(createRes.data);
					} else {
						console.log('创建订单失败:', createRes.msg);
					}
				});
			},
			
			// 处理支付
			processPayment(orderId) {
				var userInfo = getApp().getCache('userInfo');
				var payData = {
					token: userInfo.token,
					id: orderId,
					paytype: 0,
					type: 'loufeng_auth'
				};
				
				getApp().getData('api/order/pay', payData, function(payRes) {
					if (payRes.code == 200) {
						console.log('支付接口调用成功');
					} else {
						console.log('支付接口调用失败:', payRes.msg);
					}
				});
			},
			
			// 提交茶贴
			submitTeapost() {
				var that = this;

				// 表单验证
				if (!this.formData.title) {
					uni.showToast({
						title: '请输入标题',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.age) {
					uni.showToast({
						title: '请输入年龄',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.type) {
					uni.showToast({
						title: '请选择类型',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.service_project) {
					uni.showToast({
						title: '请输入服务项目',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.province_id || !this.formData.city_id || !this.formData.area_id) {
					uni.showToast({
						title: '请选择服务地区',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.consumption_situation) {
					uni.showToast({
						title: '请输入消费情况',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.description) {
					uni.showToast({
						title: '请输入详细描述',
						icon: 'none'
					});
					return;
				}

				if (this.formData.image.length === 0) {
					uni.showToast({
						title: '请上传至少一张图片',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.video) {
					uni.showToast({
						title: '请上传视频',
						icon: 'none'
					});
					return;
				}


				// 构建提交数据
				var postData = {
					title: this.formData.title,
					age: parseInt(this.formData.age),
					type: parseInt(this.formData.type),
					service_project: this.formData.service_project,
					province_id: parseInt(this.formData.province_id),
					city_id: parseInt(this.formData.city_id),
					area_id: parseInt(this.formData.area_id),
					consumption_situation: this.formData.consumption_situation,
					description: this.formData.description,
					is_gpc: this.formData.is_gpc ? 1 : 0,
					image: this.formData.image.join(','),
					video: this.formData.video
				};

				getApp().getData('api/loufeng/data/publish', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: '发布成功',
							icon: 'success'
						});
						
						// 发布成功后调用创建订单方法
						// that.createOrder(res.data);
					
					} else {
						uni.showToast({
							title: res.msg || '发布失败',
							icon: 'none'
						});
					}
				});
			}
		}
	};
</script>

<style scoped>
	.publish-teapost-page {
		min-height: 100vh;
		background-color: #fff;
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

	/* 表单样式 */
	.form-container {
		padding: 120rpx 0rpx 30rpx;
		background-color: #fff;
		min-height: 100vh;
	}

	.form-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 30rpx 40rpx;
		position: relative;
	}

	.label {
		width: 200rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
		flex-shrink: 0;
	}

	.form-items {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 30rpx 40rpx;
		position: relative;
	}

	.labels {
		width: 200rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
		flex-shrink: 0;
	}

	.input {
		flex: 1;
		font-size: 32rpx;
		color: #333;
		padding-left: 20rpx;
		text-align: right;
		border: none;
		background: transparent;
	}

	.input-like {
		flex: 1;
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 0 20rpx 20rpx;
		text-align: right;
	}

	.input-like.placeholder {
		color: #999;
	}

	.arrow-icon {
		width: 30rpx;
		height: 30rpx;
		margin-left: 20rpx;
	}

	.textarea {
		flex: 1;
		font-size: 30rpx;
		color: #999;
		width: 650rpx;
		margin-top: 10rpx;
		padding: 15rpx;
		min-height: 200rpx;
		background-color: #eee;
		border: none;
		border-radius: 8rpx;
	}

	.switch-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.switch-text {
		font-size: 32rpx;
		color: #333;
	}

	/* 图片上传样式 */
	.image-upload {
		flex: 1;
		padding-left: 20rpx;
	}

	.image-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.image-item {
		position: relative;
		width: 150rpx;
		height: 150rpx;
	}

	.uploaded-image {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}

	.delete-btn {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: #ff4757;
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		z-index: 9;
		justify-content: center;
		font-size: 24rpx;
	}

	.add-image-btn {
		width: 150rpx;
		height: 150rpx;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.add-icon {
		width: 100%;
		height: 100%;
		margin-bottom: 10rpx;
	}

	.add-text {
		font-size: 24rpx;
		color: #999;
	}

	.image-tip {
		font-size: 24rpx;
		color: #fd1f57;
		margin-top: 10rpx;
	}

	/* 视频上传样式 */
	.video-upload {
		flex: 1;
		padding-left: 20rpx;
	}

	.video-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.video-item {
		position: relative;
		width: 300rpx;
		height: 200rpx;
	}

	.uploaded-video {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}

	.add-video-btn {
		width: 150rpx;
		height: 150rpx;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.video-tip {
		font-size: 24rpx;
		color: #fd264c;
		margin-top: 10rpx;
	}

	/* 底部按钮 */
	.bottom-actions {
		background-color: #fff;
		padding: 30rpx 40rpx;
	}

	.submit-btn {
		width: 600rpx;
		height: 88rpx;
		background: #fd264c;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
	}

	.submit-btn:disabled {
		background-color: #ccc;
	}

	.btn-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	/* 弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		width: 600rpx;
		max-height: 80vh;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.modal-title {
		font-size: 36rpx;
		color: #333;
		font-weight: 500;
	}

	.modal-close {
		font-size: 40rpx;
		color: #999;
	}

	.modal-body {
		max-height: 60vh;
		overflow-y: auto;
	}

	.type-item {
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.type-item:last-child {
		border-bottom: none;
	}

	.type-name {
		font-size: 32rpx;
		color: #333;
	}
</style>