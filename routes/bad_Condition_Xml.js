var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db.js');
const logger = require('heroku-logger');
var json = [];

//This route is bad_Condition_Xml and it provide the same thin as /bad_Condition but in xml format
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
                    collection.find().toArray(function (err, data) {
                        if (err) {
                            logger.error("Impossible de trouver les données dans la collection : " + err);
                            res.sendStatus(500);
                        } else {
                            var installations_Json = bad_Data(data);
                            var installations_Xml = json_To_Xml(installations_Json);
                            res.set('Content-type', 'application/xml');
                            res.send(installations_Xml);
                            logger.info("Les données ont été transformés et affichés.");
                        }
                    });
                }
            });
        }

    });
});

//Form an xml string containing the installations from the json variable
//Needs the installations in json as parameter
//Returns a xml string
function json_To_Xml(installations_Json) {
    var installations_Xml;
    if (json.lenght === 0) {
        installations_Xml = "<installations />";
    } else {
        installations_Xml = "<installations>";
        for (installation in installations_Json) {
            installations_Xml += "<installation><id>" + installations_Json[installation]._id + "</id>";
            installations_Xml += "<type>" + installations_Json[installation].type + "</type>";
            installations_Xml += "<nom>" + installations_Json[installation].name + "</nom>";
            installations_Xml += "<arrondissement>" + installations_Json[installation].area + "</arrondissement>";
            installations_Xml += "<condition>" + installations_Json[installation].condition + "</condition></installation>";
        }
        installations_Xml += "</installations>";
    }
    return installations_Xml;
}

//Form an array of the installation in bad condition and sort it in order at each inserting time
//Needs data in parameter
//Returns a json array of installation in bad condition
function bad_Data(data) {
    var installations = data;
    var bad_Installations = [];
    var insert = false;
    for (installation in installations) {
        if ("condition" in installations[installation]) {
            //The installation is in bad condition
            if (installations[installation].condition == "Mauvaise") {
                insert = false;
                //Sort in order the array of bad installation
                for (bad_Insta in bad_Installations) {
                    //The installation name is lower then the installation name in the array
                    if (compareStrings(bad_Installations[bad_Insta].name, installations[installation].name) === 1) {
                        bad_Installations.splice(bad_Insta, 0, installations[installation]);
                        insert = true;
                        break;
                        //The installation name is equal to the installation name in the array
                    } else if (compareStrings(bad_Installations[bad_Insta].name, installations[installation].name) === 0) {
                        bad_Installations.splice(bad_Insta + 1, 0, installations[installation]);
                        insert = true;
                        break;
                    }
                }
                //The installation was the highest of the array, so I need to push, because I can't slice on the last cell of the array
                if (!insert) {
                    bad_Installations.push(installations[installation]);
                }
            }
        }
    }
    return bad_Installations;
}

//Compare strings
//Needs two strings in parameter
//Returns a int representing the result of the compare
function compareStrings(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1
    } else {
        return 0;
    }
}

module.exports = router;