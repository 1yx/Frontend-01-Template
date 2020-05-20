const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log('request received');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'Bar');
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'charset': 'UTF-8'
    });
    res.end(
        fs.readFileSync('./index.html')
    );
});

server.listen(8888);