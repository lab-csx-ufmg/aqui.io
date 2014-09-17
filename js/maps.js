// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to
// (0,32) to correspond to the base of the flagpole.


function initMapSmall() {
	var mapOptions = {
		zoom : 1,
		center : new google.maps.LatLng(31, -11)
	}
	var map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);

	setMarkers(map, placesLived, livedIcon);
	setMarkers(map, placesVisited, visitedIcon);
}

function initMapBig() {
	var mapOptions = {
		zoom : 2,
		center : new google.maps.LatLng(20, -8)
	}
	var map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);

	setMarkers(map, placesLived, livedIcon);
	setMarkers(map, placesVisited, visitedIcon);
}

/**
 * Data for the markers consisting of a name, a LatLng and a zIndex for the
 * order in which these markers should display on top of each other.
 */
var placesLived = [ [ 'Belo Horizonte', -19.8157, -43.9542, 5 ],
		[ 'Schmalkalden', 50.716667, 10.450000, 5 ] ];

var placesVisited = [ [ 'Berlin', 52.5243700, 13.4105300, 2 ],
		[ 'London', 51.5085300, -0.1257400, 2 ],
		[ 'Munich', 48.1374300, 11.5754900, 2 ],
		[ 'Hamburg', 53.5500000, 10.0000000, 2 ],
		[ 'Frankfurt', 50.1166700, 8.6833300, 2 ],
		[ 'Leipzig', 51.3396200, 12.3712900, 2 ],
		[ 'Erfurt', 50.9833300, 11.0333300, 2 ],
		[ 'Duesseldorf', 51.2217200, 6.7761600, 2 ],
		[ 'Cologne', 50.9333300, 6.9500000, 2 ],
		[ 'Prague', 50.0880400, 14.4207600, 2 ],
		[ 'Vienna', 48.2084900, 16.3720800, 2 ],
		[ 'Budapest', 47.4980100, 19.0399100, 2 ],
		[ 'Zurich', 47.3666700, 8.5500000, 2 ],
		[ 'Moscow', 55.7522200, 37.6155600, 2 ],
		[ 'São Paulo', -23.5475000, -46.6361100, 2 ],
		[ 'Rio de Janeiro', -22.9027800, -43.2075000, 2 ],
		[ 'Fortaleza', -3.7172200, -38.5430600, 2 ],
		[ 'Natal', -5.7950000, -35.2094400, 2 ],
		[ 'Porto Alegre', -30.0330600, -51.2300000, 2 ],
		[ 'Florianópolis', -27.5966700, -48.5491700, 2 ],
		[ 'Curitiba', -25.4277800, -49.2730600, 2 ],
		[ 'Salvador', -12.9711100, -38.5108300, 2 ],
		[ 'Brasilia', -15.7797200, -47.9297200, 2 ],
		[ 'Vitória', -20.3194400, -40.3377800, 2 ],
		[ 'Aracaju', -10.9111100, -37.0716700, 2 ],
		[ 'Maceió', -9.6658300, -35.7352800, 2 ],
		[ 'João Pessoa', -7.1150000, -34.8630600, 2 ],
		[ 'Recife', -8.0538900, -34.8811100, 2 ],
		[ 'Goiânia', -16.6786100, -49.2538900, 2 ] ];

// Origins, anchor positions and coordinates of the marker
// increase in the X direction to the right and in
// the Y direction down.
var livedIcon = {
	url : 'img/home-4.png',
	// This marker is 20 pixels wide by 32 pixels tall.
	size : new google.maps.Size(20, 23),
	// The origin for this image is 0,0.
	origin : new google.maps.Point(0, 0),
	// The anchor for this image is the base of the flagpole at 0,32.
	anchor : new google.maps.Point(10, 23)
};

var visitedIcon = {
	url : 'img/airport2.png',
	// This marker is 20 pixels wide by 32 pixels tall.
	size : new google.maps.Size(16, 19),
	// The origin for this image is 0,0.
	origin : new google.maps.Point(0, 0),
	// The anchor for this image is the base of the flagpole at 0,32.
	anchor : new google.maps.Point(8, 19)
};

function setMarkers(map, locations, image) {
	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Shapes define the clickable region of the icon.
	// The type defines an HTML &lt;area&gt; element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	var shape = {
		coords : [ 0, 0, 16, 0, 16, 19, 0, 19 ],
		type : 'poly'
	};
	for ( var i = 0; i < locations.length; i++) {
		var beach = locations[i];
		var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
		var marker = new google.maps.Marker({
			position : myLatLng,
			map : map,
			icon : image,
			shape : shape,
			title : beach[0],
			zIndex : beach[3]
		});
	}
}

google.maps.event.addDomListener(window, 'load', initMapSmall);