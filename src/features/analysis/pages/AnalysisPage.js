import React from 'react';
import { Card } from '../../../shared/ui';

/**
 * 분석 페이지 컴포넌트
 */
const AnalysisPage = () => {
  const features = [
    { icon: '📊', title: '승인 속도 분석', description: '아이템별 평균 승인 시간과 처리 속도 추이' },
    { icon: '⏰', title: '처리 시간 통계', description: '시간대별, 요일별 처리 효율성 분석' },
    { icon: '📋', title: '콘텐츠 품질 지표', description: '피드백 빈도와 개선 패턴 분석' },
    { icon: '🎯', title: '워크플로우 최적화', description: '병목 구간 식별 및 개선 제안' },
  ];

  return (
    <div className="analysis-page">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ANALYSIS</h1>
        <p className="text-gray-600">
          승인 프로세스와 콘텐츠 현황을 분석하여 워크플로우를 최적화합니다.
        </p>
      </div>

      {/* 준비 중 섹션 */}
      <Card className="text-center py-12">
        <div className="mb-6">
          <span className="text-6xl mb-4 block">📈</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">분석 기능 준비 중</h2>
          <p className="text-gray-600 mb-8">
            곧 다양한 분석 도구와 리포트를 제공할 예정입니다.
          </p>
        </div>

        {/* 예정 기능 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-4 text-left"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 알림 메시지 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>개발 진행 중:</strong> 서버 API 연결 완료 후 실시간 분석 대시보드가 제공됩니다.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AnalysisPage;