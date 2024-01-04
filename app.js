//basic variables
const gameBoard = document.querySelector('#gameBoard')
const player = document.querySelector('#player')
player.textContent = 'white'
let playerTurn = 'white'
const info = document.querySelector('#info-display')
const width = 8
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
squares.forEach(square=>{//for each square it`s gonna listen to an event
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})


//functions------------------
function loadGame(){
    pieces.forEach((piece, i) =>{
        //creating colorful squares
        const square = document.createElement('div')

        square.setAttribute('square-id', (width*width -1)-i)//giving id to the squares
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
function dragDrop(e){
    e.stopPropagation()
    let piece = e.target.classList.contains('piece') //the picked element is a piece
        color = draggedElement.firstChild.classList.contains(playerTurn)//check if the color matches the player turn
        opponent = playerTurn==='white'? 'black':'white'  //finding the opponent
        opponentPiece = e.target.firstChild?.classList.contains(opponent)//piece is from the opponent
        valid = isValid(e.target)
    if (color){
        if (opponentPiece && valid) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
            return
        }else if (piece && !opponentPiece){
            info.textContent = 'Can Not Move Here!!'
            setTimeout(()=>{
                info.textContent = ''
            },3000)
        }else if (valid) {
            e.target.append(draggedElement)
            changePlayer()
            return;
        }
    }else {
        info.textContent = 'Move not Valid!!'
        setTimeout(()=>{
            info.textContent = ''
        },3000)
    }
}

function changePlayer(){
    if (player.textContent === 'white'){
        revertIds()
        player.textContent = 'black'
        playerTurn = 'black'
    }else{
        reverseIds()
        player.textContent = 'white'
        playerTurn = 'white'
    }
}

function isValid(target){
    const piece = draggedElement.getAttribute('id')
        endRoot = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
        startRoot = Number(startRoot)
}

//changing the chess table
function reverseIds(){
    squares.forEach((square, i)=>{
        square.setAttribute('square-id', (width*width -1)-i)
    })
}

function revertIds(){
    squares.forEach((square, i)=>{
        square.setAttribute('square-id', i)
    })
}