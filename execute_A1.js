var A1 = require('./A1.js');

A1.drop_Db_Import_Data(function (err, res) {
    if (err) {
        return err;
    } else {
        return res;
    }
});