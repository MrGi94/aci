<?php
function writePostingPlan() {
  require 'connSettingsDB';
    $res=$mysqli->query($query);

    $plan_id=$_POST['post_created_time'];
    $time=$_POST['post_caption'];
    $category=$_POST['post_permalink'];

    $sql = "INSERT INTO tb_insights_post_list (post_id, post_caption, post_permalink, post_status_type, post_created_time, post_link_clicks, post_other_clicks,post_impressions_unique, post_like_total, post_comment, post_share, post_reaction_like, post_reaction_love, post_reaction_wow, post_reaction_haha, post_reaction_sorry, post_reaction_anger, post_hide_all_clicks, post_hide_clicks, post_video_views_organic, post_earnings) SELECT '$post_id', '$post_caption', '$post_permalink', '$post_status_type', '$post_created_time', '$post_link_clicks', '$post_other_clicks', '$post_impressions_unique', '$post_like_total', '$post_comment','$post_share','$post_reaction_like', '$post_reaction_love', '$post_reaction_wow', '$post_reaction_haha', '$post_reaction_sorry', '$post_reaction_anger', '$post_hide_all_clicks','$post_hide_clicks', '$post_video_views_organic', '$post_earnings' ON DUPLICATE KEY UPDATE post_caption='$post_caption', post_permalink='$post_permalink', post_status_type='$post_status_type', post_link_clicks='$post_link_clicks', post_other_clicks='$post_other_clicks', post_impressions_unique='$post_impressions_unique', post_like_total='$post_like_total', post_comment='$post_comment', post_share='$post_share', post_reaction_like='$post_reaction_like', post_reaction_love='$post_reaction_love', post_reaction_wow='$post_reaction_wow', post_reaction_haha='$post_reaction_haha', post_reaction_sorry='$post_reaction_sorry', post_reaction_anger='$post_reaction_anger', post_hide_all_clicks='$post_hide_all_clicks', post_hide_clicks='$post_hide_clicks', post_video_views_organic='$post_video_views_organic', post_earnings='$post_earnings'";

    if($conn->query($sql) === TRUE){
      echo $table_page_id . " record added";
    } else {
      echo "Error: " . $sql . $conn->error;
    }

    $conn->close();
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
 ?>
