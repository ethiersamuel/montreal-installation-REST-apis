var xml_To_Json = require('xml2js');
var csv_To_Json = require('csvtojson');
var db = require('./db.js');
var db_Function = require('./db_Function.js');
var iconv = require('iconv-lite');
var http = require("http");

var pool = [];
var type;
var area;
var name;
var condition;
var request;
var datafile;

//Import the slides in xml from the montreal website data part, transform the data into json format and insert it in the database
//Needs a callback as parameter
//Returns a callback
function import_Data_Slides(callback) {
    http.get("http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml", function (res) {
        var chunks = [];
        //Decode data in latin1
        res.on("data", function (chunk) {
            chunks.push(iconv.decode(chunk, "ISO-8859-1"));
        });
        res.on("end", function () {
            //Data is now in utf-8
            var data_Utf8 = chunks.join("");
            xml_To_Json.parseString(data_Utf8, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    parse_Insert_Slide(data, callback);
                }
            });
        });
    });
};

var parse_Insert_Slide = function (data, callback){
    var slide_Array = [];
    var slides = data.glissades.glissade;
    //Push every slide in a json array
    for (slide in slides) {
        name = slides[slide].nom;
        area = slides[slide].arrondissement[0].nom_arr;
        condition = slides[slide].condition;
        slide_Array.push({ type: "Glissade", name: name, area: area, condition: condition });
    }
    db_Function.data_Insert(slide_Array, function (err, res) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, res);
        }
    });
}

//Import the ice Rings in xml from the montreal website data part, transform the data into json format and insert it in the database
//Need a callback as parameter
//Return a callback
function import_Data_Ice_Ring(callback) {
    http.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml', function (res) {
        var chunks = [];
        //Decode data in latin1
        res.on("data", function (chunk) {
            chunks.push(iconv.decode(chunk, "ISO-8859-1"));
        });
        res.on("end", function () {
            //Data is now in utf-8
            var data_Utf8 = chunks.join("");
            parse_Insert_Ring(data_Utf8, callback);
        });
    });
};

var parse_Insert_Ring = function(data_Utf8, callback){
    xml_To_Json.parseString(data_Utf8, function (err, data) {
        if (err) {
            return callback(err, null);
        } else {
            var ice_Ring_Array = [];
            var ice_Rings = data.patinoires.patinoire;
            //Push every ice ring in a json array
            for (ice_Ring in ice_Rings) {
                name = ice_Rings[ice_Ring].nom;
                area = ice_Rings[ice_Ring].arrondissement[0].nom_arr;
                condition = ice_Rings[ice_Ring].condition;
                ice_Ring_Array.push({ type: "Patinoire", name: name, area: area, condition: condition });
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
}

//Import the pools in csv from the montreal website data part, transform the data into json format and insert it in the database
//Needs a callback as parameter
//Returns a callback
function import_Data_Pools(callback) {
    var pool;
    var data_Utf8;
    var chunks = [];

    http.get('http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv', function (res) {
        //Decode data in latin1
        res.on("data", function (chunk) {
            chunks.push(iconv.decode(chunk, "ISO-8859-1"));
        });
        res.on("end", function () {
            //Data is now in utf-8
            var data_Utf8 = chunks.join("");
            parse_Csv_Insert_Pool(data_Utf8, callback);
        });
    });
}

var parse_Csv_Insert_Pool = function (data_Utf8, callback){
    var pool_Array = [];
    csv_To_Json()
    .fromString(data_Utf8)
    .on('json', pool => {
        name = pool.NOM;
        area = pool.ARRONDISSE;
        type = pool.TYPE;
        condition = "N/A";
        pool_Array.push({ type: type, name: name, area: area, condition: condition });
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
}
//Execute the 3 different installation type import data
//Needs a callback as parameter
//Returns a callback
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

