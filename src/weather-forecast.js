
function showForecastWrapper() {
  var wrapper = document.getElementById('weather-forecast-wrapper');

  wrapper.className = 'open';
}

function hideForecastWrapper() {
  var wrapper = document.getElementById('weather-forecast-wrapper');

  wrapper.className = '';
}


// https://weather.gc.ca/city/pages/bc-86_metric_e.html
function forecastUrl(properties) {
  var match = properties.url_en.match(/bc-[\d]+/);

  if (!match) {
    return;
  }

  return 'https://weather.gc.ca/wxlink/wxlink.html?cityCode=' + match[0];
}

export function showForecast(properties) {
  document.getElementById('weather-forecast-close').onclick = hideForecastWrapper;

  var url = forecastUrl(properties);

  if (!url) {
    return;
  }

  var iframe = document.getElementById('weather-forecast');

  iframe.src = url;

  iframe.onload = showForecastWrapper;
}
