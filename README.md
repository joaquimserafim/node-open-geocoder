# node-open-geocoder

Open Street Map API client for geocoding and reverse geocoding

----
<a href="https://nodei.co/npm/node-open-geocoder/"><img src="https://nodei.co/npm/node-open-geocoder.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/node-open-geocoder)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/node-open-geocoder/blob/master/LICENSE)[![NodeJS](https://img.shields.io/badge/node-6.1.x-brightgreen.svg?style=flat-square)](https://github.com/joaquimserafim/node-open-geocoder/blob/master/package.json#L48)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)




### about Open Street Map API

OpenStreetMap has an Editing API for fetching and saving raw geodata from/to the OpenStreetMap database.

API v0.6 is the current version of the OSM Editing API deployed 17-21 April 2009.

[Usage Policy](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy) for Open Street Map.


### api

`const openGeocoder = require('node-open-geocoder')`

`openGeocoder([options])`

* **options**
    - url, string, OpenStreetMap URL, default to `nominatim.openstreetmap.org`
    - port, integer, OpenStreetMap port, default to `80`
    - timeout, integer, client timeout, default to `10000` mls
    - userAgent, string, OpenStreetMap needs to receive this header, default to node-open-geocoder

#### geocode

`openGeocoder.geocode(addr, [options])`

[more info about](http://wiki.openstreetmap.org/wiki/Nominatim#Search) the *address format*

* **addr**, string, ex: `'135 pilkington avenue, birmingham'`
* **options**, object, ex: `{addressdetails: 1, polygon_geojson: 1}`
    - addressdetails: Include a breakdown of the address into elements, can be 0 | 1
    - the second prop define the type of polygon and can be define only one:
        * polygon_geojson:  Output geometry of results in geojson format.
        * polygon_kml    :  Output geometry of results in kml format.
        * polygon_svg    :  Output geometry of results in svg format.
        * polygon_text   :  Output geometry of results as a WKT.


##### example
```js
const openGeocoder = require('node-open-geocoder');

openGeocoder()
  .geocode('135 pilkington avenue, birmingham')
  .end((err, res) => {})
```

#### reverse

`openGeocoder.reverse(longitude, latitude)`

##### example
```js
const openGeocoder = require('node-open-geocoder');

openGeocoder()
  .reverse(-8.945406, 38.575078)
  .end((err, res) => {})
```

