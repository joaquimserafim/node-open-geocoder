var test = require('tape');

var OpenGeocoder = require('../');


var geo = new OpenGeocoder();

test('geocode', function (t) {
  t.plan(1);

  geo.geocode('135 pilkington avenue, birmingham', function (err, res) {
    if (err) return t.notOk(false, err);

    t.ok(res !== null, JSON.stringify(res));
  });

});
