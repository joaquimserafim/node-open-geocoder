#node-open-geocoder


<a href="https://nodei.co/npm/node-open-geocoder/"><img src="https://nodei.co/npm/node-open-geocoder.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/node-open-geocode)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/node-open-geocode/blob/master/LICENSE)

**code coverage:**  
`npm test && npm run check-coverage && npm run coverage`

**codestyle:** 	
`npm run codestyle`

**jshint:** 	
`npm run jshint`


###Description

**Simple client for Node.js that uses the Open Street Map API for geocoding and reverse geocoding.**


OpenStreetMap has an Editing API for fetching and saving raw geodata from/to the OpenStreetMap database.

API v0.6 is the current version of the OSM Editing API deployed 17-21 April 2009.

[Usage Policy](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy) for Open Street Map.





###Usage 

####Geocode

	geocode = function (addr, [options], cb)
	
	
		

[more info about](http://wiki.openstreetmap.org/wiki/Nominatim#Search) the *address format*
	
* addr<br>
	ex: `'135 pilkington avenue, birmingham'`
* options<br>
	ex: `{addressdetails: 1, polygon_geojson: 1}`
<br><br>
		
		addressdetails: Include a breakdown of the address into elements, can be 0 | 1
						
		the second prop define the type of polygon and can be define only one:
		 	polygon_geojson:  Output geometry of results in geojson format.
		 	polygon_kml    :  Output geometry of results in kml format.
		 	polygon_svg    :  Output geometry of results in svg format.
		 	polygon_text   :  Output geometry of results as a WKT.

* cb: `callback(err, res)`


######Example
	
	var OpenGeocoder = require('node-open-geocoder');
	
	var geo = new OpenGeocoder();
	
	geo.geocode('135 pilkington avenue, birmingham', function(err, res) {
    	if (err) {
    		return err;
    	} else {
    		return res;
    	}
  	});
  	
  	
  	
####Reverse

	reverse = function(longitude, latitude, cb)
		
		
* longitude: valid longitude
* latitude : valid latitude		
* cb       : callback(err, res)
	
	

######Example	
	
	var OpenGeocoder = require('node-open-geocoder');
	
	var geo = new OpenGeocoder();

	geo.reverse(-8.945406, 38.575078, function(err, res) {
    	if (err) {
    		return err;
    	} else {
    		return res;
    	}	
	});
