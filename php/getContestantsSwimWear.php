<?php
     include 'connection.php';
     if($conn->connect_error){
         die($conn->connect_error);
     }
     $data = json_decode(file_get_contents('php://input'), true);
     session_start();
     $query = "SELECT 
                contestants.contestant_id,
                contestants.fullname,
                    (SELECT ROUND(AVG(mv_scores.score), 2) FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id 
                    AND mv_scores.sub_event_name = 'swimwear') AS 'avgSwimWearScore',
                    (SELECT (ROUND(AVG(mv_scores.score), 2) * 10) FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id 
                    AND mv_scores.sub_event_name = 'swimwear') AS 'totalSwimWearScore',
                    (SELECT mv_scores.score FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id 
                    AND mv_scores.sub_event_name = 'swimwear'
                    AND mv_scores.judge_id = ".$_SESSION['judgeID'].") AS 'swimWearScore'
                FROM contestants
                JOIN sub_event ON sub_event.subevent_id = contestants.subevent_id
                JOIN main_event ON main_event.mainevent_id = sub_event.mainevent_id
                WHERE main_event.event_name = 'MISS VISAYAS';";
    $result = $conn->query($query);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                'contestantID' => $row['contestant_id'],
                'contestantName' => $row['fullname'],
                'avgSwimWearScore' => $row['avgSwimWearScore'],
                'totalSwimWearScore' => $row['totalSwimWearScore'],
                'swimWearScore' => $row['swimWearScore']
            ));
        }
        echo json_encode($d);
    }else{
        $d['contestantID'] = 0;
        echo json_encode($d);
    }
?>