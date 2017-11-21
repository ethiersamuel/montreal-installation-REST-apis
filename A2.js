var A1 = require('./A1.js');
var schedule = require('node-schedule');

function import_Data__Every_Midnight(callback){
    schedule.scheduleJob('* 0 0 * * *', function(err, res){
        if(err){
            return callback(err, null);
        }else{
            A1.import_Data(function(err, res){
                if(err){
                    return callback(err, null);
                }else{
                    return callback(null, res); 
                }
            });           
        }
    });
}
