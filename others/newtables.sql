CREATE TABLE mv_scores(
	mv_scores_id INT NOT NULL AUTO_INCREMENT,
    contestant_id INT NOT NULL,
    judge_id INT NOT NULL,
    sub_event_name VARCHAR(254),
    score DOUBLE,
    timestamp DATETIME,
    PRIMARY KEY(mv_scores_id),
    FOREIGN KEY(contestant_id) REFERENCES contestants(contestant_id),
    FOREIGN KEY(judge_id) REFERENCES judges(judge_id)
);

CREATE TABLE event_lock(
    event_lock_id INT NOT NULL AUTO_INCREMENT,
    sub_event_name VARCHAR(254),
    PRIMARY KEY (event_lock_id)
);