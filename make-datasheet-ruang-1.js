const http = require('http');
const fs = require('fs')

//create a server object:
http.createServer(function (req, res) {
    //end the response
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk)
        //console.log(body)
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        fs.writeFile("/file_data_sheet/datasheet_ruang", "Hey there!", function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 

        res.write(body); //write a response to the client
        res.end();
    })
}).listen(8080); //the server object listens on port 8080 