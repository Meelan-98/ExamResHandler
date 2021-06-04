var mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();

// const dbSettings = {
//     connectionLimit: Number.parseInt(process.env.DB_CONNECTIONLIMIT),
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE
// }

// const dbSettings = {
//     connectionLimit : 10,
//     user : "root",
//     password : "Meelan@37562" ,
//     host : "localhost",
//     database : "examdb"
// }

const dbSettings = {
    connectionLimit : 10,
    user : "admin",
    password : "NJADMINpass" ,
    host : "examdb.cnvxsdjybrlr.us-east-2.rds.amazonaws.com",
    database : "examdb"
}
var pool  = mysql.createPool(dbSettings);
 
function executeSQL(sql,placeholder){
    return new Promise((res,rej)=>{
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
           
            // Use the connection
            connection.query(sql,placeholder, async (error, results, fields)=> {

                // When done with the connection, release it.
                connection.release();
            
                // Handle error after the release.
                if (error){
                    rej({error});
                }
                res(results);
            
                // Don't use the connection here, it has been returned to the pool.
            });
          });
    });
}

module.exports = {executeSQL};