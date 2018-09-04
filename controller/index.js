var express = require("express");
var router = express.Router();
var path = require('path');
var botLibrary = require('bot-library');

/* DB init */
var dbConfig = {
    "DB_URL":"mongodb://make1:make123@ds133642.mlab.com:33642/bot-library",
    "dbName": "bot-library"
}
var DB = botLibrary.Database;
var database = new DB(dbConfig);

/* GET home page. */
router.get("/html", function(req, res, next) {
  res.sendFile(path.join(__dirname,'../public/views/index.html'));
});

router.get("/getDocs", function(req, res, next) {
    database.getData("api","api-id").then( resp => {
        res.send(resp);
    })
  });

module.exports = router;