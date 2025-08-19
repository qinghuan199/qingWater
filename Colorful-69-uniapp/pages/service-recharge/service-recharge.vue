<template>
	<view class="page-container">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="nav-back" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="nav-title">{{ productInfo.name || '服务充值' }}</text>
		</view>



		<!-- 动态表单 -->
		<view class="form-section" v-if="productInfo.fields">
			<view v-for="(field, index) in productInfo.fields" :key="index" class="input-group">
				<!-- 标签和备注 -->
				<view class="input-header">
					<view v-if="field.field_type === 'image'" class="input-wrapper">
						<image class="field-logo-left" @click="selectImage(field.field_name)"
							:src="formData[field.field_name + '_display'] || field.field_logo" mode="aspectFit"></image>
					</view>
					<text v-else class="input-label amount-label"
						:class="{ 'amount-label': field.field_type === 'number' }">{{ field.field_label }}</text>
					<text v-if="field.remark" class="input-remark">{{ field.remark }}</text>
				</view>

				<!-- 文本输入框 -->
				<view v-if="field.field_type === 'text'" class="input-wrapper">
					<image class="field-logo-left"
						:src="field.field_logo ? field.field_logo : '/static/home/ic_default_loading.png'"
						mode="aspectFit"></image>
					<input class="input-field" v-model="formData[field.field_name]"
						:placeholder="'请输入' + field.field_label" />
				</view>

				<!-- 数字输入框 -->
				<view v-if="field.field_type === 'number'" class="input-wrapper">
					<image class="field-logo-left"
						:src="field.field_logo ? field.field_logo : '/static/home/ic_default_loading.png'"
						mode="aspectFit"></image>
					<input class="input-field" v-model="formData[field.field_name]"
						:placeholder="'请输入' + field.field_label" type="number" />
				</view>

				<!-- 地区选择 -->
				<view v-if="field.field_type === 'select' && field.options === 'area'" class="input-wrapper">
					<image class="field-logo-left"
						:src="field.field_logo ? field.field_logo : '/static/home/ic_default_loading.png'"
						mode="aspectFit"></image>
					<view class="select-field" @click="selectArea(field.field_name)">
						<text class="select-text">{{ formData[field.field_name] || '请选择' + field.field_label }}</text>
					</view>
				</view>


				<!-- 日期选择 -->
				<view v-if="field.field_type === 'date'" class="input-wrapper" @click="selectDate(field.field_name)">
					<image class="field-logo-left"
						:src="field.field_logo ? field.field_logo : '/static/home/ic_default_loading.png'"
						mode="aspectFit"></image>
					<view class="select-field">
						<text class="select-text">{{ formData[field.field_name] || '请选择' + field.field_label }}</text>
					</view>
				</view>

				<!-- 单选框 -->
				<view v-if="field.field_type === 'radio'" class="radio-group">
					<view v-for="(option, optionIndex) in field.options.split('|')" :key="optionIndex"
						class="radio-item" :class="{ active: formData[field.field_name] === option }"
						@click="selectRadio(field.field_name, option)">
						<text class="radio-text">{{ option }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 产品标题和描述 -->
		<view class="product-header">
			<view class="product-description" v-if="productInfo.description" v-html="productInfo.description"></view>
		</view>
		<!-- 最优报价 -->
		<view class="price-section">
			<view class="p-10-0 amount-label font-bold font-size-16 ">
				最优报价
			</view>
			<view class="payment-options">
				<view class="payment-option" :class="{ active: selectedPayment === 'balance' }"
					@click="selectPayment('balance')">
					<image class="payment-icon"
						:src="selectedPayment === 'balance' ? '/static/home/ic_recharge_pay_select.png' : '/static/home/ic_recharge_pay_normal.png'"
						mode="aspectFit"></image>
					<text class="option-text">余额支付</text>
				</view>
				<view class="payment-option" :class="{ active: selectedPayment === 'alipay' }"
					@click="selectPayment('alipay')">
					<image class="payment-icon"
						:src="selectedPayment === 'alipay' ? '/static/home/ic_recharge_pay_select.png' : '/static/home/ic_recharge_pay_normal.png'"
						mode="aspectFit"></image>
					<text class="option-text">支付宝支付</text>
				</view>
			</view>
		</view>


		<!-- 充值按钮 -->
		<view class="recharge-section">
			<view class="recharge-btn" @click="submitRecharge">
				<text class="recharge-text">充值</text>
			</view>
			<view class="recharge-tip">
				<image class="tip-icon" src="/static/home/ic_tips.png" mode="aspectFit"></image>
				<text class="tip-text">请确认充值账号准确无误，提交后不支持退款！</text>
			</view>
		</view>

		<!-- 日期选择器 -->
		<min-picker v-if="showDatePicker" :show="showDatePicker" @sure="onDateConfirm"
			@cancel="showDatePicker = false"></min-picker>
	</view>
</template>

<script>
	import minPicker from '@/components/min-picker/min-picker.vue';

	export default {
		components: {
			minPicker
		},
		data() {
			return {
				productId: '',
				productInfo: {},
				formData: {},
				selectedArea: '',
				selectedPayment: 'balance',
				showDatePicker: false,
				currentDateField: '',
			}
		},
		onLoad(options) {
			this.productId = options.type || options.id || '';
			if (this.productId) {
				this.getProductInfo();
			};
		},
		onShow() {},
		methods: {
			// 获取产品信息
			getProductInfo() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				uni.request({
					url: getApp().globalData.baseUrl + 'api/product/recharge/info',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': userInfo.token
					},
					data: {
						id: that.productId
					},
					success: function(res) {
						if (res.data.code === 200) {
							that.productInfo = res.data.data;
							// 初始化表单数据
							that.initFormData();
						} else {
							uni.showToast({
								title: res.data.msg || '获取产品信息失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						console.error('获取产品信息失败:', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},
			// 初始化表单数据
			initFormData() {
				if (this.productInfo.fields) {
					this.productInfo.fields.forEach(field => {
						this.$set(this.formData, field.field_name, '');
					});
				}
			},
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			// 处理单选框选择
			selectRadio(fieldName, value) {
				this.$set(this.formData, fieldName, value);
			},
			// 选择地区
			selectArea(fieldName) {
				// 跳转到城市选择页面
				uni.navigateTo({
					url: '/pages/address/address?selectCity=true&fieldName=' + fieldName
				});
			},
			// 选择图片
			selectImage(fieldName) {
				var that = this;
				uni.chooseImage({
					count: 1,
					success: function(res) {
						const tempFilePath = res.tempFilePaths[0];
						// 上传图片
						that.uploadImage(tempFilePath, fieldName);
					}
				});
			},
			// 上传图片
			uploadImage(filePath, fieldName) {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				
				// 显示上传中提示
				uni.showLoading({
					title: '上传中...'
				});
				
				uni.uploadFile({
					url: 'http://103.43.71.158/api/upload/image',
					filePath: filePath,
					name: 'image',
					header: {
						'token': userInfo.token
					},
					success: function(res) {
						uni.hideLoading();
						const data = JSON.parse(res.data);
						console.log('上传结果:', data);
						if (data.code === 200) {
						// 存储相对路径用于提交表单
						that.$set(that.formData, fieldName, data.data);
						// 存储完整URL用于页面显示
						that.$set(that.formData, fieldName + '_display', 'http://103.43.71.158' + data.data);
						uni.showToast({
							title: '上传成功',
							icon: 'success'
						});
						} else {
							uni.showToast({
								title: data.msg || '图片上传失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						uni.hideLoading();
						console.error('上传失败:', err);
						uni.showToast({
							title: '网络错误，上传失败',
							icon: 'none'
						});
					}
				});
			},
			// 选择日期
			selectDate(fieldName) {
				this.currentDateField = fieldName;
				this.showDatePicker = true;
			},
			// 日期选择确认
			onDateConfirm(dateObj) {
				const dateStr =
					`${dateObj.a}-${dateObj.b.toString().padStart(2, '0')}-${dateObj.c.toString().padStart(2, '0')}`;
				this.$set(this.formData, this.currentDateField, dateStr);
				this.showDatePicker = false;
				this.currentDateField = '';

				// 显示选择成功提示
				uni.showToast({
					title: '日期选择成功',
					icon: 'success'
				});
			},
			// 选择支付方式
			selectPayment(type) {
				this.selectedPayment = type;
			},
			// 验证表单
			validateForm() {
				if (!this.productInfo.fields) return false;

				for (let field of this.productInfo.fields) {
					if (field.is_required && !this.formData[field.field_name]) {
						uni.showToast({
							title: `请填写${field.field_label}`,
							icon: 'none'
						});
						return false;
					}

					// 验证规则
					if (field.require_rule && this.formData[field.field_name]) {
						const regex = new RegExp(field.require_rule);
						if (!regex.test(this.formData[field.field_name])) {
							uni.showToast({
								title: `${field.field_label}格式不正确`,
								icon: 'none'
							});
							return false;
						}
					}

					// 验证最小金额
					if (field.field_type === 'number' && field.min_amount > 0) {
						const amount = parseFloat(this.formData[field.field_name]);
						if (amount < field.min_amount) {
							uni.showToast({
								title: `${field.field_label}不能少于${field.min_amount}`,
								icon: 'none'
							});
							return false;
						}
					}
				}
				return true;
			},
			// 充值提交
			submitRecharge() {
				if (!this.validateForm()) {
					return;
				}

				var that = this;
				uni.showLoading({
					title: '提交中...'
				});

				// 先调用创建订单接口
				that.createOrderAPI();
			},
			// 创建订单接口
			createOrderAPI() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/create',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': userInfo.token
					},
					data: JSON.stringify({
						type: 'recharge_product',
						info_id: that.productId,
						fields: that.formData
					}),
					success: function(res) {
						if (res.data.code === 200) {
							// 订单创建成功，调用支付接口
							that.callPayAPI(res.data.data);
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.data.msg || '订单创建失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						uni.hideLoading();
						console.error('订单创建失败:', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},
			// 调用支付接口
			callPayAPI(orderId) {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				uni.request({
					url: getApp().globalData.baseUrl + 'api/order/pay',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': userInfo.token
					},
					data: JSON.stringify({
						type: 'recharge_product',
						id: orderId,
						paytype: that.selectedPayment === 'balance' ? 0 : 2 // 0余额 2支付宝
					}),
					success: function(res) {
						uni.hideLoading();
						if (res.data.code === 200) {
							uni.showToast({
								title: '充值成功',
								icon: 'success'
							});
							// 延迟返回上一页
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						} else {
							uni.showToast({
								title: res.data.msg || '支付失败',
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						uni.hideLoading();
						console.error('支付失败:', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		min-height: 100vh;
		background-color: #fafafa;
	}

	.nav-bar {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.nav-back {
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

	.nav-title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		color: #333;
		margin-right: 60rpx;
	}

	.product-header {
		padding: 30rpx;
		margin-bottom: 20rpx;
		color: #fafafa;
	}

	.product-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #000;
		display: block;
		margin-bottom: 10rpx;
	}

	.product-description {
		font-size: 28rpx;
		color: #000;
		font-weight: bold;
		display: block;
		line-height: 50rpx;
	}

	.form-section {
		background-color: #fafafa;
		padding: 30rpx;
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.input-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.input-label {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.amount-label {
		color: #fd2e41 !important;
	}

	.input-remark {
		font-size: 24rpx;
		color: #fd2e41;
		margin-left: 30rpx;
	}

	.field-logo-left {
		width: 60rpx;
		height: 60rpx;
		flex-shrink: 0;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background-color: #eee;
		gap: 20rpx;
		padding: 10rpx;
		border-radius: 15rpx;
	}



	.input-field {
		flex: 1;
		height: 90rpx;
		border-radius: 10rpx;
		padding: 0 20rpx;
		outline: none;
		font-size: 30rpx;
		color: #333;
		background-color: #eee;
	}

	.select-field {
		flex: 1;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 10rpx;
		padding: 0 20rpx;
		background-color: #eee;
	}

	.select-text {
		font-size: 30rpx;
		color: #333;
	}

	.select-arrow {
		font-size: 30rpx;
		color: #999;
	}

	.image-field {
		flex: 1;
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		border: 2rpx dashed #ddd;
		border-radius: 10rpx;
	}

	.uploaded-image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}

	.image-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.placeholder-text {
		font-size: 28rpx;
		color: #999;
	}

	.radio-group {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.radio-item {
		padding: 30rpx;
		border: 2rpx solid #999;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.radio-item.active {
		border-color: #fd313d;
	}

	.radio-text {
		font-size: 28rpx;
		color: #999;
	}

	.radio-item.active .radio-text {
		color: #fd313d;
	}

	.price-section {
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.price-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.payment-options {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.payment-option {
		display: flex;
		align-items: center;
		padding: 20rpx;
		// border: 2rpx solid #ddd;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.payment-option.active {
		background-color: #fff;
	}

	.payment-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.option-checkbox {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #ddd;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.payment-option.active .option-checkbox {
		border-color: #fc097b;
		background-color: #fc097b;
	}

	.check-icon {
		font-size: 24rpx;
		color: #fff;
		font-weight: bold;
	}

	.option-text {
		font-size: 30rpx;
		color: #333;
	}

	.recharge-section {
		padding: 30rpx;
		margin-top: 40rpx;
	}

	.recharge-btn {
		width: 100%;
		height: 90rpx;
		background: linear-gradient(to bottom, #fc303d 0%, #fc1074 100%);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.recharge-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	.recharge-tip {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.tip-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.tip-text {
		font-size: 28rpx;
		color: #333;
	}
</style>