var test = require('tape');

var OpenGeocoder = require('../');


var geo = new OpenGeocoder();

test('geocode', function (t) {
  t.plan(2);

  var options = {
    addressdetails: 0,
    polygon_kml: 1
  };

  geo.geocode('135 pilkington avenue, birmingham', options, function (err, res) {
    if (err) return t.notOk(false, err);
    t.ok(typeof res === 'object', JSON.stringify(res));
  });

  geo.geocode('avenida da liberdade, lisboa, portugal', function (err, res) {
    if (err) return t.notOk(false, err);
    t.ok(typeof res === 'object', JSON.stringify(res));
  });

});

test('reverse geocoding', function (t) {
  t.plan(2);

   geo.reverse(-8.945406, 38.575078, function (err, res) {
    if (err) return t.notOk(false, err);
    t.ok(typeof res === 'object', JSON.stringify(res));
  });

  geo.reverse(-8.900349, 38.576622, function (err, res) {
    if (err) return t.notOk(false, err);
    t.ok(typeof res === 'object', JSON.stringify(res));
  });

});