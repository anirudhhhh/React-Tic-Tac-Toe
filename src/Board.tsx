import { useState } from "react";
import "./Board.css";

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

type Cell = 'X' | 'O' | null;
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

interface WinnerInfo { winner: 'X' | 'O' | null; line: number[] | null; isDraw: boolean; }

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
  }
  const isDraw = board.every(c => c !== null);
  return { winner: null, line: null, isDraw };
}

function minimax(board: Cell[], depth: number, isMax: boolean, alpha: number, beta: number): number {
  const { winner, isDraw } = evaluateBoard(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isDraw) return 0;
  const moves = board.map((v, i) => (v === null ? i : -1)).filter(i => i !== -1) as number[];
  if (isMax) {
    let best = -Infinity; for (const idx of moves) { board[idx] = 'O'; const s = minimax(board, depth + 1, false, alpha, beta); board[idx] = null; if (s > best) best = s; alpha = Math.max(alpha, s); if (beta <= alpha) break; } return best;
  } else {
    let best = Infinity; for (const idx of moves) { board[idx] = 'X'; const s = minimax(board, depth + 1, true, alpha, beta); board[idx] = null; if (s < best) best = s; beta = Math.min(beta, s); if (beta <= alpha) break; } return best;
  }
}

function bestComputerMove(board: Cell[]): number | null {
  if (board.every(c => c === null)) return Math.random() < 0.5 ? 4 : [0, 2, 6, 8][Math.floor(Math.random() * 4)];
  let bestScore = -Infinity, bestMoves: number[] = [];
  for (let i = 0; i < board.length; i++) if (board[i] === null) { board[i] = 'O'; const score = minimax(board, 0, false, -Infinity, Infinity); board[i] = null; if (score > bestScore) { bestScore = score; bestMoves = [i]; } else if (score === bestScore) bestMoves.push(i); }
  if (!bestMoves.length) return null; return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export default function Game() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  function updateStatus(b: Cell[]) {
    const { winner, line, isDraw } = evaluateBoard(b);
    if (winner) { setWinningLine(line); setGameStatus(winner === 'X' ? 'won' : 'lost'); }
    else if (isDraw) setGameStatus('draw');
    else setGameStatus('playing');
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

  function restartGame() { setBoard(Array(9).fill(null)); setWinningLine(null); setGameStatus('playing'); }

  function renderEndGameMessage() {
    if (gameStatus === 'playing') return null;
    return (<div className="game-overlay"><div className="end-game-message">{gameStatus === 'won' && (<div className="win-message"><div className="message-text win-text">🎉 YOU WIN! 🎉</div><div className="sub-text">Congratulations! You beat the AI!</div></div>)}{gameStatus === 'lost' && (<div className="lose-message"><div className="message-text lose-text">💔 YOU LOSE! 💔</div><div className="sub-text">Better luck next time!</div></div>)}{gameStatus === 'draw' && (<div className="draw-message"><div className="message-text draw-text">🤝 IT'S A DRAW! 🤝</div><div className="sub-text">Great minds think alike!</div></div>)}<button className="play-again-btn" onClick={restartGame}>🚀 PLAY AGAIN 🚀</button></div></div>);
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

  return (<><div className="game-container"><div className="board-container">{[0,1,2].map(renderCell)}{[3,4,5].map(renderCell)}{[6,7,8].map(renderCell)}</div><button className="reset" onClick={restartGame}>Reset Game</button></div>{renderEndGameMessage()}</>);
}
