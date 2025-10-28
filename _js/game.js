 const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreDisplay = document.getElementById('score');
        const gameOverDisplay = document.getElementById('game-over');
        const gridSize = 4;
        const tileSize = 100;
        let grid = [];
        let score = 0;
        let gameOver = false;
        let touchStartX = 0;
        let touchStartY = 0;

        // Map tile values to image URLs (replace with your own images)
        const tileImages = {
            2: 'https://images.unsplash.com/photo-1503437313881-1d196c405908', // Example: Cat
            4: 'https://images.unsplash.com/photo-1519052537078-e630b3c54d26', // Example: Dog
            8: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131', // Example: Bird
            16: 'https://images.unsplash.com/photo-1543466835-00a7908e9de1', // Example: Fish
            32: 'https://images.unsplash.com/photo-1516728778615-2d590ea1855a', // Example: Flower
            64: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054', // Example: Tree
            128: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Example: Beach
            256: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // Example: Mountain
            512: 'https://images.unsplash.com/photo-1503614472-8c93ca36fc60', // Example: Sky
            1024: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e206', // Example: Sunset
            2048: 'https://images.unsplash.com/photo-1495567720989-cebdb147981e' // Example: Star
        };

        // Cache for loaded images
        const imageCache = {};

        // Load image and cache it
        function loadImage(value) {
            if (!imageCache[value]) {
                imageCache[value] = new Image();
                imageCache[value].src = tileImages[value] || '';
            }
            return imageCache[value];
        }

        // Initialize grid
        function initGrid() {
            grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
            addNewTile();
            addNewTile();
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
                    ctx.fillStyle = value === 0 ? '#cdc1b4' : getTileColor(value);
                    ctx.fillRect(j * tileSize + 5, i * tileSize + 5, tileSize - 10, tileSize - 10);
                    if (value !== 0) {
                        let img = loadImage(value);
                        if (img.complete && img.naturalWidth !== 0) {
                            ctx.drawImage(img, j * tileSize + 5, i * tileSize + 5, tileSize - 10, tileSize - 10);
                        } else {
                            // Fallback to number if image fails to load
                            ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
                            ctx.font = 'bold 40px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(value, j * tileSize + tileSize / 2, i * tileSize + tileSize / 2);
                        }
                    }
                }
            }
            scoreDisplay.textContent = `Score: ${score}`;
            gameOverDisplay.style.display = gameOver ? 'block' : 'none';
        }

        // Get tile color based on value
        function getTileColor(value) {
            const colors = {
                2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
                32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
                512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
            };
            return colors[value] || '#3c3a32';
        }

        // Move tiles in a direction
        function move(direction) {
            if (gameOver) return;
            let moved = false;
            let newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
            let merged = Array(gridSize).fill().map(() => Array(gridSize).fill(false));

            if (direction === 'up' || direction === 'down') {
                for (let j = 0; j < gridSize; j++) {
                    let stack = [];
                    for (let i = 0; i < gridSize; i++) {
                        let idx = direction === 'up' ? i : gridSize - 1 - i;
                        if (grid[idx][j] !== 0) stack.push(grid[idx][j]);
                    }
                    let k = direction === 'up' ? 0 : gridSize - 1;
                    let step = direction === 'up' ? 1 : -1;
                    for (let tile of mergeTiles(stack)) {
                        newGrid[k][j] = tile;
                        k += step;
                    }
                }
            } else {
                for (let i = 0; i < gridSize; i++) {
                    let stack = [];
                    for (let j = 0; j < gridSize; j++) {
                        let idx = direction === 'left' ? j : gridSize - 1 - j;
                        if (grid[i][idx] !== 0) stack.push(grid[i][idx]);
                    }
                    let k = direction === 'left' ? 0 : gridSize - 1;
                    let step = direction === 'left' ? 1 : -1;
                    for (let tile of mergeTiles(stack)) {
                        newGrid[i][k] = tile;
                        k += step;
                    }
                }
            }

            // Check if grid changed
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (grid[i][j] !== newGrid[i][j]) moved = true;
                }
            }

            if (moved) {
                grid = newGrid;
                addNewTile();
                if (!canMove()) gameOver = true;
            }
            draw();
        }

        // Merge tiles in a stack
        function mergeTiles(stack) {
            let result = [];
            let i = 0;
            while (i < stack.length) {
                if (i + 1 < stack.length && stack[i] === stack[i + 1]) {
                    let newValue = stack[i] * 2;
                    result.push(newValue);
                    score += newValue;
                    i += 2;
                } else {
                    result.push(stack[i]);
                    i++;
                }
            }
            return result.concat(Array(gridSize - result.length).fill(0));
        }

        // Check if any moves are possible
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

        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (gameOver && e.key === 'Enter') {
                initGrid();
                score = 0;
                gameOver = false;
                draw();
            } else if (!gameOver) {
                if (e.key === 'ArrowUp') move('up');
                else if (e.key === 'ArrowDown') move('down');
                else if (e.key === 'ArrowLeft') move('left');
                else if (e.key === 'ArrowRight') move('right');
            }
        });

        // Handle touch input for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchend', (e) => {
            if (gameOver) {
                initGrid();
                score = 0;
                gameOver = false;
                draw();
                return;
            }
            let touchEndX = e.changedTouches[0].clientX;
            let touchEndY = e.changedTouches[0].clientY;
            let dx = touchEndX - touchStartX;
            let dy = touchEndY - touchStartY;
            let absDx = Math.abs(dx);
            let absDy = Math.abs(dy);

            if (Math.max(absDx, absDy) > 30) { // Minimum swipe distance
                if (absDx > absDy) {
                    if (dx > 0) move('right');
                    else move('left');
                } else {
                    if (dy > 0) move('down');
                    else move('up');
                }
            }
        });

        // Start the game
        initGrid();
        draw();