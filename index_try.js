//inisialisasi database
let db = require('D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/The Code/database/config_db.js');

//inisialisasi variabel server
const http = require('http');

//inisialisasi variabel mac esp32
const mac1 = "3C:71:BF:C4:E1:F4";
const mac2 = "B4:E6:2D:B7:72:45";

//variabel untuk menyimpan rssi yang dikirim esp32
let rssi = []

// Get process.stdin as the standard input object.
var standard_input = process.stdin;
var ruangan
// Set input character encoding.
standard_input.setEncoding('utf-8');

// Prompt user to input data in console.
console.log("Masukkan ruangan : ");

// When user input data and click enter key.
standard_input.on('data', function (input) {
    ruangan = input
    http.createServer((request, response) => {
        const { headers, method, url } = request;
        let body = [];
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
                    if (rssi[0] == 0 && rssi[1] == 0) {
                        console.log("All RSSI valued 0")
                    } else {
                        db.serialize(function () {
                            let sql = `INSERT INTO rssi_table (ruang,date_time,beacon1,beacon2) VALUES (?,?,?,?)`;
                            let stmt = db.prepare(sql);
                            let date_time = new Date();
                            let hr, mnt, sec;
                            if (date_time.getHours() < 10) {
                                hr = "0" + date_time.getHours()
                            } else {
                                hr = date_time.getHours()
                            }
                            if (date_time.getMinutes() < 10) {
                                mnt = "0" + date_time.getMinutes()
                            } else {
                                mnt = date_time.getMinutes()
                            }
                            if (date_time.getSeconds() < 10) {
                                sec = "0" + date_time.getSeconds()
                            } else {
                                sec = date_time.getSeconds()
                            }
                            let time = hr + ':' + mnt + ':' + sec;
                            var values = [
                                [ruangan, time.toString(), rssi[0], rssi[1]]
                            ];
                            values.forEach((value) => {
                                stmt.run(value, (err) => {
                                    if (err) throw err;
                                });
                            });
                            console.log(`${values.length} record inserted`);
                            stmt.finalize();
                        });
                    }

                    rssi[0] = null
                    rssi[1] = null
                }
            });
        }
    }).listen(8080);
});

//membuat server
