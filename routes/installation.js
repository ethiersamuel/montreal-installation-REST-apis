var express = require('express');
var router = express.Router(); 
var json_2_Html = require('node-json2html');

router.get('/:arrondissement', function(req, res) {
  var onError = function (err) {
    console.log(err);
    res.sendStatus(500);
  };
  var arrondissement = req.params.arrondissement;
  var onSuccess = function(html) {
    res.send(html);
  };
  var query = {'nom_arr' : arrondissement}
  //db_To_Json()
  res.render(arrondissement).then(onSuccess, onError);
});

function db_To_Json(data, callback){
    db.getConnection(function(err, res){
        if(err){
            return callback(err, null);
        }else{
            res.collection('donnees', function(err, collection){
                if(err){
                    return callback(err, null);
                }else{
                    collection.find(query, function(err, res){
                        if(err){
                            return callback(err, null);
                        }else{
                            return callback(null, res);
                        }
                    });                    
                }
            });
        }
        
    });
}

module.exports = router;