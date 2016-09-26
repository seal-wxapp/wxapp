//index.js
//获取应用实例
var util = require('../../utils/util.js');
console.log(util);
var ajaxurl = require('../../utils/ajaxurl.js');
console.log(ajaxurl);
var app = getApp()
Page({
	data: {
		motto: 'Hello World',
		userInfo: {}
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function () {
		console.log('onLoad')
		var that = this
		//调用应用实例的方法获取全局数据
		// pro('lalal').then(function(res) {
		// 	console.log(res);
		// });
		app.getUserInfo(function(userInfo){
			//更新数据
			that.setData({
				userInfo:userInfo
			})
		})
	}
})
/*
// 请别再ES5模式下写ES6代码, uglify压缩不支持
function pro(msg) {
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			resolve(msg)
		},1000)
	})
}*/
