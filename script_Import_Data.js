import_Data = require("./import_Data.js").drop_Db_Import_Data;

import_Data(function(err, res){
    if(err){
        return err;
    }else{
        console.log("Data drop and import!");
        return res;
    }
})