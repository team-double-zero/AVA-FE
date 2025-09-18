import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

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
      className="bg-[rgba(255,255,255,0.9)] backdrop-blur-2xl max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="series-message" className="text-sm font-semibold text-gray-800">
            시리즈 아이디어를 설명해주세요
          </label>
          <textarea
            id="series-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 고양이가 주인공인 일상 코미디 시리즈를 만들고 싶어요. 귀여운 애니메이션 스타일로..."
            className="w-full min-h-[120px] px-5 py-4 text-sm text-gray-800 bg-white/70 backdrop-blur-lg resize-y rounded-xl border border-white/50 shadow-inner-sm transition-all duration-300 focus:outline-none focus:border-purple-400/60 focus:bg-white/90 focus:-translate-y-px focus:shadow-[0_0_0_3px_rgba(131,112,254,0.1),inset_0_1px_3px_rgba(0,0,0,0.02)] disabled:bg-gray-50/50 disabled:text-gray-400 disabled:cursor-not-allowed"
            rows={4}
            disabled={loading}
            autoFocus
          />
          <p className="text-xs text-gray-500">
            엔터키로 전송하거나 생성 버튼을 눌러주세요
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 sm:flex-row flex-col">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!message.trim() || loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'AI가 생성 중...' : '시리즈 생성'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSeriesModal;