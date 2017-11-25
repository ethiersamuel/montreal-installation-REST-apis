var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('c:/users/utilisateur/inf4375/db.js');
var pug = require('pug');
var json = [];
var flatten = require('flat');

router.get('/', function (req, res) {
    db.getConnection(function (err, db) {
        db.collection('donnees', function (err, collection) {
            if (err) {
                res.sendStatus(500);
            } else {
                var area = req.query.arrondissement;
                collection.find({$or:[{ARRONDISSE:area}, {"arrondissement.nom_arr":area}]}).toArray(function (err, donnees) {
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