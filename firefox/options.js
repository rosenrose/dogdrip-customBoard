var boardList = [], userBoardList = [];
var draggables = [...document.querySelectorAll("#user td")].slice(2);
var dragged;

fetch("https://www.dogdrip.net/")
.then(response => response.text())
.then(content => {
    content = new DOMParser().parseFromString(content,"text/html");
    boardList = content.querySelectorAll("div.eq.overflow-hidden");
    boardList = [...boardList].map(board => board.querySelector("a").textContent.trim());

    let td = document.querySelectorAll("#original td");
    for (let i=0; i<td.length; i++) {
        if (i < 2) {
            td[i].textContent = boardList[i];
        }
        else if (i < boardList.length) {
            let label = document.createElement("label");
            let input = document.createElement("input");
            input.type = "checkbox";
            input.value = boardList[i];
            input.addEventListener("change", event => {
                if (event.target.checked) {
                    userBoardList.push(event.target.value);
                }
                else {
                    let idx = userBoardList.indexOf(event.target.value);
                    if (idx > -1) userBoardList.splice(idx, 1);
                }
                save();
                setTables();
            });
            label.appendChild(input);
            label.appendChild(document.createTextNode(boardList[i]));
            td[i].appendChild(label);
        }
        else {
            td[i].textContent = "\u00A0";
        }
    }

    browser.storage.sync.get('userBoardList')
    .then(data => {
        if (data.userBoardList == undefined) {
            userBoardList = boardList.slice(2);
            save();
        }
        else {
            userBoardList = data.userBoardList.slice();
            if (userBoardList.length > boardList.length) {
                userBoardList.length = boardList.length;
                save();
            }
        }
        setTables();
    });
});

function setTables() {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    for (let checkbox of checkboxes) {
        checkbox.checked = userBoardList.includes(checkbox.value);
    }
    for (let i=0; i<draggables.length; i++) {
        if (i < userBoardList.length) {
            draggables[i].textContent = userBoardList[i];
            draggables[i].style.backgroundColor = "rgb(46,67,97)";
            draggables[i].draggable = true;
            if (!draggables[i].hasAttribute("event")) {
                draggables[i].id = i;
                draggables[i].setAttribute("event", true);
                draggables[i].addEventListener("dragstart", event => {
                    if (event.target.draggable) {
                        dragged = event.target;
                        event.target.style.opacity = 0.5;
                    }
                });
                draggables[i].addEventListener("dragend", event => {
                    event.target.style.opacity = 1;
                    dragged = null;
                });
                draggables[i].addEventListener("dragover", event => {
                    event.preventDefault();
                });
                draggables[i].addEventListener("dragenter", event => {
                    if (dragged && event.target.draggable) {
                        event.target.style.backgroundColor = "rgb(56,138,255)";
                    }
                });
                draggables[i].addEventListener("dragleave", event => {
                    if (dragged && event.target.draggable) {
                        event.target.style.backgroundColor = "rgb(46,67,97)";
                    }
                });
                draggables[i].addEventListener("drop", event => {
                    event.preventDefault();
                    if (dragged && event.target.draggable) {
                        event.target.style.backgroundColor = "rgb(46,67,97)";
                        if (dragged != event.target) {
                            [event.target.textContent, dragged.textContent] = [dragged.textContent, event.target.textContent];
                            userBoardList[dragged.id] = dragged.textContent;
                            userBoardList[event.target.id] = event.target.textContent;
                            save();
                        }
                    }
                });
            }
        }
        else {
            draggables[i].textContent = "\u00A0";
            draggables[i].style.backgroundColor = "";
            draggables[i].draggable = false;
        }
    }
}

document.querySelector("#reset").addEventListener("click", () => {
    browser.storage.sync.set({userBoardList: boardList});
    window.location.reload();
});

document.querySelector("#all").addEventListener("click", () => {
    for (let input of document.querySelectorAll("input[type='checkbox']")) {
        if (!input.checked) {
            input.checked = true;
            userBoardList.push(input.value);
        }
    }
    save();
    setTables();
});

document.querySelector("#none").addEventListener("click", () => {
    for (let input of document.querySelectorAll("input[type='checkbox']")) {
        input.checked = false;
    }
    userBoardList = [];
    save();
    setTables();
});

function save() {
    browser.storage.sync.set({userBoardList: userBoardList});
}