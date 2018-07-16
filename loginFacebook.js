/*jslint browser:true */
/*global $, jQuery, console, alert, FB, PLAN */

function statusChangeCallback(response) {
    'use strict';
    if (!response || response.error) {
        alert('Error occured');
    } else if (response.status === 'connected') {
        document.getElementById("userAccessToken").value = response.authResponse.accessToken;
    }
}

function checkLoginState() {
    'use strict';
    FB.getLoginStatus(function (response) {
        console.log(response.authResponse.accessToken);
        //document.getElementById("userAccessToken").value = accessToken;
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    'use strict';
    FB.init({
        appId: '1703881166312226',
        cookie: true,
        xfbml: true,
        version: 'v3.0'
    });
    //  FB.AppEvents.logPageView();
    // console.log("howdy");
    FB.getLoginStatus(function (response) {
        //     if (response.status === 'connected') {
        //         var accessToken = response.authResponse.accessToken;
        //         console.log(accessToken);
        //         document.getElementById("userAccessToken").value = accessToken;
        //     }
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    'use strict';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function facebookPerformRequest(request, callback, access_token) {
    'use strict';

    FB.api(request, {
        access_token: access_token
    }, function (response) {
        if (response.data !== undefined) {
            callback(response.data, access_token);
        }
    });
}

function test(request, pageName) {
    'use strict';

    FB.api(request, function (response) {
        if (response.data !== "undefined") {
            console.log(response);
            response.data.sort(rankData);
            processData(response, pageName);
        }
    });
}

function facebookPerformRequestInsight(request, callback, post, access_token) {
    'use strict';
    FB.api(request, {
        access_token: access_token
    }, function (response) {
        if (response.data !== undefined) {
            callback(response.data, post);
        }
    });
}