import React from "react";

interface LayoutProps {
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  title = "手机游戏中心",
  showHeader = true,
  showFooter = true,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      {showHeader && (
        <header className="bg-white shadow-sm border-b border-gray-100 h-[60px] flex items-center">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <h1 className="text-[20px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {title}
            </h1>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-[480px]">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-white shadow-inner border-t border-gray-100 h-[50px] flex items-center">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[12px] text-gray-500">手机游戏中心 © 2024</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
