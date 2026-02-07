import React, { useState, useEffect, useRef } from 'react';
import { Settings, Type, BookOpen, Edit3, ChevronLeft, ChevronRight, Moon, Sun, X, ArrowRight, ArrowLeft } from 'lucide-react';

const DEFAULT_TEXT = `**当前来讲，与所有合成代谢/雄激素类固醇的合成代谢作用的主要模式被理解为直接激活细胞雄激素受体并增加蛋白质合成。**

**Pinyin:** Dāngqián lái jiǎng, yǔ suǒyǒu héchéng dàixiè/xióngjīsù lèigùchún de héchéng dàixiè zuòyòng de zhǔyào móshì bèi lǐjiě wéi zhíjiē jīhuó xìbāo xióngjīsù shòutǐ bìng zēngjiā dànbáizhì héchéng.

**Translation:** Currently speaking, the primary mode of the anabolic action associated with all anabolic/androgenic steroids is understood as the direct activation of cellular androgen receptors and the increase of protein synthesis.

**Grammar Explanation:**

* **当前来讲 (Dāngqián lái jiǎng):** A common introductory phrase meaning "currently" or "as of now."
* **被理解为 (bèi lǐjiě wéi):** A passive structure () meaning "A is understood/interpreted as."
* **并 (bìng):** A conjunction used to connect two verbs or verb phrases (activation and increase) to show they happen concurrently or in sequence.

**Core Vocabulary:**

* 合成代谢 (héchéng dàixiè): Anabolic
* 雄激素 (xióngjīsù): Androgen / Androgenic
* 类固醇 (lèigùchún): Steroid
* 模式 (móshì): Mode / Pattern
* 受体 (shòutǐ): Receptor
* 蛋白质合成 (dànbáizhì héchéng): Protein synthesis

---

**如下所述，如果能够通过补充睾酮或类似的合成代谢类固醇从外部来源提高雄激素水平，则可以大大提高肌肉中蛋白质的保留率。**

**Pinyin:** Rúxià suǒshù, rúguǒ nénggòu tōngguò bǔchōng gǎotóng huò lèisì de héchéng dàixiè lèigùchún cóng wàibù láiyuán tígāo xióngjīsù shuǐpíng, zé kěyǐ dàdà tígāo jīròu zhōng dànbáizhì de bǎoliúlǜ.

**Translation:** As described below, if androgen levels can be raised from external sources by supplementing with testosterone or similar anabolic steroids, then the retention rate of protein in the muscles can be greatly improved.

**Grammar Explanation:**

* **如下所述 (rúxià suǒshù):** A formal transition phrase meaning "as stated below" or "as follows."
* **如果...则... (rúguǒ... zé...):** A standard conditional structure equivalent to "If... then...".
* **通过 (tōngguò):** A preposition used here to indicate the method of supplementation.

**Core Vocabulary:**

* 睾酮 (gǎotóng): Testosterone
* 外部来源 (wàibù láiyuán): External source
* 提高 (tígāo): To raise / To improve
* 肌肉 (jīròu): Muscle
* 保留率 (bǎoliúlǜ): Retention rate

---

**这显然是所有合成代谢/雄激素类固醇促进肌肉生长的主要原因。随着我们激素水平的增加，雄激素受体的活化也会增加，最终蛋白质的合成速度也会增加。**

**Pinyin:** Zhè xiǎnrán shì suǒyǒu héchéng dàixiè/xióngjīsù lèigùchún cùjìn jīròu shēngzhǎng de zhǔyào yuányīn. Suízhe wǒmen jīsù shuǐpíng de zēngjiā, xióngjīsù shòutǐ de huóhuà yě huì zēngjiā, zuìzhōng dànbáizhì de héchéng sùdù yě huì zēngjiā.

**Translation:** This is clearly the primary reason why all anabolic/androgenic steroids promote muscle growth. As our hormone levels increase, the activation of androgen receptors also increases, and ultimately, the rate of protein synthesis increases as well.

**Grammar Explanation:**

* **显然是 (xiǎnrán shì):** Meaning "is clearly" or "is obviously," used to state a logical conclusion.
* **随着 (suízhe):** A preposition used to indicate that one change happens in conjunction with another ("along with" or "as...").
* **也 (yě):** Used here to show a parallel relationship between the increase in receptors and the increase in synthesis.

**Core Vocabulary:**

* 显然 (xiǎnrán): Clearly / Obviously
* 促进 (cùjìn): To promote / To accelerate
* 生长 (shēngzhǎng): Growth
* 活化 (huóhuà): Activation
* 最终 (zuìzhōng): Ultimately / Finally`;

// --- Parser Logic ---

const parseContent = (text) => {
  const blocks = text.split('---').map(b => b.trim()).filter(b => b.length > 0);
  
  return blocks.map((block) => {
    const lines = block.split('\n');
    let hanzi = "";
    let pinyin = "";
    let translation = "";
    let extras = [];
    
    let isCapturingExtras = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Identify Hanzi (Usually the first bold line without a label)
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':') && !hanzi) {
        hanzi = trimmed.replace(/\*\*/g, '');
        return;
      }

      // Identify Pinyin
      if (trimmed.toLowerCase().includes('**pinyin:**')) {
        pinyin = trimmed.replace(/\*\*pinyin:\*\*/i, '').trim();
        return;
      }

      // Identify Translation
      if (trimmed.toLowerCase().includes('**translation:**')) {
        translation = trimmed.replace(/\*\*translation:\*\*/i, '').trim();
        return;
      }

      // Start capturing extras (Grammar, Vocab, etc.)
      if (trimmed.toLowerCase().includes('grammar') || trimmed.toLowerCase().includes('vocabulary')) {
        isCapturingExtras = true;
      }

      if (isCapturingExtras || (!hanzi && !pinyin && !translation)) {
        // Basic Markdown formatting removal for cleaner display, or keep it 
        // We will keep bold markers for the renderer to handle
        extras.push(trimmed);
      }
    });

    return { hanzi, pinyin, translation, extras };
  });
};

// --- Components ---

const ProgressBar = ({ current, total }) => {
  const progress = Math.min(((current + 1) / total) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6 transition-colors duration-300">
      <div 
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange, icon: Icon, label }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 
      ${checked ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'hover:bg-gray-100 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'}`}
  >
    {Icon && <Icon size={18} />}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const App = () => {
  const [mode, setMode] = useState('view'); // 'input' | 'view'
  const [text, setText] = useState(DEFAULT_TEXT);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Settings State
  const [hanziSize, setHanziSize] = useState(48); // px
  const [latinSize, setLatinSize] = useState(16); // px
  const [fontStyle, setFontStyle] = useState('sans'); // 'serif' | 'sans'

  // Refs for focus management
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Parse text on init and update
  useEffect(() => {
    const parsed = parseContent(text);
    setCards(parsed);
    // Reset index if out of bounds
    if (currentIndex >= parsed.length && parsed.length > 0) {
      setCurrentIndex(0);
    }
  }, [text]);

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode === 'input') return;

      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(prev + 1, cards.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, cards.length]);

  const currentCard = cards[currentIndex] || {};

  // Font Styles
  const hanziFamily = fontStyle === 'serif' ? '"Noto Serif SC", serif' : '"Noto Sans SC", sans-serif';
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans flex flex-col`}>
      {/* Google Fonts Injection */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');
          
          .hanzi-text {
            font-family: ${hanziFamily};
            line-height: 1.4;
          }
          
          /* Custom scrollbar for dark mode compatibility */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent; 
          }
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 4px;
          }
          .dark ::-webkit-scrollbar-thumb {
            background: #475569; 
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
          }
        `}
      </style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg shadow-blue-600/20">
            文
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Hanzi Study</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Markdown Visualizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {/* Mode Toggle */}
           <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mr-2">
            <button
              onClick={() => setMode('view')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'view' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen size={16} />
              Study
            </button>
            <button
              onClick={() => setMode('input')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'input' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Edit3 size={16} />
              Input
            </button>
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' : 'hover:bg-gray-100 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'}`}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Type size={16} /> Hanzi Size ({hanziSize}px)
            </label>
            <input 
              type="range" 
              min="24" 
              max="128" 
              value={hanziSize} 
              onChange={(e) => setHanziSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Type size={16} /> Latin Size ({latinSize}px)
            </label>
            <input 
              type="range" 
              min="12" 
              max="32" 
              value={latinSize} 
              onChange={(e) => setLatinSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Font Style</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setFontStyle('sans')}
                className={`flex-1 py-2 px-3 rounded-md text-sm border font-noto-sans-sc ${fontStyle === 'sans' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                Sans (黑体)
              </button>
              <button 
                onClick={() => setFontStyle('serif')}
                className={`flex-1 py-2 px-3 rounded-md text-sm border font-noto-serif-sc ${fontStyle === 'serif' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
              >
                Serif (宋体)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col">
        
        {mode === 'input' ? (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Paste your Markdown text below. Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">---</code> to separate distinct cards.
            </div>
            <textarea
              ref={editorRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 w-full p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-mono text-sm leading-relaxed shadow-sm transition-all text-gray-800 dark:text-gray-200"
              placeholder="# Paste your markdown here..."
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full animate-in fade-in duration-300" ref={containerRef}>
            
            {/* Progress */}
            <div className="flex items-end justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Progress</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                 {cards.length > 0 ? currentIndex + 1 : 0} <span className="text-gray-400 font-normal">/ {cards.length}</span>
              </span>
            </div>
            <ProgressBar current={currentIndex} total={cards.length} />

            {/* Card View */}
            {cards.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col relative transition-colors duration-300">
                
                {/* Decorative Pattern Top */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80" />

                <div className="p-8 md:p-12 space-y-8">
                  {/* Hanzi Section - Primary Focus */}
                  <div className="text-center space-y-4">
                    <p 
                      className="hanzi-text text-gray-900 dark:text-white transition-all duration-200 break-words"
                      style={{ fontSize: `${hanziSize}px` }}
                    >
                      {currentCard.hanzi || "No Text Found"}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px bg-gray-200 dark:bg-gray-700 w-12 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <div className="h-px bg-gray-200 dark:bg-gray-700 w-12 rounded-full" />
                  </div>

                  {/* Pinyin & Translation */}
                  <div className="space-y-6">
                    {currentCard.pinyin && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Pinyin</span>
                        <p 
                          className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed"
                          style={{ fontSize: `${latinSize + 2}px` }}
                        >
                          {currentCard.pinyin}
                        </p>
                      </div>
                    )}

                    {currentCard.translation && (
                      <div className="space-y-1">
                         <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Translation</span>
                        <p 
                          className="text-gray-600 dark:text-gray-300 italic leading-relaxed"
                          style={{ fontSize: `${latinSize}px` }}
                        >
                          {currentCard.translation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Extras (Grammar/Vocab) */}
                  {currentCard.extras && currentCard.extras.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <div 
                        className="text-gray-600 dark:text-gray-400 space-y-2"
                        style={{ fontSize: `${latinSize - 2}px` }}
                      >
                         {/* Simple Parser for the extras content to highlight headers */}
                         {currentCard.extras.map((line, idx) => {
                           const isHeader = line.startsWith('**') && line.endsWith('**') && !line.includes(':');
                           const isSubHeader = line.includes('Grammar') || line.includes('Vocabulary');
                           
                           if (isSubHeader) {
                             // Render section headers nicely
                             return (
                               <h4 key={idx} className="font-bold text-gray-900 dark:text-gray-100 mt-6 first:mt-0 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                 {line.replace(/\*\*/g, '').replace(':', '')}
                               </h4>
                             );
                           }

                           // Render list items
                           return (
                             <div key={idx} className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 py-1">
                               <span dangerouslySetInnerHTML={{ 
                                 __html: line
                                   .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800 dark:text-gray-200 font-semibold">$1</strong>')
                                   .replace(/^\*\s/, '') // remove list bullet from markdown
                               }} />
                             </div>
                           );
                         })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer / Navigation Hint */}
                <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 px-6 py-3 flex justify-between items-center text-xs text-gray-400">
                   <span>Card {currentIndex + 1} of {cards.length}</span>
                   <span className="hidden md:inline-flex items-center gap-2">
                     Use <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 font-mono text-[10px]">←</kbd> <kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 font-mono text-[10px]">→</kbd> to navigate
                   </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12 text-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
                <div className="max-w-xs">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No cards found. Switch to input mode and paste your text.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons (Mobile/Touch Friendly) */}
            <div className="flex justify-between items-center mt-8 px-2 gap-4">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg shadow-gray-200/50 dark:shadow-black/20 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Previous</span>
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.min(prev + 1, cards.length - 1))}
                disabled={currentIndex === cards.length - 1}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none disabled:text-gray-500 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <span className="font-medium">Next</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
