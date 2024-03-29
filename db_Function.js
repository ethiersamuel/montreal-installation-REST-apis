// Inspired from : https://www.w3schools.com/nodejs/nodejs_mongodb_drop.asp 
//
//W3Schools is optimized for learning, testing, and training. Examples might be simplified to improve reading 
//and basic understanding. Tutorials, references, and examples are constantly reviewed to avoid errors, but we 
//cannot warrant full correctness of all content. While using this site, you agree to have read and accepted 
//our terms of use, cookie and privacy policy. Copyright 1999-2017 by Refsnes Data. All Rights Reserved.
//Powered by W3.CSS.

var db = require('./db.js');
const logger = require('heroku-logger');

//Drops the collection installations_Data if it exist
//Needs a callback in parameter
//Returns a callback
module.exports.drop = function (callback) {
    db.getConnection(function (err, db) {
        if (err) {
            logger.error("Impossible de se connecter à la base de données : " + err);
            return callback(err, null);
        } else {
            db.collections(function (err, collections) {
                if (err) {
                    logger.error("Impossible d'accéder aux collections : " + err);
                    return callback(err, null);
                } else {
                    drop_Or_Callback(db, callback);
                }
            });
        }
    });
}

var drop_Or_Callback = function (db, callback) {
    db.collections(function (err, collections) {
        if (collections.length > 0) {
            if (collections[0].s.name === "installations") {
                db.dropCollection("installations", function (err, res) {
                    if (err) {
                        logger.error("Impossible de drop la collection : " + err);
                        return callback(err, null);
                    } else {
                        logger.info("Collection drop avec succès : " + res);
                        return callback(null, res);
                    }
                });
            }
        } else {
            logger.info("La collection n'existe pas : " + true);
            return callback(null, true);
        }
    });
}

//Inserts installations data in the collection installations_Data from the montreal_Data database
//Needs data and a callback in parameter
//Returns a callback
module.exports.data_Insert = function (data, callback) {
    db.getConnection(function (err, database) {
        if (err) {
            logger.error("Impossible de se connecter à la base de données : " + err);
            return callback(err, null);
        } else {
            database.collection("installations", function (err, collection) {
                if (err) {
                    logger.error("Impossible d'accéder à la collection : " + err);
                    return callback(err, null);
                } else {
                    collection.insert(data, function (err, res) {
                        if (err) {
                            logger.error("Impossible d'insérer des données dans la collection : " + err);
                            return callback(err, null);
                        } else {
                            logger.info("Insertion réussi : " + res);
                            return callback(null, res);
                        }
                    });
                }
            });
        }
    });
}
