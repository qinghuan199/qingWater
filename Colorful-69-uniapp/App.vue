<script>
	var admin_url = 'https://69cm.me/';
	// var admin_url = "https://admin.yotponl-senna.net/";

	var aeskey = "bc9mvyytmuftyf1d";
	import tools from "@/static/js/tools.js"; //tools.js的位置
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js"

	let getSystemMaintenance = () => {
		let now = Date.now(),
			startTime = new Date('2023/1/18 23:00').getTime(),
			endTime = new Date('2023/1/20 10:00').getTime();
		if (now >= startTime && now <= endTime && location.href.indexOf('/pages/maintenance/maintenance') == -1) {
			return true;
		}
		return false;
	}
	// https://drive.google.com/drive/folders/1FbKyEvefoVvW-cnRG0O8cnVfsFGMAY8o
	export default {
		components: {
			w_md5
		},
		globalData: {
			logo: '../../static/logo.png',
			appname: '69传媒',
			version: '1.0.0',
			weburl: 'https://www.newerashopping.com/',
			baseUrl: admin_url
		},
		onLaunch() {
			// 应用启动时设置状态栏颜色
			this.setNavigationBarColor();
			if (this.$getCacheCheck('resultHandle') === null) {
				console.log("我是验证");
				uni.navigateTo({
					url: "/pages/verify/verify"
				})
				// this.$setCacheCheck('resultHandle',0,86400)
			}
		},
		onShow: function() {
			if (getSystemMaintenance()) {
				location.href = '/#/pages/maintenance/maintenance'
			}
			this.setNavigationBarColor();
		},

		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				var userInfo = getApp().getCache('userInfo');
				const token = userInfo ? userInfo.token : null;
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					this.clearUserData();
					return;
				}
				uni.request({
					url: getApp().globalData.baseUrl + 'api/getuserinfo',
					method: 'POST',
					header: {
						'token': token
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.userInfo = res.data.data;
						} else {
							uni.showToast({
								title: res.data.msg || '获取用户信息失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},
			setNavigationBarColor() {
				uni.setNavigationBarColor({
					frontColor: '#ffffff', // 状态栏前景色 (白色)
					backgroundColor: '#0a172b' // 状态栏背景色 (深蓝色)
				});
			},

			// num為傳入的值，n為保留的小數位
			money: function(num, n = 2) {
				var f = parseFloat(num);
				if (isNaN(f)) {
					return false;
				}
				f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 冪
				var s = f.toString();
				var rs = s.indexOf('.');
				//判定如果是整數，增加小數點再補0
				if (rs < 0) {
					rs = s.length;
					s += '.';
				}
				while (s.length <= rs + n) {
					s += '0';
				}
				return s;
			},
			isEmpty: function(input) {
				if (this.isNumber(input)) {
					return false;
				}
				if (input == undefined || input == '' || input == null || input.length == 0 || JSON.stringify(input) ==
					"{}") {
					return true;
				} else {
					return false;
				}
			},
			isNumber: function(value) {
				return typeof value === 'number' && !isNaN(value);
			},
			getTime: function() {
				return (new Date()).getTime() + (parseInt(Math.random() * 10000));
			},
			setCache: function(key, value) {
				uni.setStorageSync(key, JSON.stringify(value));
				return true;
			},
			getCache: function(key) {
				//var data = localStorage.getItem(key);
				var that = this;
				var returnData = uni.getStorageSync(key);
				if (!that.isEmpty(returnData)) {
					returnData = JSON.parse(returnData);
				}

				return returnData;
			},
			removeCache: function(key) {
				uni.removeStorageSync(key);
				return true;
			},
			removeAllCache: function() {
				//return localStorage= null;
				return uni.clearStorageSync();
			},
			uploadImgArr: function(action, value, files, callback, isForbitRelogin, isHideLoading) {
				if (!isHideLoading) {
					uni.showLoading({
						title: 'Loading'
					});
				}
				var systemInfo = uni.getSystemInfoSync();
				var url = admin_url + action;
				var apptype = systemInfo.platform; //ios、android、win、wp+
				var device = systemInfo.model; //app、web、mp
				var sign = tools.setAES("aeskey=" + aeskey + "&apptype=" + apptype + "&device=" + device + "&time=" +
					value.requesTime);
				console.log(url + "   " + JSON.stringify(value));
				uni.uploadFile({
					url: url, //僅為示例，非真實的接口地址
					files: files,
					fileType: 'image',
					header: {
						'sign': sign,
						'aeskey': aeskey,
						'apptype': apptype,
						'device': device,
						'version': this.globalData.version,
						// 'lang': 'zh-Hant'
					},
					formData: value,
					success: (res) => {
						uni.hideLoading();
						res.data = JSON.parse(res.data);
						console.log(res.data);
						if (res.statusCode == 200) {
							if (typeof(callback) == 'function') {
								callback(res.data);
							}
						} else if (res.statusCode == 403 && isForbitRelogin != true) {
							this.reLogin(action, value, callback, files);
						} else {
							console.log('錯誤返回1');
							uni.showModal({
								title: 'System messages',
								content: 'System error, please contact the administrator!',
								showCancel: false,
								confirmColor: '#092B8E'
							});
						}
					}
				});
			},
			uploadImg: function(action, value, filePath, callback, isForbitRelogin, isHideLoading) {
				if (!isHideLoading) {
					uni.showLoading({
						title: 'Loading'
					});
				}
				var systemInfo = uni.getSystemInfoSync();
				var url = admin_url + action;
				var apptype = systemInfo.platform; //ios、android、win、wp+
				var device = systemInfo.model; //app、web、mp
				var sign = tools.setAES("aeskey=" + aeskey + "&apptype=" + apptype + "&device=" + device + "&time=" +
					value.requesTime);
				console.log(url + "   " + JSON.stringify(value));
				uni.uploadFile({
					url: url, //僅為示例，非真實的接口地址
					filePath: filePath,
					name: 'file',
					fileType: 'image',
					header: {
						'sign': sign,
						'aeskey': aeskey,
						'apptype': apptype,
						'device': device,
						'version': this.globalData.version,
						// 'lang': 'zh-Hant'
					},
					formData: value,
					success: (res) => {
						uni.hideLoading();
						res.data = JSON.parse(res.data);
						console.log(res.data);
						if (res.statusCode == 200) {
							if (typeof(callback) == 'function') {
								callback(res.data);
							}
						} else if (res.statusCode == 403 && isForbitRelogin != true) {
							this.reLogin(action, value, callback, filePath);
						} else {
							console.log('錯誤返回1');
							uni.showModal({
								title: 'System messages',
								content: 'System error, please contact the administrator!',
								showCancel: false,
								confirmColor: '#092B8E'
							});
						}
					}
				});
			},
			/**
			 *	isForbitRelogin: token過期時，是否禁止重新登錄
			 *  isHideLoading：是否隱藏Progress
			 *  */
			getData: function(action, value, callback, isForbitRelogin = false, isHideLoading) {
				if (!isHideLoading) {
					uni.showLoading({
						title: '加载中...',
						duration: 3000
					});
				}
				var systemInfo = uni.getSystemInfoSync();
				var userInfo = this.getCache('userInfo')
				var url = admin_url + action;
				var apptype = systemInfo.platform; //ios、android、win、wp+
				var device = systemInfo.model; //app、web、mp
				var sign = tools.setAES("aeskey=" + aeskey + "&apptype=" + apptype + "&device=" + device + "&time=" +
					value.requesTime);
				console.log(url + "   " + JSON.stringify(value));
				uni.request({
					url: url, //僅為示例，並非真實接口地址。
					method: 'POST',
					timeout: 20000,
					datatype: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						// 'sign': sign,
						// 'aeskey': aeskey,
						// 'apptype': apptype,
						// 'device': device,
						// 'version': this.globalData.version,
						// 'lang': 'zh-Hant',
						'token': userInfo.token ? userInfo.token : ''

					},
					data: value,
					success: (res) => {
						console.log(res.data, 'data');
						uni.hideLoading();
						if (res.data.code == 200) {
							if (typeof(callback) == 'function') {
								callback(res.data);
							}
						} else if (res.data.msg == '登录已过期') {
							uni.showLoading({
								title: res.data.msg,
								duration: 2000
							});
							// 清除用户数据
							this.removeCache('token');
							this.removeCache('userInfo');
							this.removeCache('isLogin');
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								});
							}, 1000);
							console.log('登录已过期，已清除用户数据');
						} else if (res.data.code == 401) {
							uni.showLoading({
								title: res.data.msg,
								duration: 2000
							});
							setTimeout(() => {
								uni.hideLoading();
							}, 1000);
						} else if (res.data.code == 402) {
							// 402状态码需要执行回调函数，让页面处理余额不足逻辑
							if (typeof(callback) == 'function') {
								callback(res.data);
							}
						} else if (res.data.code == 403) {
							if (typeof(callback) == 'function') {
								callback(res.data);
							}
						} else {
							uni.showModal({
								title: '系统错误',
								content: res.data.code,
								// 	content: '[' + res.statusCode +
								// ']System error, please contact the administrator!',
								showCancel: false,
								confirmColor: '#092B8E'
							});
						}
					},
					fail: (err) => {
						console.log(err, '4444');
						uni.hideLoading();
						uni.showModal({
							title: '系统错误',
							content: '网络繁忙，请重新登录!',
							showCancel: false,
							confirmColor: '#092B8E'
						});
					}
				});
			},
			/**
			 *	token過期，重新登錄，登錄成功後重新調用上次請求
			 *  */
			reLogin: function(action, data, callback, filePath) {
				var systemInfo = uni.getSystemInfoSync();
				var user = this.getCache('userInfo');
				var apptype = systemInfo.platform; //ios、android、win、wp+
				var device = systemInfo.model; //app、web、mp

				if (this.isEmpty(user)) {
					this.removeCache('isLogin');
					this.removeCache('userInfo');
					uni.navigateTo({
						url: '../login/login'
					});
					return;
				}

				var obj = new Object();
				obj.phone = user.phone;
				obj.password = user.password;
				obj.requesTime = this.getTime();
				var sign = tools.setAES("aeskey=" + aeskey + "&apptype=" + apptype + "&device=" + device + "&time=" +
					obj.requesTime);
				console.log('正在重新登錄');
				console.log(admin_url + "api/login   " + JSON.stringify(obj));
				uni.request({
					url: admin_url + "api/login",
					method: 'POST',
					timeout: 10000,
					datatype: 'json',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						// 'sign': sign,
						// 'aeskey': aeskey,
						// 'apptype': apptype,
						// 'device': device,
						// 'version': this.globalData.version,
						// 'lang': 'zh-Hant'
					},
					data: obj,
					success: (res) => {
						console.log("自動登錄成功！");
						console.log(res);
						this.setCache("isLogin", 1);
						this.setCache("userInfo", res.data.data.userInfo);
						// this.setCache("config", res.data.data.config);

						data.requesTime = this.getTime();
						data.token = res.data.data.userInfo.token;
						if (filePath) {
							if (typeof(filePath) == "string") {
								this.uploadImg(action, data, filePath, callback);
							} else {
								this.uploadImgArr(action, data, filePath, callback);
							}
						} else {
							this.getData(action, data, callback);
						}

					},
					fail: (err) => {
						console.log(err);
						this.removeCache("isLogin", 0);
						this.removeCache("userInfo");
						uni.showToast({
							title: 'Automatic relogin failed!',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			arrSearchObj(name, arr, key) {
				var newArr = new Array();
				for (var i = 0; i < arr.length; i++) {
					if (arr[i][key] == name) {
						newArr = arr[i];
						break;
					}
				}
				return newArr;
			},
			openUrl(url) {
				if (process.env.VUE_APP_PLATFORM == 'h5') {
					window.open(url, '_blank');
				} else {
					plus.runtime.openURL(url);
				}
			},
			addFootMark(goods) {
				var that = this;
				// that.removeCache('footmark');
				var footmark = that.getCache('footmark');
				if (that.isEmpty(footmark)) {
					//創建footmark緩存
					footmark = new Array();
					footmark.unshift(goods);
					that.setCache('footmark', footmark);
				} else {
					//已存在footmark緩存
					if (footmark.length >= 100) {
						//刪除最後壹個數組
						footmark.pop();
					}
					if (that.isEmpty(that.arrSearchObj(goods.id, footmark, 'id'))) {
						footmark.unshift(goods);
					} else {
						//刪除原有足跡，插入新足跡
						var newData = footmark.filter(function(item) {
							return item['id'] != goods.id;
						});
						newData.unshift(goods);
						footmark = newData;
					}
					that.setCache('footmark', footmark);
				}
			},
			keyInArr(arr, name, value) {
				var bol = false;
				arr.forEach((item, index) => {
					if (value == item[name]) {
						bol = index;
						return;
					}
				});
				return bol;
			},
			//生成从minNum到maxNum的随机数
			randomNum(minNum, maxNum) {
				switch (arguments.length) {
					case 1:
						return parseInt(Math.random() * minNum + 1, 10);
						break;
					case 2:
						return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
						break;
					default:
						return 0;
						break;
				}
			},
			toPoint(percent) {
				var str = percent.replace("%", "");
				str = str / 100;
				return str;
			},
			checkPhone(phone) {
				var patt = /^[\d]{8,11}/;
				if (patt.test(phone)) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/uni_modules/uview-ui/libs/css/flex.scss";
	@import "@/common.scss";

	@font-face {
		font-family: 'SFPRODISPLAYREGULAR';
		src: url('/static/font/Century Gothic Std Regular.otf');
	}

	page {
		font-family: 'NunitoSans_Regular', 'PingFangSC-Medium', Arial, sans-serif;
		background: #ecfbff;
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-attachment: fixed;
	}

	@media screen and (min-width: 750px) {
		page {
			background-color: #fff;
		}
		

	


	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.content {
		// opacity: 0;
		// animation: fadeIn 1s forwards; 
	}

	view {
		box-sizing: border-box;
	}

	.hidden {
		display: none !important;
	}

	body uni-toast .uni-toast {
		width: auto;
		border-radius: 12px;
		min-width: 70px;
		padding: 20rpx;
	}

	body uni-toast .uni-loading+.uni-toast__content {
		padding: 0;
		margin: 0;
	}

	body uni-toast .uni-toast .uni-loading {
		animation: none;
		margin-top: 0;
		width: 160px;
		height: 60px;
		// background: url(/static/pro/Profitero-Logo-03.png) no-repeat center / contain;
	}



	uni-toast .uni-toast,
	uni-toast .uni-sample-toast {
		width: auto;
		max-width: 500rpx;
		min-width: 220rpx;
		word-break: break-word;
		// border: 2px solid #248bf8 !important;
		border-radius: 12rpx;
		overflow: hidden;
	}

	::v-deep.u-modal {
		// border: 2px solid #248bf8 !important;
	}

	.uni-modal {
		background-color: #fff !important;
		color: white !important;
		position: relative;
		// height: 400rpx !important;
	}

	.uni-modal__hd ::before {
		content: '';
		display: block;
		width: 80%;
		height: 80rpx;
		margin-top: 20rpx;
		// margin: 40rpx 30rpx;
		// left: 50%;
		// transform: translateX(-50%);
		background: url(/static/home/ic_video_title.png) center no-repeat;
		background-size: contain;

	}

	::v-deep.uni-modal .uni-modal__title {
		font-size: 0;
		text-align: center !important;
		height: 100rpx;
		justify-content: center !important;
		display: flex !important;
	}

	.uni-modal__btn_default {
		// background-color: #4b4b4b !important;
		color: #666 !important;
		font-size: 14px !important;
		// font-weight: bold;
		border-radius: 20rpx !important;
		// margin: 0rpx 10rpx 40rpx 20rpx;

	}

	.uni-modal__btn_primary {
		// background-color: #237aff !important;
		color: #000 !important;
		font-size: 14px !important;
		// font-weight: bold;
		border-radius: 20rpx !important;
		// margin: 0rpx 20rpx 40rpx 10rpx;
	}

	uni-modal .uni-modal {
		border-radius: 12rpx;
		// border: 2px solid #248bf8;
	}

	uni-modal .uni-modal__btn:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		// border-left: none !important;
		color: transparent !important;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleX(.5);
		transform: scaleX(.5);

	}


	uni-modal .uni-modal__ft:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		// border-top: none !important;
		/* color: #d5d5d6; */
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}

	// 
	uni-toast .uni-toast__content {
		padding: 10rpx;
	}

	uni-toast .uni-simple-toast__text {
		word-break: break-word;
		margin: 0;
		border-radius: 0;
	}

	uni-toast .uni-toast__icon {
		width: 150px;
		// height: 50px;
		object-fit: contain;
	}

	::v-deep uni-modal .uni-modal__bd {
		word-break: normal !important;
		max-width: 300px;
		width: 100%;
	}

	.header ::v-deep .uni-navbar__header-container {
		display: flex;
		flex: 1;
		padding: 0 10px;
		overflow: hidden;
		justify-content: space-around;
		align-items: center;
		font-size: 16px;
		font-weight: 700;
	}

	::v-deep .uni-navbar__header-btns {
		color: #092B8E;
	}

	/*每個頁面公共css */
	.margin_top_5 {
		margin-top: 5px !important;
	}

	.margin_top_10 {
		margin-top: 10px !important;
	}

	.margin_top_15 {
		margin-top: 15px !important;
	}

	.margin_top_20 {
		margin-top: 20px !important;
	}

	.margin_top_30 {
		margin-top: 30px !important;
	}

	.margin_top_40 {
		margin-top: 40px !important;
	}

	.space_between {
		display: flex;
		justify-content: space-between;
	}

	.flex_start {
		display: flex;
		justify-content: flex-start;
	}

	.align_center {
		display: flex;
		align-items: center;
	}

	.flex_center {
		display: flex;
		justify-content: center;
	}

	.flex_end {
		display: flex;
		justify-content: flex-end;
	}

	.hidden {
		display: none !important;
	}

	::v-deep .uni-modal__bd {
		word-wrap: break-word;
		word-break: normal;
	}

	::v-deep .uni-btn-icon {
		overflow: visible !important;
	}

	::v-deep.uni-page-head {
		background-color: #0c1b30 !important;
		// border-bottom-left-radius: 30rpx !important;
		// border-bottom-right-radius: 30rpx !important;
	}

	::v-deep.uni-page-head__title {
		color: #2ba0cf !important;
	}

	::v-deep.uni-btn-icon {
		color: #2ba0cf !important;
	}

	uni-page-head .uni-btn-icon {
		line-height: 1.5;
	}

	uni-modal .uni-modal,
	uni-toast .uni-toast,
	uni-toast .uni-sample-toast {
		border-radius: 10px;
		min-width: 120px;
		font-family: 'NunitoSans_Regular', 'PingFangSC-Medium', Arial, sans-serif !important;
	}

	uni-modal .uni-modal__ft {
		font-size: 16px;
	}

	uni-modal .uni-modal__bd {
		word-break: break-word;
		font-size: 12px;
	}

	uni-toast .uni-toast,
	uni-toast .uni-sample-toast {
		width: auto;
		max-width: 500rpx;
		word-break: break-word;
	}

	uni-toast .uni-toast__content {
		padding: 10px 30rpx;
	}

	uni-toast .uni-simple-toast__text {
		padding: 30rpx;
		word-break: break-word;
	}

	uni-toast .uni-toast__icon {
		width: 50px;
		height: 50px;
		object-fit: contain;
	}

	img {
		max-width: 100%;
	}

	.img-to-mask {
		mask-position: center;
		mask-repeat: no-repeat;
		mask-size: contain;
		background-color: $main-color;
		width: 100%;
	}

	::v-deep .uni-picker-item {
		font-family: 'NunitoSans_Regular', 'PingFangSC-Medium', Arial, sans-serif !important;
	}

	::v-deep .uni-picker-header {
		font-family: 'NunitoSans_Regular', 'PingFangSC-Medium', Arial, sans-serif !important;
	}
</style>