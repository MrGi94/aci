/*jslint browser:true */

/**
 * Number of milliseconds per day
 * @type {integer}
 */
var milliseconds_per_day = 1000 * 60 * 60 * 24;

/**
 * Returns the day of the given date element
 * @param  {string} date_id id of the input type=date
 * @return {integer}         returns the number of days
 */
function getDateDay(date_id) {
    "use strict";
    var date = document.getElementById(date_id).valueAsDate;
    return date.getDate();
}

/**
 * Returns the month of the given date element
 * @param  {string} date_id id of the input type=date
 * @return {integer}         returns the months, starts at 0 therefore +1
 */
function getDateMonth(date_id) {
    "use strict";
    var date = document.getElementById(date_id).valueAsDate;
    return date.getMonth() + 1;
}

/**
 * Returns the year of the given date element
 * @param  {string} date_id id of the input type=date
 * @return {integer}         returns the year
 */
function getDateYear(date_id) {
    "use strict";
    var date = document.getElementById(date_id).valueAsDate;
    return date.getFullYear();
}

/**
 * Converts the given id in a date element and returns the date in milliseconds. Result is rounded downwards.
 * @param  {string} date_id id of the input type=date
 * @return {integer}         date in milliseconds
 */
function getDateByIdInMilliseconds(date_id) {
    "use strict";
    var date = document.getElementById(date_id).valueAsDate;
    return Math.floor(date.valueOf() / 1000);
}

/**
 * Returns the given date element in milliseconds. Result is rounded downwards.
 * @param  {Date} date The date element to be converted
 * @return {integer}      date in milliseconds
 */
function getDateInMilliseconds(date) {
    "use strict";
    return Math.floor(date.valueOf() / 1000);
}

/**
 * Converts the given id in a date element and returns the date element.
 * @param  {string} date_id id of the input type=date_id
 * @return {Date}         Date
 */
function getDateById(date_id) {
    "use strict";
    return document.getElementById(date_id).valueAsDate;
}

/**
 * Returns the difference of days between two dates. Absolute result is rounded downwards.
 * @param  {string} date_id id of the input type=date
 * @return {integer}         number of days
 */
function getDateDayDifference(date_id_1, date_id_2) {
    "use strict";
    var date_until,
        date_today = new Date(),
        date_since = document.getElementById(date_id_1).valueAsDate,
        utc1 = Date.UTC(date_today.getFullYear(), date_today.getMonth(), date_today.getDate()),
        utc2 = Date.UTC(date_since.getFullYear(), date_since.getMonth(), date_since.getDate());

    if (date_id_2 !== undefined) {
        date_until = document.getElementById(date_id_2).valueAsDate;
        utc1 = Date.UTC(date_until.getFullYear(), date_until.getMonth(), date_until.getDate());
    }
    return Math.abs(Math.floor((utc2 - utc1) / milliseconds_per_day));
}

/**
 * Generates a timetable to coordinate the planning times of the postings.
 * @return {array} consists of dates.
 */
function generateTimetable() {
    "use strict";
    var year = getDateYear('date-picker-planning'),
        month = getDateMonth('date-picker-planning') - 1,
        day = getDateDay('date-picker-planning'),
        hours = [8, 9, 10, 12, 14, 16, 18, 19, 20, 22],
        minutes = [20, 20, 20, 20, 20, 20, 20, 20, 50, 20],
        timetable = [],
        i;

    for (i = 0; i < hours.length; i = i + 1) {
        timetable[i] = new Date(year, month, day, hours[i], minutes[i], 0, 0);
    }
    return timetable;
}

/**
 * Converts a unix timestamp to excel conform dates.
 * @param  {unix_timestamp} created_time Date in unix timestamp form
 * @return {integer}              Date in milliseconds
 */
function convertUnixTimestampToExcelDate(created_time) {
    "use strict";
    // 25569 days between 1.1.1900 and 1.1.1970
    return ((getDateInMilliseconds(new Date(created_time)) + 3600) * 1000) / 86400000 + 25569;
}