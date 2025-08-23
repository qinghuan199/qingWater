<script>
	import permision from "@/js_sdk/wa-permission/permission.js"
	import _action from './common/_action';
	import _get from './common/_get';
	import _data from './common/_data';
	import _page from './common/common';
	import SDK from "./common/tendenceImSdk";
	// #ifdef APP-PLUS
	// import TIM from 'tim-wx-sdk';
	import {
		genTestUserSig
	} from './debug/GenerateTestUserSig.js';
	// 首先需要通过 uni.requireNativePlugin("ModuleName") 获取 module
	const TUICalling = uni.requireNativePlugin('TencentCloud-TUICallKit');
	console.error(TUICalling, 'TUICalling ｜ ok');
	const TUICallingEvent = uni.requireNativePlugin('globalEvent');
	// #endif

	export default {
		globalData: {
			/** 代理客户id */
			agent_id: 1,
			/** http 服务端地址 */
			http_url: 'https://im.laiyuan.cc',
			// http_url: 'http://101.42.48.76',
			/** 静态文件存放地址 */
			static_url: 'https://im.laiyuan.cc',
			// static_url: 'http://101.42.48.76',

			/** socket 服务端地址 */
			socket_url: 'wss://im.laiyuan.cc/wss',
			/** socket 连接状态 */
			socket_state: 0,
			/** 好友申请通知 */
			new_friend_tips_num: 0,
			/** 群认证通知 */
			new_group_tips_num: 0,
			/** 朋友圈通知 */
			no_reader_circle: 0,
			/** 朋友圈消息未读数 */
			no_reader_circle_chat_num: 0,
			/** 缓存的数据 */
			cache: {
				/** 个人头像缓存数据 */
				local_photo: '',
			},
			/** 用户信息 */
			user_info: {
				id: 0,
				nickname: '',
				username: '',
				photo: 'default_man/70.jpg',
				doodling: '',
				phone: '',
				circle_img: 'default_circle_img.jpg?_=3.1415926',
				is_customer_service:null,
			},
			isOnlie: true,
			dragInfo: {
				moveX: 260,
				moveY: 180,
				state: -1
			}
		},
		onLaunch() {
			// 登录腾讯IM
			// #ifdef APP-PLUS
			// uni.$TUIKit = TIM.create({
			// 	SDKAppID: genTestUserSig('').sdkAppID
			// });
			// 将原生插件挂载在 uni 上
			uni.$TUICalling = TUICalling;
			uni.$TUICallingEvent = TUICallingEvent;
			// #endif

			this.$store.commit('initRECORD');

			// 其他监听
			//#ifdef APP-PLUS
			// plus.push.addEventListener("click", function(msg) {
			// 	console.log("msg.payload", JSON.stringify(msg.payload));
			// 	let content_type = msg.payload.content_type;
			// 	if (Object.keys(msg.payload).length) {
			// 		switch (parseInt(content_type)) {
			// 			case 6:
			// 			case 7:
			// 				uni.navigateTo({
			// 					url: '/pages/chat/videoCall?' + _page.pageParam(msg.payload)
			// 				});
			// 				break;
			// 		}
			// 	}
			// 	//这里可以写跳转业务代码
			// }, false);
			// 监听在线消息事件
			// plus.push.addEventListener("receive", function(msg) {
			// 	// plus.ui.alert(2);
			// 	//这里可以写跳转业务代码
			// 	console.log("recevice:" + JSON.stringify(msg))
			// }, false);

			//#endif

			// #ifdef APP-PLUS
			/** 锁定屏幕方向 */
			plus.screen.lockOrientation('portrait-primary');
			// let main = plus.android.runtimeMainActivity();
			// //为了防止快速点按返回键导致程序退出重写quit方法改为隐藏至后台
			// plus.runtime.quit = function(){
			//     return false;
			// };

			//重写toast方法如果内容为 ‘再按一次退出应用’ 就隐藏应用，其他正常toast
			//       plus.nativeUI.toast = (function(str){
			//           if(str == '再按一次退出应用'){
			//               return false;
			//           }else{
			// return false;
			//               // uni.showToast({
			//               //     title: '再按一次退出应用',
			//               //     icon:'none',
			//               // })
			//           }
			//       });
			/** 检测升级 */
			let _this = this;

			plus.runtime.getProperty(plus.runtime.appid, function(info) {
				_this.$httpSend({
					path: '/im/app/update',
					data: {
						appid: info.appid,
						version: info.version,
					},
					success(res) {
						if (res.status) {
							_action.checkFail();
							let wgtWaiting = plus.nativeUI.showWaiting("更新开始下载"),
								update_url = (plus.os.name == 'Android' ? res.update_url.android : res
									.update_url.ios),
								downloadTask = uni.downloadFile({
									url: update_url,
									success: (res) => {
										wgtWaiting.close();
										if (res.statusCode === 200) {
											plus.runtime.install(res.tempFilePath, {}, () => {
												plus.runtime.restart();
											}, (e) => {
												uni.showModal({
													content: "update error [" + e
														.code + "]：" + e.message,
													showCancel: false,
												});
											});
										} else {
											uni.showModal({
												content: "api error update fail!",
												showCancel: false,
											});
										}
									}
								});
							downloadTask.onProgressUpdate((res) => {
								wgtWaiting.setTitle('下载中...' + res.progress + '%');
							});
						}
					},
				});
			});
			// #endif
			//登陆腾讯im
			// #ifdef APP-PLUS
			// let localLoginData = uni.getStorageSync('localLoginData');
			// if (localLoginData) {
			// 	SDK.IMSDK.joinRoom(localLoginData, function(sdk_ret) {
			// 		console.log(sdk_ret);
			// 		console.log("99999999999999999999999999");
			// 	})
			// }
			// #endif


		},
		onShow() {
			//在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined）
			let curParam = this.options || this.$route.query;
			if (curParam.channelCode) {
				_data.localData('channelCode', curParam.channelCode)
			} else {
				_data.localData('channelCode', '')
			}

			// #ifdef APP-PLUS
			this.requestAn()
			// #endif
			let _this = this;
			if (!_data.localData('token')) {
				return;
			}
			/**
			 * 每次app启动都加载最新的会话列表数据，只要是最新的会话列表数据，会话界面数据也会是最新的
			 * 这里延时100ms,不然会全局变量没有加载完成，会报错。
			 */
			if (_data.data('socket_state') <= 0) {
				_this.$reset().$reconnect(function() {
					if (_data.localData('token')) _get.getChatList();

				});
			}
			/**
			 * @param {Object} res
			 * 监听网络变化
			 * 如果有网络变化，断开socket，再重新连接
			 * 重新获取会话列表数据
			 * 如果是在会话界面，再重新获取这个的对话数据
			 */
			uni.onNetworkStatusChange(function(res) {
				console.log("App  onNetworkStatusChange...");
				/** 断开重新再连接，再获取最新数据 */
				if (_data.data('socket_state') <= 0 && _data.localData('token')) {
					_this.$reset().$reconnect(function() {
						if (_data.localData('message_list_id') && _data.localData('token')) {
							_get.getChatData({
								send_data: {
									list_id: _data.localData('message_list_id'),
									time: 0,
									is_up: 1,
								},
								is_action_data: 1,
							});
						}
					});
				}
			});
		},
		onHide() {
			this.globalData.isOnlie = false;
		},
		methods: {
			requestAn() {
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						permision.requestAndroidPermission("android.permission.RECORD_AUDIO")
						break;
					case 'ios':
						permision.judgeIosPermission("record")
						break;
				}

			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/** uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import "./static/css/font/iconfont.css";
	@import "./static/css/font/iconfont-im.css";
	@import "./static/css/uni.css";

	/** 设置 body 的背景色 */
	page {
		background-color: #f9f9f9;
	}

	/** 导航栏自定义图标样式调整 */
	.uni-page-head .uni-btn-icon {
		min-width: auto !important;
		overflow: inherit !important;
	}

	uni-checkbox .uni-checkbox-input {
		border-radius: 50%;
		width: 18px !important;
		height: 18px !important;
		border: 1px solid #007aff !important;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background-color: #007aff;
		border: 1px solid #007aff !important;
		color: white !important;
	}

	uni-checkbox .uni-checkbox-wrapper {
		width: 100%;
	}

	/* #endif */
</style>
