/*global $, addPlanEntries, addPoolEntries, console, alert */

function sendSourcesToServer(sources) {
    "use strict";
    $.ajax({
        url: "http://127.0.0.1:5000/storePageSources",
        type: "post",
        data: sources,
        contentType: "application/json",
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
            alert("Error: Transfer page sources failed");
        }
    });
}

function getPostingsFromServer(pool_id) {
    "use strict";
    $.ajax({
        url: "http://127.0.0.1:5000/getPagePostings",
        type: "get",
        data: {
            "id": pool_id
        },
        contentType: "application/json",
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
            alert("Error: Transfer page postings failed");
        }
    });
}

function runProgram() {
    "use strict";
    $.ajax({
        url: "http://127.0.0.1:5000/run",
        type: "post",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
            alert("Error: Transfer page sources failed");
        }
    });
}

function accessSettings(data, func2call) {
    "use strict";
    $.ajax({
        type: "POST",
        url: "settingsScripts.php",
        data: {
            "func2call": func2call,
            "data": data
        },
        success: function (data) {
            if (data !== undefined && !data.match("<?php")) {
                switch (func2call) {
                case "readPostingPlan":
                    addPlanEntries(JSON.parse(data));
                    break;
                case "readPagePool":
                    var data_split = data.split(";");
                    addPoolEntries(JSON.parse(data_split[0]), JSON.parse(data_split[1]));
                    break;
                case "readPageSource":
                    sendSourcesToServer(data);
                    break;
                case "deletePlanEntry":
                    console.log(data);
                    break;
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}