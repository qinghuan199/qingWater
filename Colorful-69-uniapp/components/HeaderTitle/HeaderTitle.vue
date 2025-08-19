<template>
	<view class="">
		<view class=" content-box">
			<view class="header u-flex-items-center">
				<view class="u-flex-x u-flex-items-center" @click="back">
					<u-icon name="arrow-left" color="#237aff" size="24" bold></u-icon>
				</view>
				<view class="u-flex-x u-flex-items-center btns " style="justify-content: center;">
					<text class="font-size-18 font-bold" style="white-space: nowrap;">{{title}}</text>
				</view>

				<view class="u-flex-x u-flex-items-center" style="opacity: 0;">
					<u-icon name="arrow-left" color="#237aff" size="24" bold></u-icon>
				</view>
			</view>
		</view>
		<view class="height-140">
		</view>
	</view>




</template>

<script>
	export default {
		name: "Headers",
		data() {
			return {
				popS: {
					show: false,
					isEn: uni.getLocale() == 'en' ? true : false,
				},
			};
		},
		props: ['title'],
		methods: {
			openWin(path, param) {
				uni.navigateTo({
					url: '../' + path + '/' + path + '?' + param
				});
			},
			closePop() {
				this.popS.show = false
			},
			showPopS() {
				// console.log('this.$refs.openUserPop', this.$refs.openUserPop.open())
				this.popS.show = true
			},
			back() {
				let canNavBack = getCurrentPages()
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack()
				} else {
					history.back();
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.content-box {
		// background-image: url('../../static/gof/bg_title.png') !important;
		background-image: linear-gradient(to bottom, #dde2ff, #edefff);
		// height: 280rpx;
		width: 100%;
		position: fixed;
		display: flex;
		z-index: 99;
		justify-content: center;
		align-items: center;
		top: -10rpx;

	}

	.header {
		width: 100%;
		padding: 45rpx 15rpx;
		background-color: #0a172b;
		display: flex;
		justify-content: space-between;
		// position: fixed;
		color: #fff;
		// border-radius: 12rpx;
		// box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, .1);
		// background-image: url('../../static/Semnexus-34.png');
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
	}

	.btns {
		width: 300rpx !important;
	}

	::v-deep .uni-navbar--border {
		border-bottom-color: transparent;
	}

	::v-deep.u-modal__content {
		padding: 12px 25px 0px 25px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		border: 3px solid #5bf9b5;
		// background-image: url('../../static/123.png'); 
		background-repeat: no-repeat;
		background-size: 107% 124%;
		background-position: center;

	}

	.brns {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.colis {
		color: #000 !important;
		font-weight: 700;
	}
</style>