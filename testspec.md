Unit Test Specifications for Snakes & Ladders:

1. Setup:
    Should create a new game with two players both at position 1 and start with player1's turn.

2. Dice Roll:
    Should return a random number between 1 and 6.
    Never return <1 or >6.

3. Player Positiomn:
    Should move the current player by the roll amount.
    Adds the roll to current position.
    Should never return >100.
    Returns exactly 100 if roll lands on it.
    Should fail if player can pass 100.
    
4. Special Tiles:
    If tile has a star or black hole it returns the target tile between 1 and 99.
    Tile 99 always sends player back to tile 1.
    Otherwise, returns same position.
    No duplicate special tile starts or ends.
    Should fail if duplicate tiles are present.

5. Turns:
    Should alternate between player1 and player2.

6. Winning:
    Should check if tehre is a winner when a player reaches tile 100 and then end the game.
    Returns true only if position is exactly 100.
    Otherwise, returns false.