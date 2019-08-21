const db = require('./config_db');

db.serialize(function(){

    let sql = `CREATE TABLE IF NOT EXISTS rssi_table(
        ruang VARCHAR(64),
        date_time DATETIME,
        beacon1 INT(64),
        beacon2 INT(64)

    );`;
    db.run(sql, (err) => {
        if(err) throw err;
        console.log("Table created");
    });

});

db.close();
