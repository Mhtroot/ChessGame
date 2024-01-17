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

let moves = []
/*const pieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    rook, knight, bishop, queen, king, bishop, knight, rook
]*/
//getting start root or end root of pieces
let startX, startY, endX, endY;
let squares;
let timerWhite=30, timerBlack = 30, isWhitePaused = false, isBlackPaused = false, timer;
loadGame();
//eventListeners------------

//drag and drop functionality
squares.forEach(square=>{//for each square it`s gonna listen to an event
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})


//functions------------------

//timer function
function whiteTimer(){
    if (timerWhite <= 0) {
        stopTimer()
        document.querySelector('#info-display').textContent = 'BLACK WINS!'
        return
    }
    timer = setTimeout(()=> {
            if (!isWhitePaused) {
                whiteTimer()
                showTimer(true, timerWhite)
                timerWhite--
            }
        }
        ,1000)
}

function blackTimer(){
    if (timerBlack <= 0) {
        stopTimer()
        document.querySelector('#info-display').textContent = 'WHITE WINS!'
        return
    }
    timer = setTimeout(()=> {
            if (!isBlackPaused) {
                blackTimer()
                showTimer(false, timerBlack)
                timerBlack--
            }
        }
        ,1000)
}

function stopTimer(){
    document.querySelector('#white-number').textContent = '0'
    document.querySelector('#black-number').textContent = '0'
    setInterval(()=>
            location.reload()
        ,5000)
}

function pauseWhiteTimer(){
    isWhitePaused = true
}

function pauseBlackTimer(){
    isBlackPaused = true
}

function resumeWhiteTimer(){
    isWhitePaused = false
}

function resumeBlackTimer(){
    isBlackPaused = false
}

//---

function loadGame(){
    whiteTimer()
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
      /*if (i<8)
            square.firstChild.firstChild.classList.add('black')
        if (i>55)
            square.firstChild.firstChild.classList.add('white')*/

        square.firstChild?.setAttribute('draggable', true)//making it draggable
        //add the squares to the game board
        gameBoard.appendChild(square)
    })
    squares = document.querySelectorAll('#gameBoard .square')//getting the squares for event listening

    //creating x/y position for squares
    let x=8,y=8;
    squares.forEach((square,i)=>{
        if ((i+1)%8===0){
            square.setAttribute('pos-y',y)
            y--
            square.setAttribute('pos-x',x)
            x=8
        }else{
            square.setAttribute('pos-y',y)
            square.setAttribute('pos-x',x)
            x--
        }
    })
}

let draggedElement;
const squareArray = []

function dragStart(e){
    //gets start x/y pos
    startX = e.target.parentNode.getAttribute('pos-x')
    startY = e.target.parentNode.getAttribute('pos-y')

    //save the element in an array for highlights
    draggedElement = e.target
    squareArray.push(draggedElement.parentNode)

    //find the possible ways
    if (draggedElement.firstChild.classList.contains(playerTurn))//check if the color matches the player turn
        rootFinder(draggedElement)
}

function dragOver(e){
    e.preventDefault();//preventing extra square finding
}

let round=1;
function dragDrop(e){
    e.stopPropagation()

    //create move records
    let x = Number(startX),
        y = Number(startY),
        tx = Number(e.target.getAttribute('pos-x')),
        ty = Number(e.target.getAttribute('pos-y')),
        p = draggedElement.getAttribute('id')
    let move = new Move(x,y,tx,ty,p,playerTurn)


    let piece = e.target.classList.contains('piece') //check if the picked element is a piece
    let color = draggedElement.firstChild.classList.contains(playerTurn)//check if the color matches the player turn

    let opponent = playerTurn==='white'? 'black':'white'  //finding the opponent
    let opponentPiece = e.target.firstChild?.classList.contains(opponent)//check if the piece is from the opponent

    let valid = isValid(e.target) //check if the move is correct

    if (color){//checks if the player chooses the correct pieces and colors

        //check if the movement is correct and the target is the opponent
        if (opponentPiece && valid) {
            //removes the opponent
            e.target.parentNode.append(draggedElement)

            //the beaten piece will go to the column that is for the opponent
            printBeatList(e.target)

            e.target.remove()

            //add to array for highlighting
            squareArray.push(e.target)
            highlight(squareArray)

            //move added
            moves.push(move)

            changePlayer()
            removeRootFinder()//resets the root finder and color
            round++

        }else if (piece && !opponentPiece){
            //checks if the piece is hitting the teammate
            info.textContent = 'Can Not Move Here!!'
            setTimeout(()=>{
                info.textContent = ''
            },3000)

            //deleting the color and the element that was saved in Stack[array]
            while (squareArray.length!==2) {
                let squareElement = squareArray.pop()
                if (squareElement)
                    break
                else {
                    if (squareElement.classList.contains('selected'))
                        squareElement.classList.remove('selected')
                    else if (squareElement.classList.contains('end'))
                        squareElement.classList.remove('end')
                }
            }

            removeRootFinder()

        }else if (valid) {
            //if the move was fine

            //enPassant move
            if (enPassant){
                e.target.append(draggedElement)//place the piece

                printBeatList(document.querySelector(`[pos-x = '${tx}'][pos-y = '${ty-1}']`).firstChild)

                document.querySelector(`[pos-x = '${tx}'][pos-y = '${ty-1}']`).firstChild.remove()

                moves.push(move)
                changePlayer()
                enPassant = false
            }else if (castling){//castling move
                e.target.append(draggedElement)//place the piece

                moves.push(move)

                if (playerTurn === 'white'){
                    if (tx>x){
                        let selectedRook = document.querySelector(`[pos-x = '${8}'][pos-y = '${1}']`).firstChild

                        document.querySelector(`[pos-x = '${5}'][pos-y = '${1}']`).appendChild(selectedRook)
                        moves.push(new Move(8,1,5,1,'rook','white'))
                    }else {
                        let selectedRook = document.querySelector(`[pos-x = '${1}'][pos-y = '${1}']`).firstChild

                        document.querySelector(`[pos-x = '${3}'][pos-y = '${1}']`).appendChild(selectedRook)
                        moves.push(new Move(1,1,3,1,'rook','white'))
                    }
                }else{
                    if (tx>x){
                        let selectedRook = document.querySelector(`[pos-x = '${8}'][pos-y = '${1}']`).firstChild

                        document.querySelector(`[pos-x = '${6}'][pos-y = '${1}']`).appendChild(selectedRook)
                        moves.push(new Move(8,1,6,1,'rook','white'))
                    }else {
                        let selectedRook = document.querySelector(`[pos-x = '${1}'][pos-y = '${1}']`).firstChild

                        document.querySelector(`[pos-x = '${4}'][pos-y = '${1}']`).appendChild(selectedRook)
                        moves.push(new Move(1,1,4,1,'rook','white'))
                    }
                }

                changePlayer()
                castling=false
            }else {
                e.target.append(draggedElement)

                moves.push(move)
                changePlayer()
            }



            //add to stack for highlighting
            squareArray.push(e.target)
            highlight(squareArray)

            removeRootFinder()
            round++

        }else if (!valid){
            info.textContent = draggedElement.getAttribute('id').toUpperCase() + ' Does Not Move Here!!'
            setTimeout(()=>{
                info.textContent = ''
            },3000)

            //deleting the color and the element that was saved in Stack[array]
            while (squareArray.length!==2) {
                let squareElement = squareArray.pop()
                if (squareElement)
                    break
                else {
                    if (squareElement.classList.contains('selected'))
                        squareElement.classList.remove('selected')
                    else if (squareElement.classList.contains('end'))
                        squareElement.classList.remove('end')
                }
            }

            removeRootFinder()

        }
    }else {
        //choosing the wrong color when it's not your turn
        info.textContent = 'IT IS NOT YOUR TURN, ' + opponent.toUpperCase()
        setTimeout(()=>{
            info.textContent = ''
        },3000)

        //deleting the color and the element that was saved in Stack[array]
        while (squareArray.length!==2) {
            let squareElement = squareArray.pop()
            if (squareElement)
                break
            else {
                if (squareElement.classList.contains('selected'))
                    squareElement.classList.remove('selected')
                else if (squareElement.classList.contains('end'))
                    squareElement.classList.remove('end')
            }
        }

        removeRootFinder()
    }
    /*dataWrite()*/
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
//---------
function changePlayer(){
    if (player.textContent === 'white'){
        revertIds()
        player.textContent = 'black'
        playerTurn = 'black'
        pauseWhiteTimer()
        resumeBlackTimer()
        blackTimer()
    }else{
        reverseIds()
        player.textContent = 'white'
        playerTurn = 'white'
        pauseBlackTimer()
        resumeWhiteTimer()
        whiteTimer()
    }
}

function showTimer(isWhite, targetTimer){
    let number;
    if (isWhite){
        number = document.querySelector('#white-number')
        if (targetTimer>20)
            number.style.backgroundColor = '#529348'
        if (targetTimer<20 && targetTimer>9)
            number.style.backgroundColor = '#919348'
        if (targetTimer<=9)
            number.style.backgroundColor = '#934853'

        number.textContent =targetTimer
    }else{
        number = document.querySelector('#black-number')
        if (targetTimer>20)
            number.style.backgroundColor = '#529348'
        if (targetTimer<20 && targetTimer>9)
            number.style.backgroundColor = '#919348'
        if (targetTimer<=9)
            number.style.backgroundColor = '#934853'

        number.textContent =targetTimer
    }
}
//---
function isValid(target){
    const piece = draggedElement.getAttribute('id') ;

    endX= Number(target.getAttribute('pos-x')) || Number(target.parentNode.getAttribute('pos-x'))
    endY= Number(target.getAttribute('pos-y')) || Number(target.parentNode.getAttribute('pos-y'))
    startX = Number(startX)
    startY = Number(startY)

    switch (piece){
        case 'pawn':
            return pawnMove(startX,startY,endX,endY)
        case 'knight':
            return knightMove(startX,startY,endX,endY)
        case 'rook':
            return rookMove(startX,startY,endX,endY);
        case 'bishop':
            return bishopMove(startX,startY,endX,endY)
        case 'queen':
            return queenMove(startX,startY,endX,endY)
        case 'king':
            return kingMove(startX, startY, endX, endY)
    }
}

//flipping the chess table
function reverseIds(){
    let x=8,y=8
    squares.forEach((square, i)=>{
        square.setAttribute('square-id', (width*width -1)-i)

        if ((i+1)%8===0){
            square.setAttribute('pos-y',y)
            y--
            square.setAttribute('pos-x',x)
            x=8
        }else{
            square.setAttribute('pos-y',y)
            square.setAttribute('pos-x',x)
            x--
        }
    })
}

function revertIds(){
    let x=1,y=1;
    squares.forEach((square, i)=>{
        square.setAttribute('square-id', i)
        if ((i+1)%8===0){
            square.setAttribute('pos-y',y)
            y++
            square.setAttribute('pos-x',x)
            x=1
        }else{
            square.setAttribute('pos-y',y)
            square.setAttribute('pos-x',x)
            x++
        }
    })
}

function rootFinder(piece){
    //get color piece
    let pieceColor = piece.firstChild.getAttribute('class'),
        startx = Number(startX),
        starty = Number(startY)

    squares.forEach(square=>{
        //get pos-x/y for every square
        let endx = Number(square.getAttribute('pos-x')),
            endy= Number(square.getAttribute('pos-y'))

        let squareColor;
        if (square.firstChild)//gets the piece's color if exist
            squareColor = square.firstChild.firstChild.getAttribute('class')

        switch (piece.getAttribute('id')) {
            case 'pawn':
                if (pawnMove(startx, starty, endx, endy) && squareColor===pieceColor) {
                    square.style.backgroundColor = '#934853'
                }
                else if (pawnMove(startx, starty, endx, endy) && squareColor!==pieceColor) {
                    square.style.backgroundColor = 'rgba(213,250,118,0.4)'
                }
                break
            case 'knight':
                if (knightMove(startx, starty, endx, endy) && squareColor===pieceColor)
                    square.style.backgroundColor = '#934853'
                else if (knightMove(startx, starty, endx, endy) && squareColor!==pieceColor)
                    square.style.backgroundColor = 'rgba(252,250,155,0.69)'
                break
            case 'rook':
                if (rookMove(startx, starty, endx, endy) && squareColor===pieceColor)
                    square.style.backgroundColor = '#934853'
                else if (rookMove(startx, starty, endx, endy) && squareColor!==pieceColor)
                    square.style.backgroundColor = 'rgba(112,162,94,0.69)'
                break
            case 'bishop':
                if (bishopMove(startx, starty, endx, endy) && squareColor===pieceColor)
                    square.style.backgroundColor = '#934853'
                else if (bishopMove(startx, starty, endx, endy) && squareColor!==pieceColor)
                    square.style.backgroundColor = 'rgba(134,133,45,0.69)'
                break
            case 'queen':
                if (queenMove(startx, starty, endx, endy) && squareColor===pieceColor)
                    square.style.backgroundColor = '#934853'
                else if (queenMove(startx, starty, endx, endy) && squareColor!==pieceColor)
                    square.style.backgroundColor = 'rgba(130,215,42,0.44)'
                break
            case 'king':
                if (kingMove(startx, starty, endx, endy) && squareColor===pieceColor)
                    square.style.backgroundColor = '#934853'
                else if (kingMove(startx, starty, endx, endy) && squareColor!==pieceColor)
                    square.style.backgroundColor = 'rgba(133,208,74,0.56)'
                break
        }
    })
}

function removeRootFinder(){
    squares.forEach(square=>{
        if (square.style.backgroundColor!=='')
            square.style.backgroundColor=''
    })
}
