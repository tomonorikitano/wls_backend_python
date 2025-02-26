function questionWordVisibility(){


    if(window.innerWidth > 800){
        document.getElementById("questionWord").style.display = "block";
        document.getElementById("questionWord").style.visibility = "visible";
    }else if(window.innerWidth > 780 && window.innerWidth <= 800 && window.innerWidth != windowWidth){
        document.getElementById("questionWord").style.display = "none";
        document.getElementById("selectWordsID").classList.add("questionHeaderAnimation");
    };


};


window.onresize = questionWordVisibility;