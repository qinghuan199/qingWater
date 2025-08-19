<template>
	<view>
		<u-popup :show="modalForm.show" @close="modalForm.show = false" mode="center" bgColor="transparent" >
			<view class="modelBg u-flex-y u-flex-items-center u-flex-center"
				:class="modalForm.bgImg?'modelBgTrue':'modelBgFalse'">
				<!-- <image :src="modalForm.img" class="width-100 m-t-30" mode="widthFix"></image> -->
				<!-- <view class="u-flex-y   u-flex-center u-flex-item-center   "> -->
				<view class=" text-center font-black p-20-30 font-size-13 ">{{modalForm.content}}</view>
				<!-- </view> -->
				<!-- 确认按钮 -->
				<u-button v-if="modalForm.isButton" text="Confirm" :plain="true" :hairline="false" color="#fff"
					@click="modalForm.show = false;onclickBut()" class=" font-bold font-size-12 height-80 width-300   "
					style="position: absolute;bottom: -20rpx;left: 50%;transform: translate(-50%,-50%);"
					:customStyle="{borderWidth:'0rpx',borderRadius:'20rpx',backgroundColor: modalForm.bgImg ?'#4746b7' :'#4746b7',}"></u-button>
			</view>
		</u-popup>



	</view>
</template>

<script>
	// 参数
	// modalForm: {
	// 	show: true,  
	// 	error: 'Error',
	// 	color: '#D40119',
	// 	bgImg: "/static/9-register_error.png",
	// 	content: 'Crest Resort is a luxury,ecoYdesigned resort ideal for those seeking',
	// id:,
	// isButton:"",
	// }
	export default {
		name: "selfModal",
		data() {
			return {

			};

		},
		props: {
			modalForm: {
				type: Object,
				default: () => {
					bgImg: false
				}

			},

			colseTime: {
				type: Number,
				default: 2500
			}

		},
		watch: {
			'modalForm.show'(oldV, newV) {
				if (oldV == true) {
					setTimeout(() => {
						this.modalForm.show = false
					}, this.colseTime)
				}
			},
			// 'modalForm.bgImg'(oldV, newV) {
			// 	this.modalForm.bgImg = newV
			// }
		},
		methods: {
			onLogout() {
				getApp().removeCache('isLogin');
				getApp().removeCache('userInfo');
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			onclickBut() {
				this.$emit('onBut', this.modalForm.id)
			}
		},
	}
</script>

<style>
	::v-deep.u-popup__content {
		background-color: transparent;
	}

	::v-deep .u-modal__content {
		padding: 0 !important;
	}

	::v-deep .u-button--plain {
		background-color: transparent;
	}

	.modelBg {
	
		background-repeat: no-repeat;
		background-color:#dddcdc;
		border-radius: 30rpx;
		position: relative;
		color: #fff;
		border-radius: 30rpx;
	}

	.modelBgTrue {
		/* background-image: url('/static/pro/Profitero-Logo-03.png'); */
		/* color: #2ae845; */
	}

	.modelBgFalse {
		/* background-image: url('/static/pro/Profitero-Logo-03.png'); */
		/* color: red; */
	}



	/* 退出弹窗 */
	::v-deep .u-modal__content {
		padding: 0 !important;
	}

	::v-deep .u-button--plain {
		background-color: transparent;
	}

	::v-deep.u-modal {
		background-color:none;
		border-radius: 40rpx;
	}

	::v-deep.u-modal__button-group__wrapper--confirm {
		background-color: #000;
	}

	::v-deep.u-modal__button-group__wrapper--cancel {
		background-color: #4b4b4b;
		border: none;

	}
</style>