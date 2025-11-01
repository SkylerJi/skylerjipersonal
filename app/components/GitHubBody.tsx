 'use client';

import { useEffect, useRef, useState } from 'react';
import { History, Copy, GitBranch, FileText, User, Calendar, ThumbsUp, X, GitPullRequest, CheckCircle2, XCircle, MessageSquare, CircleDot } from 'lucide-react';
import type { ViewType } from '../page';

interface BodyProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Body({ currentView, setCurrentView }: BodyProps) {
  // Define content as logical lines (like in a real file)
  // Each line can wrap naturally based on container width
  const lines = [
    {
      content: ["My current favorite things are",
        
        { type: 'link', text: ' anime ', href: 'https://myanimelist.net/profile/skyguy69' },
        "and basketball. I will also cook you in tennis, table tennis, and pickleball."],
    },
    {
      content: ""
    },

    {

      content: [

        "I used to play a lot of video games; I was top 50 in the world in",
        { type: 'link', text: ' bonk.io ', href: 'https://bonkio.fandom.com/wiki/Level_Leaderboard' },
        "and held the 2nd highest DPS in the world in Elder Scrolls Online ever (at the time, I think the meta has shifted now). I also played a ice hockey since I was 5 and played D2 at Berkeley, but I don't play anymore (not good for the ol' cranium)."
        ,
      ]
      
    },
    {
      content: ""
    },
    {
      content: "I came into Berkeley an anthropology major. After teaching myself accounting, I changed to a business major and headed finances and operations at a Series A aerospace manufacturing startup."
    },
    {
      content: ""
    },
    {
      content: [
        "Realizing accounting was the most boring thing ever, I dropped out, taught myself how to code, and built an AI accountant called ",
        { type: 'link', text: 'Dough', href: 'https://makedough.ai' },
        ". Through that journey, I met my cofounders, and we scaled the company until eventually ",
        { type: 'link', text: 'selling it.', href: 'https://www.employer.com/' }
      ]
    },
    {
      content: ""
    },
    {
      content: [
        "We decided to go through YC with a new company called ",
        { type: 'link', text: 'Human Behavior', href: 'https://humanbehavior.co' },
        " <> an AI that watches people use software, helping companies build better products. We ended up raising $5m from General Catalyst, Vercel, and Paul Graham."
      ]
    },

    {
      content: ""
    },
    {
      content: ["Long list of everything else I like talking about: pokemon (cards and go), clash royale, brawl stars, elder scrolls series, dark souls series (completed all the achievements),",
        { type: 'link', text: ' physics/philosophy/stoner thoughts', href: 'https://www.universalism.co/' },
        ", ecommerce, chess, poker, and myself (very narcissistic typa dude)."
      ],
     
    }
  ];

  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const showHistory = currentView === 'history';
  const [discussionFilter, setDiscussionFilter] = useState<'all' | 'general' | 'ideas' | 'q&a'>('all');
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [issueFilter, setIssueFilter] = useState<'open' | 'closed'>('open');
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [showIssueErrorMessage, setShowIssueErrorMessage] = useState(false);
  const [prFilter, setPrFilter] = useState<'open' | 'closed'>('open');
  const [showNewPRModal, setShowNewPRModal] = useState(false);
  const [showPRErrorMessage, setShowPRErrorMessage] = useState(false);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [labelsFilter, setLabelsFilter] = useState('');
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const issueModalRef = useRef<HTMLDivElement>(null);
  const prModalRef = useRef<HTMLDivElement>(null);
  const labelsModalRef = useRef<HTMLDivElement>(null);
  const milestonesModalRef = useRef<HTMLDivElement>(null);
  const deleteErrorModalRef = useRef<HTMLDivElement>(null);

  // Mock commit data
  const commits = [
    {
      hash: '420af67',
      fullHash: '420af67a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      message: 'added random aura farm stats',
      author: 'skylerji',
      authorAvatar: '/githubavatar.png',
      date: new Date('2024-06-15'),
      dateDisplay: 'Jun 15'
    },
    {
      hash: '971ad07',
      fullHash: '971ad07b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
      message: 'feat: update README with company information',
      author: 'skylerji',
      authorAvatar: '/githubavatar.png',
      date: new Date('2024-06-10'),
      dateDisplay: 'Jun 10'
    },
    {
      hash: 'a3f5b21',
      fullHash: 'a3f5b21c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9',
      message: 'initial commit',
      author: 'skylerji',
      authorAvatar: '/githubavatar.png',
      date: new Date('2024-05-01'),
      dateDisplay: 'May 1'
    }
  ];

  // Group commits by date
  const groupedCommits = commits.reduce((acc, commit) => {
    const dateKey = commit.date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(commit);
    return acc;
  }, {} as Record<string, typeof commits>);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate file size for display
  const getTextContent = () => {
    return lines.map(line => {
      if (typeof line.content === 'string') return line.content;
      if (Array.isArray(line.content)) {
        return line.content.map(item => 
          typeof item === 'string' ? item : item.text
        ).join('');
      }
      return '';
    }).join('\n');
  };

  const textContent = getTextContent();
  const fileSizeBytes = new Blob([textContent]).size;
  const fileSizeKB = (fileSizeBytes / 1024).toFixed(2);

  // Calculate line numbers based on actual rendered heights
  useEffect(() => {
    const calculateLineNumbers = () => {
      const lineHeight = 24; // 24px (leading-6)
      const numbers: number[] = [];
      let currentLine = 1;

      contentRefs.current.forEach((ref) => {
        if (ref) {
          const height = ref.offsetHeight;
          const numLines = Math.max(1, Math.round(height / lineHeight));
          
          // Add line numbers for this logical line
          for (let i = 0; i < numLines; i++) {
            numbers.push(i === 0 ? currentLine : 0); // Only show number on first visual line
          }
          
          currentLine++;
        }
      });

      setLineNumbers(numbers);
    };

    // Calculate on mount and resize
    calculateLineNumbers();
    window.addEventListener('resize', calculateLineNumbers);
    
    // Small delay to ensure fonts are loaded
    const timeout = setTimeout(calculateLineNumbers, 100);

    return () => {
      window.removeEventListener('resize', calculateLineNumbers);
      clearTimeout(timeout);
    };
  }, []);

  // Render line content with proper link handling
  const renderLineContent = (content: string | Array<string | { type: string; text: string; href: string }>) => {
    if (typeof content === 'string') {
      return content || <span className="opacity-0">.</span>;
    }
    
    if (Array.isArray(content)) {
      return content.map((item, idx) => {
        if (typeof item === 'string') {
          return <span key={idx}>{item}</span>;
        }
        if (item.type === 'link') {
          return (
            <a 
              key={idx}
              href={item.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#58a6ff] hover:underline"
            >
              {item.text}
            </a>
          );
        }
        return null;
      });
    }
    
    return null;
  };

  // Mock discussions/comments data with creative insults
  const discussions = [
    {
      id: 1,
      title: "Is this README written by a bot?",
      author: "codeReviewer420",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-20'),
      dateDisplay: 'Nov 20',
      category: 'general' as const,
      content: "Seriously, this reads like ChatGPT wrote it after being fed a LinkedIn post. 'I dropped out and taught myself to code' - groundbreaking. 🙄",
      reactions: { thumbsUp: 42, laugh: 18, rocket: 5 },
      replies: [
        {
          author: "devMaster999",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-20'),
          content: "LMAO facts. 'I came into Berkeley an anthropology major' - who asked? 😂",
          reactions: { thumbsUp: 15 }
        },
        {
          author: "harshCritic",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-21'),
          content: "At least ChatGPT would have better grammar. This is just word salad.",
          reactions: { thumbsUp: 23 }
        }
      ]
    },
    {
      id: 2,
      title: "This is the most boring personal website ever",
      author: "designHater",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-18'),
      dateDisplay: 'Nov 18',
      category: 'general' as const,
      content: "You made a GitHub clone... for your personal website? Could you be any more unoriginal? My 12-year-old nephew's GeoCities page had more personality.",
      reactions: { thumbsUp: 67, heart: 2, eyes: 12 },
      replies: [
        {
          author: "creativeDirector",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-18'),
          content: "It's like they Googled 'how to stand out' and did the opposite.",
          reactions: { thumbsUp: 34 }
        }
      ]
    },
    {
      id: 3,
      title: "The hubris is off the charts",
      author: "modestDev",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-15'),
      dateDisplay: 'Nov 15',
      category: 'general' as const,
      content: "'We raised $5m from General Catalyst, Vercel, and Paul Graham' - cool story bro. Doesn't make your README any less cringe. This is peak Silicon Valley humblebrag.",
      reactions: { thumbsUp: 89, laugh: 45, rocket: 8 },
      replies: [
        {
          author: "startupSkeptic",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-15'),
          content: "Name-dropping investors in your personal README? That's a new level of desperate.",
          reactions: { thumbsUp: 52 }
        },
        {
          author: "ycombinatorFan",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-16'),
          content: "At least spell 'YC' correctly if you're gonna flex about it.",
          reactions: { thumbsUp: 28 }
        }
      ]
    },
    {
      id: 4,
      title: "Why is this even a GitHub repo?",
      author: "repoPolice",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-12'),
      dateDisplay: 'Nov 12',
      category: 'q&a' as const,
      content: "This isn't code. This isn't a project. This is just... text. On GitHub. Why? Just use a blog. Or Medium. Or literally anything else. My eyes are bleeding.",
      reactions: { thumbsUp: 91, happy: 12, rocket: 3 },
      replies: [
        {
          author: "gitExpert",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-12'),
          content: "The commit messages are equally terrible. 'added random aura farm stats' - what even is that?",
          reactions: { thumbsUp: 67 }
        },
        {
          author: "linterBot",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-13'),
          content: "Missing: actual code, tests, documentation, purpose, dignity...",
          reactions: { thumbsUp: 44 }
        }
      ]
    },
    {
      id: 5,
      title: "The formatting is atrocious",
      author: "formattingNazi",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-10'),
      dateDisplay: 'Nov 10',
      category: 'ideas' as const,
      content: "Lines wrap weirdly, the spacing is inconsistent, and there's no actual structure. It's like you wrote this in Notepad and called it a day. At least use Markdown properly.",
      reactions: { thumbsUp: 56, heart: 7 },
      replies: [
        {
          author: "markdownMaster",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-10'),
          content: "They probably don't even know what Markdown is. This is just... text.",
          reactions: { thumbsUp: 33 }
        }
      ]
    },
    {
      id: 6,
      title: "Worst README I've ever seen",
      author: "README_Critic",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-08'),
      dateDisplay: 'Nov 8',
      category: 'general' as const,
      content: "I've seen READMEs written by interns on their first day that were better than this. At least those had some structure. This is just... paragraphs. About yourself. On GitHub. Why?",
      reactions: { thumbsUp: 124, laugh: 78, rocket: 15 },
      replies: [
        {
          author: "veteranDev",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-08'),
          content: "In 15 years of development, I've never seen someone so confidently display so little.",
          reactions: { thumbsUp: 89 }
        },
        {
          author: "juniorDev",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-09'),
          content: "This makes me feel better about my own projects. Thanks for setting the bar so low!",
          reactions: { thumbsUp: 56 }
        }
      ]
    },
    {
      id: 7,
      title: "The self-promotion is cringe",
      author: "humbleBee",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-05'),
      dateDisplay: 'Nov 5',
      category: 'general' as const,
      content: "Dropping company names, investor names, and dollar amounts in your personal README? Are you trying to get hired or just impress your mom? Either way, this ain't it.",
      reactions: { thumbsUp: 78, heart: 4 },
      replies: [
        {
          author: "recruiterPro",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-05'),
          content: "As a recruiter, this would actually make me NOT want to hire them. Too much ego.",
          reactions: { thumbsUp: 45 }
        }
      ]
    },
    {
      id: 8,
      title: "This is why people hate personal websites",
      author: "webCritic",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-03'),
      dateDisplay: 'Nov 3',
      category: 'ideas' as const,
      content: "Zero effort. Zero creativity. Zero value. Just... why? You could have made an actual portfolio, or a blog, or literally anything interesting. Instead you made... this. A GitHub repo with text in it.",
      reactions: { thumbsUp: 112, happy: 34, rocket: 9 },
      replies: [
        {
          author: "portfolioDesigner",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-03'),
          content: "My portfolio website took 2 hours and looks better than this. And I'm not even a designer.",
          reactions: { thumbsUp: 67 }
        }
      ]
    },
    {
      id: 9,
      title: "The commit history is hilarious",
      author: "gitHistorian",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-11-01'),
      dateDisplay: 'Nov 1',
      category: 'q&a' as const,
      content: "Three commits total. 'added random aura farm stats' - what does that even mean? Is this a joke? Are you trolling us? Because if not, that's somehow worse.",
      reactions: { thumbsUp: 45, laugh: 89, heart: 12 },
      replies: [
        {
          author: "commitAnalyzer",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-11-01'),
          content: "The commit messages read like they were written by someone who just discovered Git.",
          reactions: { thumbsUp: 56 }
        }
      ]
    },
    {
      id: 10,
      title: "Please delete this",
      author: "concernedCitizen",
      authorAvatar: "/githubavatar.png",
      date: new Date('2024-10-28'),
      dateDisplay: 'Oct 28',
      category: 'ideas' as const,
      content: "For the sake of the internet, just delete this repo. It's not helping anyone. It's not showcasing anything. It's just... there. Taking up space. Making me sad.",
      reactions: { thumbsUp: 203, heart: 1, rocket: 23 },
      replies: [
        {
          author: "internetCleaner",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-10-28'),
          content: "I second this. This should be archived and never spoken of again.",
          reactions: { thumbsUp: 134 }
        },
        {
          author: "preservationist",
          authorAvatar: "/githubavatar.png",
          date: new Date('2024-10-29'),
          content: "Actually, keep it. It's a good example of what NOT to do. Like a cautionary tale.",
          reactions: { thumbsUp: 67 }
        }
      ]
    }
  ];

  // Filter discussions based on selected category
  const filteredDiscussions = discussionFilter === 'all' 
    ? discussions 
    : discussions.filter(d => d.category === discussionFilter);

  const handleNewDiscussionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrorMessage(true);
  };

  const handleNewIssueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowIssueErrorMessage(true);
  };

  const handleNewPRSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPRErrorMessage(true);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNewDiscussionModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowNewDiscussionModal(false);
        setShowErrorMessage(false);
      }
      if (showNewIssueModal && issueModalRef.current && !issueModalRef.current.contains(event.target as Node)) {
        setShowNewIssueModal(false);
        setShowIssueErrorMessage(false);
      }
      if (showNewPRModal && prModalRef.current && !prModalRef.current.contains(event.target as Node)) {
        setShowNewPRModal(false);
        setShowPRErrorMessage(false);
      }
      if (showLabelsModal && labelsModalRef.current && !labelsModalRef.current.contains(event.target as Node)) {
        setShowLabelsModal(false);
        setLabelsFilter('');
      }
      if (showMilestonesModal && milestonesModalRef.current && !milestonesModalRef.current.contains(event.target as Node)) {
        setShowMilestonesModal(false);
      }
      if (showDeleteErrorModal && deleteErrorModalRef.current && !deleteErrorModalRef.current.contains(event.target as Node)) {
        setShowDeleteErrorModal(false);
      }
    };

    if (showNewDiscussionModal || showNewIssueModal || showNewPRModal || showLabelsModal || showMilestonesModal || showDeleteErrorModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewDiscussionModal, showNewIssueModal, showNewPRModal, showLabelsModal, showMilestonesModal, showDeleteErrorModal]);

  // Render discussions view
  if (currentView === 'discussions') {
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
            {/* Discussions heading */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-[#e6edf3]">Discussions</h1>
              <button 
                onClick={() => setShowNewDiscussionModal(true)}
                className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
              >
                New discussion
              </button>
            </div>

            {/* Discussion categories */}
            <div className="flex items-center gap-4 mb-6 border-b border-[#30363d]">
              <button 
                onClick={() => setDiscussionFilter('all')}
                className={`px-4 py-3 text-sm font-medium ${
                  discussionFilter === 'all'
                    ? 'border-b-2 border-[#f78166] text-[#e6edf3]'
                    : 'text-[#7d8590] hover:text-[#e6edf3]'
                }`}
              >
                All discussions
              </button>
              <button 
                onClick={() => setDiscussionFilter('general')}
                className={`px-4 py-3 text-sm ${
                  discussionFilter === 'general'
                    ? 'border-b-2 border-[#f78166] text-[#e6edf3] font-medium'
                    : 'text-[#7d8590] hover:text-[#e6edf3]'
                }`}
              >
                General
              </button>
              <button 
                onClick={() => setDiscussionFilter('ideas')}
                className={`px-4 py-3 text-sm ${
                  discussionFilter === 'ideas'
                    ? 'border-b-2 border-[#f78166] text-[#e6edf3] font-medium'
                    : 'text-[#7d8590] hover:text-[#e6edf3]'
                }`}
              >
                Ideas
              </button>
              <button 
                onClick={() => setDiscussionFilter('q&a')}
                className={`px-4 py-3 text-sm ${
                  discussionFilter === 'q&a'
                    ? 'border-b-2 border-[#f78166] text-[#e6edf3] font-medium'
                    : 'text-[#7d8590] hover:text-[#e6edf3]'
                }`}
              >
                Q&A
              </button>
            </div>

            {/* Discussions list */}
            <div className="space-y-4">
              {filteredDiscussions.length === 0 ? (
                <div className="text-center py-12 text-[#7d8590]">
                  <p className="text-lg mb-2">No discussions found</p>
                  <p className="text-sm">Try selecting a different category</p>
                </div>
              ) : (
                filteredDiscussions.map((discussion) => (
              <div 
                key={discussion.id}
                className="border border-[#30363d] rounded-lg overflow-hidden hover:border-[#484f58] transition-colors"
              >
                <div className="bg-[#161b22] px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#e6edf3] mb-2 hover:text-[#58a6ff] cursor-pointer">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#7d8590] mb-3">
                        <img 
                          src={discussion.authorAvatar} 
                          alt={discussion.author}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                          {discussion.author}
                        </span>
                        <span>•</span>
                        <span>{discussion.dateDisplay}</span>
                      </div>
                      <p className="text-[#c9d1d9] mb-3">{discussion.content}</p>
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                      <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                      {discussion.reactions.thumbsUp}
                    </button>
                    {discussion.reactions.laugh && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                        😂 {discussion.reactions.laugh}
                      </button>
                    )}
                    {discussion.reactions.happy && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                        😄 {discussion.reactions.happy}
                      </button>
                    )}
                    {discussion.reactions.heart && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                        ❤️ {discussion.reactions.heart}
                      </button>
                    )}
                    {discussion.reactions.rocket && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                        🚀 {discussion.reactions.rocket}
                      </button>
                    )}
                    {discussion.reactions.eyes && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                        👀 {discussion.reactions.eyes}
                      </button>
                    )}
                    <span className="text-sm text-[#7d8590] ml-auto">
                      {discussion.replies.length} {discussion.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                </div>

                {/* Replies */}
                {discussion.replies.length > 0 && (
                  <div className="bg-[#0d1117] border-t border-[#30363d] px-6 py-4">
                    <div className="space-y-4">
                      {discussion.replies.map((reply, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <img 
                            src={reply.authorAvatar} 
                            alt={reply.author}
                            className="w-6 h-6 rounded-full shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                                {reply.author}
                              </span>
                              <span className="text-xs text-[#7d8590]">
                                {reply.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-[#c9d1d9] text-sm mb-2">{reply.content}</p>
                            {reply.reactions && (
                              <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#7d8590] hover:bg-[#21262d] rounded cursor-pointer transition-colors">
                                <ThumbsUp className="w-3 h-3" strokeWidth={1.5} />
                                {reply.reactions.thumbsUp}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              ))
              )}
            </div>

            {/* End of discussions */}
            {filteredDiscussions.length > 0 && (
              <div className="mt-8 text-center text-sm text-[#7d8590] py-4">
                That's all, folks! No more discussions... yet.
              </div>
            )}
          </div>
        </div>

        {/* New Discussion Modal */}
        {showNewDiscussionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#e6edf3]">New discussion</h2>
                <button
                  onClick={() => {
                    setShowNewDiscussionModal(false);
                    setShowErrorMessage(false);
                  }}
                  className="text-[#7d8590] hover:text-[#e6edf3] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleNewDiscussionSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Category
                  </label>
                  <select className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]">
                    <option value="general">General</option>
                    <option value="ideas">Ideas</option>
                    <option value="q&a">Q&A</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]"
                    placeholder="Discussion title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Write
                  </label>
                  <textarea
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb] min-h-[200px] resize-y"
                    placeholder="Write your discussion here..."
                    required
                  />
                </div>

                {showErrorMessage && (
                  <div className="mb-4 p-4 bg-[#3d2126] border border-[#86181d] rounded-md">
                    <p className="text-[#f85149] text-sm">
                      Sorry, you aren't worthy of adding to this discussion :(
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewDiscussionModal(false);
                      setShowErrorMessage(false);
                    }}
                    className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
                  >
                    Start discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // Mock closed issues - creative ways of saying "this site sucks"
  const closedIssues = [
    { id: 2, number: 2, title: "This website is terrible", author: "critic1", dateDisplay: "2 days ago" },
    { id: 3, number: 3, title: "Honestly, this site is garbage", author: "harshReviewer", dateDisplay: "3 days ago" },
    { id: 4, number: 4, title: "This site is absolutely awful", author: "nitpicker", dateDisplay: "4 days ago" },
    { id: 5, number: 5, title: "The funny thing is in reality no one would actually visit your site or leave reviews so you had to ask Cursor to write these for you", author: "skylerji", dateDisplay: "5 days ago" },
    { id: 6, number: 6, title: "This site is genuinely terrible", author: "truthTeller", dateDisplay: "6 days ago" },
    { id: 7, number: 7, title: "This website is so bad", author: "honestCritic", dateDisplay: "a week ago" },
    { id: 8, number: 8, title: "This site is really terrible", author: "noFilter", dateDisplay: "a week ago" },
    { id: 9, number: 9, title: "This website is just awful", author: "straightShooter", dateDisplay: "a week ago" },
    { id: 10, number: 10, title: "This site is objectively terrible", author: "factChecker", dateDisplay: "2 weeks ago" },
    { id: 11, number: 11, title: "This website is genuinely awful", author: "realityCheck", dateDisplay: "2 weeks ago" },
    { id: 12, number: 12, title: "This site is honestly terrible", author: "noBS", dateDisplay: "2 weeks ago" },
    { id: 13, number: 13, title: "This website is truly awful", author: "directFeedback", dateDisplay: "3 weeks ago" },
    { id: 14, number: 14, title: "This site is incredibly terrible", author: "bluntReviewer", dateDisplay: "3 weeks ago" },
    { id: 15, number: 15, title: "This website is exceptionally bad", author: "criticMaster", dateDisplay: "3 weeks ago" },
    { id: 16, number: 16, title: "This site is remarkably terrible", author: "honestOpinion", dateDisplay: "a month ago" },
    { id: 17, number: 17, title: "This website is impressively awful", author: "sarcasticDev", dateDisplay: "a month ago" },
    { id: 18, number: 18, title: "This site is spectacularly terrible", author: "hyperboleExpert", dateDisplay: "a month ago" },
    { id: 19, number: 19, title: "This website is unbelievably bad", author: "shockedUser", dateDisplay: "a month ago" },
    { id: 20, number: 20, title: "This site is catastrophically terrible", author: "doomSay", dateDisplay: "2 months ago" },
    { id: 21, number: 21, title: "This website is epically awful", author: "dramaQueen", dateDisplay: "2 months ago" },
    { id: 22, number: 22, title: "This site is monumentally terrible", author: "hyperbolicCritic", dateDisplay: "2 months ago" },
    { id: 23, number: 23, title: "This website is legendarily bad", author: "mythMaker", dateDisplay: "2 months ago" },
    { id: 24, number: 24, title: "This site is historically terrible", author: "archivist", dateDisplay: "3 months ago" },
    { id: 25, number: 25, title: "This website is fundamentally awful", author: "philosopher", dateDisplay: "3 months ago" },
    { id: 26, number: 26, title: "This site is inherently terrible", author: "existentialist", dateDisplay: "3 months ago" },
    { id: 27, number: 27, title: "This website is intrinsically bad", author: "metaphysician", dateDisplay: "3 months ago" },
    { id: 28, number: 28, title: "This site is quintessentially terrible", author: "linguist", dateDisplay: "4 months ago" },
    { id: 29, number: 29, title: "This website is categorically awful", author: "taxonomist", dateDisplay: "4 months ago" },
    { id: 30, number: 30, title: "This site is definitively terrible", author: "authority", dateDisplay: "4 months ago" },
  ];

  // Render issues view
  if (currentView === 'issues') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
          {/* Issues heading */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#e6edf3]">Issues</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNewIssueModal(true)}
                className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
              >
                New issue
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-[#30363d]">
            <button 
              onClick={() => setIssueFilter('open')}
              className={`px-4 py-3 text-sm ${
                issueFilter === 'open'
                  ? 'font-medium border-b-2 border-[#f78166] text-[#e6edf3]'
                  : 'text-[#7d8590] hover:text-[#e6edf3]'
              }`}
            >
              Open
            </button>
            <button 
              onClick={() => setIssueFilter('closed')}
              className={`px-4 py-3 text-sm ${
                issueFilter === 'closed'
                  ? 'font-medium border-b-2 border-[#f78166] text-[#e6edf3]'
                  : 'text-[#7d8590] hover:text-[#e6edf3]'
              }`}
            >
              Closed
            </button>
          </div>

          {/* Issues list */}
          <div className="space-y-4">
            {issueFilter === 'open' ? (
              <div 
                className="border border-[#30363d] rounded-lg overflow-hidden hover:border-[#484f58] transition-colors"
              >
                <div className="bg-[#161b22] px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CircleDot className="w-5 h-5 text-[#238636] shrink-0" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                          This site sucks
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#7d8590] mb-3">
                        <span className="text-[#e6edf3] font-medium">#1</span>
                        <span>opened today by</span>
                        <span className="text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                          anonymous
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              closedIssues.map((issue) => (
                <div 
                  key={issue.id}
                  className="border border-[#30363d] rounded-lg overflow-hidden hover:border-[#484f58] transition-colors"
                >
                  <div className="bg-[#161b22] px-6 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-5 h-5 text-[#da3633] shrink-0" strokeWidth={1.5} />
                          <h3 className="text-lg font-semibold text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                            {issue.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#7d8590] mb-3">
                          <span className="text-[#e6edf3] font-medium">#{issue.number}</span>
                          <span>closed {issue.dateDisplay} by</span>
                          <span className="text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                            {issue.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* End of issues */}
          <div className="mt-8 text-center text-sm text-[#7d8590] py-4">
            You've reached the end of the issues list
          </div>
        </div>

        {/* New Issue Modal */}
        {showNewIssueModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={issueModalRef} className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#e6edf3]">New issue</h2>
                <button
                  onClick={() => {
                    setShowNewIssueModal(false);
                    setShowIssueErrorMessage(false);
                  }}
                  className="text-[#7d8590] hover:text-[#e6edf3] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleNewIssueSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]"
                    placeholder="Issue title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Write
                  </label>
                  <textarea
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb] min-h-[200px] resize-y"
                    placeholder="Write your issue here..."
                    required
                  />
                </div>

                {showIssueErrorMessage && (
                  <div className="mb-4 p-4 bg-[#3d2126] border border-[#86181d] rounded-md">
                    <p className="text-[#f85149] text-sm">
                      Sorry, you aren't allowed to create issues because you get brutally mogged by skyler :(
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewIssueModal(false);
                      setShowIssueErrorMessage(false);
                    }}
                    className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
                  >
                    Submit new issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mock pull requests data
  const pullRequests = [
    {
      id: 1,
      number: 42,
      title: "Remove LinkedIn-style humblebrag from README",
      author: "sarah-codes",
      authorAvatar: "/githubavatar.png",
      branch: "sarah-codes:patch-1",
      baseBranch: "skylerji:main",
      status: 'open' as const,
      date: new Date('2024-11-20'),
      dateDisplay: '2 days ago',
      description: "This PR removes the excessive name-dropping and Silicon Valley flexing. The README should be about you, not your investors. Let's keep it simple and authentic.",
      changes: { additions: 15, deletions: 47 },
      comments: 8,
      reviewStatus: 'pending' as const,
      labels: ['enhancement', 'documentation']
    },
    {
      id: 2,
      number: 41,
      title: "Fix: Make README actually readable",
      author: "devCritic",
      authorAvatar: "/githubavatar.png",
      branch: "devCritic:readable-readme",
      baseBranch: "skylerji:main",
      status: 'closed' as const,
      date: new Date('2024-11-18'),
      dateDisplay: '4 days ago',
      description: "Current README is just word salad. This PR adds proper structure, formatting, and actually makes it readable. No more walls of text.",
      changes: { additions: 89, deletions: 12 },
      comments: 12,
      reviewStatus: 'rejected',
      labels: ['bug', 'documentation']
    },
    {
      id: 3,
      number: 40,
      title: "Remove investor name-dropping",
      author: "humbleDev",
      authorAvatar: "/githubavatar.png",
      branch: "humbleDev:remove-flex",
      baseBranch: "skylerji:main",
      status: 'closed' as const,
      date: new Date('2024-11-15'),
      dateDisplay: 'a week ago',
      description: "Seriously, who puts investor names in their personal README? This is peak cringe. Let's remove all mentions of Vercel, General Catalyst, and Paul Graham.",
      changes: { additions: 3, deletions: 1 },
      comments: 23,
      reviewStatus: 'rejected',
      labels: ['enhancement']
    },
    {
      id: 4,
      number: 39,
      title: "Rewrite: Remove the 'I dropped out' narrative",
      author: "professionalWriter",
      authorAvatar: "/githubavatar.png",
      branch: "professionalWriter:rewrite-readme",
      baseBranch: "skylerji:main",
      status: 'closed' as const,
      date: new Date('2024-11-12'),
      dateDisplay: '10 days ago',
      description: "The 'I dropped out and taught myself to code' story is so overdone. Let's rewrite this to focus on what you actually do, not your origin story.",
      changes: { additions: 156, deletions: 89 },
      comments: 6,
      reviewStatus: 'rejected',
      labels: ['documentation', 'question']
    },
    {
      id: 5,
      number: 38,
      title: "Add actual structure and formatting to README",
      author: "markdownMaster",
      authorAvatar: "/githubavatar.png",
      branch: "markdownMaster:proper-formatting",
      baseBranch: "skylerji:main",
      status: 'closed' as const,
      date: new Date('2024-11-10'),
      dateDisplay: '2 weeks ago',
      description: "Current README has zero structure. This adds proper Markdown formatting, sections, and makes it look like an actual README file instead of a Twitter bio.",
      changes: { additions: 234, deletions: 78 },
      comments: 4,
      reviewStatus: 'rejected',
      labels: ['documentation', 'good first issue']
    }
  ];

  // Available labels
  const availableLabels = [
    { name: 'bug', color: '#d73a4a', description: 'Something isn\'t working' },
    { name: 'documentation', color: '#0075ca', description: 'Improvements or additions to documentation' },
    { name: 'enhancement', color: '#a2eeef', description: 'New feature or request', textColor: '#000000' },
    { name: 'good first issue', color: '#7057ff', description: 'Good for newcomers' },
    { name: 'question', color: '#d876e3', description: 'Further information is requested' },
    { name: 'help wanted', color: '#008672', description: 'Extra attention is needed' },
    { name: 'wontfix', color: '#ffffff', description: 'This will not be worked on', textColor: '#000000' },
  ];

  // Render pull requests view
  if (currentView === 'pullrequests') {
    const filteredPullRequests = pullRequests.filter(pr => pr.status === prFilter);
    
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
          {/* Pull requests heading */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#e6edf3]">Pull requests</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNewPRModal(true)}
                className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
              >
                New pull request
              </button>
              <button 
                onClick={() => setShowLabelsModal(true)}
                className="px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-md border border-[#30363d] cursor-pointer transition-colors"
              >
                Labels
              </button>
              <button 
                onClick={() => setShowMilestonesModal(true)}
                className="px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-md border border-[#30363d] cursor-pointer transition-colors"
              >
                Milestones
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-[#30363d]">
            <button 
              onClick={() => setPrFilter('open')}
              className={`px-4 py-3 text-sm ${
                prFilter === 'open'
                  ? 'font-medium border-b-2 border-[#f78166] text-[#e6edf3]'
                  : 'text-[#7d8590] hover:text-[#e6edf3]'
              }`}
            >
              Open
            </button>
            <button 
              onClick={() => setPrFilter('closed')}
              className={`px-4 py-3 text-sm ${
                prFilter === 'closed'
                  ? 'font-medium border-b-2 border-[#f78166] text-[#e6edf3]'
                  : 'text-[#7d8590] hover:text-[#e6edf3]'
              }`}
            >
              Closed
            </button>
          </div>

          {/* Pull requests list */}
          <div className="space-y-4">
            {filteredPullRequests.length === 0 ? (
              <div className="text-center py-12 text-[#7d8590]">
                <p className="text-lg mb-2">No pull requests found</p>
                <p className="text-sm">Try selecting a different filter</p>
              </div>
            ) : (
              filteredPullRequests.map((pr) => (
              <div 
                key={pr.id}
                className="border border-[#30363d] rounded-lg overflow-hidden hover:border-[#484f58] transition-colors"
              >
                <div className="bg-[#161b22] px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {pr.status === 'open' ? (
                          <CircleDot className="w-5 h-5 text-[#238636] shrink-0" strokeWidth={1.5} />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#da3633] shrink-0" strokeWidth={1.5} />
                        )}
                        <h3 className="text-lg font-semibold text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                          {pr.title}
                        </h3>
                        {pr.status === 'open' ? (
                          <span className="px-2 py-0.5 text-xs font-medium bg-[#238636] text-white rounded-full">
                            Open
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium bg-[#da3633] text-white rounded-full">
                            Closed
                          </span>
                        )}
                        {pr.labels && pr.labels.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {pr.labels.map((label, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-0.5 text-xs font-medium bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded-full hover:border-[#484f58] transition-colors"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#7d8590] mb-3">
                        <span className="text-[#e6edf3] font-medium">#{pr.number}</span>
                        <span>{pr.status === 'open' ? 'opened' : 'closed'} {pr.dateDisplay} by</span>
                        <span className="text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer">
                          {pr.author}
                        </span>
                        <span>•</span>
                        <span>{pr.changes.additions} additions</span>
                        <span>•</span>
                        <span>{pr.changes.deletions} deletions</span>
                      </div>
                      <p className="text-[#c9d1d9] mb-3">{pr.description}</p>
                      <div className="flex items-center gap-4 text-sm text-[#7d8590]">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4" strokeWidth={1.5} />
                          <span className="text-[#e6edf3]">{pr.author}</span>
                          <span className="text-[#7d8590]">:</span>
                          <span className="text-[#58a6ff]">{pr.branch.split(':')[1]}</span>
                        </div>
                        <span>→</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#e6edf3]">skylerji</span>
                          <span className="text-[#7d8590]">:</span>
                          <span className="text-[#58a6ff]">main</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PR actions */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#30363d]">
                    {pr.reviewStatus === 'rejected' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#da3633] bg-[#da3633]/10 rounded-md border border-[#da3633]/20">
                        <XCircle className="w-4 h-4" strokeWidth={1.5} />
                        Rejected
                      </div>
                    )}
                    {pr.reviewStatus === 'approved' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#238636] bg-[#238636]/10 rounded-md border border-[#238636]/20">
                        <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                        Approved
                      </div>
                    )}
                    {pr.reviewStatus === 'pending' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] bg-[#21262d] rounded-md border border-[#30363d]">
                        <CircleDot className="w-4 h-4" strokeWidth={1.5} />
                        Pending review
                      </div>
                    )}
                    {pr.reviewStatus === 'changes_requested' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#da3633] bg-[#da3633]/10 rounded-md border border-[#da3633]/20">
                        <XCircle className="w-4 h-4" strokeWidth={1.5} />
                        Changes requested
                      </div>
                    )}
                    {pr.reviewStatus === 'merged' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#8957e5] bg-[#8957e5]/10 rounded-md border border-[#8957e5]/20">
                        <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                        Merged
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-[#7d8590]">
                      <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                      {pr.comments} {pr.comments === 1 ? 'comment' : 'comments'}
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* End of pull requests */}
          <div className="mt-8 text-center text-sm text-[#7d8590] py-4">
            You've reached the end of the pull requests list
          </div>
        </div>

        {/* New Pull Request Modal */}
        {showNewPRModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={prModalRef} className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#e6edf3]">New pull request</h2>
                <button
                  onClick={() => {
                    setShowNewPRModal(false);
                    setShowPRErrorMessage(false);
                  }}
                  className="text-[#7d8590] hover:text-[#e6edf3] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleNewPRSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]"
                    placeholder="Pull request title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Base branch
                  </label>
                  <select className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]">
                    <option value="main">main</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Compare branch
                  </label>
                  <select className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]">
                    <option value="">Select a branch</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb] min-h-[200px] resize-y"
                    placeholder="Describe your pull request..."
                    required
                  />
                </div>

                {showPRErrorMessage && (
                  <div className="mb-4 p-4 bg-[#3d2126] border border-[#86181d] rounded-md">
                    <p className="text-[#f85149] text-sm">
                      Sorry, you aren't allowed to create pull requests because you get brutally mogged by skyler :(
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPRModal(false);
                      setShowPRErrorMessage(false);
                    }}
                    className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
                  >
                    Create pull request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Labels Modal */}
        {showLabelsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={labelsModalRef} className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#e6edf3]">Labels</h2>
                <button
                  onClick={() => {
                    setShowLabelsModal(false);
                    setLabelsFilter('');
                  }}
                  className="text-[#7d8590] hover:text-[#e6edf3] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    value={labelsFilter}
                    onChange={(e) => setLabelsFilter(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]"
                    placeholder="Filter labels"
                  />
                </div>

                <div className="space-y-2">
                  {availableLabels
                    .filter(label => 
                      label.name.toLowerCase().includes(labelsFilter.toLowerCase()) ||
                      label.description.toLowerCase().includes(labelsFilter.toLowerCase())
                    )
                    .map((label) => (
                    <div 
                      key={label.name}
                      className="flex items-center justify-between p-3 border border-[#30363d] rounded-md hover:bg-[#21262d] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: label.color,
                            color: label.textColor || '#ffffff'
                          }}
                        >
                          {label.name}
                        </span>
                        <span className="text-sm text-[#7d8590]">{label.description}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#7d8590]">
                        <span>{pullRequests.filter(pr => pr.labels?.includes(label.name)).length} pull requests</span>
                      </div>
                    </div>
                  ))}
                  {availableLabels.filter(label => 
                    label.name.toLowerCase().includes(labelsFilter.toLowerCase()) ||
                    label.description.toLowerCase().includes(labelsFilter.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-8 text-[#7d8590]">
                      <p className="text-sm">No labels found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestones Modal */}
        {showMilestonesModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={milestonesModalRef} className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#e6edf3]">Milestones</h2>
                <button
                  onClick={() => setShowMilestonesModal(false)}
                  className="text-[#7d8590] hover:text-[#e6edf3] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#e6edf3] focus:outline-none focus:border-[#1f6feb]"
                    placeholder="Filter milestones"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-center py-8 text-[#7d8590]">
                    <p className="text-sm">No milestones found</p>
                    <p className="text-xs mt-1">You haven't created any milestones yet.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render actions view
  if (currentView === 'actions') {
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <button
                  onClick={() => setShowDeleteErrorModal(true)}
                  className="px-6 py-3 bg-[#da3633] hover:bg-[#f85149] text-white font-semibold rounded-md cursor-pointer transition-colors"
                >
                  Delete this website
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Error Modal */}
        {showDeleteErrorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={deleteErrorModalRef} className="bg-[#161b22] border border-[#da3633] rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-[#da3633] flex-shrink-0" strokeWidth={1.5} />
                  <h2 className="text-xl font-semibold text-[#e6edf3]">Error</h2>
                </div>
                <p className="text-[#c9d1d9] mb-6">
                  Leaking your IP to Skyler
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDeleteErrorModal(false)}
                    className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md cursor-pointer transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render security view
  if (currentView === 'security') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#e6edf3] mb-4">This site is not secure at all, please don't hack it</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render projects view
  if (currentView === 'projects') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#e6edf3] mb-2">Projects</h1>
            <p className="text-[#7d8590] text-sm">Showing all projects by skylerji</p>
          </div>

          {/* Projects list */}
          <div className="space-y-4">
            <div className="border border-[#30363d] rounded-lg overflow-hidden hover:border-[#484f58] transition-colors">
              <div className="bg-[#161b22] px-6 py-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#e6edf3] mb-2 hover:text-[#58a6ff] cursor-pointer">
                      Science Fair Project: Which Salt Melts Ice Faster?
                    </h2>
                    <p className="text-[#c9d1d9] mb-4">
                      A groundbreaking scientific investigation conducted to determine which type of salt melts ice the fastest. 
                      This project showcased early scientific methodology and curiosity about the natural world. The results were inconclusive. I'm not sure if I did it right.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#7d8590] mb-4">
                      <span>Status: <span className="text-[#238636]">Completed</span></span>
                      <span>•</span>
                      <span>2012</span>
                      <span>•</span>
                      <span>Category: Science Fair</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-1 text-xs bg-[#21262d] border border-[#30363d] rounded-md text-[#7d8590]">
                        Science
                      </span>
                      <span className="px-2 py-1 text-xs bg-[#21262d] border border-[#30363d] rounded-md text-[#7d8590]">
                        Ice
                      </span>
                      <span className="px-2 py-1 text-xs bg-[#21262d] border border-[#30363d] rounded-md text-[#7d8590]">
                        Salt
                      </span>
                      <span className="px-2 py-1 text-xs bg-[#21262d] border border-[#30363d] rounded-md text-[#7d8590]">
                        Experiment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* End of projects */}
          <div className="mt-8 text-center text-sm text-[#7d8590] py-4">
            That's all the projects! (For now...)
          </div>
        </div>
      </div>
    );
  }

  // Render insights view
  if (currentView === 'insights') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#e6edf3] mb-2">Insights</h1>
            <p className="text-[#7d8590] text-lg">Statistical evidence that Skyler is the goat</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* GOAT Score Over Time */}
            <div className="border border-[#30363d] rounded-lg bg-[#161b22] p-6">
              <h2 className="text-xl font-semibold text-[#e6edf3] mb-4">GOAT Score Over Time</h2>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  <line x1="40" y1="160" x2="360" y2="160" stroke="#30363d" strokeWidth="1" />
                  <line x1="40" y1="120" x2="360" y2="120" stroke="#30363d" strokeWidth="1" />
                  <line x1="40" y1="80" x2="360" y2="80" stroke="#30363d" strokeWidth="1" />
                  <line x1="40" y1="40" x2="360" y2="40" stroke="#30363d" strokeWidth="1" />
                  <line x1="40" y1="160" x2="40" y2="20" stroke="#30363d" strokeWidth="1" />
                  
                  {/* Y-axis labels */}
                  <text x="35" y="165" fill="#7d8590" fontSize="10" textAnchor="end">0</text>
                  <text x="35" y="125" fill="#7d8590" fontSize="10" textAnchor="end">50</text>
                  <text x="35" y="85" fill="#7d8590" fontSize="10" textAnchor="end">100</text>
                  <text x="35" y="45" fill="#7d8590" fontSize="10" textAnchor="end">150</text>
                  
                  {/* X-axis labels */}
                  <text x="80" y="175" fill="#7d8590" fontSize="10" textAnchor="middle">2020</text>
                  <text x="160" y="175" fill="#7d8590" fontSize="10" textAnchor="middle">2021</text>
                  <text x="240" y="175" fill="#7d8590" fontSize="10" textAnchor="middle">2022</text>
                  <text x="320" y="175" fill="#7d8590" fontSize="10" textAnchor="middle">2024</text>
                  
                  {/* GOAT Score line */}
                  <polyline
                    points="80,140 120,110 160,90 200,70 240,55 280,45 320,35"
                    fill="none"
                    stroke="#f78166"
                    strokeWidth="3"
                  />
                  
                  {/* Data points */}
                  <circle cx="80" cy="140" r="4" fill="#f78166" />
                  <circle cx="120" cy="110" r="4" fill="#f78166" />
                  <circle cx="160" cy="90" r="4" fill="#f78166" />
                  <circle cx="200" cy="70" r="4" fill="#f78166" />
                  <circle cx="240" cy="55" r="4" fill="#f78166" />
                  <circle cx="280" cy="45" r="4" fill="#f78166" />
                  <circle cx="320" cy="35" r="4" fill="#f78166" />
                  
                  {/* Max value label */}
                  <text x="330" y="30" fill="#f78166" fontSize="12" fontWeight="bold">∞</text>
                </svg>
              </div>
              <p className="text-[#7d8590] text-sm mt-2">Score continues to increase exponentially</p>
            </div>

            {/* Comparison Chart */}
            <div className="border border-[#30363d] rounded-lg bg-[#161b22] p-6">
              <h2 className="text-xl font-semibold text-[#e6edf3] mb-4">GOAT Level Comparison</h2>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Bar chart */}
                  <rect x="50" y="130" width="60" height="30" fill="#7d8590" opacity="0.3" />
                  <text x="80" y="195" fill="#7d8590" fontSize="10" textAnchor="middle">You</text>
                  <text x="80" y="125" fill="#7d8590" fontSize="12" textAnchor="middle">10%</text>
                  
                  
                  <rect x="130" y="80" width="60" height="80" fill="#7d8590" opacity="0.5" />
                  <text x="160" y="195" fill="#7d8590" fontSize="10" textAnchor="middle">Good</text>
                  <text x="160" y="75" fill="#7d8590" fontSize="12" textAnchor="middle">40%</text>
                  
                  <rect x="210" y="60" width="60" height="100" fill="#7d8590" opacity="0.7" />
                  <text x="240" y="195" fill="#7d8590" fontSize="10" textAnchor="middle">Great</text>
                  <text x="240" y="55" fill="#7d8590" fontSize="12" textAnchor="middle">50%</text>
                  
                  {/* Skyler's bar - goes off chart */}
                  <rect x="290" y="0" width="60" height="160" fill="#f78166" />
                  <text x="320" y="190" fill="#f78166" fontSize="10" textAnchor="middle" fontWeight="bold">Skyler</text>
                  <text x="320" y="15" fill="#e6edf3" fontSize="14" textAnchor="middle" fontWeight="bold">GOAT</text>
                  <text x="320" y="30" fill="#e6edf3" fontSize="10" textAnchor="middle">100%+</text>
                  
                  {/* Y-axis */}
                  <line x1="40" y1="160" x2="40" y2="20" stroke="#30363d" strokeWidth="1" />
                  <line x1="40" y1="160" x2="400" y2="160" stroke="#30363d" strokeWidth="1" />
                </svg>
              </div>
              <p className="text-[#7d8590] text-sm mt-2">Skyler exceeds all measurable metrics</p>
            </div>

            {/* Skill Radar Chart */}
            <div className="border border-[#30363d] rounded-lg bg-[#161b22] p-6">
              <h2 className="text-xl font-semibold text-[#e6edf3] mb-4">Skill Matrix</h2>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 300 300">
                  {/* Outer circle */}
                  <circle cx="150" cy="150" r="100" fill="none" stroke="#30363d" strokeWidth="1" />
                  <circle cx="150" cy="150" r="75" fill="none" stroke="#30363d" strokeWidth="1" />
                  <circle cx="150" cy="150" r="50" fill="none" stroke="#30363d" strokeWidth="1" />
                  <circle cx="150" cy="150" r="25" fill="none" stroke="#30363d" strokeWidth="1" />
                  
                  {/* Axis lines */}
                  <line x1="150" y1="150" x2="150" y2="50" stroke="#30363d" strokeWidth="1" />
                  <line x1="150" y1="150" x2="250" y2="150" stroke="#30363d" strokeWidth="1" />
                  <line x1="150" y1="150" x2="50" y2="150" stroke="#30363d" strokeWidth="1" />
                  <line x1="150" y1="150" x2="75" y2="75" stroke="#30363d" strokeWidth="1" />
                  <line x1="150" y1="150" x2="225" y2="75" stroke="#30363d" strokeWidth="1" />
                  <line x1="150" y1="150" x2="75" y2="225" stroke="#30363d" strokeWidth="1" />
                  <line x1="150" y1="150" x2="225" y2="225" stroke="#30363d" strokeWidth="1" />
                  
                  {/* Skill labels */}
                  <text x="150" y="40" fill="#7d8590" fontSize="11" textAnchor="middle">Coding</text>
                  <text x="265" y="155" fill="#7d8590" fontSize="11" textAnchor="middle">Design</text>
                  <text x="35" y="155" fill="#7d8590" fontSize="11" textAnchor="middle">Strategy</text>
                  <text x="50" y="65" fill="#7d8590" fontSize="11" textAnchor="middle">Leadership</text>
                  <text x="250" y="65" fill="#7d8590" fontSize="11" textAnchor="middle">Innovation</text>
                  <text x="50" y="240" fill="#7d8590" fontSize="11" textAnchor="middle">Vision</text>
                  <text x="250" y="240" fill="#7d8590" fontSize="11" textAnchor="middle">Execution</text>
                  
                  {/* Skyler's skills - all maxed out */}
                  <polygon
                    points="150,50 235,75 250,150 235,225 150,250 65,225 50,150 65,75"
                    fill="#f78166"
                    opacity="0.3"
                  />
                  <polygon
                    points="150,50 235,75 250,150 235,225 150,250 65,225 50,150 65,75"
                    fill="none"
                    stroke="#f78166"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <p className="text-[#7d8590] text-sm mt-2">All skills at maximum capacity</p>
            </div>

            {/* Impact Metrics */}
            <div className="border border-[#30363d] rounded-lg bg-[#161b22] p-6">
              <h2 className="text-xl font-semibold text-[#e6edf3] mb-4">Impact Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#c9d1d9] text-sm">Handsome</span>
                    <span className="text-[#f78166] font-bold">Just ask my mom</span>
                  </div>
                  <div className="w-full bg-[#0d1117] rounded-full h-2">
                    <div className="bg-[#f78166] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#c9d1d9] text-sm">Chillness</span>
                    <span className="text-[#f78166] font-bold">Yea</span>
                  </div>
                  <div className="w-full bg-[#0d1117] rounded-full h-2">
                    <div className="bg-[#f78166] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#c9d1d9] text-sm">Highest I can count</span>
                    <span className="text-[#f78166] font-bold">10 out of 10</span>
                  </div>
                  <div className="w-full bg-[#0d1117] rounded-full h-2">
                    <div className="bg-[#f78166] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#c9d1d9] text-sm">Motion</span>
                    <span className="text-[#f78166] font-bold">I got that</span>
                  </div>
                  <div className="w-full bg-[#0d1117] rounded-full h-2">
                    <div className="bg-[#f78166] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#c9d1d9] text-sm">Achievement Unlocked</span>
                    <span className="text-[#f78166] font-bold">GOAT Status</span>
                  </div>
                  <div className="w-full bg-[#0d1117] rounded-full h-2">
                    <div className="bg-[#f78166] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="border border-[#30363d] rounded-lg bg-[#161b22] p-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#e6edf3] mb-2">Skyler is the goat</h2>
              <p className="text-[#7d8590] text-lg">The data doesn't lie</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render commit history view
  if (showHistory) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
          {/* Commits heading */}
          <h1 className="text-2xl font-semibold text-[#e6edf3] mb-4">Commits</h1>

          {/* History path */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-[#7d8590]">
              <span>History for</span>
              <button 
                onClick={() => setCurrentView('code')}
                className="text-[#58a6ff] hover:underline cursor-pointer active:opacity-70 transition-opacity"
              >
                skylerji
              </button>
              <span>/</span>
              <button 
                onClick={() => setCurrentView('code')}
                className="text-[#58a6ff] hover:underline cursor-pointer active:opacity-70 transition-opacity"
              >
                README
              </button>
              <span>/</span>
              <button 
                onClick={() => setCurrentView('code')}
                className="text-[#58a6ff] hover:underline cursor-pointer active:opacity-70 transition-opacity"
              >
                README.md
              </button>
              <span>on</span>
              <span className="px-2 py-0.5 bg-[#21262d] border border-[#30363d] rounded-full text-xs text-[#58a6ff]">
                main
              </span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] active:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                <User className="w-4 h-4" strokeWidth={1.5} />
                All users
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] active:bg-[#21262d] rounded-md border border-[#30363d] cursor-pointer transition-colors">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                All time
              </button>
            </div>
          </div>

          {/* Commits list */}
          <div className="space-y-6">
            {Object.entries(groupedCommits).map(([date, dateCommits]) => (
              <div key={date}>
                <div className="text-sm text-[#7d8590] mb-3 font-medium">
                  Commits on {date}
                </div>
                <div className="space-y-1">
                  {dateCommits.map((commit) => (
                    <div 
                      key={commit.hash}
                      className="flex items-center justify-between py-3 px-4 border border-[#30363d] rounded-md hover:bg-[#161b22] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-[#e6edf3] font-medium">
                            {commit.message}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#7d8590]">
                          <img 
                            src={commit.authorAvatar} 
                            alt={commit.author}
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="text-[#e6edf3] hover:text-[#58a6ff] active:text-[#4493f8] cursor-pointer transition-colors">
                            {commit.author}
                          </span>
                          <span>committed on {commit.dateDisplay}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs font-mono text-[#7d8590]">
                          {commit.hash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(commit.fullHash)}
                          className="p-1.5 text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] active:bg-[#30363d] active:scale-95 rounded cursor-pointer transition-all"
                          title="Copy full SHA"
                        >
                          <Copy className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          className="p-1.5 text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] active:bg-[#30363d] active:scale-95 rounded cursor-pointer transition-all"
                          title="View parent"
                        >
                          <GitBranch className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => setCurrentView('code')}
                          className="p-1.5 text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] active:bg-[#30363d] active:scale-95 rounded cursor-pointer transition-all"
                          title="Browse files at this commit"
                        >
                          <FileText className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* End of history */}
          <div className="mt-8 text-center text-sm text-[#7d8590] py-4">
            End of commit history for this file
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
        {/* File path breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <button className="text-[#58a6ff] hover:underline cursor-pointer active:opacity-70 transition-opacity">skylerji</button>
          <span className="text-[#7d8590]">/</span>
          <button className="text-[#58a6ff] hover:underline font-semibold cursor-pointer active:opacity-70 transition-opacity">README</button>
          <span className="text-[#7d8590]">/</span>
          <span className="text-[#e6edf3]">README.md</span>
        </div>

        {/* Commit info bar */}
        <div className="flex items-center justify-between mb-4 text-sm border p-2 rounded-lg border-[#30363d]">
          <div className="flex items-center gap-2">
            <img 
              src="/githubavatar.png" 
              alt="Avatar" 
              className="w-6 h-6 rounded-full object-cover"
            />
            <a href="#" className="text-[#e6edf3] hover:text-[#58a6ff] font-semibold">skylerji</a>
            <a href="#" className="text-gray-500 hover:text-[#58a6ff]">added random aura farm stats</a>
          </div>
          <div className="flex items-center gap-4 text-[#7d8590]">
            <a href="#" className="hover:text-[#58a6ff] flex items-center gap-1">
              <span className="font-mono text-xs">420af67</span>
            </a>
            <span className="hidden sm:inline">0 minutes ago</span>
            <button 
              onClick={() => setCurrentView('history')}
              className="hover:text-[#58a6ff] active:text-[#4493f8] active:scale-95 flex items-center gap-1 cursor-pointer transition-all"
            >
              <History className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>

        {/* GitHub-style file viewer */}
        <div className="border border-[#30363d] rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-3 py-1 text-sm font-medium bg-[#21262d] text-[#c9d1d9] rounded-md border border-[#30363d] hover:bg-[#30363d] active:bg-[#1c2128] active:scale-95 cursor-pointer transition-all">
                Code
              </button>
              <button className="px-3 py-1 text-sm text-[#7d8590] hover:text-[#c9d1d9] active:text-[#e6edf3] active:scale-95 cursor-pointer transition-all">
                Blame
              </button>
            </div>
            <div className="text-xs text-[#7d8590]">
              {lines.length} lines ({fileSizeKB} KB)
            </div>
          </div>

          {/* File content */}
          <div className="bg-[#0d1117]">
            <div className="flex">
              {/* Line numbers - dynamically calculated */}
              <div className="bg-[#0d1117] text-[#6e7681] text-right py-3 px-3 select-none border-r border-[#30363d] text-xs font-mono leading-6 shrink-0">
                {lineNumbers.map((num, index) => (
                  <div key={index} className="h-6">
                    {num > 0 ? num : ''}
                  </div>
                ))}
              </div>

              {/* Content - wraps naturally */}
              <div className="flex-1 py-3 px-4 text-sm leading-6 font-[system-ui] overflow-x-auto">
                {lines.map((line, index) => (
                  <div 
                    key={index} 
                    ref={el => { contentRefs.current[index] = el; }}
                    className="leading-6 wrap-break-word"
                  >
                    {renderLineContent(line.content)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (optional GitHub-style metadata) */}
        <div className="mt-4 text-xs text-[#7d8590] flex items-center gap-4">
          <span>README.md</span>
          <span>•</span>
          <span>Last updated just now</span>
        </div>
      </div>
    </div>
  );
}

