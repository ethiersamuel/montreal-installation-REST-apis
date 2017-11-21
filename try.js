var express = require('express');
var app =  express();
var url = 'http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv'

var http = require('http');

http.request(url, function(err, res, body){
    if (err){
        
    }
    console.log('status code: ' + res.statusCode);
});