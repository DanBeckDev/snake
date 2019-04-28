const GAME_CANVAS = document.getElementById("snakeCanvas"),
    LEFT_KEY = 37, UP_KEY = 38, RIGHT_KEY = 39, DOWN_KEY = 40;
let playerX, playerY, appleX, appleY, gameInterval, lastKeyPress, score, speed, trailInitialized, trail, tail,
    ctx = GAME_CANVAS.getContext("2d"),
    state = 'menu', xVel = yVel = 0, gridSize = tileCount = 20;

initialize = () => {
    document.addEventListener("keydown", onKeyDown);
    stateManager();
}

update = () => { 
    gameLogic();
    prepareCanvas();
    scoreBoard();
    wallLogic();
    trailLogic();
    appleLogic();
}

stateManager = () => {
    
    switch (state) {
        case 'menu':
            menuView();
            break;
        case 'game':
            gameInterval = setInterval(update, speed/15);
            setTimeout(setTrailValue, 1000);
            break;
        case 'gameOver':
            clearInterval(gameInterval);
            setTimeout(gameOverView, 1500);
            break;
    }
}

setState = (newState) => {
    state = newState;
    stateManager();
}

prepareCanvas = () => {
    ctx.fillStyle = 'lime';
    ctx.strokestyle = 'black';
    ctx.fillRect(0, 0, GAME_CANVAS.width, GAME_CANVAS.height);
    ctx.strokeRect(0, 0, GAME_CANVAS.width, GAME_CANVAS.height);
}

scoreBoard = () => {
    ctx.strokeRect(0, 0, GAME_CANVAS.width, 20);
    addText("10px retro", "Score: "+score, 15, 10, 'left');
}

menuView = () => {
    speed = 2000;
    score = 0;
    playerX = playerY = 10;
    appleX = appleY = tail = 5;
    trailInitialized = false;
    trail = [];
    prepareCanvas();
    addText("30px retro", "Snake", "100");
    addText("10px retro", "Press any arrow key to start", GAME_CANVAS.height/2);
}

gameOverView = () => {
    prepareCanvas();
    addText("30px retro", "Game Over", "100");
    addText("10px retro", "Press any arrow key to continue", GAME_CANVAS.height/2);
}

addText = (font, message, height, width=GAME_CANVAS.width/2, align='center') => {
    ctx.font = font;
    ctx.fillStyle = 'black';
    ctx.textAlign = align;
    ctx.fillText(message, width, height);
}

gameLogic = () => {
    playerX += xVel;
    playerY += yVel;
}


wallLogic = () => {
    if (playerX < 0 || playerX > tileCount -1  || playerY < 1 || playerY > tileCount ) {
        setState('gameOver');
    }
}

trailLogic = () => {
    ctx.fillStyle = "black";
    for (var i = 0; i < trail.length; i++) {
        ctx.fillRect(trail[i].x*gridSize, trail[i].y*gridSize, gridSize-2, gridSize-2);
        if (trail[i].x === playerX && trail[i].y === playerY && !trailInitialized) {
            tail = 5;
        } else if (trail[i].x === playerX && trail[i].y === playerY) {
            setState('gameOver');
        }
    }

    trail.push({
        x:playerX, 
        y:playerY
    });

    while (trail.length > tail) {
        trail.shift();
    }
}

setTrailValue = () => {
    trailInitialized = true;
}

appleLogic = () => {
    ctx.fillStyle ="red";
    ctx.fillRect(appleX*gridSize, appleY*gridSize -2, gridSize-2 ,gridSize-2);

    if ( appleX === playerX && appleY === playerY) {
        tail++;
        score++;
        speed -= 100;
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
        clearInterval(gameInterval);
        gameInterval = setInterval(update, speed/15);
    }
}

onKeyDown = (event) => {
    keys = [LEFT_KEY, UP_KEY, RIGHT_KEY, DOWN_KEY];
    state === 'menu'
        ? keys.includes(event.keyCode) && setState('game')
        : state === 'gameOver'
            ? keys.includes(event.keyCode) && setState('menu')
            : keys.includes(event.keyCode) && snakeDirection()
}

snakeDirection = () => {
    switch (event.keyCode) {
        case LEFT_KEY :
            direction(-1, 0, LEFT_KEY, RIGHT_KEY);
            break;
        case UP_KEY:
            direction(0, -1, UP_KEY, DOWN_KEY);
            break;
        case RIGHT_KEY:
            direction(1, 0, RIGHT_KEY, LEFT_KEY);
            break;
        case DOWN_KEY:
            direction(0, 1, DOWN_KEY, UP_KEY);
            break;
    }
}

direction = (x, y, key, oppositeKey) => {
    if (lastKeyPress !== oppositeKey) {
        xVel = x;
        yVel = y;
        lastKeyPress = key;
    }  
}

window.onload = function(){
    initialize();
};
