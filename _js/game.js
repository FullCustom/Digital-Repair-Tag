// _js/game.js - FULLY FIXED & MOBILE-READY
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const gridSize = 4;
let tileSize = 100; // Will be recalculated dynamically
let grid = [];
let score = 0;
let gameOver = false;
let touchStartX = 0;
let touchStartY = 0;

// Map tile values to image URLs
const tileImages = {
    2: 'https://images.unsplash.com/photo-1503437313881-1d196c405908',
    4: 'https://images.unsplash.com/photo-1519052537078-e630b3c54d26',
    8: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    16: 'https://images.unsplash.com/photo-1543466835-00a7908e9de1',
    32: 'https://images.unsplash.com/photo-1516728778615-2d590ea1855a',
    64: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054',
    128: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    256: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    512: 'https://images.unsplash.com/photo-1503614472-8c93ca36fc60',
    1024: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e206',
    2048: 'https://images.unsplash.com/photo-1495567720989-cebdb147981e'
};

const imageCache = {};

function loadImage(value) {
    if (!imageCache[value]) {
        imageCache[value] = new Image();
        imageCache[value].src = tileImages[value] || '';
    }
    return imageCache[value];
}

// === DYNAMIC CANVAS RESIZING ===
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxSize = 400;
    const size = Math.min(container.clientWidth * 0.95, maxSize);
    
    canvas.width = size;
    canvas.height = size;
    tileSize = size / gridSize; // Recalculate tile size
    draw();
}

// Initialize grid
function initGrid() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    score = 0;
    gameOver = false;
    addNewTile();
    addNewTile();
    resizeCanvas(); // Ensure correct size
}

// Add a new tile (2 or 4)
function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) emptyCells.push({ x: i, y: j });
        }
    }
    if (emptyCells.length > 0) {
        let { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Draw the grid and tiles
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let value = grid[i][j];
            const x = j * tileSize + 5;
            const y = i * tileSize + 5;
            const size = tileSize - 10;

            // Background
            ctx.fillStyle = value === 0 ? '#cdc1b4' : getTileColor(value);
            ctx.fillRect(x, y, size, size);

            if (value !== 0) {
                let img = loadImage(value);
                if (img.complete && img.naturalWidth !== 0) {
                    ctx.drawImage(img, x, y, size, size);
                } else {
                    // Fallback: number
                    ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
                    ctx.font = `bold ${Math.min(tileSize * 0.4, 40)}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(value, x + size / 2, y + size / 2);
                }
            }
        }
    }

    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.classList.toggle('show', gameOver);
}

// Get tile color
function getTileColor(value) {
    const colors = {
        2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
        32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
        512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

// Move tiles
function move(direction) {
    if (gameOver) return;
    let moved = false;
    let newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

    const processLine = (line) => {
        let stack = line.filter(v => v !== 0);
        let result = [];
        let i = 0;
        while (i < stack.length) {
            if (i + 1 < stack.length && stack[i] === stack[i + 1]) {
                let merged = stack[i] * 2;
                result.push(merged);
                score += merged;
                i += 2;
            } else {
                result.push(stack[i]);
                i++;
            }
        }
        return result.concat(Array(gridSize - result.length).fill(0));
    };

    if (direction === 'up') {
        for (let j = 0; j < gridSize; j++) {
            let col = grid.map(row => row[j]);
            let processed = processLine(col);
            for (let i = 0; i < gridSize; i++) {
                if (newGrid[i][j] !== processed[i]) moved = true;
                newGrid[i][j] = processed[i];
            }
        }
    } else if (direction === 'down') {
        for (let j = 0; j < gridSize; j++) {
            let col = grid.map(row => row[j]).reverse();
            let processed = processLine(col).reverse();
            for (let i = 0; i < gridSize; i++) {
                if (newGrid[i][j] !== processed[i]) moved = true;
                newGrid[i][j] = processed[i];
            }
        }
    } else if (direction === 'left') {
        for (let i = 0; i < gridSize; i++) {
            let processed = processLine(grid[i]);
            for (let j = 0; j < gridSize; j++) {
                if (newGrid[i][j] !== processed[j]) moved = true;
                newGrid[i][j] = processed[j];
            }
        }
    } else if (direction === 'right') {
        for (let i = 0; i < gridSize; i++) {
            let reversed = grid[i].slice().reverse();
            let processed = processLine(reversed).reverse();
            for (let j = 0; j < gridSize; j++) {
                if (newGrid[i][j] !== processed[j]) moved = true;
                newGrid[i][j] = processed[j];
            }
        }
    }

    if (moved) {
        grid = newGrid;
        addNewTile();
        if (!canMove()) {
            gameOver = true;
            setTimeout(() => gameOverDisplay.classList.add('show'), 300);
        }
    }
    draw();
}

// Check if moves are possible
function canMove() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) return true;
            if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) return true;
            if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) return true;
        }
    }
    return false;
}

// === INPUT HANDLING ===
document.addEventListener('keydown', (e) => {
    if (gameOver && e.key === 'Enter') {
        initGrid();
        gameOverDisplay.classList.remove('show');
    } else if (!gameOver) {
        if (e.key === 'ArrowUp') move('up');
        else if (e.key === 'ArrowDown') move('down');
        else if (e.key === 'ArrowLeft') move('left');
        else if (e.key === 'ArrowRight') move('right');
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (gameOver) {
        initGrid();
        gameOverDisplay.classList.remove('show');
        return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
            move(dx > 0 ? 'right' : 'left');
        } else {
            move(dy > 0 ? 'down' : 'up');
        }
    }
}, { passive: false });

// === RESIZE & START ===
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));

// Start the game
initGrid();