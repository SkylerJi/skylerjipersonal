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
    <header className="bg-[#010409] border-b border-[#30363d] flex-shrink-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menu and Logo */}
          <button className="text-[#7d8590] hover:text-[#c9d1d9]">
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Repository path */}
          <div className="flex items-center gap-1 text-sm">
            <a href="#" className="text-[#58a6ff] hover:underline font-semibold">skylerji</a>
            <span className="text-[#7d8590]">/</span>
            <a href="#" className="text-[#58a6ff] hover:underline font-semibold">README</a>
          </div>
        </div>
        
        {/* Search and right icons */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={searchRef}>
            <input 
              type="text" 
              placeholder="Type / to search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSearchPopup(e.target.value.length > 0);
              }}
              className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm w-64 text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-[#1f6feb]"
            />
            {showSearchPopup && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50 p-4">
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
              <div className="absolute top-full right-0 mt-4 w-80 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-[#e6edf3] font-semibold mb-4 text-sm">Contact</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-[#0d1117] border border-[#30363d]">
                      <Mail className="w-5 h-5 text-[#7d8590] flex-shrink-0" strokeWidth={1.5} />
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
                      <Calendar className="w-5 h-5 text-[#7d8590] flex-shrink-0" strokeWidth={1.5} />
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
            className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
          >
            <img 
              src="/githubavatar.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="px-4 flex items-center gap-4 border-t border-[#21262d]">
        <button 
          onClick={() => setCurrentView('code')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer ${
            currentView === 'code' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <Code2 className="w-4 h-4" strokeWidth={1.5} />
          Code
        </button>
        <button 
          onClick={() => setCurrentView('issues')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'issues' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <CircleDot className="w-4 h-4" strokeWidth={1.5} />
          Issues
          <span className="bg-[#30363d] text-[#e6edf3] text-xs px-2 py-0.5 rounded-full">1</span>
        </button>
        <button 
          onClick={() => setCurrentView('pullrequests')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'pullrequests' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <GitPullRequest className="w-4 h-4" strokeWidth={1.5} />
          Pull requests
          <span className="bg-[#30363d] text-[#e6edf3] text-xs px-2 py-0.5 rounded-full">5</span>
        </button>
        <button 
          onClick={() => setCurrentView('discussions')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'discussions' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
          Discussions
        </button>
        <button 
          onClick={() => setCurrentView('actions')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'actions' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <Zap className="w-4 h-4" strokeWidth={1.5} />
          Actions
        </button>
        <button 
          onClick={() => setCurrentView('projects')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'projects' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
          Projects
        </button>
        <button 
          onClick={() => setCurrentView('security')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'security' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <Shield className="w-4 h-4" strokeWidth={1.5} />
          Security
        </button>
        <button 
          onClick={() => setCurrentView('insights')}
          className={`flex items-center gap-2 px-2 py-3 text-sm cursor-pointer ${
            currentView === 'insights' 
              ? 'border-b-2 border-[#f78166] text-[#e6edf3]' 
              : 'text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
          Insights
        </button>
      </nav>
    </header>
  );
}

