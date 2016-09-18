/* jshint esnext: true */

var request = require('request');

function getLatLngFull(address, callback) {
  request.get({
    url: gmapsUrl,
    qs: {
      address: address,
      key: process.env.GMAPS_API_KEY 
    }
  }).on('response', function(response) {
    if (response.results.length === 0) {
      callback({valid: false});
    } else {
      var result = response.results[0];
      callback({lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                formatted: result.formatted_address,
                valid: true});
    }
  });
}

function getStaticMapURL(lat, lng) {
  var baseUrl = process.env.GMAPS_STATIC_URL;
  var loc = "&center="  + lat + ", " + lng;
  var zoom = "&zoom=" + process.env.GMAPS_ZOOM_LEVEL;
  var size = "&size=" + process.env.GMAPS_MAP_SIZE + "x" + process.env.GMAPS_MAP_SIZE;
  var apiKey = "&key=" + process.env.GMAPS_API_KEY;
  return baseUrl + loc + zoom + size + apiKey;
}
