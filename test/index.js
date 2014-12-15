var tape = require('tape');

var OpenGeocoder = require('../');

var geo = OpenGeocoder();

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

tape('geocode forget callback should throw', function(assert) {
  assert.plan(1);
  assert.throws(function() {
    geo.geocode('avenida da liberdade, lisboa, portugal');
  }, /The callback is missing/);
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

tape('reverse geocoding forget callback should throw', function(assert) {
  assert.plan(1);
  assert.throws(function() {
    geo.reverse(-8.900349, 38.576622);
  }, /The callback is missing/);
});

tape('bad coordinates', function(assert) {
  geo.reverse(-800.900349, -380.576622, function(err) {
    assert.deepEqual(err.message, 'Invalid coordinates!');
    assert.end();
  });
});

tape('send null coordinates', function(assert) {
  geo.reverse(null, null, function(err) {
    assert.deepEqual(err.message, 'Invalid coordinates!');
    assert.end();
  });
});

tape('receive a non 200 status code form the service',
function(assert) {
  // lets override the open URL for this test
  geo = new OpenGeocoder('badnominatim.openstreetmap.org');
  geo.reverse(-80.900349, 38.576622, function(err) {
    // node.js 0.11 shows the bad addr in the error
    assert.equal(/^getaddrinfo ENOTFOUND/.test(err.message), true);
    assert.end();
  });
});

tape('the response is not a JSON', function(assert) {
  geo = new OpenGeocoder();
  // override the response format for the test
  geo.format = 'xml';
  geo.geocode('135 pilkington avenue, birmingham', function(err) {
    assert.equal(err.message, 'Unexpected token <');
    assert.end();
  });
});
