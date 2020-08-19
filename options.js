var boardList = [];
var userBoardList = [];

userSelects = document.querySelector("table~table").querySelectorAll("select");
fetch("https://www.dogdrip.net/")
.then(response => response.text())
.then(content => {
    content = new DOMParser().parseFromString(content,"text/html");
    dogdripMain = content.querySelectorAll("div.eq.section.secontent.background-color-content > div.xe-widget-wrapper");
    top_boards = dogdripMain[1].querySelectorAll("div > div.xe-widget-wrapper");
    bottom_boards = dogdripMain[7].querySelectorAll("div > div.xe-widget-wrapper");
    middle_boards = Array.prototype.slice.call(dogdripMain).slice(2,6);

    tableTds = document.querySelector("table").querySelectorAll("td");
    for (let i=0; i<top_boards.length; i++) {
        boardName = top_boards[i].querySelector("a.eq.link").text;
        tableTds[i].innerText = boardName;
        boardList.push(boardName);
    }
    for (let i=0; i<middle_boards.length; i++) {
        boardName = middle_boards[i].querySelector("a.eq.link").text;
        tableTds[i+top_boards.length].innerText = boardName;
        boardList.push(boardName);
    }
    for (let i=0; i<bottom_boards.length; i++) {
        boardName = bottom_boards[i].querySelector("a.eq.link").text;
        tableTds[i+top_boards.length+middle_boards.length].innerText = boardName;
        boardList.push(boardName);
    }
    boardList = boardList.slice(2);

    for (let i=0; i<userSelects.length; i++) {
        userSelects[i].id = i;
        userSelects[i].addEventListener("change", event => {
            userBoardList[event.target.id] = event.target.value;
            chrome.storage.sync.set({userBoardList: userBoardList}, ()=>{});
            window.location.reload();
        });
        for (let j=0; j<boardList.length; j++) {
            let option = document.createElement("option");
            option.value = boardList[j];
            option.text = boardList[j];            
            userSelects[i].appendChild(option);
        }
    }
    chrome.storage.sync.get('userBoardList', data => {
        if (data.userBoardList == undefined) {
            for (let i=0; i<boardList.length; i++) {
                userBoardList.push(boardList[i]);
            }
            chrome.storage.sync.set({userBoardList: userBoardList}, ()=>{});
        }
        else {
            userBoardList = data.userBoardList;
        }
        userSelectUpdate();
    });
});

function userSelectUpdate() {
    console.log(userBoardList);
    for (let i=0; i<userSelects.length; i++) {
        let options = userSelects[i].querySelectorAll("option");
        for (let j=0; j<options.length; j++) {
            if (options[j].value == userBoardList[i]) {
                options[j].selected = true;
                tableTds[j+2].style.backgroundColor = "rgb(0,147,219)";
            }
        }
    }
}

document.querySelector("#resetButton").addEventListener('click', () => {
    for (let i=0; i<userSelects.length; i++) {
        let options = userSelects[i].querySelectorAll("option");
        options[i].selected = true;
        userBoardList[i] = boardList[i];
    }
    chrome.storage.sync.set({userBoardList: userBoardList}, ()=>{});
    window.location.reload();
});