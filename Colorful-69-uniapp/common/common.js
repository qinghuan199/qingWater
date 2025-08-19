// export async function getUser() {

// 	if (getApp().getCache('userInfo') !== '') {
// 		let that = this;
// 		let postData = new Object();
// 		postData.requesTime = getApp().getTime();
// 		postData.userid = getApp().getCache('userInfo').userid;
// 		postData.token = getApp().getCache('userInfo').token;
// 		await getApp().getData('api/getuserinfo', postData, function(res) {
// 			console.log("我启动了", getApp().getCache('userInfo') !== '');
// 			getApp().setCache('userInfo', res.data.userInfo);
// 		});
// 	}
// }

/*
 *
 * @param {缓存key} key
 * @param {需要存储的缓存值} value
 * @param {过期时间，默认0表示永久有效} expire
 */
export function setCacheCheck(key, value, expire = 0) {
	console.log("我是缓存");
	let obj = {
		data: value, //存储的数据
		time: Date.now() / 1000, //记录存储的时间戳
		expire: expire //记录过期时间，单位秒
	}
	uni.setStorageSync(key, JSON.stringify(obj))
}
/*
 *
 * @param {缓存key} key
 */
export function getCacheCheck(key) {
	let val = uni.getStorageSync(key)
	console.log("我是提取", val);
	if (!val) {
		return null
	}
	val = JSON.parse(val)
	console.log(Date.now() / 1000 - val.time);
	console.log(val.expire);
	if (val.expire && Date.now() / 1000 - val.time > val.expire) {
		uni.removeStorageSync(key)
		return null
	}
	return val.data
}

export async function initswipToVerify() {
	var postData = new Object();
	postData.requesTime = getApp().getTime();
	await getApp().getData('api/login/get_config', postData, function(res) {
		// console.log('resultHandle', getCacheCheck('resultHandle'));
		if (getCacheCheck('resultHandle') === null && res.data.swip_to_verify === 1) {
			uni.navigateTo({
				url: "/pages/verify/verify"
			})
		} else {
			uni.navigateTo({
				url: "/pages/login/login"
			})
		}
		getApp().setCache('swip_to_verify', res.data.swip_to_verify);
		// console.log('swip_to_verify', getApp().getCache('swip_to_verify'));
	});

}