var http    = require('http');
var es      = require('event-stream');
var format  = require('util').format;

function validCoordinates(lon, lat) {
  if (isNaN(parseInt(lon, 10)) || isNaN(parseInt(lat, 10))) {
    return false;
  } else if ((180 < lon || -180 > lon) &&
    (90 < lat || -90 > lat)) {
    return false;
  } else {
    return true;
  }
}

function validJson(str) {
  try {
    return {
      value: JSON.parse(str)
    };
  } catch (ex) {
    return {
      error: ex
    };
  }
}

module.exports = Geocoder;

function Geocoder(url) {
  if (!(this instanceof Geocoder)) {
    return new Geocoder();
  }

  url = url || 'nominatim.openstreetmap.org';

  // response format
  this.format = '&format=json';

  this.httpOptions = {
    hostname: url,
    port: 80,
    agent: false
  };
}

Geocoder.prototype._serializeObjUrlParams = function(obj) {
  return Object.keys(obj)
    .map(function(key, value) {
      return key + '=' + value;
    })
    .join('&');
};

Geocoder.prototype._httpHandler = function(res, cb) {
  res.pipe(es.wait()).on('data', function(data) {
    var json = validJson(data);
    if (json.error) {
      cb(json.error);
    } else {
      cb(null, json.value);
    }
  });
};

Geocoder.prototype.geocode = function(addr, options, cb) {
  var self = this;

  // check callback
  if (!cb) {
    if (typeof options !== 'function') {
      throw new Error('The callback is missing!');
    } else {
      cb = options;
      options = 'undefined';
    }
  }

  // check options
  if (typeof options === 'object') {
    options = '&' + self._serializeObjUrlParams(options);
  } else {
    options = '&addressdetails=1&polygon_geojson=1';
  }

  // format the path
  self.httpOptions.path = format('/search?q=%s%s%s',
    addr.replace(/ /g, '+'),
    options,
    self.format);

  // exec handler
  function getGeocode(res) {
    return self._httpHandler(res, cb);
  }
  // query the svc
  http.get(self.httpOptions, getGeocode).on('error', cb);
};

Geocoder.prototype.reverse = function(lon, lat, cb) {
  var self = this;

  if (!cb) {
    throw new Error('The callback is missing!');
  }

  if (validCoordinates(lon, lat)) {
    // format the path
    self.httpOptions.path = format('/reverse?%s&lat=%s' +
      '&lon=%s&addressdetails=1',
      self.format,
      lat,
      lon);

    // exec handler
    var getReverse = function(res) {
      return self._httpHandler(res, cb);
    };

    // query the svc
    http.get(self.httpOptions, getReverse).on('error', cb);
  } else {
    cb(new Error('Invalid coordinates!'));
  }
};
