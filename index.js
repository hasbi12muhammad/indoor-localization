let db = require('D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/SERVER/database/config_db.js');
const http = require('http');
//let mac1;
const mac1 = "3C:71:BF:C4:E1:F4";
const mac2 = "B4:E6:2D:B7:72:45";

//let post = []
let rssi = []
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
            console.log(body)
            if (body.mac == mac1) {
                rssi[0] = body.rssi
            } else if (body.mac == mac2) {
                rssi[1] = body.rssi
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
            // At this point, we have the headers, method, url and body, and can now
            // do whatever we need to in order to respond to this request.
        });
    }
}).listen(8080);