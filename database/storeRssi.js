let db = require('./config_db');

db.serialize(function(){
    let sql = `INSERT INTO rssi_table (ruang,date_time,beacon1,beacon2) VALUES (?,?,?,?)`;
    let stmt = db.prepare(sql);
    var values = [
        ["Ruang 1", new Date(Date.now()).toString(),-31,-90],
        ["Ruang 1", new Date(Date.now()).toString(),-31,-90],
        ["Ruang 1", new Date(Date.now()).toString(),-31,-90],
        ["Ruang 1", new Date(Date.now()).toString(),-31,-90]
    ];

    values.forEach((value) => {
        stmt.run(value, (err) => {
            if (err) throw err;
        });
    });
    console.log(`${values.length} record inserted`);
    stmt.finalize();
    
});

db.close();