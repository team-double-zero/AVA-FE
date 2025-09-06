import { useState, useCallback, useMemo } from 'react';

/**
 * 브라우즈 탐색기 상태를 관리하는 훅
 */
export const useExplorer = (itemsData) => {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

  // 현재 경로 표시를 위한 breadcrumb
  const breadcrumb = useMemo(() => {
    const path = ['시리즈'];
    if (selectedSeries) {
      path.push(selectedSeries.title);
    }
    if (selectedEpisode) {
      path.push(selectedEpisode.title);
    }
    return path;
  }, [selectedSeries, selectedEpisode]);

  // 시리즈 선택
  const handleSeriesSelect = useCallback((series) => {
    setSelectedSeries(series);
    setSelectedEpisode(null);
    setSelectedItem(series);
    setSelectedItemType('series');
  }, []);

  // 에피소드 선택
  const handleEpisodeSelect = useCallback((episode) => {
    setSelectedEpisode(episode);
    setSelectedItem(episode);
    setSelectedItemType('episode');
  }, []);

  // 캐릭터 선택
  const handleCharacterSelect = useCallback((character) => {
    setSelectedItem(character);
    setSelectedItemType('character');
  }, []);

  // 선택 초기화
  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    setSelectedItemType(null);
    // 시리즈와 에피소드 선택은 유지
  }, []);

  // 전체 초기화
  const resetExplorer = useCallback(() => {
    setSelectedSeries(null);
    setSelectedEpisode(null);
    setSelectedItem(null);
    setSelectedItemType(null);
  }, []);

  // 해당 시리즈의 에피소드들 가져오기
  const getSeriesEpisodes = useCallback((seriesId) => {
    return itemsData?.approved?.episode?.filter(episode => 
      episode.seriesId === seriesId
    ) || [];
  }, [itemsData]);

  // 해당 시리즈의 캐릭터들 가져오기
  const getSeriesCharacters = useCallback((seriesId) => {
    return itemsData?.approved?.character?.filter(character => 
      character.seriesId === seriesId
    ) || [];
  }, [itemsData]);

  // 해당 에피소드의 비디오들 가져오기
  const getEpisodeVideos = useCallback((episodeId) => {
    return itemsData?.approved?.video?.filter(video => 
      video.episodeId === episodeId
    ) || [];
  }, [itemsData]);

  return {
    // 상태
    selectedSeries,
    selectedEpisode,
    selectedItem,
    selectedItemType,
    breadcrumb,
    
    // 액션
    handleSeriesSelect,
    handleEpisodeSelect,
    handleCharacterSelect,
    clearSelection,
    resetExplorer,
    
    // 헬퍼
    getSeriesEpisodes,
    getSeriesCharacters,
    getEpisodeVideos,
  };
};

export default useExplorer;