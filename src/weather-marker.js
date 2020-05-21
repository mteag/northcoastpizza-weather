
import templateString from './weather-marker.template.html';
import './weather-marker.css';

function domTemplateFromString(htmlString) {
  const domTemplate = document.createElement('div');
  domTemplate.innerHTML = htmlString;

  return domTemplate.firstChild;
}

const template = domTemplateFromString(templateString);


function createMarkerElement(properties) {
  const markerElement = template.cloneNode(true);

  const iconElement = markerElement.getElementsByClassName(
    'weather-marker-icon'
  )[0];
  const temperatureElement = markerElement.getElementsByClassName(
    'weather-marker-temperature-text'
  )[0];
  const nameElement = markerElement.getElementsByClassName(
    'weather-marker-location'
  )[0];

  iconElement.src = properties.icon;
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
  );
}
