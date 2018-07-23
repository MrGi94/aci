/*global console, alert, XMLHttpRequest */

function reqListener() {
    "use strict";
    console.log(this.responseText);
}

var oReq = new XMLHttpRequest(); //New request object
oReq.onload = function () {
    "use strict";
    //This is where you handle what to do with the response.
    //The actual data is found on this.responseText
    alert(this.responseText); //Will alert: 42
};
// oReq.open("get", "writePostingPlan.php", true);
//                               ^ Don't block the rest of the execution.
//                                 Don't wait until the request finishes to
//                                 continue.
oReq.send();