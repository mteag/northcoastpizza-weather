
import {showForecast} from './weather-forecast.js';

import templateString from './weather-marker.template.html';
import './weather-marker.css';

function domTemplateFromString(htmlString) {
  var domTemplate = document.createElement('div');
  domTemplate.innerHTML = htmlString;

  return domTemplate.firstChild;
}

var TEMPLATE = domTemplateFromString(templateString);


function createMarkerElement(properties) {
  var markerElement = TEMPLATE.cloneNode(true);

  var iconElement = markerElement.getElementsByClassName(
    'weather-marker-icon'
  )[0];
  var temperatureElement = markerElement.getElementsByClassName(
    'weather-marker-temperature-text'
  )[0];
  var nameElement = markerElement.getElementsByClassName(
    'weather-marker-location'
  )[0];

  iconElement.src = properties.icon;
  iconElement.alt = properties.cond_en;
  temperatureElement.innerText = properties.temp;
  nameElement.innerText = properties.name;

  return markerElement;
}


export function createMarker(feature, latlng) {
  return L.marker(
    L.CRS.EPSG3857.unproject(L.point([latlng.lng, latlng.lat])),
    {
      icon: L.divIcon({
        className: 'weather-marker',
        title: feature.properties.name,
        html: createMarkerElement(feature.properties),
        iconSize: [80, 90],
        iconAnchor: [40, 90]
      })
    }
  ).on('click', function () {
    showForecast(feature.properties)
  });
}
