<template>
	<view class="video-play-page">
		<!-- 头部导航 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image class="back-icon" src="/static/home/ic_common_back.png" mode="aspectFit"></image>
			</view>
			<text class="header-title">视频播放</text>
			<view class="placeholder"></view>
		</view>

		<!-- 视频播放器 -->
		<view class="video-container">
			<video 
				:id="'video-player'" 
				:src="videoUrl" 
				class="video-player" 
				:controls="false"
				:show-center-play-btn="false"
				:show-play-btn="true"
				:show-fullscreen-btn="true"
				:show-progress="false"
				:show-loading="true"
				@timeupdate="onTimeUpdate"
				@loadedmetadata="onLoadedMetadata"
				@play="onPlay"
				@pause="onPause"
				@ended="onEnded"
				@error="onError"
				@click="toggleControls">
			</video>
			
			<!-- 自定义控制栏 -->
			<view class="controls" :class="{ 'show': showControls }">
				<!-- 播放/暂停按钮 -->
				<view class="play-btn" @click="togglePlay">
					<text class="play-icon" v-if="isPlaying">⏸</text>
				<image class="play-icon" v-else src="/static/home/ic_play.png" mode="aspectFit"></image>
				</view>
				
				<!-- 当前时间 -->
				<text class="time-text">{{ formatTime(currentTime) }}</text>
				
				<!-- 进度条 -->
				<view class="progress-container" @click="seekTo">
					<view class="progress-bar">
						<view class="progress-played" :style="{ width: progressPercent + '%' }"></view>
						<view class="progress-thumb" :style="{ left: progressPercent + '%' }" @touchstart="onThumbTouchStart" @touchmove="onThumbTouchMove" @touchend="onThumbTouchEnd"></view>
					</view>
				</view>
				
				<!-- 总时长 -->
				<text class="time-text">{{ formatTime(duration) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoUrl: '',
			videoId: '',
			currentTime: 0,
			duration: 0,
			isPlaying: false,
			showControls: true,
			controlsTimer: null,
			isDragging: false,
			touchStartX: 0,
			progressBarWidth: 0
		};
	},
	computed: {
		progressPercent() {
			if (this.duration === 0) return 0;
			return (this.currentTime / this.duration) * 100;
		}
	},
	onLoad(options) {
		if (options.url) {
			this.videoUrl = decodeURIComponent(options.url);
		}
		if (options.id) {
			this.videoId = options.id;
		}
		
		// 自动隐藏控制栏
		this.startControlsTimer();
	},
	onReady() {
		this.videoContext = uni.createVideoContext('video-player', this);
		// 页面准备完成后自动播放视频
		this.$nextTick(() => {
			if (this.videoUrl) {
				this.videoContext.play();
			}
		});
	},
	onUnload() {
		if (this.controlsTimer) {
			clearTimeout(this.controlsTimer);
		}
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 播放/暂停切换
		togglePlay() {
			if (this.isPlaying) {
				this.videoContext.pause();
			} else {
				this.videoContext.play();
			}
			this.startControlsTimer();
		},
		
		// 时间更新
		onTimeUpdate(e) {
			if (!this.isDragging) {
				this.currentTime = e.detail.currentTime;
			}
		},
		
		// 视频元数据加载完成
		onLoadedMetadata(e) {
			this.duration = e.detail.duration;
		},
		
		// 播放开始
		onPlay() {
			this.isPlaying = true;
		},
		
		// 播放暂停
		onPause() {
			this.isPlaying = false;
		},
		
		// 播放结束
		onEnded() {
			this.isPlaying = false;
			this.currentTime = 0;
		},
		
		// 播放错误
		onError(e) {
			console.error('视频播放错误:', e);
			uni.showToast({
				title: '视频播放失败',
				icon: 'none'
			});
		},
		
		// 点击进度条跳转
		seekTo(e) {
			if (this.isDragging) return;
			
			uni.createSelectorQuery().in(this).select('.progress-bar').boundingClientRect((rect) => {
				const clickX = e.detail.x - rect.left;
				const percentage = clickX / rect.width;
				const targetTime = this.duration * Math.max(0, Math.min(1, percentage));
				
				this.videoContext.seek(targetTime);
				this.currentTime = targetTime;
				this.startControlsTimer();
			}).exec();
		},
		
		// 拖拽开始
		onThumbTouchStart(e) {
			this.isDragging = true;
			this.touchStartX = e.touches[0].clientX;
			
			uni.createSelectorQuery().in(this).select('.progress-bar').boundingClientRect((rect) => {
				this.progressBarWidth = rect.width;
			}).exec();
			
			if (this.controlsTimer) {
				clearTimeout(this.controlsTimer);
			}
		},
		
		// 拖拽移动
		onThumbTouchMove(e) {
			if (!this.isDragging) return;
			
			const deltaX = e.touches[0].clientX - this.touchStartX;
			const currentPercent = this.progressPercent;
			const deltaPercent = (deltaX / this.progressBarWidth) * 100;
			const newPercent = Math.max(0, Math.min(100, currentPercent + deltaPercent));
			
			this.currentTime = (newPercent / 100) * this.duration;
		},
		
		// 拖拽结束
		onThumbTouchEnd() {
			if (!this.isDragging) return;
			
			this.isDragging = false;
			this.videoContext.seek(this.currentTime);
			this.startControlsTimer();
		},
		
		// 格式化时间
		formatTime(seconds) {
			if (!seconds || isNaN(seconds)) return '00:00';
			
			const minutes = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		},
		
		// 开始控制栏定时器
		startControlsTimer() {
			this.showControls = true;
			if (this.controlsTimer) {
				clearTimeout(this.controlsTimer);
			}
			this.controlsTimer = setTimeout(() => {
				if (this.isPlaying && !this.isDragging) {
					this.showControls = false;
				}
			}, 3000);
		},
		
		// 点击视频区域显示/隐藏控制栏
		toggleControls() {
			if (this.showControls) {
				this.showControls = false;
				if (this.controlsTimer) {
					clearTimeout(this.controlsTimer);
				}
			} else {
				this.startControlsTimer();
			}
		}
	}
};
</script>

<style scoped>
.video-play-page {
	height: 100vh;
	background-color: #000;
	display: flex;
	flex-direction: column;
}

/* 头部导航样式 */
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: rgba(0, 0, 0, 0.8);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
	filter: brightness(0) invert(1);
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
}

.placeholder {
	width: 60rpx;
}

/* 视频容器 */
.video-container {
	flex: 1;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.video-player {
	width: 100%;
	height: 100%;
}

/* 控制栏样式 */
.controls {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	transition: opacity 0.3s ease;
	opacity: 0;
	pointer-events: none;
}

.controls.show {
	opacity: 1;
	pointer-events: auto;
}

.play-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.play-icon {
	width: 40rpx;
	height: 40rpx;
	filter: brightness(0) invert(1);
}

text.play-icon {
	font-size: 32rpx;
	color: #fff;
	width: auto;
	height: auto;
	filter: none;
}

.time-text {
	font-size: 24rpx;
	color: #fff;
	margin: 0 20rpx;
	min-width: 80rpx;
	text-align: center;
}

.progress-container {
	flex: 1;
	height: 60rpx;
	display: flex;
	align-items: center;
	padding: 0 10rpx;
}

.progress-bar {
	position: relative;
	height: 6rpx;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 3rpx;
}

.progress-played {
	height: 100%;
	background-color: #ff6b6b;
	border-radius: 3rpx;
	transition: width 0.1s ease;
}

.progress-thumb {
	position: absolute;
	top: 50%;
	width: 20rpx;
	height: 20rpx;
	background-color: #ff6b6b;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.3);
}
</style>