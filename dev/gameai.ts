/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate
    
    public static moveKnight(king:King, knights: Knight[], gameState:GameState) {
        let t0 = performance.now();

        /*
         // TODO: remove random move, amnd replace with AI move
        // RANDOM MOVE - START ------------------

        console.log(king); // only to avoid error: 'king' is declared but its value is never read.

        // choose knight to move
        let i:number =  Math.floor(Math.random() * Math.floor(knights.length));

        let legalMoves: [number, number][] = knights[i].getMoves();

        console.log(legalMoves);

        let j:number =  Math.floor(Math.random() * Math.floor(legalMoves.length));

        knights[i].setPosition(legalMoves[j]);
        gameState.knightPositions[i] = legalMoves[j];

        // RANDOM MOVE - END   ------------------
        */

       let minEval = +Infinity
       let bestMove: any

       // Decide the best move for each knight
        for (const [index, knight] of knights.entries()) {
            // evaluate all possible moves for knight
            for (let move of knight.getMoves()) {
                let gameStateCopy = gameState.copy();
                gameStateCopy.knightPositions[index] = move

                // Save only the best move
                let moveEvaluation = Math.min(minEval, this.miniMax(3, true, gameStateCopy, king, knights))
                bestMove = [index, moveEvaluation]
            }
        }

        // Best move is found not move the knight that has the best move to that place
        knights[bestMove[0]].setPosition(bestMove[1])
        // Update the gamestate to reflect the new location
        gameState.knightPositions[bestMove[0]] = bestMove[1];

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");
    }

    static miniMax(depth:number, maximizingPlayer:boolean, game:GameState, king:King, knights:Knight[]) : number {
        // No more depth to check
        if (depth === 0) {
            return game.getScore()[0]
        }

        // If either side wins return static evaluation of position
        if (game.getScore()[0] === -100 || game.getScore()[0] === 100) {
            return game.getScore()[0]
        }

        if (maximizingPlayer) {
            // Best position for king
            let maxEval = -Infinity

            // Check all possible moves from a given starting position for the king
            for (const move of king.getMoves(game.kingPos)) {
                // Make a backup of the gamestate to test some outcomes for moves
                let gameStateCopy = game.copy();
                // set king position to the move we want to evaluate
                gameStateCopy.kingPos = move

                // Get the highest evalutation for the next level down. Uses the currently being tested gameStateCopy
                maxEval = Math.max(maxEval, this.miniMax(depth -1, false, gameStateCopy, king, knights))
            }
            return maxEval
        } else {
            // Best position for knight
            let minEval = +Infinity

            // First iterate over all knights
            for (const [index, knight] of knights.entries()) {
                // Check all possible moves for a given knight at a given starting position
                for (const move of knight.getMoves(game.knightPositions[index])) {
                    // Make a backup of the gamestate to test some outcomes for moves
                    let gameStateCopy = game.copy()
                    // set knight position to the move we want to evaluate
                    gameStateCopy.knightPositions[index] = move

                    // Get the lowest evalutation for the next level down. Uses the currently being tested gameStateCopy
                    minEval = Math.min(minEval, this.miniMax(depth -1, true, gameStateCopy, king, knights))
                }
            }
            return minEval
        }
    }
}