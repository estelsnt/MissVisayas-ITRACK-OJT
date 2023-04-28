let rawdata;
let judges;
let contestants;
let subEventSelected;

$(window).on("load", ()=>{
    //default display
    subEventSelected = "talentportion";
    $("#subEventName").text("Talent Portion");
    $(".talentPortion").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    checkLock();
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
    $("#subEventName").text("Production Number");
    $(".talentPortion").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    $(".tabulator").empty();
    $(".tp5resultscontainer").empty();
    loadData("talentportion");
    subEventSelected = "talentportion";
    checkLock();
});

$(".swimWear").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Swim Wear");
    $(".swimWear").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    $(".tabulator").empty();
    $(".tp5resultscontainer").empty();
    loadData("swimwear");
    subEventSelected = "swimwear";
    checkLock();
});

$(".gown").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Gown");
    $(".gown").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    $(".tabulator").empty();
    $(".tp5resultscontainer").empty();
    loadData("gown");
    subEventSelected = "gown";
    checkLock();
});

$(".qna").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("QnA");
    $(".qna").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    $(".tabulator").empty();
    $(".tp5resultscontainer").empty();
    loadData("qna");
    subEventSelected = "qna";
    checkLock();
});

$(".top5").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Top 5");
    $(".top5").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    $(".tabulator").empty();
    $(".tp5resultscontainer").empty();
    loadTop5();
    loadData("top5");
    subEventSelected = "top5";
    checkLock();
});

$(".final3").click(()=>{
    clearSubEventSelection();
    $("#subEventName").text("Final 3");
    $(".final3").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    $(".tabulator").empty();
    //loadTop3();
    $(".tp5resultscontainer").empty();
    loadTop3();
    loadData("top3");
    subEventSelected = "final3";
    checkLock();
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

//retrieve tabulation data for sub events
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
    console.log(judges)
    if(judges[0]== undefined){
        return;
    }
    //header row starts here with 1 empty cell
    let s = "";
    if(subEventSelected == "top5"){
        s += `
            <span class="rowhn">Voting for top 5</span>
        `;
    }else if(subEventSelected == "final3"){
        s += `
            <span class="rowhn">Voting for final 3</span>
        `;
    }
    s += `
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
            <div class="cell">Average Scores</div>
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

let loadTop5 = function(){
    fetch("./php/getTop5Results.php",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        if(data[0].totalScore == "0.00"){
            return;
        }
        let s = `   
            <span class="tp5resultshn">Top 5 contestants from last 3 events<span>
            <div class="tp5results">
                <div class="tp5row tp5h">
                    <div class="tp5cname tp5col">
                        <span>Contestant</span>
                    </div>
                    <div class="tp5sw tp5col">
                        <span>Swim Wear</span>
                    </div>
                    <div class="tp5g tp5col">
                        <span>Gown</span>
                    </div>
                    <div class="tp5qma tp5col">
                        <span>QnA</span>
                    </div>
                    <div class="tp5score tp5col">
                        <span>Average</span>
                    </div>
                </div>
        `;
        for(let i in data){
            let avg = 0, total = 0, sw = "", g = "", qna = "";
            if(data[i].totalSwimWearScore != null){
                avg += 1;
                sw = data[i].totalSwimWearScore + "%";
            }
            if(data[i].totalGownScore != null){
                avg += 1;
                g = data[i].totalGownScore + "%";
            }
            if(data[i].totalQnAScore != null){
                avg += 1;
                qna = data[i].totalQnAScore + "%";
            }
            total = (data[i].totalScore / avg);
            console.log(total);
            if(total != "NaN"){
                total = (parseFloat(total).toFixed(2)) + "%";
            }else{
                total = "";
            }
            s += `
                <div class="tp5row">
                    <div class="tp5cname tp5col">
                        <span>`+data[i].contestantName+`</span>
                    </div>
                    <div class="tp5sw tp5col">
                        <span>`+sw+`</span>
                    </div>
                    <div class="tp5g tp5col">
                        <span>`+g+`</span>
                    </div>
                    <div class="tp5qna tp5col">
                        <span>`+qna+`</span>
                    </div>
                    <div class="tp5score tp5col">
                        <span>`+total+`</span>
                    </div>
                </div>
            `;
        }
        s += `
            </div>
        `;
        $(".tp5resultscontainer").append(s);
    })
    .catch(error=>{console.log(error)});
}

let loadTop3 = function(){
    fetch("./php/getTop3Results.php",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        if(data[0].totalScore == "0.00"){
            return;
        }
        let s = `   
            <span class="tp5resultshn">Top 3 contestants from top 5 votes<span>
            <div class="tp5results">
                <div class="tp5row tp5h">
                    <div class="tp5cname tp5col">
                        <span>Contestant</span>
                    </div>
                    <div class="tp5score tp5col">
                        <span>Total</span>
                    </div>
                </div>
        `;
        for(let i in data){
            s += `
                <div class="tp5row">
                    <div class="tp3cname tp5col">
                        <span>`+data[i].contestantName+`</span>
                    </div>
                    <div class="tp5score tp5col">
                        <span>`+data[i].totalScore+`%</span>
                    </div>
                </div>
            `;
        }
        s += `
            </div>
        `;
        $(".tp5resultscontainer").append(s);
    })
    .catch(error=>{console.log(error)});
}

//locks scoring
$("#lock").click(()=>{
    console.log("aaa");
    if($("#lock").text() == "Lock"){
        //lock
        fetch("./php/lock.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subevent: subEventSelected
            })
        })
        .then(()=>{
            $("#lock").text("Unlock");
            //location.reload();
            return;
        })
        .catch(error=>{console.log(error)});
    }else if($("#lock").text() == "Unlock"){
        //unlock
        fetch("./php/unlock.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subevent: subEventSelected
            })
        })
        .then(()=>{
            $("#lock").text("Lock");
            //location.reload();
            return;
        })
        .catch(error=>{console.log(error)});
    }
});

let checkLock = function(){
    $("#lock").text("Lock");
    fetch("./php/checkLock.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subevent: subEventSelected
        })                
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        if(data[0].eventLockID != 0){
            $("#lock").text("Unlock");
        }
        else{
            $("#lock").text("Lock");
        }
    })
    .catch(error=>{console.error(error)});
}