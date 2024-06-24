// version: v0.0.3


// let area = null;
let concaveCount = 0;
let ONE_MINIUTE = 60;
let timerId = null; // 타이머 ID를 저장할 변수
let temp = null;
let blackArray = [];
let whiteArray = [];
const NUM_OMOK = 5;
let winFlag = false;

document.addEventListener('DOMContentLoaded', () => {
    startGame();
});

class OmokGame {
    constructor(boardSelector) {
        this.boardSize = 19;
        this.board = document.querySelector(boardSelector);
        this.timer = new Timer(this.board);
        this.createBoard();
    }
    clear() {
        this.square = null;
        this.area = null;
    }

    createBoard() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const square = this.createSquare(i, j);
                this.board.appendChild(square);
            }
        }
    }

    createSquare(i, j) {
        const square = document.createElement("li");
        square.setAttribute("class", "square");
        square.setAttribute("rows", (i + 1));
        square.setAttribute("columns", (j + 1));

        const area = document.createElement("div");
        area.setAttribute("class", "area");
        area.setAttribute("rows", (i + 1));
        area.setAttribute("columns", (j + 1));
        
        square.appendChild(area);
        this.putConcave(area);

        return square;
    }

    putConcave(area) {
        area.addEventListener("mousedown", (e) => {
            let impossible = checkAlreadyPutConcave(e);
            if (temp && impossible) {
                temp.classList.remove("latestPut");
            }
            if (impossible) {
                let rows = e.target.getAttribute("rows");
                let columns = e.target.getAttribute("columns");
                if (concaveCount % 2 === 0) {
                    e.target.classList.add("blackStone");
                    blackArray.push({rows: rows, columns: columns });
                } else {
                    e.target.classList.add("whiteStone");
                    whiteArray.push({rows: parseInt(rows), columns: parseInt(columns) });
                }
                concaveCount++;
    
                // TODO: 승리했는지 체크
                if (winFlag) {
                    return;
                }
    
                checkWin();
                // checkVertical();
                // diagonalCheck();
                // clearInterval();
                checkOmok(columns);
                checkOmok(rows);
                startTimer();
                e.target.classList.add("latestPut");
                temp = e.target;
            }
        });
    }
}

class Timer {
    constructor(parentElement) {
        console.log(parentElement);
        this.timerImgContainer = this.createTimerImgContainer();
        this.newTimer = this.createNewTimer();
        parentElement.appendChild(this.timerImgContainer);
        parentElement.appendChild(this.newTimer);
    }

    createTimerImgContainer() {
        const container = document.createElement("div");
        container.classList.add("timerImgContainer");
        return container;
    }
    
    createNewTimer() {
        const newTimer = document.createElement("div");
        newTimer.classList.add("timer");
        return newTimer;
    }
}

function startGame() {
    let omok = new OmokGame('.board');
    // omok.makeConcavePlate();
    // 초기 타이머 설정
    startTimer();
}

function startTimer() {
    if (timerId) {
        // 기존 타이머 중지
        console.log(timerId);
        clearInterval(timerId);
        document.querySelector(".timerImg").remove();
    }
    let timerImgContainer = document.querySelector(".timerImgContainer");
    let newTimerImg = document.createElement("img");
    newTimerImg.classList.add("timerImg");
    newTimerImg.src = './timer.svg';

    timerImgContainer.appendChild(newTimerImg);
    let remainSeconds = ONE_MINIUTE
    let timerDisplay = document.querySelector('.timer');
    timerId = setInterval(() => {
        timerDisplay.innerHTML = remainSeconds;
        
        if (remainSeconds < 20 && remainSeconds > 10) {
            newTimerImg.classList.add("shake");
        } else if (remainSeconds < 10 && remainSeconds > 1) {
            newTimerImg.classList.remove("shake");
            newTimerImg.classList.add("hard-shake");
            // newTimerImg.setAttribute("class", "hard-shake");
        } else if (remainSeconds < 0.1) {
            remainSeconds = ONE_MINIUTE;
            alert("시간 초과");
        }
        remainSeconds--;
    }, 1000);
}



function checkAlreadyPutConcave(e) {
    if (e.target.classList.contains('blackStone') || e.target.classList.contains('whiteStone')) {
        alert("놓을 수 없습니다.");
        return false;
    } else {
        return true;
    }
}

function checkWin(e) {
    // 바둑알을 row별로 분류하는 로직
    let groupedByRow = whiteArray.reduce((acc, stone) => {
        if (!acc[stone.rows]) {
            acc[stone.rows] = [];
        }
        acc[stone.rows].push(parseInt(stone.columns));
        return acc;
    }, {});

    for (let row in groupedByRow) {
        let columns = groupedByRow[row];
        columns.sort((a, b) => a - b);

        let sum = 1;
        for (let i=1; i < columns.length; i++) {
            if (columns[i] === (columns[i-1] + 1)) {
                sum += 1;
            } else {
                sum = 1;
            }
        }
        if (sum === NUM_OMOK) {
            winFlag = true;
            alert("승리");
            console.log("다시시작");
            let omok = new OmokGame();
            // omok.makeConcavePlate();
            omok.clear();
            // omok.clear();
            // startGame();
            // return;
        }
    }

    // 대각선 체크
    for (let stone of whiteArray) {
        const row = stone.rows;
        const col = stone.columns;
        if (checkDiagonalWin(row, col)) {
            winFlag = true;
            alert('승리');
            return;
        }
    }
}

function checkVertical(e) {
    let groupedByColumn = whiteArray.reduce((acc, stone) => {
        if (!acc[stone.columns]) {
            acc[stone.columns] = [];
        }
        acc[stone.columns].push(parseInt(stone.rows));
        return acc;
    }, {});

    for (let columns in groupedByColumn) {
        console.log("무엇?");
        console.log(columns);

        let rows = groupedByColumn[columns];
        rows.sort((a, b) => a - b);
        let sum = 1;
        for (let i=1; i < rows.length; i++) {
            if (rows[i] === rows[i-1] + 1) {
                sum+=1;
            }
        }
        if (sum === NUM_OMOK) {
            winFlag = true;
            alert("승리");
            return;
        }
    }
}

function checkOmok(color) {
    const hasConsecutiveNumbers = (numbers) => {
        numbers.sort((a, b) => a - b);
        let count = 1;
        for( let i=1; i < numbers.length; i++) {
            if (numbers[i] === numbers[i-1] + 1) {
                count += 1;
            } else {
                count = 1;
            }
        }
        return false;
    };

    // 가로와 세로 방향을 체크하는 함수
    const checkDirection = (getDirection, getReverseDirection) => {
        let grouped = color.reduce((acc, stone) => {
            let key = getDirection(stone);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(parseInt(getReverseDirection(stone)));
            return acc;
        }, {});

        for (let key in grouped) {
            if (hasConsecutiveNumbers(grouped[key])) {
                return true;
            }
        }
        return false;
    }

    if(checkDirection(stone => stone.rows, stone => stone.columns) || checkDirection(stone => stone.columns, stone => stone.rows)) {
        alert("승리");
        let omok = new OmokGame();
        return true;
    }
}

function checkDiagonalWin(row, col) {
    return checkDiagnol(row, col, 1, 1) || checkDiagnol(row, col, 1, -1);
}


function checkDiagnol(startRow, startCol, rowDir, colDir) {
    let player = whiteArray.find(stone => stone.rows === startRow && stone.columns === startCol);
    if (!player) return false;

    let count = 0;

    // 대각선 체크
    for (let i = -NUM_OMOK + 1; i < NUM_OMOK; i++) {
        const row = parseInt(startRow) + (i * rowDir);
        const col = parseInt(startCol) + (i * colDir);
        if (whiteArray.find(stone => stone.rows === row && stone.columns === col)) {
            count++;
            if (count === NUM_OMOK) {
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}