var http = require('http');
var es = require('event-stream');
var format = require('util').format;


var openUrl = 'nominatim.openstreetmap.org';


module.exports = Geocoder;

function Geocoder () {
  if (!(this instanceof Geocoder)) return new Geocoder();

  // response format
  this.format = '&format=json';

  this.http_options = {
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
    cb(err, JSON.parse(text));
  }));
};

Geocoder.prototype.geocode = function (addr, options, cb) {
  var _self = this;

  // check callback
  if (!cb) cb = typeof options === 'function' ? options : function () {};

  // check options
  if (typeof options === 'object') options = '&' + _self._serializeObjUrlParams(options);
  else options = '&addressdetails=1&polygon_geojson=1';

  // format the path
  _self.http_options.path = format('/search?q=%s%s%s', (addr.replace(/ /g, '+')), options, _self.format);

  // exec handler
  function getGeocode (res) { return _self._httpHandler(res, cb); }
  // query the svc
  http.get(_self.http_options, getGeocode).on('error', cb);
};

Geocoder.prototype.reverse = function (lon, lat, cb) {
  var _self = this;

  // check callback
  cb = cb || function () {};

  if (isNaN(lon) || isNaN(lat)) return cb(new Error('Invalid coordinates!!!'));

  // format the path
  _self.http_options.path = format('/reverse?format=json&lat=%s&lon=%s&addressdetails=1',
                                    lat,
                                    lon);

  // exec handler
  function getReverse (res) { return _self._httpHandler(res, cb); }
  // query the svc
  http.get(_self.http_options, getReverse).on('error', cb);
};
