
/* Snakes and Ladders Game Logic:

The game board is a 10x10 grid.

The tiles of the board are numbered from 1 (start) to 100 (finish).
Special tiles will be randomly assigned to a set number of tiles between 2 and 99.
Special tiles include:
    - Shooting stars (ladders): Move the player up to a higher numbered tile.
    - Black  holes (Snakes): Send the player down to a lower numbered tile.
Tile number 99 will always be a black hole that sends the player back to 1.

Players will take it in turns to roll a six-sided dice.
Each player will move forward by the number rolled on the dice.
If they landf on a special tile they will moved to the target tile of that special tile.
The first player to reach tile 100 / finsih wins the game.
 */

/**
 * Rolls the dice
 * @returns {number} A random integer between 1 and 6
 */
export function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

/**
 * Maps of special tiles
 * @returns {Object.<number, {type: string, target: number}>} Mapping of special tile numbers to effect
 */
export function SpecialTiles() {
    const numLadders = 7; // Number of stars
    const numSnakes = 8; // Number of black holes
    // Arrays to hold stars and black holes
    const ladders = []; 
    const snakes = [];
  
    // Set to make sure these tiles are not reused
    const used = new Set([1, 100, 99]);
  
    // Randomly assign stars to tiles between 2 and 96
    while (ladders.length < numLadders) {
        const start = Math.floor(Math.random() * 95) + 2; // between 2 and 96
        // End tile is always higher than start tile to make sure the star always moves player up
        const end = start + Math.floor(Math.random() * (100 - start - 1)) + 1;
        // Ensure start and end are not already used and end is below 99 
        if (!used.has(start) && !used.has(end) && end < 99) {
            ladders.push({ type: 'ladder', start, end });
            // Mark these tiles as used
            used.add(start);
            used.add(end);
        }
    }
  
    // The same as above but for black holes
    while (snakes.length < numSnakes) {
        const a = Math.floor(Math.random() * 98) + 2; // between 2 and 99
        const z = Math.floor(Math.random() * (a - 1)) + 1;
      // Start is a and end is z
        if (!used.has(a) && !used.has(z) && z > 1) {
            snakes.push({ type: 'snake', start: a, end: z });
            used.add(a);
            used.add(z);
        }
    }
  
    // Always add black hole on 99 to 1
    snakes.push({ type: 'snake', start: 99, end: 1 });
  
    // Object to store info about special tiles
    /**
     * @type {Object.<number, {type: string, target: number}>}
     */
    const tiles = {};
    for (const l of ladders) tiles[l.start] = { type: 'ladder', target: l.end };
    for (const s of snakes) tiles[s.start] = { type: 'snake', target: s.end };
    return tiles;
  }

  export const specialTiles = SpecialTiles();

/**
 * Board data for rendering game board
 * @param {number} [rows=10] - Number of rows
 * @param {number} [cols=10] - Number of columns
 * @returns {Array<{number: number, special: {type: string, target: number} | null}>} Array of tile data
 */
export function BoardData(specialTiles, rows = 10, cols = 10) {
    const total = rows * cols;
    const numbers = Array.from({ length: total }, (_, i) => total - i);
    return numbers.map(num => ({
        number: num,
        special: specialTiles[num] || null
    }));
}

/**
 * Updates player position after dice roll
 * @param {number} start - Current position
 * @param {number} roll - Roll number
 * @returns {number} New player position 
 */
export function updatePlayerPosition(start, roll) {
    const end = start + roll;
    return end > 100 ? 100 : end;
}

/* Fake failure for testing purposes: 
(Remove this comment to enable the fail version) 
export function updatePlayerPosition(pos, roll) {
    // Deliberate bug
    return pos + roll;
  } */

/**
 * Applies effect of special tile
 * @param {number} position - Current tile number
 * @returns {number} New tile number after applying the special tile (or the original position)
 */
export function applySpecialTile(position, specialTiles) {
    return specialTiles[position]?.target || position;
}

/**
 * Checks for win is player is on tile 100
 * @param {number} position - Tile number
 * @returns {boolean} True if player is on tile 100
 */
export function checkWin(position) {
    return position === 100;
}