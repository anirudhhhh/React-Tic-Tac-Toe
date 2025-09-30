import { useState, useEffect } from "react";
import "./Board.css";

let possibilities = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
//hey
//hey7
let updateTileColor;
let winDeclared = false;
let moveCount = 0;

export default function Game() {
  let createTileSetup = Array(9).fill(
    <div className="filler" id=".">
      .
    </div>
  );

  const [tiles, setTiles] = useState(createTileSetup);

  useEffect(() => {
    CheckGameBoard();
  }, [tiles]);

  function placeTile(PlayerIndex: number) {
    moveCount++;
    let updateTile = tiles.slice();
    updateTile[PlayerIndex] = (
      <div className="filled" id="X">
        X
      </div>
    );
    console.log(moveCount);
    if (moveCount < 5) {
      updateTile[ComputerMove(updateTile)] = (
        <div className="filled" id="O">
          O
        </div>
      );
    }

    setTiles(updateTile);
  }

  function getAvailableMoves(tileSample: typeof tiles): number[] {
    return tileSample.reduce((acc: number[], tile, idx) => {
      if (tile.props.id === ".") acc.push(idx);
      return acc;
    }, []);
  }

  function evaluate(tileSample: typeof tiles): number {
    for (const [a, b, c] of possibilities) {
      if (
        tileSample[a].props.id !== "." &&
        tileSample[a].props.id === tileSample[b].props.id &&
        tileSample[a].props.id === tileSample[c].props.id
      ) {
        return tileSample[a].props.id === "O" ? 1 : -1;
      }
    }
    return 0;
  }

  function minimax(
    newBoard: typeof tiles,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    const score = evaluate(newBoard);
    if (
      score === 1 ||
      score === -1 ||
      getAvailableMoves(newBoard).length === 0
    ) {
      return score;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const idx of getAvailableMoves(newBoard)) {
        const boardCopy = [...newBoard];
        boardCopy[idx] = (
          <div className="filled" id="O">
            O
          </div>
        );
        const evalScore = minimax(boardCopy, depth + 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const idx of getAvailableMoves(newBoard)) {
        const boardCopy = [...newBoard];
        boardCopy[idx] = (
          <div className="filled" id="X">
            X
          </div>
        );
        const evalScore = minimax(boardCopy, depth + 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  function ComputerMove(tileSample: typeof tiles): number {
    let bestScore = -Infinity;
    let move = -1;
    for (const idx of getAvailableMoves(tileSample)) {
      const boardCopy = [...tileSample];
      boardCopy[idx] = (
        <div className="filled" id="O">
          O
        </div>
      );
      const score = minimax(boardCopy, 0, -Infinity, Infinity, false);
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
    return move;
  }

  function tileClicked(index: number) {
    if (
      CheckGameBoard() == "Continue" &&
      !winDeclared &&
      tiles[index].props.id == "."
    ) {
      placeTile(index);
    }
  }

  function CheckGameBoard() {
    for (let i = 0; i < 8; i++) {
      let [a, b, c] = possibilities[i];
      if (
        winDeclared == false &&
        tiles[a].props.id !== "." &&
        tiles[a].props.id == tiles[b].props.id &&
        tiles[a].props.id == tiles[c].props.id
      ) {
        winDeclared = true;
        updateTileColor = tiles.slice();
        updateTileColor[a] = (
          <div className="filled" id="Y">
            {tiles[a].props.id}
          </div>
        );
        updateTileColor[b] = (
          <div className="filled" id="Y">
            {tiles[a].props.id}
          </div>
        );
        updateTileColor[c] = (
          <div className="filled" id="Y">
            {tiles[a].props.id}
          </div>
        );
        setTiles(updateTileColor);
        return tiles[a].props.id;
      }
    }
    return "Continue";
  }

  function makeBoard() {
    return (
      <>
        <div className="BoardRow">
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(0);
            }}
          >
            {tiles[0]}
          </div>
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(1);
            }}
          >
            {tiles[1]}
          </div>
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(2);
            }}
          >
            {tiles[2]}
          </div>
        </div>
        <div className="BoardRow">
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(3);
            }}
          >
            {tiles[3]}
          </div>
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(4);
            }}
          >
            {tiles[4]}
          </div>
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(5);
            }}
          >
            {tiles[5]}
          </div>
        </div>
        <div className="BoardRow">
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(6);
            }}
          >
            {tiles[6]}
          </div>
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(7);
            }}
          >
            {tiles[7]}
          </div>
          <div
            className="SquareTile"
            onClick={() => {
              tileClicked(8);
            }}
          >
            {tiles[8]}
          </div>
        </div>

        <button
          className="reset"
          onClick={() => {
            winDeclared = false;
            moveCount = 0;
            setTiles(
              Array(9).fill(
                <div className="filler" id=".">
                  .
                </div>
              )
            );
          }}
        >
          reset
        </button>
      </>
    );
  }

  return <>{makeBoard()}</>;
}
