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

  function checkLine(
    tileSample: typeof tiles,
    a: number,
    b: number,
    c: number,
    character: string
  ) {
    if (
      tileSample[a].props.id == "." &&
      tileSample[b].props.id == character &&
      tileSample[c].props.id == character
    ) {
      return a;
    }
    if (
      tileSample[b].props.id == "." &&
      tileSample[a].props.id == character &&
      tileSample[c].props.id == character
    ) {
      return b;
    }
    if (
      tileSample[c].props.id == "." &&
      tileSample[b].props.id == character &&
      tileSample[a].props.id == character
    ) {
      return c;
    }
    return 10;
  }

  function ComputerMove(tileSample: typeof tiles): number {
    if (tileSample[4].props.id == ".") {
      return 4;
    }

    for (let i = 0; i < 3; i++) {
      if (checkLine(tileSample, i, i + 3, i + 6, "O") !== 10) {
        return checkLine(tileSample, i, i + 3, i + 6, "O");
      }
    }

    for (let i = 0; i <= 6; i += 3) {
      if (checkLine(tileSample, i, i + 1, i + 2, "O") !== 10) {
        return checkLine(tileSample, i, i + 1, i + 2, "O");
      }
    }

    if (checkLine(tileSample, 0, 4, 8, "O") !== 10) {
      return checkLine(tileSample, 0, 4, 8, "O");
    }

    if (checkLine(tileSample, 2, 4, 6, "O") !== 10) {
      return checkLine(tileSample, 2, 4, 6, "O");
    }

    for (let i = 0; i < 3; i++) {
      if (checkLine(tileSample, i, i + 3, i + 6, "X") !== 10) {
        return checkLine(tileSample, i, i + 3, i + 6, "X");
      }
    }

    for (let i = 0; i <= 6; i += 3) {
      if (checkLine(tileSample, i, i + 1, i + 2, "X") !== 10) {
        return checkLine(tileSample, i, i + 1, i + 2, "X");
      }
    }

    if (checkLine(tileSample, 0, 4, 8, "X") !== 10) {
      return checkLine(tileSample, 0, 4, 8, "X");
    }

    if (checkLine(tileSample, 2, 4, 6, "X") !== 10) {
      return checkLine(tileSample, 2, 4, 6, "X");
    }

    if (
      tileSample[1].props.id == "." ||
      tileSample[3].props.id == "." ||
      tileSample[5].props.id == "." ||
      tileSample[7].props.id == "."
    ) {
      let edgeRandom = Math.floor(Math.random() * 4) * 2 + 1;
      return tileSample[edgeRandom].props.id == "."
        ? edgeRandom
        : ComputerMove(tileSample);
    }
    let anyRandom = Math.floor(Math.random() * 9);
    return tileSample[anyRandom].props.id == "."
      ? anyRandom
      : ComputerMove(tileSample);
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
