var sessionToken = getCookieValue('session_token');
 

if (!sessionToken) {
	window.location.href = "/login.html";
} else {
	deviceRoute();
}

function getCookieValue(name) {
	let nameString = name + "=";
	let value = null;
	document.cookie.split(';').forEach(function (cookie) {
		cookie = cookie.trim();
		if (cookie.indexOf(nameString) == 0) {
			value = cookie.substring(nameString.length, cookie.length);
		}
	});
	return value;
}


