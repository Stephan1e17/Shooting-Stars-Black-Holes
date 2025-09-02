import * as R from "ramda";

// When running my tests, please type the following command into the terminal:
// npx mocha --experimental-vm-modules web-app/tests/gametest.test.js

import {
  rollDice,
  updatePlayerPosition,
  applySpecialTile,
  checkWin,
  SpecialTiles
} from '../snakesandladders.js';

import { expect } from 'chai';

describe('Snakes and Ladders Game Logic', () => {

  //Dice Rolling Test://
  describe('rollDice()', () => {
    /**
     * @function
     * @description
     * Tests that rollDice returns a value between 1 and 6.
     * Checks that the random dice never returns values outside of range.
     */
    it('Should return a number between 1 and 6', () => {
      for (let i = 0; i < 100; i++) {
        const roll = rollDice();
        expect(roll, `roll was ${roll}`).to.be.within(1,6);
      }
      });
    
    });
  });

  //Player Position Tests://
  describe('updatePlayerPosition()', () => {
    /**
     * @function
     * @description
     * Tests that player's position moves correctly based on dice roll value.
     * Fails if the player does not move by the roll value.
     */
    it('Should move the player by the roll value', () => {
        [
            {start: 1, roll: 3, expected: 4},
            {start: 98, roll: 3, expected: 100},
            {start: 99, roll: 1, expected: 100},
            {start: 100, roll: 6, expected: 100}
        ].forEach(({start, roll, expected}) => {
            const result = updatePlayerPosition(start, roll);
            if (result !== expected) {
                throw new Error(
                  `updatePlayerPosition(${start}, ${roll}) returned ${result}, expected ${expected}`
                );
            }
        });
    });

    /**
     * @function
     * @description
     * Checks that player position never passes 100.
     * This will fail if the cap is missing in snakesandladders.js.
     */
    it('Should never return a value greater than 100', () => {
      const start = 98;
      const roll = 5;
      const result = updatePlayerPosition(start, roll);
      const expected = 100;
      if (result !== expected) {
          throw new Error(
              `updatePlayerPosition(${start},${roll}) returned ${result}, expected ${expected} (should not exceed 100)`
          );
      }
    });

    /**
     * @function
     * @description
     * Checks that landing exactly on tile 100 returns 100.
     */
    it('Should return 100 if the player lands on it', () => {
        const result = updatePlayerPosition(99, 1);
        if (result !== 100) {
            throw new Error(
                `updatePlayerPosition(99,1) returned ${result}, expected 100 (should return 100 when landing exactly on 100)`
            );
        }
    });
});

//Special Tile Tests://
describe('applySpecialTile()', () => {
  /**
     * @function
     * @description
     * Checks that player landing on special tile is moved to the correct target tile.
     */
  it('Should move to target on ladder', () => {
      const tiles = { 5: { type: 'ladder', target: 15 } };
      expect(applySpecialTile(5, tiles)).to.equal(15);
  });
  it('Should move to target on black hole', () => {
      const tiles = { 25: { type: 'snake', target: 3 } };
      expect(applySpecialTile(25, tiles)).to.equal(3);
  });
  /**
     * @function
     * @description
     * Checks that landing on tile 99 always sends player back to tile 1.
     */
  it('Should move from 99 down to 1', () => {
      const tiles = { 99: { type: 'snake', target: 1 } };
      expect(applySpecialTile(99, tiles)).to.equal(1);
  });
  it('Should not move when landing on a normal tile', () => {
    /**
     * @function
     * @description
     * Checks that landing on a normal tile does not change position.
     */
      const tiles = { 8: { type: 'ladder', target: 20 } };
      expect(applySpecialTile(10, tiles)).to.equal(10);
  });
});

describe('SpecialTiles()', () => {
  /**
     * @function
     * @description
     * Checks that no special tiles have duplicate starts or ends.
     */
  it('Should not have duplicate starts or ends', () => {
      const tiles = SpecialTiles();
      const starts = Object.keys(tiles);
      const ends = Object.values(tiles).map(t => t.target);
      expect(new Set(starts).size).to.equal(starts.length);
      expect(new Set(ends).size).to.equal(ends.length);
  });
});

//Win Condition Tests://
describe('checkWin()', () => {
  /**
     * @function
     * @description
     * Checks that checkWin only returns true if player is on tile 100.
     */
  it('Should return true at tile 100', () => {
      expect(checkWin(100)).to.be.true;
      [0, 1, 50, 99, 101].forEach(pos => {
          expect(checkWin(pos)).to.be.false;
      });
  });
});
