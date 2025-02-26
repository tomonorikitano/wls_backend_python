//リストのアニメーションのオンオフ

function wordsListAnimation(){
    if(window.innerWidth <= 800){
        document.getElementById("selectWordsID").classList.add("questionHeaderAnimation");
        document.getElementById("questionWord").classList.remove("questionWordAnimation");
        document.getElementById("questionWord").style.visibility = "collapse"; 
        getImageDiv.style.display = "collapse";
        getImageDiv.style.visibility = "hidden";
        answerLock_visibility(false,'collapse');           
    }
};





//問題移行時のアニメーション追加
function wordAnimation(){
    document.getElementById("questionWord").classList.add("questionWordAnimation");
}





//メニューバーアニメーションのオンオフ
function menuBarSlideIn(){
    document.getElementById("menuBar").classList.add("menuBarSlideInAnimation");
    document.getElementById("menuBar").classList.remove("menuBarClass");
    document.getElementById("menuBar").classList.remove("menuBarSlideOutAnimation");
}

function menuBarSlideOut(){
    document.getElementById("menuBar").classList.add("menuBarClass");
    document.getElementById("menuBar").classList.add("menuBarSlideOutAnimation");
    document.getElementById("menuBar").classList.remove("menuBarSlideInAnimation");
}