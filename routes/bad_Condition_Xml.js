var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
var json2xml = require('js2xmlparser');
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
                        var installation = json2xml.parse("installations", donnees); 
                        console.log(installation);                       
                        res.set('Content-type', 'application/xml');
                        res.send(installation);
                    }
                });
            }
        });
    });
});

function bad_Data(data){
    var installation = data;
    var bad_Installations = [];
    var insert = false;
    for (insta in installation) {
        if ("condition" in installation[insta]) {
            if (installation[insta].condition === "mauvaise") {
                insert = false;
                for(bad_Insta in bad_Installations){
                    if(compareStrings(bad_Installations[bad_Insta].name, installation[insta].name) === 1){
                        bad_Installations.splice(bad_Insta, 0, installation[insta]);
                        insert = true;
                        break;
                    }else if(compareStrings(bad_Installations[bad_Insta].name, installation[insta].name) === 0){
                        bad_Installations.splice(bad_Insta + 1, 0, installation[insta]);
                        insert = true;
                        break;                                            
                    }
                }
                if(!insert){
                   bad_Installations.push(installation[insta]); 
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

//res.render('installation.pug', {donnees:donnees, len:donnees.length});
module.exports = router;