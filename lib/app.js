/* jshint esnext: true */

require('dotenv').config();

var express = require('express');
var mongoskin = require('mongoskin');
var slackInterface = require('./slack_interface');

var app = express();

var db = mongoskin.db(process.env.DB_ADDRESS, {safe:true});

db.collection('location').ensureIndex([['user_id']], true, function(err, replies){});

db.bind('location');

// Root route sends error message
app.get('/', function(req, res) {
  res.redirect('/index.html');
});

// All post requests must send correct slack token
app.post('/*', function(req, res, next) {
  if (req.body.token != process.env.SLACK_TOKEN) {
    next(Error('Slack token not verified'));
  } else {
    next();
  }
});

app.post('/initiate', function(req, res, next) {
  if (req.body.text.startsWith('delete')) {
    slackInterface.deleteRequest(req, res, next);
  } else if (req.body.text.length > 0) {
    slackInterface.addressRequest(req, res, next);
  } else {
    slackInterface.emptyRequest(req, res, next);
  }
});


app.post('/action', function(req, res, next) {
  if (!req.body.callback_id) next(Error('No command callback id'));

  var user_id = req.body.user.id;
  var newLocation = slackInterface.parseLocationInfo(req.body.original_message);

  if (req.body.callback_id == 'insert_location') {
    slackInterface.insertAction(user_id, newLocation, res, next);
  } else if (req.body.callback_id == 'update_location') {
    slackInterface.updateAction(user_id, newLocation, res, next);
  } else if (req.body.callback_id == 'delete_location') {
    slackInterface.deleteAction(user_id, res, next);
  }
});

// 'locations' route returns all locations
app.get('/locations', function(req, res, next) {
  db.location.find().toArray(function (err, results) {
    if (err) return next(err);
    res.send(results);
  });
});

app.use(express.static('static'));

module.exports = app;
