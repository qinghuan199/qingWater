<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<view class="lists">
		    <view class="list" v-for="(item, index) in list" :key="index">
		        <view class="title">{{$t('withdraw_log.title')}}</view>
		        <view class="money">{{item.money}}</view>
		        <view class="aui-flex-col">
		            <view class="aui-flex-item-4">{{$t('withdraw_log.card')}}</view>
		            <view class="aui-flex-item-8">{{item.bank_name}} ({{filter_card(item.card_num)}})</view>
		        </view>
		        <!-- <view class="aui-flex-col">
		            <view class="aui-flex-item-4">手續費</view>
		            <view class="aui-flex-item-8">{{item.commission}}</view>
		        </view> -->
		        <view class="aui-flex-col">
		            <view class="aui-flex-item-4">{{$t('withdraw_log.really_money')}}</view>
		            <view class="aui-flex-item-8">{{comssion_money(item.really_money)}}</view>
		        </view>
		        <view class="aui-flex-col">
		            <view class="aui-flex-item-4">{{$t('withdraw_log.time')}}</view>
		            <view class="aui-flex-item-8">{{item.create_time}}</view>
		        </view>
		        <view class="aui-flex-col">
		            <view class="aui-flex-item-4">{{$t('withdraw_log.status')}}</view>
		            <view :class="'aui-flex-item-8 status_'+item.status">{{getWithdrawStatus(item.status)}}</view>
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
				getApp().getData('api/User/getWithdrawLog',postData,function(res){
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
			getWithdrawStatus (status){
				var desc = "";
				var that = this;
				switch (status){
					case 0:
						desc = that.$t('withdraw_log.status1');
						break;
					case 1:
						desc = that.$t('withdraw_log.status2');
						break;
					case 2:
						desc = that.$t('withdraw_log.status3');
						break;
					default:
						desc = that.$t('withdraw_log.status4');
						break;
				}
				return desc;
			},
			money (wallet){
				return getApp().money(wallet);
			},
			comssion_money(wallet){
				var price = getApp().money(wallet);
				return price;
			},
			filter_card(card){
				return card.substring(card.length-4);
			}
		}
	}
</script>

<style lang="scss">
	page {
		 
		color: #333333;
	}
	.lists{
        padding: 15px;
    }
    .lists .list{
        background-color: #ffffff;
        border-radius: 15px;
        padding: 15px;
        margin-bottom: 15px;
		box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
    }
        .lists .list .title{
            text-align: center;
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
        }
		.lists .list .money::before{
			content: "USDT";
			font-size: 12px;
		}
        .lists .list .money{
            color: $main-color;
            font-size: 28px;
			font-weight: 600;
            text-align: center;
            margin-top: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f5f5f5;
        }
        .lists .list .aui-flex-col{
            font-size: 14px;
            margin-top: 15px;
        }
        .lists .list .aui-flex-col .aui-flex-item-4{
            color: #999999;
        }
        .lists .list .status_0{
            color: #FF871B;
        }
        .lists .list .status_1{
            color: #00B92B;
        }
        .lists .list .status_2{
            color: #E41500;
        }
</style>
