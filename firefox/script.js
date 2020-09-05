let boardList = Array.from(document.querySelectorAll("div.eq.overflow-hidden")).slice(2);
for (let board of boardList) {
    boardList[board.querySelector("a").textContent.trim()] = board.cloneNode(true);
}

browser.storage.sync.get('userBoardList')
.then(data => {
    for (let i=0; i<boardList.length; i++) {
        if (i < data.userBoardList.length) {
            boardList[i].parentNode.appendChild(boardList[data.userBoardList[i]]);
        }
        boardList[i].style.display = "none";
    }
});