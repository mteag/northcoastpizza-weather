

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

