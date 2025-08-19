import React, { useState } from 'react';
import './ItemDetail.css';

const ItemDetail = ({ item, onBack, onApprove, onFeedback }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  if (!item) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'worldview': return '🌍';
      case 'character': return '👤';
      case 'scenario': return '📝';
      default: return '📄';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'worldview': return '세계관';
      case 'character': return '캐릭터';
      case 'scenario': return '시나리오';
      default: return '아이템';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '승인 대기';
      case 'review': return '검토 중';
      case 'generating': return 'AI 생성 중';
      default: return '대기';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff6b6b';
      case 'review': return '#ffa726';
      case 'generating': return '#17a2b8';
      default: return '#8370FE';
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(item);
    }
  };

  const handleFeedbackSubmit = () => {
    if (onFeedback && feedbackText.trim()) {
      onFeedback(item, feedbackText);
      setFeedbackText('');
      setShowFeedbackForm(false);
    }
  };

  // 샘플 AI 생성 텍스트 (실제로는 서버에서 받아올 데이터)
  const getSampleContent = (type, title) => {
    switch (type) {
      case 'worldview':
        return `# ${title}

## 배경 설정
2077년, 기술이 극도로 발달한 미래 도시 나이트 시티. 거대 기업들이 정부를 대신해 세상을 지배하며, 사이버네틱 임플란트가 일상화된 세상입니다.

## 주요 특징
- **메가코퍼레이션 지배**: 아라사카, 밀리테크 등 거대 기업들이 실질적 권력을 가짐
- **사이버네틱 기술**: 신체 개조와 뇌-컴퓨터 인터페이스가 보편화
- **계급 사회**: 상류층과 하층민 간의 극심한 격차
- **네트워킹**: 가상 현실 네트워크를 통한 정보 접근과 해킹

## 지역 설정
### 나이트 시티 중심가
- 기업 본사들이 위치한 고층 빌딩 지역
- 첨단 기술과 럭셔리가 공존하는 공간

### 언더시티
- 지하에 형성된 빈민가
- 불법 사이버웨어 거래와 해커들의 은신처`;

      case 'character':
        return `# ${title}

## 기본 정보
- **이름**: 알렉스 "고스트" 첸
- **나이**: 28세
- **직업**: 프리랜서 넷러너 (해커)
- **출신**: 나이트 시티 언더시티

## 외모
키 175cm의 마른 체형. 왼쪽 눈에 사이버네틱 임플란트가 설치되어 있어 푸른 빛이 돈다. 검은 머리에 네온 그린 하이라이트가 들어가 있으며, 손목과 목 뒤쪽에 데이터 포트가 있다.

## 성격
- **냉철함**: 감정을 잘 드러내지 않고 논리적으로 사고
- **의리**: 동료를 위해서라면 위험을 감수
- **반체제**: 메가코퍼레이션에 대한 강한 불신
- **완벽주의**: 해킹 작업에서는 완벽을 추구

## 능력
### 해킹 스킬
- **ICE 브레이킹**: 고급 보안 시스템 해킹 가능
- **스텔스 모드**: 추적당하지 않고 시스템 침투
- **데이터 마이닝**: 숨겨진 정보 발굴 전문

### 사이버웨어
- **뉴럴 인터페이스**: 직접적인 네트워크 연결
- **반응속도 증강**: 전투 시 반응속도 3배 향상
- **메모리 확장**: 대용량 데이터 임시 저장 가능

## 배경 스토리
언더시티에서 태어나 어릴 때부터 컴퓨터에 관심을 보였다. 15세에 첫 해킹을 성공한 후 프리랜서 넷러너로 활동 시작. 아라사카의 불법 실험으로 가족을 잃은 후 복수를 다짐하며 더욱 강력한 해커가 되었다.`;

      case 'scenario':
        return `# ${title}

## 장면 설정
**위치**: 나이트 시티 중심가 - 아라사카 타워 지하 50층
**시간**: 2077년 11월 15일, 오전 3:24
**날씨**: 산성비가 내리는 어둠 속

## 상황
알렉스가 아라사카의 극비 데이터베이스에 침투하기 위해 건물 지하 깊숙한 서버룸에 잠입했다. 하지만 예상보다 강력한 보안 시스템이 가동되고 있어 계획에 차질이 생겼다.

---

## 대화

**[시스템 알림]**
*"경고: 무단 침입자 감지. 보안 프로토콜 레벨 5 가동."*

**알렉스** *(중얼거리며)*
"젠장... 이건 예상보다 훨씬 까다로운데."

*알렉스는 뇌 임플란트를 통해 네트워크에 직접 연결한다. 눈앞에 가상의 데이터 구조가 펼쳐진다.*

**알렉스** *(집중하며)*
"좋아, 차근차근 해보자. ICE 방벽이... 3중으로 되어 있군."

*갑자기 서버룸 입구에서 발소리가 들린다.*

**보안요원 1** *(무전기에 대고)*
"지하 50층 점검 시작합니다. 이상 없으면 10분 후 보고하겠습니다."

**알렉스** *(속으로)*
"10분... 충분해."

*알렉스의 손가락이 공중에서 빠르게 움직이며 가상 인터페이스를 조작한다.*

**시스템 음성**
*"첫 번째 방벽 해제... 두 번째 방벽 해제... 세 번째 방벽..."*

**알렉스** *(긴장하며)*
"아직... 아직..."

*갑자기 경보음이 울리기 시작한다.*

**시스템 음성**
*"침입자 확인. 모든 보안요원은 지하 50층으로 집결하라."*

**알렉스** *(결심하며)*
"이제 도망칠 시간이야!"

---

## 액션 시퀀스
1. 알렉스가 마지막 데이터를 다운로드하며 시간을 번다
2. 보안요원들이 서버룸으로 몰려온다
3. 알렉스는 환기구를 통해 탈출 시도
4. 추격전이 시작되며 긴장감 고조

## 결말
알렉스는 가까스로 건물을 탈출하지만, 아라사카가 그의 정체를 파악했다는 것을 깨닫는다. 이제 진짜 위험이 시작된 것이다.`;

      default:
        return '내용을 불러오는 중...';
    }
  };

  return (
    <div className="item-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← 돌아가기
        </button>
        <div className="detail-title-section">
          <div className="detail-type">
            <span className="type-icon">{getTypeIcon(item.type)}</span>
            <span className="type-name">{getTypeName(item.type)}</span>
          </div>
          <h1 className="detail-title">{item.title}</h1>
          <div className="detail-meta">
            <span 
              className="detail-status"
              style={{ backgroundColor: getStatusColor(item.status) }}
            >
              {getStatusText(item.status)}
            </span>
            {item.feedbackCount > 0 && (
              <span className="detail-feedback-count">
                💬 피드백 {item.feedbackCount}회
              </span>
            )}
            <span className="detail-date">생성일: {item.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="content-section">
          <h3>AI 생성 내용</h3>
          <div className="content-text">
            <pre>{getSampleContent(item.type, item.title)}</pre>
          </div>
        </div>

        <div className="detail-actions">
          {!showFeedbackForm ? (
            <>
              <button 
                className="action-button approve"
                onClick={handleApprove}
              >
                ✅ 승인
              </button>
              <button 
                className="action-button feedback"
                onClick={() => setShowFeedbackForm(true)}
              >
                💬 피드백 주기
              </button>
            </>
          ) : (
            <div className="feedback-form">
              <h4>피드백 작성</h4>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="수정이 필요한 부분이나 개선사항을 작성해주세요..."
                rows={4}
              />
              <div className="feedback-actions">
                <button 
                  className="action-button submit"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
                >
                  피드백 제출
                </button>
                <button 
                  className="action-button cancel"
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setFeedbackText('');
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;