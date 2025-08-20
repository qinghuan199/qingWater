<template>
	<view>
		<u-modal :show="logoutModalForm.show" :showCancelButton="false" :showConfirmButton="false" cancelColor="#fff"
			confirmColor="#fff" confirmText="Logout Now" cancelText="Cancel" :closeOnClickOverlay="true"
			@close="logoutModalForm.show = false" @cancel="logoutModalForm.show = false" @confirm="onLogout">

			<view class="font-white  u-flex-y u-flex-center u-flex-items-center  p-0-0" style="position: relative; color: #fff;	height: 100%;
		width: 690rpx;">
		<view class="height-50">
			
		</view>
				<image src="/static/pro/Profitero-Logo-03.png" class="width-350 " mode="widthFix"></image>
				<h2 class="m-20-0 p-t-20">Profitero</h2>
				<view class="p-b-40">Log out the account?</view>
				<view class="u-flex u-flex-items-center u-flex-around width-full p-40-0">
					<view class="font-white text-center height-100 radius-12" @click="logoutModalForm.show = false"
						style="background-color: #4a4a4a; width: 45%;line-height: 100rpx;">
						Cancel</view>
					<view class="font-white text-center height-100 radius-12" @click="onLogout"
						style="background-color: #237aff; width: 45%;line-height: 100rpx;"> Logout Now
					</view>
				</view>
			</view>
		</u-modal>
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

			logoutModalForm: {
				type: Object,
				default: () => {

				}

			},

			colseTime: {
				type: Number,
				default: 2500
			}

		},
		watch: {
			// 'modalForm.show'(oldV, newV) {
			// 	if (oldV == true) {
			// 		setTimeout(() => {
			// 			this.modalForm.show = false
			// 		}, this.colseTime)
			// 	}
			// },
			// 'modalForm.bgImg'(oldV, newV) {
			// 	this.modalForm.bgImg = newV
			// }
		},
		methods: {
			onLogout() {
				getApp().removeCache('isLogin');
				getApp().removeCache('userInfo');
				uni.reLaunch({
					url: '/pages/index/index'
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
		/* background: linear-gradient(to right, #5a1e55, #ec8b3b); */


		/* background-size: 15% auto, 25% auto, 100% 100%; */
		/* background-repeat: no-repeat, no-repeat; */
		/* background-position: 30rpx center, -2px center, center center; */

		background-repeat: no-repeat;
		background-size: 80% auto;
		background-position: center 50rpx;

		/* 
		border-top-left-radius: 100rpx;
		border-top-right-radius: 50rpx;
		border-bottom-right-radius: 100rpx;
		border-bottom-left-radius: 50rpx; */
		background-color: rgba(67, 67, 67, .9);
		/* border: 3rpx solid #e32626; */
		border-radius: 30rpx;
		height: 340rpx;
		width: 440rpx;
		position: relative;
		color: #fff;
	}

	.modelBgTrue {
		/* background-image: url('/static/SENDd/Daasity-Logo-02.png'); */
		/* color: #2ae845; */
	}

	.modelBgFalse {
		/* background-image: url('/static/SENDd/Daasity-Logo-02.png'); */
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
		background-color: rgba(51, 51, 51, .9);
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