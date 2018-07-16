/*jslint browser:true */
/*global $, jQuery, page_id_list, generateTimetable, alert, console, getDateDay, getDateMonth, PERFORM, FB */

/**
 * Takes a positive integer and returns the corresponding column name.
 * @param {integer} num  The positive integer to convert to a column name.
 * @return {string}  The column name.
 */
function toColumnName(num) {
    'use strict';
    var ret = '',
        a = 1,
        b = 26;

    num -= a;
    while (num >= 0) {
        ret = String.fromCharCode(parseInt((num % b) / a, 10) + 65) + ret;
        a = b;
        b *= 26;
        num -= a;
    }
    return ret;
}

function activatePosting() {
    'use strict';
    var rowID = (getDateDay('date-picker-planning') - 1) * 10 + 3,
        columnID = (getDateMonth('date-picker-planning') + 10) * 3 + 1,
        range = 'Links!' + toColumnName(columnID) + rowID + ':' + toColumnName(columnID + 1) + (rowID + 9);
    console.log(range);
    PERFORM.getPosts([range, '1hS0GBSpb-PJ1cvEvt2MQog0fbIF80oSu1Bi8qxKa0lo']);
}

function writeResponseInDatabase(response, time) {
    'use strict';

    $.ajax({
        url: 'connectDatabase.php',
        type: 'post',
        cache: false,
        data: "post_id=" + response + "&post_created_time=" + time,
        success: function (response) {
            console.log(response);
        }
    });
}

function testVideoSchedule() {
    var timetable = generateTimetable();
    var time = timetable[3].getTime() / 1000;
    var access_token = document.getElementById("WirLiebenTiereOfficial").value
    schedulePosts("WirLiebenTiereOfficial", "https://www.facebook.com/BesteUnterhaltungx.WhiteTaiger/videos/2072741876296021/", "", access_token, time);
}

function schedulePosts(pageID, link, message, access_token, time) {
    'use strict';
    FB.api('/' + pageID + '/feed', 'post', {
        published: false,
        link: link,
        message: message,
        access_token: access_token,
        scheduled_publish_time: time
    }, function (response) {
        if (!response || response.error) {
            alert('Error occured');
            console.log(response.error);
        } else {
            writeResponseInDatabase(response.id, (time + 3600));
        }
    });
}

function getLinkTitleAndSchedule(pageID, link, access_token, time) {
    'use strict';
    FB.api('/', 'post', {
        id: link,
        scrape: true,
        access_token: access_token
    }, function (response) {
        var message = response.title;
        schedulePosts(pageID, link, message, access_token, time);
    });
}

function getAccessTokenByPageId(pageID) {
    'use strict';
    FB.api('/BunteTierwelt?fields=access_token', 'get');
}

/**
 * Variable used to plan postings to pre-defined facebook pages. Graph explorer access token is used for authentification.
 */
var PLAN = PLAN || (function () {
    'use strict';
    var args = {};
    return {
        planPosts: function (Args) {
            args = Args;
            var i, j, access_token, pageID, link, time, message, data = args[0],
                timetable = generateTimetable();

            for (j = 0; j < page_id_list.length; j += 1) {
                access_token = document.getElementById(page_id_list[j]).value;
                pageID = page_id_list[j];

                if (access_token) {
                    for (i = 0; i < data.values.length; i += 1) {
                        link = data.values[i][0];
                        if (link) {
                            time = timetable[i].getTime() / 1000;
                            if (data.values[i].length === 1) {
                                getLinkTitleAndSchedule(pageID, link, access_token, time);
                            } else {
                                message = data.values[i][1];
                                schedulePosts(pageID, link, message, access_token, time);
                            }
                        }
                    }
                }
            }
        },
        tmp: function (Args) {
            args = Args;
            var i, id, data = args[0],
                access_token = document.getElementById(page_id_list[0]).value;

            for (i = 330; i < 342; i += 1) {
                id = data.values[i][0];

                FB.api('/' + id + '/?fields=link,message', {
                    access_token: access_token
                }, function (response) {
                    if (response.link !== undefined) {
                        var link = response.link + "?utm_source=Andrgr&utm_campaign=InstantArticle&utm_medium=Partnerp";
                        var message = response.message;
                        var array = [];
                        array[0] = [link, message];
                        var range = 'Likemag!A1:B1';
                        PERFORM.insertPosts([range, array, '1JKJdpZdViPxDFrhr9F5e-rEAE-8Nja-7y5ZoSwS0ntk', 'INSERT_ROWS']);
                    }
                });
            }
        }
    };
}());