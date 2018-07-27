/*global document, Mustache, addDnDHandlers, accessSettings, alert */

function setModalPage(checkPostingPlan, title, defaultName) {
    "use strict";
    var modal = document.getElementById("modal-view"),
        modal_title = document.getElementById("modal-title"),
        posting_plan = document.getElementById("posting-plan"),
        page_pool = document.getElementById("page-pool");

    modal.style.display = "block";
    modal_title.innerHTML = title;
    if (checkPostingPlan) {
        posting_plan.style.display = "block";
        page_pool.style.display = "none";
    } else {
        posting_plan.style.display = "none";
        page_pool.style.display = "block";
    }
    document.getElementById(defaultName).click();
}

function removeAllEntries(node) {
    "use strict";
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function saveVisiblePostingPlanEntries() {
    "use strict";
    var i, data, category, times, categories,
        ul = document.getElementById("ul_plan");

    if (ul !== null) {
        times = ul.querySelectorAll("#time");
        categories = ul.querySelectorAll("#category");
        for (i = 0; i < times.length; i = i + 1) {
            category = categories[i].textContent;
            data = {
                "plan_id": ul.parentNode.id.slice(-1),
                "entry_time": times[i].textContent,
                "entry_category": category.replace(/\s/g, '')
            };
            accessSettings(data, "writePostingPlan");
        }
        removeAllEntries(ul);
    }
}

function saveVisiblePagePoolEntries() {
    "use strict";
    var i, data, pages,
        ul_page = document.getElementById("ul_page"),
        ul_source = document.getElementById("ul_source");

    if (ul_page !== null) {
        pages = ul_page.querySelectorAll("#page");
        for (i = 0; i < pages.length; i = i + 1) {
            data = {
                "pool_id": ul_page.parentNode.id.slice(-1),
                "page_name": pages[i].textContent,
                "is_source": 0
            };
            accessSettings(data, "writePageList");
        }
        removeAllEntries(ul_page);
    }

    if (ul_source !== null) {
        pages = ul_source.querySelectorAll("#page");
        for (i = 0; i < pages.length; i = i + 1) {
            data = {
                "pool_id": ul_source.parentNode.id.slice(-1),
                "page_name": pages[i].textContent,
                "is_source": 1
            };
            accessSettings(data, "writePageList");
        }
        removeAllEntries(ul_source);
    }
}

function hideTabContents() {
    "use strict";
    var i, tablinks,
        tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i = i + 1) {
        tabcontent[i].style.display = "none";
        //saveVisiblePostingPlanEntries();
        //saveVisiblePagePoolEntries();
        tabcontent[i].innerHTML = "";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i = i + 1) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}

function getPostingPlanHeader(planName) {
    "use strict";
    var template = [
        '<div class="planHeader">',
        '<input type="time" class="planTime" id="planTime">',
        '<select class="planCategory" id="planCategory">',
        '<option value="video">Video</option>',
        '<option value="gallery">Gallery</option>',
        '<option value="image">Image</option>',
        '<option value="extern">Extern</option>',
        '<option value="amazon">Amazon</option>',
        '<option value="push">Push</option>',
        '</select>',
        '<span onclick="newElement()" class="planAddEntry">+</span>',
        '</div>',
        '<ul id="ul_plan"></ul>'
    ].join("\n");

    accessSettings(planName.slice(-1), "readPostingPlan");
    return template;
}

function showPostingPlan() {
    "use strict";
    setModalPage(true, "Posting Plan", "defaultPlan");
}

function openPlan(e, planName) {
    "use strict";
    hideTabContents();
    var tabcontent = document.getElementById(planName);

    tabcontent.style.display = "block";
    tabcontent.innerHTML = getPostingPlanHeader(planName);
    e.currentTarget.className += " active";
}

function deletePostingPlanEntry(e) {
    "use strict";
    var parent_element = e.currentTarget.parentElement,
        time = parent_element.children[0].innerText,
        category = parent_element.children[1].innerText,
        plan_id = parent_element.parentElement.parentElement.id.slice(-1),
        data = {
            "plan_id": plan_id,
            "entry_time": time,
            "entry_category": category
        };
    accessSettings(data, "deletePlanEntry");
    parent_element.remove();
}

function getPostingPlanEntry(time, category) {
    "use strict";
    var template, data = {
        time: time,
        category: category
    };

    template = [
        '<label id="time"> {{time}}',
        '</label> | <label id="category"> {{category}} </label>',
        '<span class="close" onclick="deletePostingPlanEntry(event)">',
        '\u00D7</span>'
    ].join("\n");

    return Mustache.render(template, data);
}

var dragSrcEl = null;

function handleDragStart(e) {
    "use strict";
    // Target (this) element is the source node.
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.outerHTML);
    this.classList.add("dragElem");
}

function handleDragOver(e) {
    "use strict";
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    this.classList.add("over");
    e.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
    return false;
}

function handleDragEnter() {
    "use strict";
    return;
    // this / e.target is the current hover target.
}

function handleDragLeave() {
    "use strict";
    this.classList.remove("over"); // this / e.target is previous target element.
}

function handleDrop(e) {
    "use strict";
    // this/e.target is current target element.
    if (e.stopPropagation) {
        e.currentTarget.style.opacity = 1;
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl !== this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        //alert(this.outerHTML);
        //dragSrcEl.innerHTML = this.innerHTML;
        //this.innerHTML = e.dataTransfer.getData('text/html');
        this.parentNode.removeChild(dragSrcEl);
        var dropElem, dropHTML = e.dataTransfer.getData("text/html");
        this.insertAdjacentHTML("beforebegin", dropHTML);
        dropElem = this.previousSibling;
        addDnDHandlers(dropElem);
    }
    this.classList.remove("over");
    return false;
}

function handleDragEnd() {
    "use strict";
    // this/e.target is the source node.
    this.classList.remove("over");

    /*[].forEach.call(cols, function (col) {
      col.classList.remove('over');
    });*/
}

/* Add Drag & Drop functionality */
function addDnDHandlers(elem) {
    "use strict";
    elem.addEventListener("dragstart", handleDragStart, false);
    elem.addEventListener("dragenter", handleDragEnter, false);
    elem.addEventListener("dragover", handleDragOver, false);
    elem.addEventListener("dragleave", handleDragLeave, false);
    elem.addEventListener("drop", handleDrop, false);
    elem.addEventListener("dragend", handleDragEnd, false);
}

/* Store new posting plan entry in database */
function saveNewPostingPlanEntry(time, category, plan_id) {
    "use strict";
    var data = {
        "plan_id": plan_id,
        "entry_time": time,
        "entry_category": category
    };
    accessSettings(data, "writePostingPlan");
}

/* Add new entry to the plan view */
function newElement() {
    "use strict";
    var li = document.createElement("li"),
        ul = document.getElementById("ul_plan"),
        time = document.getElementById("planTime").value,
        category = document.getElementById("planCategory").value;

    if (time === "") {
        time = "00:00";
    }
    li.draggable = true;
    li.innerHTML = getPostingPlanEntry(time, category);
    addDnDHandlers(li);
    ul.appendChild(li);
    saveNewPostingPlanEntry(time, category, ul.parentNode.id.slice(-1));
}

/* Create template based plan entries */
function addPlanEntries(data) {
    "use strict";
    var i, li, ul = document.getElementById("ul_plan");

    for (i = 0; i < data.length; i = i + 1) {
        li = document.createElement("li");
        li.draggable = true;
        li.innerHTML = getPostingPlanEntry(data[i].time.substring(0, 5), data[i].category);
        addDnDHandlers(li);
        ul.appendChild(li);
    }
}

/* PAGE POOL SECTION */

function showPagePool() {
    "use strict";
    setModalPage(false, "Page Pool", "defaultPool");
}

function getPagePoolHeader(poolName) {
    "use strict";
    var template = [
        '<div class="planHeader">',
        '<label style="color:white;">Choose posting plan:</label>',
        '<select class="poolPlan" id="poolPlan" onchange="updatePoolPlan()">',
        '<option value="1">Plan 1</option>',
        '<option value="2">Plan 2</option>',
        '<option value="3">Plan 3</option>',
        '</select><p/>',
        '<input type="text" class="poolList" id="pageName" placeholder="Page...">',
        '<span onclick="newPage(0)" class="pageAddEntry">+</span>',
        '<input type="text" class="poolSource" id="sourceName" placeholder="Source...">',
        '<span onclick="newPage(1)" class="pageAddEntry">+</span>',
        '</div>',
        '<ul id="ul_page" class="ulPages"></ul>',
        '<ul id="ul_source" class="ulPages"></ul>'
    ].join("\n");

    accessSettings(poolName.slice(-1), "readPagePool");
    return template;
}

function openPool(e, poolName) {
    "use strict";
    var tabcontent = document.getElementById(poolName);

    hideTabContents();
    tabcontent.style.display = "block";
    tabcontent.innerHTML = getPagePoolHeader(poolName);
    e.currentTarget.className += " active";
}

function deletePageEntry(e) {
    "use strict";
    var parent_element = e.currentTarget.parentElement,
        page_name = parent_element.firstChild.innerText,
        pool_id = parent_element.parentElement.parentElement.id.slice(-1),
        data = {
            "pool_id": pool_id,
            "page_name": page_name
        };
    accessSettings(data, "deletePageEntry");
    parent_element.remove();
}

function getPoolEntryTemplate(page) {
    "use strict";
    var template, data = {
        page: page
    };

    template = [
        '<label id="page">{{page}}</label>',
        '<span class="close" onclick="deletePageEntry(event)">',
        '\u00D7</span>'
    ].join("\n");

    return Mustache.render(template, data);
}

function copyExists(node, name) {
    "use strict";
    var i, pages = node.querySelectorAll("#page");
    for (i = 0; i < pages.length; i = i + 1) {
        if (pages[i].textContent === name) {
            alert("The page: " + name + " exists already!");
            return true;
        }
    }
    return false;
}

/* Store new page entry in database */
function saveNewPageEntry(page_name, source, pool_id) {
    "use strict";
    var data = {
        "pool_id": pool_id,
        "page_name": page_name,
        "is_source": source
    };
    accessSettings(data, "writePageList");
}

/* Add new page to the page view */
function newPage(source) {
    "use strict";
    var page, ul, li = document.createElement("li");

    if (source === 0) {
        page = document.getElementById("pageName");
        ul = document.getElementById("ul_page");
    } else {
        page = document.getElementById("sourceName");
        ul = document.getElementById("ul_source");
    }

    if (page.value !== "" && !copyExists(ul, page.value)) {
        li.innerHTML = getPoolEntryTemplate(page.value);
        ul.appendChild(li);
        saveNewPageEntry(page.value, source, ul.parentNode.id.slice(-1));
    }
    page.value = "";
}

/* Add new source to the page view */
function newSource() {
    "use strict";
    var li = document.createElement("li"),
        ul = document.getElementById("ul_source"),
        source = document.getElementById("sourceName");

    if (source.value !== "" && !copyExists(ul, source.value)) {
        li.innerHTML = getPoolEntryTemplate(source.value);
        ul.appendChild(li);
    }
    source.value = "";
}

function updatePoolPlan() {
    "use strict";
    var data, plan = document.getElementById("poolPlan"),
        pool_id = plan.parentNode.parentNode.id.slice(-1);

    data = {
        "plan_id": plan.value,
        "pool_id": pool_id
    };
    accessSettings(data, "writePoolPlan");
}

function addPoolEntries(data, data_plan) {
    "use strict";
    var i, li, plan = document.getElementById("poolPlan"),
        ul_source = document.getElementById("ul_source"),
        ul_page = document.getElementById("ul_page");

    plan.value = data_plan[0].plan_id;
    if (data.length !== 0) {
        for (i = 0; i < data.length; i = i + 1) {
            li = document.createElement("li");
            li.innerHTML = getPoolEntryTemplate(data[i].page_name);
            if (data[i].is_source === "1") {
                ul_source.appendChild(li);
            } else {
                ul_page.appendChild(li);
            }
        }
    }
}