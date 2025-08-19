<template>
	<view class="content text-center u-flex-center u-flex-y u-flex-items-center ">
		<image class="width-750" style="max-width:1000px" src="/static/system-bg.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		onShow() {
			 
		},
		onLoad() {
			 
		},
		 
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		data() {
			return {
			 
			}
		},
		methods: {}
			 
	}
</script>

<style>
	page {
		color: #999;
		background-color: #F7F5F8;
		min-height: 100vh;
		font-family: SourceSansPro-SemiBold;
		text-align: center;
		font-weight: 600;
		font-size: 28rpx;
	}
	.content { 
		line-height: 1.5;
		min-height: 100vh;
		
	}
	 
</style>
