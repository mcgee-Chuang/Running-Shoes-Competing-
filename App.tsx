
import React, { useState } from 'react';
import { fetchShoeComparison, generateInfographic } from './services/geminiService';
import { Shoe, ComparisonResponse } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [infographic, setInfographic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setInfographic(null);

    try {
      const result = await fetchShoeComparison();
      setData(result);
      
      const imageUrl = await generateInfographic(result.shoes);
      setInfographic(imageUrl);
    } catch (err) {
      setError("無法取得資料，請檢查網路連線或稍後再試。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <header className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Elite Runner's Hub
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          掌握頂級性能：即時比較 Adidas Adios Pro 4, Nike Alphafly 3 與 ASICS Metaspeed Paris。
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-slate-300">連結限定 momo 購物網</span>
        </div>
        
        <br />
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`mt-8 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            loading 
            ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              正在搜尋最新產品與畫圖中...
            </span>
          ) : "搜尋最新旗艦款 (含 Adios Pro 4)"}
        </button>
      </header>

      {error && (
        <div className="max-w-xl mx-auto bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl text-center mb-10 shadow-lg">
          {error}
        </div>
      )}

      {data && (
        <main className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {/* Shoe Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.shoes.map((shoe, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 group shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    shoe.brand.toLowerCase().includes('nike') ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                    shoe.brand.toLowerCase().includes('adidas') ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {shoe.brand}
                  </span>
                  <span className="text-2xl font-black text-white">{shoe.price}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-blue-400 transition-colors min-h-[4rem]">{shoe.model}</h3>
                
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-500">單隻重量</span> 
                    <span className="font-mono font-bold text-slate-200">{shoe.weight}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-500">足尖差 (Drop)</span> 
                    <span className="font-mono font-bold text-slate-200">{shoe.drop}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">性能亮點</p>
                  <div className="flex flex-wrap gap-2">
                    {shoe.features.map((f, i) => (
                      <span key={i} className="text-xs bg-slate-950 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <a 
                  href={shoe.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-pink-600 text-white hover:bg-pink-500 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-pink-900/20"
                >
                  前往 momo 賣場
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            ))}
          </section>

          {/* Infographic Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                    <span className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></span>
                    AI 性能對比數據圖
                  </h2>
                  <p className="text-slate-500 text-sm">視覺化呈現各鞋款在回彈、緩震與穩定性的差異</p>
                </div>
                {infographic && (
                  <button 
                    onClick={() => window.open(infographic, '_blank')}
                    className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    在新分頁查看對比大圖
                  </button>
                )}
              </div>
              
              {infographic ? (
                <div className="relative group rounded-2xl overflow-hidden border border-slate-800">
                  <img 
                    src={infographic} 
                    alt="Running shoe performance comparison" 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none"></div>
                </div>
              ) : (
                <div className="aspect-video w-full flex flex-col items-center justify-center bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-400 font-medium">AI 正在繪製高精度性能差異圖...</p>
                </div>
              )}
            </div>
          </section>

          {/* Analysis Summary */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 md:p-10">
              <div className="flex items-center gap-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-400">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52a.75.75 0 0 1 .648.743V15a.75.75 0 0 1-.648.743 49.148 49.148 0 0 1-7.152.52c-2.43 0-4.817-.178-7.152-.52a.75.75 0 0 1-.648-.743V3.514a.75.75 0 0 1 .648-.743ZM15 7.5a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75Zm0 4.5a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75Z" clipRule="evenodd" />
                </svg>
                <h4 className="text-indigo-400 font-black uppercase tracking-widest text-sm">專業性能分析總結</h4>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg italic font-medium">
                {data.summary}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h4 className="text-slate-500 font-black mb-6 uppercase tracking-widest text-xs">數據與 momo 連結來源</h4>
              <div className="space-y-4">
                {data.searchUrls.length > 0 ? data.searchUrls.slice(0, 5).map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-blue-500 hover:text-blue-400 group">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center text-[10px] font-bold">0{i+1}</span>
                    <span className="truncate group-hover:underline">{new URL(url).hostname}</span>
                  </a>
                )) : (
                  <p className="text-slate-600 text-xs italic">即時抓取中...</p>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      <footer className="max-w-6xl mx-auto text-center mt-32 pb-16">
        <div className="w-20 h-1 bg-slate-800 mx-auto mb-8 rounded-full"></div>
        <p className="text-slate-500 text-sm font-medium">
          © 2025 Elite Runner's Hub
        </p>
        <p className="text-slate-700 text-xs mt-2">
          產品連結皆由 AI 搜尋 momo 購物網提供，價格以賣場標示為準。
        </p>
      </footer>
    </div>
  );
};

export default App;
