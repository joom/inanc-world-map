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
  return `${process.env.GMAPS_STATIC_URL}?center=${lat}, ${lng}&zoom=${process.env.GMAPS_ZOOM_LEVEL}&size=${process.env.GMAPS_MAP_SIZE}x${process.env.GMAPS_MAP_SIZE}&maptype=roadmap&key=${process.env.GMAPS_API_KEY}`;
}
