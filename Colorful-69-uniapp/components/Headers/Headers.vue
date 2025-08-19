<template>
	<view class="content">
		<uni-nav-bar :leftWidth="100" :rightWidth="100"  fixed="true">
		<view slot="left" class="u-flex-x u-flex-items-center">
			<u-icon name="arrow-left" color="white" size="20" v-if="type=='order'" @click="back"></u-icon>
			<userPop v-else></userPop>
		</view>
		<view class="u-flex-y u-flex-center width-full u-flex-items-center">
			<image class="width-250" src="/static//logo/1.png" mode="widthFix"></image>
		</view>
		<!-- <navigator url="../message/message" class="u-flex-x u-flex-items-center" slot="right">
			<image class="icon-55" src="/static//icon/13.png" mode="aspectFit"></image>
		</navigator> -->
	</uni-nav-bar>
	</view>
	
</template>

<script>
	export default {
		name:"Headers",
		props:['type'],
		data() {
			return {
				
			};
		},
		methods:{
		back(){
			history.back()
		}	
			
		}
	}
</script>

<style scoped lang="scss">
    ::v-deep.uni-navbar__header {
		// height: 50px !important;
		background: #192439 !important;
}
</style>