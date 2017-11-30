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
                collection.find().toArray(function (err, donnees) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        var installations = donnees;
                        var bad_Installations = [];
                        var insert = false;
                        for (installation in installations) {
                            if ("condition" in installations[installation]) {
                                if (installations[installation].condition === "mauvaise") {
                                    insert = false;
                                    for(bad_Insta in bad_Installations){
                                        if(compareStrings(bad_Installations[bad_Insta].name, installations[installation].name) === 1){
                                            bad_Installations.splice(bad_Insta, 0, installations[installation]);
                                            insert = true;
                                            break;
                                        }else if(compareStrings(bad_Installations[bad_Insta].name, installations[installation].name) === 0){
                                            bad_Installations.splice(bad_Insta + 1, 0, installations[installation]);
                                            insert = true;
                                            break;                                            
                                        }
                                    }
                                    if(!insert){
                                       bad_Installations.push(installations[installation]); 
                                    }
                                }
                            }
                        }
                        res.json(bad_Installations);
                    }
                });
            }
        });
    });
});

function compareStrings(a, b) {
    if(a < b){
        return -1;
    }else if(a > b){
        return 1
    }else{
        return 0;
    }
}

//res.render('installations.pug', {donnees:donnees, len:donnees.length});
module.exports = router;