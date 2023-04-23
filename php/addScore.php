<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
    session_start();
    $sql = "INSERT INTO mv_scores 
            (contestant_id, judge_id, sub_event_name, score, timestamp)
            VALUES
            (
                {$data['cid']},
                ".$_SESSION['judgeID'].",
                '{$data['subeventname']}',
                {$data['score']},
                NOW()
            )";
    $result = $conn->query($sql);
    echo json_encode($content);
?>