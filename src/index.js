
import './weather-forecast.css';

import {createMarker} from './weather-marker.js'

var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

fetch('https://geo.weather.gc.ca/geomet/?lang=en&service=WFS&REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&TYPENAME=ec-msc:CURRENT_CONDITIONS&outputFormat=GEOJSON&srsName=EPSG%3A3857', {
  method: 'GET'
}).then(function(response) {
  return response.json();
}).then(function(json) {
  json.features = json.features.filter((feature) => {
    const featureName = feature.properties.name;
    return [
      'Dease Lake',
      'Fort Nelson',
      'Terrace',
      'Prince George',
      'Whistler',
      'Revelstoke',
      'Creston'
    ].find((name) => name.toUpperCase() == featureName.toUpperCase());
  })
  var layer = L.geoJSON(json, {
    pointToLayer: function (feature, latlng) {
      return createMarker(feature, latlng);
    },
    attribution: 'Data Source: <a href="https://www.canada.ca/en/environment-climate-change/services/weather-general-tools-resources/weather-tools-specialized-data/geospatial-web-services.html">Environment and Climate Change Canada</a>'
  }).addTo(map);

  map.fitBounds(layer.getBounds());
});
