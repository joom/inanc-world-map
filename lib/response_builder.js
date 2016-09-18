/* jshint esnext: true */

var slackInterface = require('./slack_interface');
var gmapsInterface = require('./gmaps_interface');

function buildInsertResponse(user_id, newAddress, response_url) {
  var userPromise = slackInterface.getUserInfo(user_id);
  var imageUrl = gmapsInterface.getStaticMapURL(newAddress.lat, newAddress.lng);
  userPromise.then(function(user) {
    var response = {
      "attachments": [
      {
        "fallback": "Full address: ${newAddress.formatted}, Lat: ${newAddress.lat}, Lng: ${newAddress.lng}",
        "color": "#36a64f",
        "title": "Confirm your marker location on Inanc World Map",
        "text": "Press confirm if this is the address you want to be displayed as your location on Inanc World Map.",
        "callback_id": "insert_location",
        "fields": [
        {
          "title": "Your Name",
          "value": user.name,
          "short": true
        },
        {
          "title": "Your Year",
          "value": user.year,
          "short": true
        },
        {
          "title": "Full Address",
          "value": newAddress.formatted,
          "short": false
        },
        {
          "title": "Lattitude",
          "value": newAddress.lat, 
          "short": true
        },
        {
          "title": "Longtitude",
          "value": newAddress.lng,
          "short": true
        }
        ],
          "actions": [
          {
            "name": "confirm",
            "text": "Confirm Address",
            "type": "button",
            "style": "primary",
            "value": "confirm"
          },
          {
            "name": "reject",
            "text": "Reject Address",
            "type": "button",
            "value": "reject"
          }
        ],
          "image_url": imageUrl 
      }
      ]
    };
  });
}

function buildUpdateResponse(location, newAddress, response_url) {
  var userPromise = slackInterface.getUserInfo(location.user_id);
  var imageUrl = gmapsInterface.getStaticMapURL(newAddress.lat, newAddress.lng);
  userPromise.then(function(user) {
    var response = {
      "attachments": [
      {
        "fallback": "Full address: ${newAddress.formatted}, Lat: ${newAddress.lat}, Lng: ${newAddress.lng}",
        "color": "#36a64f",
        "title": "Confirm your location update on Inanc World Map",
        "text": "Press confirm if you want to update to this address on Inanc World Map.",
        "callback_id": "update_location",
        "fields": [
        {
          "title": "Your Name",
          "value": user.name,
          "short": true
        },
        {
          "title": "Your Year",
          "value": user.year,
          "short": true
        },
        {
          "title": "Old Address",
          "value": location.formatted,
          "short": false
        },
        {
          "title": "New Address",
          "value": newAddress.formatted,
          "short": false
        },
        {
          "title": "Lattitude",
          "value": newAddress.lat, 
          "short": true
        },
        {
          "title": "Longtitude",
          "value": newAddress.lng,
          "short": true
        }
        ],
        "actions": [
          {
            "name": "confirm",
            "text": "Confirm Update",
            "type": "button",
            "style": "primary",
            "value": "confirm"
          },
          {
            "name": "reject",
            "text": "Keep Old Address",
            "type": "button",
            "value": "reject"
          }
        ],
          "image_url": imageUrl 
      }
      ]
    };
  });
}

function buildDeleteResponse(location, response_url) {
  var userPromise = slackInterface.getUserInfo(location.user_id);
  var imageUrl = gmapsInterface.getStaticMapURL(location.lat, location.lng);
  userPromise.then(function(user) {
    var response = {
      "attachments": [
      {
        "fallback": "Delete address? : ${newAddress.formatted}, Lat: ${newAddress.lat}, Lng: ${newAddress.lng}",
        "color": "#36a64f",
        "title": "Confirm location deletion from Inanc World Map",
        "text": "Are you sure you want to delete your address from Inanc World Map?",
        "callback_id": "delete_location",
        "fields": [
        {
          "title": "Your Name",
          "value": user.name,
          "short": true
        },
        {
          "title": "Your Year",
          "value": user.year,
          "short": true
        },
        {
          "title": "Address to be Deleted",
          "value": location.formatted,
          "short": false
        }
        ],
        "actions": [
          {
            "name": "confirm",
            "text": "Confirm Deletion",
            "type": "button",
            "style": "primary",
            "value": "confirm"
          },
          {
            "name": "reject",
            "text": "Keep Address",
            "type": "button",
            "value": "reject"
          }
        ],
          "image_url": imageUrl 
      }
      ]
    };
  });
}

function buildDisplayResponse(location, response_url) {
  var userPromise = slackInterface.getUserInfo(location.user_id);
  var imageUrl = gmapsInterface.getStaticMapURL(location.lat, location.lng);
  userPromise.then(function(user) {
    var response = {
      "attachments": [
      {
        "fallback": "${user.name} (${user.year})'s address on Inanc World Map: ${location.formatted} (${location.lat}, ${location.lng})",
        "color": "#36a64f",
        "title": "Your location on Inanc World Map",
        "text": "This is your location on Inanc World Map. You can invoke /location delete to delete it or /location <newAddress> to update it",
        "fields": [
        {
          "title": "Your Name",
          "value": user.name,
          "short": true
        },
        {
          "title": "Your Year",
          "value": user.year,
          "short": true
        },
        {
          "title": "Your Address",
          "value": location.formatted,
          "short": false
        }
        ],
        "image_url": imageUrl 
      }
      ]
    };
  });
}

function buildPromptResponse(user_id, response_url) {
  var userPromise = slackInterface.getUserInfo(location.user_id);
  userPromise.then(function(user) {
    var response = {
      "attachments": [
      {
        "fallback": "${user.name} (${user.year}), type /location <address> (without braces) to add yourself to Inanc World Map",
        "color": "#36a64f",
        "title": "Add Yourself to Inanc World Map",
        "text": "${user.name} (${user.year}), type /location <address> (without braces) to add yourself to Inanc World Map."
      }
      ]
    };
  });
}
