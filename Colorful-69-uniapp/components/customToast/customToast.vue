<template>
	<view>
		<u-popup v-model="show" mode="center" border-radius="20" width="500rpx" height="300rpx" @click="hideToast">
			<view class="toast-content u-flex-y u-flex-items-center u-flex-center" @click.stop>
				<text class="toast-text">{{message}}</text>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "customToast",
		data() {
			return {
				show: false,
				message: ''
			};
		},
		methods: {
			showToast(msg) {
				this.message = msg;
				this.show = true;
			},
			hideToast() {
				this.show = false;
			}
		}
	}
</script>

<style scoped>
	.toast-content {
		background-color: #fff;
		border-radius: 20rpx;
		height: 100%;
		width: 100%;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}
	
	.toast-text {
		font-size: 32rpx;
		color: #333;
		text-align: center;
		padding: 0 40rpx;
		line-height: 1.5;
	}
</style>