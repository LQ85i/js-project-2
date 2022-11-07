//gameboard module
const gameBoard = (() => {
    let boardState = 
    {"slot1": 0,
    "slot2": 0,
    "slot3": 0,
    "slot4": 0,
    "slot5": 0,
    "slot6": 0,
    "slot7": 0,
    "slot8": 0,
    "slot9": 0};
    const resetBoard = () => {
        boardState = 
        {"slot1": 0,
        "slot2": 0,
        "slot3": 0,
        "slot4": 0,
        "slot5": 0,
        "slot6": 0,
        "slot7": 0,
        "slot8": 0,
        "slot9": 0};
    }
    const updateBoard = (slot, value) => {
        if(value == "X" || value == "O") {
            boardState[slot] = value;
        } else {
            console.log("Error: invalid board value");
        }
    }
    const getBoardState = () => boardState;
    return {getBoardState, updateBoard, resetBoard};
})();

//player factory
const Player = (name) => {
    const getName = () => name;
    return {name};
};

//game logic module
const gameEngine = ((slot) => {
    let turn = 1;
    let board = gameBoard.getBoardState();
    let slotsLeft = 9;
    const clickSlot = (slot) => {
        if(turn != 0) {
            let value = "";
            if(board[slot.id] == 0){
                turn == 1 ? (value = "X", turn = 2)
                : turn == 2 ? (value = "O", turn = 1)
                : console.log("Error: invalid slot value");
                    gameBoard.updateBoard(slot.id,value);
                const result = checkWinCondition();
                slotsLeft--;
                if(result != 0) {
                    console.log("WINNER IS: " + result[0]);
                    document.getElementById("postgame-win").style.display = "block";
                    document.getElementById("winner").innerHTML = result[0];
                    turn = 0;
                }
                else if(slotsLeft == 0) {
                    console.log("DRAW");
                    document.getElementById("postgame-draw").style.display = "block";
                    turn = 0;
                }
                return true;
            }
        }
        else {
            return false;
        }
    }
    
    const getTurn = () => turn;
    function checkWinCondition() {
        if (
            board["slot1"] != 0 // top row
            && board["slot1"] == board["slot2"]
            && board["slot2"] == board["slot3"]
        ) {return [board["slot1"],board["slot2"],board["slot3"]];}
        else if (
            board["slot4"] != 0 // mid row
            && board["slot4"] == board["slot5"]
            && board["slot5"] == board["slot6"]
        ) {return [board["slot4"],board["slot5"],board["slot6"]];}
        else if (
            board["slot7"] != 0 // bot row
            && board["slot7"] == board["slot8"]
            && board["slot8"] == board["slot9"]
        ) {return [board["slot7"],board["slot8"],board["slot9"]];}
        else if (
            board["slot1"] != 0 // first column
            && board["slot1"] == board["slot4"]
            && board["slot4"] == board["slot7"]
        ) {return [board["slot1"],board["slot4"],board["slot7"]];}
        else if (
            board["slot2"] != 0 // second column
            && board["slot2"] == board["slot5"]
            && board["slot5"] == board["slot8"]
        ) {return [board["slot2"],board["slot5"],board["slot8"]];}
        else if (
            board["slot3"] != 0 // third column
            && board["slot3"] == board["slot6"]
            && board["slot6"] == board["slot9"]
        ) {return [board["slot3"],board["slot6"],board["slot9"]];}
        else if (
            board["slot1"] != 0 // diagonal fall
            && board["slot1"] == board["slot5"]
            && board["slot5"] == board["slot9"]
        ) {return [board["slot1"],board["slot5"],board["slot9"]];}
        else if (
            board["slot7"] != 0 // diagonal rise
            && board["slot7"] == board["slot5"]
            && board["slot5"] == board["slot3"]
        ) {return [board["slot7"],board["slot5"],board["slot3"]];}
        else {
            return 0;
        }
    }
    const resetGame = () => {
        gameBoard.resetBoard();
        board = gameBoard.getBoardState();
        document.getElementById("postgame-win").style.display = "none";
        document.getElementById("winner").innerHTML = "";
        document.getElementById("postgame-draw").style.display = "none";
        turn = 1;
        slotsLeft = 9;
        displayBoard();
    }
    return {clickSlot, getTurn, resetGame};
})();



function update(e) {
    var boardChanged = false;
    if(e.classList.contains("slot")) {
        if(gameEngine.clickSlot(e)){
            boardChanged = true;
        }
        else{
            boardChanged = false;
        }
        if(boardChanged){
            displayBoard();
        }
    }
}

function displayBoard() {
    const parent = document.getElementById("board").children;
    const board = gameBoard.getBoardState();
    for (let i = 0; i < 9; i++) {
        const slot = parent[i];
        const value = board[slot.id];
        if(value != 0){
            slot.innerHTML = value;
        }
        else {
            slot.innerHTML = "";
        }
    }
    const turn_indicator = document.getElementById("turn-indicator");
    const current_turn = gameEngine.getTurn();
    current_turn == 1 ? turn_indicator.innerHTML = "Current turn: X"
    : current_turn == 2 ? turn_indicator.innerHTML = "Current turn: O"
    : turn_indicator.innerHTML = "Current turn:  ";
    
}

function addListeners() {
    const parent = document.getElementById("board").children;
    for (let i = 0; i < 9; i++) {
        const slot = parent[i];
        
        slot.addEventListener('mouseenter', (event) => {
            const value = gameBoard.getBoardState()[slot.id];
            const turn = gameEngine.getTurn();
            (turn == 1 && value == 0) ? (slot.innerHTML = "X", slot.className = "slot hover")
            : (turn == 2 && value == 0) ? (slot.innerHTML = "O", slot.className = "slot hover")
            : null;
        });
        slot.addEventListener('mouseleave', (event) => {
            const value = gameBoard.getBoardState()[slot.id];
            const turn = gameEngine.getTurn();
            (turn == 1 && value == 0) ? (slot.innerHTML = "", slot.className = "slot")
            : (turn == 2 && value == 0) ? (slot.innerHTML = "", slot.className = "slot")
            : null;
        });
        slot.addEventListener('click', (event) => {
            slot.className = "slot";
            update(slot);
        });
    }
    const play_again = document.getElementsByClassName("play-again");
    for (const button of play_again) {
        button.addEventListener('click', (event) => {
            gameEngine.resetGame();
        });
    }
        
    
}

addListeners();
displayBoard();