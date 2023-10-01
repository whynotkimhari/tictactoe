const X = 'X',
    O = 'O',
    EMPTY = undefined,

    drawAudio = new Audio('mp3/draw.mp3'),
    victoryAudio = new Audio('mp3/win.mp3'),
    loseAudio = new Audio('mp3/lose.mp3'),

    cells = document.querySelectorAll('.cell');

let user,
    aiTurn = false,
    board = initialState(),
    isGameOver = terminal(board),
    ai,

    notifier = document.querySelector('#notifier');

userChoosing();

cells.forEach(cell => {
    cell.addEventListener('click', async () => {
        if (!aiTurn && !cell.innerHTML && !isGameOver) {
            cell.innerHTML = user;
            let pos = convertTo2D(cell.id[1]);
            board = result(board, pos);
            aiTurn = true;

            isGameOver = terminal(board);
            // console.log(isGameOver)

            if (isGameOver) handlerWinningPlayer();
            else await AIMoves();
        }
    })

})

// handler winning player
function handlerWinningPlayer() {
    if (isGameOver) {
        let winningPlayer = winner(board);
        if (typeof winningPlayer === 'undefined') {
            playSound(drawAudio);
            popUp(`That\'s a good try! 
            Cuz you can\'t defeat me bae!`);
        }
        else if (winningPlayer === user) {
            console.log(winningPlayer, user)
            playSound(victoryAudio);
            popUp('You win! Congratulations!');
        }
        else {
            playSound(loseAudio);
            popUp('Keep trying, you can\'t defeat me!');
        }
    }
}

// chose X or O
async function userChoosing() {
    await Swal.fire({
        icon: 'question',
        title: 'Choose your type of playing',
        showCancelButton: true,
        cancelButtonText: 'Play with AI',
        confirmButtonText: 'Play with friend'
    })
        .then(result => {
            if (result.isConfirmed) {
                location.href = 'html/vsP.html'
            }
        })

    notifier.innerHTML = 'Playing with AI...'

    Swal.fire({
        icon: 'question',
        title: 'Choose X or O for your play',
        showCancelButton: true,
        cancelButtonText: 'Play as O',
        confirmButtonText: 'Play as X'
    })
        .then(result => {
            if (result.isConfirmed) {
                user = X;
                ai = O;
            }
            else {
                user = O;
                ai = X;
                aiTurn = true;
                AIMoves();
            }
        })
}

// playsound
function playSound(mp3) {
    mp3.pause();
    mp3.currentTime = 0;
    mp3.play();
}

// pop-up
function popUp(title) {
    Swal.fire({
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        title: title,
        width: 600,
        padding: '3em',
        color: 'black',
        showCancelButton: true,
        confirmButtonText: 'Continue'
    })
        .then(res => {
            if (res.isConfirmed) location.reload();
        })
}

async function AIMoves() {
    var move = minimax(board)
    board = result(board, move)

    let id = convertTo1D(move);
    document.querySelector(`#c${id}`).innerHTML = ai;

    isGameOver = terminal(board);

    if (isGameOver) handlerWinningPlayer();
    else aiTurn = false;
}


/// Function to convert 1D id to 2D id
function convertTo2D(id) {
    let pos = [0, 0];
    pos[0] = Math.floor(id / 3);
    pos[1] = id % 3;

    return pos;
}

function convertTo1D(pos) {
    return pos[0] * 3 + pos[1];
}

/// LOGIC GAME
function deepCopy(src) {
    let temp = initialState();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            temp[i][j] = src[i][j];
        }
    }
    return temp;
}

function initialState() {
    return [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ]
}

function player(board) {
    let checkEmpty = 0,
        checkX = 0,
        checkO = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == EMPTY) checkEmpty++;
            else if (board[i][j] == X) checkX++;
            else checkO++;
        }
    }

    if (checkEmpty == 9) return X;
    else {
        if (checkX > checkO) return O;
        else return X;
    }
}

function actions(board) {
    let actions = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == EMPTY) {
                actions.push([i, j]);
            }
        }
    }

    return actions;
}

function result(board, action) {
    let tempBoard = deepCopy(board);

    if (tempBoard[action[0]][action[1]] == EMPTY) {
        tempBoard[action[0]][action[1]] = player(tempBoard);
    }

    return tempBoard;
}

function winner(board) {
    if ((board[0][0] == board[0][1] && board[0][1] == board[0][2] && board[0][2] == X) ||
        (board[1][0] == board[1][1] && board[1][1] == board[1][2] && board[1][2] == X) ||
        (board[2][0] == board[2][1] && board[2][1] == board[2][2] && board[2][2] == X) ||
        (board[0][0] == board[1][0] && board[1][0] == board[2][0] && board[2][0] == X) ||
        (board[0][1] == board[1][1] && board[1][1] == board[2][1] && board[2][1] == X) ||
        (board[0][2] == board[1][2] && board[1][2] == board[2][2] && board[2][2] == X) ||
        (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[2][2] == X) ||
        (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[2][0] == X))
        return X
    else if ((board[0][0] == board[0][1] && board[0][1] == board[0][2] && board[0][2] == O) ||
        (board[1][0] == board[1][1] && board[1][1] == board[1][2] && board[1][2] == O) ||
        (board[2][0] == board[2][1] && board[2][1] == board[2][2] && board[2][2] == O) ||
        (board[0][0] == board[1][0] && board[1][0] == board[2][0] && board[2][0] == O) ||
        (board[0][1] == board[1][1] && board[1][1] == board[2][1] && board[2][1] == O) ||
        (board[0][2] == board[1][2] && board[1][2] == board[2][2] && board[2][2] == O) ||
        (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[2][2] == O) ||
        (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[2][0] == O))
        return O
    else
        return undefined;
}

function terminal(board) {
    if (typeof winner(board) != 'undefined') return true;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == EMPTY) return false;
        }
    }

    return true;
}

function utility(board) {
    if (winner(board) == X) return 1;
    else if (winner(board) == O) return -1;
    else return 0;
}

function minimax(board) {
    let moves = actions(board);
    let action = [0, 0];

    if (player(board) == X) {
        let check = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            let value = mini(result(board, moves[i]));

            if (value > check) {
                check = value;
                action = moves[i];
            }
        }
    }

    else {
        let check = Infinity;
        for (let i = 0; i < moves.length; i++) {
            let value = maxi(result(board, moves[i]));

            if (value < check) {
                check = value;
                action = moves[i];
            }
        }
    }

    return action;
}

function mini(board) {
    let values = [];
    if (terminal(board)) return utility(board);

    let moves = actions(board);
    for (let i = 0; i < moves.length; i++) {
        values.push(maxi(result(board, moves[i])))
    }

    return Math.min(...values);
}

function maxi(board) {
    let values = [];
    if (terminal(board)) return utility(board);

    let moves = actions(board);
    for (let i = 0; i < moves.length; i++) {
        values.push(mini(result(board, moves[i])))
    }

    return Math.max(...values);
}