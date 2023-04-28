<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
     $query = "
        SELECT * FROM event_lock WHERE sub_event_name = '{$data['subevent']}'   
     ";
    $result = $conn->query($query);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                'eventLockID' => $row['event_lock_id']
            ));
        }
        echo json_encode($d);
    }else{
        array_push($d, array(
            'eventLockID' => 0
        ));
        echo json_encode($d);
    }
?>