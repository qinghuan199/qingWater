<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<view class="lists">
			<view class="list" v-for="(item, index) in list" :key="index">
				<view>
					<image class="icon" :src="item.payTypeLogo" mode="aspectFit"></image>
				</view>
				<view class="info">
					<view class="space_between">
						<text class="title">{{item.payTypeTitle}}</text>
						<text :class="'status status_'+item.status">{{getRechargeStatus(item.status)}}</text>
					</view>
					<view class="space_between">
						<text class="create_time">{{item.create_time}}</text>
						<text class="money">+{{money(item.price)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			var that = this;
			that.initData(1);
		},
		onReachBottom(){
			var that = this;
			if (that.mCurrentPage >= that.totalPage) {
			    uni.showToast({
			    	title: that.$t('public.no_data'),
			    	icon: 'none',
			    	duration: 2000
			    });
				return;
			}
			that.initData(that.mCurrentPage + 1);
		},
		onPullDownRefresh() {
			this.initData(1);
			uni.stopPullDownRefresh();
		},
		data() {
			return {
				list: [],
				totalSize: 0,
				totalPage: 0,
				mCurrentPage: 0
			}
		},
		methods: {
			initData (page){
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.pageNow = page;
				postData.pageSize = '10';
				getApp().getData('api/User/getRechargeOrder',postData,function(res){
					if(res.status == 0){
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#092B8E'
						});
					}else{
						if(page == 1){
							that.list = res.data.list;
						}else{
							var pageDatas = (that.list).concat(res.data.list);
							that.list = pageDatas;
						}
						if(res.data.list.length == 0){
							uni.showToast({
								title: that.$t('public.no_data'),
								icon: 'none',
								duration: 2000
							});
						    return;
						}
						that.totalSize = res.data.totalElements;
						that.totalPage = res.data.totalPages;
						that.mCurrentPage = res.data.pageNow;
					}
				});
			},
			getRechargeStatus (status){
				var desc = "";
				var that = this;
				switch (status){
					case 0:
						desc = that.$t('recharge_log.status1');
						break;
					case 1:
						desc = that.$t('recharge_log.status2');
						break;
					case 2:
						desc = that.$t('recharge_log.status3');
						break;
					default:
						desc = that.$t('recharge_log.status4');
						break;
				}
				return desc;
			},
			money (wallet){
				return getApp().money(wallet);
			}
		}
	}
</script>

<style lang="scss">
	page {
		 
		color: #333333;
	}
	.lists{
		padding: 16px;
	}
	.lists .list{
		background-color: #FFFFFF;
		color: #333333;
		padding: 15px;
		border-radius: 10px;
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		align-items: center;
		margin-bottom: 15px;
		box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
	}
	.lists .list .icon{
		width: 36px;
		height: 36px;
		border-radius: 18px;
		margin-right: 10px;
	}
	.lists .list .info{
		width: 100%;
	}
	.lists .list .info .title{
		font-size: 14px;
		font-weight: 580;
	}
	.lists .list .info .status{
		font-size: 12px;
		background-color: $main-color;
		padding: 2px 10px;
		color: #fff;
		border-radius: 3px;
	}
	.lists .list .info .create_time{
		font-size: 12px;
	}
	.lists .list .info .money{
		font-size: 14px;
		font-weight: 580;
	}
	.lists .list .info .status_0{
		background-color: $main-color !important;
	}
	.lists .list .info .status_1{
		background-color: $main-color;
	}
	.lists .list .info .status_2{
		background-color: #555555;
	}
</style>
