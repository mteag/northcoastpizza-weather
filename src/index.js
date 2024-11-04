
/*
 * Importing a Promise polyfill to support Internet Explorer just in
 * case.
 */
import 'es6-promise/auto';

import './global-styles.css';

import {createMarker} from './weather-marker.js'
import {weatherXmlToGeoJson, objectToParamString} from './utils.js';

var CITIES = [
  'Dease Lake',
  'Fort Nelson',
  'Terrace',
  'Prince George',
  'Whistler',
  'Revelstoke',
  'Creston'
];

var map;

function getWeatherGeoJson() {
  return new Promise(function (resolve, reject) {
    var geoJsonRequest = new XMLHttpRequest();

    geoJsonRequest.addEventListener('load', function () {
      var that = this;
      resolve(Promise.resolve().then(function () {
	return weatherXmlToGeoJson(that.responseXML);
      }));
    });

    var url = 'https://geo.weather.gc.ca/geomet/' + objectToParamString({
      'service': 'WFS',
      'REQUEST': 'GetFeature',
      'SERVICE': 'WFS',
      'VERSION': '2.0.0',
      'TYPENAME': 'ec-msc:CURRENT_CONDITIONS',
      'srsName': 'EPSG:3857',
      'filter': '<Filter><Or>' +
        CITIES.map(function (cityName) {
          return '<ResourceId rid="CURRENT_CONDITIONS.' + cityName + '" />';
        }).join('') +
        '</Or></Filter>'
    });

    geoJsonRequest.open('GET', url);
    geoJsonRequest.send();
  });
}

function addWeatherGeoJsonToMap(map, json) {
  var layer = L.geoJSON(json, {
    pointToLayer: createMarker,
    attribution: 'Data Source: ' +
      '<a href="https://www.canada.ca/en/environment-climate-change/services/weather-general-tools-resources/weather-tools-specialized-data/geospatial-web-services.html" ' +
      '   target="_blank"> ' +
      '  Environment and Climate Change Canada ' +
      '</a>'
  }).addTo(map);

  map.fitBounds(layer.getBounds(), {
    paddingTopLeft: [50, 100],
    paddingBottomRight: [50, 20]
  });
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
