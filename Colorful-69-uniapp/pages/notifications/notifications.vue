<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<view class="card"></view>
		<view style="margin-top: 30rpx;">
			<view class="title">{{data.title}}</view>
			<rich-text :nodes="data.content"></rich-text>
			<view class="time">{{data.create_time}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(option){
			this.data = JSON.parse(decodeURIComponent(option.item))
			console.log(this.data);
		},
		data() {
			return {
				data: {}
			}
		}
	}
</script>

<style>
	.content {
		background-color: #b5c2d6;
		height: calc(100vh - 45px);
		padding: 20px;
	}
	
	.card {
		width: 90vw;
		height: 300rpx;
		/* background-image: url(/static/Icon-026.png); */
		border-radius: 15px;
		margin: 0 auto;
	}
	
	.title {
		font-weight: 700;
		margin-bottom: 20rpx;
	}
	
	.time {
		font-size: 12px;
		color: #919191;
		margin-top: 3px;
		margin-top: 30rpx;
	}
</style>