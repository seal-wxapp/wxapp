/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	//app.js
	App({
	  onLaunch: function onLaunch() {
	    //调用API从本地缓存中获取数据
	    var logs = wx.getStorageSync('logs') || [];
	    logs.unshift(Date.now());
	    wx.setStorageSync('logs', logs);
	  },
	  getUserInfo: function getUserInfo(cb) {
	    var that = this;
	    if (this.globalData.userInfo) {
	      typeof cb == "function" && cb(this.globalData.userInfo);
	    } else {
	      //调用登录接口
	      wx.login({
	        success: function success() {
	          wx.getUserInfo({
	            success: function success(res) {
	              that.globalData.userInfo = res.userInfo;
	              typeof cb == "function" && cb(that.globalData.userInfo);
	            }
	          });
	        }
	      });
	    }
	  },
	  globalData: {
	    userInfo: null
	  }
	});

/***/ }
/******/ ]);