let x = document.querySelector(".x");
let o = document.querySelector(".o");
let boxes = document.querySelectorAll(".box");
let buttons = document.querySelectorAll("#buttons-container button");
let messageContainer = document.querySelector("#message");
let messageText = document.querySelector("#message p");

let secondPlayer;
let gameOver = false;

let player1 = 0;
let player2 = 0;

for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", function () {
        if (this.childNodes.length === 0 && !gameOver) {
            let el = checkEl(player1, player2);
            let cloneEl = el.cloneNode(true);
            this.appendChild(cloneEl);

            if (player1 === player2) {
                player1++;
                if (secondPlayer === "ai-player") {
                    setTimeout(() => {
                        computerPlay();
                        player2++;
                        checkWinCondition();
                    }, 300);
                }
            } else {
                player2++;
            }

            checkWinCondition();
        }
    });
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        secondPlayer = this.getAttribute("id");

        for (let j = 0; j < buttons.length; j++) {
            buttons[j].style.display = "none";
        }
        setTimeout(function () {
            document.querySelector("#container").classList.remove("hide");
        }, 500);
    });
}

function checkEl(player1, player2) {
    return player1 === player2 ? x : o;
}

function checkWinCondition() {
    const winPatterns = [
        ["block-1", "block-2", "block-3"],
        ["block-4", "block-5", "block-6"],
        ["block-7", "block-8", "block-9"],
        ["block-1", "block-4", "block-7"],
        ["block-2", "block-5", "block-8"],
        ["block-3", "block-6", "block-9"],
        ["block-1", "block-5", "block-9"],
        ["block-3", "block-5", "block-7"],
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern.map((id) => document.getElementById(id));
        if (a.childNodes.length && b.childNodes.length && c.childNodes.length) {
            let aClass = a.childNodes[0].className;
            let bClass = b.childNodes[0].className;
            let cClass = c.childNodes[0].className;

            if (aClass === bClass && bClass === cClass) {
                declareWinner(aClass);
                return;
            }
        }
    }

    let filled = [...boxes].filter((box) => box.childNodes.length > 0).length;
    if (filled === 9) declareWinner("deu velha");
}

function declareWinner(winner) {
    let scoreboardX = document.querySelector("#scoreboard-1");
    let scoreboardY = document.querySelector("#scoreboard-2");
    let msg = "";

    if (winner === "x") {
        msg = "O jogador 1 venceu!";
        scoreboardX.textContent = parseInt(scoreboardX.textContent) + 1;
    } else if (winner === "o") {
        msg = "O jogador 2 venceu!";
        scoreboardY.textContent = parseInt(scoreboardY.textContent) + 1;
    } else {
        msg = "Deu velha!";
    }

    messageText.innerHTML = msg;
    messageContainer.classList.remove("hide");
    gameOver = true;

    setTimeout(() => {
        messageContainer.classList.add("hide");
        resetGame();
    }, 3000);
}

function resetGame() {
    gameOver = false;
    player1 = 0;
    player2 = 0;
    boxes.forEach((box) => {
        if (box.firstChild) {
            box.removeChild(box.firstChild);
        }
    });
}

function computerPlay() {
    let cloneO = o.cloneNode(true);
    let emptyBoxes = Array.from(boxes).filter((box) => !box.hasChildNodes());

    if (emptyBoxes.length === 0) return;

    // Lógica simples: se possível, bloqueia ou ganha
    let placed = false;

    function tryWinningOrBlocking(symbol) {
        for (let pattern of [
            ["block-1", "block-2", "block-3"],
            ["block-4", "block-5", "block-6"],
            ["block-7", "block-8", "block-9"],
            ["block-1", "block-4", "block-7"],
            ["block-2", "block-5", "block-8"],
            ["block-3", "block-6", "block-9"],
            ["block-1", "block-5", "block-9"],
            ["block-3", "block-5", "block-7"],
        ]) {
            let [a, b, c] = pattern.map((id) => document.getElementById(id));
            let [aC, bC, cC] = [a, b, c].map(
                (el) => el.childNodes[0]?.className
            );

            let values = [aC, bC, cC];
            let counts = values.reduce((acc, val) => {
                if (val === symbol) acc++;
                return acc;
            }, 0);

            if (counts === 2 && values.includes(undefined)) {
                let emptyIndex = values.indexOf(undefined);
                let target = [a, b, c][emptyIndex];
                target.appendChild(cloneO);
                placed = true;
                return;
            }
        }
    }

    tryWinningOrBlocking("o");
    if (!placed) tryWinningOrBlocking("x");

    if (!placed) {
        let randIndex = Math.floor(Math.random() * emptyBoxes.length);
        emptyBoxes[randIndex].appendChild(cloneO);
    }
}
