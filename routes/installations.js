var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('c:/users/utilisateur/inf4375/db.js');

router.get('/', function (req, res) {
    db.getConnection(function (err, db) {
        db.collection('donnees', function (err, collection) {
            if (err) {
                res.sendStatus(500);
            } else {
                var area = req.query.arrondissement;
                var query = "[[{arrondissement:[{nom_arron:LaSalle}]}]]";
                collection.find(area).toArray(function (err, donnees) {
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

module.exports = router;