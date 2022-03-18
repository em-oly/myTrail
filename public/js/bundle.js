// /******/ (function(modules) { // webpackBootstrap
// /******/ 	// The module cache
// /******/ 	var installedModules = {};

// /******/ 	// The require function
// /******/ 	function __webpack_require__(moduleId) {

// /******/ 		// Check if module is in cache
// /******/ 		if(installedModules[moduleId])
// /******/ 			return installedModules[moduleId].exports;

// /******/ 		// Create a new module (and put it into the cache)
// /******/ 		var module = installedModules[moduleId] = {
// /******/ 			exports: {},
// /******/ 			id: moduleId,
// /******/ 			loaded: false
// /******/ 		};

// /******/ 		// Execute the module function
// /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

// /******/ 		// Flag the module as loaded
// /******/ 		module.loaded = true;

// /******/ 		// Return the exports of the module
// /******/ 		return module.exports;
// /******/ 	}


// /******/ 	// expose the modules object (__webpack_modules__)
// /******/ 	__webpack_require__.m = modules;

// /******/ 	// expose the module cache
// /******/ 	__webpack_require__.c = installedModules;

// /******/ 	// __webpack_public_path__
// /******/ 	__webpack_require__.p = "";

// /******/ 	// Load entry module and return exports
// /******/ 	return __webpack_require__(0);
// /******/ })
// /************************************************************************/
// /******/ ([
// /* 0 */
// /***/ function(module, exports, __webpack_require__) {

// 	__webpack_require__(1);
// 	__webpack_require__(2);
// 	module.exports = __webpack_require__(3);


// /***/ },
// /* 1 */
// /***/ function(module, exports) {

// 	var states = {
// 		map: 'bar'
// 	}

// /***/ },
// /* 2 */
// /***/ function(module, exports, __webpack_require__) {

// 	//var map;
// 	var states = __webpack_require__(1);
// 	console.log(states.map);
// 	var database = firebase.database();
// 	var uid = '509d389a-2074-4572-adee-b009ca0601aa';

// 	function initialize() {
// 	    var mapOptions = {
// 	        center: new google.maps.LatLng(37.784173, -122.401557),
// 	        zoom:15
// 	    };
// 	    states.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
// 	    states.map.addListener('click', function(event) {
// 	        placeMarker(event.latLng.lat(), event.latLng.lng());
// 	        addMarkerToDB(event.latLng.lat(), event.latLng.lng());
// 	        //getMarkerAddress(event.latLng);
// 	    });
// 	    readMarkers();
// 	}

// 	function getMarkerAddress(lat, lon, infowindow) {
// 	    var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
// 	    var geocoder = new google.maps.Geocoder();

// 	    geocoder.geocode({
// 	        'latLng': latLng
// 	    }, function(results, status) {
// 	        if (status == google.maps.GeocoderStatus.OK) {
// 	            if (results[0]) {
// 	                //alert(results[0].formatted_address);
// 	                infowindow.setContent(results[0].formatted_address);
// 	            }
// 	        }
// 	    });
// 	}


// 	function addMarker(lat, lon) {
// 	    //var marker = new google.maps.Marker({
// 	    //    position: new google.maps.LatLng(lat, lon),
// 	    //    map: map
// 	    //});

// 	    addMarkerToDB(uid, lat, lon, 'hello');  
// 	}

// 	google.maps.event.addDomListener(window, 'load', initialize);

// 	// Place the Marker on the client map
// 	function placeMarker(lat, lon) {
// 	    var marker = new google.maps.Marker({
// 	        position: new google.maps.LatLng(lat, lon),
// 	        map: states.map
// 	    });
	    
// 	    var infowindow = new google.maps.InfoWindow();
// 	    //alert(toString(getMarkerAddress(lat, lon)));
// 	    //marker.content = getMarkerAddress(lat, lon);
// 	    marker.addListener('click', function () {
// 	        infowindow.setContent(marker.content);
// 	        getMarkerAddress(lat, lon, infowindow);
// 	        infowindow.open(this.map, marker);
// 	    });


// 	}


// 	function writeUserData(userId, lat, lon, msg) {
// 	    firebase.database().ref('users/' + userId).set({
// 	        username: name,
// 	        latitude: lat,
// 	        longitude: lon,
// 	        message: msg
// 	    });
// 	}

// 	// Add marker on click to DB
// 	function addMarkerToDB(uid, lat, lon, msg) {
// 	    var markerData = {
// 	        latitude: lat,
// 	        longitude: lon,
// 	    };

// 	    var newMarkerKey = firebase.database().ref().child('markers').push().key;

// 	    var updates = {};
// 	    updates['/markers/' + newMarkerKey] = markerData;

// 	    return firebase.database().ref().update(updates);
// 	}

// 	// Read the Markers from DB
// 	function readMarkers() {
// 	    var ref = firebase.database().ref('/markers/');
// 	    ref.on('value', function(snapshot) {
// 	        snapshot.forEach(function(childSnapshot) {
// 	            placeMarker(childSnapshot.val().latitude, childSnapshot.val().longitude);
// 	        });

// 	    });
// 	}

// /***/ },
// /* 3 */
// /***/ function(module, exports, __webpack_require__) {

// 	var states = __webpack_require__(1);
// 	var input = document.getElementById('searchMap');

// 	console.log(states.map);
// 	var searchBox = new google.maps.places.SearchBox(input);
// 	states.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// /***/ }
// /******/ ]);