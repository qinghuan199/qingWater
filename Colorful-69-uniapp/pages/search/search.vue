<template>
	<view class="search-page">
		<!-- 搜索头部 -->
		<view class="search-header">
			<view class="search-input-container">
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="请输入" 
					placeholder-style="color: #999;"
					@input="onSearchInput"
					@confirm="onSearch"
					focus
				/>
			</view>
			<view class="cancel-btn" @click="goBack">
				<text class="cancel-text">取消</text>
			</view>
		</view>
		
		<!-- 搜索结果 -->
		<view class="search-content">
			<view v-if="searchKeyword === ''" class="search-tips">
				<text class="tips-text">请输入关键词进行搜索</text>
			</view>
			
			<view v-else-if="searchResults.length === 0" class="no-result">
				<text class="no-result-text">暂无搜索结果</text>
			</view>
			
			<view v-else class="result-list">
				<view 
					v-for="(item, index) in searchResults" 
					:key="index" 
					class="result-item"
					@click="onResultClick(item)"
				>
					<text class="result-title">{{ item.title }}</text>
					<text class="result-desc">{{ item.description }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			searchResults: []
		}
	},
	methods: {
		// 返回首页
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		
		// 搜索输入
		onSearchInput(e) {
			this.searchKeyword = e.detail.value;
			if (this.searchKeyword.trim() !== '') {
				this.performSearch();
			} else {
				this.searchResults = [];
			}
		},
		
		// 执行搜索
		onSearch() {
			if (this.searchKeyword.trim() !== '') {
				this.performSearch();
			}
		},
		
		// 模拟搜索功能
		performSearch() {
			// 这里可以调用实际的搜索API
			// 目前使用模拟数据
			const mockResults = [
				{
					id: 1,
					title: '搜索结果1',
					description: '这是搜索结果的描述信息1'
				},
				{
					id: 2,
					title: '搜索结果2',
					description: '这是搜索结果的描述信息2'
				},
				{
					id: 3,
					title: '搜索结果3',
					description: '这是搜索结果的描述信息3'
				}
			];
			
			// 模拟搜索过滤
			this.searchResults = mockResults.filter(item => 
				item.title.includes(this.searchKeyword) || 
				item.description.includes(this.searchKeyword)
			);
		},
		
		// 点击搜索结果
		onResultClick(item) {
			console.log('点击了搜索结果:', item);
			// 这里可以跳转到详情页面或执行其他操作
			uni.showToast({
				title: '点击了: ' + item.title,
				icon: 'none'
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.search-page {
	background-color: #fff;
	height: 100vh;
}

.search-header {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #eeeeee;
	border-bottom: 1rpx solid #eeeeee;
}

.search-input-container {
	flex: 1;
	margin-right: 60rpx;
}

.search-input {
	width: 100%;
	height: 70rpx;
	background-color: #fff;
	border-radius: 35rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	border: 1rpx solid #fff;
}

.cancel-btn {
	padding: 10rpx 20rpx;
}

.cancel-text {
	color: #ff4757;
	font-size: 28rpx;
	font-weight: 500;
}

.search-content {
	padding: 20rpx;
	flex: 1;
}

.search-tips {
	text-align: center;
	padding: 100rpx 0;
}

.tips-text {
	color: #999;
	font-size: 28rpx;
}

.no-result {
	text-align: center;
	padding: 100rpx 0;
}

.no-result-text {
	color: #999;
	font-size: 28rpx;
}

.result-list {
	padding-top: 20rpx;
}

.result-item {
	padding: 30rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	cursor: pointer;
}

.result-item:hover {
	background-color: #f8f9fa;
}

.result-title {
	display: block;
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 10rpx;
}

.result-desc {
	display: block;
	font-size: 26rpx;
	color: #666;
	line-height: 1.4;
}
</style>