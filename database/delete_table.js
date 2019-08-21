const db = require('./config_db');

db.serialize(function(){

    let sql = `DROP TABLE rssi_table`;

    db.run(sql, (err) => {
        if (!err) console.log("Table deleted");
    });

});

db.close();