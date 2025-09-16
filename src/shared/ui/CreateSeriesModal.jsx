import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import './CreateSeriesModal.css';

/**
 * 시리즈 생성 모달 컴포넌트
 */
const CreateSeriesModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="새 시리즈 생성"
      size="medium"
      className="create-series-modal"
    >
      <form onSubmit={handleSubmit} className="create-series-form">
        <div className="form-group">
          <label htmlFor="series-message" className="form-label">
            시리즈 아이디어를 설명해주세요
          </label>
          <textarea
            id="series-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 고양이가 주인공인 일상 코미디 시리즈를 만들고 싶어요. 귀여운 애니메이션 스타일로..."
            className="form-textarea"
            rows={4}
            disabled={loading}
            autoFocus
          />
          <p className="form-hint">
            엔터키로 전송하거나 생성 버튼을 눌러주세요
          </p>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!message.trim() || loading}
          >
            {loading ? 'AI가 생성 중...' : '시리즈 생성'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSeriesModal;
