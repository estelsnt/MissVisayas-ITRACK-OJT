let rawdata;
let judges;
let contestants;

$(window).on("load", ()=>{
    //default display
    subEventSelected = "talentportion"
    $("#subEventName").text("Talent Portion");
    $(".talentPortion").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    //get user's name
    fetch("./php/getUserData.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        if(data[0].organizerID == "none"){
            location.href = "index.html";
        }
        $("#userName").text(data[0].fullname);
        //default view
        loadData("talentportion");
    })
    .catch(error=>{console.error(error)});
});

//logout click
$("#logout").click(()=>{
    console.log("logout");
    fetch("./php/logout.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(()=>{
        location.href = "index.html";
    })
    .catch(error=>{console.error(error)});
});

//on selecting sub events
$(".talentPortion").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Talent Portion");
    $(".talentPortion").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadData("talentportion");
});

$(".swimWear").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Swim Wear");
    $(".swimWear").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadData("swimwear");
});

$(".gown").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Gown");
    $(".gown").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadData("gown");
});

$(".qna").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("QnA");
    $(".qna").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadData("qna");
});

$(".top5").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Top 5");
    $(".top5").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadTop5();
});

$(".final3").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Final 3");
    $(".final3").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadTop3();
});

let clearSubEventSelection = function(){
    $(".talentPortion").css({backgroundColor: "rgb(255, 255, 255, 0.353)", color: "#000"});
    $(".swimWear").css({backgroundColor: "rgba(255, 255, 255, 0.353)", color: "#000"});
    $(".gown").css({backgroundColor: "rgba(255, 255, 255, 0.353)", color: "#000"});
    $(".qna").css({backgroundColor: "rgba(255, 255, 255, 0.353)", color: "#000"});
    $(".top5").css({backgroundColor: "rgba(255, 255, 255, 0.353)", color: "#000"});
    $(".final3").css({backgroundColor: "rgba(255, 255, 255, 0.353)", color: "#000"});
    $(".tally").css({backgroundColor: "rgb(255, 255, 255, 0.353)", color: "#000"});
}

//retrieve tabulation data for sub events except top 5 and final 3
let loadData = function(event){
    fetch("./php/getTabulation.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subevent: event
        })
    })
    .then(res=>{return res.json()})
    .then(data=>{                           //arrange data to tabulation table
        rawdata = data;     //creates a copy of data
        judges = [];        //stores judges names
        contestants = [];   //stores contestants name
        for(let i in data){         //populate judges and contestants data to array distinctly
            if(!contestants.includes(data[i].contestantID)){
                contestants.push(data[i].contestantID);
            }
            if(!judges.includes(data[i].judgeID)){
                judges.push(data[i].judgeID);
            }
        }
        let tally = [];     //hold scores tally
        for(let c = 0; c < contestants.length; c++){
            let t = {};             //temp data to hold each row
            t['contestantName'] = getContestantName(contestants[c]);        //contestant name
            for(let j = 0; j < judges.length; j++){         //gets scores from judges
                t[getJudgeName(judges[j])] = selectFromScores(contestants[c], judges[j]);
            }
            t['average'] = getAverage(contestants[c]);          //average of all scores
            t['equivalent'] = getEquivalent(contestants[c]);        //equivalent to 100%
            tally.push(t);      //push object t to tally
        }
        renderToView(tally);    //render to screen
    })
    .catch(error=>{console.error(error)});
}

let selectFromScores = function(cid, jid){
    let r;
    for(let i in rawdata){
        if(rawdata[i].contestantID == cid && rawdata[i].judgeID == jid){
            r = rawdata[i].score;
        }
    }
    return r;
}

let getContestantName = function(cid){
    let n;
    for(let i in rawdata){
        if(rawdata[i].contestantID == cid){
            n = rawdata[i].contestantName;
        }
    }
    return n;
}

let getJudgeName = function(jid){
    let n;
    for(let i in rawdata){
        if(rawdata[i].judgeID == jid){
            n = rawdata[i].judgeName;
        }
    }
    return n;
}

let getAverage = function(cid){
    let r;
    for(let i in rawdata){
        if(rawdata[i].contestantID == cid){
            r = rawdata[i].average;
        }
    }
    return r;
}

let getEquivalent = function(cid){
    let r;
    for(let i in rawdata){
        if(rawdata[i].contestantID == cid){
            r = rawdata[i].equivalent;
        }
    }
    return r;
}

let renderToView = function(tally){     //gets objects from tally and arrange to table
    $(".tabulator").empty();
    //header row starts here with 1 empty cell
    let s = `
        <div class="rowContainer">
            <div class="row">
                <div class="cell cname"></div>
    `;
    //appends cells for judges name taken from judge array
    for(let i in judges){
        s += `
            <div class="cell">`+getJudgeName(judges[i])+`</div>
        `;
    }
    //appends this header row
    s += `
            <div class="cell">Average Score</div>
            <div class="cell">Equivalent</div>
            <div class="cell crank">Rank</div>
            </div>
    `;
    console.log(tally);
    // console.log(Object.values(tally)[1]);          //the object
    // console.log(Object.values(Object.values(tally)[1]).length);     //the length of that object
    // console.log(Object.values(Object.values(tally)[1])[1]);     //the value
    //loops through each data in tally
    for(let i in tally){
        let rank;   //holds rank data
        //first column, each cell contains contestant name
        s += `<div class="row">
            <div class="cell cname">`+tally[i].contestantName+`</div>
        `;
        //appends scores from to this row from tally (empty cell if undefined), scores are aligned with judges names
        for(let o = 0; o < Object.values(Object.values(tally)[i]).length-3; o++){
            if(Object.values(Object.values(tally)[i])[+o + +1] == undefined){
                s += `
                    <div class="cell"></div>
                `;    
            }else{
                s += `
                    <div class="cell">`+Object.values(Object.values(tally)[i])[+o + +1]+`</div>
                `;
            }
        }
        //appends average and equivalent cells
        s += `
            <div class="cell">`+tally[i].average+`</div>
            <div class="cell">`+tally[i].equivalent+`%</div> 
        `;
        switch(+i + +1){        //fix rank prefix
            case 1:
                rank = (+i +1) + "st";
            break;
            case 2:
                rank = (+i +1) + "nd";
            break;
            case 3:
                rank = (+i +1) + "rd";
            break;
            default:
                rank = (+i +1) + "th";
        }
        //appends rank column
        s += `
            <div class="cell crank">`+ rank +`</div>
            </div>
        `;
    }
    s += `
        </div>
    `;
    $(".tabulator").append(s);
}

//load top 5
let loadTop5 = function(){
    $(".tabulator").empty();

    fetch("./php/getTop5.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        let rank = [];
        for(let i in data)
        {
            let tps = 0, sws = 0, gs = 0, qnas = 0, avgc = 0, top5 = 0, total = 0;
            if(data[i].totalTalentPortionScore != null){
                tps = data[i].totalTalentPortionScore;
            }
            if(data[i].totalSwimWearScore != null){
                sws = data[i].totalSwimWearScore;
                avgc += 1;
            }
            if(data[i].totalGownScore != null){
                gs = data[i].totalGownScore;
                avgc += 1;
            }
            if(data[i].totalQnAScore != null){
                qnas = data[i].totalQnAScore;
                avgc += 1;
            }
            if(data[i].totalTop5Score != null){
                top5 = data[i].totalTop5Score;
                avgc += 1;
            }
            if(sws == 0 || gs == 0 || qnas == 0 || top5 == 0){
                total = "incomplete scores";
            }else{
                total = ((((+sws + +gs + +qnas + +top5)/+avgc)).toFixed(2)) + "%";
            }
            rank.push({id: "contestant"+data[i].contestantID, score: total});
            let elem = `
                <div class="contestant selection" id="contestant`+data[i].contestantID+`" style="display: none" 
                onclick="selectTop(`+data[i].contestantID+`, 'top5', `+i+`)">
                    <div><span class="standing contestant`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>

                    <span class="score tps">Talent Portion: `+tps+`%</span>

                    <span class="score sws">Swim Wear: `+sws+`%</span>
                    <span class="score gs">Gown: `+gs+`%</span>
                    <span class="score qnas">QnA: `+qnas+`%</span>
                    <span class="score top5">Top 5 Votes: `+top5+`%</span>
                    <span class="score total">Total: `+total+`</span>
                </div>
            `;
            $(".tabulator").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
        }
        for(let i in rank){         //check for ties
            if((+i + +1) >= rank.length){       //comparison guard clause
                return;
            }
            if(rank[i].score == "incomplete scores"){
                $("." + rank[i].id).text("incomplete scores");
                continue;
            }
            if(rank[i].score == rank[+i + +1].score){
                $("." + rank[i].id).text("change scores to break ties");
                $("." + rank[+i + +1].id).text("change scores to break ties");
            }
            for(let i in rank){ //ranking
                //set rank number
                if(!($("."+rank[i].id).text() == "change scores to break ties" || $("."+rank[i].id).text() == "incomplete scores")){
                    switch(+i + +1){
                        case 1:
                            $("."+rank[i].id).text((+i + +1) + "st");
                        break;
                        case 2:
                            $("."+rank[i].id).text((+i + +1) + "nd");
                        break;
                        case 3:
                            $("."+rank[i].id).text((+i + +1) + "rd");
                        break;
                        default:
                            $("."+rank[i].id).text((+i + +1) + "th");
                    }
                }
            }
        }

    })
    .catch(error=>{console.error(error)});
}

let loadTop3 = function(){
    $(".tabulator").empty();

    fetch("./php/getTop3.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        let rank = [];
        for(let i in data)
        {
            let tps = 0, sws = 0, gs = 0, qnas = 0, avgc = 0, top5 = 0, top3 = 0, total = 0;
            if(data[i].totalTalentPortionScore != null){
                tps = data[i].totalTalentPortionScore;
            }
            if(data[i].totalSwimWearScore != null){
                sws = data[i].totalSwimWearScore;
                avgc += 1;
            }
            if(data[i].totalGownScore != null){
                gs = data[i].totalGownScore;
                avgc += 1;
            }
            if(data[i].totalQnAScore != null){
                qnas = data[i].totalQnAScore;
                avgc += 1;
            }
            if(data[i].totalTop5Score != null){
                top5 = data[i].totalTop5Score;
                avgc += 1;
            }
            if(data[i].totalTop3Score != null){
                top3 = data[i].totalTop3Score;
                avgc += 1;
            }
            if(sws == 0 || gs == 0 || qnas == 0 || top5 == 0 || top3 == 0){
                total = "incomplete scores";
            }else{
                total = ((((+sws + +gs + +qnas + +top5 + +top3)/+avgc)).toFixed(2)) + "%";
            }
            rank.push({id: "contestant"+data[i].contestantID, score: total});
            let elem = `
                <div class="contestant selection" id="contestant`+data[i].contestantID+`" style="display: none" 
                onclick="selectTop(`+data[i].contestantID+`, 'top5', `+i+`)">
                    <div><span class="standing contestant`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>

                    <span class="score tps">Talent Portion: `+tps+`%</span>

                    <span class="score sws">Swim Wear: `+sws+`%</span>
                    <span class="score gs">Gown: `+gs+`%</span>
                    <span class="score qnas">QnA: `+qnas+`%</span>
                    <span class="score top5">Top 5 Votes: `+top5+`%</span>
                    <span class="score top5">Top 3 Votes: `+top3+`%</span>
                    <span class="score total">Total: `+total+`</span>
                </div>
            `;
            $(".tabulator").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
        }
        for(let i in rank){         //check for ties
            if((+i + +1) >= rank.length){       //comparison guard clause
                return;
            }
            if(rank[i].score == "incomplete scores"){
                $("." + rank[i].id).text("incomplete scores");
                continue;
            }
            if(rank[i].score == rank[+i + +1].score){
                $("." + rank[i].id).text("change scores to break ties");
                $("." + rank[+i + +1].id).text("change scores to break ties");
            }
            for(let i in rank){ //ranking
                //set rank number
                if(!($("."+rank[i].id).text() == "change scores to break ties" || $("."+rank[i].id).text() == "incomplete scores")){
                    switch(+i + +1){
                        case 1:
                            $("."+rank[i].id).text((+i + +1) + "st");
                        break;
                        case 2:
                            $("."+rank[i].id).text((+i + +1) + "nd");
                        break;
                        case 3:
                            $("."+rank[i].id).text((+i + +1) + "rd");
                        break;
                        default:
                            $("."+rank[i].id).text((+i + +1) + "th");
                    }
                }
            }
        }

    })
    .catch(error=>{console.error(error)});
}