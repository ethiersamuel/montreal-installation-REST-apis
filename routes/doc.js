// Copyright 2016 Jacques Berger.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var express = require('express');
var router = express.Router(); 
var raml2html = require('raml2html');
const logger = require('heroku-logger');

//This route is /doc and it provides you the documentation of all the services write in a raml file but render to html
router.get('/', function(req, res) {
  var config = raml2html.getConfigForTheme();
  var onError = function (err) {
    logger.error("Impossible d'accéder au fichier RAML : " + err);
    res.sendStatus(500);
  };
  var onSuccess = function(html) {
    logger.info("Le fichier RAML a été affiché correctement en HTML.");
    res.send(html);
  };
  //Put the raml in html
  raml2html.render("routes/doc/index.raml", config).then(onSuccess, onError);
});

module.exports = router;