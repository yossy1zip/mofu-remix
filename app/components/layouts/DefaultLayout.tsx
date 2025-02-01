import React from 'react';
import Sidebar from '../Sidebar';
import TopPageFullWidth from '../TopPageFullWidth';
import Header from '../Header';
import Footer from '../Footer';
import { Link } from 'react-router-dom';

interface DefaultLayoutProps {
  children: React.ReactNode;
  isTopPage?: boolean;
}

export default function DefaultLayout({ children, isTopPage = false }: DefaultLayoutProps) {
  return (
    <>
      <Header />
      {isTopPage && <TopPageFullWidth />}
      <div className={`container mx-auto px-4 ${isTopPage ? 'mt-8' : 'mt-24'}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            {children}
        {/* トップページへ戻るボタン */}
        {!isTopPage && (
          <div className="mt-12 pb-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              トップページへ戻る
            </Link>
          </div>
        )}
          </div>
          <div className="md:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}