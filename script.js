// get all the elements
const body = document.querySelector('body');
const grid = document.querySelector('.grid');
const logo = document.querySelector('.logo');
const restartButton = document.querySelector('.button.restart');
const pauseButton = document.querySelector('.button.pause');
const size = 15;
const height = 40;
const width = 40;
const directions = ['N','E','W','S']; 
const paperWrappingRock = new Audio('./paper-wrapping-rock.wav')
const rockBreakingScissor = new Audio('./rock-breaking-scissor.wav')
const scissorsCuttingPaper = new Audio('./scissors-cutting_paper.mp3')
const winSound = new Audio('./win-sound.wav')
const positions = [[0, 0], [0, width - size], [height - 3, (width - 10)/2]]

// interval handlers
let handleCollisionInterval;
let removeFireClassInterval;
let moveEntitiesRandomlyInterval;
let checkWinnerInterval;
let backgroundImageInterval;
let entities;
let shuffledPositions;
let pause = true;


// generate some initial entities of rocks, papers and scissors
// and append in the parent div
function init() {
    shuffledPositions = (positions
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value) ) || []
    generateEntities("rock", shuffledPositions[0]);
    generateEntities("paper", shuffledPositions[1]);
    generateEntities("scissor", shuffledPositions[2]);
}

// all elements array to process collision and random movements
function setEntities() {
    entities = document.querySelectorAll('.grid > div')
}

// clear all entities 
function destroy() {
    grid.innerHTML = "";
}

// make the entities move randomly
function moveEntitiesRandomly() {
    for (entity of entities) {
        const top = Number(entity.style.top.split('').slice(0, -3).join(''));
        const left = Number(entity.style.left.split('').slice(0, -3).join(''));
        const direction = generateRandomDirection();
        // console.log(top, left, direction)
        switch (direction) {
            case 'N': 
                entity.style.top = (top <= 1 ? (top + 1.5) + 'rem' : (top - 1.5) + 'rem');
                break;
            case 'E':
                entity.style.left = (left + 3 >= width) ? (left - 1.5) + 'rem' : (left + 1.5) + 'rem';
                break;
            case 'W':
                entity.style.left = (left <= 1)  ? (left + 1.5) + 'rem' : (left - 1.5) + 'rem';
                break;
            case 'S':
                entity.style.top = (top + 3 >= height) ? (top - 1.5) + 'rem' : (top + 1.5) + 'rem';
                break;
            default: 
        }
        // console.log(entity);
    }
}

// gereate rnadom direction 
generateRandomDirection = () => directions[Math.floor(Math.random() * directions.length)]


// handle collision
function handleCollision() {
    for (i = 0; i < entities.length; i++) {
        for (j = i + 1; j < entities.length; j++) {
            const entity1 = entities[i]
            const entity2 = entities[j]
            const top1  = Number(entity1.style.top.split('').slice(0, -3).join(''));
            const top2  = Number(entity2.style.top.split('').slice(0, -3).join(''));
            const left1  = Number(entity1.style.left.split('').slice(0, -3).join(''));
            const left2  = Number(entity2.style.left.split('').slice(0, -3).join(''));
            if (Math.abs(top1 - top2) < 1.5
                && Math.abs(left1 - left2) < 1.5
                && entity1.classList[0] !== entity2.classList[0]) {
                // console.log('collide', entity1.classList, entity2.classList)
                entity1.classList.add('fire')
                entity2.classList.add('fire')
                if (entity1.classList.contains('rock') && !entity2.classList.contains('rock')) {
                    if(entity2.classList.contains('paper')) {
                        entity1.classList.remove('rock')
                        entity1.classList.add('paper')
                        paperWrappingRock.play();
                    } else {
                        entity2.classList.remove('scissor')
                        entity2.classList.add('rock')
                        rockBreakingScissor.play();
                    }
                } else if (entity1.classList.contains('paper') && !entity2.classList.contains('paper')) {
                    if(entity2.classList.contains('scissor')) {
                        entity1.classList.remove('paper')
                        entity1.classList.add('scissor');
                        scissorsCuttingPaper.play();
                    } else {
                        entity2.classList.remove('rock')
                        entity2.classList.add('paper');
                        paperWrappingRock.play();
                    }
                } else if (entity1.classList.contains('scissor') && !entity2.classList.contains('scissor')) {
                    if(entity2.classList.contains('rock')) {
                        entity1.classList.remove('scissor')
                        entity1.classList.add('rock');
                        rockBreakingScissor.play();
                    } else {
                        entity2.classList.remove('paper')
                        entity2.classList.add('scissor');
                        scissorsCuttingPaper.play();
                    }
                }
                // console.log('after collission', entity1, entity2)
            }
        }
    }
}

// to remove the fire image 
function removeFireClass() {
    for (entity of entities) {
        if(entity.classList.contains('fire'))
            entity.classList.remove('fire')
    }
}

// to decide the winner
function checkWinner() {
    let scissorsCount = 0, rockCount = 0, papersCount = 0;

    for (entity of entities) {
        if(entity.classList.contains('scissor'))
            scissorsCount++
        else if(entity.classList.contains('rock'))
            rockCount++
        else 
            papersCount++
    }

    if(scissorsCount === size * 3 
        || rockCount === size * 3
        || papersCount === size * 3) {
        clearInterval(removeFireClassInterval);
        clearInterval(handleCollisionInterval);
        clearInterval(moveEntitiesRandomlyInterval);
        clearInterval(checkWinnerInterval);
        winSound.play();
        logo.innerText = scissorsCount === size * 3 ?
            'Scissor Win' : rockCount === size * 3 ?
            'Rock Win' : 'Paper Win';

        restartButton.style.display = 'block'
    } 

}

// fucntion to generate given number of entities 
function generateEntities(entityClass, positions, count = size) {
    for(let i = 0; i < count; i++) {
        const newDiv = document.createElement('div');
        newDiv.style.top =  positions[0]  + 'rem';
        newDiv.style.left =  (positions[1] + i) + 'rem';
        newDiv.classList.add(entityClass); // for entity image
        grid.appendChild(newDiv);
    }
}

// restart the game
function restart() {
    destroy();
    init();
    setEntities();
    handleCollisionInterval = setInterval(() => handleCollision(), 300);
    removeFireClassInterval = setInterval(() => removeFireClass(), 500);
    moveEntitiesRandomlyInterval = setInterval(() => moveEntitiesRandomly(), 500);
    checkWinnerInterval = setInterval(() => checkWinner(), 500);
    backgroundImageInterval = setInterval(() => updateBackground(), 1000)
    restartButton.style.display = 'none';
}

// pause the game
function pauseOrResume() {
    console.log(pause)
    if(pause) {
        clearInterval(handleCollisionInterval);
        clearInterval(moveEntitiesRandomlyInterval);
        pauseButton.innerText= 'Resume'
    } else {
        handleCollisionInterval = setInterval(() => handleCollision(), 300);
        moveEntitiesRandomlyInterval = setInterval(() => moveEntitiesRandomly(), 500);
        pauseButton.innerText= 'Pause'
    }
    pause = !pause
}

function updateBackground() {
    let scissorsCount = 0, rocksCount = 0, papersCount = 0;

    for (entity of entities) {
        if(entity.classList.contains('scissor'))
            scissorsCount++
        else if(entity.classList.contains('rock'))
            rocksCount++
        else 
            papersCount++
    }
    //console.log(rocksCount, papersCount, scissorsCount);
    body.style.backgroundImage = (scissorsCount > rocksCount) && (scissorsCount > papersCount) ? 
                                    'url(./scissor.png)' : (rocksCount > papersCount) ? 
                                    'url(./rock.png)' : 'url(./paper.png)';
}


// binding the function to the button
restartButton.addEventListener('click', restart);
pauseButton.addEventListener('click', pauseOrResume);

restart();