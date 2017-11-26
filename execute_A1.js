var A1 = require('./A1.js');

A1.import_Data_Ice_Ring(function (err, res) {
    if (err) {
        return err;
    } else {
        return res;
    }
});

A1.import_Data_Slides(function (err, res) {
    if (err) {
        return err;
    } else {
        return res;
    }
});

A1.import_Data_Pools(function (err, res) {
    if (err) {
        return err;
    } else {
        return res;
    }
});