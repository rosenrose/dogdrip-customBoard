let main = document.querySelectorAll("div.eq.section.secontent.background-color-content > div.xe-widget-wrapper");
let top_boards = main[1].querySelectorAll("div > div.xe-widget-wrapper");
let bottom_boards = main[7].querySelectorAll("div > div.xe-widget-wrapper");
let middle_boards = Array.prototype.slice.call(main).slice(2,6);
main[6].style.display = "none";
let boards = {};

boards[top_boards[2].querySelector("a.eq.link").innerText] = top_boards[2].innerHTML;
for (let i=0; i<middle_boards.length; i++) {
    boards[middle_boards[i].querySelector("a.eq.link").innerText] = middle_boards[i].innerHTML;
}
for (let i=0; i<bottom_boards.length; i++) {
    boards[bottom_boards[i].querySelector("a.eq.link").innerText] = bottom_boards[i].innerHTML;
}

chrome.storage.sync.get('userBoardList', data => {
    top_boards[2].innerHTML = boards[data.userBoardList[0]];
    for (let i=0; i<middle_boards.length; i++) {
        middle_boards[i].innerHTML = boards[data.userBoardList[i+1]];
    }
    for (let i=0; i<bottom_boards.length; i++) {
        bottom_boards[i].innerHTML = boards[data.userBoardList[i+1+middle_boards.length]];
    }
});