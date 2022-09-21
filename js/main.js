'use strict'

const MINE = '*'

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


var gBoard

function onInit() {
    gBoard = builtBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard)
}


function builtBoard() {
    var board = createMat(4, 4)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: true,
                isMine: false,
                isMarked: true
            }
        }
    }
    board[1][2].isMine = true
    board[3][3].isMine = true
    return board
}



function cellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    console.log('Cell clicked:', elCell, i, j)
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



// function createBombs(board) {




// }



function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellClass = getClassName({ i: i, j: j })

            if (currCell.isMine) cellClass += ' bomb'
            strHTML += '<td class="cell ' + cellClass + '" onclick="cellClicked(this,' + i + ',' + j + ')" >'
            if (currCell.isMine)
                strHTML += MINE

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