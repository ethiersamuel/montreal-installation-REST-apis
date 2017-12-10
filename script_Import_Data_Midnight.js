import_Data_Midnight = require("./import_Data_Midnight.js").import_Data_Midnight;

import_Data_Midnight(function(err, res){
    if(err){
        return err;
    }else{
        console.log("Data drop and import!");
        return res;
    }
})