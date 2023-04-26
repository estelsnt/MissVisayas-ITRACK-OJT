<?php
     include 'connection.php';
     if($conn->connect_error){
         die($conn->connect_error);
     }
     $data = json_decode(file_get_contents('php://input'), true);
     session_start();
     $query = "
            SELECT contestants.contestant_id, contestants.fullname AS 'contestantName',
            mv_scores.judge_id, judges.fullname AS 'judgeName', mv_scores.score, mv_scores.sub_event_name,
            ROUND((SELECT AVG(mv_scores.score) FROM mv_scores 
            WHERE mv_scores.contestant_id = contestants.contestant_id 
            AND mv_scores.sub_event_name = '{$data['subevent']}'), 2) AS 'average',
            (ROUND((SELECT AVG(mv_scores.score) FROM mv_scores 
            WHERE mv_scores.contestant_id = contestants.contestant_id 
            AND mv_scores.sub_event_name = '{$data['subevent']}'), 2)) * 10 AS 'equivalent'
            FROM contestants
            JOIN mv_scores ON mv_scores.contestant_id = contestants.contestant_id
            JOIN judges ON judges.judge_id = mv_scores.judge_id
            WHERE mv_scores.sub_event_name = '{$data['subevent']}'
            ORDER BY average DESC;
     ";
    $result = $conn->query($query);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                'contestantID' => $row['contestant_id'],
                'contestantName' => $row['contestantName'],
                'judgeID' => $row['judge_id'],
                'judgeName' => $row['judgeName'],
                'score' => $row['score'],
                'average' => $row['average'],
                'equivalent' => $row['equivalent']
            ));
        }
        echo json_encode($d);
    }else{
        $d['contestantID'] = 0;
        echo json_encode($d);
    }
?>