//basic variables
const gameBoard = document.querySelector('#gameBoard')
const player = document.querySelector('#player')
const info = document.querySelector('#info-display')
const pieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

//eventListeners------------

//functions------------------
function loadGame(){
    pieces.forEach((piece, i) =>{
        //creating colorful squares
        const square = document.createElement('div')

        square.setAttribute('square-id', i)//giving id to the squares
        square.classList.add('square')
        //paint the square
        const row = Math.floor((63-i)/8) + 1//check which row we are in
        if (row%2===0)
            if (i%2===0)
                square.classList.add('square-color')
            else
                square.classList.add('square-sec-color')
        else
            if (i%2===0)
                square.classList.add('square-sec-color')
            else
                square.classList.add('square-color')

        //adding the pieces in to the board
        square.innerHTML = piece
        //change the color
        if (i<16)
            square.firstChild.firstChild.classList.add('black')
        if (i>47)
            square.firstChild.firstChild.classList.add('white')

        //add the squares to the game board
        gameBoard.appendChild(square)
    })
}
loadGame();