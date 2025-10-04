import { useState } from "react";
import "./Board.css";

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

type Cell = 'X' | 'O' | null;
type GameStatus = 'playing' | 'won' | 'lost' | 'draw';

interface WinnerInfo { winner: 'X' | 'O' | null; line: number[] | null; isDraw: boolean; }

function evaluateBoard(board: Cell[]): WinnerInfo {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c], isDraw: false };
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

  function handlePlayerMove(idx: number) {
    if (gameStatus !== 'playing' || board[idx] !== null) return;
    const next = [...board];
    next[idx] = 'X';
    updateStatus(next);
    const after = evaluateBoard(next);
    if (!after.winner && !after.isDraw) { const ai = bestComputerMove(next); if (ai !== null) next[ai] = 'O'; }
    updateStatus(next);
    setBoard(next);
  }

  function restartGame() { setBoard(Array(9).fill(null)); setWinningLine(null); setGameStatus('playing'); }

  function renderEndGameMessage() {
    if (gameStatus === 'playing') return null;
    return (<div className="game-overlay"><div className="end-game-message">{gameStatus === 'won' && (<div className="win-message"><div className="message-text win-text">🎉 YOU WIN! 🎉</div><div className="sub-text">Congratulations! You beat the AI!</div></div>)}{gameStatus === 'lost' && (<div className="lose-message"><div className="message-text lose-text">💔 YOU LOSE! 💔</div><div className="sub-text">Better luck next time!</div></div>)}{gameStatus === 'draw' && (<div className="draw-message"><div className="message-text draw-text">🤝 IT'S A DRAW! 🤝</div><div className="sub-text">Great minds think alike!</div></div>)}<button className="play-again-btn" onClick={restartGame}>🚀 PLAY AGAIN 🚀</button></div></div>);
  }

  function renderCell(i: number) {
    const v = board[i];
    const win = winningLine?.includes(i);
    let id: string | undefined; if (win) id = 'Y'; else if (v === 'O') id = 'O';
    return (<div className="SquareTile" onClick={() => handlePlayerMove(i)}>{v === null ? (<div className="filler" id=".">.</div>) : (<div className="filled" id={id}>{v}</div>)}</div>);
  }

  return (<><div className="game-container"><div className="board-container">{[0,1,2].map(renderCell)}{[3,4,5].map(renderCell)}{[6,7,8].map(renderCell)}</div><button className="reset" onClick={restartGame}>Reset Game</button></div>{renderEndGameMessage()}</>);
}
