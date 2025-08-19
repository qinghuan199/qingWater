<template>
	<view class="content">
		<uni-nav-bar :leftWidth="100" :rightWidth="100"  fixed="true">
		<view slot="left" class="u-flex-x u-flex-items-center">
			<view>
				<!-- <image v-if="home" src="/static/SEND/BG-044.png" mode="aspectFit" class="icon-55"></image> -->
				<!-- v-else  -->
				
				<u-icon @click="goback" name="arrow-left" color="#fff" size="22"></u-icon>
			</view>
		</view>
		<view class="u-flex-y u-flex-center width-full u-flex-items-center">
			<image class="width-250" src="/static/logo//1.png" mode="widthFix"></image>
		</view>
		<!-- <view class="">
			
		</view> -->
	<!-- 	<navigator url="../message/message" class="u-flex-x u-flex-items-center" slot="right">
			<image class="icon-55" src="/static/SEND/BG-025.png" mode="aspectFit"></image>
		</navigator> -->
	</uni-nav-bar>
	</view>
	
</template>

<script>
	export default {
		name:"Headers",
		props:['home'],
		data() {
			return {
				
			};
		},
		methods:{
			goback(){
				let canNavBack = getCurrentPages();  //获取路由栈
				if(canNavBack && canNavBack.length>1) {    //判断是否刷新了浏览器，如果刷新了浏览器，路由栈只有当前一个
					uni.navigateBack({  
						delta: 1  
					});  
				} else {  
					history.back();  
				}  
			},
			
		}
	}
</script>

<style scoped lang="scss">
    ::v-deep.uni-navbar__header {
		// height: 50px !important;
		background:#192439 !important;
}
</style>