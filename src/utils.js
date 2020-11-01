

import {XPathHelper} from './xpathHelpers.js';

function getProperties(currentCondition) {
  var properties = {};

  ['name', 'icon', 'cond_en', 'temp', 'url_en'].forEach(function (property) {
    properties[property] = currentCondition.getString('.//ec-msc:' + property +'/text()')
  });

  return properties;
}

function getPoint(currentCondition) {
  var coordinateString = currentCondition.getString('.//ec-msc:msGeometry//gml:pos/text()');

  return coordinateString.split(' ');
}

export function weatherXmlToGeoJson(weatherDocument) {
  var helper = new XPathHelper(weatherDocument);
  var currentConditionElements = helper.getNodes('//ec-msc:CURRENT_CONDITIONS');

  var features = currentConditionElements.map(function (currentCondition) {
    var result = {
      type: "Feature",
      properties: getProperties(currentCondition),
      geometry: {
	type: "Point",
	coordinates: getPoint(currentCondition)
      }
    };
    return result;
  });

  return {
    type: "FeatureCollection",
    features: features
  };
}

export function jsonParseAsPromise(jsonText) {
  try {
    return Promise.resolve(JSON.parse(jsonText));
  } catch (e) {
    return Promise.reject(e);
  }
}

export function objectToParamString(params) {
  var result = '';
  for (var key in params) {
    if (result === '') {
      result += '?';
    } else {
      result += '&';
    }

    result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }

  return result;
}

