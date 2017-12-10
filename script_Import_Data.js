import_Data = require("./import_Data.js").drop_Db_Import_Data;
logger = require('heroku-logger');

import_Data(function(err, res){
    if(err){
        return err;
    }else{
        console.log("Data drop and import!");
        return res;
    }
})