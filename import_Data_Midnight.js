var import_Data = require('./import_Data.js');
var schedule = require('node-schedule');

module.exports.import_Data_Midnight = function(callback) {
    schedule.scheduleJob('* 00 00 * * *', function (err, res) {
        if (err) {
            return callback(err, null);
        } else {
            import_Data.drop_Db_Import_Data(function (err, res) {
                if (err) {
                    return callback(err, null);
                }else{
                    return callback(null, res);
                }
            });
        }
    });
}

