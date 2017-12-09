// Inspired from : https://www.w3schools.com/nodejs/nodejs_mongodb_drop.asp 
//
//W3Schools is optimized for learning, testing, and training. Examples might be simplified to improve reading 
//and basic understanding. Tutorials, references, and examples are constantly reviewed to avoid errors, but we 
//cannot warrant full correctness of all content. While using this site, you agree to have read and accepted 
//our terms of use, cookie and privacy policy. Copyright 1999-2017 by Refsnes Data. All Rights Reserved.
//Powered by W3.CSS.

var db = require('./db.js');

//Drops the collection installations_Data if it exist
//Needs a callback in parameter
//Returns a callback
module.exports.drop = function (callback) {
    db.getConnection(function (err, db) {
        if (err) {
            return callback(err, null);
        } else {
            db.collections(function (err, res) {
                if (err) {
                    return callback(err, null);
                } else {
                    //In case that the collection don't exist
                    if (res.length) {
                        db.dropCollection("installations_data", function (err, res) {
                            if (err) {
                                return callback(err, null);
                            } else {
                                return callback(null, res);
                            }
                        });
                    } else {
                        //This is not an error, it is possible that the collection don't exist
                        return callback(null, true);
                    }
                }
            });
        }
    });
}

//Inserts installations data in the collection installations_Data from the montreal_Data database
//Needs data and a callback in parameter
//Returns a callback
module.exports.data_Insert = function (data, callback) {
    db.getConnection(function (err, dataBase) {
        if (err) {
            return callback(err, null);
        } else {
            dataBase.collection("installations_data", function (err, collection) {
                if (err) {
                    return callback(err, null);
                } else {
                    collection.insert(data, function (err, res) {
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, res);
                        }
                    });
                }
            });
        }
    });
}
