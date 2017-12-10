var import_Data = require('./import_Data.js');
var schedule = require('node-schedule');
const logger = require('heroku-logger');

//Imports data form montreal installation at every midnight but drop the previous collection
module.exports.import_Data_Midnight = function(callback) {
    schedule.scheduleJob('00 00 00 * * *', function (err, res) {
        if (err) {
            logger.error("La schédule d'importation de données de minuit n'a pas fonctionné : " + err);
            return callback(err, null);
        } else {
            import_Data.drop_Db_Import_Data(function (err, res) {
                if (err) {
                    logger.error("Les patinoires n'ont pas pu être importé : " + err);
                    return callback(err, null);
                }else{
                    logger.info("Les données ont été importés à minuit: " + res);
                    return callback(null, res);
                }
            });
        }
    });
}

