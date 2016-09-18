/* jshint esnext: true */

var gmapsInterface = require('gmaps_interface');
var responseBuilder = require('response_builder');

function deleteRequest(req, res, next) {
  db.location.findOne({user_id: req.body.user_id}, function(err, found) {
    if (err) return next(err);
    if (found) {
      res.json(buildDeleteResponse(found));
    }
  });
}

function addressRequest(req, res, next) {
  gmapsInterface.getLatLngFull(req.body.text, function(addr) {
    if (!addr.valid) {
      next(Error("Invalid address string"));
    } else {
      db.location.findOne({user_id: req.body.user_id}, function(err, found) {
        if (err) return next(err);
        if (found) {
          res.json(buildUpdateResponse(found, addr));
        } else {
          res.json(buildInsertResponse(req.body.user_id, addr));
        }
      });
    }
  });
}

function emptyRequest(req, res, next) {
  db.location.findOne({user_id: req.body.user_id}, function(err, found) {
    if (err) return next(err);
    if (found) {
      res.json(buildDisplayResponse(found));
    } else {
      res.json(buildPromptResponse(req.body.user_id));
    }
  });
}

function insertAction(user_id, newLocation, res, next) {
  db.location.insert(newLocation, {}, function(err, results) {
    if (err) return next(err);
    res.status(200).end();
  });
}

function updateAction(user_id, newLocation, res, next) {
  db.location.update({user_id: user_id}, {$set: {lat: newLocation.lat, lng: newLocation.lng, formatted: newLocation.formatted}}, function (err) {
    if (err) return next(err);
    db.location.findOne({user_id: user_id}, function(err, location) {
      res.status(200).end();
    });
  });
}

function deleteAction(user_id, res, next) {
  db.location.delete({user_id: req.body.user_id}, function(err) {
    if (err) return next(err);
    res.status(200).end();
  });
}

function parseLocationInfo(message) {
  var messageFields = JSON.parse(message).attachments[0].fields;
  var lat = messageFields[2].value;
  var lng = messageFields[3].value;
  var name = messageFields[1].value;
  var year = messageFields[4].value;
  var formatted = messageFields[5].value;
  return [name, year, lat, lng, formatted];
}

function parseYear(userNameStr) {
  var yearStr = userNameStr.substring(userNameStr.len-2);
  var yearInt = 2000 + parseInt(yearStr);
  return yearInt;
}

function getUserInfo(user_id, callback) {
  return new Promise(function(resolve, reject) {
    request.get({
      url: process.env.SLACK_USER_INFO_URL,
      qs: {
        token: process.env.SLACK_API_TOKEN,
        user: user_id
      }
    }).on('response', function(response) {
      if (response.ok) {
        var name = response.user.profile.real_name_normalized;
        var year = parseYear(response.user.name);
        if (isNaN(year)) {
          resolve({name: name});
        } else {
          resolve({name: name, year: year});
        }
      } else {
        reject(Error("Can't get user info"));
      }
    });
  });
}
