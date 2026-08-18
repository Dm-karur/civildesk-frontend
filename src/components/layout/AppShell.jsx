import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell() {
  // Application-level site selection state
  const [selectedSite, setSelectedSite] = useState('site-4');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header selectedSite={selectedSite} onSiteChange={setSelectedSite} />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ selectedSite }} />
        </main>
      </div>
    </div>
  );
}
