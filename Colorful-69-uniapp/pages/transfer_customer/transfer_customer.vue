<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<view class="tips">{{$t('transfer_customer.title')}}</view>
		<view class="lists box1">
			<view class="oncustomer" @click="onCustomer">
				<image src="../../static/welcome_customer.png" mode="widthFix"></image>
				<text>{{$t('transfer_customer.btn')}}</text>
			</view>
		</view>
		<view class="lists">
			<view class="list">
				<view class="label">{{$t('transfer_customer.transfer_money')}}</view>
				<view class="usdt_price margin_top_10">{{transfer_money}}</view>
			</view>
		</view>
		<view class="lists">
			<view class="list">
				<view class="label">{{$t('transfer_customer.actual_money')}}</view>
				<view class="price margin_top_10">{{transfer_money}}</view>
			</view>
		</view>
		<view class="box3">
			<view class="item_input">
				<view class="label">{{$t('transfer_customer.pay_img')}}</view>
				<view class="margin_top_10"><uni-file-picker file-mediatype="image" mode="grid" limit="3" @select="select" ></uni-file-picker></view>
			</view>
			<view class="item_button">
				<view class="button" @click="onSubmit">{{$t('transfer_customer.submit')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			var that = this;
			that.payType = e.payType;
			that.transfer_money = e.transfer_money;
		},
		data() {
			return {
				payType: "",
				transfer_money: "",
				img: ""
			}
		},
		methods: {
			bankNumText(num){
			    var newNum = num.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
				return newNum;
			},
			onSubmit (){
				var that = this;
				if(!that.verify_money(that.transfer_money)){
					uni.showToast({
					    title: that.$t('transfer_customer.toast1'),
					    icon: 'none',
						duration: 1000
					});
					return;
				}
				if(getApp().isEmpty(that.img)){
					uni.showToast({
					    title: that.$t('transfer_customer.toast2'),
					    icon: 'none',
						duration: 1000
					});
					return;
				}
				that.payRechargeOrder();
			},
			payRechargeOrder(){
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.payType = that.payType;
				postData.money = that.transfer_money;
				postData.pay_img = that.img;
				getApp().getData('api/User/recharge',postData,function(res){
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
						if(that.payType == 1 || that.payType == 2 || that.payType == 3){
							uni.showToast({
							    title: that.$t('transfer_customer.toast3'),
							    icon: 'none',
								duration: 2000
							});
							setTimeout(function(){
								uni.redirectTo({
									url: '/pages/start/start'
								})
							},2000)
						}
					}
				});
			},
			verify_money (money){
				var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
				if (reg.test(money)) {
				    return true;
				}else{
				    return false;
				};
			},
			select (e){
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				var files = [];
				for (var i = 0; i < e.tempFiles.length; i++) {
					files[i] = {
						uri: e.tempFiles[i].url,
						name: e.tempFiles[i].uuid,
						file: e.tempFiles[i].file
					};
				}
				getApp().uploadImgArr('api/User/uploadUsdtImg',postData,files,function(res){
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
						if(getApp().isEmpty(that.img)){
							that.img = res.data;
						}else{
							that.img = that.img +"|"+res.data;
						}
					}
				});
			},
			onCustomer (){
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				var postData = new Object();
				postData.token = userInfo.token;
				postData.userid = userInfo.userid;
				postData.requesTime = getApp().getTime();
				getApp().getData('api/User/getCustomer',postData,function(res){
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
						var buttons = new Array();
						var customer_list = res.data;
						for (var i = 0; i < customer_list.length; i++) {
						    buttons[i] = customer_list[i].name;
						}
						uni.showActionSheet({
							itemList: buttons,
							success: function (res) {
								getApp().openUrl(customer_list[res.tapIndex].url);
							}
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		 
		color: #333333;
	}
	.content{
		padding-top: 10px;
	}
	.box1{
		
	}
	.box1 .oncustomer{
		height: 48px;
		line-height: 48px;
		text-align: center;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.box1 .oncustomer image{
		width: 22px;
		margin-right: 5px;
		display: block;
	}
	.lists{
		margin: 0 10px 10px 10px;
		border-radius: 10px;
		background-color: #fff;
	}
	.lists .list{
		padding: 15px;
	}
	.tips{
		font-size: 14px;
		color: #FF0000;
		padding: 0 10px 10px 10px;
	}
	.lists .list .name{
		font-size: 15px;
	}
	.lists .list .card{
		padding: 10px 0;
		font-size: 22px;
	}
	.lists .list .bank_info{
		font-size: 14px;
	}
	.lists .list .button{
		border-top: 1px solid #cea6a6;
		margin-top: 15px;
		padding-top: 15px;
		padding-bottom: 0;
		text-align: right;
	}
	.lists .list .button .copyInfo{
		display: inline-block;
		font-size: 12px;
		margin-left: 10px;
	}
	.lists .list .label{
		font-size: 14px;
	}
	.lists .list .usdt_price{
		font-size: 22px;
		color: #1d2750;
		font-weight: 580;
	}
	.lists .list .usdt_price::before{
		content: "USDT";
		font-size: 12px;
	}
	.lists .list .price{
		font-size: 22px;
		color: #1d2750;
		font-weight: 580;
	}
	.lists .list .price::before{
		content: "USDT";
		font-size: 12px;
	}
	.item_input{
		background-color: #FFFFFF;
		border-radius: 10px;
		padding: 15px;
		margin-bottom: 10px;
	}
	.item_input .label{
		font-size: 14px;
	}
	.item_input .uni-input{
		height: 55px;
		line-height: 55px;
		width: 200px;
		font-size: 14px;
	}
	.item_button{
		padding: 10px 0;
	}
	.item_button .button{
		background-color: $main-color;
		color: #FFFFFF;
		height: 44px;
		line-height: 44px;
		text-align: center;
		border-radius: 15px;
	}
	.box3{
		padding: 0 10px;
	}
</style>
