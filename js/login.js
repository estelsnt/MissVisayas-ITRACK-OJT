//login button click
$("#login").click(()=>{
    //guard clause
    if($("#code").val() == ""){
        $("#code").css({border: "1px solid red"});
        return;
    }
    //user authentication
    fetch("./php/auth.php", {                   //search from judges table
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code: $("#code").val()
        })
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);                          
        if(data.status == "success"){
            location.href = "judge.html";
        }else{
            fetch("./php/authTabulator.php", {              //search from organizer table
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: $("#code").val()
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                if(data.status == "success"){         
                    location.href = "tabulator.html";
                }else{
                    $("#code").css({border: "3px solid red"});
                    $("#code").val("");
                }
            })
            .catch(error=>{console.error(error)});
        }
    })
    .catch(error=>{console.error(error)});
});

$("#code").keyup((e)=>{
    $("#code").css({border: "none"});
    $("#code").val(sanitize($("#code").val()));
    if(e.keyCode == 13){
        $("#login").click();
    }
});

//input sanitization
let sanitize = (string)=>{
    const map = {
        '&': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        "/": '',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
}

