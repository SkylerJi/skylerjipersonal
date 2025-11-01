'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Mail, Calendar, Settings, Code2, CircleDot, GitPullRequest, MessageSquare, Zap, LayoutGrid, Shield, TrendingUp } from 'lucide-react';
import type { ViewType } from '../page';

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#010409] border-b border-[#30363d] flex-none relative z-10 w-full">
      <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 min-h-[48px]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {/* Menu and Logo */}
          <button className="text-[#7d8590] hover:text-[#c9d1d9] shrink-0">
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Repository path - hidden on small screens */}
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <a href="#" className="text-[#58a6ff] hover:underline font-semibold">skylerji</a>
            <span className="text-[#7d8590]">/</span>
            <a href="#" className="text-[#58a6ff] hover:underline font-semibold">README</a>
          </div>
        </div>
        
        {/* Search and right icons */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <div className="relative" ref={searchRef}>
            <input 
              type="text" 
              placeholder="Type / to search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSearchPopup(e.target.value.length > 0);
              }}
              className="bg-[#0d1117] border border-[#30363d] rounded-md px-2 sm:px-3 py-1.5 text-sm w-32 sm:w-48 md:w-64 text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-[#1f6feb]"
            />
            {showSearchPopup && (
              <div className="absolute top-full right-0 sm:left-0 mt-2 sm:mr-0 w-[calc(100vw-5rem)] sm:w-80 max-w-[calc(100vw-1rem)] sm:max-w-none bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50 p-4">
                <p className="text-[#e6edf3] text-sm">
                  the words on this page are too big for you, don't bother trying to spell them
                </p>
              </div>
            )}
          </div>
          <div className="relative flex items-center" ref={dropdownRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-[#7d8590] hover:text-[#c9d1d9] cursor-pointer"
            >
              <Mail className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-4 w-[calc(100vw-2rem)] sm:w-80 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-[#e6edf3] font-semibold mb-4 text-sm">Contact</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-[#0d1117] border border-[#30363d]">
                      <Mail className="w-5 h-5 text-[#7d8590] shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#7d8590]">Email</p>
                        <a 
                          href="mailto:skyler@humanbehavior.co"
                          className="text-sm text-[#58a6ff] hover:underline break-all"
                        >
                          skyler@humanbehavior.co
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-md bg-[#0d1117] border border-[#30363d]">
                      <Calendar className="w-5 h-5 text-[#7d8590] shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#7d8590]">Schedule a Call</p>
                        <a 
                          href="https://cal.com/skyler-ji/30min"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#58a6ff] hover:underline break-all"
                        >
                          Book 30min call →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
     
          <a 
            href="https://github.com/SkylerJi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity shrink-0"
          >
            <img 
              src="/githubavatar.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      </div>

      {/* Navigation tabs - horizontally scrollable on mobile */}
      <nav className="px-2 sm:px-4 border-t border-[#21262d] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[48px]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-max h-full">
          <button 
            onClick={() => setCurrentView('code')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'code' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <Code2 className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Code</span>
          </button>
          <button 
            onClick={() => setCurrentView('issues')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'issues' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <CircleDot className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Issues</span>
            <span className="bg-[#30363d] text-[#e6edf3] text-xs px-1.5 sm:px-2 py-0.5 rounded-full">1</span>
          </button>
          <button 
            onClick={() => setCurrentView('pullrequests')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'pullrequests' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <GitPullRequest className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Pull requests</span>
            <span className="bg-[#30363d] text-[#e6edf3] text-xs px-1.5 sm:px-2 py-0.5 rounded-full">5</span>
          </button>
          <button 
            onClick={() => setCurrentView('discussions')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'discussions' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Discussions</span>
          </button>
          <button 
            onClick={() => setCurrentView('actions')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'actions' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <Zap className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Actions</span>
          </button>
          <button 
            onClick={() => setCurrentView('projects')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'projects' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Projects</span>
          </button>
          <button 
            onClick={() => setCurrentView('security')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'security' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <Shield className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Security</span>
          </button>
          <button 
            onClick={() => setCurrentView('insights')}
            className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'insights' 
                ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
                : 'text-[#7d8590] hover:text-[#e6edf3]'
            }`}
          >
            <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Insights</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

