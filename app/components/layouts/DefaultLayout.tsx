import React from 'react';
import Sidebar from '../Sidebar';
import TopPageFullWidth from '../TopPageFullWidth';
import Header from '../Header';
import Footer from '../Footer';

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