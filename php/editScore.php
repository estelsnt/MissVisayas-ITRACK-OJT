<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
    session_start();
    $sql = "UPDATE mv_scores 
            SET score = {$data['score']}, timestamp = NOW()
            WHERE
            contestant_id = {$data['cid']} AND judge_id = ".$_SESSION['judgeID']." AND sub_event_name = '{$data['subeventname']}'";
    $result = $conn->query($sql);
    echo json_encode($content);
?>