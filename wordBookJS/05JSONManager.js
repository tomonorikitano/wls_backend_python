 //単語帳のJSONファイルをダウンロード
function GetJsonFromLambda(){


    fetch('https://mwlgt31iu3.execute-api.ap-northeast-1.amazonaws.com/demo_s3tohtml/')
    .then(response => {
        return response.json();
    })
    .then(result => {

        
        wordsData = [];
        word_mean = result.json_wordsID_word_mean;


        //単語帳の作成
        for(i = 0 ;i < result.json_wordsID_list.length; i++){
            var words_array = [[],[],[],[],[],[],[]];
            for(j = 0 ;j < word_mean[result.json_wordsID_list[i]].length; j++){
                var a = word_mean[result.json_wordsID_list[i]][j].word;
                var b = word_mean[result.json_wordsID_list[i]][j].meaning;
                var c = word_mean[result.json_wordsID_list[i]][j].ItemKey;
                var d = word_mean[result.json_wordsID_list[i]][j].memorylevel;
                if(b!=null || b!=undefined || c != null || c != undefined){
                    words_array[d].push([a,b,c]);
                }
            }
            wordsData.push(
                [result.json_wordsID_list[i].replace(".csv",""),words_array]
            );
        }


        console.log(wordsData);

        createListWordsID();
        set_question(0);
        wordsListAnimation();


        console.log("GetJsonFromLambda() 終了");
        

    })
    .catch((e) => {
        console.log(e);
    })


};






//JSONから選択単語問題のリストを取り出し、入れ替え
function GetOneWordsList(wordsIDNumber){
    fetch('https://mwlgt31iu3.execute-api.ap-northeast-1.amazonaws.com/demo_s3tohtml/')
    .then(response => {
        return response.json();
    })
    .then(result => {
        console.log(`I try to get WordsList Number${wordsIDNumber}.`)
        var words_array = [];
        for(i = 0 ; i < word_mean[result.json_wordsID_list[wordsIDNumber]].length; i++){
            var a = word_mean[result.json_wordsID_list[wordsIDNumber]][i].word;
            var b = word_mean[result.json_wordsID_list[wordsIDNumber]][i].meaning;
            var c = word_mean[result.json_wordsID_list[wordsIDNumber]][i].memorylevel;
            words_array.push([a,b,c]);
        }
        console.log(result.json_wordsID_list[wordsIDNumber].replace(".csv",""));
        wordsData.splice( wordsIDNumber, 1,
            [result.json_wordsID_list[wordsIDNumber].replace(".csv",""),words_array]
        );
        console.log(wordsData);
        console.log("May be correct.")
    })
    .catch((e) => {
        console.log(e);
    })

};








//JSONでS3に送信
function POSTAnswerData(){


    let pw = problem_word;
    let wI = wordsID;
    let p = point;
    let ml = memory_level;
    let nSW = nowSelectWords;
    let s = shuffle;


    //JSONデータ作成
    const resultDataFile = {
        "word": pw, "wordsID": wI, "result": p, "memorylevel": ml
    };
    const resultDataFileJSON = {
        method: "POST", body: JSON.stringify(resultDataFile)//, mode: "no-cors"
    };


    console.log(resultDataFileJSON);
    fetch("https://9h2caq2cuc.execute-api.ap-northeast-1.amazonaws.com/RightAndWrong_api/", resultDataFileJSON)
        .then(response => {
            return response.json();
        })
        .then(result => {


            console.log(`New memory level I get from Lambda is ${JSON.parse(result.body).new_memorylevel}`);
            console.log(cooltimeWord);


            //出題した問題にクールタイムを設け、クールタイムが終わった単語を戻す
            //出題した問題をクールタイムへ
            cooltimeWord.push([JSON.parse(result.body).new_memorylevel, wordsData[nSW][1][ml][s]]);
            //出題した問題を単語リストから削除
            wordsData[nSW][1][ml].splice(s,1);
            if(cooltimeWord[0] != "a"){
                //console.log(wordsData[nSW][1][cooltimeWord[0][0]]);
                //クールタイムの終わった単語を戻す
                wordsData[nSW][1][cooltimeWord[0][0]].push(cooltimeWord[0][1]);
                //console.log(`reflesh word ${wordsData[nSW][1][cooltimeWord[0][0]]}`);
            }
            //戻し終わった単語をクールタイムから削除
            cooltimeWord.splice(0, 1);


            //console.log(cooltimeWord);
            //console.log(`This is the changed memory : ${wordsData[nowSelectWords][1][JSON.parse(result.body).new_memorylevel]}`);


            
            nextButton_visibility('visible');



            console.log("POSTAnswerData() 終了");


        })
        .catch(error => console.log(error));


};