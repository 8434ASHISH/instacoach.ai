import React, { useState } from 'react';
import { generateInstaContent } from './services/gemini';
import { AppResponse, ContentType, UserProfile, PlanType, PlatformType } from './types';
import { ResultsRenderer } from './components/ResultsRenderer';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { Button, Input, Label, Select, TextArea, Card, Badge, Avatar } from './components/UI';
import { 
  Sparkles, Layout, Video, Hash, Calendar, Settings, 
  Instagram, Facebook, Twitter, Youtube, Phone, 
  ChevronRight, ArrowLeft, PenTool, Crown
} from 'lucide-react';

const App = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<'app' | 'dashboard'>('app');
  
  // User & Plan State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Creator',
    email: 'alex@instacoach.ai',
    country: 'India',
    gender: 'Male',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=c0aede'
  });

  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const isPremium = currentPlan !== 'free';

  // App State
  const [activeTab, setActiveTab] = useState<ContentType>('caption');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('instagram');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('friendly');
  const [language, setLanguage] = useState('English');
  const [additionalContext, setAdditionalContext] = useState('');

  const handleLogin = (user: UserProfile) => {
    setUserProfile(user);
    setIsAuthenticated(true);
    setViewMode('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setResult(null);
    setTopic('');
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
  };

  const handleGenerate = async () => {
    if (!topic) return;

    setLoading(true);
    setError(null);
    setResult(null);

    let prompt = "";
    
    // Construct the user prompt based on active tab
    switch (activeTab) {
      case 'caption':
        prompt = `Generate 3 ${selectedPlatform} captions/posts for "${topic}". Tone: ${tone}. Language: ${language}. Context: ${additionalContext}.`;
        break;
      case 'bio':
        prompt = `Write 3 ${selectedPlatform} bios for "${topic}". Tone: ${tone}. Language: ${language}. Context: ${additionalContext}.`;
        break;
      case 'hashtags':
        prompt = `Give me a hashtag strategy for "${topic}" on ${selectedPlatform} (Intent: Reach & Engagement). Language: ${language}.`;
        break;
      case 'reel_script':
        prompt = `Create a 30-second short video script for "${topic}" on ${selectedPlatform}. Tone: ${tone}. Language: ${language}. Hook-first approach.`;
        break;
      case '30_day_plan':
        prompt = `Create a 7-day mini content plan for the niche "${topic}" optimized for ${selectedPlatform}. Language: ${language}.`;
        break;
      default:
        setLoading(false);
        return;
    }

    try {
      const data = await generateInstaContent(prompt, selectedPlatform, isPremium);
      setResult(data);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: ContentType; label: string; icon: React.ElementType; description: string }[] = [
    { id: 'caption', label: 'Post Generator', icon: Layout, description: 'Viral captions' },
    { id: 'bio', label: 'Bio Creator', icon: PenTool, description: 'Profile intros' },
    { id: 'hashtags', label: 'Hashtag Stack', icon: Hash, description: 'Reach more people' },
    { id: 'reel_script', label: 'Video Script', icon: Video, description: 'Shorts & Reels' },
    { id: '30_day_plan', label: 'Content Plan', icon: Calendar, description: 'Weekly strategy' },
  ];

  const platforms: { id: PlatformType; name: string; icon: React.ElementType; color: string }[] = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 to-pink-600' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'bg-black' },
    { id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'bg-green-500' },
  ];

  const handleTabChange = (id: ContentType) => {
    setActiveTab(id);
    setResult(null);
    setError(null);
  }

  // If not authenticated, show Auth screen
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 text-xl font-bold text-slate-900 tracking-tight cursor-pointer" onClick={() => setViewMode('app')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">InstaCoach</span>
        </div>

        {/* Right Actions: Upgrade + Profile */}
        <div className="flex items-center gap-4">
          {!isPremium && viewMode !== 'dashboard' && (
             <Button variant="premium" className="hidden sm:flex text-xs py-2 px-4 h-9" onClick={() => setViewMode('dashboard')}>
               <Crown className="w-3.5 h-3.5 mr-1" /> Upgrade to Pro
             </Button>
          )}

          <button 
            onClick={() => setViewMode('dashboard')}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{isPremium ? 'Pro Plan' : 'Free Plan'}</p>
            </div>
            <Avatar src={userProfile.avatarUrl} alt="User" size="sm" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8">
        
        {viewMode === 'dashboard' ? (
          <div>
            <Button variant="ghost" onClick={() => setViewMode('app')} className="mb-6 pl-0 hover:bg-transparent hover:text-pink-600">
              <ArrowLeft className="w-4 h-4" /> Back to Studio
            </Button>
            <Dashboard 
              user={userProfile} 
              currentPlan={currentPlan} 
              onPlanChange={setCurrentPlan} 
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            {/* Step 1: Platform Selection */}
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">1</span>
                Select Platform
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {platforms.map((p) => {
                  const isSelected = selectedPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`
                        relative group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300
                        ${isSelected 
                          ? 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-2 ring-slate-900 transform -translate-y-1' 
                          : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center text-white shadow-sm mb-3 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                        <p.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{p.name}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 2: Tool Selection */}
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">2</span>
                Choose Tool
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tabs.map((tab) => {
                   const isActive = activeTab === tab.id;
                   return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        text-left p-4 rounded-xl border transition-all duration-200
                        ${isActive 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      <tab.icon className={`w-6 h-6 mb-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <div className="font-bold text-sm">{tab.label}</div>
                      <div className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{tab.description}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 3: Input & Results */}
            <section className="grid lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-100">
              <div className="lg:col-span-5 space-y-6">
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">3</span>
                   Customize & Generate
                 </h2>
                 <Card className="shadow-xl shadow-slate-200/50 border-slate-200">
                  <div className="space-y-5">
                    <div>
                      <Label>What do you want to create?</Label>
                      <TextArea 
                        placeholder={activeTab === 'bio' ? "e.g., Fitness Coach for Moms..." : `e.g., Tips for ${selectedPlatform === 'twitter' ? 'a thread about' : 'a post about'} sustainable living...`}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="text-lg font-medium min-h-[140px] bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tone</Label>
                        <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                          <option value="friendly">Friendly 👋</option>
                          <option value="professional">Professional 💼</option>
                          <option value="witty">Witty/Funny 😂</option>
                          <option value="luxury">Luxury ✨</option>
                          <option value="urgent">Urgent 🔥</option>
                        </Select>
                      </div>
                      <div>
                        <Label>Language</Label>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="Hindi">Hindi</option>
                          <option value="German">German</option>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Extra Details</Label>
                      <Input 
                        placeholder="Keywords, specific offers..."
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading || !topic} 
                      variant="premium"
                      fullWidth
                      className="py-4 text-base mt-2"
                    >
                      {loading ? 'Thinking...' : (
                        <>
                          <Sparkles className="w-4 h-4" /> Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Results Area */}
              <div className="lg:col-span-7">
                 <div className="flex items-center justify-between mb-4">
                   <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Results</h2>
                   {result && <Button variant="ghost" onClick={() => setResult(null)} className="text-xs h-8">Clear</Button>}
                 </div>

                 {error && (
                   <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500"></div>
                     {error}
                   </div>
                 )}

                 {!result && !loading && !error && (
                   <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-slate-400 bg-slate-50/50">
                     <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 border border-slate-100">
                       <Layout className="w-8 h-8 text-slate-300" />
                     </div>
                     <p className="font-medium text-slate-500">Ready to create magic?</p>
                     <p className="text-sm mt-1">Select a platform and tool to get started.</p>
                   </div>
                 )}

                 {loading && (
                   <div className="space-y-4 p-4 animate-pulse">
                      <div className="h-40 bg-white rounded-xl shadow-sm"></div>
                      <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                      <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                   </div>
                 )}

                 {result && (
                   <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                     <ResultsRenderer data={result} />
                   </div>
                 )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;