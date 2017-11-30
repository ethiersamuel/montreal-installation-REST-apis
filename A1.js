var request = require('request');
var xml_To_Json = require('xml2js');
var csv_To_Json = require('csvtojson');
var db = require('./db.js');
var db_Function = require('./drop.js');
var pool = [];
var type;
var area;
var name;
var maj_Date;
var condition;

module.exports.import_Data_Slides = function (callback) {
    request.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml', function (err, res, body) {
        if (err) {
            return callback(err, null);
        } else {
            xml_To_Json.parseString(body, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    var slide_Array = [];
                    var slides = data.glissades.glissade;
                    for (slide in slides) {
                        name = slides[slide].nom;
                        area = slides[slide].arrondissement[0].nom_arr;
                        maj_Date = slides[slide].arrondissement[0].date_maj;
                        condition = slides[slide].condition;
                        slide_Array.push({ type: "Glissade", name: name, area: area, maj_Date: maj_Date, condition: condition });
                    }
                    db.data_To_Db(slide_Array, function (err, res) {
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
};

module.exports.import_Data_Ice_Ring = function (callback) {
    request.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml', function (err, res, body) {
        if (err) {
            return callback(err, null);
        } else {
            xml_To_Json.parseString(body, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    var ice_Ring_Array = [];
                    var patinoires = data.patinoires.patinoire;
                    for (patinoire in patinoires) {
                        name = patinoires[patinoire].nom;
                        area = patinoires[patinoire].arrondissement[0].nom_arr;
                        maj_Date = patinoires[patinoire].arrondissement[0].date_maj;
                        condition = patinoires[patinoire].condition;
                        ice_Ring_Array.push({ type: "Patinoire", name: name, area: area, maj_Date: maj_Date, condition: condition });
                    }
                    db.data_To_Db(ice_Ring_Array, function (err, res) {
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
};

module.exports.import_Data_Pools = function (callback) {
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
                return callback(err, null);
            } else {
                db.data_To_Db(pool_Array, function (err, res) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, res);
                    }
                });
            }
        });
};

function drop_Db_Import_Data(callback) {
    db.drop(function (err, res) {
        if (err) {
            return callback(err, null);
        } else {
            import_Data_Ice_Ring(function (err, res) {
                if (err) {
                    return callback(err, null);
                } else {
                    import_Data_Slides(function (err, res) {
                        if (err) {
                            return callback(err, null);
                        } else {
                            import_Data_Pools(function (err, res) {
                                if (err) {
                                    return callback(err, res);
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

module.exports.drop_Db_Import_Data = function(err, res){
    if(err){
        return err;
    }else{
        return res;
    }
};