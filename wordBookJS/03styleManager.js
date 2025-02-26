//モードをチェンジする
function questionModeChange(modeNumber){
    if(modeNumber == 1){
        questionMode = "RANDOM";
        getRandomMode.style.color = "#4D94FF";
        getMemoryLevelMode.style.color = "#000000";
        getWeakPointMode.style.color = "#000000";
        getStrongPointMode.style.color = "#000000";
    }
    if(modeNumber == 2){
        questionMode = "MEMORY LEVEL";
        getRandomMode.style.color = "#000000";
        getMemoryLevelMode.style.color = "#4D94FF";
        getWeakPointMode.style.color = "#000000";
        getStrongPointMode.style.color = "#000000";
    }
    if(modeNumber == 3){
        questionMode = "WEAK POINT";
        getRandomMode.style.color = "#000000";
        getMemoryLevelMode.style.color = "#000000";
        getWeakPointMode.style.color = "#4D94FF";
        getStrongPointMode.style.color = "#000000";
    }
    if(modeNumber == 4){
        questionMode = "STRONG POINT";
        getRandomMode.style.color = "#000000";
        getMemoryLevelMode.style.color = "#000000";
        getWeakPointMode.style.color = "#000000";
        getStrongPointMode.style.color = "#4D94FF";
    }
    getModePlot.innerHTML=`MODE：${questionMode}`;
    set_question(nowSelectWords);
};






//ボタンの機能停止回復、結果などのビジビリティ変更
function answerLock_visibility(TrueOrFalse, whichVisibility){


    getStartCheck.disabled = TrueOrFalse;
    getAnswer.disabled = TrueOrFalse;


    getResult.style.visibility= whichVisibility;           


    console.log(`answerLock_visibility(${TrueOrFalse, whichVisibility}) 終了`);


};






function nextButton_visibility(whichVisibility){


    getNext.style.visibility = whichVisibility;


};