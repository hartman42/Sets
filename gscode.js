var sheetID = '113pll6NtAXJAOYY2YKvpglQ4hS_WIiz2q5heSGloipA';
var sheetRange = 'Songs!A:BB';
var range;
var currentRow;
var mustHave = 'Audio File';
var showColumns = '[Title][Last Played]';

var CLIENT_ID = '679153078592-q207n5nje739pk4nq81ehd03sabhmct5.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAGQJwsDjRnp9wmtJWd6onWCOUHx2zejrc';
//secret wJAW6osyllY4PgM9fJP-bomx
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	}, function(error) {
		appendPre(JSON.stringify(error, null, 2));
	});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		showSet();
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
	}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}
function showTable(tbl) {
	var div = document.getElementById('content');
	div.innerHTML = tbl;
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function showSet() {
	gapi.client.sheets.spreadsheets.values.get({
		spreadsheetId: sheetID,
		range: sheetRange,
	}).then(function(response) {
		range = response.result;
		if (range.values.length > 0) {
			var tbl = '<table>';
			var e;
			for (i = 0; i < range.values.length; i++) {
				if (range.values[i][range.values[0].indexOf(mustHave)]) {
					var row = range.values[i];
					tbl += '<tr>';
					e = (i==0) ? 'th':'td';
					for (j = 0; j < row.length; j++) {
						if (showColumns.indexOf('[' + range.values[0][j] + ']')>=0) {
							tbl += '<' + e + '>' + row[j] + '</' + e + '>';
						}
					}
					tbl += '</tr>';
				};
			}
			tbl += '</table>';
			showTable(tbl);
			audio.src = firstTune();
		} else {
			appendPre('No data found.');
		}
	}, function(response) {
		appendPre('Error: ' + response.result.error.message);
	});
}

function firstTune() {
	//go through the range and find what the last tune that was played was
	var mostRecentTime;

	for (var i = 1; i < range.values.length; i++) {
		if (range.values[i][range.values[0].indexOf('Last Played')]) {
			if (mostRecentTime) {
				var d = new Date(range.values[i][range.values[0].indexOf('Last Played')]);
				if (d > mostRecentTime) {
					currentRow = i;
					mostRecentTime = d;
				}
			} else {
				mostRecentTime = new Date(range.values[i][range.values[0].indexOf('Last Played')]);
				currentRow = i;
			}
		}
	}

	getNextValidRow();

	return getAudioFile();

}

function getAudioFile() {
	var f = range.values[currentRow][range.values[0].indexOf('Audio File')];
	return f.replace(/\?dl\=0/g,'?raw=1');
}

function updateLastPlayed() {
	var params = {
        // The ID of the spreadsheet to update.
        spreadsheetId: sheetID,  // TODO: Update placeholder value.

        // The A1 notation of the values to update.
        range: sheetRange,  // TODO: Update placeholder value.

        // How the input data should be interpreted.
        valueInputOption: 'RAW'  // TODO: Update placeholder value.
	};

	var d = new Date();
	var s = (d.getMonth() + 1) + '/' + d.getDay() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + ('0' + d.getMinutes()).trimRight(2);

	range.values[currentRow][range.values[0].indexOf('Last Played')] = s;

	var valueRangeBody = {
        // TODO: Add desired properties to the request body. All existing properties
		// will be replaced.
		values: range.values
	};

	var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
	request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
	}, function(reason) {
        console.error('error: ' + reason.result.error.message);
	});
}

