<?php
  require 'connectDatabase';
  $res=$mysqli->query($query);

  $conn = new mysqli('localhost', 'id2545999_admin', 'admin', 'id2545999_db_wlt');
  if ($conn->connect_error) {
      die('Could not connect: ' . $conn->connect_error);
  }

  $post_id=$_POST['post_id'];
  $post_created_time=$_POST['post_created_time'];
  $post_caption=$_POST['post_caption'];
  $post_permalink=$_POST['post_permalink'];
  $post_status_type=$_POST['post_status_type'];
  $post_link_clicks=$_POST['post_link_clicks'];
  $post_other_clicks=$_POST['post_other_clicks'];
  $post_impressions_unique=$_POST['post_impressions_unique'];
  $post_like_total=$_POST['post_like_total'];
  $post_comment=$_POST['post_comment'];
  $post_share=$_POST['post_share'];
  $post_reaction_like=$_POST['post_reaction_like'];
  $post_reaction_love=$_POST['post_reaction_love'];
  $post_reaction_wow=$_POST['post_reaction_wow'];
  $post_reaction_haha=$_POST['post_reaction_haha'];
  $post_reaction_sorry=$_POST['post_reaction_sorry'];
  $post_reaction_anger=$_POST['post_reaction_anger'];
  $post_hide_all_clicks=$_POST['post_hide_all_clicks'];
  $post_hide_clicks=$_POST['post_hide_clicks'];
  $post_video_views_organic=$_POST['post_video_views_organic'];

  if (!$post_caption) {
      $post_earnings=0;
      foreach ($conn->query("SELECT FROM_UNIXTIME('$post_created_time') AS 'unix_date'") as $row) {
          $post_created_time = $row['unix_date'];
      }
  } else {
      foreach ($conn->query("SELECT value FROM tb_insights_earnings WHERE ID = '$post_caption'") as $row) {
          $tkp = $row['value'];
          $post_earnings=($post_link_clicks*$tkp+$post_video_views_organic*$tkp)/1000;
      }
  }

  $sql = "INSERT INTO tb_insights_post_list (post_id, post_caption, post_permalink, post_status_type, post_created_time, post_link_clicks, post_other_clicks,post_impressions_unique, post_like_total, post_comment, post_share, post_reaction_like, post_reaction_love, post_reaction_wow, post_reaction_haha, post_reaction_sorry, post_reaction_anger, post_hide_all_clicks, post_hide_clicks, post_video_views_organic, post_earnings) SELECT '$post_id', '$post_caption', '$post_permalink', '$post_status_type', '$post_created_time', '$post_link_clicks', '$post_other_clicks', '$post_impressions_unique', '$post_like_total', '$post_comment','$post_share','$post_reaction_like', '$post_reaction_love', '$post_reaction_wow', '$post_reaction_haha', '$post_reaction_sorry', '$post_reaction_anger', '$post_hide_all_clicks','$post_hide_clicks', '$post_video_views_organic', '$post_earnings' ON DUPLICATE KEY UPDATE post_caption='$post_caption', post_permalink='$post_permalink', post_status_type='$post_status_type', post_link_clicks='$post_link_clicks', post_other_clicks='$post_other_clicks', post_impressions_unique='$post_impressions_unique', post_like_total='$post_like_total', post_comment='$post_comment', post_share='$post_share', post_reaction_like='$post_reaction_like', post_reaction_love='$post_reaction_love', post_reaction_wow='$post_reaction_wow', post_reaction_haha='$post_reaction_haha', post_reaction_sorry='$post_reaction_sorry', post_reaction_anger='$post_reaction_anger', post_hide_all_clicks='$post_hide_all_clicks', post_hide_clicks='$post_hide_clicks', post_video_views_organic='$post_video_views_organic', post_earnings='$post_earnings'";

  if ($conn->query($sql) === true) {
      echo $table_page_id . " record added";
  } else {
      echo "Error: " . $sql . $conn->error;
  }

//
// $sql_get_tkp = "SELECT value FROM tb_insights_earnings WHERE ID = '$post_caption'";
// $result = $conn->query($sql_get_tkp);
//
// while($tkp = $result->fetch_assoc()){
// $tmp = $tkp["value"];
//     $sql = "INSERT INTO tb_insights_post_list (post_id, post_caption, post_permalink, post_status_type, post_created_time, post_link_clicks, post_other_clicks,post_impressions_unique, post_like_total, post_comment, post_share, post_reaction_like, post_reaction_love, post_reaction_wow, post_reaction_haha, post_reaction_sorry, post_reaction_anger, post_hide_all_clicks, post_hide_clicks, post_video_views_organic, post_earnings) SELECT '$post_id', '$post_caption', '$post_permalink', '$post_status_type', '$post_created_time', '$post_link_clicks', '$post_other_clicks', '$post_impressions_unique', '$post_like_total', '$post_comment','$post_share','$post_reaction_like', '$post_reaction_love', '$post_reaction_wow', '$post_reaction_haha', '$post_reaction_sorry', '$post_reaction_anger', '$post_hide_all_clicks','$post_hide_clicks', '$post_video_views_organic', ('$post_link_clicks'*'$tmp'+'$post_video_views_organic'*'$tmp')/1000 ON DUPLICATE KEY UPDATE post_caption='$post_caption', post_permalink='$post_permalink', post_status_type='$post_status_type', post_link_clicks='$post_link_clicks', post_other_clicks='$post_other_clicks', post_impressions_unique='$post_impressions_unique', post_like_total='$post_like_total', post_comment='$post_comment', post_share='$post_share', post_reaction_like='$post_reaction_like', post_reaction_love='$post_reaction_love', post_reaction_wow='$post_reaction_wow', post_reaction_haha='$post_reaction_haha', post_reaction_sorry='$post_reaction_sorry', post_reaction_anger='$post_reaction_anger', post_hide_all_clicks='$post_hide_all_clicks', post_hide_clicks='$post_hide_clicks', post_video_views_organic='$post_video_views_organic', post_earnings=('$post_link_clicks'*'$tmp'+'$post_video_views_organic'*'$tmp')/1000";
//
//   if($conn->query($sql) === TRUE){
//     echo $table_page_id . " record added";
//   } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
//   }
// }
  $conn->close();
