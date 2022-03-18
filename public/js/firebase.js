var database = firebase.database();

function writeUserData(userId, lat, lon, msg) {
	firebase.database().ref('users/' + userId).set({
		username: name,
		latitude: lat,
		longitude: lon,
		message: msg
	});
}

function addMarker(uid, lat, lon, msg) {
	var markerData = {
		latitude: lat,
		longitude: lon,
		message: msg
	};

	var newMarkerKey = firebase.database().ref().child('markers').push().key;

	var updates = {};
	updates['/markers/' + newMarkerKey] = markerData;

	return firebase.database().ref().update(updates);
}