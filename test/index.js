var tape = require('tape');

var OpenGeocoder = require('../');

var geo = new OpenGeocoder();

tape('geocode::1', function(assert) {
  var options = {
    addressdetails: 0,
    'polygon_kml': 1
  };

  geo.geocode('135 pilkington avenue, birmingham', options,
  function(err, res) {
    assert.deepEqual(err, null);
    assert.ok(typeof res === 'object', JSON.stringify(res));
    assert.end();
  });
});

tape('geocode::2', function(assert) {
  geo.geocode('avenida da liberdade, lisboa, portugal', function(err, res) {
    assert.deepEqual(err, null);
    assert.ok(typeof res === 'object', JSON.stringify(res));
    assert.end();
  });
});

tape('reverse geocoding::1', function(assert) {
  geo.reverse(-8.945406, 38.575078, function(err, res) {
    assert.deepEqual(err, null);
    assert.ok(typeof res === 'object', JSON.stringify(res));
    assert.end();
  });
});

tape('reverse geocoding::2', function(assert) {
  geo.reverse(-8.900349, 38.576622, function(err, res) {
    assert.deepEqual(err, null);
    assert.ok(typeof res === 'object', JSON.stringify(res));
    assert.end();
  });
});
