<?php
    session_start();
    $id;
    if(!(isset($_SESSION['judgeID']) || isset($_SESSION['organizerID']))){
        echo json_encode(array("id"=>"none"));
        exit();
    }
    $data = [];
    if(isset($_SESSION['judgeID'])){
        array_push($data, array(
            "judgeID"=>$_SESSION['judgeID'],
            "fullname"=>$_SESSION['fullname']
        ));
    }
    if(isset($_SESSION['organizerID'])){
        array_push($data, array(
            "organizerID"=>$_SESSION['organizerID'],
            "fullname"=>$_SESSION['fullname']
        ));
    }
    echo json_encode($data);
?>