<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
    $sql = "INSERT INTO event_lock
            (sub_event_name)
            VALUES
            (
                '{$data['subevent']}'
                
            )";
    $result = $conn->query($sql);
    echo json_encode($content);
?>