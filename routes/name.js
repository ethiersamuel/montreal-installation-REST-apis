var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
var json = [];
var name;

router.get('/', function (req, res) {
    db.getConnection(function (err, db) {
        db.collection('donnees', function (err, collection) {
            if (err) {
                res.sendStatus(500);
            } else {
                collection.find().toArray(function (err, donnees) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.render('installations.pug', {installations:donnees, length:donnees.len});
                    }
                });
            }
        });
    });
});

//res.render('installations.pug', {donnees:donnees, len:donnees.length});
module.exports = router;