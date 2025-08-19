<template>
	<view class="personal-auth-page">
		<!-- 头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image src="/static/icon/back.png" class="back-icon"></image>
			</view>
			<view class="title">个人认证</view>
		</view>

		<!-- 表单内容 -->
		<view class="form-container">
			<!-- 联系电话 -->
			<view class="form-item">
				<view class="label">联系电话 </view>
				<input v-model="formData.mobile" placeholder="请输入联系电话" class="input" />
			</view>

			<!-- 年龄 -->
			<view class="form-item">
				<view class="label">年龄 </view>
				<input v-model="formData.age" placeholder="请输入年龄" class="input" type="number" />
			</view>

			<!-- 价格 -->
			<view class="form-item">
				<view class="label">最低价格 </view>
				<input v-model="formData.min_price" placeholder="请输入最低价格" class="input" type="number" />
			</view>

			<!-- 消费情况 -->
			<view class="form-item">
				<view class="label">消费情况 </view>
				<input v-model="formData.consumption_situation" placeholder="请输入消费情况" class="input"></input>
			</view>

			<!-- 服务项目 -->
			<view class="form-item">
				<view class="label">服务项目 </view>
				<input v-model="formData.service_project" placeholder="请输入服务项目" class="input"></input>
			</view>

			<!-- 资源类型 -->
			<view class="form-item" @click="showResourceTypeModal">
				<view class="label">资源类型 </view>
				<view class="input-like" :class="{ placeholder: !selectedResourceType }">
					{{ selectedResourceType || '请选择资源类型' }}</view>
				<image src="/static/icon/arrow-right.png" class="arrow-icon"></image>
			</view>

			<!-- 服务地区 -->
			<view class="form-item" @click="goToAddress">
				<view class="label">服务地区 </view>
				<view class="input-like" :class="{ placeholder: !selectedAddress }">{{ selectedAddress || '请选择服务地区' }}
				</view>
				<image src="/static/icon/arrow-right.png" class="arrow-icon"></image>
			</view>

			<!-- 个人照片 -->
			<view class="form-items">
				<view class="label">个人照片 </view>
				<view class="image-tip m-b-20">(温馨提示：请上传本人的真实照片)</view>
				<view class="image-upload">
					<view class="image-list">
						<view v-for="(image, index) in formData.image" :key="index" class="image-item">
							<image :src="getImageUrl(image)" class="uploaded-image" mode="aspectFill"></image>
							<view class="delete-btn" @click="deleteImage(index)">×</view>
						</view>
						<view v-if="formData.image.length < 9" class="add-image-btn" @click="chooseImage">
							<image src="/static/home/ic_photo_add.png" class="add-icon"></image>
							<!-- <text class="add-text">添加图片</text> -->
						</view>
					</view>
				</view>
			</view>

			<!-- 健康证明 -->
			<view class="form-items">
				<view class="label">本人健康证明 </view>
				<view class="image-tip m-b-20">(温馨提示：请上传一年内的健康证明)</view>
				<view class="image-upload">
					<view class="image-list">
						<view v-if="formData.health_certificate" class="image-item">
							<image :src="getImageUrl(formData.health_certificate)" class="uploaded-image"
								mode="aspectFill"></image>
							<view class="delete-btn" @click="deleteHealthCertificate">×</view>
						</view>
						<view v-if="!formData.health_certificate" class="add-image-btn"
							@click="chooseHealthCertificate">
						<image src="/static/home/ic_photo_add.png" class="add-icon"></image>
							<!-- <text class="add-text">添加图片</text> -->
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部提交按钮 -->
		<view class="bottom-actions">
			<button class="submit-btn" @click="submitAuth" :disabled="submitting">
				<text class="btn-text">{{ submitting ? '提交中...' : '提交认证' }}</text>
			</button>
		</view>

		<!-- 资源类型选择弹窗 -->
		<view v-if="showResourceModal" class="modal-overlay" @click="hideResourceTypeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择资源类型</text>
					<text class="modal-close" @click="hideResourceTypeModal">×</text>
				</view>
				<view class="modal-body">
					<view v-for="item in resourceTypeList" :key="item.id" class="resource-item"
						@click="selectResourceType(item)">
						<text class="resource-name">{{ item.name }}</text>
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
					mobile: '', // 联系电话
					age: '', // 年龄
					min_price: '', // 最低价格
					consumption_situation: '', // 消费情况
					service_project: '', // 服务项目
					resource_type: 0, // 资源类型ID
					province_id: '', // 省份ID
					city_id: '', // 城市ID
					area_id: '', // 地区ID
					image: [], // 个人照片数组
					health_certificate: '', // 健康证明
					loufeng_type: 1 // 楼凤类型：1表示个人
				},
				resourceTypeList: [], // 资源类型列表
				showResourceModal: false, // 是否显示资源类型弹窗
				selectedResourceType: '', // 选中的资源类型名称
				selectedAddress: '', // 选中的地址
				submitting: false, // 是否正在提交
				authInfo: {
					one: 200, // 个人认证金额
					more: 1000 // 茶铺认证金额
				}
			};
		},
		onLoad() {
			this.getResourceTypeList();
			this.getAuthInfo();
		},
		onShow() {
			// 从地址选择页面返回时获取选中的地址
			const addressData = uni.getStorageSync('personalAuthSelectedAddress');
			if (addressData) {
				this.selectedAddress = addressData.fullAddress;
				this.formData.province_id = addressData.province_id;
				this.formData.city_id = addressData.city_id;
				this.formData.area_id = addressData.area_id;
				// 清除缓存
				uni.removeStorageSync('personalAuthSelectedAddress');
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 获取资源类型列表
			getResourceTypeList() {
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
						that.resourceTypeList = res.data;
					}
				});
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

			// 显示资源类型选择弹窗
			showResourceTypeModal() {
				this.showResourceModal = true;
			},

			// 隐藏资源类型选择弹窗
			hideResourceTypeModal() {
				this.showResourceModal = false;
			},

			// 选择资源类型
			selectResourceType(item) {
				this.formData.resource_type = parseInt(item.id);
				this.selectedResourceType = item.name;
				this.hideResourceTypeModal();
			},

			// 跳转到地址选择页面
			goToAddress() {
				uni.navigateTo({
					url: '/pages/auth-address/auth-address?from=personalAuth&level=0'
				});
			},

			// 选择个人照片
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
								// 从返回的数据中获取个人照片字段
								const imageUrl = imageData.personal_photo || imageData.url || imageData;
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

			// 选择健康证明
			chooseHealthCertificate() {
				var that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function(res) {
						try {
							uni.showLoading({
								title: '上传图片中...'
							});
							const imageData = await that.uploadImage(res.tempFilePaths[0]);
							// 从返回的数据中获取健康证明字段
							const imageUrl = imageData.health_certificate || imageData.url || imageData;
							that.formData.health_certificate = imageUrl;
							uni.hideLoading();
						} catch (error) {
							uni.hideLoading();
							uni.showToast({
								title: error || '图片上传失败',
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
									// 返回完整的data对象，让调用方决定使用哪个字段
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

			// 获取图片URL
			getImageUrl(url) {
				if (!url) return '';
				if (url.includes('http')) {
					return url;
				}
				return 'http://103.43.71.158' + url;
			},

			// 删除个人照片
			deleteImage(index) {
				this.formData.image.splice(index, 1);
			},

			// 删除健康证明
			deleteHealthCertificate() {
				this.formData.health_certificate = '';
			},

			// 提交认证
			submitAuth() {
				if (this.submitting) return;

				// 表单验证
				if (!this.formData.mobile) {
					uni.showToast({
						title: '请输入联系电话',
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
				if (!this.formData.min_price) {
					uni.showToast({
						title: '请输入最低价格',
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
				if (!this.formData.service_project) {
					uni.showToast({
						title: '请输入服务项目',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.resource_type || this.formData.resource_type <= 0) {
					uni.showToast({
						title: '请选择资源类型',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.province_id || !this.formData.city_id) {
					uni.showToast({
						title: '请选择服务地区',
						icon: 'none'
					});
					return;
				}
				if (this.formData.image.length === 0) {
					uni.showToast({
						title: '请上传个人照片',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.health_certificate) {
					uni.showToast({
						title: '请上传健康证明',
						icon: 'none'
					});
					return;
				}

				this.submitting = true;
			var that = this;
			var userInfo = getApp().getCache('userInfo');
			var postData = {
				token: userInfo.token,
				age: parseInt(this.formData.age),
				service_project: this.formData.service_project,
				province_id: parseInt(this.formData.province_id),
				city_id: parseInt(this.formData.city_id),
				area_id: parseInt(this.formData.area_id || 0),
				mobile: this.formData.mobile,
				min_price: this.formData.min_price,
				consumption_situation: this.formData.consumption_situation,
				image: this.formData.image,
				resource_type: parseInt(this.formData.resource_type),
				loufeng_type: 1, // 个人认证
				// 个人认证特有参数
				health_certificate: this.formData.health_certificate
			};

				getApp().getData('api/loufeng/auth', postData, function(res) {
				that.submitting = false;
				if (res.code == 403) {
					uni.showToast({
						title: res.msg,
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/order/order'
						});
					}, 1000);
				
				} else {
					uni.showToast({
						title: res.msg || '提交失败',
						icon: 'none'
					});
				}
			});
			},

			// 创建认证订单
			createAuthOrder() {
				uni.showLoading({
					title: '创建订单中...'
				});

				const postData = {
				type: 'normal',
				info_id: 1,
				amount: this.authInfo.one
			};

				var that = this;
				getApp().getData('/api/order/create', postData, (res) => {
					uni.hideLoading();
					if (res.code === 200) {
						const orderId = res.data;
						// 创建订单成功，进行支付
						that.payAuthOrder(orderId);
					} else {
						uni.showToast({
							title: res.msg || '创建订单失败',
							icon: 'none'
						});
					}
				});
			},

			// 支付认证订单 - 显示支付方式选择
			payAuthOrder(orderId) {
				// 显示支付方式选择弹窗
				uni.showActionSheet({
					itemList: ['余额支付', '微信支付', '支付宝支付'],
					success: (res) => {
						const payTypes = [0, 1, 2]; // 对应余额、微信、支付宝
						const payType = payTypes[res.tapIndex];
						this.performAuthPayment(orderId, payType);
					}
				});
			},

			// 执行认证支付
			performAuthPayment(orderId, payType) {
				uni.showLoading({
					title: '处理支付中...'
				});

				const postData = {
				id: orderId,
				paytype: 0,
				type: 'normal'
			};

				var that = this;
				getApp().getData('/api/order/pay', postData, (res) => {
					uni.hideLoading();
					if (res.code === 200) {
						if (payType === 0) {
							// 余额支付成功
							uni.showToast({
								title: '支付成功',
								icon: 'success',
								duration: 1000
							});
							// 1秒后返回上一页
							setTimeout(() => {
								uni.navigateBack();
							}, 1000);
						} else {
							// 第三方支付，处理支付结果
							that.handleAuthPaymentResult(res.data);
						}
					} else {
						uni.showToast({
							title: res.msg || '支付失败',
							icon: 'none'
						});
					}
				});
			},

			// 处理认证支付结果
			handleAuthPaymentResult(data) {
				// 微信支付
				if (data.payUrl) {
					// 跳转到支付页面
					uni.showModal({
						title: '支付提示',
						content: '请在新页面完成支付',
						showCancel: false,
						confirmText: '确定',
						success: function(res) {
							if (res.confirm) {
								// 打开支付网址
								// #ifdef H5
								window.open(data.payUrl, '_blank');
								// #endif
								// #ifdef APP-PLUS
								plus.runtime.openURL(data.payUrl);
								// #endif
								// #ifdef MP
								uni.setClipboardData({
									data: data.payUrl,
									success: function() {
										uni.showToast({
											title: '支付链接已复制到剪贴板',
											icon: 'none'
										});
									}
								});
								// #endif
							}
						}
					});
				}
			}
		}
	};
</script>

<style scoped>
	.personal-auth-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 120rpx;
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
		margin-bottom: 20rpx;
		border-radius: 16rpx;
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
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		position: relative;
	}

	.labels {
		width: 200rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
		flex-shrink: 0;
	}

	.required {
		color: #fff;
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
		margin-top: 10rpx;
		padding: 15rpx;
		min-height: 200rpx;
		background-color: #eee;
		border: none;
		border-radius: 8rpx;
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
		color: #fd264c;
		margin-top: 10rpx;
	}

	/* 底部按钮 */
	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 30rpx 40rpx;
		border-top: 1rpx solid #eee;
	}

	.submit-btn {
		width: 100%;
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

	.resource-item {
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.resource-item:last-child {
		border-bottom: none;
	}

	.resource-name {
		font-size: 32rpx;
		color: #333;
	}
</style>