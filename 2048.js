var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("board").innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    
    setTwo();
    setTwo();
}

function restartGame() {
    if (confirm("Are you sure you want to restart?")) {
        setGame();
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; 
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowUp" || e.code == "ArrowDown") {
        // Create a deep copy of the board before the move
        const boardBefore = JSON.parse(JSON.stringify(board));

        if (e.code == "ArrowLeft") slideLeft();
        else if (e.code == "ArrowRight") slideRight();
        else if (e.code == "ArrowUp") slideUp();
        else if (e.code == "ArrowDown") slideDown();

        // Check if the board has changed before adding a new tile
        if (JSON.stringify(board) !== JSON.stringify(boardBefore)) {
            setTwo();
            // Find merged tiles and animate them
            findMergesAndAnimate(boardBefore);
        }
    }
    document.getElementById("score").innerText = score;
});

function findMergesAndAnimate(boardBefore) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const oldVal = boardBefore[r][c];
            const newVal = board[r][c];
            // A merge happened if a tile's value increased at a location that wasn't empty
            if (newVal > 0 && oldVal > 0 && newVal > oldVal) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.classList.add("tile-merged");
                tile.addEventListener('animationend', () => {
                    tile.classList.remove("tile-merged");
                }, { once: true });
            }
        }
    }
}

function filterZero(row){
    return row.filter(num => num != 0); 
}

// Simplified, robust slide function
function slide(row) {
    row = filterZero(row); 
    for (let i = 0; i < row.length - 1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        board[r] = slide(row);
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 2);
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}