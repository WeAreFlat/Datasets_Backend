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

//Generates a range
function range(start, finish) {
	var array_output = [];
	for (i = start; i < finish; i++) {
		array_output.push(i);
	}
	return array_output;
};

function color_range(start, finish) {
	var array_output = [40, 40, 40, 40, 40];
	for (i = start; i < finish; i++) {
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);

	}
	return array_output;
};

var color_values = color_range(40, 96);
var price_values = range(113, 402);
// console.log(price_values.indexOf(300));
// console.log(price_values);


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

	// map.data.forEach(function (feature) {
	// 	var index_of_price = price_values.indexOf(feature.getProperty('price'));
	// 	console.log(index_of_price);
	// 	map.data.setStyle(function (feature) {
	// 		return {
	// 			fillColor: 'hsla(14, ' + color_values[index_of_price] + '%, 67%, 1)',
	// 			fillOpacity: 1.0
	// 		}
	// 	})
	// });

	map.data.setStyle(function(feature) {
		var index_of_price = price_values.indexOf(feature.getProperty('price'));
		console.log(index_of_price);

		var color = index_of_price !== -1 ? 'hsla(14, ' + color_values[index_of_price] + '%, 67%, 1)' : 'blue';
		return {
			fillColor: color,
			fillOpacity: 1.0,
			strokeOpacity: 1,
			strokeColor: '#FF8A65',
			strokeWeight: 1
		}
	});

	//Output the suburb list
	// map.data.forEach(function (feature) {
	// 	console.log(feature.getProperty('suburb_name'));
	// });

	//Tooltip init and code for it popping up in the center of each suburb on mouse over
	var infowindow = new google.maps.InfoWindow();

	map.data.addListener('mouseover', function (event) {
		var tooltip_text = event.feature.getProperty("suburb_name");
		var parsed_maps_obj = JSON.parse(JSON.stringify(event.feature.getProperty('bounds')));
		var tooltip_center = {
			'lat': (parsed_maps_obj.north + parsed_maps_obj.south) / 2,
			'lng': (parsed_maps_obj.west + parsed_maps_obj.east) / 2
		};


		infowindow.setContent("<div style='width:150px; text-align: center;'>" + tooltip_text + "</div>");
		infowindow.setPosition(tooltip_center);
		infowindow.setOptions({pixelOffset: new google.maps.Size(0, 0)});
		infowindow.open(map);


	});

	//Calculates boundaries of each suburb
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
}