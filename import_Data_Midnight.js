var import_Data = require('./import_Data.js');
var schedule = require('node-schedule');

function import_Data_Midnight(callback) {
    schedule.scheduleJob('30 * * * * *', function (err, res) {
        if (err) {
            return callback(err, null);
        } else {
            import_Data.drop_Db_Import_Data(function (err, res) {
                if (err) {
                    return callback(null, res);
                }
            });
        }
    });
}

import_Data_Midnight(function(err, res){
    if(err){
        return err;
    }else{
        return res;
    }
});

