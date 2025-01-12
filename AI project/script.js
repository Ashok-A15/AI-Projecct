const GRID_SIZE = 10;
const gridContainer = document.getElementById("grid-container");
const solveButton = document.getElementById("solve-button");
const resetButton = document.getElementById("reset-button");

let grid = [];
let startCell = null;
let endCell = null;

// Initialize the grid
function createGrid() {
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Add click listener for cell interactions
      cell.addEventListener("click", () => handleCellClick(cell));

      grid[row][col] = cell;
      gridContainer.appendChild(cell);
    }
  }
}

// Handle cell interactions (wall, start, end)
function handleCellClick(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (!startCell) {
    startCell = { row, col };
    cell.classList.add("start");
    cell.textContent = "Start";
  } else if (!endCell) {
    endCell = { row, col };
    cell.classList.add("end");
    cell.textContent = "End";
  } else if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
    cell.classList.toggle("wall");
    cell.textContent = cell.classList.contains("wall") ? "" : "";
  }
}

// Reset the grid
function resetGrid() {
  grid.forEach(row => row.forEach(cell => {
    cell.className = "cell";
    cell.textContent = ""; // Clear any text
  }));
  startCell = null;
  endCell = null;
}

// Solve the maze using BFS
function solveMaze() {
  if (!startCell || !endCell) {
    alert("Please select a start and end point!");
    return;
  }

  const queue = [[startCell]];
  const visited = new Set();
  visited.add(`${startCell.row},${startCell.col}`);

  while (queue.length > 0) {
    const path = queue.shift();
    const { row, col } = path[path.length - 1];

    if (row === endCell.row && col === endCell.col) {
      // Highlight the path
      path.forEach(cell => {
        if (!(cell.row === startCell.row && cell.col === startCell.col) &&
            !(cell.row === endCell.row && cell.col === endCell.col)) {
          grid[cell.row][cell.col].classList.add("path");
        }
      });
      return;
    }

    getNeighbors(row, col).forEach(neighbor => {
      const key = `${neighbor.row},${neighbor.col}`;
      if (!visited.has(key) && !grid[neighbor.row][neighbor.col].classList.contains("wall")) {
        visited.add(key);
        queue.push([...path, neighbor]);
      }
    });
  }

  alert("No path found!");
}

// Get valid neighbors
function getNeighbors(row, col) {
  const neighbors = [];
  if (row > 0) neighbors.push({ row: row - 1, col });
  if (row < GRID_SIZE - 1) neighbors.push({ row: row + 1, col });
  if (col > 0) neighbors.push({ row, col: col - 1 });
  if (col < GRID_SIZE - 1) neighbors.push({ row, col: col + 1 });
  return neighbors;
}

// Event Listeners
solveButton.addEventListener("click", solveMaze);
resetButton.addEventListener("click", resetGrid);

// Create the grid on page load
createGrid();
