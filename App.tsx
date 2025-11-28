import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ImageData, AppState, GenerationResult } from './types';
import { generateEmbraceImage } from './services/geminiService';
import ImageUploadCard from './components/ImageUploadCard';

const App: React.FC = () => {
  const [youngImage, setYoungImage] = useState<ImageData | null>(null);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!youngImage || !currentImage) {
      setErrorMsg("الرجاء رفع الصورتين للمتابعة");
      return;
    }

    setAppState(AppState.GENERATING);
    setErrorMsg(null);
    setResult(null);

    try {
      const genResult = await generateEmbraceImage(youngImage, currentImage);
      setResult(genResult);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء المعالجة. يرجى التأكد من المفتاح ومحاولة مرة أخرى.");
    }
  };

  const resetApp = () => {
    setYoungImage(null);
    setCurrentImage(null);
    setResult(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );

  const RetryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  return (
    <div className="min-h-screen font-sans text-gray-800 pb-20">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
              احضن نفسك
            </h1>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">اصنع لحظة خالدة مع طفلك الداخلي</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
             عناق يتجاوز <span className="text-indigo-600">الزمن</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            قم برفع صورة لك من الطفولة وصورة حديثة، وسيقوم الذكاء الاصطناعي بجمعكما في عناق دافئ ومحترف.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <ImageUploadCard
            title="صورتك وأنت صغير"
            description="ارفع صورة واضحة من طفولتك"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            image={youngImage}
            onImageSelect={setYoungImage}
            onRemove={() => setYoungImage(null)}
            disabled={appState === AppState.GENERATING}
          />
          
          <ImageUploadCard
            title="صورتك الحالية"
            description="ارفع صورة حديثة وواضحة لك"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            image={currentImage}
            onImageSelect={setCurrentImage}
            onRemove={() => setCurrentImage(null)}
            disabled={appState === AppState.GENERATING}
          />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-16">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-4 max-w-lg w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMsg}
            </div>
          )}

          {appState === AppState.IDLE || appState === AppState.ERROR ? (
             <button
              onClick={handleGenerate}
              disabled={!youngImage || !currentImage}
              className={`
                px-8 py-4 rounded-full text-xl font-bold text-white shadow-xl transition-all transform
                ${(!youngImage || !currentImage) 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-2xl hover:from-purple-700 hover:to-indigo-700'}
              `}
            >
              اصنع الذكرى الآن ✨
            </button>
          ) : null}

          {appState === AppState.GENERATING && (
            <div className="flex flex-col items-center animate-pulse">
               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p className="text-lg font-medium text-indigo-700">جاري معالجة الذكريات...</p>
               <p className="text-sm text-gray-500">قد يستغرق هذا بضع ثوانٍ</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {appState === AppState.SUCCESS && result && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
            <div className="p-8 md:p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">النتيجة النهائية</h3>
              
              <div className="relative max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg border-8 border-white bg-gray-100">
                {result.imageUrl ? (
                  <img src={result.imageUrl} alt="Generated Hug" className="w-full h-auto" />
                ) : (
                  <div className="p-10 text-gray-500">لم يتم توليد صورة، ولكن تم استلام نص.</div>
                )}
              </div>

              {result.text && (
                <div className="mt-8 p-6 bg-purple-50 rounded-xl max-w-2xl mx-auto text-right">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{result.text}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                {result.imageUrl && (
                  <a 
                    href={result.imageUrl} 
                    download="embrace-yourself-memory.png"
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-medium"
                  >
                     <span>تحميل الصورة</span>
                     <DownloadIcon />
                  </a>
                )}
                
                <button 
                  onClick={resetApp}
                  className="flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
                >
                  <span>تجربة جديدة</span>
                  <RetryIcon />
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 py-4 text-center z-10">
        <p className="text-sm text-gray-500">
          تم التطوير باستخدام Google Gemini Nano Banana
        </p>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
