<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $code = $data['code'];
    $query = "SELECT * FROM judges WHERE judges.code = '".$code."';";
    $result = $conn->query($query);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            session_start();
            $_SESSION['judgeID'] = $row['judge_id'];
            $_SESSION['fullname'] = $row['fullname'];
        }
        echo json_encode(array("status"=>"success"));     
    }else{
        echo json_encode(array("status"=>"failed"));   
    }

?>