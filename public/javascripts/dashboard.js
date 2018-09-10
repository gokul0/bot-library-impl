var config = {"nlp":"dialogFlow","personality":"men","weatherEnabled":true,"googleEnabled":false};

$(document).ready(function() {
    $.ajax("http://localhost:3000/admin/config", {
        success: function(data) {
           
            console.log("configuration is : "+JSON.stringify(data));
            config = data;

            setTimeout(function(){updateUI()},1000);


        },
        error: function() {
           console.error("error");
        }
     });
});


function updateUI(){


    console.log(JSON.stringify(config));

    $(".nlp .contents .luis").attr("class","luis");
    $(".nlp .contents .dialogFlow").attr("class","dialogFlow");


    $(".personality .contents .men").attr("class","men");
    $(".personality .contents .women").attr("class","women");

    $(".externalApi .contents .weather").attr("class","weather");
    $(".externalApi .contents .googleSearch").attr("class","googleSearch");


    $(".nlp .contents ."+config.nlp).attr("class",$(".nlp .contents ."+config.nlp).attr("class")+" selected");

    if((config.weatherEnabled == true || config.weatherEnabled == "true") && config.weatherEnabled != "false" ){
        $(".externalApi .contents .weather").attr("class",$(".externalApi .contents .weather").attr("class")+" selected")
    }

    if((config.googleEnabled == true || config.googleEnabled == "true") && config.googleEnabled != "false"){
        $(".externalApi .contents .googleSearch").attr("class",$(".externalApi .contents .googleSearch").attr("class")+" selected")
    }

    console.log(config.personality);

    $(".personality .contents ."+config["personality"]).attr("class",config["personality"]+" selected");

}

function updateConfig(){

    $.post("http://localhost:3000/admin/config",
    config,
    function(data, status){
        console.log(data);
        console.log("updated");
        //
        setTimeout(function(){
            //window.location.reload();
        },1000);
    });

}


function nlpUpdate(event){

    config.nlp = event.data.param;
    updateUI();
    updateConfig();

}

function weatherEnabled(event){

    if(config.weatherEnabled){
        config.weatherEnabled = false;
    }else{
        config.weatherEnabled = true;
    }
    updateUI();
    updateConfig();
    
}

function googleEnabled(event){

    console.log(config.googleEnabled);

    if(config.googleEnabled){
        config.googleEnabled = false;
    }else{
        config.googleEnabled = true;
    }
    
    updateUI();
    updateConfig();
}


function personalityUpdate(event){

    console.log(event.data.param);

    config.personality = event.data.param;
    
    updateUI();
    updateConfig();
}


$(".personality .contents .men").click({"param":"men"},personalityUpdate);

$(".personality .contents .women").click({"param":"women"},personalityUpdate);

$(".nlp .contents .luis").click({"param":"luis"},nlpUpdate);

$(".nlp .contents .dialogFlow").click({"param":"dialogFlow"},nlpUpdate);

$(".externalApi .contents .weather").click({},weatherEnabled);

$(".externalApi .contents .googleSearch").click({},googleEnabled);


