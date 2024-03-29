(function() {
    "use strict"

    const BLOCK_SIZE = 50                // Number of pixels per gameboard grid block
    const INITIAL_SPEED = 5              // In grid blocks/sec
    const INITIAL_SNAKE_DIRECTION = 'R'  // One of R, L, U, or D

    let gameState                        // Either 'running' or 'over'

    let boardEl,                         // The gameboard element
        foodEl,                          // The food element
        gameoverEl,                      // The gameover element

        snakeX,                          // The snake's coordinates in terms of the gameboard grid 
        snakeY,
        snakeDirection,
        snakeSpeed,
        snakeEl,                         // The snake element
        snakeColor = "#721745"

    let boardW,                          // The gameboard's size in terms of the gameboard grid
        boardH,
        score

    /**
     * Returns the number of pixels represented by a given size in gameboard blocks
     * @param sizeInBlocks The size to convert in terms of number of gameboard grid squares (blocks)
     * @param includeUnits Whether or not to include the 'px' unit in the returned value
     */
    function px(sizeInBlocks, includeUnits=true) {
        return  sizeInBlocks * BLOCK_SIZE + (includeUnits ? 'px' : '')
    }

    /**
     * Sizes the gameboard so that it takes up the maximum amount of space within the browser viewport
     * but has width and height dimensions that are multiples of the BLOCK_SIZE
     */
    function resizeBoard() {

        let w = window.innerWidth
        let h = window.innerHeight

        // Size the board so there is a left/right margin by subtracting 2 grid block sizes from the window width
        let boardPxW = w - px(2, false);  
        // Size the board so there is a bottom margin by subtracting 1 grid block size from the window height
        // Also make room for the header element by removing its height (boardEl.offsetTop) from the window height
        let boardPxH = h - boardEl.offsetTop - px(1, false);

        // At this point boardPxW and boardPxH are the pixel maximum width and height dimensions of the board.
        // These two lines now round these values down so that the dimensions are multiples of BLOCK_SIZE
        // For example, BLOCK_SIZE=10, boardPxW=1234px, boardPxH=879
        // So we need boardPxW=1230px, boardPxH=870px
        boardPxW -= boardPxW % BLOCK_SIZE   // In the example, boardPxW % BLOCK_SIZE = 4
        boardPxH -= boardPxH % BLOCK_SIZE   // In the example, boardPxH % BLOCK_SIZE = 9

        boardEl.style.width = boardPxW + 'px'
        boardEl.style.height = boardPxH + 'px';

        boardEl.style.borderWidth = px(0.5);  // Give the gameboard a 1/2 BLOCK_SIZE border

        // boardW and boardH are the gameboard dimensions in terms of gameboard grid blocks
        // (We will use gameboard coordinates rather than pixel coordinates to keep track of the location
        // of various elements in our app)
        boardW = boardPxW / BLOCK_SIZE
        boardH = boardPxH / BLOCK_SIZE
    }

    /**
     * Place the given element at the correct pixel position for the given grid coordinates.
     * This function assumes that the given element has position:absolute and is positioned relative to #gameboard
     * 
     * @param el The element to position on the gameboard grid
     * @param gridX The x-coordinate on the gameboard grid at which to position the segment
     * @param gridY The y-coordinate on the gameboard grid at which to position the segment
     */
    function positionElementOnGrid(el, gridX, gridY) {
        // TODO: position the element
        el.style.top = px(gridY);
        el.style.left = px(gridX);
    }

    /**
     * Returns true if the two given elements are in the same location
     */
    function isAtSamePos(el1, el2) {
        // TODO: determine if the two elements are at the same location
        if(el1.style.top == el2.style.top && el1.style.left == el2.style.left){
            return true;
        }else{
            return false;
            }
    }

    function isSnakeOutOfBounds() {
        // TODO: return true if the snake is out of bounds; otherwise return false
        if (snakeX > boardW - 1){
            return true;
        } else if(snakeX < 0) {
            return true;
        } else if(snakeY > boardH - 1){
            return true;
        } else if(snakeY < 0){
            return true;
        } else {}
    }

    /**
     * Returns the milliseconds per tick needed if the snake is moving at the given speed
     * @param speed The number of gameboard grid blocks per second
     */
    function msPerTick(speed) {
        return 1000.0/speed;
    }

    /**
     * This is the main driver of game progression.  This function should be called once per 'tick' of the game.
     * The number of ticks per second are determined by snakeSpeed, and this speed can be converted into a millisecond
     * value using the msPerTick function above.
     */
    function tick() {
        // TODO: use a timer to update the game and re-call tick
        setTimeout(function(){
            if(gameState === "running"){
            updateGame();
            tick();
            }
        }, msPerTick(snakeSpeed));
        
    }

    function createSnakeSegmentElement() {
        // TODO: create and return a snake segment element
        let snakeSegment = document.createElement("div");
        snakeSegment.classList.add("snake-segment");
        snakeSegment.style.backgroundColor = snakeColor;
        snakeSegment.style.width = px(1);
        snakeSegment.style.height = px(1);
        return snakeSegment;
    }

    function createFoodElement() {
        // TODO: create and return a food element
        let foodElement = document.createElement("div");
        foodElement.classList.add("food");
        foodElement.style.width = px(1);
        foodElement.style.height = px(1);
        foodElement.style.backgroundColor = "green";
        foodElement.style.borderRadius = "50%";
        return foodElement;

    }
    
    function killSnake() {
        // TODO: set the snake's background color to transparent
        snakeEl.style.backgroundColor = "transparent";
    }

    function clearBoard() {
        // TODO: remove all elements from the gameboard element
        let clearTheBoard = document.getElementById("gameboard");
        while (clearTheBoard.hasChildNodes()){
            clearTheBoard.removeChild(clearTheBoard.firstChild);
        }
    }

    function hideMenu() {
        let theMenu = document.getElementById("menu");
        theMenu.classList.remove("open");
    }

    function showMenu() {
        let theMenu = document.getElementById("menu");
        theMenu.classList.add("open")
    }

    function hideGameOver() {
        // TODO: hide the gameover element
    }

    function showGameOver() {
        // TODO: show the gameover element
        let gameOver = document.getElementById("game-over");
        gameOver.classList.add("show");
    }

    function initSnake() {
        // TODO: get a snake element initialized and on the board!
        snakeX = 0;
        snakeY = 0;

        snakeSpeed = INITIAL_SPEED;
        snakeDirection = INITIAL_SNAKE_DIRECTION;
        
        snakeEl = createSnakeSegmentElement(snakeEl);
        boardEl.appendChild(snakeEl);
        positionElementOnGrid(snakeEl, 0, 0);

    }

    function addNewFood() {
        // TODO: add a new food element
        foodEl = createFoodElement();
        boardEl.appendChild(foodEl);
        gameboard.appendChild(foodEl);
        positionElementOnGrid(foodEl, 35, 14)


    }

    function updateScoreElement() {
        // TODO: update the score element to show the current score
        document.getElementById("score-container").innerHTML = score;
    }

    function updateSpeedElement() {
        // TODO: update the speed element to show the snake's speed
        document.getElementById("speed-container").innerHTML = snakeSpeed + " blocks/sec";
    }

    function updateSnakePosition() {
        // TODO: update the snake's position depending on the snake's direction
        switch(snakeDirection){
            case "r":
            case "R":
                snakeX ++;
                break;
            case "l":
            case "L":
                snakeX --;
                break;
            case "u":
            case "U":
                snakeY --;
                break;
            case "d":
            case "D":
                snakeY ++;
                break;
                        
        }
        
    }

    function isGameOver() {
        return isSnakeOutOfBounds()
    }

    function snakeFoundFood() {
        return isAtSamePos(snakeEl, foodEl)
    }

    function updateGame() {

        updateSnakePosition()
        
        if ( isGameOver() ) {
            showGameOver()
            killSnake()
            gameState = 'over'
        } else {
            positionElementOnGrid(snakeEl, snakeX, snakeY)

            if ( snakeFoundFood() ) {
                score += 10
                snakeSpeed *= 1.05
            } 
            updateScoreElement()
            updateSpeedElement()
        }
    }

    function resetGame() {

        clearBoard()
        resizeBoard()

        // Needs to happen after the board has been cleared
        initSnake()
        addNewFood()
        
        score = 0
        // TODO: hide the GAME OVER element 
    }

    function startGame() {

        gameState = 'running'
        tick()

    }

    function handleFormSubmit(event) {
        hideMenu()

        resetGame()
        startGame()

        // This prevents the form from actually submitting
        event.preventDefault()
    }

    function handleKeyPress(event) {
        // TODO: set snakeDirection according to the key the user pressed
        console.log(event.key);
        let keyPressed = event.key;
        if (gameState = "running")
            switch(keyPressed){
                case "ArrowDown":
                    snakeDirection = "D";
                    break;
                case "ArrowUp":
                    snakeDirection = "U";
                    break;
                case "ArrowRight":
                    snakeDirection = "R";
                    break;
                case "ArrowLeft":
                    snakeDirection = "L";
                    break;
            }
    }

    function init() {
        // TODO: initialize the app
        boardEl = document.getElementById("gameboard");
        gameoverEl = document.getElementById("game-over");
        gameoverEl.addEventListener("click", showMenu);
        window.addEventListener("submit", handleFormSubmit);
    }

    window.onload = init;

    window.addEventListener("keydown", handleKeyPress);

    // TODO: add a window.keydown listener

})();