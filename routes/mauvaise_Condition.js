var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
var json = [];

router.get('/', function (req, res) {
    db.getConnection(function (err, db) {
        db.collection('donnees', function (err, collection) {
            if (err) {
                res.sendStatus(500);
            } else {
                var area = req.query.arrondissement;
                collection.find({condition:"Mauvaise"}).toArray(function (err, donnees) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.json(donnees);
                    }
                });
            }
        });
    });
});

//res.render('installations.pug', {donnees:donnees, len:donnees.length});
module.exports = router;