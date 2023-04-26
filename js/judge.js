let subEventSelected;
let selectedTop5 = 0;
let selectedTop3 = 0;
let selected = [];

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
        if(data[0].judgeID == "none"){
            location.href = "index.html";
        }
        $("#userName").text(data[0].fullname);
        //default tab to display
        loadTalentPortion();
    })
    .catch(error=>{console.error(error)});
});

//logout click
$("#logout").click(()=>{
    fetch("./php/logout.php", {             //clears session
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

//talent portion
let loadTalentPortion = function(){
    $(".contestantsContainer").empty();
    
    fetch("./php/getContestantsTalentPortion.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        } 
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(let i in data){
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
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
            if(data[i].talentPortionScore == undefined){
                $(".standing"+data[i].contestantID).text("rate this contestant")
            }else{
                $("#tps"+data[i].contestantID).val(data[i].talentPortionScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
    })
    .catch(error=>{console.error(error)});
}

//swimwear
let loadSwimWear = function(){
    $(".contestantsContainer").empty();
    
    fetch("./php/getContestantsSwimWear.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        } 
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(let i in data){
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
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
            //append to DOM
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            if(data[i].swimWearScore == null){
                $(".standing"+data[i].contestantID).text("rate this contestant")
            }else{
                $("#tps"+data[i].contestantID).val(data[i].swimWearScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
    })
    .catch(error=>{console.error(error)});
}

//gown
let loadGown = function(){
    $(".contestantsContainer").empty();
    
    fetch("./php/getContestantsGown.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        } 
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(let i in data){
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
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
            //append to DOM
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            if(data[i].gownScore == null){
                $(".standing"+data[i].contestantID).text("rate this contestant")
            }else{
                $("#tps"+data[i].contestantID).val(data[i].gownScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
    })
    .catch(error=>{console.error(error)});
}

//QnA
let loadQnA = function(){
    $(".contestantsContainer").empty();
    
    fetch("./php/getContestantsQnA.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        } 
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(let i in data){
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
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
            //append to DOM
            $(".contestantsContainer").append(elem);
            $("#contestant"+data[i].contestantID).fadeIn();
            if(data[i].qnAScore == null){
                $(".standing"+data[i].contestantID).text("rate this contestant")
            }else{
                $("#tps"+data[i].contestantID).val(data[i].qnAScore);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let loadTop5 = function(){
    $(".contestantsContainer").empty();
    
    fetch("./php/getContestantsTop5.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(let i in data){
            if(data[i].totalScore == null){
                continue;
            }
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
                    <div class="scorePanel">
                        <label for="score">Score</label>
                        <select name="score" class="scoreSelect" id="tps`+data[i].contestantID+`" 
                        onchange="selectScore(`+data[i].contestantID+`, 'top5', `+data[i].top5+`)">
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
            if(data[i].top5 == null){
                $(".standing"+data[i].contestantID).text("rate this contestant")
            }else{
                $("#tps"+data[i].contestantID).val(data[i].top5);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let loadTop3 = function(){
    $(".contestantsContainer").empty();
    
    fetch("./php/getContestantsTop3.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(let i in data){
            if(data[i].totalScore == null){
                continue;
            }
            //load data to DOM
            let elem = `
                <div class="contestant" id="contestant`+data[i].contestantID+`" style="display: none">
                    <div><span class="standing standing`+data[i].contestantID+`"><span></div>
                    <img src="resources/contestant.PNG" alt="contestant" class="contestantPic">
                    <span class="contestantName">`+data[i].contestantName+`</span>
                    <div class="scorePanel">
                        <label for="score">Score</label>
                        <select name="score" class="scoreSelect" id="tps`+data[i].contestantID+`" 
                        onchange="selectScore(`+data[i].contestantID+`, 'top3', `+data[i].top3+`)">
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
            if(data[i].top3 == null){
                $(".standing"+data[i].contestantID).text("rate this contestant")
            }else{
                $("#tps"+data[i].contestantID).val(data[i].top3);
                $("#tps" + data[i].contestantID).attr({disabled: "true"});
            }
        }
    })
    .catch(error=>{console.error(error)});
}

let editScore = function(id){                       //edit icon on cards
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
let selectScore = function(id, to, ls){         //adding and editing scores
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
        case "top3":
            loadTop3();
        break;
    }
}