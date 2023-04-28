
$("#tp").click(()=>{
    purge("talentportion");
});

$("#sw").click(()=>{
    purge("swimwear");
});

$("#g").click(()=>{
    purge("gown");
});

$("#qa").click(()=>{
    purge("qna");
});

$("#t5").click(()=>{
    purge("top5");
});

$("#t3").click(()=>{
    purge("top3");
});

let purge = function(s){
    fetch("./php/purge.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subevent: s
        })
    })
    .then(()=>{
        alert("Cleared data for " + s);
        //location.reload();
    })
    .catch(error=>{console.error(error)});
}