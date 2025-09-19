import React from 'react';

const AnalysisPage = () => {
  return (
    <div className="w-full min-h-full h-auto pb-0">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 sm:text-2xl">분석 대시보드</h2>
        <p className="text-lg text-gray-600 sm:text-base">승인 프로세스와 콘텐츠 현황을 분석합니다</p>
      </div>

      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center bg-white/90 rounded-2xl p-8 border-2 border-gray-200 max-w-3xl w-full sm:p-4">
          <div className="text-6xl mb-6 sm:text-5xl">📈</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 sm:text-xl">분석 기능 준비 중</h3>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed sm:text-base">곧 다양한 분석 도구와 리포트를 제공할 예정입니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 sm:gap-3">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:border-purple-300">
              <span className="text-2xl">📊</span>
              <span className="font-medium text-gray-800">승인 속도 분석</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:border-purple-300">
              <span className="text-2xl">⏰</span>
              <span className="font-medium text-gray-800">처리 시간 통계</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:border-purple-300">
              <span className="text-2xl">📋</span>
              <span className="font-medium text-gray-800">콘텐츠 품질 지표</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:border-purple-300">
              <span className="text-2xl">🎯</span>
              <span className="font-medium text-gray-800">워크플로우 최적화</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;