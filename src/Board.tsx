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

//hey6
//hey4

//hey3
//hey2

type GameStatus = 'playing' | 'won' | 'lost' | 'draw';
type GameResult = {
  id: string;
  result: 'won' | 'lost' | 'draw';
  date: string;
  moves: number;
};

let updateTileColor;
let winDeclared = false;
let moveCount = 0;

export default function Game() {
  const createTileSetup = Array(9).fill(
    <div className="filler" id=".">
      .
    </div>
  );

  const [tiles, setTiles] = useState(createTileSetup);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>(() => {
    const saved = localStorage.getItem('ticTacToeHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    CheckGameBoard();
  }, [tiles]);

  const saveGameResult = (result: 'won' | 'lost' | 'draw') => {
    const newGame: GameResult = {
      id: Date.now().toString(),
      result,
      date: new Date().toLocaleDateString(),
      moves: moveCount
    };
    
    const updatedHistory = [newGame, ...gameHistory].slice(0, 5); // Keep only last 5 games
    setGameHistory(updatedHistory);
    localStorage.setItem('ticTacToeHistory', JSON.stringify(updatedHistory));
  };

  function GameHistory() {
    const getResultIcon = (result: string) => {
      switch (result) {
        case 'won': return '🎉';
        case 'lost': return '💔';
        case 'draw': return '🤝';
        default: return '?';
      }
    };

    const getResultText = (result: string) => {
      switch (result) {
        case 'won': return 'WIN';
        case 'lost': return 'LOSS';
        case 'draw': return 'DRAW';
        default: return '?';
      }
    };

    if (gameHistory.length === 0) {
      return (
        <div className="history-panel">
          <div className="history-header">
            <h3 className="history-title">🏆 Game History</h3>
            <div className="history-subtitle">Last 5 Games</div>
          </div>
          <div className="history-empty">
            <div className="empty-icon">🎮</div>
            <div className="empty-text">No games played yet</div>
            <div className="empty-subtext">Start playing to see your history!</div>
          </div>
        </div>
      );
    }

    return (
      <div className="history-panel">
        <div className="history-header">
          <h3 className="history-title">🏆 Game History</h3>
          <div className="history-subtitle">Last 5 Games</div>
        </div>
        <div className="history-list">
          {gameHistory.map((game, index) => (
            <div key={game.id} className={`history-item ${game.result}`}>
              <div className="history-rank">#{index + 1}</div>
              <div className="history-icon">{getResultIcon(game.result)}</div>
              <div className="history-details">
                <div className="history-result">{getResultText(game.result)}</div>
                <div className="history-meta">
                  <span className="history-moves">{game.moves} moves</span>
                  <span className="history-date">{game.date}</span>
                </div>
              </div>
              <div className={`history-badge ${game.result}-badge`}>
                {getResultText(game.result)}
              </div>
            </div>
          ))}
        </div>
        <div className="history-stats">
          <div className="stat-item won">
            <span className="stat-number">{gameHistory.filter(g => g.result === 'won').length}</span>
            <span className="stat-label">Wins</span>
          </div>
          <div className="stat-item lost">
            <span className="stat-number">{gameHistory.filter(g => g.result === 'lost').length}</span>
            <span className="stat-label">Losses</span>
          </div>
          <div className="stat-item draw">
            <span className="stat-number">{gameHistory.filter(g => g.result === 'draw').length}</span>
            <span className="stat-label">Draws</span>
          </div>
        </div>
      </div>
    );
  }

  function placeTile(PlayerIndex: number) {
    moveCount++;
    const updateTile = tiles.slice();
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
    // Check for winner
    for (let i = 0; i < 8; i++) {
      const [a, b, c] = possibilities[i];
      if (
        winDeclared == false &&
        tiles[a].props.id !== "." &&
        tiles[a].props.id == tiles[b].props.id &&
        tiles[a].props.id == tiles[c].props.id
      ) {
        winDeclared = true;
        const winningPlayer = tiles[a].props.id;
        
        updateTileColor = tiles.slice();
        updateTileColor[a] = (
          <div className="filled" id="Y">
            {winningPlayer}
          </div>
        );
        updateTileColor[b] = (
          <div className="filled" id="Y">
            {winningPlayer}
          </div>
        );
        updateTileColor[c] = (
          <div className="filled" id="Y">
            {winningPlayer}
          </div>
        );
        setTiles(updateTileColor);
        
        // Set game status based on winner
        setWinner(winningPlayer);
        if (winningPlayer === 'X') {
          setGameStatus('won');
          saveGameResult('won');
        } else {
          setGameStatus('lost');
          saveGameResult('lost');
        }
        
        return winningPlayer;
      }
    }
    
    // Check for draw (all tiles filled, no winner)
    const filledTiles = tiles.filter(tile => tile.props.id !== '.').length;
    if (filledTiles === 9 && !winDeclared) {
      setGameStatus('draw');
      saveGameResult('draw');
      return "Draw";
    }
    
    return "Continue";
  }

  function restartGame() {
    winDeclared = false;
    moveCount = 0;
    setGameStatus('playing');
    setWinner(null);
    setTiles(
      Array(9).fill(
        <div className="filler" id=".">
          .
        </div>
      )
    );
  }

  function renderEndGameMessage() {
    if (gameStatus === 'playing') return null;

    return (
      <div className="game-overlay">
        <div className="end-game-message">
          {gameStatus === 'won' && (
            <div className="win-message">
              <div className="message-text win-text">🎉 YOU WIN! 🎉</div>
              <div className="sub-text">Congratulations! You beat the AI!</div>
            </div>
          )}
          
          {gameStatus === 'lost' && (
            <div className="lose-message">
              <div className="message-text lose-text">💔 YOU LOSE! 💔</div>
              <div className="sub-text">Better luck next time!</div>
            </div>
          )}
          
          {gameStatus === 'draw' && (
            <div className="draw-message">
              <div className="message-text draw-text">🤝 IT'S A DRAW! 🤝</div>
              <div className="sub-text">Great minds think alike!</div>
            </div>
          )}
          
          <button className="play-again-btn" onClick={restartGame}>
            🚀 PLAY AGAIN 🚀
          </button>
        </div>
      </div>
    );
  }

  function makeBoard() {
    return (
      <div className="game-container">
        <div className="game-main">
          <div className="board-container">
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
          </div>

          <button
            className="reset"
            onClick={restartGame}
          >
            Reset Game
          </button>
        </div>
        
        <GameHistory />
      </div>
    );
  }

  return (
    <>
      {makeBoard()}
      {renderEndGameMessage()}
    </>
  );
}
