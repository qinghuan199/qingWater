<template>
	<view class="shop-auth-page">
		<!-- 头部 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image src="/static/icon/back.png" class="back-icon"></image>
			</view>
			<view class="title">茶铺认证</view>
		</view>

		<!-- 步骤指示器 -->
		<view class="step-indicator">
			<view class="step-item" :class="{active: currentStep >= 1}">
				<view class="step-number">1</view>
				<text class="step-text">基本信息</text>
			</view>
			<view class="step-line" :class="{active: currentStep >= 2}"></view>
			<view class="step-item" :class="{active: currentStep >= 2}">
				<view class="step-number">2</view>
				<text class="step-text">详细信息</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view class="content" scroll-y="true">
			<!-- 第一步：基本信息 -->
			<view class="form-container" v-if="currentStep === 1">
				<!-- 茶铺名称 -->
				<view class="form-item">
					<view class="label">茶铺名称</view>
					<input class="input" v-model="formData.name" placeholder="请输入茶铺名称" />
				</view>

				<!-- 妹纸数量 -->
				<view class="form-item">
					<view class="label">妹纸数量</view>
					<input class="input" v-model="formData.num" type="number" placeholder="请输入妹纸数量" />
				</view>

				<!-- 妹子年龄 -->
				<view class="form-item">
					<view class="label">妹子年龄</view>
					<input class="input" v-model="formData.age" type="number" placeholder="请输入妹子年龄" />
				</view>

				<!-- 服务项目 -->
				<view class="form-item">
					<view class="label">服务项目</view>
					<input class="input" v-model="formData.service_project" placeholder="请输入服务项目" />
				</view>

				<!-- 资源类型 -->
				<view class="form-item" @click="showResourceTypeModal">
					<view class="label">资源类型</view>
					<view class="input-like" :class="{placeholder: !selectedResourceType}">
						{{selectedResourceType || '请选择资源类型'}}
					</view>
					<image src="/static/home/ic_arrow_right.png" class="arrow-icon"></image>
				</view>

				<!-- 服务地区 -->
				<view class="form-item" @click="goToAddress">
					<view class="label">服务地区</view>
					<view class="input-like" :class="{placeholder: !selectedAddress}">
						{{selectedAddress || '请选择服务地区'}}
					</view>
					<image src="/static/home/ic_arrow_right.png" class="arrow-icon"></image>
				</view>

				<!-- 详细描述 -->
				<view class=" form-items">
					<view class=" labels">详细描述</view>
					<textarea class="textarea" v-model="formData.description" placeholder="请输入详细描述"
						maxlength="500"></textarea>
				</view>
			</view>

			<!-- 第二步：详细信息 -->
			<view class="form-container" v-if="currentStep === 2">
				<!-- 联系电话 -->
				<view class="form-item">
					<view class="label">联系电话</view>
					<input class="input" v-model="formData.mobile" type="number" placeholder="请输入联系电话" />
				</view>

				<!-- 营业时间 -->
				<view class="form-item">
					<view class="label">营业时间</view>
					<input class="input" v-model="formData.business_hours" placeholder="请输入营业时间" />
				</view>

				<!-- 最低价格 -->
				<view class="form-item">
					<view class="label">最低价格</view>
					<input class="input" v-model="formData.min_price" type="number" placeholder="请输入最低价格" />
				</view>

				<!-- 消费情况 -->
				<view class="form-item">
					<view class="label">消费情况</view>
					<input class="input" v-model="formData.consumption_situation" placeholder="1p 500 2p800 包夜2000" />
				</view>

				<!-- 详细地址 -->
				<view class="form-item">
					<view class="label">详细地址</view>
					<input class="input" v-model="formData.address" placeholder="请输入详细地址" />
				</view>

				<!-- 备用号码 -->
				<view class="form-item">
					<view class="label">备用联系电话</view>
					<input class="input" v-model="formData.standby_mobile" type="number" placeholder="请输入备用联系电话" />
				</view>

				<!-- 图片上传 -->
				<view class="form-items">
					<view class="label">上传店铺照片</view>
					<text class="add-text ">（温馨提示：请上传门店外部，内部环境照片，技师照片，如涉及店名、门牌、个人信息、请打码处理）</text>
					<view class="image-upload m-t-30">
						<view class="image-list">
							<view class="image-item" v-for="(item, index) in formData.image" :key="index">
								<image :src="getImageUrl(item)" class="uploaded-image" mode="aspectFill"></image>
								<view class="delete-btn" @click="deleteImage(index)">×</view>
							</view>
							<view class="add-image-btn " @click="chooseImage" v-if="formData.image.length < 9">
								<image src="/static/home/ic_photo_add.png" class="add-icon"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<view class="btn-container" v-if="currentStep === 1">
				<view class="next-btn" @click="nextStep">
					<text class="btn-text">下一步</text>
				</view>
			</view>
			<view class="btn-container" v-if="currentStep === 2">
				<view class="prev-btn" @click="prevStep">
					<text class="btn-text">上一步</text>
				</view>
				<view class="submit-btn" @click="submitAuth">
					<text class="submit-text">提交认证</text>
				</view>
			</view>
		</view>

		<!-- 资源类型选择弹窗 -->
		<view class="resource-modal" v-if="showResourceModal" @click="hideResourceTypeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择资源类型</text>
					<text class="close-btn" @click="hideResourceTypeModal">×</text>
				</view>
				<view class="modal-body">
					<view class="resource-list">
						<view class="resource-item" v-for="(item, index) in resourceTypeList" :key="index"
							@click="selectResourceType(item)">
							<text class="resource-name">{{item.name}}</text>
							<image v-if="formData.resource_type === item.id" src="/static/home/ic_like_select.png"
								class="check-icon"></image>
						</view>
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
				currentStep: 1, // 当前步骤
				formData: {
					name: '', // 茶铺名称
					num: '', // 妹纸数量
					age: '', // 妹子年龄
					service_project: '', // 服务项目
					resource_type: 0, // 资源类型ID
					province_id: '', // 省份ID
					city_id: '', // 城市ID
					area_id: '', // 地区ID
					address: '', // 详细地址
					mobile: '', // 联系电话
					standby_mobile: '', // 备用号码
					business_hours: '', // 营业时间
					min_price: '', // 最低价格
					consumption_situation: '', // 消费情况
					description: '', // 详细描述
					image: [], // 图片数组
					loufeng_type: 2 // 楼凤类型：2表示茶铺
				},
				resourceTypeList: [], // 资源类型列表
				showResourceModal: false, // 是否显示资源类型弹窗
				selectedResourceType: '', // 选中的资源类型名称
				selectedAddress: '', // 选中的地址
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
			const addressData = uni.getStorageSync('shopAuthSelectedAddress');
			if (addressData) {
				this.selectedAddress = addressData.fullAddress;
				this.formData.province_id = addressData.province_id;
				this.formData.city_id = addressData.city_id;
				this.formData.area_id = addressData.area_id;
				// 清除缓存
				uni.removeStorageSync('shopAuthSelectedAddress');
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
					url: '/pages/auth-address/auth-address?from=shopAuth&level=0'
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
								const imageUrl = await that.uploadImage(res.tempFilePaths[i]);
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

			// 获取图片完整URL
			getImageUrl(imageUrl) {
				// 如果已经是完整URL，直接返回
				if (imageUrl.startsWith('http')) {
					return imageUrl;
				}
				// 否则拼接服务器地址
				return 'http://103.43.71.158' + imageUrl;
			},

			// 删除图片
			deleteImage(index) {
				this.formData.image.splice(index, 1);
			},

			// 下一步
			nextStep() {
				// 第一步表单验证
				if (!this.formData.name) {
					uni.showToast({
						title: '请输入茶铺名称',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.num) {
					uni.showToast({
						title: '请输入妹纸数量',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.age) {
					uni.showToast({
						title: '请输入妹子年龄',
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
				if (!this.formData.description) {
					uni.showToast({
						title: '请输入详细描述',
						icon: 'none'
					});
					return;
				}
				this.currentStep = 2;
			},

			// 上一步
			prevStep() {
				this.currentStep = 1;
			},

			// 提交认证
			submitAuth() {

				// 第二步表单验证
				if (!this.formData.mobile) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.business_hours) {
					uni.showToast({
						title: '请输入营业时间',
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
				if (!this.formData.address) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					});
					return;
				}
				if (this.formData.image.length === 0) {
					uni.showToast({
						title: '请上传图片',
						icon: 'none'
					});
					return;
				}

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
					loufeng_type: 2, // 茶铺认证
					// 茶铺认证特有参数
					business_hours: this.formData.business_hours,
					resource_type: parseInt(this.formData.resource_type),
					num: parseInt(this.formData.num),
					name: this.formData.name,
					standby_mobile: this.formData.standby_mobile || '',
					description: this.formData.description,
					address: this.formData.address
				};

				getApp().getData('api/loufeng/auth', postData, function(res) {
					if (res.code == 403) {
						// 提交成功，跳转到订单页面进行支付
						uni.showToast({
							title: res.msg || '提交成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/order/order'
							});
						}, 1000);
					}else {
						uni.showToast({
							title: res.msg || '提交失败',
							icon: 'none'
						});
					}
				});
			},

			// 创建认证订单
			createAuthOrder() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (!userInfo || !userInfo.token) {
					return;
				}

				var postData = {
					token: userInfo.token,
					type: 'normal',
					// info_id: 1,
					amount: that.authInfo.more // 茶铺认证金额
				};

				getApp().getData('api/order/create', postData, function(res) {
					if (res.code == 200 && res.data && res.data.order_id) {
						that.payAuthOrder(res.data.order_id);
					} else {
						uni.showToast({
							title: res.msg || '创建订单失败',
							icon: 'none'
						});
					}
				});
			},

			// 支付认证订单
			payAuthOrder(orderId) {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (!userInfo || !userInfo.token) {
					return;
				}

				var postData = {
					token: userInfo.token,
					id: orderId,
					paytype: 0,
					type: 'normal'
				};

				getApp().getData('api/order/pay', postData, function(res) {
					if (res.code == 200) {
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else if (res.code == 201) {
						// 余额不足，使用第三方支付
						that.performAuthPayment(orderId, res.data);
					} else {
						uni.showToast({
							title: res.msg || '支付失败',
							icon: 'none'
						});
					}
				});
			},

			// 执行第三方支付
			performAuthPayment(orderId, paymentData) {
				var that = this;
				if (paymentData.pay_type === 'wxpay') {
					// 微信支付
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: paymentData.timeStamp,
						nonceStr: paymentData.nonceStr,
						package: paymentData.package,
						signType: paymentData.signType,
						paySign: paymentData.paySign,
						success: function(res) {
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						},
						fail: function(err) {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
						}
					});
				} else if (paymentData.pay_type === 'alipay') {
					// 支付宝支付
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: paymentData.orderInfo,
						success: function(res) {
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						},
						fail: function(err) {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
						}
					});
				}
			}
		}
	};
</script>

<style scoped>
	.shop-auth-page {
		min-height: 100vh;
		background-color: #fff;
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
		font-weight: bold;
		color: #333;
	}

	/* 步骤指示器 */
	.step-indicator {
		position: fixed;
		top: 88rpx;
		left: 0;
		right: 0;
		height: 120rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 998;
		border-bottom: 1rpx solid #eee;
	}

	.step-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.step-number {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: #ddd;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
	}

	.step-item.active .step-number {
		background-color: #fd2450;
		color: #fff;
	}

	.step-text {
		font-size: 24rpx;
		color: #999;
	}

	.step-item.active .step-text {
		color: #fd2450;
	}

	.step-line {
		width: 120rpx;
		height: 4rpx;
		background-color: #ddd;
		margin: 0 40rpx;
	}

	.step-line.active {
		background-color: #fd2450;
	}

	/* 内容区域 */
	.content {
		padding-top: 208rpx;
		padding-bottom: 120rpx;
		height: calc(100vh - 328rpx);
	}

	.form-container {
		padding: 40rpx;
		background-color: #fff;
	}


	.form-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 30rpx 40rpx;
		margin-bottom: 20rpx;
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
	}

	.input-like {
		flex: 1;
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 0 20rpx 0;
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
	}

	/* 图片上传 */
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
		border: 2rpx dashed #ddd;
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
		color: #fd264c;
	}

	/* 底部按钮 */
	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 30rpx 40rpx;
	}

	.btn-container {
		display: flex;
		gap: 20rpx;
	}

	.next-btn {
		width: 630rpx;
		margin: 0 auto;
		height: 88rpx;
		background: #fd264c;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.prev-btn {
		flex: 1;
		height: 88rpx;
		background-color: #999;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit-btn {
		flex: 2;
		height: 88rpx;
		background: #fd264c;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.btn-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	.submit-text {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
	}

	/* 资源类型弹窗 */
	.resource-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
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
		padding: 40rpx;
		border-bottom: 1rpx solid #eee;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		font-size: 48rpx;
		color: #999;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-body {
		max-height: 60vh;
		overflow-y: auto;
	}

	.resource-list {
		padding: 20rpx 0;
	}

	.resource-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 40rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.resource-name {
		font-size: 32rpx;
		color: #333;
	}

	.check-icon {
		width: 40rpx;
		height: 40rpx;
	}
</style>