var request = require('request');
var xml_To_Json = require('xml2js');
var csv_To_Json = require('csvtojson');
var db = require('./db.js');
var db_Function = require('./db_Function.js');
var iconv = require('iconv-lite');
var pool = [];
var type;
var area;
var name;
var maj_Date;
var condition;
var request;

var http = require("http");
var iconv = require("iconv-lite");
var datafile;

function import_Data_Slides(callback) {
    http.get("http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml", function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
            console.log("push");
            chunks.push(iconv.decode(chunk, "ISO-8859-1"));
        });
        res.on("end", function () {
            datafile = chunks.join("");
            //console.log(datafile);

            xml_To_Json.parseString(datafile, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    console.log("slide");
                    var slide_Array = [];
                    var slides = data.glissades.glissade;
                    for (slide in slides) {
                        name = slides[slide].nom;
                        area = slides[slide].arrondissement[0].nom_arr;
                        maj_Date = slides[slide].arrondissement[0].date_maj;
                        condition = slides[slide].condition;
                        slide_Array.push({ type: "Glissade", name: name, area: area, maj_Date: maj_Date, condition: "mauvaise" });
                    }
                    db_Function.data_Insert(slide_Array, function (err, res) {
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, res);
                        }
                    });
                }
            });
        });
    });
};

function import_Data_Ice_Ring(callback) {
    http.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml', function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
            console.log("push");
            chunks.push(iconv.decode(chunk, "ISO-8859-1"));
        });
        res.on("end", function () {
            datafile = chunks.join("");
            //console.log(datafile);
            xml_To_Json.parseString(datafile, function (err, data) {
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
                    db_Function.data_Insert(ice_Ring_Array, function (err, res) {
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, res);
                        }
                    });
                }
            });
        });
    });
};

function import_Data_Pools(callback) {
    var pool;
    var pool_Array = [];
    csv_To_Json()
        .fromStream(http.get('http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/pool.csv', function(res){
            var chunks = [];
            res.on("data", function (chunk) {
                console.log("push");
                chunks.push(iconv.decode(chunk, "ISO-8859-1"));
            });
            res.on("end", function () {
                datafile = chunks.join("");
                //console.log(datafile);
            });
        }))
        .on('json', (datafile) => {
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
                db_Function.data_Insert(pool_Array, function (err, res) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, res);
                    }
                });
            }
        });
};

module.exports.drop_Db_Import_Data = function (callback) {
    db_Function.drop(function (err, res) {
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


