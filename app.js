//basic variables
const gameBoard = document.querySelector('#gameBoard')
const player = document.querySelector('#player')
player.textContent = 'white'
let playerTurn = 'white'
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
//getting start root or end root of pieces
let startRoot, endRoot;
let squares;
loadGame();
//eventListeners------------

//drag and drop functionality
squares.forEach(square=>{//for each square its gonna listen to an event
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drag', dragDrop)
})


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

        square.firstChild?.setAttribute('draggable', true)//making it draggable
        //add the squares to the game board
        gameBoard.appendChild(square)
    })
    squares = document.querySelectorAll('#gameBoard .square')//getting the squares for event listening
}

let draggedElement;
function dragStart(e){
    startRoot = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}
function dragOver(e){
    e.preventDefault();//preventing extra square finding
}
/*function dragDrop(e){
    e.stopPropagation()
    if (e.target.classList.contains('piece')){
        e.target.parentNode.append(draggedElement)
        e.target.remove()
    }else
        e.target.append(draggedElement)
    changePlayer()
}*/

function changePlayer(){
    if (player.textContent === 'white'){
        player.textContent = 'black'
        playerTurn = 'black'
    }else{
        player.textContent = 'white'
        playerTurn = 'white'
    }
}