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
	for (i = start; i<finish; i++) {
		array_output.push(i);
	}
	return array_output;
};

function color_range(start, finish) {
	var array_output = [];
	for (i = start; i<finish; i++) {
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);

	}
	return array_output;
};

var color_values2222 = color_range(40, 66);
var color_values = [40,40,40,40,40,40,40,40,40,40,41,41,41,41,41,41,41,41,41,41,42,42,42,42,42,42,42,42,42,43,43,43,43,43,43,43,43,43,44,44,44,44,44,44,44,44,44,45,45,45,45,45,45,45,45,45,46,46,46,46,46,46,46,46,46,47,47,47,47,47,47,47,47,47,48,48,48,48,48,48,48,48,48,49,49,49,49,49,49,49,49,49,50,50,50,50,50,50,50,50,50,51,51,51,51,51,51,51,51,51,52,52,52,52,52,52,52,52,52,53,53,53,53,53,53,53,53,53,54,54,54,54,54,54,54,54,54,55,55,55,55,55,55,55,55,55,56,56,56,56,56,56,56,56,56,57,57,57,57,57,57,57,57,57,58,58,58,58,58,58,58,58,58,59,59,59,59,59,59,59,59,59,60,60,60,60,60,60,60,60,60,61,61,61,61,61,61,61,61,61,62,62,62,62,62,62,62,62,62,63,63,63,63,63,63,63,63,63,64,64,64,64,64,64,64,64,64,65,65,65,65,65,65,65,65,65, 66, 67];

color_values = color_values.reverse();

console.log(JSON.stringify(color_values2222));
var price_values = range(142, 380);


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

	map.data.setStyle(function (feature) {
		var index_of_price = price_values.indexOf(parseInt(feature.getProperty('price'), 10));
		console.log(index_of_price);

		var color = index_of_price !== -1 ? 'hsla(14, 90%, ' + color_values[index_of_price] + '%, 1)' : 'blue';
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
	// var infowindow = new google.maps.InfoWindow();
	var infoBubble = new InfoBubble({
		map: map,
		content: null,
		position: new google.maps.LatLng(-35, 151),
		shadowStyle: 0,
		padding: 0,
		backgroundColor: 'white',
		borderRadius: 3,
		arrowSize: 10,
		borderWidth: 0,
		borderColor: '#2c2c2c',
		disableAutoPan: true,
		hideCloseButton: true,
		arrowPosition: 40,
		backgroundClassName: 'phoney',
		arrowStyle: 2
	});

	map.data.addListener('mouseover', function (event) {
		var tooltip_text = event.feature.getProperty("price") + " " + event.feature.getProperty("suburb_name");
		var parsed_maps_obj = JSON.parse(JSON.stringify(event.feature.getProperty('bounds')));
		var tooltip_center = {
			'lat': (parsed_maps_obj.north + parsed_maps_obj.south) / 2,
			'lng': (parsed_maps_obj.west + parsed_maps_obj.east) / 2
		};
		infoBubble.content = '<div class="tooltip"><p>' + tooltip_text + '$</p></div>';
		infoBubble.position = new google.maps.LatLng(tooltip_center);
		infoBubble.open();
	});

	// Get the modal
	var modal = document.getElementById('myModal');

// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

	//Modal popup
	map.data.addListener('click', function (event) {
		var suburb = event.feature;
		modal.style.display = "block";
		console.log(suburb.getProperty('suburb_name'));
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