// Copyright 2014 Jacques Berger.
// Inspiré du travail d'Alexandar Dimitrov à l'été 2014.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var mongodb = require("mongodb");
var instanceMongoDB;

//Opens the connection to the montrea_Data database
module.exports.getConnection = function (callback) {
  //In case that the db is already open
  if (instanceMongoDB) {
    return callback(null, instanceMongoDB);
  } else {
    var db;
    if (process.env.NODE_ENV === "production") {
      mongodb.connect("mongodb://ethiersamuel:Samethier28**@ds135966.mlab.com:35966/montreal", function (err, db) {
        if (err) {
          return callback(err, null);
        } else {
          instanceMongoDB = db;
          return callback(null, instanceMongoDB);
        }
      });
    } else {
      var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
      db = new mongodb.Db("montreal", server, { safe: true });
      if (!db.openCalled) {
        db.open(function (err, db) {
          if (err) {
            return callback(err, null);
          } else {
            instanceMongoDB = db;
            return callback(null, instanceMongoDB);
          }
        });
      }
    }
  }
}

