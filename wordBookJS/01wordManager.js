 //単語帳リストの作成
function createListWordsID(){


    //単語帳の一覧を作成
    for(i=0;i<wordsData.length;i++){

        
        //htmlの新しい要素を作成
        let newList = document.createElement("li");
        let newBlock = document.createElement("a");
        let newBlockName = document.createElement("h3");


        //新要素にクラスを追加
        newList.classList.add("areaSelect","cursorClick");
        newBlock.classList.add('newBlock');


        //単語帳に順番にID付け
        newList.id = `WordsID_${i}`;


        newBlockName.innerHTML = wordsData[i][0];


        //親要素と子要素の関係を設定
        newBlock.appendChild(newBlockName);
        newList.appendChild(newBlock);
        getListWordsID.appendChild(newList);


        //作成したリストにクリック機能を追加
        document.getElementById(`WordsID_${i}`).setAttribute('onclick', `resetCountQuestion(); set_question(${i}); wordAnimation();` );


        console.log(wordsData[i][0]);
        console.log(`Number is ${i}`);
        

    }


    console.log(wordsData);
    console.log("function createListWordsID() 終了");


};