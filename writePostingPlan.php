<?php
function writePostingPlan()
{
    require "connectToDatabase.php";

    $plan_id=isset($_POST['plan_id']) ? $_POST['plan_id'] : null;
    $entry_time=isset($_POST['entry_time']) ? $_POST['entry_time'] : null;
    $entry_category=isset($_POST['entry_category']) ? $_POST['entry_category'] : null;

    $sql = "INSERT INTO posting_plan (plan_id, entry_time, entry_category) VALUES ('$plan_id', '$entry_time', '$entry_category')";

    if ($mysqli->query($sql) === true) {
        echo "entry added";
    } else {
        echo "Error: " . $sql . $mysqli->error;
    }

    $mysqli->close();
}
