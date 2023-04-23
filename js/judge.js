let subEventSelected;

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
        if(data.id == "none"){
            location.href = "index.html";
        }
        $("#userName").text(data.fullname);
        //default tab to display
        loadTalentPortion();
    })
    .catch(error=>{console.error(error)});
});

//logout click
$("#logout").click(()=>{
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
    subEventSelected = "talentportion";
    clearSubEventSelection();
    $("#subEventName").text("Talent Portion");
    $(".talentPortion").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadTalentPortion();
});

$(".swimWear").click(()=>{
    subEventSelected = "swimwear";
    clearSubEventSelection();
    $("#subEventName").text("Swim Wear");
    $(".swimWear").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadSwimWear();
});

$(".gown").click(()=>{
    subEventSelected = "gown";
    clearSubEventSelection();
    $("#subEventName").text("Gown");
    $(".gown").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadGown();
});

$(".qna").click(()=>{
    subEventSelected = "qna";
    clearSubEventSelection();
    $("#subEventName").text("Q&A");
    $(".qna").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadQnA();
});

$(".top5").click(()=>{
    subEventSelected = "top5";
    clearSubEventSelection();
    $("#subEventName").text("Top 5");
    $(".top5").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
    loadTop5();
});

$(".final3").click(()=>{
    subEventSelected = "final3";
    clearSubEventSelection();
    $("#subEventName").text("Final 3");
    $(".final3").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
});

$(".tally").click(()=>{
    subEventSelected = "tally";
    clearSubEventSelection();
    $("#subEventName").text("Tally");
    $(".tally").css({backgroundColor: "rgb(72, 52, 201)", color: "#fff"});
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

//on loading contestants
let loadTalentPortion = function(){                 //talent portion
    $(".contestantsContainer").empty();
    //add loading screen

    //fetch data from database
    fetch("./php/getContestantsTalentPortion.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        } 
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        //array to hold ranks data to check for ties and null scores
        let ranks = [];
        for(let i in data){
            ranks.push({id: "standing"+data[i].contestantID, score: data[i].totalTalentPortionScore, given: data[i].talentPortionScore});
            let ttps = null;
            if(data[i].totalTalentPortionScore == null){
                ttps = 0;
            }else{
                ttps = data[i].totalTalentPortionScore;
            }
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
                    <span class="totalScoreEarned">Total Score Earned: `+ttps+`% out of 100%</span>
                    <div class="scorePanel">
                        <label for="score">Score</label>
                        <select name="score" class="scoreSelect" id="tps`+data[i].contestantID+`" 
                        onchange="selectScore(`+data[i].contestantID+`, 'talentportion', `+data[i].talentPortionScore+`)">
                            <option value="0">select</option>
                            <option value="5">5</option>
                            <option value="5.5">5.5</option>
                            <option value="6">6</option>
                            <option value="6.5">6.5</option>
                            <option value="7">7</option>
                            <option value="7.5">7.5</option>
                            <option value="8">8</option>
                            <option value="8.5">8.5</option>
                            <option value="9">9</option>
                            <option value="9.5">9.5</option>
                            <option value="10">10</option>
                        </select>
                        <img src="resources/edit.png" alt="/" class="edit" id="edit`+data[i].contestantID+`" 
                        onclick="editScore(`+data[i].contestantID+`)">
                    </div>
                </div>
            `;
            //append to DOM
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            //set total score earned
            if(data[i].talentPortionScore == null){
                $("#tps" + data[i].contestantID).val("0");
            }else{
                $("#tps" + data[i].contestantID).val(data[i].talentPortionScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
        //determine ranking
        for(let i in ranks){                //ties
            if((+i + +1) >= ranks.length){
                break;
            }
            if(ranks[i].score == ranks[+i + +1].score){
                console.log("tie detected: " + ranks[i].id + " and " + ranks[+i + +1].id);
                $("."+ranks[i].id).text("change scores to break ties");
                $("."+ranks[+i + +1].id).text("change scores to break ties");
            }
        }
        for(let i in ranks){ //ranking
            if(ranks[i].given == undefined){    //no scores
                $("."+ranks[i].id).text("rate this candidate"); 
            }
            //set rank number
            if(!($("."+ranks[i].id).text() == "change scores to break ties" || $("."+ranks[i].id).text() == "rate this candidate")){
                switch(+i + +1){
                    case 1:
                        $("."+ranks[i].id).text((+i + +1) + "st");
                    break;
                    case 2:
                        $("."+ranks[i].id).text((+i + +1) + "nd");
                    break;
                    case 3:
                        $("."+ranks[i].id).text((+i + +1) + "rd");
                    break;
                    default:
                        $("."+ranks[i].id).text((+i + +1) + "th");
                }
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let loadSwimWear = function(){                  //swim wear
    $(".contestantsContainer").empty();
    //add loading screen

    //fetch data from database
    fetch("./php/getContestantsSwimWear.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        let ranks = [];
        for(let i in data){
            //set ranking and total score earned on cards
            ranks.push({id: "standing"+data[i].contestantID, score: data[i].totalSwimWearScore, given: data[i].swimWearScore});
            let ttps = null;
            if(data[i].totalSwimWearScore == null){
                ttps = 0;
            }else{
                ttps = data[i].totalSwimWearScore;
            }
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
                    <span class="totalScoreEarned">Total Score Earned: `+ttps+`% out of 100%</span>
                    <div class="scorePanel">
                        <label for="score">Score</label>
                        <select name="score" class="scoreSelect" id="tps`+data[i].contestantID+`" 
                        onchange="selectScore(`+data[i].contestantID+`, 'swimwear', `+data[i].swimWearScore+`)">
                            <option value="0">select</option>
                            <option value="5">5</option>
                            <option value="5.5">5.5</option>
                            <option value="6">6</option>
                            <option value="6.5">6.5</option>
                            <option value="7">7</option>
                            <option value="7.5">7.5</option>
                            <option value="8">8</option>
                            <option value="8.5">8.5</option>
                            <option value="9">9</option>
                            <option value="9.5">9.5</option>
                            <option value="10">10</option>
                        </select>
                        <img src="resources/edit.png" alt="/" class="edit" id="edit`+data[i].contestantID+`" 
                        onclick="editScore(`+data[i].contestantID+`)">
                    </div>
                </div>
            `;
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            if(data[i].swimWearScore == null){
                $("#tps" + data[i].contestantID).val("0");
            }else{
                $("#tps" + data[i].contestantID).val(data[i].swimWearScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
        //determine ranking
        for(let i in ranks){                //ties
            if((+i + +1) >= ranks.length){
                break;
            }
            if(ranks[i].score == ranks[+i + +1].score){
                console.log("tie detected: " + ranks[i].id + " and " + ranks[+i + +1].id);
                $("."+ranks[i].id).text("change scores to break ties");
                $("."+ranks[+i + +1].id).text("change scores to break ties");
            }
            
        }
        for(let i in ranks){ //ranking
            if(ranks[i].given == undefined){        //no scores
                $("."+ranks[i].id).text("rate this candidate"); 
            }
            //set rank number
            if(!($("."+ranks[i].id).text() == "change scores to break ties" || $("."+ranks[i].id).text() == "rate this candidate")){
                switch(+i + +1){
                    case 1:
                        $("."+ranks[i].id).text((+i + +1) + "st");
                    break;
                    case 2:
                        $("."+ranks[i].id).text((+i + +1) + "nd");
                    break;
                    case 3:
                        $("."+ranks[i].id).text((+i + +1) + "rd");
                    break;
                    default:
                        $("."+ranks[i].id).text((+i + +1) + "th");
                }
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let loadGown = function(){          //gown
    $(".contestantsContainer").empty();
    //add loading screen

    //fetch data from database
    fetch("./php/getContestantsGown.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        //array to hold ranks data to check for ties and null scores
        let ranks = [];
        for(let i in data){
            //set ranking and total score earned on cards
            ranks.push({id: "standing"+data[i].contestantID, score: data[i].totalGownScore, given: data[i].gownScore});
            let ttps = null;
            if(data[i].totalGownScore == null){
                ttps = 0;
            }else{
                ttps = data[i].totalGownScore;
            }
            
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
                    <span class="totalScoreEarned">Total Score Earned: `+ttps+`% out of 100%</span>
                    <div class="scorePanel">
                        <label for="score">Score</label>
                        <select name="score" class="scoreSelect" id="tps`+data[i].contestantID+`" 
                        onchange="selectScore(`+data[i].contestantID+`, 'gown', `+data[i].gownScore+`)">
                            <option value="0">select</option>
                            <option value="5">5</option>
                            <option value="5.5">5.5</option>
                            <option value="6">6</option>
                            <option value="6.5">6.5</option>
                            <option value="7">7</option>
                            <option value="7.5">7.5</option>
                            <option value="8">8</option>
                            <option value="8.5">8.5</option>
                            <option value="9">9</option>
                            <option value="9.5">9.5</option>
                            <option value="10">10</option>
                        </select>
                        <img src="resources/edit.png" alt="/" class="edit" id="edit`+data[i].contestantID+`" 
                        onclick="editScore(`+data[i].contestantID+`)">
                    </div>
                </div>
            `;
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            if(data[i].gownScore == null){
                $("#tps" + data[i].contestantID).val("0");
            }else{
                $("#tps" + data[i].contestantID).val(data[i].gownScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
        //determine ranking
        for(let i in ranks){                //ties
            if((+i + +1) >= ranks.length){
                break;
            }
            if(ranks[i].score == ranks[+i + +1].score){
                console.log("tie detected: " + ranks[i].id + " and " + ranks[+i + +1].id);
                $("."+ranks[i].id).text("change scores to break ties");
                $("."+ranks[+i + +1].id).text("change scores to break ties");
            }
        }
        for(let i in ranks){ //ranking
            if(ranks[i].given == undefined){    //no scores
                $("."+ranks[i].id).text("rate this candidate"); 
            }
            //set rank number
            if(!($("."+ranks[i].id).text() == "change scores to break ties" || $("."+ranks[i].id).text() == "rate this candidate")){
                switch(+i + +1){
                    case 1:
                        $("."+ranks[i].id).text((+i + +1) + "st");
                    break;
                    case 2:
                        $("."+ranks[i].id).text((+i + +1) + "nd");
                    break;
                    case 3:
                        $("."+ranks[i].id).text((+i + +1) + "rd");
                    break;
                    default:
                        $("."+ranks[i].id).text((+i + +1) + "th");
                }
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let loadQnA = function(){                       //QnA
    $(".contestantsContainer").empty();
    //add loading screen

    //fetch data from database
    fetch("./php/getContestantsQnA.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        //array to hold ranks data to check for ties and null scores
        let ranks = [];
        for(let i in data){
            //set ranking and total score earned on cards
            ranks.push({id: "standing"+data[i].contestantID, score: data[i].totalQnAScore, given: data[i].qnAScore});
            let ttps = null;
            if(data[i].totalQnAScore == null){
                ttps = 0;
            }else{
                ttps = data[i].totalQnAScore;
            }
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
                    <span class="totalScoreEarned">Total Score Earned: `+ttps+`% out of 100%</span>
                    <div class="scorePanel">
                        <label for="score">Score</label>
                        <select name="score" class="scoreSelect" id="tps`+data[i].contestantID+`" 
                        onchange="selectScore(`+data[i].contestantID+`, 'qna', `+data[i].qnAScore+`)">
                            <option value="0">select</option>
                            <option value="5">5</option>
                            <option value="5.5">5.5</option>
                            <option value="6">6</option>
                            <option value="6.5">6.5</option>
                            <option value="7">7</option>
                            <option value="7.5">7.5</option>
                            <option value="8">8</option>
                            <option value="8.5">8.5</option>
                            <option value="9">9</option>
                            <option value="9.5">9.5</option>
                            <option value="10">10</option>
                        </select>
                        <img src="resources/edit.png" alt="/" class="edit" id="edit`+data[i].contestantID+`" 
                        onclick="editScore(`+data[i].contestantID+`)">
                    </div>
                </div>
            `;
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            if(data[i].qnAScore == null){
                $("#tps" + data[i].contestantID).val("0");
            }else{
                $("#tps" + data[i].contestantID).val(data[i].qnAScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
        //determine ranking
        for(let i in ranks){                //ties
            if((+i + +1) >= ranks.length){
                break;
            }
            if(ranks[i].score == ranks[+i + +1].score){
                console.log("tie detected: " + ranks[i].id + " and " + ranks[+i + +1].id);
                $("."+ranks[i].id).text("change scores to break ties");
                $("."+ranks[+i + +1].id).text("change scores to break ties");
            }
        }
        for(let i in ranks){ //ranking
            if(ranks[i].given == undefined){    //no scores
                $("."+ranks[i].id).text("rate this candidate"); 
            }
            //set rank number
            if(!($("."+ranks[i].id).text() == "change scores to break ties" || $("."+ranks[i].id).text() == "rate this candidate")){
                switch(+i + +1){
                    case 1:
                        $("."+ranks[i].id).text((+i + +1) + "st");
                    break;
                    case 2:
                        $("."+ranks[i].id).text((+i + +1) + "nd");
                    break;
                    case 3:
                        $("."+ranks[i].id).text((+i + +1) + "rd");
                    break;
                    default:
                        $("."+ranks[i].id).text((+i + +1) + "th");
                }
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let loadTop5 = function(){      //top5 section
    $(".contestantsContainer").empty();
    //add loading screen

    //fetch data from database
    fetch("./php/getContestantsTop5.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);

        //append to DOM
        for(let i in data)
        {
            let tps = 0, sws = 0, gs = 0, qnas = 0, avgc = 0, total = 0;
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
            if(sws == 0 || gs == 0 || qnas == 0){
                total = "incomplete scores";
            }else{
                total = ((((+sws + +gs + +qnas)/+avgc)).toFixed(2)) + '%';
            }
            let elem = `
                <div class="contestant selection" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing">`+i+`<span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>

                    <span class="score tps">Talent Portion: `+tps+`%</span>

                    <span class="score sws">Swim Wear: `+sws+`%</span>
                    <span class="score gs">Gown: `+gs+`%</span>
                    <span class="score qnas">QnA: `+qnas+`%</span>
                    <span class="score total">Total: `+total+`</span>
                </div>
            `;
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
        }
    })
    .catch(error=>{console.error(error)});
}

//on edit icon click
let editScore = function(id){
    if($("#tps"+id).prop('disabled') == true){
        $("#tps"+id).prop('disabled', false);
    }else{
        $("#tps"+id).prop('disabled', true);
    }
    if($("#edit"+id).attr("src") == "./resources/check.png"){
        $("#edit"+id).attr("src", "./resources/edit.png");
    }else{
        $("#edit"+id).attr("src", "./resources/check.png");
    }
}

//on selecting score
let selectScore = function(id, to, ls){
    console.log(id);
    console.log($("#tps"+id).val());
    console.log(to);
    console.log(ls);    
    //insert loading screen here

    //add new
    if(ls == null){
        fetch("./php/addScore.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cid: id,
                subeventname: to,
                score: $("#tps"+id).val()
            })
        })
        .then(()=>{
            reloadCards(to);
        })
        .catch(error=>{console.error(error)});
    }else{      //edit
        fetch("./php/editScore.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cid: id,
                subeventname: to,
                score: $("#tps"+id).val()
            })
        })
        .then(()=>{
            reloadCards(to);
        })
        .catch(error=>{console.error(error)});
    }
}

let reloadCards = function(ev){
    switch(ev){
        case "talentportion":
            loadTalentPortion();
        break;
        case "swimwear":
            loadSwimWear();
        break;
        case "gown":
            loadGown();
        break;
        case "qna":
            loadQnA();
        break;
        case "top5":
            loadTop5();
        break;
    }
}