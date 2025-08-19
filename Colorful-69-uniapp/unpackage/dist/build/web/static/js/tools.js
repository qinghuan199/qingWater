//import CryptoJS from "crypto-js";
import CryptoJS from "@/node_modules/crypto-js/crypto-js.js";//一般npm以后都是这个位置
let KEY = 'bc9mvyytmuftyf1d'
let tools = {
	/*aes加密*/
	setAES(str) {
		const data = CryptoJS.enc.Utf8.parse(str);
		const key = CryptoJS.enc.Utf8.parse(KEY);
		var option = {
			mode: CryptoJS.mode.ECB,//看需求变“CBC”
			padding: CryptoJS.pad.Pkcs7//看需求变“ZeroPadding”
		};
		var encrypted = CryptoJS.AES.encrypt(data, key, option);
		const words = encrypted.toString();
		return words
	},
	/*aes解密*/
	decryptAES(str) {
		let data = CryptoJS.enc.Utf8.parse(str);
		const key = CryptoJS.enc.Utf8.parse(KEY);
		var option = {
			mode: CryptoJS.mode.ECB,//看需求变“CBC”
			padding: CryptoJS.pad.Pkcs7//看需求变“ZeroPadding”
		};
		var decrypted = CryptoJS.AES.decrypt(data, key, option);
		const words = encrypted.toString(CryptoJS.enc.Utf8);
		return words
	}

};

export default tools;
