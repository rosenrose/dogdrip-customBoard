let boardList = document.querySelectorAll("div.eq.overflow-hidden");
boardList = Array.from(boardList).slice(2);
for (let board of boardList) {
    boardList[board.querySelector("a.eq.link").textContent.trim()] = board.innerHTML;
}

browser.storage.sync.get('userBoardList')
.then(data => {
    for (let i=0; i<boardList.length; i++) {
        if (i < data.userBoardList.length) {
            boardList[i].innerHTML = boardList[data.userBoardList[i]];
        }
        else {
            boardList[i].style.display = "none";
        }
    }
});