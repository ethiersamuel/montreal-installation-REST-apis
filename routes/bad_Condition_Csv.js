var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
var json2csv = require('json2csv');
var utf8 = require('encoding');
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
                        var installations = json2csv({data:bad_Data(donnees.toString("utf8"))});                        
                        res.set('Content-Type', 'text/csv');
                        res.send(installations);
                        console.log(installations);
                    }
                });
            }
        });
    });
});

function bad_Data(data){
    var installations = data;
    var bad_Installations = [];
    var insert = false;
    for (insta in installations) {
        if ("condition" in installations[insta]) {
            if (installations[insta].condition === "mauvaise") {
                insert = false;
                for(bad_Insta in bad_Installations){
                    if(compareStrings(bad_Installations[bad_Insta].name, installations[insta].name) === 1){
                        bad_Installations.splice(bad_Insta, 0, installations[insta]);
                        insert = true;
                        break;
                    }else if(compareStrings(bad_Installations[bad_Insta].name, installations[insta].name) === 0){
                        bad_Installations.splice(bad_Insta + 1, 0, installations[insta]);
                        insert = true;
                        break;                                            
                    }
                }
                if(!insert){
                   bad_Installations.push(installations[insta]); 
                }
            }
        }
    }
    return bad_Installations;
};


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