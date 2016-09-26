var server1 = 'https://im.server1.url';
var server2 = 'https://im.server2.url';

var server = null;
        
if(NODE_ENV === 'dev') {
	server = server1;
} else if(NODE_ENV === 'production') {
	server = server2;
}
  
module.exports = server;