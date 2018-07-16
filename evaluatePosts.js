/*jslint browser:true */
/*global $, jQuery, console, getDateById, getDateDayDifference, page_id_list, getDateInMilliseconds,
facebookPerformRequest, facebookPerformRequestInsight, convertUnixTimestampToExcelDate, PERFORM*/

/**
 * Loads the facebook insight data based on the facebook posting id. Then Inserts insights into spreadsheet.
 * @param  {array} data The facebook post insights
 * @param  {array} post The facebook post details
 */
function insertInsightByPostId(data, post) {
    'use strict';

    var attribute_click = 'link clicks',
        re = new RegExp('MR. VIRAL');
    if (post.status_type === 'mobile_status_update') {
        attribute_click = 'video play';
        post.caption = 'video';

        if (re.test(post.story)) {
            post.caption = 'video_mrviral';
        }
    }

    $.ajax({
        url: 'connectDatabase.php',
        type: 'post',
        cache: false,
        data: "post_id=" + post.id + "&post_caption=" + post.caption + "&post_permalink=" + post.permalink_url + "&post_status_type=" + post.status_type +
            "&post_created_time=" + post.created_time + "&post_link_clicks=" + data[0].values[0].value[attribute_click] + "&post_other_clicks=" + data[0].values[0].value["other clicks"] +
            "&post_impressions_unique=" + data[4].values[0].value + "&post_like_total=" + data[1].values[0].value.like + "&post_comment=" + data[1].values[0].value.comment +
            "&post_share=" + data[1].values[0].value.share + "&post_reaction_like=" + data[3].values[0].value.like + "&post_reaction_love=" + data[3].values[0].value.love +
            "&post_reaction_wow=" + data[3].values[0].value.wow + "&post_reaction_haha=" + data[3].values[0].value.haha + "&post_reaction_sorry=" + data[3].values[0].value.sorry +
            "&post_reaction_anger=" + data[3].values[0].value.anger + "&post_hide_all_clicks=" + data[2].values[0].value.hide_all_clicks + "&post_hide_clicks=" + data[2].values[0].value.hide_clicks +
            "&post_video_views_organic=" + data[5].values[0].value,
        success: function (response) {
            console.log(response);
        }
    });
}

/**
 * Gets the posting insights based on the posting id. Then requests facebook insight data per posting.
 * @param  {array} data Contains an array of postings
 */
function loadInsightPost(data, access_token) {
    'use strict';
    var i, insight_request, post, data_length = data.length;

    for (i = 0; i < data_length; i += 1) {
        post = data[i];

        if ((post.from.name === 'Wir lieben Tiere' || post.from.name === 'Tierfreunde') && (post.status_type === 'mobile_status_update' || post.status_type === 'shared_story')) {
            insight_request = post.id + '/insights/post_consumptions_by_type,post_stories_by_action_type,post_negative_feedback_by_type,post_reactions_by_type_total,post_impressions_unique,post_video_views_organic';
            facebookPerformRequestInsight(insight_request, insertInsightByPostId, post, access_token);
        }
    }
}

/**
 * Gets details about all the facebook postings made between the given dates. For every day difference the system requests the insights for the postings.
 */
function getPageIdList() {
    'use strict';
    var j, date_temporal, feed_request, final_request, access_token,
        date_since = getDateById('date-picker-insights-from'),
        day_difference = getDateDayDifference('date-picker-insights-from', 'date-picker-insights-to'),
        i = 0;

    for (j = 0; j < page_id_list.length; j += 1) {
        feed_request = '/' + page_id_list[j] + '/feed?fields=story,from,caption,permalink_url,status_type,created_time&limit=100';
        date_temporal = new Date(date_since);
        access_token = document.getElementById(page_id_list[0]).value;

        while (i <= day_difference) {
            final_request = feed_request + '&since=' + getDateInMilliseconds(date_temporal);
            date_temporal.setDate(date_temporal.getDate() + 1);
            final_request = final_request + '&until=' + getDateInMilliseconds(date_temporal);
            facebookPerformRequest(final_request, loadInsightPost, access_token);
            i += 1;
        }
        i = 0;
    }
}