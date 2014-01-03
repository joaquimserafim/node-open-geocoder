#node-open-geocoder


**Simple client for Node.js that uses the Open Street Map API for geocoding and reverse geocoding.**


<a href="https://nodei.co/npm/node-open-geocoder/"><img src="https://nodei.co/npm/node-open-geocoder.png"></a>

###Description

OpenStreetMap has an Editing API for fetching and saving raw geodata from/to the OpenStreetMap database.

API v0.6 is the current version of the OSM Editing API deployed 17-21 April 2009.

[Usage Policy](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy) for Open Street Map.





###Usage 

####Geocode

	geocode = function (addr, [options], cb)
	
	addr: string , ex: '135 pilkington avenue, birmingham'
		"for address format can see here more: 
			http://wiki.openstreetmap.org/wiki/Nominatim#Search"
	
	
	options: object, ex: {addressdetails: 1, polygon_geojson: 1}
		addressdetails = Include a breakdown of the address into elements, can be 0 | 1		
		 the second prop define the type of polygon and can be define only one:
		 	polygon_geojson:  Output geometry of results in geojson format.
		 	polygon_kml    :  Output geometry of results in kml format.
		 	polygon_svg    :  Output geometry of results in svg format.
		 	polygon_text   :  Output geometry of results as a WKT.

	cb: callback (err, res)


	// CODE
	
	var OpenGeocoder = require('node-open-geocoder');
	
	var geo = new OpenGeocoder();
	
	geo.geocode('135 pilkington avenue, birmingham', function (err, res) {
    	if (err) return t.notOk(false, err);
    	
    	console.log(res);
  	});
  	
  	
  	
####Reverse

	reverse = function (longitude, latitude, cb)
		
		longitude: valid longitude
		latitude : valid latitude		
		cb       : callback (err, res)
	
	

	//	CODE	
	
	var OpenGeocoder = require('node-open-geocoder');
	
	var geo = new OpenGeocoder();

	geo.reverse(-8.945406, 38.575078, function (err, res) {
    	if (err) return err;
    	
    	console.log(res)	
	});






### The MIT License (MIT)

**Copyright (c) 2013 [Joaquim Serafim](http://joaquimserafim.pt)**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
