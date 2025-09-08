import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../../shared/ui';

/**
 * 시리즈 상세 페이지 컴포넌트
 */
const SeriesDetailPage = ({ itemsData }) => {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  // 모든 카테고리에서 시리즈 찾기
  const findSeries = () => {
    if (!itemsData) return null;
    
    const categories = ['pending', 'working', 'approved'];
    const types = ['series', 'character']; // 시리즈와 캐릭터 모두 시리즈로 통합
    
    for (const category of categories) {
      for (const type of types) {
        const items = itemsData[category]?.[type] || [];
        const found = items.find(item => item.id === parseInt(seriesId));
        if (found) return found;
      }
    }
    return null;
  };

  const series = findSeries();

  // 해당 시리즈의 캐릭터들 찾기 (기존 character 타입 아이템들)
  const getSeriesCharacters = () => {
    if (!itemsData || !series) return [];
    
    const categories = ['pending', 'working', 'approved'];
    let characters = [];
    
    categories.forEach(category => {
      const characterItems = itemsData[category]?.character || [];
      // 시리즈와 연관된 캐릭터들 필터링 (seriesId로 연결되어 있다고 가정)
      const relatedCharacters = characterItems.filter(char => 
        char.seriesId === series.id || char.series_id === series.id
      );
      characters = [...characters, ...relatedCharacters];
    });
    
    return characters;
  };

  const characters = getSeriesCharacters();

  if (!series) {
    return (
      <div className="series-detail-page p-8" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="mb-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          >
            ← 대시보드로 돌아가기
          </Button>
          <div className="p-8 text-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">시리즈를 찾을 수 없습니다</h2>
            <p className="text-white/70">요청하신 시리즈가 존재하지 않거나 삭제되었습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="series-detail-page p-8" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="mb-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          >
            ← 대시보드로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">{series.title}</h1>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              series.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-300/30' :
              series.status === 'approved' ? 'bg-green-500/20 text-green-200 border border-green-300/30' :
              'bg-blue-500/20 text-blue-200 border border-blue-300/30'
            }`}>
              {series.status === 'pending' ? '승인 대기' :
               series.status === 'approved' ? '승인 완료' : '작업 중'}
            </span>
            {series.feedbackCount > 0 && (
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30">
                💬 피드백 {series.feedbackCount}
              </span>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽: 시리즈 설명 */}
          <div className="flex-1">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">시리즈 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white/90 mb-2">설명</h3>
                  <p className="text-white/70 leading-relaxed">
                    {series.description || '시리즈 설명이 없습니다.'}
                  </p>
                </div>

                {series.genre && (
                  <div>
                    <h3 className="font-medium text-white/90 mb-2">장르</h3>
                    <p className="text-white/70">{series.genre}</p>
                  </div>
                )}

                {series.targetAudience && (
                  <div>
                    <h3 className="font-medium text-white/90 mb-2">타겟 관객</h3>
                    <p className="text-white/70">{series.targetAudience}</p>
                  </div>
                )}

                {series.setting && (
                  <div>
                    <h3 className="font-medium text-white/90 mb-2">배경 설정</h3>
                    <p className="text-white/70">{series.setting}</p>
                  </div>
                )}

                {series.theme && (
                  <div>
                    <h3 className="font-medium text-white/90 mb-2">주제</h3>
                    <p className="text-white/70">{series.theme}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-white/90 mb-2">생성일</h3>
                  <p className="text-white/70">
                    {series.createdAt ? new Date(series.createdAt).toLocaleDateString('ko-KR') : '정보 없음'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="hidden lg:flex items-stretch">
            <div className="w-0.5 bg-white/30 self-stretch"></div>
          </div>

          {/* 오른쪽: 캐릭터들 */}
          <div className="flex-1">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">
                시리즈 캐릭터들 ({characters.length})
              </h2>
              
              {characters.length > 0 ? (
                <div className="space-y-4">
                  {characters.map((character) => (
                    <div 
                      key={character.id} 
                      className="p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white">{character.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          character.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-300/30' :
                          character.status === 'approved' ? 'bg-green-500/20 text-green-200 border border-green-300/30' :
                          'bg-blue-500/20 text-blue-200 border border-blue-300/30'
                        }`}>
                          {character.status === 'pending' ? '대기' :
                           character.status === 'approved' ? '완료' : '작업중'}
                        </span>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-2">
                        {character.description || '캐릭터 설명이 없습니다.'}
                      </p>
                      
                      {character.role && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60">역할:</span>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20">
                            {character.role}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-white/40 mb-2">👥</div>
                  <p className="text-white/60">아직 등록된 캐릭터가 없습니다.</p>
                  <p className="text-white/40 text-sm mt-1">
                    시리즈에 캐릭터를 추가해보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailPage;
