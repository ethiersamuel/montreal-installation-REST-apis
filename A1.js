var request = require('request');
var xml_To_Json = require('xml2js');
var csv_To_Json = require('csvtojson');
var db = require('./db.js');
var pool = [];
var type;
var area;
var name;
var maj_Date;
var condition;

function import_Data_Slides(callback) {
    request.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml', function (err, res, body) {
        if (err) {
            callback(err, null);
        } else {
            xml_To_Json.parseString(body, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    var slide_Array = [];
                    var slides = data.glissades.glissade;
                    for (slide in slides) {
                        name = slides[slide].nom;
                        area = slides[slide].arrondissement[0].nom_arr;
                        maj_Date = slides[slide].arrondissement[0].date_maj;
                        condition = slides[slide].condition;
                        slide_Array.push({ type: "slide", name: name, area: area, maj_Date: maj_Date, condition: condition });
                    }
                    data_To_Db(slide_Array, function (err, res) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, res);
                        }
                    });
                }
            });
        }
    });
}

function import_Data_Ice_Ring(callback) {
    request.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml', function (err, res, body) {
        if (err) {
            callback(err, null);
        } else {
            xml_To_Json.parseString(body, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    var ice_Ring_Array = [];
                    var patinoires = data.patinoires.patinoire;
                    for (patinoire in patinoires) {
                        name = patinoires[patinoire].nom;
                        area = patinoires[patinoire].arrondissement[0].nom_arr;
                        maj_Date = patinoires[patinoire].arrondissement[0].date_maj;
                        condition = patinoires[patinoire].condition;
                        ice_Ring_Array.push({ type: "ice ring", name: name, area: area, maj_Date: maj_Date, condition: condition });
                    }
                    data_To_Db(ice_Ring_Array, function (err, res) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, res);
                        }
                    });
                }
            });
        }
    });
}

function import_Data_pool(callback) {
    var pool;
    var pool_Array = [];
    csv_To_Json()
        .fromStream(request.get('http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/pool.csv'))
        .on('json', (json) => {
            pool = json;
            name = pool.NOM;
            area = pool.ARRONDISSE;
            //maj_Date = pools[pool].date_maj;
            type = pool.TYPE;
            pool_Array.push({ type: type, name: name, area: area });
        })
        .on('done', (err, res) => {
            if (err) {
                callback(err, null);
            } else {
                data_To_Db(pool_Array, function (err, res) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, res);
                    }
                });
            }
        });
}

module.exports = import_Data_Slides(function(err, res){
    if(err){
        console.log(err);
        return err;
    }else{
        console.log(res);
        return res;
    }
});

module.exports = import_Data_Ice_Ring(function(err, res){
    if(err){
        console.log(err);
        return err;
    }else{
        console.log(res);
        return res;
    }
});

/*module.exports = import_Data_pool(function (err, res) {
    if (err) {
        console.log(err);
        return err;
    } else {
        console.log(res);
        return res;
    }
});*/

function data_To_Db(data, callback) {
    db.getConnection(function (err, db) {
        if (err) {
            callback(err, null);
        } else {
            db.collection('donnees', function (err, collection) {
                if (err) {
                    callback(err, null);
                } else {
                    collection.insert(data, function (err, res) {
                        if (err) {
                            callback(err, null);
                        } else {
                            console.log('ook');
                            callback(null, res);
                        }
                    });
                }
            });
        }
    });
}