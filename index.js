const http = require('http');
let db = require('D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/SERVER/database/config_db.js');

const mac1 = "3C:71:BF:C4:E1:F4";
const mac2 = "B4:E6:2D:B7:72:45";

let post = []
let rssi = []
//create a server object:
http.createServer(function (req, res) {
    console.log('Incoming Device')
    //end the response
    let body = [];
    let url = req.url
    if (url == "/tahap1") {
        // console.log("masuk cuy 1")
        req.on('data', (chunk) => {
            // console.log(chunk)
            body.push(chunk)
        }).on('end', () => {
            post = JSON.parse(body.toString())
            console.log(post)
                if (post.mac == mac1) {
                    rssi[0] = post.rssi
                } else if (post.mac == mac2) {
                    rssi[1] = post.rssi
                }
                if (rssi[0] == null || rssi[1] == null) {
                    console.log("waiting another rssi...")
                } else if (rssi[0] != null && rssi[1] != null) {
                    db.serialize(function () {
                        let sql = `INSERT INTO rssi_table (ruang,date_time,beacon1,beacon2) VALUES (?,?,?,?)`;
                        let stmt = db.prepare(sql);
                        var values = [
                            ["Ruang 1", new Date(Date.now()).toString(), rssi[0], rssi[1]]
                        ];
                        values.forEach((value) => {
                            stmt.run(value, (err) => {
                                if (err) throw err;
                            });
                        });
                        console.log(`${values.length} record inserted`);
                        stmt.finalize();
                    });
                    rssi[0] = null
                    rssi[1] = null
                }
        })
        res.write("tahap1"); //write a response to the client
        res.end();
    } else if (url == "/tahap2") {
        res.write("tahap2"); //write a response to the client
        res.end();
    } else {
        res.write("not found"); //write a response to the client
        res.end();
    }
}).listen(8080); //the server object listens on port 8080 