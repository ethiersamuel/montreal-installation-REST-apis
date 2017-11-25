var A1 = require('./A1.js');
var schedule = require('node-schedule');

schedule.scheduleJob('30 * * * * *', function (err, res) {
    if (err) {
        callback(err, null);
    } else {
        A1.import_Data_Ice_Ring(function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }
});
