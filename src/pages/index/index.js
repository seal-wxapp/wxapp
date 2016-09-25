//index.js
//获取应用实例
var util = require('../../utils/util');
console.log(util);
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
		pro('lalal').then(res => {
			console.log(res);
		});
		app.getUserInfo(function(userInfo){
			//更新数据
			that.setData({
				userInfo:userInfo
			})
		})
	}
})
    
function pro(msg) {
	return new Promise((resolve,reject) => {
		setTimeout(() => {
			resolve(msg)
		},1000)
	})
}