//新問題をランダムに選び抽出
function set_question(wordsIDNumber){

    

    //単語帳の選択が変更されたか確認
    console.log(oneBackSelectWords)
    if(oneBackSelectWords != null){
        document.getElementById(oneBackSelectWords).classList.remove("wordsIDSelected");
    }
    
    document.getElementById(`WordsID_${wordsIDNumber}`).classList.add("wordsIDSelected");

    if(oneBackSelectWords != `WordsID_${wordsIDNumber}`){

        cooltimeLength(wordsIDNumber);

        oneBackSelectWords = `WordsID_${wordsIDNumber}`;          
        nowSelectWords = wordsIDNumber;

    }


    //出題問題の設定
    shuffle = shuffleQuestion(wordsIDNumber);


    problem_word = wordsData[wordsIDNumber][1][memory_level][shuffle][0];
    answer_mean = wordsData[wordsIDNumber][1][memory_level][shuffle][1];
    word_image = wordsData[wordsIDNumber][1][memory_level][shuffle][2];


    if(typeof word_image === "undefined"){
        word_image = null;
    }


    wordsID = wordsData[wordsIDNumber][0];
    


    getWord.innerHTML = problem_word;
    getAnswer.value = "";
    getWordsIDName.innerHTML = wordsID;
    getYourLevel.innerHTML = `：第${countQuestion}問（エンドレス）MemoryLevel：${memory_level}`;


    document.getElementById("questionWord").style.visibility = "visible";
    document.getElementById("questionWord").style.display = "block";
    document.getElementById("selectWordsID").classList.remove("questionHeaderAnimation");
    document.getElementById("wordDiv").classList.add("questionWordAnimation");

    console.log(word_image);


    if(word_image != null && word_image != "noneItem"){
        getImagePlot.setAttribute("src",`${word_image}`);
        getImageDiv.style.display = "block";
        getImageDiv.style.visibility = "visible";
    } else {
        getImagePlot.setAttribute("src",``);
        getImageDiv.style.display = "none";
        getImageDiv.style.visibility = "hidden";
    }
    

    answerLock_visibility(false,'collapse');
    nextButton_visibility('collapse');
    
            
    console.log(wordsData[wordsIDNumber]);
    console.log(`Memory_level is ${memory_level} , and Selected word question is ${wordsData[wordsIDNumber][1][memory_level][shuffle]}`);
    console.log(`function set_question(${wordsIDNumber}) 終了`);


};





//出題された問題を一定期間でなくする
function cooltimeLength(wordsIDNumber){

    let countWord = 0;    

    for(i = 0; i < cooltimeWord.length; i++){
        if(cooltimeWord[i] != "a"){
            //console.log(wordsData[nSW][1][cooltimeWord[0][0]]);
            //クールタイムの終わった単語を戻す
            wordsData[nowSelectWords][1][cooltimeWord[i][0]].push(cooltimeWord[i][1]);
            //console.log(`reflesh word ${wordsData[nSW][1][cooltimeWord[0][0]]}`);
        }
    }

    cooltimeWord = [];

    for(i = 0; i < 7; i++){
        countWord += wordsData[wordsIDNumber][1][i].length;
    }

    console.log("クールタイム：" + countWord/5);
    if(countWord > 50){countWord = 50;}
    console.log("クールタイム：" + countWord/5);
    
    for(i = 1; i < countWord/5; i++){
        cooltimeWord.push("a");
    }
    

    console.log(`I changed cooltimeWord ${cooltimeWord}`);
    console.log("cooltimeLength() 終了");


};





function next_question(){
    countQuestion++;
    set_question(nowSelectWords);
};







//新問題作成アルゴリズム
function shuffleQuestion(wordsIDNumber){


    let x;
    let a = wordsIDNumber;


    //モードがランダムの時
    //memory_level = Math.floor(Math.exp((Math.random()-1)*6)*7);
    if(questionMode == 'RANDOM'){
        console.log(questionMode);
        memory_level =  Math.floor(Math.random() * (wordsData[a][1].length));

        while(wordsData[a][1][memory_level].length < 1){
            //memory_level = Math.floor(Math.exp((Math.random()-1)*6)*7);
            memory_level =  Math.floor(Math.random() * (wordsData[a][1].length));

        }
    }


    //モードがメモリーレベルに従う時
    if(questionMode == 'MEMORY LEVEL'){
        console.log(questionMode);
        memory_level =  Math.floor((7*Math.log10(2)-Math.log10(-127*(Math.random()-128/127)))/Math.log10(2));

        while(wordsData[a][1][memory_level].length < 1){
            //memory_level = Math.floor(Math.exp((Math.random()-1)*6)*7);
            memory_level =  Math.floor((7*Math.log10(2)-Math.log10(-127*(Math.random()-128/127)))/Math.log10(2));

        }
    }

    //モードが苦手な単語に従う時
    if(questionMode == 'WEAK POINT'){
        console.log(questionMode);
        memory_level =  0;

        while(wordsData[a][1][memory_level].length < 1){
            if(memory_level > 6){
                console.error("この単語帳に単語は存在しません。");
                break;
            }
            memory_level++;
        }
    }

    //モードが得意な単語に従う時
    if(questionMode == 'STRONG POINT'){
        console.log(questionMode);  
        memory_level =  6;

        while(wordsData[a][1][memory_level].length < 1){
            if(memory_level < 0){
                console.error("この単語帳に単語は存在しません。");
                break;
            }
            memory_level--;
        }
    }

    getModePlot.innerHTML=`MODE：${questionMode}`;


    x = Math.floor(Math.random() * (wordsData[a][1][memory_level].length));


    console.log(`function shuffleQuestion(${wordsIDNumber}) 終了`);


    return x;


};





//単語抽選
function wordLottery(wordsIDNumber){
    let x = Math.floor(Math.random() * (wordsData[wordsIDNumber][1].length));
    console.log(`function wordLottery(${wordsIDNumber}) 終了`);
    return x;
};





//採点
function check(){

                
    //正誤判定
    if(getAnswer.value == answer_mean){
        getResult.innerHTML=`<span style = "color: #4D94FF;">正解!!</span> <br>答え：${answer_mean}`;point = "correct";
        //getResult.style.color="#92FFFF";
    }

    else if(getAnswer.value == ""){
        getResult.innerHTML=`無回答 <br>答え：${answer_mean}`;point = "noAnswer";
    }

    else{
        getResult.innerHTML=`<span style = "color: #FF4444;">不正解</span><br>答え：${answer_mean}`;point = "incorrect";
    }   
    

    //回答結果の送信
    POSTAnswerData();         


    //選択されている単語帳のすべての単語を取り直して更新している。
    //GetOneWordsList(nowSelectWords);


    answerLock_visibility(true,'visible');


    //アニメーションクラスの取り消し
    document.getElementById("questionWord").classList.remove("questionWordAnimation");
    document.getElementById("wordDiv").classList.remove("questionWordAnimation");


    console.log("function check() 終了")


};






//出題問題リセット
function resetCountQuestion(){
    countQuestion = 1;
};