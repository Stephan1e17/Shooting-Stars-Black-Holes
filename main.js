/**
 * @fileoverview
 * Main file for game board display,, player movement, special tile effects,
 * win checking, and player turn management.
 * Game logic from snakesandladders.js is imported here.
 */

import {
    rollDice,
    BoardData,
    updatePlayerPosition,
    applySpecialTile,
    checkWin,
    specialTiles
} from "./snakesandladders.js";

/**
 * Creates HTML game board.
 * @param {Array<Object>} boardData - Array of tile objects
 * @param {number} [rows=10] - Number of rows
 * @param {number} [cols=10] - Number of columns
 */
function gameBoard(boardData, rows = 10, cols = 10) {
    const board = document.getElementById('board');
    const rowArrays = [];
    for (let i = 0; i < rows; i++) {
        let row = boardData.slice(i * cols, (i + 1) * cols);
        if (i % 2 === 1) row = row.reverse(); // zig-zag pattern
        rowArrays.push(row);
    }
    const html = rowArrays.map(row =>
        `<tr>` +
        row.map(tile => {
            const classes = tile.special ? tile.special.type : '';
            let label = tile.number === 1 ? "Start" : tile.number === 100 ? "Finish" : tile.number;
            return `<td class="${classes}" data-tile="${tile.number}">${label}</td>`;
        }).join('') +
        `</tr>`
    ).join('');
    board.innerHTML = html;
}

/**
 * Moves a player to a specific tile.
 * @param {string} playerId - Player DOM element ID
 * @param {number} position - Tile number to move to
 */
function movePlayer(playerId, position) {
    const player = document.getElementById(playerId);
    const tile = document.querySelector(`td[data-tile="${position}"]`);
    const board = document.querySelector('.grid-container');
    if (tile && player && board) {
        const tileRect = tile.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        const left = tileRect.left - boardRect.left;
        const top = tileRect.top - boardRect.top;
        player.style.left = `${left + 4}px`;
        player.style.top = `${top + 4}px`;
    }
}

/**
 * Current player positions.
 * @type {{player1: number, player2: number}}
 */
const playerPositions = {
    player1: 1,
    player2: 1,
};

/**
 * Array of special tiles with their effects.
 * @type {Array<Object>}
 */
const boardData = BoardData(specialTiles);
gameBoard(boardData);

/**
 * Updates player positions.
 */
function repositionPlayers() {
    movePlayer("player1", playerPositions.player1);
    movePlayer("player2", playerPositions.player2);
}
// Resize player positions when window size changes
window.addEventListener("resize", repositionPlayers);

/**
 * Tracks player turn.
 * @type {"player1"|"player2"}
 */
let currentPlayer = "player1";

/**
 * Counts total number of moves.
 * @type {number}
 */
let moveCount = 0;

/**
 * Updates display of current player's turn.
 */
function updatePlayerTurnDisplay() {
    const turnEl = document.getElementById('playerTurn');
    turnEl.textContent = currentPlayer === "player1" ? "Player 1's turn" : "Player 2's turn";
}

/**
 * Animates player's step by step movement across the board. - Made with help of Co-Pilot
 * @param {string} playerId - Player DOM element ID
 * @param {number} from - Start tile number
 * @param {number} to - End tile number
 * @returns {Promise<void>} When animation is done
 */
async function animatePlayerMove(playerId, from, to) {
    const step = from < to ? 1 : -1;
    let current = from;
    document.getElementById('rollBtn').disabled = true;
    while (current !== to) {
        current += step;
        movePlayer(playerId, current);
        await new Promise(resolve => setTimeout(resolve, 350));
    }
}

/**
 * Roll button logic
 * - Rolls dice
 * - Moves player
 * - Checks for special tiles and win condition
 * - Switches turns
 * @returns {Promise<void>}
 */
async function handleRoll() {
    const roll = rollDice();
    document.getElementById("diceResult").textContent = `Rolled: ${roll}`;
    let start = playerPositions[currentPlayer];
    let end = updatePlayerPosition(start, roll);
    await animatePlayerMove(currentPlayer, start, end);
    playerPositions[currentPlayer] = end;
    const special = specialTiles[end];
    if (special) {
        const finalPosition = applySpecialTile(end, specialTiles);
        playerPositions[currentPlayer] = finalPosition;
        movePlayer(currentPlayer, finalPosition);
        document.getElementById("diceResult").textContent +=
            special.type === "ladder"
                ? ` 🚀 Shooting Star! Up to ${special.target}`
                : ` 🕳️ Black Hole! Down to ${special.target}`;
    }
    moveCount++;
    document.getElementById("moveCount").textContent = moveCount;
    // Check for win
    if (checkWin(playerPositions[currentPlayer])) {
        // Show win message box
        document.getElementById("winText").textContent = `${currentPlayer === "player1" ? "Player 1" : "Player 2"} wins! Refresh the page to play again.`;
        document.getElementById("winningMessage").style.display = "block";
        document.getElementById("rollBtn").disabled = true;
        return;
    }
    // Switch player
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    updatePlayerTurnDisplay();
    document.getElementById('rollBtn').disabled = false;
}

// Set up event listeners - help from Co-Pilot
document.getElementById("rollBtn").addEventListener("click", handleRoll);

// Initial setup
movePlayer("player1", playerPositions.player1);
movePlayer("player2", playerPositions.player2);
updatePlayerTurnDisplay();

/**
 * Hides instructions box when the 'x' button is clicked - help form Co-Pilot
 */
document.getElementById('closeInstructions').addEventListener('click', function() {
    document.getElementById('instructions').style.display = 'none';
});

/**
 * Hides win message box when the 'x' button is clicked - help from Co-Pilot
 */
document.getElementById('closeWinMessage').addEventListener('click', function() {
    document.getElementById('winningMessage').style.display = 'none';
});