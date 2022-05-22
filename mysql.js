var mysql = require('mysql');

var pool = mysql.createPool({
    "user": "root", //  process.env.MYSQL_USER
    "password": "123as321", //process.env.MYSQL_PASSWORD, //
    "database": "asteriskcdrdb", // process.env.MYSQL_DATABASE
    "host": "192.168.101.13", //process.env.MYSQL_HOST, 
    "port": 3306 //process.env.MYSQL_PORT // 
});

exports.pool = pool;