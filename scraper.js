var table = document.getElementById("ranking");
var feedRequest = '/feed?fields=message,caption,link,story,attachments{subattachments,url},permalink_url,full_picture,shares,source,status_type,likes.limit(0).summary(true),comments.limit(0).summary(true),created_time&limit=100';
var likeCoefficient = 1.1718;
var total_value = 0;
var total_posts = 0;

function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

function isStringEmpty(content) {
    return content.length < 1;
}

function getDateSince() {
    //var dateSince = document.getElementById("configurationTable").rows[2].cells[1].textContent;
    //if (isStringEmpty(dateSince)) {
    dateSince = new Date();
    dateSince.setFullYear(dateSince.getFullYear() - 1);
    return dateSince;
    //} else {
    //  return dateSince;
    //}
}

function getDateUntil() {
    //var dateUntil = document.getElementById("configurationTable").rows[3].cells[1].textContent;
    //if (isStringEmpty(dateUntil)) {
    dateUntil = new Date();
    return dateUntil;
    //  } else {
    //    return dateUntil;
    //}
}

function performQuery(pageName, since, until) {
    var pageName = "FrauenMitStil";
    var request = '/' + pageName + feedRequest;

    if (since) {
        request = request.concat('&since=' + since);
    }

    if (until) {
        request = request.concat('&until=' + until);
    }
    console.log(request);
    FB.api(request, function (response) {
        console.log(response);
        if (typeof response.data !== "undefined") {
            response.data.sort(rankData);
            processData(response, pageName);
        }
    });
}

function performQueryA() {
    console.log("performing query...");
    clearTable();
    postLimit = 10; //getPostLimit();
    amznSearch = false; //getAmazonSearch();
    extSearch = true; //getExternSearch();
    var dateSince = getDateSince();
    var dateUntil = getDateSince();
    var today = new Date();
    pageName = "BesteUnterhaltungx.WhiteTaiger";

    do {
        dateUntil.setDate(dateUntil.getDate() + 7);

        var request = '/' + pageName + feedRequest + '&since=' + (dateSince.getTime() / 1000 | 0) + '&until=' + (dateUntil.getTime() / 1000 | 0);
        fbPosts(request, function (response) {
            response.data.sort(rankData);
            processData(response, pageName);
        });
        dateSince.setDate(dateSince.getDate() + 7);
    } while (dateUntil.getTime() < today.getTime())

}

function clearTable() {
    table.innerHTML = "";
}

function fbPosts(request, callback) {
    FB.api(request, function (response) {
        callback(response);
    });
}

function rankData(post1, post2) {
    return calculateDataValue(post2) - calculateDataValue(post1);
}

function calculateDataValue(post) {
    if (extSearch) {
        if (typeof post.caption !== "undefined" && !post.link.includes("facebook.com/") && !post.link.includes("instagram.com/")) {
            return getCalculationResult(post);
        } else {
            return 0;
        }
    } else {
        return getCalculationResult(post);
    }
}

function getCalculationResult(post) {
    var total_shares = 0;
    if (typeof post.shares !== "undefined") {
        total_shares = post.shares.count;
    }
    return total_shares * 12 + post.likes.summary.total_count * likeCoefficient + post.comments.summary.total_count * 6;
}

function getPreviewImage(url) {
    img = document.createElement('img');
    img.src = url;
    img.width = "300";

    //var link = document.createElement('a');
    //link.download = url;
    //link.appendChild(img);
    //link.href = url;
    return img;
}

function processData(response, pageName) {
    var dataLength = response.data.length;

    if (postLimit <= dataLength) {
        dataLength = postLimit;
    }

    if (dataLength > 1) {
        var t_row = document.createElement('tr');
        var td_name = document.createElement('td');
        td_name.appendChild(document.createTextNode(pageName));
        t_row.appendChild(td_name);
        table.appendChild(t_row);

        for (var i = 0; i < dataLength; i++) {
            if (amznSearch || extSearch) {
                var value = calculateDataValue(response.data[i]);
                total_value += value;
                total_posts += 1;
                if (value < 4000) {
                    continue;
                }
            }
            var post = response.data[i];
            t_row = document.createElement('tr');
            var td_type = document.createElement('td');
            var td_prev_img = document.createElement('td');
            var td_activity = document.createElement('td');
            var td_message = document.createElement('td');
            var td_created_time = document.createElement('td');
            var td_post_link = document.createElement('td');
            var td_plan_button = document.createElement('td');
            var type;
            var previewContent;

            switch (post.status_type) {
            case "added_photos":
                previewContent = getPreviewImage(post.full_picture);
                if (typeof post.story !== "undefined" && !post.story.includes("added a new photo")) {
                    type = "Galerie";
                    td_post_link.appendChild(createLinkFromFacebookLink(post.attachments.data[0].url, "Postlink"));
                    // post.attachments.data[0].subattachments.data[j]
                } else {
                    type = "Bild";
                    td_post_link.appendChild(createLinkFromFacebookLink(post.permalink_url, "Postlink"));
                }
                break;
            case "shared_story":
                type = "Geteilt";
                if (typeof post.story !== "undefined") {
                    //if(post.link.includes("gif")){
                    //console.log(post.source);
                    // console.log(post.link);
                    //console.log(post.full_picture);
                    //console.log(post.permalink_url);
                    //previewContent = getPreviewImage("https://cdn.wallgif.com/gifs/8246b4bdcfaec7738a5da840ea2899eb43b264c2.gif");
                    //} else {
                    previewContent = getPreviewVideo(post.full_picture, post.source);
                    //}
                } else {
                    previewContent = getPreviewImage(post.full_picture);
                }
                td_post_link.appendChild(createLinkFromFacebookLink(post.permalink_url, "Postlink"));
                break;
            case "added_video":
                type = "Video";
                previewContent = getPreviewVideo(post.full_picture, post.source);
                td_post_link.appendChild(createLinkFromFacebookLink(post.permalink_url, "Postlink"));
                break;
            }

            td_type.appendChild(document.createTextNode(type));
            t_row.appendChild(td_type);

            td_prev_img.appendChild(previewContent);
            t_row.appendChild(td_prev_img);

            var total_shares = 0;
            if (typeof post.shares !== "undefined") {
                total_shares = post.shares.count;
            }

            var shares = document.createTextNode('shares: ' + total_shares);
            var comments = document.createTextNode('comments: ' + post.comments.summary.total_count);
            var likes = document.createTextNode('likes: ' + Math.ceil(post.likes.summary.total_count * likeCoefficient));

            var activity = document.createElement('div');
            activity.appendChild(shares);
            activity.appendChild(document.createElement('br'));
            activity.appendChild(comments);
            activity.appendChild(document.createElement('br'));
            activity.appendChild(likes);

            td_activity.appendChild(activity);
            t_row.appendChild(td_activity);

            td_message.appendChild(document.createTextNode(post.message));
            t_row.appendChild(td_message);

            if (amznSearch) {
                var linkUrl = convertPostMessageToLink(post.message);
                td_message.appendChild(document.createElement('br'));
                td_message.appendChild(createLinkFromFacebookLink(linkUrl, linkUrl));
            }

            var date = new Date(post.created_time)
            td_created_time.appendChild(document.createTextNode(date.toLocaleString()));
            t_row.appendChild(td_created_time);

            td_post_link.appendChild(document.createElement('br'));
            td_post_link.appendChild(createLinkFromFacebookLink(post.link, "Externer link"));
            t_row.appendChild(td_post_link);

            table.appendChild(t_row);
        }
    }
    console.log(total_value / total_posts);
}

function createButtonWithNameAndConversion(btnName) {
    var btn = document.createElement('BUTTON');
    var btnText = document.createTextNode(btnName);
    btn.appendChild(btnText);
    btn.onclick = function () {
        var campaignMessage = getPostMessage(this);
        var campaignLink = getPostLink(this)
        convertLinkCampaign(btnName, campaignMessage, campaignLink);
    };
    return btn;
}

function createLinkFromFacebookLink(link, linkName) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(linkName);
    a.appendChild(linkText);
    a.target = "_blank";
    a.href = link;
    return a;
}

function getPostLink(element) {
    var row = element.parentNode.parentNode.rowIndex;
    var column = element.parentNode.cellIndex - 1;
    var links = convertPostMessageToLink(document.getElementById('ranking').rows[row].cells[column].innerHTML);
    return links[1];
}

function getPostMessage(element) {
    var row = element.parentNode.parentNode.rowIndex;
    var column = element.parentNode.cellIndex - 3;
    return document.getElementById('ranking').rows[row].cells[column].innerText;
}

function convertLinkCampaign(campaignName, campaignMessage, campaignLink) {
    var splitUrl = campaignLink.split("?");
    if (splitUrl.length > 1) {
        var textarea = document.createElement("textarea");
        var newLink = splitUrl[0] + "?utm_source=mvr&utm_medium=cpc&utm_campaign=" + campaignName;
        textarea.value = campaignMessage + "\n" + newLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function convertPostMessageToLink(message) {
    var uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?������]))/ig;
    return message.match(uri_pattern);
}

function openPageSource(evt, sourceName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(sourceName).style.display = "block";
    evt.currentTarget.className += " active";

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(sourceName + "TA").value = parseDatabaseRequest(this.responseText);
        }
    };

    xmlhttp.open("get", "getpagesource.php?q=" + sourceName, true);
    xmlhttp.send();
}

function parseDatabaseRequest(request) {
    request = request.replace(/\s+/g, '');
    var splitRequest = request.split("#");
    return splitRequest[1];
}

function savePages(pageName) {
    var textToSave = document.getElementById(pageName).value;
}