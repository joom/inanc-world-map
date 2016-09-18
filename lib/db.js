var mongoskin = require('mongoskin');

var db = mongoskin.db(process.env.DB_ADDRESS, {safe:true});

db.collection('location').ensureIndex([['user_id']], true, function(err, replies){});

db.bind('location');

module.exports = db;
