<template>
	<view class="content">

		<HeaderTitle :title='title'></HeaderTitle>

		<view class="m-t-70">
			<view class="font-size-13 p-15" style="color: #000;">
				Dear users, in order to protect the security of your funds, please do
				not enter your bank card password. Our staff will not ask you to
				enter your bank card PIN.
			</view>
		</view>
		<view class="u-flex-y p-30 width-690 radius-12 u-flex-self-center m-t-30"
			style="background-color: #fff;margin: 0 auto;border: 2rpx solid#c1c1c1;">
			<!-- <view class="u-flex-x u-flex-between">
				<text class="label">{{$t('bind.username')}}</text>
				<input class="uni-input font-gray" type="text" :disabled="disabled"
					:placeholder="$t('bind.username_desc')" v-model="name" />
			</view> -->
			<view v-if="statuss==1" class="u-flex-x u-flex-between">
				<text class="label" style="flex-shrink:0;">{{$t('bind.username')}}</text>
				<input @click="show = true" class="uni-input text-right width-full " type="text" :disabled="disabled"
					placeholder-style="font-size:28rpx;" :placeholder="$t('bind.username_desc')" v-model="name" />
			</view>
			<view v-if="statuss==0" class="u-flex-x u-flex-between">
				<text class="label" style=" flex-shrink:0;">{{$t('bind.username')}}</text>
				<input class="uni-input text-right width-full " type="text" :disabled="disabled"
					placeholder-style="font-size:28rpx;" :placeholder="$t('bind.username_desc')" v-model="name" />
			</view>
			<view>
				<u-picker confirmColor="#5b6cfa" cancelText="Cancel" confirmText="Done" @confirm="onExchange"
					:closeOnClickOverlay="true" @cancel="show=false" :show="show" :columns="columns"></u-picker>
			</view>


			<u-line class="m-t-30"></u-line>
			<view class="u-flex-x u-flex-between m-t-30">
				<text class="label">{{$t('bind.usdt_address')}}</text>
				<input class="uni-input font-gray" type="text" :disabled="disabled"
					:placeholder="$t('bind.usdt_address_desc')" v-model="usdt_address" />
			</view>
			<u-line class="m-t-30"></u-line>
			<view class="u-flex u-flex-items-center u-flex-between m-t-30">
				<text class="label">{{$t('bind.exchange')}}</text>
				<view class="u-flex u-flex-between u-flex-items-center ">
					<view class="sel-net" @click="networkChange('TRC20')" :class="exchange=='TRC20'&&'ac'">TRC20
					</view>
					<view class="sel-net" @click="networkChange('ERC20')" :class="exchange=='ERC20'&&'ac'">ERC20</view>
				</view>
			</view>

			<u-line class="m-t-30"></u-line>
			<view class="u-flex-x u-flex-between m-t-30">
				<text class="label">{{$t('register.phone')}}</text>
				<input class="uni-input font-gray" type="text" :disabled="disabled" :placeholder="$t('bind.phone_desc')"
					v-model="phone" />
			</view>
		</view>
		<view class="item_button">
			<view v-if="show_button" class="button img-aaaa" @click="onSubmit">{{$t('bind.save')}}</view>
			<view v-if="show_edit" class="button  edit img-aaaa" @click="onEdit">{{$t('bind.edit')}}</view>
		</view>
	</view>
</template>
<script>
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js";
	export default {
		components: {
			w_md5
		},
		onLoad(e) {
			var that = this;
			that.initData();
		},
		data() {
			return {
				statuss: 1,
				show: false,
				columns: [
					['Bitget', 'Bybit', 'Binance', 'Kucoin', 'Huobi', 'Bitvavo',
						'Crypto.com', 'Coinbase', 'LBank',
						'Other'
					]
				],
				bank_code: "",
				bank_name: "",
				name: "",
				card_num: "",
				pay_password: "",
				disabled: false,
				focus: true,
				show_button: true,
				show_edit: false,
				app_name: getApp().globalData.appname,
				exchange: "",
				usdt_address: "",
				phone: '',
				email: '',
				title: 'Manage Withdrawal Details'

			}
		},
		methods: {
			onExchange(e) {
				var that = this
				that.name = e.value[0]
				that.show = false
				if (e.value[0] == 'Other') {
					that.name = ''

					that.statuss = 0
				} else {
					that.status = 1
				}

			},
			networkChange(val) {
				this.exchange = val
			},
			initData() {
				var that = this;
				var postData = new Object();
				var userInfo = getApp().getCache('userInfo');
				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				getApp().getData('api/User/getCard', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#E63888'
						});
					} else {
						if (!getApp().isEmpty(res.data)) {
							that.show_button = false;
							that.show_edit = true;
							that.disabled = true;
							that.focus = false;
							that.bank_code = res.data.bank_code;
							that.bank_name = res.data.bank_name;
							that.name = res.data.name;
							that.card_num = that.bankNumText(res.data.card_num);
							that.exchange = (res.data.exchange);
							that.usdt_address = that.bankNumreUsdtAddress(res.data.usdt_address);
							that.phone = res.data.phone;
							that.email = userInfo.email;
						}
					}
				});
			},
			onSubmit() {
				var that = this;
				var userInfo = getApp().getCache('userInfo');
				if (getApp().isEmpty(that.name) || getApp().isEmpty(that.usdt_address) || !that.phone || getApp().isEmpty(
						that.exchange)) {
					uni.showToast({
						title: that.$t('bind.toast1'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				// if(that.email !==userInfo.email){
				// 	uni.showToast({
				// 		title: 'Incorrect email address',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// 	return;
				// }
				var userInfo = getApp().getCache('userInfo');
				var postData = new Object();

				postData.requesTime = getApp().getTime();
				postData.userid = userInfo.userid;
				postData.token = userInfo.token;
				postData.sub_bank_name = "";
				postData.bank_code = that.bank_code;
				postData.bank_name = that.bank_name;
				postData.name = that.name;
				postData.card_num = that.card_num;
				postData.exchange = that.exchange;
				postData.usdt_address = that.usdt_address;
				postData.phone = that.phone;
				getApp().getData('api/User/cardBind', postData, function(res) {
					if (res.status == 0) {
						uni.showModal({
							title: getApp().globalData.appname,
							content: res.message,
							showCancel: false,
							cancelText: that.$t('public.cancel'),
							confirmText: that.$t('public.confirm'),
							confirmColor: '#E63888'
						});
					} else {
						uni.showToast({
							title: that.$t('bind.toast3'),
							icon: 'none',
							duration: 1000
						});
						userInfo.card_bind_status = 1;
						getApp().setCache('userInfo', userInfo);
						uni.$emit('refreshCard');
						setTimeout(function() {
							that.initData();
						}, 1000)

					}
				});
			},
			onEdit() {
				var that = this;
				that.disabled = false;
				that.focus = true;
				that.show_button = true;
				that.show_edit = false;
				that.bank_code = "";
				that.bank_name = "";
				that.name = "";
				that.card_num = "";
				that.exchange = "";
				that.usdt_address = "";
			},
			bankNumText(num) {

				if (num.length <= 4) {
					return num;
				}

				let res = num.substring(0, num.length - 5);
				res += `****`;
				return res;
			},
			bankNumreUsdtAddress(num) {
				return `${num.substring(0,5)}****${num.substr(-5)}`;
			},
		}
	}
</script>

<style lang="scss">
	page {
		color: #333;
		min-height: 100%;
		background-image: none;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	.img-aaaa {
		// width: 300rpx;
		background-color: #5b6cfa;
		color: #fff;
		padding: 40rpx 0rpx;
		text-align: center;
		// background-image: url('@/static/nfc/button/BG-5.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.content {
		// padding: 15px;
	}

	.item_textarea {
		background-color: #FFFFFF;
		border-radius: 15px;
		padding: 0 15px 15px 15px;
		margin-bottom: 10px;

	}

	.item_textarea .label {
		font-size: 14px;
		height: 55px;
		line-height: 55px;
	}

	.item_textarea .textarea {
		background-color: #ecfcee;
		font-size: 14px;
		height: 70px;
		padding: 5px 10px;
		border-radius: 15px;
	}

	.item_input {
		background-color: #FFFFFF;
		border-radius: 15px;
		padding: 0 20px;
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		align-items: center;
		margin-bottom: 15px;
	}

	.item_input .label {
		font-size: 14px;
		width: 120px;
		padding: 10px 0;
		color: #5b6cfa;
	}

	.item_input view {
		width: 100%;
	}

	.uni-input {
		// height: 55px;
		// line-height: 55px;
		// width: 100%;
		font-size: 14px;
		text-align: right;
	}

	.item_button {
		padding: 10px 0;
		display: flex;
		justify-content: center;
		color: #000;
	}

	.item_button .button {
		margin-top: 50rpx;
		width: 690rpx;
		// background-color: #2fb7ec;
		color: #fff;
		text-align: center;
		height: 50px;
		line-height: 10px;
		// border-radius: 15px;
		font-size: 15px;
	}

	.item_button .edit {
		// background-color: #313131;
	}

	.tips {
		font-size: 12px;
		text-align: center;
		color: #313131;
	}

	.label {
		color: #5b6cfa;
		font-weight: 600;
	}

	.sel-net {
		border: 1px solid;
		height: 60rpx;
		line-height: 60rpx;
		width: 150rpx;
		text-align: center;
		color: #5b6cfa;
		border-radius: 12rpx;
		font-size: 28rpx;
		margin-left: 15rpx;

		&.ac {
			background-color: #5b6cfa;
			color: #fff;
		}
	}

	::v-deep .u-popup__content[data-v-3a231fda] {
		border-radius: 20px 20px 0 0 !important;
	}
</style>