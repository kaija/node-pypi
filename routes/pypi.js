var express = require('express');
var path = require('path');
var md5 = require('md5-file');
var fs = require('fs');
var async = require('async');
var router = express.Router();
var app = express();

var config = fs.readFileSync('/etc/node-pypi.json');
var conf = JSON.parse(config);

var dists = fs.readdirSync(path.join(conf.path));

for (i in dists) {
  console.log('register ' + dists[i] + ' distribution folder');
  router.use('/' + dists[i], express.static(path.join( conf.path,  dists[i])));
}

router.get('/:dist', function(req, res, next) {
  var stats = fs.readdirSync(path.join( conf.path, req.params['dist']));
  res.render('list', { title: 'Simple Index' , packages: stats});
});


router.get('/:dist/:package', function(req, res, next) {
  var files = fs.readdirSync(path.join(conf.path, req.params['dist'] + '/' + req.params['package']));
  //console.log(files);
  file_md5 = files.map(function(file){return md5(path.join(conf.path, req.params['dist'] + '/' + req.params['package'] + '/'+file)); });
  console.log(file_md5);
  revs = [];
  for (i in files) {
    revs.push({name:files[i], md5: file_md5[i], path:'/simple/' + req.params['dist'] + '/' + req.params['package'] + '/' + files[i]});
  }
  res.render('package', {title: 'Links for ' + req.params['package'], package: 'Links for ' + req.params['package'], revisions:revs});
});


module.exports = router;
