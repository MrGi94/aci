/*global $, addPlanEntries, addPoolEntries */

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
                if (func2call === "readPostingPlan") {
                    addPlanEntries(JSON.parse(data));
                } else if (func2call === "readPagePool") {
                    var data_split = data.split(";");
                    addPoolEntries(JSON.parse(data_split[0]), JSON.parse(data_split[1]));
                }
            }
        }
    });
}

function scrapeData() {
    "use strict";
    $.ajax({
        url: "http://mrgi.pythonanywhere.com/",
        type: "post",
        data: "param",
        dataType: "json",
        success: function (response) {
            alert(response);
        },
        error: function (error) {
            alert("Error: " + error);
        }
    });
}