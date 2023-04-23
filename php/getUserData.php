<?php
    session_start();
    if(!isset($_SESSION['judgeID'])){
        echo json_encode(array("id"=>"none"));
        exit();
    }
    $data = array(
        "judgeID"=>$_SESSION['judgeID'], 
        "fullname"=>$_SESSION['fullname']
    );
    echo json_encode($data);
?>