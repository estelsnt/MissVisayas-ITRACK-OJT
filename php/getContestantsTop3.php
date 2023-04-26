<?php
     include 'connection.php';
     if($conn->connect_error){
         die($conn->connect_error);
     }
     session_start();
     $query = "
                SELECT 
                contestants.contestant_id,
                contestants.fullname,
                (SELECT mv_scores.score FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id
                    AND mv_scores.sub_event_name = 'swimwear' AND mv_scores.judge_id = ".$_SESSION['judgeID']." ) +
                (SELECT mv_scores.score FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id
                    AND mv_scores.sub_event_name = 'gown' AND mv_scores.judge_id = ".$_SESSION['judgeID']." ) +
                (SELECT mv_scores.score FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id
                    AND mv_scores.sub_event_name = 'qna' AND mv_scores.judge_id = ".$_SESSION['judgeID']." ) +
                (SELECT mv_scores.score FROM mv_scores 
                    WHERE mv_scores.contestant_id = contestants.contestant_id
                    AND mv_scores.sub_event_name = 'top5' AND mv_scores.judge_id = ".$_SESSION['judgeID']." )
                AS 'totalScore',
                (SELECT mv_scores.score FROM mv_scores 
                WHERE mv_scores.judge_id = ".$_SESSION['judgeID']." AND mv_scores.contestant_id = contestants.contestant_id AND mv_scores.sub_event_name = 'top3') AS 'top3'
                FROM contestants
                JOIN sub_event ON sub_event.subevent_id = contestants.subevent_id
                JOIN main_event ON main_event.mainevent_id = sub_event.mainevent_id
                WHERE main_event.event_name = 'MISS VISAYAS'
                ORDER BY totalScore DESC
                LIMIT 3;   
            ";
    $result = $conn->query($query);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                'contestantID' => $row['contestant_id'],
                'contestantName' => $row['fullname'],
                'totalScore' => $row['totalScore'],
                'top3' => $row['top3']
            ));
        }
        echo json_encode($d);
    }else{
        $d['contestantID'] = 0;
        echo json_encode($d);
    }
?>