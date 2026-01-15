// 五子棋游戏 - 复刻版本
// 基于目标仓库：https://github.com/itlwei/Wuzi
// 在线demo：https://itlwei.github.io/Wuzi/

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ========================== 游戏常量定义 ==========================

/** 棋盘大小 */
export const BOARD_SIZE = 15;

/** 玩家常量 - 黑方 */
export const BLACK = 1;

/** 玩家常量 - 白方 */
export const WHITE = 2;

/** 玩家常量 - 空位置 */
export const EMPTY = 0;

/** 方向常量（用于胜负判断） */
const DIRECTIONS = [
  [0, 1], // 水平方向
  [1, 0], // 垂直方向
  [1, 1], // 对角线方向（右下）
  [1, -1], // 对角线方向（左下）
];

// ========================== 类型定义 ==========================

/** 玩家类型 */
export type Player = typeof BLACK | typeof WHITE | typeof EMPTY;

/** 棋盘类型 */
export type Board = Player[][];

/** AI难度类型 */
export type AIDifficulty = 0 | 1 | 2;

/** 游戏状态类型 */
export type GameStatus = "init" | "playing" | "blackWin" | "whiteWin" | "draw";

/** 先手/后手类型 */
export type Offense = 0 | 1;

// ========================== 游戏主组件 ==========================

/**
 * 五子棋游戏主组件
 * 复刻目标仓库：https://github.com/itlwei/Wuzi
 */
const Gobang: React.FC = () => {
  const navigate = useNavigate();

  // ========================== 游戏状态 ==========================

  /** 棋盘状态 */
  const [board, setBoard] = useState<Board>(() => {
    const initialBoard: Board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(EMPTY));
    return initialBoard;
  });

  /** 当前玩家 */
  const [currentPlayer, setCurrentPlayer] = useState<
    typeof BLACK | typeof WHITE
  >(BLACK);

  /** 游戏状态 */
  const [gameStatus, setGameStatus] = useState<GameStatus>("init");

  /** 是否人机对战 */
  const [isAI, setIsAI] = useState<boolean>(true);

  /** AI难度 */
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(1);

  /** 先手/后手 */
  const [offense, setOffense] = useState<Offense>(0);

  /** 棋步历史，用于悔棋 */
  const [moveHistory, setMoveHistory] = useState<Board[]>([]);

  /** 悔棋次数 */
  const [undoCount, setUndoCount] = useState<number>(3);

  // ========================== 游戏初始化 ==========================

  /**
   * 初始化游戏
   */
  const initGame = () => {
    const initialBoard: Board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(EMPTY));
    setBoard(initialBoard);
    // 根据先手/后手设置当前玩家
    setCurrentPlayer(offense === 0 ? BLACK : WHITE);
    setGameStatus("playing");
    setMoveHistory([]);
    setUndoCount(3);
  };

  /**
   * 开始游戏
   */
  const startGame = () => {
    initGame();
    setGameStatus("playing");
  };

  /**
   * 返回初始化界面
   */
  const backToInit = () => {
    setGameStatus("init");
    initGame();
  };

  // ========================== 游戏逻辑 ==========================

  /**
   * 检查指定位置落子后是否获胜
   * @param board 棋盘状态
   * @param x x坐标
   * @param y y坐标
   * @param player 玩家
   * @returns 是否获胜
   */
  const checkWin = (
    board: Board,
    x: number,
    y: number,
    player: Player
  ): boolean => {
    // 检查四个方向的连续棋子
    for (const [dx, dy] of DIRECTIONS) {
      let count = 1;

      // 检查当前方向的正方向
      for (let i = 1; i < 5; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;
        if (board[nx][ny] === player) count++;
        else break;
      }

      // 检查当前方向的反方向
      for (let i = 1; i < 5; i++) {
        const nx = x - dx * i;
        const ny = y - dy * i;
        if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;
        if (board[nx][ny] === player) count++;
        else break;
      }

      // 如果有五个或更多连续棋子，返回获胜
      if (count >= 5) return true;
    }

    return false;
  };

  /**
   * 检查棋盘是否已满（平局）
   * @param board 棋盘状态
   * @returns 是否平局
   */
  const checkDraw = (board: Board): boolean => {
    return board.every((row) => row.every((cell) => cell !== EMPTY));
  };

  /**
   * 处理玩家落子
   * @param x x坐标
   * @param y y坐标
   */
  const handlePlayerMove = useCallback(
    (x: number, y: number) => {
      // 如果游戏已结束或位置已有棋子，返回
      if (gameStatus !== "playing" || board[x][y] !== EMPTY) return;

      // 创建新棋盘状态
      const newBoard = board.map((row) => [...row]);
      newBoard[x][y] = currentPlayer;

      // 保存棋步历史
      setMoveHistory((prev) => [...prev, board]);

      // 更新棋盘
      setBoard(newBoard);

      // 检查是否获胜
      if (checkWin(newBoard, x, y, currentPlayer)) {
        setGameStatus(currentPlayer === BLACK ? "blackWin" : "whiteWin");
        return;
      }

      // 检查是否平局
      if (checkDraw(newBoard)) {
        setGameStatus("draw");
        return;
      }

      // 切换玩家
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    },
    [board, currentPlayer, gameStatus]
  );

  /**
   * 评估位置价值
   * @param board 棋盘状态
   * @param x x坐标
   * @param y y坐标
   * @param player 玩家
   * @returns 位置价值分数
   */
  const evaluatePosition = (
    board: Board,
    x: number,
    y: number,
    player: Player
  ): number => {
    // 评估棋局 根据棋子形态得到value
    const valueMap = {
      11: 1, // 一边被拦截的单子
      12: 2, // 两边均不被拦截的单子
      21: 10, // 一边被拦截的二子连珠
      22: 20, // 两边均不被拦截的二子连珠
      31: 30, // 一边被拦截的三字连珠
      32: 50, // 两边均不被拦截的三字连珠
      41: 60, // 一边被拦截的四子连珠
      42: 100, // 两边均不被拦截的四子连珠
      50: 88888, // 成5：即构成五子连珠
      51: 88888, // 成5：即构成五子连珠
      52: 88888, // 成5：即构成五子连珠
    };

    let score = 0;

    // 计算四个方向的分数
    for (const [dx, dy] of DIRECTIONS) {
      let count = 1;
      let openSides = 0;

      // 检查当前方向的正方向
      for (let i = 1; i < 5; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
          break;
        }
        if (board[nx][ny] === player) {
          count++;
        } else if (board[nx][ny] === EMPTY) {
          openSides++;
          break;
        } else {
          break;
        }
      }

      // 检查当前方向的反方向
      for (let i = 1; i < 5; i++) {
        const nx = x - dx * i;
        const ny = y - dy * i;
        if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
          break;
        }
        if (board[nx][ny] === player) {
          count++;
        } else if (board[nx][ny] === EMPTY) {
          openSides++;
          break;
        } else {
          break;
        }
      }

      // 限制最大连续棋子数为5
      count = Math.min(count, 5);

      // 计算当前方向的分数
      const key = `${count}${openSides}`;
      score += valueMap[key as unknown as keyof typeof valueMap] || 0;
    }

    return score;
  };

  /**
   * AI落子逻辑
   */
  const aiMove = useCallback(() => {
    if (gameStatus !== "playing" || currentPlayer !== WHITE) return;

    // 智能AI：评估所有可能位置并选择最佳位置
    let bestScore = -Infinity;
    let bestMove: [number, number] | null = null;

    // 获取所有可能的落子位置
    const emptyPositions: [number, number][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === EMPTY) {
          emptyPositions.push([i, j]);
        }
      }
    }

    // 如果没有空位置，返回
    if (emptyPositions.length === 0) return;

    // 遍历所有可能的落子位置
    for (const [i, j] of emptyPositions) {
      // 模拟白方落子
      const newBoard = board.map((row) => [...row]);
      newBoard[i][j] = WHITE;

      // 检查是否能直接获胜
      if (checkWin(newBoard, i, j, WHITE)) {
        bestMove = [i, j];
        break;
      }

      // 检查是否需要阻止对手获胜
      newBoard[i][j] = BLACK;
      if (checkWin(newBoard, i, j, BLACK)) {
        bestMove = [i, j];
        break;
      }

      // 评估位置价值
      const score = evaluatePosition(newBoard, i, j, WHITE);

      // 更新最佳位置
      if (score > bestScore) {
        bestScore = score;
        bestMove = [i, j];
      }
    }

    // 执行落子，添加延迟效果
    if (bestMove) {
      const [x, y] = bestMove;
      setTimeout(() => handlePlayerMove(x, y), 500); // 延迟500ms，让玩家看到AI思考过程
    }
  }, [gameStatus, currentPlayer, board, handlePlayerMove]);

  /**
   * 当当前玩家为AI时，AI自动落子
   * 依赖项：currentPlayer, isAI, gameStatus, board, aiMove
   */
  useEffect(() => {
    if (isAI && currentPlayer === WHITE && gameStatus === "playing") {
      aiMove();
    }
  }, [currentPlayer, isAI, gameStatus, board, aiMove]);

  /**
   * 重新开始游戏
   */
  const restartGame = () => {
    initGame();
  };

  /**
   * 悔棋功能
   */
  const undoMove = () => {
    if (moveHistory.length === 0 || undoCount === 0) return;

    // 恢复到上一步棋盘状态
    const previousBoard = moveHistory[moveHistory.length - 1];
    setBoard(previousBoard);
    setMoveHistory((prev) => prev.slice(0, -1));

    // 切换回上一个玩家
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);

    // 减少悔棋次数
    setUndoCount((prev) => prev - 1);

    // 恢复游戏状态为进行中
    setGameStatus("playing");
  };

  // ========================== 渲染 ==========================

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      {/* 游戏容器 */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all duration-300 font-medium shadow-sm hover:shadow"
          >
            ← 返回首页
          </button>
          <h1 className="text-[28px] font-bold text-gray-800">五子棋游戏</h1>
          <div className="w-24"></div>
        </div>

        {/* 开始界面 */}
        {gameStatus === "init" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="w-[468px] h-[320px] bg-cover bg-center flex flex-col items-center justify-center"
              style={{
                backgroundImage: "url(/images/init-bg.png)",
              }}
            >
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                游戏设置
              </h2>

              {/* 设置内容 */}
              <div className="flex gap-8">
                {/* AI难度设置 */}
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">
                    AI难度
                  </h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer text-amber-900">
                      <input
                        type="radio"
                        name="aiDifficulty"
                        value={0}
                        checked={aiDifficulty === 0}
                        onChange={(e) =>
                          setAiDifficulty(
                            Number(e.target.value) as AIDifficulty
                          )
                        }
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span>菜鸟水平</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-amber-900">
                      <input
                        type="radio"
                        name="aiDifficulty"
                        value={1}
                        checked={aiDifficulty === 1}
                        onChange={(e) =>
                          setAiDifficulty(
                            Number(e.target.value) as AIDifficulty
                          )
                        }
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span>中级水平</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-amber-900">
                      <input
                        type="radio"
                        name="aiDifficulty"
                        value={2}
                        checked={aiDifficulty === 2}
                        onChange={(e) =>
                          setAiDifficulty(
                            Number(e.target.value) as AIDifficulty
                          )
                        }
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span>高手水平</span>
                    </label>
                  </div>
                </div>

                {/* 先手/后手设置 */}
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">
                    先手/后手
                  </h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer text-amber-900">
                      <input
                        type="radio"
                        name="offense"
                        value={0}
                        checked={offense === 0}
                        onChange={(e) =>
                          setOffense(Number(e.target.value) as Offense)
                        }
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span>先手</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-amber-900">
                      <input
                        type="radio"
                        name="offense"
                        value={1}
                        checked={offense === 1}
                        onChange={(e) =>
                          setOffense(Number(e.target.value) as Offense)
                        }
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span>后手</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 开始游戏按钮 */}
              <button
                onClick={startGame}
                className="mt-12 px-12 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                开始对弈
              </button>
            </div>
          </div>
        )}

        {/* 游戏界面 */}
        {gameStatus !== "init" && (
          <>
            {/* 游戏信息 */}
            <div className="mb-8">
              {/* 玩家状态 */}
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${currentPlayer === BLACK ? "bg-black scale-110 ring-2 ring-blue-400" : "bg-black/60"}`}
                  >
                    {currentPlayer === BLACK && (
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span
                    className={`text-xl font-semibold ${currentPlayer === BLACK ? "text-blue-600" : "text-gray-500"}`}
                  >
                    黑方
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-700">VS</div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg transition-all duration-300 ${currentPlayer === WHITE ? "bg-white scale-110 ring-2 ring-blue-400" : "bg-white/60"}`}
                  >
                    {currentPlayer === WHITE && (
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span
                    className={`text-xl font-semibold ${currentPlayer === WHITE ? "text-blue-600" : "text-gray-500"}`}
                  >
                    白方
                  </span>
                </div>
              </div>

              {/* 游戏状态显示 */}
              {gameStatus !== "playing" && (
                <div className="text-center py-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-2xl font-bold text-green-700 animate-pulse">
                    {gameStatus === "blackWin" && "🎉 黑方获胜！"}
                    {gameStatus === "whiteWin" && "🎉 白方获胜！"}
                    {gameStatus === "draw" && "🤝 平局！"}
                  </p>
                </div>
              )}
            </div>

            {/* 棋盘区域 */}
            <div className="flex justify-center items-center mb-8 w-full">
              <div className="relative">
                {/* 棋盘背景 */}
                <div
                  className="w-full min-w-[300px] max-w-[600px] aspect-square border-8 border-amber-900 rounded-lg shadow-2xl overflow-hidden relative mx-auto"
                  style={{
                    backgroundImage: "url(/images/chessboard.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {/* 棋盘网格线 - 调整z-index确保可见 */}
                  <div className="absolute top-0 left-0 w-full h-full z-10">
                    {/* 垂直线 */}
                    {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute h-full w-[1px] opacity-90 bg-black"
                        style={{
                          left: `${(i / (BOARD_SIZE - 1)) * 100}%`,
                        }}
                      ></div>
                    ))}
                    {/* 水平线 */}
                    {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute w-full h-[1px] opacity-90 bg-black"
                        style={{
                          top: `${(i / (BOARD_SIZE - 1)) * 100}%`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* 棋子 */}
                  {board.map((row, x) =>
                    row.map((cell, y) => {
                      if (cell === EMPTY) return null;

                      return (
                        <div
                          key={`${x}-${y}`}
                          className="absolute cursor-pointer transition-all duration-300 transform hover:scale-125"
                          style={{
                            left: `${(y / (BOARD_SIZE - 1)) * 100}%`,
                            top: `${(x / (BOARD_SIZE - 1)) * 100}%`,
                            width: "calc(100% / 15 * 0.8)",
                            height: "calc(100% / 15 * 0.8)",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%) scale(1)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            boxShadow:
                              "0 4px 12px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
                            zIndex: 20,
                            backgroundImage:
                              cell === BLACK
                                ? "url(/images/black.png)"
                                : "url(/images/white.png)",
                          }}
                        />
                      );
                    })
                  )}

                  {/* 可点击区域 */}
                  {Array.from({ length: BOARD_SIZE }).map((_, x) =>
                    Array.from({ length: BOARD_SIZE }).map((_, y) => (
                      <div
                        key={`click-${x}-${y}`}
                        className="absolute cursor-pointer transition-all duration-200 hover:bg-blue-400/20"
                        style={{
                          left: `${(y / (BOARD_SIZE - 1)) * 100}%`,
                          top: `${(x / (BOARD_SIZE - 1)) * 100}%`,
                          width: "calc(100% / 15 * 1)",
                          height: "calc(100% / 15 * 1)",
                          transform: "translate(-50%, -50%)",
                          borderRadius: "50%",
                          zIndex: 30,
                        }}
                        onClick={() => handlePlayerMove(x, y)}
                      />
                    ))
                  )}

                  {/* 游戏状态遮罩 */}
                  {gameStatus !== "playing" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm rounded-lg">
                      <div className="bg-white/95 p-8 rounded-lg shadow-2xl text-center">
                        <h2 className="text-3xl font-bold mb-4">
                          {gameStatus === "blackWin" && "🎉 黑方获胜！"}
                          {gameStatus === "whiteWin" && "🎉 白方获胜！"}
                          {gameStatus === "draw" && "🤝 平局！"}
                        </h2>
                        <div className="flex gap-4">
                          <button
                            onClick={restartGame}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                          >
                            再来一局
                          </button>
                          <button
                            onClick={backToInit}
                            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                          >
                            返回设置
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 游戏控制按钮 */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={restartGame}
                className="w-[118px] h-[32px] bg-cover bg-center text-amber-900 font-semibold hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: "url(/images/btn-bg1.png)",
                }}
              >
                重新开始
              </button>
              <button
                onClick={undoMove}
                disabled={moveHistory.length === 0 || undoCount === 0}
                className={`w-[118px] h-[32px] bg-cover bg-center text-amber-900 font-semibold transition-opacity ${moveHistory.length === 0 || undoCount === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
                style={{
                  backgroundImage: "url(/images/btn-bg1.png)",
                }}
              >
                悔棋({undoCount})
              </button>
              <button
                onClick={() => setIsAI(!isAI)}
                className="w-[118px] h-[32px] bg-cover bg-center text-amber-900 font-semibold hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: "url(/images/btn-bg1.png)",
                }}
              >
                {isAI ? "人人对战" : "人机对战"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gobang;
