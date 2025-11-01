'use client';

import { useState } from 'react';
import Header from "./components/GitHubHeader";
import Body from "./components/GitHubBody";

export type ViewType = 'code' | 'history' | 'discussions' | 'pullrequests' | 'issues' | 'insights' | 'security' | 'actions' | 'projects';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('code');

  return (
    <div className="h-screen overflow-hidden bg-[#0d1117] text-[#e6edf3] font-sans flex flex-col">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <Body currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}
