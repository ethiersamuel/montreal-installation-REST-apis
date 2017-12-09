var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
var json = [];

//This route is /installations and you can had a parameter name arrondissement. Without the parameter, it provides you all
//the installations and with the parameter, only the installations in the particular area. Everything is in json format.
router.get('/', function (req, res) {
    db.getConnection(function (err, db) {
        db.collection('installations', function (err, collection) {
            if (err) {
                res.sendStatus(500);
            } else {       
                //The route don't have parameter         
                if(Object.keys(req.query).length === 0){
                    collection.find().toArray(function (err, data) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.json(data);
                        }
                    });
                //The route with the parameter arrondissement
                }else{
                    //The parameter arrondissement
                    var area = req.query.arrondissement;
                    collection.find({ "area": area }).toArray(function (err, data) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.json(data);
                        }
                    });
                }
            }
        });
    });
});

//res.render('installations.pug', {donnees:donnees, len:donnees.length});
module.exports = router;