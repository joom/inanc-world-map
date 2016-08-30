var inancLocation = new L.LatLng(40.7816613, 29.48420239999999);
var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 19
});
var map = L.map('map', {center: inancLocation, zoom: 3, layers: [tiles]});

//Custom radius and icon create function
var markers = L.markerClusterGroup({
  maxClusterRadius: 50,
  iconCreateFunction: function (cluster) {
    var markers = cluster.getAllChildMarkers();
    var n = markers.length;
    return L.divIcon({ html: n, className: 'cluster', iconSize: L.point(40, 40) });
  }
});

for (var i = 0; i < data.length; i++) {
  var item = data[i];
  var title = `${item.name} (${item.year})`;
  data[i].marker = L.marker(new L.LatLng(item.lat, item.lng), { title: title });
  data[i].marker.bindPopup(title);
  markers.addLayer(data[i].marker);
}

// Watchtower icon

var towerIcon = L.icon({
  iconUrl: 'assets/logo.png', iconSize: [50, 50], iconAnchor: [25, 25],
});
var tower = L.marker(inancLocation, {icon: towerIcon}).addTo(map);

map.addLayer(markers);

var sidebar = L.control.sidebar('sidebar', {position: "right"}).addTo(map);

var searchBox = document.querySelector('#search-box');
var yearBox = document.querySelector('#year-box');
var resultBox = document.querySelector('#search-results');
// add this year if it's after graduation now
var d = new Date();
var y = d.getFullYear();
var up = d.getMonth() >= 7 ? y + 1 : y;
for (var i = 2000; i < up; i++) {
  yearBox.innerHTML += `<option value="${i}">${i}</option>`;
}

var asciify = function(s) {
  var dict = {'ç':'c', 'Ç':'C', 'ğ':'g', 'Ğ':'G', 'ı':'i', 'İ':'I', 'ö':'o', 'Ö':'O', 'ş':'s', 'Ş':'S', 'ü':'u', 'Ü':'U'};
  return s.split("").map(function(c) {
    return (typeof dict[c] !== "undefined" ? dict[c] : c);
  }).join("");
}

var updateSearch = function() {
  var searchInput = searchBox.value;
  var yearInput = yearBox.value;

  resultBox.innerHTML = ``;
  if (!searchInput && !yearInput) {
    return;
  }

  var results = data.filter(function(item) {
    var isYear = ! yearInput || item.year === parseInt(yearInput);
    var isName = ! searchInput || asciify(item.name.toLowerCase()).indexOf(searchInput.toLowerCase()) !== -1;
    return isName && isYear;
  }).sort(function(a, b) { //first sort by year then alphabetically
    var x = a.year - b.year;
    if (x === 0)
      return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
    return x;
  });
  results.forEach(function(item) {
    var li = document.createElement("li");
    li.innerHTML = `${item.name} <span>(${item.year})<span>`;
    li.addEventListener("click", function() {
      map.panTo(item.marker._latlng);
      item.marker.openPopup();
    });
    resultBox.appendChild(li);
  });
  return results;
};

searchBox.addEventListener('keyup', updateSearch);
yearBox.addEventListener('change', updateSearch);
updateSearch();
