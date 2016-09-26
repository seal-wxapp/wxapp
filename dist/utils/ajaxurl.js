var server1 = 'https://im.server1.url';
var server2 = 'https://im.server2.url';

var server = null;
// es6 版本
if(dev === 'dev') {
	server = server1;
} else if(dev === 'production') {
	server = server2;
}
// es5 版本
/*if('dev' === 'dev') { // dev 要写字符串
	server = server1;
} else if('dev' === 'production') {
	server = server2;
}*/
module.exports = server;