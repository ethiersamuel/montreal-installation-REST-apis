// Inspired from : https://www.w3schools.com/nodejs/nodejs_mongodb_drop.asp 
//
//W3Schools is optimized for learning, testing, and training. Examples might be simplified to improve reading 
//and basic understanding. Tutorials, references, and examples are constantly reviewed to avoid errors, but we 
//cannot warrant full correctness of all content. While using this site, you agree to have read and accepted 
//our terms of use, cookie and privacy policy. Copyright 1999-2017 by Refsnes Data. All Rights Reserved.
//Powered by W3.CSS.


var db = require('./db.js');

module.exports.drop = function (callback) {
    db.getConnection(function (err, db) {
        if (err) {
            return callback(err, null);
        } else {
            db.collections(function (err, res) {
                if (err) {
                    return callback(err, null);
                } else {
                    if (res.length) {
                        db.dropCollection("donnees", function (err, res) {
                            if (err) {
                                return callback(err, null);
                            } else {
                                return callback(null, res);
                            }
                        });
                    } else {
                        //This is not an error, it is possible that the collection don't exist
                        return callback(null, res);
                    }
                }
            });
        }
    });
}

module.exports.data_Insert = function (data, callback) {
    //maybe removethis get connection because I always create a connection before, on the drop that i do before insert new data
    db.getConnection(function (err, dataBase) {
        if (err) {
            db.close();
            return callback(err, null);
        } else {
            dataBase.collection('donnees', function (err, collection) {
                if (err) {
                    db.close();
                    return callback(err, null);
                } else {
                    collection.insert(data, function (err, res) {
                        if (err) {
                            db.close();
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
