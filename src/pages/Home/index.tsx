import React from "react";
import { Link } from "react-router-dom";
import type { Game } from "../../types/game";

const Home: React.FC = () => {
  // 游戏数据，模拟手机桌面应用列表
  const games: Game[] = [
    {
      id: "gobang",
      name: "五子棋",
      icon: "⚫ ⚪",
      description: "经典五子棋游戏",
      path: "/gobang",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-500",
    },
    {
      id: "chess",
      name: "象棋",
      icon: "♔ ♚",
      description: "中国象棋",
      path: "/chess",
      bgColor: "bg-gradient-to-br from-red-500 to-pink-500",
    },
    {
      id: "checkers",
      name: "跳棋",
      icon: "🔴 🔵",
      description: "经典跳棋",
      path: "/checkers",
      bgColor: "bg-gradient-to-br from-yellow-500 to-orange-500",
    },
    {
      id: "puzzle",
      name: "拼图",
      icon: "🧩",
      description: "益智拼图游戏",
      path: "/puzzle",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      id: "snake",
      name: "贪吃蛇",
      icon: "🐍",
      description: "经典贪吃蛇",
      path: "/snake",
      bgColor: "bg-gradient-to-br from-purple-500 to-violet-500",
    },
    {
      id: "tetris",
      name: "俄罗斯方块",
      icon: "🧱",
      description: "经典俄罗斯方块",
      path: "/tetris",
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-500",
    },
    {
      id: "2048",
      name: "2048",
      icon: "2️⃣0️⃣4️⃣8️⃣",
      description: "数字合成游戏",
      path: "/2048",
      bgColor: "bg-gradient-to-br from-amber-500 to-yellow-500",
    },
    {
      id: "sudoku",
      name: "数独",
      icon: "🔢",
      description: "逻辑推理游戏",
      path: "/sudoku",
      bgColor: "bg-gradient-to-br from-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="home-container">
      {/* 手机桌面标题 */}
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          游戏中心
        </h1>
        <p className="text-[14px] text-gray-600">点击图标开始游戏</p>
      </div>

      {/* 手机桌面网格布局，类似手机应用图标 */}
      <div className="grid grid-cols-4 gap-4">
        {games.map((game) => (
          <Link
            key={game.id}
            to={game.path}
            className={`game-card rounded-[16px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group transform-gpu`}
          >
            {/* 游戏图标背景 */}
            <div
              className={`${game.bgColor} p-5 flex flex-col items-center justify-center aspect-square`}
            >
              <div className="text-4xl mb-2 transition-transform duration-300 ease-out group-hover:scale-110">
                {game.icon}
              </div>
            </div>
            {/* 游戏名称 */}
            <div className="bg-white p-2 text-center">
              <p className="text-sm font-medium text-gray-800 truncate">
                {game.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-8 text-center text-[12px] text-gray-500">
        <p>向左或向右滑动查看更多游戏</p>
      </div>
    </div>
  );
};

export default Home;
