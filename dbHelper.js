const mysql = require('mysql2');


const val = require('./constant');


var db = mysql.createConnection({
    host: val.host,
    user: val.user,
    password: val.password,
    database: val.database,
    multipleStatements: true,
    insecureAuth: true

});

db.connect((err) => {
    if (!err) {
        console.log("Connected");
    } else {
        console.log("Connection failed" + JSON.stringify(err, undefined, 2));
    }
});



async function excuteQuery(query, param) {
    try {
        if (db.state === 'disconnected') {
            console.log("** if con" + "excuteQuery" + "**" + db.state)
            db.connect();
        }
        console.log("**" + "excuteQuery" + "**" + db.state)
        return new Promise((resolve, reject) => {
            db.query(query, param, (err, results) => {
                if (err) return reject(err);
                return resolve(results);
            });

        }).catch((reason) => {
            console.log("Error is loged by promise")
            console.log(reason);
        })

    } catch (err) {
        console.log("_____DB EXCUTEQUERY ERR ______")
        console.log(err)
    }


}



module.exports = { db, excuteQuery };