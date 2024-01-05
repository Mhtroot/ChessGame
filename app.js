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

let draggedElement,reset=0;
const squareArray = []
function dragStart(e){
    startRoot = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
    squareArray.push(draggedElement.parentNode)
    rootFinder(draggedElement)
}

function dragOver(e){
    e.preventDefault();//preventing extra square finding
}

let round=1;
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
            squareArray.push(e.target)
            highlight(squareArray)
            changePlayer()
            round++
            return
        }else if (piece && !opponentPiece){
            info.textContent = 'Can Not Move Here!!'
            setTimeout(()=>{
                info.textContent = ''
            },3000)
            let squareElement = squareArray.pop().classList
            if (squareElement.contains('selected'))
                squareElement.remove('selected')
            else if(squareElement.contains('end'))
                squareElement.remove('end')
            return;
        }else if (valid) {
            e.target.append(draggedElement)
            squareArray.push(e.target)
            highlight(squareArray)
            changePlayer()
            round++
            return;
        }else if (!valid){
            info.textContent = draggedElement.getAttribute('id').toUpperCase() + ' Does Not Move Here!!'
            setTimeout(()=>{
                info.textContent = ''
            },3000)
            let squareElement = squareArray.pop().classList
            if (squareElement.contains('selected'))
                squareElement.remove('selected')
            else if(squareElement.contains('end'))
                squareElement.remove('end')
            return;
        }
    }else {
        info.textContent = 'Move not Valid!!'
        setTimeout(()=>{
            info.textContent = ''
        },3000)
        let squareElement = squareArray.pop().classList
        if (squareElement.contains('selected'))
            squareElement.remove('selected')
        else if(squareElement.contains('end'))
            squareElement.remove('end')
        return;
    }
}

function highlight(array){
    /*console.log(array)*/
    if (array[0].getAttribute('square-id') !== array[1].getAttribute('square-id')) {
        if (round !== 1) {
            if (array[0].classList.contains('selected'))
                array[0].classList.remove('selected')
            else
                array[0].classList.remove('end')

            if (array[1].classList.contains('end'))
                array[1].classList.remove('end')
            else
                array[1].classList.contains('selected')
            array.shift()
            array.shift()
            array[0].classList.add('selected')
            array[1].classList.add('end')
        }

        array[0].classList.add('selected')
        array[1].classList.add('end')

    }else{
        if (array[0].classList.contains('selected'))
            array[0].classList.remove('selected')
        else
            array[0].classList.remove('end')

        if (array[1].classList.contains('end'))
            array[1].classList.remove('end')
        else
            array[1].classList.contains('selected')
    }
    /*console.log(array)*/
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

    switch (piece){
        case 'pawn':
            return pawnMove(startRoot, endRoot)
        case 'knight':
            return knightMove(startRoot,endRoot)
        case 'rook':
            return rookMove(startRoot,endRoot);
        case 'bishop':
            return bishopMove(startRoot,endRoot)
        case 'queen':
            return queenMove(startRoot, endRoot)
        case 'king':
            return kingMove(startRoot, endRoot)
    }
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

function rootFinder(piece){
    console.log(piece)
}