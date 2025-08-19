<template>
	<view>
		<view class="fl_between width-full p-20  " style="background-color: #f9f9f9;border: 2rpx solid #eaeaea;">
			<view class="fl_center">
				<u-checkbox-group @change="checkboxChange" v-if="aaf">
					<u-checkbox v-model="checked" label="" name="confirm"></u-checkbox>
				</u-checkbox-group>
				<image :src="src" mode="aspectFit" v-else class="icon-80" style=""></image>
				<!-- <view v-else class="img-to-mask icon-90" :style="{backgroundColor:'red', maskImage: `url(${src})`}">
					
				</view> -->
				<view v-if="aaf" class="width-200 font-size-12 font-black m-l-20" style="">{{text}}
				</view>
				<view v-else class="width-200 font-size-12 font-black m-l-20" style="">{{text}}
				</view>
			</view>

			<view class="fl_clum_center m-t-10 ">
				<view class="text-center">
					<image src="/static/pro/99.png" class="icon-80 "></image>
					<view class="font-size-10" style="color: #8c8c8c;">
						reCAPTCHA
					</view>
				</view>
				<view class=" text_center font-size-10 m-t-10" style="color: #8c8c8c;">
					Privacy - Terms
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "verify",
		data() {
			return {
				value: 0,
				disabled: false,
				checked: [],
				aaf: true,
				src: '/static/pro/ff1.gif',
				text:'Confirm that you are a real person'
			}
		},
		onShow() {
			// if(!this.aaf) {
			// 	setTimeout(() => {
			// 	    this.autoNavigate();
			// 	}, 3000); 
			// }
		},
		onLoad() {

			// setTimeout(() => {
			//     this.autoNavigate();
			// }, 7600); 

			// setTimeout(() => {
			//     this.aaf = false;
			// }, 100); 
			setTimeout(() => {
				this.src = '/static/pro/ccv.gif';
			}, 5000);

		},
		methods: {
			autoNavigate() {
				uni.navigateTo({
					url: '/pages/welcome/welcome'
				});
			},
			checkboxChange(e) {

				console.log(e, 333)
				if (e.length) {
					this.aaf = false
					setTimeout(() => {
						this.src = '/static/pro/ccv.gif';
						this.text='Verifying...'
					}, 1000);
					setTimeout(() => {
						this.src = '/static/pro/success.png';
						this.text='Success!'
					}, 3000);
					// setTimeout(() => {
					//     uni.navigateTo({
					//     	url: '/pages/welcome/welcome'
					//     })
					// }, 4000); 
				}
			},
			changing(e) {
				this.value = e.detail.value
			},
		}
	}
</script>


<style lang="scss" scoped>
	page {
		min-height: 100vh;
		 

	}
 

	.slider-container {
		position: relative;
		border: 2rpx solid #C0C0C0;
		height: 90rpx;
		border-radius: 4rpx;
		overflow: hidden;
		width: 90%;
		margin-left: 5%;
		margin-top: 40vh;

		::v-deep.uni-slider-thumb {
			box-shadow: none;
		}

		.slider-block {
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			color: #787878;
			border-right: 2rpx solid #cccccc;
			line-height: 80rpx;
			background-color: #fff;
			text-align: center;
			max-width: 80rpx;
		}

		.inline-logo {
			vertical-align: middle;
			/* 使图片与文字垂直居中对齐 */
			width: auto;
			/* 根据需要调整宽度 */
			height: auto;
			/* 根据需要调整高度 */
			/* 添加更多样式如果需要 */
		}

		.front {
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			opacity: 0.8;
		}
	}
</style>