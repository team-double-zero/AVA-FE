import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useItemsData } from '../hooks';
import iconVideo from '../../../assets/icons/icon_video.svg';
import iconCharacter from '../../../assets/icons/icon_character.svg';

const SeriesDetailPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { itemsData, isLoading, error } = useItemsData();

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
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30">
            <img src={iconVideo} alt="시리즈" className="w-6 h-6" /> 시리즈 상세 정보
          </h2>
          <div className="space-y-6">
            {series.draftData?.series && <JsonViewer title="시리즈 상세 정보" data={series.draftData.series} />}
            {series.draftData?.metadata && <JsonViewer title="메타데이터" data={series.draftData.metadata} />}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-white/30">
            <img src={iconCharacter} alt="캐릭터" className="w-6 h-6" /> 시리즈 캐릭터들 ({characters.length})
          </h2>
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
        </section>
      </main>
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

const CharacterCard = ({ character, statusStyles, statusText }) => (
  <div className="relative isolate bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:border-purple-300/50 hover:-translate-y-0.5 hover:shadow-xl">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-lg font-bold text-white border-2 border-white/30 shadow-md">
        {character.title ? character.title.charAt(0) : '?'}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-800 text-lg">{character.title}</h4>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[character.status] || statusStyles.working}`}>
            {statusText[character.status] || statusText.working}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{character.description || '캐릭터 설명이 없습니다.'}</p>
        {character.characterData && <JsonViewer title="캐릭터 상세" data={character.characterData} />}
      </div>
    </div>
  </div>
);

export default SeriesDetailPage;
