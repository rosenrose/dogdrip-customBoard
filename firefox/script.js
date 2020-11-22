let boardList = [...document.querySelectorAll("div.eq.overflow-hidden")].slice(2);
let boardMap = {};
for (let board of boardList) {
    boardMap[board.querySelector("a").textContent.trim()] = board.cloneNode(true);
}

browser.storage.sync.get('userBoardList')
.then(data => {
    for (let i=0; i<boardList.length; i++) {
        if (i < data.userBoardList.length) {
            boardList[i].parentNode.appendChild(boardMap[data.userBoardList[i]]);
        }
        boardList[i].remove();
    }
});