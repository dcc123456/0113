import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 懒加载组件
const Home = lazy(() => import('../pages/Home'));
const Gobang = lazy(() => import('../pages/Gobang'));
const NotFound = lazy(() => import('../pages/NotFound'));

// 路由配置
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gobang" element={<Gobang />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;