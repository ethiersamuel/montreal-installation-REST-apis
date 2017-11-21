var request = require('request');
var xml_To_Json = require('xml2js');
var csv_To_Json = require('csvtojson');
var db = require('./db.js');
var json_Array = [];

function import_Data(callback) {
    request.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml', function (err, res, body) {
        if (err) {
            return callback(err, null);
        } else {
            xml_To_Json.parseString(body, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    json_Array.push(data.glissades.glissade);
                    request.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml', function (err, res, body) {
                        if (err) {
                            return callback(err, null);
                        } else {
                            xml_To_Json.parseString(body, function (err, data) {
                                if (err) {
                                    return callback(err, null);
                                } else {
                                    json_Array.push(data.patinoires.patinoire);
                                    csv_To_Json()
                                        .fromStream(request.get('http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv'))
                                        .on('json', (json) => {
                                            json_Array.push(json);
                                        })
                                        .on('done', (err, res) => {
                                            if (err) {
                                                return callback(err, null);
                                            } else {
                                                data_To_Db(json_Array, function (err, res) {
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
                    });
                }
            });
        }
    });
}

function data_To_Db(data, callback) {
    db.getConnection(function (err, db) {
        if (err) {
            return callback(err, null);
        } else {
            db.collection('donnees', function (err, collection) {
                if (err) {
                    return callback(err, null);
                } else {
                    collection.insertMany(data, function (err, res) {
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

module.exports.import_Piscine = import_Data(function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});