<template>
	<view class="content">
		<meta name="theme-color" content="#0a172b">
		<view class="tips">{{$t('transfer_usdt.title')}}</view>
		<view class="lists box1">
			<view class="list">
				<view class="name" v-if="cardInfo.erc_address != ''">
					{{$t('transfer_usdt.erc_address')}}：<text>{{cardInfo.erc_address}}</text>
				</view>
				<view class="name" v-if="cardInfo.trc_address != ''">
					{{$t('transfer_usdt.trc_address')}}：<text>{{cardInfo.trc_address}}</text>
				</view>
				<view class="card">1 USDT = {{cardInfo.proportion}} USDT</view>
				
				<view class="button">
					<text class="copyInfo" v-if="cardInfo.erc_address != ''" @click="copyInfo('erc_address')">{{$t('transfer_usdt.copy_erc')}}</text>
				    <text class="copyInfo" v-if="cardInfo.trc_address != ''" @click="copyInfo('trc_address')">{{$t('transfer_usdt.copy_trc')}}</text>
				</view>
			</view>
		</view>
		<view class="lists">
			<view class="list">
				<view class="label">{{$t('transfer_usdt.transfer_money')}}</view>
				<view class="USDT_price margin_top_10">{{to_usdt(transfer_money)}}</view>
			</view>
		</view>
		<view class="lists">
			<view class="list">
				<view class="label">{{$t('transfer_usdt.actual_money')}}</view>
				<view class="price margin_top_10">{{transfer_money}}</view>
			</view>
		</view>
		<view class="box3">
			<view class="item_input">
				<view class="label">{{$t('transfer_usdt.pay_img')}}</view>
				<view class="margin_top_10"><uni-file-picker file-mediatype="image" mode="grid" limit="3" @select="select" ></uni-file-picker></view>
			</view>
			<view class="item_button">
				<view class="button" @click="onSubmit">{{$t('transfer_usdt.submit')}}</view>
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
			that.initData();
		},
		data() {
			return {
				payType: "",
				transfer_money: "",
				cardInfo: [],
				img: ""
			}
		},
		methods: {
			initData (){
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.payType = that.payType;
				getApp().getData('api/User/getPaymentType',postData,function(res){
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
						that.cardInfo = res.data.info;
					}
				});
			},
			bankNumText(num){
			    var newNum = num.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"USDT1 ");
				return newNum;
			},
			onSubmit (){
				var that = this;
				if(!that.verify_money(that.transfer_money)){
					uni.showToast({
					    title: that.$t('transfer_usdt.toast1'),
					    icon: 'none',
						duration: 1000
					});
					return;
				}
				if(getApp().isEmpty(that.cardInfo)){
					uni.showToast({
					    title: that.$t('transfer_usdt.toast2'),
					    icon: 'none',
						duration: 1000
					});
					return;
				}
				if(getApp().isEmpty(that.img)){
					uni.showToast({
					    title: that.$t('transfer_usdt.toast3'),
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
						if(that.payType == 1 || that.payType == 2){
							uni.showToast({
							    title: that.$t('transfer_usdt.toast4'),
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
			to_usdt(money){
				var that = this;
				var proportion = that.cardInfo.proportion;
				return getApp().money(money/proportion);
			},
			copyInfo(name){
				var that = this;
				uni.setClipboardData({
					data: that.cardInfo[name],
					showToast: false,
					success: function () {
						uni.showToast({
							title: that.$t('transfer_usdt.toast5'),
							icon: 'none',
							duration: 1000
						});
					}
				});
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
		}
	}
</script>

<style>
	page{
		 
		color: #333333;
	}
	.content{
		padding-top: 10px;
	}
	.box1{
		background-color: rgb(68, 68, 68) !important;
		background-image: url(../../static/card_bg.png);
		background-repeat: no-repeat;
		background-size: cover;
		color: #ffffff;
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
	.lists .list .USDT_price{
		font-size: 22px;
		color: #1d2750;
		font-weight: 580;
	}
	.lists .list .USDT_price::before{
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
		background-color: #092B8E;
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
