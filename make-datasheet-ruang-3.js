const http = require('http');

//create a server object:
http.createServer(function (req, res) {
    //end the response
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk)
        //console.log(body)
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log(body)
        res.write(body); //write a response to the client
        res.end();
    })
}).listen(8080); //the server object listens on port 8080 