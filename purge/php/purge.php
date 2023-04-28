<?php
    include '../../php/connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
    $sql = "DELETE FROM mv_scores WHERE sub_event_name = '{$data['subevent']}'";
    $result = $conn->query($sql);
    echo json_encode($content);
?>