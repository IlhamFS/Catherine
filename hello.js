var http = require('http');
http.createServer(function (req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080, '10.130.23.176');
console.log('Server running at http://10.130.23.176:8080/');
