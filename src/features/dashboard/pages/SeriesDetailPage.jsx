import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useItemsData } from '../hooks';
import { seriesService } from '../../../shared/api/seriesService';
import iconVideo from '../../../assets/icons/icon_video.svg';
import iconCharacter from '../../../assets/icons/icon_character.svg';

const SeriesDetailPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { itemsData, isLoading, error } = useItemsData();
  const [isCharacterSectionCollapsed, setIsCharacterSectionCollapsed] = useState(false);
  const [isSeriesDetailCollapsed, setIsSeriesDetailCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const seriesDetailRef = useRef(null);
  const characterSectionRef = useRef(null);
  const feedbackTextareaRef = useRef(null);

  const findSeries = () => {
    console.log('🔍 SeriesDetailPage - Finding series:', { seriesId, itemsData });
    
    if (!itemsData) {
      console.log('❌ No itemsData available');
      return null;
    }
    
    const categories = ['pending', 'working', 'approved'];
    for (const category of categories) {
      const items = itemsData[category]?.series || [];
      console.log(`🔍 Checking ${category} category:`, items);
      
      const found = items.find(item => item.id === parseInt(seriesId));
      if (found) {
        console.log('✅ Series found in', category, ':', found);
        return found;
      }
    }
    
    console.log('❌ Series not found in any category');
    return null;
  };

  const series = findSeries();

  const getSeriesCharacters = () => {
    if (!series || !series.draftData || !series.draftData.characters) return [];
    return series.draftData.characters.map((character, index) => ({
      id: `${series.id}_char_${index}`,
      title: character.display_name || character.name || '이름 없음',
      description: character.role || '역할 없음',
      status: series.status || 'pending',
      ...character
    }));
  };

  const characters = getSeriesCharacters();


  // 승인 처리 함수
  const handleApprove = useCallback(async () => {
    if (!series?.id) {
      alert('시리즈 정보를 찾을 수 없습니다.');
      return;
    }

    if (!confirm('이 시리즈를 승인하시겠습니까?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🔄 Approving draft with ID:', series.id);
      await seriesService.approveDraft(series.id);
      alert('시리즈가 성공적으로 승인되었습니다!');
      navigate('/dashboard'); // 대시보드로 이동
    } catch (error) {
      console.error('❌ Approval failed:', error);
      alert(`승인 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [series?.id, navigate]);

  // 피드백 처리 함수
  const handleFeedback = useCallback(async () => {
    if (!series?.id) {
      alert('시리즈 정보를 찾을 수 없습니다.');
      return;
    }

    // 피드백 버튼을 누를 때 텍스트 값을 가져옴
    const feedbackText = feedbackTextareaRef.current?.value || '';
    
    if (!feedbackText.trim()) {
      alert('피드백 내용을 입력해주세요.');
      feedbackTextareaRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🔄 Sending feedback for draft ID:', series.id, 'Feedback:', feedbackText);
      await seriesService.feedbackDraft(series.id, feedbackText.trim());
      alert('피드백이 성공적으로 전송되었습니다!');
      
      // 텍스트박스 비우기
      if (feedbackTextareaRef.current) {
        feedbackTextareaRef.current.value = '';
      }
    } catch (error) {
      console.error('❌ Feedback failed:', error);
      alert(`피드백 전송 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [series?.id]);

  // 섹션 토글 함수들 (리렌더링 최소화)
  const toggleSeriesDetail = useCallback(() => {
    setIsSeriesDetailCollapsed(prev => !prev);
  }, []);

  const toggleCharacterSection = useCallback(() => {
    setIsCharacterSectionCollapsed(prev => !prev);
  }, []);

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    working: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const statusText = {
    pending: '승인 대기',
    approved: '승인 완료',
    working: '작업 중',
  };

  const DetailWrapper = ({ children }) => (
    <div className="min-h-screen bg-transparent p-2 sm:p-5">
      <div className="relative isolate bg-white/20 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-2xl max-w-7xl mx-auto p-4 sm:p-8 transition-all duration-300 hover:border-purple-300/60 hover:bg-white/30 hover:shadow-purple-200/50">
        {children}
      </div>
    </div>
  );

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <DetailWrapper>
        <button className="mb-5 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" onClick={() => navigate('/dashboard')}>
          ← 대시보드로 돌아가기
        </button>
        <div className="text-center p-10 bg-white/20 rounded-lg">
          <div className="animate-pulse">
            <div className="text-xl mb-4">📊 시리즈 데이터를 불러오는 중...</div>
            <div className="text-sm text-gray-600">잠시만 기다려주세요</div>
          </div>
        </div>
      </DetailWrapper>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <DetailWrapper>
        <button className="mb-5 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" onClick={() => navigate('/dashboard')}>
          ← 대시보드로 돌아가기
        </button>
        <div className="text-center p-10 bg-red-500/20 border border-red-500/50 rounded-lg">
          <div className="text-red-300 text-xl mb-4">⚠️ 데이터 로딩 실패</div>
          <div className="text-red-200 text-sm mb-4">
            {error.message || '알 수 없는 오류가 발생했습니다'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            다시 시도
          </button>
        </div>
      </DetailWrapper>
    );
  }

  if (!series) {
    return (
      <DetailWrapper>
        <button className="mb-5 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" onClick={() => navigate('/dashboard')}>
          ← 대시보드로 돌아가기
        </button>
        <div className="text-center p-10 bg-white/20 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800">시리즈를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mt-2">요청하신 시리즈가 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </DetailWrapper>
    );
  }

  return (
    <DetailWrapper>
      <header className="mb-8 pb-6 border-b-2 border-white/30">
        <button className="mb-5 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" onClick={() => navigate('/dashboard')}>
          ← 대시보드로 돌아가기
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={iconVideo} alt="시리즈" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">시리즈</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">{series.title}</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">{series.description || '시리즈 설명이 없습니다.'}</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-500">상태</span>
              <span className={`mt-1 block text-sm font-semibold px-3 py-1 rounded-full ${statusStyles[series.status] || statusStyles.working}`}>
                {statusText[series.status] || statusText.working}
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-500">생성일</span>
              <span className="mt-1 block text-base font-semibold text-gray-700">
                {series.createdAt ? new Date(series.createdAt).toLocaleDateString('ko-KR') : '정보 없음'}
              </span>
            </div>
            {series.feedbackCount > 0 && (
              <div className="text-center">
                <span className="text-sm font-medium text-gray-500">피드백</span>
                <span className="mt-1 block text-base font-semibold text-gray-700">💬 {series.feedbackCount}개</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 
            className="flex items-center justify-between text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30 cursor-pointer hover:text-purple-600 transition-colors duration-300"
            onClick={toggleSeriesDetail}
          >
            <div className="flex items-center gap-2">
              <img src={iconVideo} alt="시리즈" className="w-6 h-6" /> 
              시리즈 상세 정보
            </div>
            <span className="text-gray-600 transition-transform duration-300 transform-gpu text-lg" style={{ transform: isSeriesDetailCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </h2>
          
          <div 
            className="transition-all duration-500 overflow-hidden"
            style={{ 
              maxHeight: isSeriesDetailCollapsed ? '0px' : 'none',
              opacity: isSeriesDetailCollapsed ? 0 : 1
            }}
          >
            <div ref={seriesDetailRef} className="space-y-6">
              {series.draftData?.series && <JsonViewer title="시리즈 상세 정보" data={series.draftData.series} />}
              {series.draftData?.metadata && <JsonViewer title="메타데이터" data={series.draftData.metadata} />}
            </div>
          </div>
        </section>

        <section>
          <h2 
            className="flex items-center justify-between text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30 cursor-pointer hover:text-purple-600 transition-colors duration-300"
            onClick={toggleCharacterSection}
          >
            <div className="flex items-center gap-2">
              <img src={iconCharacter} alt="캐릭터" className="w-6 h-6" /> 
              시리즈 캐릭터들 ({characters.length})
            </div>
            <span className="text-gray-600 transition-transform duration-300 transform-gpu text-lg" style={{ transform: isCharacterSectionCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </h2>
          
          <div 
            className="transition-all duration-500 overflow-hidden"
            style={{ 
              maxHeight: isCharacterSectionCollapsed ? '0px' : 'none',
              opacity: isCharacterSectionCollapsed ? 0 : 1
            }}
          >
            <div ref={characterSectionRef}>
              {characters.length > 0 ? (
                <div className="space-y-4">
                {characters.map((char) => <CharacterCard key={char.id} character={char} statusStyles={statusStyles} statusText={statusText} />)}
              </div>
                ) : (
                  <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <img src={iconCharacter} alt="캐릭터" className="w-12 h-12 opacity-50 mx-auto mb-2" />
                    <p className="text-gray-600">아직 등록된 캐릭터가 없습니다.</p>
                    <p className="text-sm text-gray-500 mt-1">시리즈에 캐릭터를 추가해보세요.</p>
                  </div>
                )}
              </div>
            </div>
        </section>
      </main>

      {/* 승인 버튼 영역 */}
      {series?.status === 'pending' && (
        <div className="mt-8 pt-6 border-t-2 border-white/30">
          <div className="flex justify-center">
            <button 
              className={`px-12 py-4 bg-green-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 min-w-[160px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
              onClick={handleApprove}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  처리 중...
                </>
              ) : (
                <>
                  ✓ 승인하기
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 피드백 댓글 영역 */}
      {series?.status === 'pending' && (
        <div className="mt-8 pt-6 border-t-2 border-white/30">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            💬 피드백 작성
          </h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  👤
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  ref={feedbackTextareaRef}
                  placeholder="시리즈에 대한 피드백이나 개선사항을 입력해주세요..."
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg text-base leading-relaxed resize-none mb-4 font-sans transition-colors duration-300 focus:outline-none focus:border-purple-500 focus:shadow-md"
                  disabled={isSubmitting}
                />
                <div className="flex justify-end">
                  <button 
                    className={`px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-purple-600 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleFeedback} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        전송 중...
                      </>
                    ) : (
                      '피드백 전송'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </DetailWrapper>
  );
};

const JsonViewer = ({ title, data }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-inner-sm">
      <ReactJson
        src={data}
        theme="rjv-default"
        collapsed={false}
        collapseStringsAfterLength={100}
        enableClipboard={true}
        displayDataTypes={false}
        displayObjectSize={false}
        quotesOnKeys={false}
        style={{ fontSize: '14px', backgroundColor: 'transparent', fontFamily: 'monospace' }}
      />
    </div>
  </div>
);

const CharacterCard = React.memo(({ character, statusStyles, statusText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div 
      className="relative isolate bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:border-purple-300/50 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer select-none"
      onClick={toggleExpanded}
      title="클릭하여 캐릭터 상세 정보 보기"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-lg font-bold text-white border-2 border-white/30 shadow-md">
          {character.title ? character.title.charAt(0) : '?'}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800 text-lg">{character.title}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[character.status] || statusStyles.working}`}>
                {statusText[character.status] || statusText.working}
              </span>
              <span className="text-gray-600 transition-transform duration-300 transform-gpu" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{character.description || '캐릭터 설명이 없습니다.'}</p>
          
          {/* 접이식 상세 정보 */}
          <div 
            className="transition-all duration-300 overflow-hidden"
            style={{ 
              maxHeight: isExpanded ? 'none' : '0px',
              opacity: isExpanded ? 1 : 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={contentRef} className="mt-4 space-y-4">
              {/* 기본 캐릭터 정보 */}
              <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-inner-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">기본 정보</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {character.display_name && (
                    <div>
                      <span className="font-medium text-gray-600">표시명:</span>
                      <span className="ml-2 text-gray-800">{character.display_name}</span>
                    </div>
                  )}
                  {character.name && character.name !== character.display_name && (
                    <div>
                      <span className="font-medium text-gray-600">이름:</span>
                      <span className="ml-2 text-gray-800">{character.name}</span>
                    </div>
                  )}
                  {character.role && (
                    <div>
                      <span className="font-medium text-gray-600">역할:</span>
                      <span className="ml-2 text-gray-800">{character.role}</span>
                    </div>
                  )}
                  {character.age && (
                    <div>
                      <span className="font-medium text-gray-600">나이:</span>
                      <span className="ml-2 text-gray-800">{character.age}</span>
                    </div>
                  )}
                  {character.gender && (
                    <div>
                      <span className="font-medium text-gray-600">성별:</span>
                      <span className="ml-2 text-gray-800">{character.gender}</span>
                    </div>
                  )}
                  {character.personality && (
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-600">성격:</span>
                      <span className="ml-2 text-gray-800">{character.personality}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 데이터 (JSON) */}
              {character.characterData && (
                <JsonViewer title="원본 캐릭터 데이터" data={character.characterData} />
              )}
              
              {/* 원본 캐릭터 객체 전체 (디버깅용) */}
              {Object.keys(character).length > 7 && (
                <JsonViewer title="전체 캐릭터 정보" data={character} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SeriesDetailPage;
