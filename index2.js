const http = require('http');
let mac1;
http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    // let url = request.url;
    if (url == "/tahap1") {
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = JSON.parse(body.toString());
            console.log(body, Date(Date.now()))
            // At this point, we have the headers, method, url and body, and can now
            // do whatever we need to in order to respond to this request.
        });
    }
}).listen(8080);