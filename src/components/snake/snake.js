import React, { useState, useCallback, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { DIRECTION, NUM_COLS, NUM_ROWS } from "../../constants/snake.constants";

const Snake = () => {
  const [snake, setSnake] = useState([{ row: 5, col: 5 }]);
  const [openModal, setOpenModal] = useState(false);
  const [food, setFood] = useState({ row: 10, col: 10 });
  const [direction, setDirection] = useState(DIRECTION.RIGHT);
  const [score, setScore] = useState(0);
  const [stop, setStop] = useState(true);

  const moveSnake = useCallback(() => {
    const head = { ...snake[0] };
    switch (direction) {
      case DIRECTION.UP:
        head.row -= 1;
        break;
      case DIRECTION.DOWN:
        head.row += 1;
        break;
      case DIRECTION.LEFT:
        head.col -= 1;
        break;
      case DIRECTION.RIGHT:
        head.col += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake];
    if (head.row === food.row && head.col === food.col) {
      const newFood = {
        row: Math.floor(Math.random() * NUM_ROWS),
        col: Math.floor(Math.random() * NUM_COLS),
      };
      setScore(score + 10);
      setFood(newFood);
    } else if (
      head.col === NUM_COLS ||
      head.row === NUM_ROWS ||
      head.row < 0 ||
      head.col < 0
    ) {
      console.log(head.col, food.row, food.col, head.row, NUM_ROWS, NUM_COLS);
      setStop(false);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, food, direction]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== DIRECTION.DOWN) setDirection(DIRECTION.UP);
          break;
        case "ArrowDown":
          if (direction !== DIRECTION.UP) setDirection(DIRECTION.DOWN);
          break;
        case "ArrowLeft":
          if (direction !== DIRECTION.RIGHT) setDirection(DIRECTION.LEFT);
          break;
        case "ArrowRight":
          if (direction !== DIRECTION.LEFT) setDirection(DIRECTION.RIGHT);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    if (stop) {
      let gameInterval = setInterval(() => {
        setScore(score + 1);
        moveSnake();
      }, 500);
      return () => {
        clearInterval(gameInterval);
      };
    }
  }, [stop, moveSnake]);

  return (
    <>
      <div className="playAndScore">
        <button onClick={() => window.location.reload()} className="playagain">
          Play Again
        </button>
        <h3>Score: {score}</h3>
      </div>
      <div className="game-container">
        <table>
          <tbody>
            {Array.from({ length: NUM_ROWS }, (_, row) => (
              <tr key={row}>
                {Array.from({ length: NUM_COLS }, (_, col) => (
                  <td
                    key={col}
                    className={
                      snake.some((part) => part.row === row && part.col === col)
                        ? "snake"
                        : food.row === row && food.col === col
                        ? "food"
                        : ""
                    }
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={!stop && !openModal}
        onClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <div className="modalBox">
          <div className="modalHeading">Game Over</div>
          <hr />
          <div className="playAndScore">
            <h3>Score: {score}</h3>
          </div>
          <div className="submitAndCancel">
            <button
              onClick={() => window.location.reload()}
              className="playagain"
            >
              Play Again
            </button>
            <button onClick={() => setOpenModal(!openModal)} className="cancel">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Snake;
