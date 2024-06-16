// version: v0.0.1

let square = null;
let area = null;
let concaveCount = 0;
let ONE_MINIUTE = 60;
let timerId; // 타이머 ID를 저장할 변수
let temp = null;
let blackArray = [];
let whiteArray = [];
let NUM_OMOK = 5;
let winFlag = false;
document.addEventListener('DOMContentLoaded', () => {
    let board = document.querySelector(".board");

    let timerImgContainer = document.createElement("div");
    timerImgContainer.classList.add("timerImgContainer");
    board.appendChild(timerImgContainer);

    // 초기 타이머 설정
    startTimer(board);

    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
            square = document.createElement("li");
            square.setAttribute("class", "square");
            square.setAttribute("rows", (i + 1));
            square.setAttribute("columns", (j + 1));
            board.appendChild(square);

            area = document.createElement("div");
            area.setAttribute("class", "area");
            area.setAttribute("rows", (i + 1));
            area.setAttribute("columns", (j + 1));
            square.appendChild(area);

            putConcave(area);
        }
    }
});


function startTimer() {
    let board = document.querySelector(".board");
    let timerImgContainer = document.querySelector(".timerImgContainer");

    // 기존 타이머 중지
    if (timerId) {
        let originTimer = document.querySelector(".timer");
        let originTimerImg = document.querySelector(".timerImg");
        timerImgContainer.removeChild(originTimerImg);
        board.removeChild(originTimer);
        clearInterval(timerId);
    }
    // 새로운 타이머 설정
    let newTimer = document.createElement("div");
    let newTimerImg = document.createElement("img");
    newTimerImg.classList.add("timerImg");
    newTimerImg.src = './timer.svg';
    let remainSeconds = ONE_MINIUTE

    timerId = setInterval(() => {
        newTimer.innerHTML = remainSeconds;
        if (remainSeconds < 20 && remainSeconds > 10) {
            newTimerImg.setAttribute("class", "shake");
        }
        if (remainSeconds < 10 && remainSeconds > 1) {
            newTimerImg.removeAttribute("shake");
            newTimerImg.setAttribute("class", "hard-shake");
        }
        if (remainSeconds < 1) {
            remainSeconds = ONE_MINIUTE;
        }
        remainSeconds--;
    }, 1000);
    newTimer.setAttribute("class", "timer");

    timerImgContainer.appendChild(newTimerImg);
    board.appendChild(newTimer);
}

function putConcave(area) {
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
                blackArray.push({row: rows, column: columns });
            } else {
                e.target.classList.add("whiteStone");
                whiteArray.push({row: rows, columns: columns });
            }
            concaveCount++;

            // TODO: 승리했는지 체크
            console.log("윈 : "+winFlag);
            if (winFlag) {
                return;
            }

            checkWin();
            startTimer();
            e.target.classList.add("latestPut");
            temp = e.target;
        }
    });
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
        if (!acc[stone.row]) {
            acc[stone.row] = [];
        }
        acc[stone.row].push(parseInt(stone.columns));
        return acc;
    }, {});

    // console.log(groupedByRow);

    // groupedByRow.forEach((value) => {
    //     console.log(value);
    // })
    for (let row in groupedByRow) {
        
        console.log("로우 : "+row);
        let columns = groupedByRow[row];
        console.log(columns);
        let sum = 0;
        for (let i= 1; i < columns.length; i++) {
            console.log(columns[i]);
            if (columns[i] === columns[i-1] + 1) {
                sum+=1;
                if (sum === (NUM_OMOK - 1)) {
                    winFlag = true;
                    alert("승리");

                    return;
                }
            }
        }
        console.log(sum);
    }
    console.log("--------------");

    /* whiteArray.sort((a, b) => {
        return parseInt(a.row) - parseInt(b.row);
    });
    console.log(whiteArray);
    // 가로체크
    for (let coordinate of whiteArray) {
        let rows = coordinate.row;
        console.log(rows);
        let consecutiveCount = 1;
        for (let i = 1; i < rows.length; i++) {
            console.log(rows[i]);
        }
    }   */
}