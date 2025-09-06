import React from 'react';
import CharacterDetail from '../components_backup/CharacterDetail';
import SeriesDetail from '../components_backup/SeriesDetail';
import EpisodeDetail from '../components_backup/EpisodeDetail';
import VideoDetail from '../components_backup/VideoDetail';

const ItemDetail = ({ item, onBack, onApprove, onFeedback }) => {
  if (!item) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

  const renderDetailComponent = () => {
    switch (item.type) {
      case 'character':
        return (
          <CharacterDetail
            item={item}
            onBack={onBack}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        );
      case 'series':
        return (
          <SeriesDetail
            item={item}
            onBack={onBack}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        );
      case 'episode':
        return (
          <EpisodeDetail
            item={item}
            onBack={onBack}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        );
      case 'video':
        return (
          <VideoDetail
            item={item}
            onBack={onBack}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        );
      default:
        return <div>지원하지 않는 아이템 타입입니다: {item.type}</div>;
    }
  };

  return renderDetailComponent();
};

export default ItemDetail;