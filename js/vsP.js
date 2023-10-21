const X = 'X',
    O = 'O',
    EMPTY = undefined,

    drawAudio = new Audio('../mp3/draw.mp3'),
    victoryAudio = new Audio('../mp3/win.mp3'),
    loseAudio = new Audio('../mp3/lose.mp3'),

    cells = document.querySelectorAll('.cell');

let user1,
    user2,
    username1 = "Player 1",
    username2 = "Player 2",
    pts1 = 0,
    pts2 = 0,
    board = initialState(),
    isGameOver = terminal(board),
    turn = X,
    notifier = document.querySelector('#notifier'),
    pts = document.querySelector('#pts'),
    lastWinner = undefined,
    NotifyWinner = false;

notifier.innerHTML = 'Welcome to Tic Tac Toe'
userChoosing();

cells.forEach(cell => {
    cell.addEventListener('click', async () => {
        if (!cell.innerHTML && !isGameOver) {
            cell.innerHTML = turn;
            let pos = convertTo2D(cell.id[1]);
            board = result(board, pos);

            turn = turn === X ? O : X;

            notifier.innerHTML = turn === X ? `${username1} turn` : `${username2} turn`;
        }
        
        isGameOver = terminal(board);
        if (isGameOver && !NotifyWinner) await handlerWinningPlayer();

        
        console.log("NotifyWinner: " + NotifyWinner)

        if(isGameOver && NotifyWinner) {
            await Swal.fire({
                title: "This game is finnish!",
                showCancelButton: true,
                confirmButtonText: "Play Again",
                cancelButtonText: "Quit",
            })
                .then(rs => {
                    if(rs.isConfirmed) {
                        cells.forEach(cell => cell.innerHTML = '')
                        console.log(user1, user2, turn)
                        board = initialState();
                        isGameOver = terminal(board);
        
                        pts.innerHTML = `${username1}: ${pts1} - ${username2}: ${pts2}`;
                        NotifyWinner = false;
                    }
                    else window.close()
                })
        }
    })

})

// handler winning player
async function handlerWinningPlayer() {
    if (isGameOver) {
        let winningPlayer = winner(board);
        console.log(winningPlayer)
        if (typeof winningPlayer === 'undefined') {
            turn = X;
            notifier.innerHTML = turn === X ? `${username1} turn` : `${username2} turn`;
            lastWinner = undefined;

            pts1++; pts2++;
            playSound(drawAudio);

            await popUp(`That\'s a good match!`);
        }
        else if (winningPlayer === user1) {
            pts1++;
            lastWinner = user1;
            playSound(victoryAudio);

            await popUp(`${username1} win! Congratulations!`);
        }
        else {
            pts2++;
            lastWinner = user2;
            playSound(victoryAudio);

            await popUp(`${username2} win! Congratulations!`);
        }
    }
    
}

// chose X or O
async function userChoosing() {
    await Swal.fire({
        icon: 'question',
        title: 'Choose X or O for Player 1',
        showCancelButton: true,
        cancelButtonText: 'Play as O',
        confirmButtonText: 'Play as X'
    })
        .then(result => {
            if (result.isConfirmed) {
                user1 = X;
                user2 = O;
            }
            else {
                user1 = O;
                user2 = X;
            }
        })

    await Swal.fire({
        icon: 'question',
        title: 'Player 1 wanna be called as...',
        input: 'text'
    })
        .then(res => {
            username1 = res.value.trim() === "" ? username1 : res.value.trim();
        })

    await Swal.fire({
        icon: 'question',
        title: 'Player 2 wanna be called as...',
        input: 'text'
    })
        .then(res => {
            username2 = res.value.trim() === "" ? username2 : res.value.trim();
        })

    notifier.innerHTML = turn === X ? `${username1} turn` : `${username2} turn`;
    pts.innerHTML = `${username1}: ${pts1} - ${username2}: ${pts2}`;
}

// playsound
function playSound(mp3) {
    mp3.pause();
    mp3.currentTime = 0;
    mp3.play();
}

// pop-up
async function popUp(title) {
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
            NotifyWinner = true;
            if (res.isConfirmed) {

                cells.forEach(cell => cell.innerHTML = '')
                console.log(user1, user2, turn)
                board = initialState();
                isGameOver = terminal(board);

                pts.innerHTML = `${username1}: ${pts1} - ${username2}: ${pts2}`;

            }
            
        })
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

    if (checkEmpty == 9) {
        if(!lastWinner) return X;
        else if(lastWinner == user1) return user2;
        else return user1;
    }
    else {
        if(!lastWinner || lastWinner == O) {
            if (checkX > checkO) return O;
            else return X;  
        }
        else {
            if (checkX >= checkO) return O;
            else return X;
        }
        
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
    console.log(board)
    if ((board[0][0] == board[0][1] && board[0][1] == board[0][2] && board[0][2] == X) ||
        (board[1][0] == board[1][1] && board[1][1] == board[1][2] && board[1][2] == X) ||
        (board[2][0] == board[2][1] && board[2][1] == board[2][2] && board[2][2] == X) ||
        (board[0][0] == board[1][0] && board[1][0] == board[2][0] && board[2][0] == X) ||
        (board[0][1] == board[1][1] && board[1][1] == board[2][1] && board[2][1] == X) ||
        (board[0][2] == board[1][2] && board[1][2] == board[2][2] && board[2][2] == X) ||
        (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[2][2] == X) ||
        (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[2][0] == X))
        return X
    else if 
        ((board[0][0] == board[0][1] && board[0][1] == board[0][2] && board[0][2] == O) ||
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