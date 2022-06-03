import "./App.css";
import { useState } from "react";
import styled from "styled-components";

const Node = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  border: 3px solid black;
  background: ${({ isHighlighted }) => (isHighlighted ? "aqua" : "white")};

  ${({ row, col }) => {
    let res = "";
    if (col === 0) res += "border-left:none;";
    if (row === 0) res += "border-top:none;";
    if (col === 2) res += "border-right:none;";
    if (row === 2) res += "border-bottom:none;";
    return res;
  }};
`;

const Reset = styled.button`
  background: transparent;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid black;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
  ::after {
    content: "RESET";
  }
  :hover {
    background-color: lightgray;
  }
`;

const getInitialBoard = () => {
  let board = [];
  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i][j] = {
        isHighlighted: false,
        X: false,
        O: false,
      };
    }
  }
  return board;
};
const isMovesLeft = (board) => {
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!board[i][j].X && !board[i][j].O) return true;

  return false;
};
const checkWin = (board) => {
  for (let row = 0; row < 3; row++) {
    if (
      (board[row][0].X && board[row][1].X && board[row][2].X) ||
      (board[row][0].O && board[row][1].O && board[row][2].O)
    ) {
      board[row][0].isHighlighted = true;
      board[row][1].isHighlighted = true;
      board[row][2].isHighlighted = true;
      return true;
    }
  }

  for (let col = 0; col < 3; col++) {
    if (
      (board[0][col].X && board[1][col].X && board[2][col].X) ||
      (board[0][col].O && board[1][col].O && board[2][col].O)
    ) {
      board[0][col].isHighlighted = true;
      board[1][col].isHighlighted = true;
      board[2][col].isHighlighted = true;

      return true;
    }
  }

  //primary diadonal
  if (
    (board[0][0].X && board[1][1].X && board[2][2].X) ||
    (board[0][0].O && board[1][1].O && board[2][2].O)
  ) {
    board[0][0].isHighlighted = true;
    board[1][1].isHighlighted = true;
    board[2][2].isHighlighted = true;
    return true;
  }

  //secondary diagonal
  if (
    (board[0][2].X && board[1][1].X && board[2][0].X) ||
    (board[0][2].O && board[1][1].O && board[2][0].O)
  ) {
    board[0][2].isHighlighted = true;
    board[1][1].isHighlighted = true;
    board[2][0].isHighlighted = true;
    return true;
  }

  return false;
};

const evaluate = (board) => {
  for (let row = 0; row < 3; row++) {
    if (board[row][0].X && board[row][1].X && board[row][2].X) return -10;
    if (board[row][0].O && board[row][1].O && board[row][2].O) return 10;
  }

  for (let col = 0; col < 3; col++) {
    if (board[0][col].X && board[1][col].X && board[2][col].X) return -10;
    if (board[0][col].O && board[1][col].O && board[2][col].O) return 10;
  }

  //primary diadonal
  if (board[0][0].X && board[1][1].X && board[2][2].X) return -10;
  if (board[0][0].O && board[1][1].O && board[2][2].O) return 10;

  //secondary diagonal
  if (board[0][2].X && board[1][1].X && board[2][0].X) return -10;
  if (board[0][2].O && board[1][1].O && board[2][0].O) return 10;

  return 0;
};

const minimax = (board, depth, isMax) => {
  let score = evaluate(board);
  //Player Winning
  if (score === 10) return score;

  //AI Winning
  if (score === -10) return score;

  if (!isMovesLeft(board)) return 0;

  if (isMax) {
    //AI's turn
    let bestScore = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j].X && !board[i][j].O) {
          board[i][j].O = true; //making AI's move

          bestScore = Math.max(bestScore, minimax(board, depth + 1, !isMax));

          board[i][j].O = false; //undoing AI's move
        }
      }
    }
    return bestScore;
  } else {
    //player's turn
    let bestScore = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j].X && !board[i][j].O) {
          board[i][j].X = true; //making player's move

          bestScore = Math.min(bestScore, minimax(board, depth + 1, !isMax));

          board[i][j].X = false; //undoing player's move
        }
      }
    }
    return bestScore;
  }
};

const findBestMove = (board) => {
  let best = -Infinity;
  let bestMove = {
    row: -1,
    col: -1,
  };
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j].X && !board[i][j].O) {
        //making move
        board[i][j].O = true;

        let moveVal = minimax(board, 0, false);

        //undoing move
        board[i][j].O = false;

        if (moveVal > best) {
          bestMove.row = i;
          bestMove.col = j;
          best = moveVal;
        }
      }
    }
  }

  return bestMove;
};

function App() {
  const [Board, setBoard] = useState(getInitialBoard());
  const [status, setstatus] = useState({
    X: false,
    O: false,
    tie: false,
  });

  const handleClick = (row, col) => {
    if (checkWin(Board)) {
      setBoard(getInitialBoard());
      setstatus({
        X: false,
        O: false,
        tie: false,
      });
      return;
    }

    if (Board[row][col].X || Board[row][col].O) return;

    let boardCopy = [...Board];
    boardCopy[row][col] = {
      isHighlighted: false,
      X: true,
      O: false,
    };

    setBoard(boardCopy);

    if (checkWin(boardCopy)) {
      setstatus({
        X: true,
        O: false,
        tie: false,
      });

      return;
    }
    if (isMovesLeft(boardCopy)) {
      let bestMove = findBestMove(boardCopy);
      boardCopy[bestMove.row][bestMove.col] = {
        isHighlighted: false,
        X: false,
        O: true,
      };

      if (checkWin(boardCopy)) {
        setstatus({
          X: false,
          O: true,
          tie: false,
        });
        setBoard(boardCopy);

        return;
      }
    }
    if (!isMovesLeft(boardCopy)) {
      setstatus({
        X: false,
        O: false,
        tie: true,
      });
    }
  };
  return (
    <div className="App">
      <h1>Unbeatable Tic Tac Toe</h1>
      <Reset
        onClick={() => {
          setBoard(getInitialBoard());
          setstatus({
            X: false,
            O: false,
            tie: false,
          });
        }}
      />
      {Board.map((row, i) => (
        <div style={{ display: "flex" }} key={i}>
          {row.map(({ X, O, isHighlighted }, j) => (
            <Node
              onClick={() => handleClick(i, j)}
              X={X}
              O={O}
              isHighlighted={isHighlighted}
              row={i}
              col={j}
              key={j}
            >
              {X && "X"}
              {O && "O"}
            </Node>
          ))}
        </div>
      ))}

      {status.X ? <h2>X won !</h2> : <></>}
      {status.O ? <h2>O won !</h2> : <></>}
      {status.tie ? <h2>Tie !</h2> : <></>}
    </div>
  );
}

export default App;
