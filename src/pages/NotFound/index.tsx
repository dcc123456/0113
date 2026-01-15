import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container flex flex-col items-center justify-center min-h-screen">
      <div className="text-center max-w-md bg-white rounded-[16px] shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-[80px] font-bold text-blue-500 mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-[24px] font-semibold mb-3 text-gray-800">
          页面未找到
        </h2>
        <p className="text-gray-600 mb-6 text-[16px]">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-block px-8 py-3 h-[44px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-[24px] hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center"
        >
          返回游戏中心
        </button>
      </div>
    </div>
  );
};

export default NotFound;
