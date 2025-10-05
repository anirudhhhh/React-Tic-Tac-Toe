# 🎮 React Tic Tac Toe (Single Player)

A fun and interactive **single-player Tic Tac Toe** game built with **React + TypeScript**.  
Challenge the AI, track your match history, and enjoy a nostalgic classic reimagined for the web.

---

## 🧩 Overview

This project implements a **Tic Tac Toe** game where the player competes against a computer opponent powered by a **minimax algorithm** with alpha-beta pruning.  
It also maintains a **local game history** that shows your recent wins, losses, and draws (up to the last 5 games).

Even though there are a few rough edges in the current version, the project showcases how to:
- Manage game logic and UI with React hooks.
- Implement and visualize a simple AI opponent.
- Store data persistently using **localStorage**.
- Render responsive layouts and status messages dynamically.

---

## 🕹️ Features

✅ Play as **X** against a computer opponent (**O**).  
✅ Displays win, loss, or draw messages with emojis.  
✅ Keeps your last **5 games** saved locally in the browser.  
✅ Clean and minimal interface with custom styling (`Board.css`).  
✅ Reset and play again anytime.

---

## 🧠 Tech Stack

- **React** (Functional Components + Hooks)
- **TypeScript**
- **CSS** for UI styling
- **LocalStorage** for saving game history
- **Minimax Algorithm (with Alpha-Beta Pruning)** – powers the AI opponent  

---

## 🗂️ Project Structure

[src](./src/)  
  ├── [board.css](./src/Board.css)  
  ├── [board.tsx](./src/Board.tsx)  

The entire game logic (rendering, AI, game state, and UI) lives in [Board.tsx](./src/Board.tsx).

---

## 🚀 Getting Started

Follow these steps to run the project locally:

1. **Clone the repository**

  ```bash
  git clone https://github.com/<your-username>/<repo-name>.git
  ```
2. **Navigate to the project**
  ```bash
  cd <repo-name>
  ```
3. **Install dependencies**
  ```bash
  npm install
  ```
4. **Run the app**
  ```bash
  npm run dev
  ```
5. **Open your browser and go to http://localhost:5173**

---

## 🎯 How to Play

1. Click on a square to place your **X**.  
2. The computer will respond with an **O**.  
3. The game ends when either player wins or all tiles are filled.  
4. Results are automatically stored and shown in the **Game History** section.  
5. Use the **Reset Game** button to start a new round.

---

## 👨‍💻 Contributing

Contributions are welcome!  
Please refer to [CONTRIBUTION GUIDELIENS](./CONTRIBUTING.md) for making a contribution.
