<template>
	<view class="loufeng-item" @click="goToLoufengDetail">
		<!-- 左侧信息 -->
		<view class="left-info">
			<!-- 省市区标签 -->
			<view class="location-tag">
				{{item.title}}
			</view>
			<!-- 详细信息 -->
			<view class="info-list">
				<view class="info-item">
					<text class="info-label">类型：</text>
					<view class="info-value">{{item.type}}</view>
				</view>
				<view class="info-item">
					<text class="info-label">所在地区：</text>
					<view class="info-value">{{item.province.name}}
						{{item.city.name}}{{item.area.name}}
					</view>
				</view>
				<view class="info-item">
					<text class="info-label">服务项目：</text>
					<view class="info-value">{{item.service_project}}</view>
				</view>
				<view class="info-item">
					<text class="info-label">消费情况：</text>
					<view class="info-value">{{item.consumption_situation}}</view>
				</view>
			</view>
		</view>

		<!-- 右侧图片 -->
		<view class="right-image">
			<image class="item-image"
				:src="item.image && item.image.length > 0 ? item.image[0] : '/static/icon/logo.png'"
				mode="aspectFill"></image>
			<!-- 热门标识 -->
			<image v-if="item.is_hot === 1" class="hot-icon" src="/static/home/ic_girl_tips.png"
				mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				required: true
			}
		},
		methods: {
			goToLoufengDetail() {
				uni.navigateTo({
					url: `/pages/loufeng-detail/loufeng-detail?id=${this.item.id}`
				});
			}
		}
	}
</script>

<style scoped>
	.loufeng-item {
		display: flex;
		background-color: #faf7f2;
		margin-top: 15rpx;
		padding: 40rpx 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.left-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.location-tag {
		background-color: #f4c88f;
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #fff;
		align-self: flex-start;
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.info-label {
		font-size: 26rpx;
		color: #b4b4b4;
		flex-shrink: 0;
		min-width: 120rpx;
	}

	.info-value {
		font-size: 26rpx;
		color: #b4b4b4;
		flex: 1;
		white-space: nowrap;
	}

	.right-image {
		margin-top: 50rpx;
		width: 150rpx;
		height: 150rpx;
		flex-shrink: 0;
	}

	.item-image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.hot-icon {
		position: absolute;
		top: 0;
		right: 0;
		width: 80rpx;
		height: 80rpx;
	}
</style>