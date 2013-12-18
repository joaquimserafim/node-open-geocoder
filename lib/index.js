
var http = require('http');
var es = require('event-stream');

const openUrl = 'nominatim.openstreetmap.org';

// http://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=xml&polygon=1&addressdetails=1

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


Geocoder.prototype.geocode = function (addr, options, cb) {
  var self = this;

  // options is optional
  if (!cb) {
    cb = options;
    options = '&addressdetails=1&polygon_geojson=1';
  }

  // format the path
  self.http_options.path = '/search?q=' + (addr.replace(/ /g, '+')) + options + self.format;

  // handle with the response
  function handler (res) {
    if (res.statusCode !== 200) return cb(new Error(res.statusCode));

    res.pipe(es.wait(function (err, text) {
      return cb(err, JSON.parse(text));
    }));
  }
  
  http.get(self.http_options, handler).on('error', cb);
};