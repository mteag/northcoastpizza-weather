
import './global-styles.css';
import './weather-forecast.css';

import {createMarker} from './weather-marker.js'

var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
}).addTo(map);

function addWeatherGeoJsonToMap(json) {
  json.features = json.features.filter(function (feature) {
    var featureName = feature.properties.name;
    var cities = [
      'Dease Lake',
      'Fort Nelson',
      'Terrace',
      'Prince George',
      'Whistler',
      'Revelstoke',
      'Creston'
    ];

    for (var i = 0; i < cities.length; i++) {
      if (cities[i].toUpperCase() === featureName.toUpperCase()) {
        return true;
      }
    }

    return false;
  })
  var layer = L.geoJSON(json, {
    pointToLayer: function (feature, latlng) {
      return createMarker(feature, latlng);
    },
    attribution: 'Data Source: <a href="https://www.canada.ca/en/environment-climate-change/services/weather-general-tools-resources/weather-tools-specialized-data/geospatial-web-services.html" target="_blank">Environment and Climate Change Canada</a>'
  }).addTo(map);

  map.fitBounds(layer.getBounds());
}

var geoJsonRequest = new XMLHttpRequest();
geoJsonRequest.addEventListener('load', function () {
  addWeatherGeoJsonToMap(JSON.parse(this.responseText));
});
geoJsonRequest.open('GET', 'https://geo.weather.gc.ca/geomet/?lang=en&service=WFS&REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&TYPENAME=ec-msc:CURRENT_CONDITIONS&outputFormat=GEOJSON&srsName=EPSG%3A3857');
geoJsonRequest.send();
