const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const sqlCon = require('express-myconnection');
require('dotenv').config();

// Fill your DB connection data here
let dbOptions = {
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
};

app.use(sqlCon(require('mysql'), dbOptions, 'pool'));

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/app/user/auth", function(req, res) {
	var userData = req.body; // {username, password}
	
    req.getConnection(function(err, sql) {
		sql.query("SELECT password, userID FROM users WHERE username = \"" + userData.username + "\"",function(e, result, fields) {
			if (e) {
				res.json({
					status: 'error occurred'
				});
            }
            else {
                if (result.length == 0) {
                    res.json({
						status: 'user does not exist'
					});
                }
                else if (result[0].password == userData.password) {
                    res.json({
						status: 'success',
						userID: result[0].userID
					});
                }
                else {
					res.json({
						status: 'error occurred'
					});
                }
            }
		});
	});
});

app.post("/app/user", function(req, res) {
	var userData = req.body; // {username, password}
	
    req.getConnection(function(err, sql) {
		sql.query("SELECT password FROM users WHERE username = \"" + userData.username + "\"",function(e, result, fields) {
			if (e) {
				res.json({
					status: 'error occurred'
				});
            }
            else {
                if (result.length == 0) {
                    sql.query("INSERT INTO users SET ?", userData, function(e) {
                        if (e) {
							res.json({
								status: 'error occurred'
							});
                        }
                        else {
							res.json({
								status: 'account created'
							});
                        }
                    });
                }
                else {
					res.json({
						status: 'user already exists'
					});
                }
            }
		});
	});
});

app.get("/app/sites/list/", function(req, res) {
	var userID = req.query.userID;
	
    req.getConnection(function(error, sql) {
		sql.query("SELECT NOTES FROM users WHERE userID = \"" + userID + "\"", function(e, result, fields) {
			if (e) {
				res.json({
					status: 'error occurred'
				});
            }
            else {
                res.json(result[0].notes);
            }
		});
	});
});

app.post("/app/sites", function(req, res) {
	var userID = req.query.userID;
	var note = req.body.note;

    req.getConnection(function(error, sql) {
		sql.query("Select note from user" + +"INSERT INTO users SET ?", note, function(e) {
			if (e) {
				res.json({
					status: 'error occurred'
				});
			}
			else {
				res.json({
					status: 'account created'
				});
			}
		});
	});
});

app.listen(process.env.PORT || 8080, function() {
    console.log("Starting Server");
    console.log(">  Server is running at http://localhost" + ":" + (process.env.PORT || "8080"));
});
