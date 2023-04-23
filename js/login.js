//login button click
$("#login").click(()=>{
    //guard clause
    if($("#code").val() == ""){
        $("#code").css({border: "1px solid red"});
        return;
    }
    //user authentication
    fetch("./php/auth.php", {
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
            $("#code").css({border: "1px solid red"});
        }
    })
    .catch(error=>{console.error(error)});
});

$("#code").keyup((e)=>{
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

