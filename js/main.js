'use strict'

const MINE = '*'
var gBoard
var gTimeInterval
var gStartTimer

var gLevel = {
    SIZE: 4,
    MINES: 2,
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = builtBoard()
    startGame()
    renderBoard(gBoard)
    console.table(gBoard)
    console.log(gBoard)
}


function builtBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    setRandomMines(board)
    setMinesNegsCount(board)
    return board
}

function setRandomMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randJ = getRandomInt(0, gLevel.SIZE)
        var randI = getRandomInt(0, gLevel.SIZE)
        board[randI][randJ].isMine = true
    }
    return board
}

var elTableDiv = document.querySelector('.table')
elTableDiv.addEventListener('contextmenu', (e) => {
    e.preventDefault()

});

function cellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (elCell.classList.contains('marked')) {
        cell.isMarked = false
        elCell.classList.remove('marked')


    }
    else {
        cell.isMarked = true
        elCell.innerText = '🏴‍☠️'
        elCell.classList.add('marked')

    }

}

function cellClicked(elCell, i, j) {

    if (elCell.classList.contains('marked')) {
        return
    }
    elCell.classList.add('cell-chosen')
    const cell = gBoard[i][j]
    cell.isShown = true
    cell.isMarked = false
    gGame.isOn = true
    gGame.shownCount++

    if (gGame.shownCount === 1 && !cell.isMine) {
        startTimer()
    }

    if (cell.isMine) {
        gGame.isOn = false
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'red'
        revealMines(gBoard)
        if (!gGame.isOn) {
            stopTimer()

        }
    }
    else {
        if (gGame.isShown === 1) {
            startTimer()
        }
        if (cell.minesAroundCount > 0 && !cell.isMine) {
            elCell.innerHTML = cell.minesAroundCount

        }

    }

}

function startGame() {
    document.querySelector('.mines-count').innerText = gLevel.MINES

}



function revealMines(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) {
                console.log(currCell.isShown)
            }
        }
    }
}

function countMinesAround(board, rowIdx, colIdx) {
    var MineCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) MineCount++

        }

    }
    return MineCount
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var negsCount = countMinesAround(board, i, j)
            currCell.minesAroundCount = negsCount
        }
    }
}





function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellClass = getClassName({ i: i, j: j })
            if (currCell.isMine) cellClass += ' mine'
            strHTML += '<td class="cell ' + cellClass + ' + " onclick="cellClicked(this,' + i + ',' + j + ')" oncontextmenu="cellMarked(this,' + i + ',' + j + ')" >'
            if (currCell.isShown) {
                if (currCell.isMine)
                    strHTML += MINE
                else {
                    strHTML += currCell.minesAroundCount
                }
            }

        }
        '</td>'
    }
    `</tr>`
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function startTimer() {
    gStartTimer = Date.now()
    gTimeInterval = setInterval(updateTime, 1000)
}


function updateTime() {
    gGame.secsPassed = Date.now() - gStartTimer
    var inSeconds = (gGame.secsPassed / 1000).toFixed(0)
    document.querySelector('.timer').innerText = inSeconds
}

function stopTimer() {
    clearInterval(gTimeInterval)
}