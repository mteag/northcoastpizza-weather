
import './global-styles.css';
import './weather-forecast.css';

import {createMarker} from './weather-marker.js'
import {jsonParseAsPromise, objectToParamString} from './utils.js';

var CITIES = [
  'Dease Lake',
  'Fort Nelson',
  'Terrace',
  'Prince George',
  'Whistler',
  'Revelstoke',
  'Creston'
].map(function (name) { return name.toUpperCase(); });

var map;

function shouldShowCity(feature) {
  var featureName = feature.properties.name.toUpperCase();

  return CITIES.indexOf(featureName) >= 0;
}

function getWeatherGeoJson() {
  return new Promise(function (resolve, reject) {
    var geoJsonRequest = new XMLHttpRequest();

    geoJsonRequest.addEventListener('load', function () {
      resolve(jsonParseAsPromise(this.responseText));
    });

    var url = 'https://geo.weather.gc.ca/geomet/' + objectToParamString({
      'service': 'WFS',
      'REQUEST': 'GetFeature',
      'SERVICE': 'WFS',
      'VERSION': '2.0.0',
      'TYPENAME': 'ec-msc:CURRENT_CONDITIONS',
      'outputFormat': 'GEOJSON',
      'srsName': 'EPSG:3857'
    });

    geoJsonRequest.open('GET', url);
    geoJsonRequest.send();
  });
}

function addWeatherGeoJsonToMap(map, json) {
  var layer = L.geoJSON(json, {
    filter: shouldShowCity,
    pointToLayer: createMarker,
    attribution: 'Data Source: ' +
      '<a href="https://www.canada.ca/en/environment-climate-change/services/weather-general-tools-resources/weather-tools-specialized-data/geospatial-web-services.html" ' +
      '   target="_blank"> ' +
      '  Environment and Climate Change Canada ' +
      '</a>'
  }).addTo(map);

  map.fitBounds(layer.getBounds());
}

function setupMap() {
  map = L.map('map', {
    zoomSnap: 0
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
  }).addTo(map);

  return getWeatherGeoJson()
    .then(function (json) {
      addWeatherGeoJsonToMap(map, json);
    });
}

setupMap();
