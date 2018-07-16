/*jslint browser:true */
/*global $, jQuery, console, alert, gapi, PLAN */

// Client ID and API key from the Developer Console
var CLIENT_ID = '277661101934-sgrsivkl1aud0r0gkomlrbfaibipc431.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCREINSeK3KfMRg1c24j7EjxrjgdjavP0s';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    'use strict';
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    'use strict';
    gapi.auth2.getAuthInstance().signOut();
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    'use strict';
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    'use strict';
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPE
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    'use strict';
    gapi.load('client:auth2', initClient);
}

var PERFORM = PERFORM || (function () {
    'use strict';
    var args = {};

    return {
        getPosts: function (Args) {
            args = Args;
            var range = args[0],
                spreadsheetId = args[1];
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: range
            }).then(function (response) {
                PLAN.planPosts([response.result]);
            });
        },
        getPostsUnique: function (Args) {
            args = Args;
            var range = args[0],
                spreadsheetId = args[1];
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: range
            }).then(function (response) {
                PLAN.tmp([response.result]);
            });
        },
        getPostsId: function (Args) {
            args = Args;
            var range = args[0],
                spreadsheetId = args[2],
                newData = args[1];
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: range
            }).then(function (response) {
                findDuplicateData([response.result], newData);
            });
        },
        insertPosts: function (Args) {
            args = Args;
            var range = args[0],
                values = args[1],
                spreadsheetId = args[2],
                insertDataOption = args[3],
                params = {
                    spreadsheetId: spreadsheetId,
                    range: range,
                    // How the input data should be interpreted.
                    valueInputOption: 'RAW',
                    // How the input data should be inserted.
                    insertDataOption: insertDataOption
                },
                valueRangeBody = {
                    range: range,
                    values: values
                },
                request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
            request.then(function (response) {
                console.log(response.result);
            }, function (reason) {
                alert('error: ' + reason.result.error.message);
                console.error('error: ' + reason.result.error.message);
            });
        }
    };
}());