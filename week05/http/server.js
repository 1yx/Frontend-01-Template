const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req);

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'Bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

server.listen(8888);
