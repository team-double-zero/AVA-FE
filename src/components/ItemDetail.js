import React from 'react';
import WorldviewDetail from './WorldviewDetail';
import CharacterDetail from './CharacterDetail';
import EpisodeDetail from './EpisodeDetail';
import ScenarioDetail from './ScenarioDetail';
import VideoDetail from './VideoDetail';

const ItemDetail = ({ item, onBack, onApprove, onFeedback }) => {
  if (!item) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

  const renderDetailComponent = () => {
    switch (item.type) {
      case 'worldview':
        return (
          <WorldviewDetail
            item={item}
            onBack={onBack}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        );
      case 'character':
        return (
          <CharacterDetail
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
      case 'scenario':
        return (
          <ScenarioDetail
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