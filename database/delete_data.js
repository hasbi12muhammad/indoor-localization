const db = require('./config_db');

db.serialize(function(){

    let sql = `DELETE FROM rssi_table`;

    db.run(sql, (err) => {
        if (!err) console.log("All data deleted");
    });

});

db.close();