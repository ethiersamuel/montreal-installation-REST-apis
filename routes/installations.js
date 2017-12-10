var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
const logger = require('heroku-logger');
var json = [];

//This route is /installations and you can had a parameter name arrondissement. Without the parameter, it provides you all
//the installations and with the parameter, only the installations in the particular area. Everything is in json format.
router.get('/', function (req, res) {
    db.getConnection(function (err, db) {
        if (err) {
            logger.error("Impossible de se connecter à la base de données : " + err);
            res.sendStatus(500);
        } else {
            db.collection('installations', function (err, collection) {
                if (err) {
                    logger.error("Impossible d'accéder à la collection installations : " + err);
                    res.sendStatus(500);
                } else {
                    //The route don't have parameter         
                    if (Object.keys(req.query).length === 0) {
                        query_All_Installation(collection, res);
                        //The route with the parameter arrondissement
                    } else {
                        query_Area_Installation(collection, res, req);
                    }
                }
            });
        }
    });
});

function query_All_Installation(collection, res) {
    collection.find().toArray(function (err, data) {
        if (err) {
            logger.error("Impossible de trouver les données dans la collection : " + err);
            res.sendStatus(500);
        } else {
            logger.info("Les données ont été transformés et affichés.");
            res.json(data);
        }
    });
}

function query_Area_Installation(collection, res, req) {
    //The parameter arrondissement
    var area = req.query.arrondissement;
    collection.find({ "area": area }).toArray(function (err, data) {
        if (err) {
            logger.error("Impossible de trouver les données de l'arrondissement dans la collection : " + err);
            res.sendStatus(500);
        } else {
            logger.info("Les données de l'arrondissement ont été transformés et affichés.");
            res.json(data);
        }
    });
}

module.exports = router;