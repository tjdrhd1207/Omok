
let square = null;
let area = null;
let concaveCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    let board = document.querySelector(".board");
    for ( let i = 0; i < 19; i++) {
        for ( let j = 0; j < 19; j++) {
            square = document.createElement("li");
            square.setAttribute("class", "square");
            square.setAttribute("rows", (i+1));
            square.setAttribute("columns", (j+1));
            board.appendChild(square);

            area = document.createElement("div");
            area.setAttribute("class", "area");
            area.setAttribute("rows", (i+1));
            area.setAttribute("columns", (j+1));
            square.appendChild(area);

            area.addEventListener("mousedown", (e) => {
                if (concaveCount % 2 === 0) {
                    e.target.classList.add("blackStone");
                    concaveCount++;
                } else {
                    e.target.classList.add("whiteStone");
                    concaveCount++;
                }
                console.log(concaveCount);
            });
        }
    }
});


    // 오목알을 놓을 때,
// function placeConcave() {
//     console.log(concaveCount);
//     // 매번 놓을 때마다 카운터를 추가
//     // 각 카운터 홀수와 짝수일 때 흑 백이 놓여짐
//     if((concaveCount % 2) === 0) {
//         area.addEventListener("mousedown", (e) => {
            
//             concaveCount++;
//             // console.log(concaveCount);
//         });
//     } else {
//         area.addEventListener("mousedown", (e) => {
//             e.target.classList.add("whiteStone");
//             concaveCount++;
//         });
//     }

// }

