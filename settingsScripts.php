<?php
if (isset($_POST['func2call']) && !empty($_POST['func2call'])) {
    switch ($_POST['func2call']) {
        case "writePostingPlan": writePostingPlan(); break;
        case "readPostingPlan": readPostingPlan(); break;
        case "writePoolPlan": writePoolPlan(); break;
        case "writePageList": writePageList(); break;
        case "readPagePool": readPagePool(); break;
        case "readPageSource": readPageSource(); break;
    }
}

function writePostingPlan()
{
    require "connectToDatabase.php";
    $data = isset($_POST['data']) ? $_POST['data'] : null;
    if ($data !== null) {
        $plan_id=$data['plan_id'];
        $entry_time=$data['entry_time'];
        $entry_category=$data['entry_category'];

        $sql = "INSERT INTO posting_plan (plan_id, entry_time, entry_category) VALUES ('$plan_id', '$entry_time', '$entry_category')";

        if ($mysqli->query($sql) === true) {
            echo "entry added";
        } else {
            echo "Error: " . $sql . $mysqli->error;
        }
        $mysqli->close();
    }
}

function readPostingPlan()
{
    require "connectToDatabase.php";
    $data = isset($_POST['data']) ? $_POST['data'] : null;
    if ($data !== null) {
        $sql = "SELECT entry_time as time, entry_category as category FROM posting_plan WHERE plan_id='$data'";
        $result = $mysqli->query($sql);
        $sqlDelete = "DELETE FROM posting_plan WHERE plan_id='$data'";
        $rows = array();
        if ($result->num_rows !== null) {
            while ($r = mysqli_fetch_assoc($result)) {
                $rows[] = $r;
            }
            echo json_encode($rows);
            $mysqli->query($sqlDelete);
        } else {
            echo "0";
        }
        $mysqli->close();
    }
}

function writePoolPlan()
{
    require "connectToDatabase.php";
    $data = isset($_POST['data']) ? $_POST['data'] : null;
    if ($data !== null) {
        $pool_id=$data['pool_id'];
        $plan_id=$data['plan_id'];

        $sql = "UPDATE page_pool SET plan_id='$plan_id' WHERE pool_id='$pool_id'";

        if ($mysqli->query($sql) === true) {
            echo "pool plan updated";
        } else {
            echo "Error: " . $sql . $mysqli->error;
        }
        $mysqli->close();
    }
}

function writePageList()
{
    require "connectToDatabase.php";
    $data = isset($_POST['data']) ? $_POST['data'] : null;
    if ($data !== null) {
        $page_name=$data['page_name'];
        $is_source=$data['is_source'];
        $pool_id=$data['pool_id'];

        $sql = "INSERT INTO page_list (page_name, is_source, pool_id) VALUES ('$page_name', '$is_source', '$pool_id')";

        if ($mysqli->query($sql) === true) {
            echo "entry added";
        } else {
            echo "Error: " . $sql . $mysqli->error;
        }
        $mysqli->close();
    }
}

function readPagePool()
{
    require "connectToDatabase.php";
    $data = isset($_POST['data']) ? $_POST['data'] : null;
    if ($data !== null) {
        $sql = "SELECT plan_id, page_name, is_source FROM page_pool INNER JOIN page_list ON page_pool.pool_id = page_list.pool_id WHERE page_pool.pool_id='$data'";
        $sql_plan = "SELECT plan_id FROM page_pool WHERE pool_id='$data'";
        $result = $mysqli->query($sql);
        $result_plan = $mysqli->query($sql_plan);
        $sql_delete = "DELETE FROM page_list WHERE pool_id='$data'";
        $mysqli->query($sql_delete);
        $rows = array();
        $rows_plan = array();
        if ($result->num_rows !== null and $result_plan->num_rows !== null) {
            while ($r = mysqli_fetch_assoc($result)) {
                $rows[] = $r;
            }
            while ($g = mysqli_fetch_assoc($result_plan)) {
                $rows_plan[] = $g;
            }
            echo implode(";", array(json_encode($rows), json_encode($rows_plan)));
        //$mysqli->query($sqlDelete);
        } else {
            echo "0";
        }
        $mysqli->close();
    }
}


function readPageSource()
{
    require "connectToDatabase.php";
    $sql = "SELECT page_name, pool_id FROM page_list WHERE is_source = 1";
    $result = $mysqli->query($sql);
    $rows = array();
    if ($result->num_rows !== null) {
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
    } else {
        echo "0";
    }
    $mysqli->close();
}
