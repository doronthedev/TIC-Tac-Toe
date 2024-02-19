const BoxContainer = document.querySelector(".box");  
const Boxes = document.querySelectorAll(".boxes"); 
const UserTurnSpan = document.querySelector(".userTurn");
const UserTurnSpanP1 = document.querySelector(".userTurnP1");
const UserTurnSpanP2 = document.querySelector(".userTurnP2"); 
const Btns = document.querySelectorAll(".choiceBtn");
const ComputerBtn = document.querySelector(".vsComputer");
const HumanBtn = document.querySelector(".vsHuman");

const gameMap = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
  
let userTurn;
let isPlayH;
let isPlayC;
let wait = false;

function resetMap (gameMap) {
    if (gameMap === undefined) return 

    for (let i = 0; i < gameMap.length; i++) {
        for (let j = 0; j < gameMap[i].length; j++) {
            gameMap[i][j] = 0;
        }
    }
}

function resetBoard () {
    Boxes.forEach(box => {
        box.style.backgroundColor = "";
        box.textContent = "";
    });

    Btns.forEach(btn => {
        btn.style.backgroundColor = "";
        btn.style.boxShadow = "";
    });

    UserTurnSpan.textContent = "X";
    UserTurnSpanP1.textContent = "It's";
    UserTurnSpanP2.textContent = "turn";

    userTurn = "X";
    isPlayC = false;
    isPlayH = false;
}

function setCell (gameMap, x, y, val) {
    if (gameMap === undefined || x === undefined || y === undefined || val === undefined) return 

    if (
        x >= 0 &&
        x < gameMap.length &&
        y >= 0 &&
        y < gameMap[0].length &&
        gameMap[x][y] == 0
    ) gameMap[x][y] = val;
}

function getCoordinates (index) {
    if (index === undefined || index < 0 || index > 9) return console.error("index in getCoordinates must be number between 0-9")

    function getX(index){
        if (index < 3) return 0
        if (index < 6) return 1
        if (index < 9) return 2
    }

    let x = getX(index);
    let y = index - (x * 3);

    return {x, y};
}

function checkIfCellEmpty (gameMap, index) {
    if (index === undefined || index < 0 || index > 9 || gameMap === undefined) return

    let coordinates = getCoordinates(index);

    if ((gameMap[coordinates.x][coordinates.y]) === 0) return true;
    
    return false;
}

function checkWinCondition (gameMap) {
    for (let r of gameMap){
        if (r[0] === "X" 
        && r[1] === "X" 
        && r[2] === "X") return {isWin: true, whoWon: "X"};

        if (r[0] === "O" 
        && r[1] === "O" 
        && r[2] === "O") return {isWin: true, whoWon: "O"};
    };

    for (let index = 0; index < 3; index++) {        
        if (gameMap[0][index] === "X" 
        && gameMap[1][index] === "X" 
        && gameMap[2][index] === "X") return {isWin: true, whoWon: "X"};

        if (gameMap[0][index] === "O" 
        && gameMap[1][index] === "O" 
        && gameMap[2][index] === "O") return {isWin: true, whoWon: "O"};
    }

    if ((gameMap[0][0] === "X" && gameMap[1][1] === "X" 
    && gameMap[2][2] === "X") || (gameMap[0][2] === "X" 
    && gameMap[1][1] === "X" && gameMap[2][0] === "X")) return {isWin: true, whoWon: "X"}

    if ((gameMap[0][0] === "O" && gameMap[1][1] === "O" 
    && gameMap[2][2] === "O") || (gameMap[0][2] === "O" 
    && gameMap[1][1] === "O" && gameMap[2][0] === "O")) return {isWin: true, whoWon: "O"}

    let countZero = 0;
    for (let r of gameMap){
        for (let c of r) {
            if (c === 0) countZero++;
        }
    }

    if (countZero === 0) return {isWin: true, whoWon: "Tie :("};

    return {isWin: false, whoWon: "nobody"};
}

function boardWin (userTurn) {
    UserTurnSpanP1.textContent = "";
    UserTurnSpanP2.textContent = "";
    UserTurnSpan.textContent = `${userTurn} ${userTurn != "Tie :(" ? "won :)" : ""}`;
}

function changeBoard (userTurn, clickIndex) {
    Boxes[clickIndex].textContent = userTurn;
    Boxes[clickIndex].style.backgroundColor = "rgb(88, 212, 240)";
    UserTurnSpan.textContent = userTurn == "X" ? "O" : "X";
}

function humanVsHuman () {
    setup("humanVsHuman");
    userTurn = "X";

    ComputerBtn.onClick = function() {
        isPlayH = false;
    }
    
    Boxes.forEach((box, indexOfBox) => {
        box.addEventListener("click", () => {
            if (!isPlayH) return
            if (!checkIfCellEmpty(gameMap, indexOfBox)) return

            doTurn(userTurn, indexOfBox, "humanVsHuman");

            userTurn = userTurn == "X" ? "O" : "X";
        });
    });
}

function humanVsComputer () {

    let randomTurn;

    setup("humanVsComputer");

    HumanBtn.onClick = function() {
        isPlayC = false;
    }

    Boxes.forEach((box, indexOfBox) => {
        box.addEventListener("click", () => {
            if (!isPlayC) return
            if (wait) return
            if (!checkIfCellEmpty(gameMap, indexOfBox)) return

            doTurn("X", indexOfBox, "humanVsComputer");

            if (!isPlayC) return
            wait = true;

            setTimeout(() => {

                randomTurn = computerRandomTurn(gameMap);

                if (!isPlayC) return

                wait = false;
                doTurn("O", randomTurn, "humanVsComputer");
            }, 1000);
        });
    });
}
function setup (mode) {
    resetBoard();
    resetMap(gameMap);

    if (mode === "humanVsHuman") {
        isPlayH = true;
        HumanBtn.style.backgroundColor = "rgb(93, 238, 225)";
        HumanBtn.style.boxShadow = "0 0 20px black";
    }

    if (mode === "humanVsComputer") {
        isPlayC = true;
        ComputerBtn.style.backgroundColor = "rgb(93, 238, 225)";
        ComputerBtn.style.boxShadow = "0 0 20px black";
    }
}
    
function doTurn (turn, index, mode) {
    let coordinates = getCoordinates(index);
    setCell(gameMap, coordinates.x, coordinates.y, turn);
    changeBoard(turn, index);
    let isWinOb = checkWinCondition(gameMap);

    if (isWinOb?.isWin) {
        boardWin(isWinOb.whoWon);
        if (mode === "humanVsHuman") isPlayH = false
        else if (mode === "humanVsComputer") isPlayC = false;

        console.log(`%cThe game ended, %C${isWinOb.whoWon} %Cwon`, "font-size: 1.5rem; font-weight: 600", "color: green; font-size: 2rem; font-weight: 900", "font-size: 1.5rem; font-weight: 600")
    }
}

function computerRandomTurn (gameMap) {
    let turns = ["O", "X"];

    for (let turn of turns) {
        if (
        (gameMap[0][1] === turn && gameMap[0][2] === turn && gameMap[0][0] === 0) ||
        (gameMap[1][0] === turn && gameMap[2][0] === turn && gameMap[0][0] === 0) ||
        (gameMap[1][1] === turn && gameMap[2][2] === turn && gameMap[0][0] === 0)
        ) return 0;
    
        if (
        (gameMap[0][0] === turn && gameMap[0][2] === turn && gameMap[0][1] === 0) ||
        (gameMap[2][1] === turn && gameMap[1][1] === turn && gameMap[0][1] === 0)
        ) return 1;
    
        if (
        (gameMap[0][0] === turn && gameMap[0][1] === turn && gameMap[0][2] === 0) ||
        (gameMap[2][2] === turn && gameMap[1][2] === turn && gameMap[0][2] === 0) ||
        (gameMap[2][0] === turn && gameMap[1][1] === turn && gameMap[0][2] === 0)
        ) return 2;
    
        if (
        (gameMap[1][1] === turn && gameMap[1][2] === turn && gameMap[1][0] === 0) || 
        (gameMap[0][0] === turn && gameMap[2][0] === turn && gameMap[1][0] === 0)
        ) return 3;
    
        if (
        (gameMap[1][0] === turn && gameMap[1][2] === turn && gameMap[1][1] === 0) ||
        (gameMap[0][1] === turn && gameMap[2][1] === turn && gameMap[1][1] === 0) ||
        (gameMap[0][0] === turn && gameMap[2][2] === turn && gameMap[1][1] === 0) ||
        (gameMap[2][0] === turn && gameMap[0][2] === turn && gameMap[1][1] === 0)
        ) return 4;
    
        if (
        (gameMap[1][0] === turn && gameMap[1][1] === turn && gameMap[1][2] === 0) ||
        (gameMap[2][2] === turn && gameMap[0][2] === turn && gameMap[1][2] === 0) 
        ) return 5;
    
        if (
        (gameMap[2][1] === turn && gameMap[2][2] === turn && gameMap[2][0] === 0) || 
        (gameMap[0][0] === turn && gameMap[1][0] === turn && gameMap[2][0] === 0) ||    
        (gameMap[0][2] === turn && gameMap[1][1] === turn && gameMap[2][0] === 0)
        ) return 6;
    
        if (
        (gameMap[2][0] === turn && gameMap[2][2] === turn && gameMap[2][1] === 0) ||
        (gameMap[0][1] === turn && gameMap[1][1] === turn && gameMap[2][1] === 0)
        ) return 7;
    
        if (
        (gameMap[2][0] === turn && gameMap[2][1] === turn && gameMap[2][2] === 0) ||
        (gameMap[0][2] === turn && gameMap[1][2] === turn && gameMap[2][2] === 0) ||
        (gameMap[0][0] === turn && gameMap[1][1] === turn && gameMap[2][2] === 0) 
        ) return 8;
    }

    if (
    ((gameMap[0][0] === "X" || gameMap[0][2] === "X" || gameMap[2][0] === "X" || gameMap[2][2] === "X") ||    
    (gameMap[0][1] === "X" || gameMap[1][0] === "X" || gameMap[1][2] === "X" || gameMap[2][1] === "X")) &&
    (checkIfCellEmpty(gameMap, 4))) return 4;

    let randomTurn;
    let edges = [0, 2, 6, 8];
    let middles = [1, 3, 5, 7];

    if (gameMap[1][1] === "X") {
        do {
            randomTurn = edges[Math.floor(Math.random() * 4)];
        } while (!checkIfCellEmpty(gameMap, randomTurn));

        return randomTurn;
    }

    if (
    (gameMap[0][0] === "X" && gameMap[2][2] === "X" && gameMap[1][1] === "O") ||
    (gameMap[0][2] === "X" && gameMap[2][0] === "X" && gameMap[1][1] === "O")
    ) {
        do {
            randomTurn = middles[Math.floor(Math.random() * 4)];
        } while (!checkIfCellEmpty(gameMap, randomTurn));
        console.log(randomTurn)
        return randomTurn;
    }

    if (
    ((gameMap[2][1] === "X" && gameMap[1][0] === "X") ||
    (gameMap[1][0] === "X" && gameMap[2][2] === "X")) &&
    (checkIfCellEmpty(gameMap, 0))) return 0;

    if (
    ((gameMap[2][1] === "X" && gameMap[1][2] === "X") ||
    (gameMap[0][1] === "X" && gameMap[2][0] === "X")) &&
    (checkIfCellEmpty(gameMap, 2))) return 2;

    if (
    ((gameMap[2][1] === "X" && gameMap[0][2] === "X") ||
    (gameMap[0][1] === "X" && gameMap[1][0] === "X")) &&
    (checkIfCellEmpty(gameMap, 6))) return 6;
    
    if (
    ((gameMap[0][1] === "X" && gameMap[1][2] === "X") ||
    (gameMap[0][0] === "X" && gameMap[1][2] === "X")) &&
    (checkIfCellEmpty(gameMap, 8))) return 8;

    do {
        randomTurn = Math.floor(Math.random() * 9);
    } while (!checkIfCellEmpty(gameMap, randomTurn));

    return randomTurn;
}
