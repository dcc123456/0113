import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

// Home component
const Home: React.FC = () => {
  return (
    <div className="home-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        React H5 Games
      </h1>

      <div className="games-section max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Game Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/gobang"
            className="game-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center hover:-translate-y-2"
          >
            <div className="text-6xl mb-4 font-bold">⚫ ⚪</div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">五子棋</h3>
            <p className="text-sm text-gray-600 mb-5">Classic Gobang Game</p>
            <div className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105">
              开始游戏
            </div>
          </Link>

          <div className="game-card bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center justify-center border-2 border-dashed border-gray-200 hover:border-gray-300 transition-all duration-300">
            <div className="text-6xl mb-4 text-gray-300">🎮</div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">更多游戏</h3>
            <p className="text-sm text-gray-400">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Gobang Game component
const BOARD_SIZE = 15;
const BLACK = "black";
const WHITE = "white";
const EMPTY = null;

type Player = typeof BLACK | typeof WHITE | null;
type Board = Player[][];

type Theme = "classic" | "modern" | "minimal" | "wood";

interface ThemeConfig {
  bgColor: string;
  borderColor: string;
  lineColor: string;
  blackPiece: string;
  whitePiece: string;
}

const THEMES: Record<Theme, ThemeConfig> = {
  classic: {
    bgColor: "bg-amber-100",
    borderColor: "border-amber-800",
    lineColor: "#654321",
    blackPiece: "black",
    whitePiece: "white",
  },
  modern: {
    bgColor: "bg-gray-200",
    borderColor: "border-gray-700",
    lineColor: "#374151",
    blackPiece: "#1f2937",
    whitePiece: "#f9fafb",
  },
  minimal: {
    bgColor: "bg-white",
    borderColor: "border-gray-300",
    lineColor: "#d1d5db",
    blackPiece: "#111827",
    whitePiece: "#ffffff",
  },
  wood: {
    bgColor: "bg-amber-200",
    borderColor: "border-amber-900",
    lineColor: "#78350f",
    blackPiece: "#1c1917",
    whitePiece: "#fef3c7",
  },
};

const Gobang: React.FC = () => {
  const navigate = useNavigate();

  // Initialize empty board
  const [board, setBoard] = useState<Board>(() => {
    const initialBoard: Board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      initialBoard[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        initialBoard[i][j] = EMPTY;
      }
    }
    return initialBoard;
  });

  const [currentPlayer, setCurrentPlayer] = useState<
    typeof BLACK | typeof WHITE
  >(BLACK);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>("classic");
  const theme = THEMES[currentTheme];

  // Check if someone wins
  const checkWin = (
    x: number,
    y: number,
    player: Player,
    checkBoard: Board
  ): boolean => {
    if (!player) return false;

    // Check horizontal
    let count = 1;
    for (let i = y - 1; i >= 0 && checkBoard[x][i] === player; i--) count++;
    for (let i = y + 1; i < BOARD_SIZE && checkBoard[x][i] === player; i++)
      count++;
    if (count >= 5) return true;

    // Check vertical
    count = 1;
    for (let i = x - 1; i >= 0 && checkBoard[i][y] === player; i--) count++;
    for (let i = x + 1; i < BOARD_SIZE && checkBoard[i][y] === player; i++)
      count++;
    if (count >= 5) return true;

    // Check diagonal 1 (top-left to bottom-right)
    count = 1;
    for (
      let i = x - 1, j = y - 1;
      i >= 0 && j >= 0 && checkBoard[i][j] === player;
      i--, j--
    )
      count++;
    for (
      let i = x + 1, j = y + 1;
      i < BOARD_SIZE && j < BOARD_SIZE && checkBoard[i][j] === player;
      i++, j++
    )
      count++;
    if (count >= 5) return true;

    // Check diagonal 2 (top-right to bottom-left)
    count = 1;
    for (
      let i = x - 1, j = y + 1;
      i >= 0 && j < BOARD_SIZE && checkBoard[i][j] === player;
      i--, j++
    )
      count++;
    for (
      let i = x + 1, j = y - 1;
      i < BOARD_SIZE && j >= 0 && checkBoard[i][j] === player;
      i++, j--
    )
      count++;
    if (count >= 5) return true;

    return false;
  };

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    if (gameOver || board[x][y] !== EMPTY) return;

    // Create new board with the move
    const newBoard = [...board.map((row) => [...row])];
    newBoard[x][y] = currentPlayer;
    setBoard(newBoard);

    // Check if current player wins using the newBoard
    if (checkWin(x, y, currentPlayer, newBoard)) {
      setGameOver(true);
      setWinner(currentPlayer);
      return;
    }

    // Switch to the other player
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
  };

  // Reset the game
  const resetGame = () => {
    const newBoard: Board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      newBoard[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[i][j] = EMPTY;
      }
    }
    setBoard(newBoard);
    setCurrentPlayer(BLACK);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="gobang-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              ← 返回首页
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              五子棋游戏
            </h1>
            <div className="w-24"></div>
          </div>

          <div className="game-info text-center mb-6">
            {gameOver ? (
              <p className="text-xl font-semibold text-green-600">
                {winner === BLACK ? "⚫ 黑方" : "⚪ 白方"} 获胜！
              </p>
            ) : (
              <p className="text-xl font-semibold">
                当前回合: {currentPlayer === BLACK ? "⚫ 黑方" : "⚪ 白方"}
              </p>
            )}
          </div>

          {/* Theme selector */}
          <div className="theme-selector mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              选择棋盘风格
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.keys(THEMES).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setCurrentTheme(themeName as Theme)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentTheme === themeName ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {themeName === "classic" && "经典"}
                  {themeName === "modern" && "现代"}
                  {themeName === "minimal" && "简约"}
                  {themeName === "wood" && "木纹"}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`board-container mx-auto w-full max-w-md aspect-square ${theme.bgColor} ${theme.borderColor} border-4 rounded-lg overflow-hidden relative shadow-xl`}
          >
            {/* Simplified board implementation */}
            <div className="w-full h-full relative">
              {/* Draw grid lines - ensure they're visible */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
              >
                {/* Vertical lines */}
                {Array.from({ length: BOARD_SIZE + 1 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    style={{
                      position: "absolute",
                      left: `${(i / BOARD_SIZE) * 100}%`,
                      top: 0,
                      bottom: 0,
                      width: "2px",
                      backgroundColor: theme.lineColor,
                      opacity: 1,
                    }}
                  />
                ))}

                {/* Horizontal lines */}
                {Array.from({ length: BOARD_SIZE + 1 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    style={{
                      position: "absolute",
                      top: `${(i / BOARD_SIZE) * 100}%`,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: theme.lineColor,
                      opacity: 1,
                    }}
                  />
                ))}
              </div>

              {/* Draw pieces - ensure they're above grid lines */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                }}
              >
                {board.map((row, x) =>
                  row.map((cell, y) => {
                    if (cell === EMPTY) return null;

                    return (
                      <div
                        key={`${x}-${y}`}
                        style={{
                          position: "absolute",
                          left: `${((y + 0.5) / BOARD_SIZE) * 100}%`,
                          top: `${((x + 0.5) / BOARD_SIZE) * 100}%`,
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor:
                            cell === BLACK
                              ? theme.blackPiece
                              : theme.whitePiece,
                          boxShadow:
                            cell === BLACK
                              ? "0 2px 8px rgba(0, 0, 0, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.1)"
                              : "0 2px 8px rgba(0, 0, 0, 0.2), inset 2px 2px 4px rgba(0, 0, 0, 0.1)",
                          transform: "translate(-50%, -50%) scale(1)",
                          transition: "all 0.2s ease",
                          zIndex: 10,
                        }}
                        className="hover:scale-110 transition-transform duration-150"
                      />
                    );
                  })
                )}
              </div>

              {/* Clickable cells - ensure they cover the entire board */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 20,
                }}
              >
                {board.map((row, x) =>
                  row.map((cell, y) => (
                    <div
                      key={`click-${x}-${y}`}
                      style={{
                        position: "absolute",
                        left: `${(y / BOARD_SIZE) * 100}%`,
                        top: `${(x / BOARD_SIZE) * 100}%`,
                        width: `${100 / BOARD_SIZE}%`,
                        height: `${100 / BOARD_SIZE}%`,
                        cursor: "pointer",
                      }}
                      onClick={() => handleCellClick(x, y)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="game-controls flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              重新开始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 404 component
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist or has been
          removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

// App component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gobang" element={<Gobang />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
