<template>
	<view class="search-container">
		<view class="search-box" @click="handleSearch">
			<text class="search-placeholder">{{ placeholder }}</text>
			<image class="search-icon" :src="iconSrc" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SearchBox',
	props: {
		// 搜索框占位符文本
		placeholder: {
			type: String,
			default: '搜索内容...'
		},
		// 搜索图标路径
		iconSrc: {
			type: String,
			default: '/static/home/ic_search.png'
		}
	},
	methods: {
		// 处理搜索点击事件
		handleSearch() {
			// 触发父组件的搜索事件
			this.$emit('search');
		}
	}
}
</script>

<style lang="scss" scoped>
.search-container {
	padding: 20rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.search-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #f8f9fa;
	border-radius: 30rpx;
	padding: 0 20rpx;
	height: 70rpx;
	transition: all 0.3s;
}

.search-box:active {
	background-color: #e9ecef;
	transform: scale(0.98);
}

.search-placeholder {
	flex: 1;
	font-size: 28rpx;
	color: #999;
}

.search-icon {
	width: 40rpx;
	height: 40rpx;
	flex-shrink: 0;
}
</style>