/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import PublicHub from './components/PublicHub';
import AdminDashboard from './components/AdminDashboard';

import { CustomCursor } from './components/ui/CustomCursor';
import { GridBackground } from './components/ui/GridBackground';
import { Watermark } from './components/ui/Watermark';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin') || window.location.hash === '#/admin') {
        return '/admin';
      }
      return path;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin') || window.location.hash === '#/admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath.startsWith('/admin') ||
    (typeof window !== 'undefined' && window.location.hash === '#/admin');

  return (
    <PortfolioProvider>
      <div
        className={`relative min-h-screen text-white selection:bg-accent/30 selection:text-white ${
          isAdminRoute ? 'bg-black custom-cursor-on' : 'bg-[#0b1024]'
        }`}
      >
        {/* The architectural cursor, grid and watermark stay with the admin area;
            the public hub uses the split-layout theme instead. */}
        {isAdminRoute && (
          <>
            <CustomCursor />
            <GridBackground />
            <Watermark text="PO" />
          </>
        )}
        <div className="relative z-10">
          {isAdminRoute ? (
            <AdminDashboard onNavigate={navigate} />
          ) : (
            <PublicHub onNavigate={navigate} />
          )}
        </div>
      </div>
    </PortfolioProvider>
  );
}
