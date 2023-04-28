function randInt(min, max){return ~~(Math.random() * (max - min)) + min}

function xIntToPx(x){return  40 + x*12 + (x-1)*85 + 'px'}

function yIntToPx(y){return 160 + y*12 + (y-1)*85 + 'px'}

var blocks = []
var score = 0, 
bestScore = 0,
lastMoveTime = new Date()

function newGame(){
    
    for (i = 0; i < blocks.length; i++){
        game.removeChild(blocks[i].DOM)
    }

    blocks = []

    score = 0
    document.getElementById('score-output').innerHTML = 0

    appendBlock2()
}
window.onload = newGame

function appendBlock2(){

    if (blocks.length == 16) return checkForLoss()

    x = randInt(1, 5)
    y = randInt(1, 5)

    for (i = 0; i < blocks.length; i++){
        if (blocks[i].x == x && blocks[i].y == y){
            return appendBlock2()
        }
    }

    newBlock(x, y, 2)
}

function checkForLoss(){
    for (i = 0; i <  blocks.length; i++){
        for (j = 0; j < blocks.length; j++){
            if (blocks[i].class == blocks[j].class && ((Math.abs(blocks[i].x - blocks[j].x) == 1 && blocks[i].y == blocks[j].y) || (Math.abs(blocks[i].y - blocks[j].y) == 1 && blocks[i].x == blocks[j].x))) {
                return
            }
        }
    }
    newGame()
}

function newBlock(x, y, value){
    block = document.createElement("div");
    block.className = 'block-'+value+' blocks'
    block.innerHTML = value

    block.style.left = xIntToPx(x)
    block.style.top  = yIntToPx(y)

    blocks.push({
        x: x,
        y: y,
        class: value,
        DOM: block
    })

    game.appendChild(block)

    setTimeout(function(){
        block.style.transform = 'scale(1.1)'
        setTimeout(function(){
            block.style.transform = 'scale(1.0)'
        }, 150)
    }, 50)
}

function move(direction){
    for (_ = 0; _ < 4; _++){
        for (i = 0; i < blocks.length; i++){
            (function(){
                for (j = 0; j < blocks.length; j++){
                    if (direction == 'left'  && (blocks[i].x == 1 || (blocks[i].x-1 == blocks[j].x && blocks[i].y == blocks[j].y))) return
                    if (direction == 'right' && (blocks[i].x == 4 || (blocks[i].x+1 == blocks[j].x && blocks[i].y == blocks[j].y))) return
                    if (direction == 'up'    && (blocks[i].y == 1 || (blocks[i].y-1 == blocks[j].y && blocks[i].x == blocks[j].x))) return
                    if (direction == 'down'  && (blocks[i].y == 4 || (blocks[i].y+1 == blocks[j].y && blocks[i].x == blocks[j].x))) return
                }
                (direction == 'left') ? blocks[i].x-- : (direction == 'right') ? blocks[i].x++ : (direction == 'up') ? blocks[i].y-- : (direction == 'down') ? blocks[i].y++ : NaN
            })()
        }
    }
    draw()
    collisionCheck(direction)
}

function draw(){
    for (d = 0; d < blocks.length; d++){
        blocks[d].DOM.style.left = xIntToPx(blocks[d].x)
        blocks[d].DOM.style.top  = yIntToPx(blocks[d].y)
    }
}

function collisionCheck(direction){
    (direction == 'left' || direction == 'up') ? offset = 2 : (direction == 'right' || direction == 'down') ? offset = 3 : NaN
    for (_ = 0; _ < 4; _++){
        while (((direction == 'left' || direction == 'up') && offset <= 4) || ((direction == 'right' || direction == 'down') && offset >= 1)){
            for (i = 0; i < blocks.length; i++){
                if (((direction == 'left' || direction == 'right') && blocks[i].x != offset) || ((direction == 'up' || direction == 'down') && blocks[i].y != offset)) continue
                if ((direction == 'left'  && blocks[i].x == 1) || (direction == 'up'   && blocks[i].y == 1)) continue
                if ((direction == 'right' && blocks[i].x == 4) || (direction == 'down' && blocks[i].y == 4)) continue
                for (j = 0; j < blocks.length; j++){
                    if (blocks[i].class == blocks[j].class){
                        if (direction == 'left'  && (blocks[i].x-1 == blocks[j].x && blocks[i].y == blocks[j].y)){
                            return collision(blocks[i], blocks[j], direction)
                        }
                        if (direction == 'right' && (blocks[i].x+1 == blocks[j].x && blocks[i].y == blocks[j].y)){
                            return collision(blocks[i], blocks[j], direction)
                        }
                        if (direction == 'up'    && (blocks[i].y-1 == blocks[j].y && blocks[i].x == blocks[j].x)){
                            return collision(blocks[i], blocks[j], direction)
                        }
                        if (direction == 'down'  && (blocks[i].y+1 == blocks[j].y && blocks[i].x == blocks[j].x)){
                            return collision(blocks[i], blocks[j], direction)
                        }
                    }
                }
            }
            (direction == 'left' || direction == 'up') ? offset++ : (direction == 'right' || direction == 'down') ? offset-- : NaN
        }
    }
    lastMoveTime = new Date()
    setTimeout(appendBlock2, 200)
}


function collision(firstBlock, secondBlock, direction){

    firstBlock.DOM.style.zIndex = '100'
    firstBlock.DOM.style.left = xIntToPx(secondBlock.x)
    firstBlock.DOM.style.top  = yIntToPx(secondBlock.y)

    setTimeout(function(){
        game.removeChild(firstBlock.DOM)
        game.removeChild(secondBlock.DOM)

        updateScore(secondBlock.class*2)

        newBlock(secondBlock.x, secondBlock.y, secondBlock.class*2)

        blocks.splice(blocks.indexOf(firstBlock),  1)
        blocks.splice(blocks.indexOf(secondBlock), 1)

        setTimeout(function(){
            move(direction)
        }, 30)
        lastMoveTime = new Date()
    }, 200)
}

function updateScore(value){
    score += value
    document.getElementById('score-output').style.transform = 'scale(1.2)'
    document.getElementById('score-output').innerHTML = score
    setTimeout(function(){
        document.getElementById('score-output').style.transform = 'scale(1.0)'
    }, 200)
}


window.onkeydown = function(event){
    if (new Date() - lastMoveTime > 300){
        lastMoveTime = new Date()
        if (event.keyCode == 37 || event.keyCode == 65) move('left')  // > || d
        if (event.keyCode == 38 || event.keyCode == 87) move('up')    // ^ || w
        if (event.keyCode == 39 || event.keyCode == 68) move('right') // < || a
        if (event.keyCode == 40 || event.keyCode == 83) move('down')  // v || s
       
    }
}


window.onmousedown = function(event){
    if (new Date() - lastMoveTime > 300 && event.clientY > 160){
        xFirst = event.clientX
        yFirst = event.clientY
        window.onmousemove = function(event){
            lastMoveTime = new Date()
            xSecond = event.clientX
            ySecond = event.clientY

            xDifferent = xFirst - xSecond
            yDifferent = yFirst - ySecond

            if (Math.abs(xDifferent) > Math.abs(yDifferent)){
                if (xDifferent > 0) move('left')
                else move('right')
            }
            else {
                if (yDifferent > 0) move('up')
                else move('down')
            }
             window.onmousemove = null
        }
    }
}
window.onmouseup = function(){
    window.onmousemove = null
}


window.addEventListener('touchstart', handleTouchStart)
window.addEventListener('touchmove',   handleTouchMove)

function handleTouchStart(event){
    document.getElementsByTagName('body')[0].style.transform = 'scale(.75)'
    document.getElementsByTagName('body')[0].style.transformOrigin = '0 0'
    if (new Date() - lastMoveTime > 300){
        firstTouch = event.touches[0]
        xDown = firstTouch.clientX
        yDown = firstTouch.clientY
    }
}

function handleTouchMove(event){
    if (!xDown || !yDown) return
    var xUp = event.touches[0].clientX
    var yUp = event.touches[0].clientY
    var xDifferent = xDown - xUp
    var yDifferent = yDown - yUp
    if ( Math.abs(xDifferent) > Math.abs(yDifferent)) {
        if ( xDifferent > 0 ) move('left')
        else move('right')
    } 
    else {
        if ( yDifferent > 0 ) move('up')
        else direction = move('down')
    }
    xDown = null
    yDown = null
}

