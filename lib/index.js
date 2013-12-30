var http = require('http');
var es = require('event-stream');

const openUrl = 'nominatim.openstreetmap.org';


module.exports = Geocoder;

function Geocoder () {
  var self = this;
  if (!(self instanceof Geocoder)) return new Geocoder();

  // response format
  self.format = '&format=json';

  self.http_options = {
    hostname: openUrl,
    port: 80,
    agent: false
  };
}

Geocoder.prototype._serializeObjUrlParams = function (obj) {
  var str = '';
  for (var key in obj) {
      if (str) str += '&';
      str += key + '=' + obj[key];
  }

  return str;
};

Geocoder.prototype._httpHandler = function (res, cb) {
  if (res.statusCode !== 200) return cb(new Error(res.statusCode));

  res.pipe(es.wait(function (err, text) {
    try {
       return cb(err, JSON.parse(text));
    } catch (e) {
       return cb(e);
    }
  }));
};

Geocoder.prototype.geocode = function (addr, options, cb) {
  var self = this;

  // check callback
  if (!cb) cb = typeof options === 'function' ? options : function () {};

  // check options
  if (typeof options === 'object') options = '&' + self._serializeObjUrlParams(options);
  else options = '&addressdetails=1&polygon_geojson=1';

  // format the path
  self.http_options.path = '/search?q=' + (addr.replace(/ /g, '+')) + options + self.format;
  
  // exec handler
  function getGeocode (res) { return self._httpHandler(res, cb); }
  // query the svc
  http.get(self.http_options, getGeocode).on('error', cb);
};

Geocoder.prototype.reverse = function (lon, lat, cb) {
  var self = this;

  // check callback
  cb = cb || function () {};

  if (isNaN(lon) || isNaN(lat)) return cb(new Error('Invalid coordinates!!!'));

  // format the path
  self.http_options.path = '/reverse?format=json&lat=' + lat + '&lon=' + lon + '&addressdetails=1';

  // exec handler
  function getReverse (res) { return self._httpHandler(res, cb); }
  // query the svc
  http.get(self.http_options, getReverse).on('error', cb);
};