import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const CharacterDetail = ({ item, onBack, onApprove, onFeedback }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      onFeedback(item, feedbackText);
      setFeedbackText('');
      setShowFeedback(false);
    }
  };

  const toggleFeedbackExpansion = (index) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const DetailWrapper = ({ children }) => (
    <div className="min-h-screen bg-transparent p-2 sm:p-5">
      <div className="relative isolate bg-white/20 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-2xl max-w-7xl mx-auto p-4 sm:p-8 transition-all duration-300 hover:border-purple-300/60 hover:bg-white/30 hover:shadow-purple-200/50">
        {children}
      </div>
    </div>
  );

  return (
    <DetailWrapper>
      <header className="mb-8 pb-6 border-b-2 border-white/30">
        <button className="mb-5 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" onClick={onBack}>
          ← 뒤로 가기
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">{item.title}</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">{item.description}</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-500">타입</span>
              <span className="mt-1 block text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">👤 캐릭터</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-500">생성일</span>
              <span className="mt-1 block text-base font-semibold text-gray-700">{item.createdAt}</span>
            </div>
            {item.feedbackCount > 0 && (
              <div className="text-center">
                <span className="text-sm font-medium text-gray-500">피드백</span>
                <span className="mt-1 block text-base font-semibold text-gray-700">💬 {item.feedbackCount}개</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30">캐릭터 이미지</h2>
          <div className="text-center mb-6">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="max-w-md w-full h-auto rounded-xl shadow-lg mx-auto"
              />
            ) : (
              <div className="max-w-md w-full h-72 bg-gray-100/95 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-600 text-lg mx-auto backdrop-blur-sm shadow-md transition-all duration-300 hover:bg-gray-200/95 hover:border-purple-300 hover:shadow-lg">
                <span>🎨</span>
                <p>캐릭터 이미지가 생성 중입니다</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30">캐릭터 설정</h2>
          <div className="relative isolate bg-gray-50/30 backdrop-blur-md rounded-xl p-6 border border-white/40 shadow-md leading-relaxed transition-all duration-300 hover:bg-gray-50/40 hover:border-purple-300/70 hover:shadow-lg">
            <ReactMarkdown>{item.content || '## 캐릭터 프로필\n\n캐릭터 설정이 여기에 표시됩니다.'}</ReactMarkdown>
          </div>
        </section>

        {item.feedbackHistory && item.feedbackHistory.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30">이전 피드백 내역</h2>
            <div className="mt-4 border border-gray-200 rounded-lg bg-white/30 backdrop-blur-md shadow-md">
              {item.feedbackHistory.map((feedback, index) => (
                <div key={index} className="p-5 border-b border-gray-200 last:border-b-0">
                  <div 
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => toggleFeedbackExpansion(index)}
                  >
                    <span className="text-sm text-gray-600">{feedback.date}</span>
                    <span className="text-gray-600 transition-transform duration-300 transform-gpu" style={{ transform: expandedFeedback[index] ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                  {expandedFeedback[index] && (
                    <div className="mt-3">
                      <div className="bg-gray-50/50 backdrop-blur-sm p-3 rounded-md mb-3 leading-relaxed shadow-sm border border-white/30">
                        <strong>피드백:</strong> {feedback.question}
                      </div>
                      <div className="bg-blue-50/50 backdrop-blur-sm p-3 rounded-md border-l-4 border-blue-500 shadow-sm border border-white/30">
                        <strong>답변:</strong> {feedback.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="flex gap-4 justify-center pt-6 border-t-2 border-white/30">
        <button 
          className="px-8 py-4 bg-green-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 min-w-[120px]"
          onClick={() => onApprove(item)}
        >
          ✓ 승인
        </button>
        <button 
          className="px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 min-w-[120px]"
          onClick={() => setShowFeedback(!showFeedback)}
        >
          💬 피드백
        </button>
      </footer>

      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative isolate bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-modalSlideUp before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1/2 before:rounded-t-2xl before:pointer-events-none before:bg-gradient-to-b before:from-white/15 before:to-white/5 after:content-[''] after:absolute after:inset-px after:rounded-[15px] after:pointer-events-none after:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)] after:opacity-80">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">피드백 작성</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="캐릭터 개선사항이나 수정 요청을 입력해주세요..."
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-base leading-relaxed resize-y mb-6 font-sans transition-colors duration-300 focus:outline-none focus:border-gray-700 focus:shadow-md"
            />
            <div className="flex gap-3 justify-end">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg border border-gray-200 transition-all duration-300 hover:bg-gray-200 min-w-[80px]" onClick={() => setShowFeedback(false)}>취소</button>
              <button className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-purple-600 min-w-[80px] disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>
                피드백 전송
              </button>
            </div>
          </div>
        </div>
      )}
    </DetailWrapper>
  );
};

export default CharacterDetail;