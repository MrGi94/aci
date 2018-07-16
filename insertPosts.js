/*jslint browser:true */
/*global $, jQuery, getDateDayDifference, PERFORM, getDateByIdInMilliseconds, FB, getDateInMilliseconds */

function getCalculationResult(post) {
    'use strict';
    var total_shares = 0,
        like_coefficient = 1.1718;
    if (post.shares !== undefined) {
        total_shares = post.shares.count;
    }
    return total_shares * 12 + post.likes.summary.total_count * like_coefficient + post.comments.summary.total_count * 6;
}

function calculateDataValue(post) {
    'use strict';
    if (post.caption !== undefined) {
        return getCalculationResult(post);
    }
    return 0;
}

function rankData(post1, post2) {
    'use strict';
    return calculateDataValue(post2) - calculateDataValue(post1);
}

function findDuplicateId(dataEntry) {
    'use strict';
    // this represents the id in string form, dataEntry contains the id array
    // return 0 for match, -1 for no match
    if (this.search(dataEntry[0]) === 0) {
        return dataEntry;
    }
}

function findDuplicateData(oldData, newData) {
    'use strict';
    var i, id, post, link, message, date, range,
        limit = getDateDayDifference('date-picker-search', 'date-picker-search-until') * 4,
        counter = 1,
        idArray = oldData[0].values,
        array = [];

    for (i = 0; i < limit; i = i + 1) {
        post = newData.data[i];
        id = post.id;
        link = post.link + "?utm_source=Andrgr&utm_campaign=InstantArticle&utm_medium=Partnerp";
        message = post.message;
        date = new Date(post.created_time).toLocaleString();

        if (idArray === undefined) {
            array[i] = [link, message, date, id];
            counter = counter + 1;
        } else {
            if (idArray.find(findDuplicateId, id) === undefined) {
                array[i] = [link, message, date, id];
                counter = counter + 1;
            }
        }
    }

    range = 'Likemag!A' + 1 + ':D' + counter;
    PERFORM.insertPosts([range, array, '1JKJdpZdViPxDFrhr9F5e-rEAE-8Nja-7y5ZoSwS0ntk', 'INSERT_ROWS']);
}

function loadData() {
    'use strict';
    var pageName = "fuertiere.likemag",
        range = 'Likemag!D1:D200',
        feedRequest = '/feed?fields=id,message,caption,link,shares,permalink_url,status_type,likes.limit(0).summary(true),comments.limit(0).summary(true),created_time&limit=100',
        request = '/' + pageName + feedRequest + '&since=' + getDateByIdInMilliseconds('date-picker-search') + '&until=' + getDateByIdInMilliseconds('date-picker-search-until');

    FB.api(request, function (response) {
        if (response.data !== undefined) {
            response.data.sort(rankData);
            PERFORM.getPostsId([range, response, '1JKJdpZdViPxDFrhr9F5e-rEAE-8Nja-7y5ZoSwS0ntk']);
        }
    });
}

function loadDataById() {
    'use strict';
    var range = 'tmp!A1:B342';
    PERFORM.getPostsUnique([range, '1hS0GBSpb-PJ1cvEvt2MQog0fbIF80oSu1Bi8qxKa0lo']);
}