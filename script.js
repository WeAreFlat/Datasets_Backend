//Initialise google maps
document.addEventListener('DOMContentLoaded', function () {
	if (document.querySelectorAll('#map').length>0) {
		if (document.querySelector('html').lang)
			lang = document.querySelector('html').lang;
		else
			lang = 'en';

		var js_file = document.createElement('script');
		js_file.type = 'text/javascript';
		js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&key=AIzaSyBAbaVnGNkLP6T9y0ujBg-3ucg3cQellwE&language=' + lang;
		document.getElementsByTagName('head')[0].appendChild(js_file);
	}
});


//loading a GeoJSON file
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'suburbs.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
};

//parsing JSON
var actual_JSON = null;
(function init() {
	loadJSON(function (response) {
		// Parse JSON string into object
		return actual_JSON = JSON.parse(response);
	});
})();


var map;
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: {lat: -36.8629404, lng: 174.7250425},
		styles: [{
			"featureType": "landscape",
			"stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]
		}, {
			"featureType": "poi",
			"stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]
		}, {
			"featureType": "road.highway",
			"stylers": [{"saturation": -100}, {"visibility": "simplified"}]
		}, {
			"featureType": "road.arterial",
			"stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]
		}, {
			"featureType": "road.local",
			"stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]
		}, {
			"featureType": "transit",
			"stylers": [{"saturation": -100}, {"visibility": "simplified"}]
		}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {
			"featureType": "water",
			"elementType": "labels",
			"stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]
		}, {
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
		}]
	});

	// Pushing GeoJSON to maps
	var json = map.data.addGeoJson(actual_JSON);

	map.data.forEach(function (feature) {
		if (feature == map.data.getFeatureById('CBD')) {
			map.data.setStyle(function (feature) {
				return {
					fillColor: 'blue'
				}
			})
		}
	});

	//Output the suburb list
	// map.data.forEach(function (feature) {
	// 	console.log(feature.getProperty('suburb_name'));
	// });


	var infowindow = new google.maps.InfoWindow();


	map.data.addListener('mouseover', function (event) {
		var myHTML = event.feature.getProperty("suburb_name");
		var string2 = JSON.parse(JSON.stringify(event.feature.getProperty('bounds')));

		console.log(string2);
		var position = {'lat': (string2.north + string2.south) / 2, 'lng': (string2.west + string2.east) / 2};


		infowindow.setContent("<div style='width:150px; text-align: center;'>" + myHTML + "</div>");
		infowindow.setPosition(position);
		infowindow.setOptions({pixelOffset: new google.maps.Size(0, 0)});
		infowindow.open(map);
		// console.log(event.feature.getProperty('bounds'));

		// var string = event.feature.getProperty('bounds');


	});

	map.data.forEach(function (e) {

		//check for a polygon
		if (e.getGeometry().getType() === 'Polygon') {

			//initialize the bounds
			var bounds = new google.maps.LatLngBounds();

			//iterate over the paths
			e.getGeometry().getArray().forEach(function (path) {

				//iterate over the points in the path
				path.getArray().forEach(function (latLng) {

					//extend the bounds
					bounds.extend(latLng);
				});

			});

			//now use the bounds
			var some = e.setProperty('bounds', bounds);

			// new google.maps.Rectangle({map:map,bounds:bounds,clickable:false})
		}
	});


	//Prints a feature to console
	// function findFeatureById(feature) {
	// 	console.log(map.data.getFeatureById(feature));
	// };


	// window.onload = function () {
	// 	var obj = document.getElementById('test_button');
	// 	obj.onmouseover = function () {
	// 		obj.style.background = 'red';
	// 		map.data.forEach(function (feature) {
	//
	// 			if (typeof feature.getProperty('mbie') === 'undefined') {
	// 				map.data.remove(feature);
	// 				console.log('doesnt exist');
	// 			} else {
	// 				var MBIE = feature.getProperty('mbie');
	// 				for (i = 0; i<MBIE.length; i++) {
	// 					if (MBIE[i] === "exists")
	// 						console.log("I keep you hon")
	// 					else
	// 						map.data.remove(feature);
	// 				}
	// 			}
	// 		});
	// 		console.log('lol');
	// 	};
	// 	obj.onmouseout = function () {
	// 		obj.style.background = 'yellow';
	// 		map.data.forEach(function (feature) {
	//
	// 			if (typeof feature.getProperty('mbie') === 'undefined') {
	// 				map.data.remove(feature);
	// 				console.log('doesnt exist');
	// 			} else {
	// 				var MBIE = feature.getProperty('mbie');
	// 				for (i = 0; i<MBIE.length; i++) {
	// 					if (MBIE[i] === "nothing")
	// 						console.log("I keep you hon")
	// 					else
	// 						map.data.remove(feature);
	// 				}
	// 			}
	// 		});
	// 	}
	// };
}