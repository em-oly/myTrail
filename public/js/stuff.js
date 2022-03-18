var map;
var database = firebase.database();
var uid = '509d389a-2074-4572-adee-b009ca0601aa';

// Create map - "main"
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(37.784173, -122.401557),
        zoom:15
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.addListener('click', function(event) {
        //placeMarker(event.latLng.lat(), event.latLng.lng());
        // if(firebase.auth().currentUser == null) {
        //     alert('You must be logged in via Facebook(will add other authentication later) to place a Marker.')
        //     return;
        // }
        addMarker(event.latLng.lat(), event.latLng.lng());
        document.getElementById('eventName').value = '';
        document.getElementById('eventDescription').value = '';
        //getMarkerAddress(event.latLng);
    });

    //getUserLocation();  - Not working without SSL Certificate and HTTPS enabled to add later
    addSearchbox();
    processWeather();
    readMarkers();
}

google.maps.event.addDomListener(window, 'load', initialize);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ? 'Geolocation Service failed.' : 'Your browser doesn\'t support geolocation');
}


// **************************************************
// Marker Functions


// Get marker address based on and update info window 
function getMarkerAddress(lat, lng, infowindow) {
    var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'latLng': latLng
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                //alert(results[0].formatted_address);
                infowindow.setContent(infowindow.getContent() + '<div>' + results[0].formatted_address + '</div>');
            }
        }
    });
}

//

// Add marker to the database
function addMarker(lat, lng) {
    //var marker = new google.maps.Marker({
    //    position: new google.maps.LatLng(lat, lon),
    //    map: map
    //});
    if (document.getElementById('eventName').value == '') {
        alert('Enter an Event Name');
        return;
    }
    if (document.getElementById('eventDescription').value == '') {
        alert('Enter an Event Description');
        return;
    }

    addMarkerToDB(uid, lat, lng, 'hello');  

    
}

// Place the Marker on the client map
function placeMarker(lat, lng, markerKey) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map
    });
    
    var infowindow = new google.maps.InfoWindow();
    //alert(toString(getMarkerAddress(lat, lon)));
    //marker.content = getMarkerAddress(lat, lon);
    marker.addListener('click', function () {
        infowindow.setContent(marker.content);
        readEventDataToInfowindow(markerKey, infowindow);
        getMarkerAddress(lat, lng, infowindow);
        infowindow.open(this.map, marker);
    });


}

// Read the Markers from DB
function readMarkers() {
    var ref = firebase.database().ref('/markers/');
    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            placeMarker(childSnapshot.val().latitude, childSnapshot.val().longitude, childSnapshot.key);
            console.log('Placing marker');
        });

    });
}


// Add marker on click to DB
function addMarkerToDB(uid, lat, lng, msg) {
    var markerData = {
        latitude: lat,
        longitude: lng,
    };

    var newMarkerKey = firebase.database().ref().child('markers').push().key;

    var updates = {};
    updates['/markers/' + newMarkerKey] = markerData;


    // Also need to update the database with event data for the given marker on the same key.
    addInputData(newMarkerKey);

    return firebase.database().ref().update(updates).catch(function(error) {return null;});
}


//*********************************************************************
//Event data functions

// Add Event data to using Marker key to database
function addInputData(markerKey) {
    var eventName = document.getElementById('eventName').value;
    var eventDescription = document.getElementById('eventDescription').value;

    var eventData = {
        name: eventName,
        description: eventDescription,
    };

    //firebase.database().ref().child('events').push(markerKey);
    //newEventKey.set({
    //    markerKey: markerKey,
    //    name: eventName,
    //    description: eventDescription
    //})

    var updates = {};
    updates['/events/' + markerKey] = eventData;

    return firebase.database().ref().update(updates).catch(function(error) { return null; });
}


// Read the Event Data for a given marker then place it into 
function readEventDataToInfowindow(markerKey, infowindow) {
    var ref = firebase.database().ref('/events/' + markerKey);
    ref.on('value', function(snapshot) {
        var contentString = '';
        var eventName = '';
        var eventDescription = '';
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.key == 'name') eventName = childSnapshot.val();
            else if (childSnapshot.key == 'description') eventDescription = childSnapshot.val();            
        })

        contentString = '<h1>'+eventName+'</h1>' + '<div>'+eventDescription+'</div>';
        infowindow.setContent(contentString);
    })
}

// Test Function
function addEventDataToInfoWindow(markerKey, infowindow) {
    var event = readEventData(markerKey);
}

// Search and reposition map view
function addSearchbox() {
    var input = document.getElementById('searchMap');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
        map.fitBounds(bounds);
    });

}

function processWeather() {
    var input = document.getElementById('weather');
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          alert(input.value);
          $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/",
            data: { str: input.value}
          }).done(function( o ) {
             // do something
          });
        }
      });
    //alert(input);


}


function writeUserData(userId, lat, lon, msg) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        latitude: lat,
        longitude: lon,
        message: msg
    });
}
