# 🔄 리팩토링 가이드

AVA-FE 프로젝트가 새로운 디렉토리 구조로 리팩토링되었습니다. 이 문서는 변경 사항과 사용법을 설명합니다.

## 🏗️ 새로운 디렉토리 구조

```
src/
├── api/                     # API 클라이언트 및 스키마
│   ├── client.js           # fetch 래퍼 클라이언트
│   ├── endpoints.js        # API 엔드포인트 정의
│   ├── schemas.js          # 응답 스키마 및 타입
│   └── index.js            # 메인 export
│
├── features/               # 기능별 모듈
│   ├── dashboard/          # 대시보드 기능
│   │   ├── hooks/          # 대시보드 관련 훅
│   │   │   ├── useDashboardMetrics.js
│   │   │   ├── useItemsData.js
│   │   │   └── index.js
│   │   ├── components/     # 대시보드 컴포넌트
│   │   │   ├── KPICard.js
│   │   │   ├── ItemCard.js
│   │   │   ├── KanbanBoard.js
│   │   │   └── index.js
│   │   ├── pages/          # 대시보드 페이지
│   │   │   ├── DashboardPage.js
│   │   │   └── index.js
│   │   └── index.js
│   │
│   └── browse/             # 브라우즈 기능
│       ├── hooks/          # 브라우즈 관련 훅
│       │   ├── useExplorer.js
│       │   ├── useSeriesData.js
│       │   └── index.js
│       ├── components/     # 브라우즈 컴포넌트
│       │   ├── ExplorerPanel.js
│       │   ├── Breadcrumb.js
│       │   ├── DetailView.js
│       │   └── index.js
│       ├── pages/          # 브라우즈 페이지
│       │   ├── BrowsePage.js
│       │   └── index.js
│       └── index.js
│
├── shared/                 # 공용 모듈
│   ├── ui/                 # 공용 UI 컴포넌트
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Select.js
│   │   ├── Badge.js
│   │   ├── Card.js
│   │   ├── Loading.js
│   │   ├── Modal.js
│   │   └── index.js
│   │
│   └── lib/                # 유틸리티 함수
│       ├── cookieUtils.js
│       ├── tokenUtils.js
│       ├── utils.js
│       └── index.js
│
├── app/                    # 앱 설정
│   ├── router.js           # 라우터 설정
│   ├── providers.js        # Context 프로바이더
│   └── index.js
│
├── components/             # 기존 컴포넌트 (점진적 마이그레이션)
├── assets/                 # 정적 자산
├── App.js                  # 기존 메인 앱 파일
├── App.refactored.js       # 새로운 구조의 앱 파일
└── index.js
```

## 🚀 주요 변경 사항

### 1. API 클라이언트 모듈화
- **위치**: `src/api/`
- **기능**: 
  - 토큰 자동 관리가 포함된 fetch 클라이언트
  - API 엔드포인트 중앙 관리
  - 응답 스키마 정의

```javascript
// 사용 예시
import { apiClient, endpoints } from '../api';

const response = await apiClient.get(endpoints.series.list);
```

### 2. 기능별 모듈 구조 (Feature-based Architecture)
- **위치**: `src/features/`
- **구조**: `hooks/`, `components/`, `pages/`로 분리
- **장점**: 
  - 기능별 코드 응집도 향상
  - 독립적인 개발 및 테스트 가능
  - 재사용성 증대

```javascript
// Dashboard 기능 사용
import { DashboardPage, useDashboardMetrics } from '../features/dashboard';

// Browse 기능 사용
import { BrowsePage, useExplorer } from '../features/browse';
```

### 3. 공용 UI 컴포넌트 라이브러리
- **위치**: `src/shared/ui/`
- **포함**: Button, Input, Select, Badge, Card, Loading, Modal
- **특징**: 일관된 디자인 시스템 적용

```javascript
// 공용 UI 컴포넌트 사용
import { Button, Card, Badge } from '../shared/ui';

<Button variant="primary" size="medium">
  승인
</Button>
```

### 4. 유틸리티 함수 모듈화
- **위치**: `src/shared/lib/`
- **포함**: 
  - `tokenUtils`: 인증 토큰 관리
  - `cookieUtils`: 쿠키 관리
  - `utils`: 일반 유틸리티 함수

```javascript
// 유틸리티 함수 사용
import { tokenUtils, debounce, formatDate } from '../shared/lib';
```

### 5. 앱 설정 중앙화
- **위치**: `src/app/`
- **포함**:
  - `router.js`: 라우팅 설정
  - `providers.js`: Context 프로바이더, 에러 바운더리

```javascript
// 앱 설정 사용
import { AppProvider, ErrorBoundary, AppRoutes } from '../app';
```

## 🔧 마이그레이션 단계

### 단계 1: 새로운 구조 확인
현재 모든 새로운 구조가 구현되어 있습니다:
- ✅ API 클라이언트 모듈
- ✅ Features 구조 (dashboard, browse)
- ✅ 공용 UI 컴포넌트
- ✅ 유틸리티 함수 모듈화
- ✅ 앱 설정 중앙화

### 단계 2: 점진적 적용
기존 `App.js`를 `App.refactored.js`로 교체하여 새로운 구조를 적용할 수 있습니다.

```bash
# 백업 생성
mv src/App.js src/App.backup.js

# 새로운 구조 적용
mv src/App.refactored.js src/App.js
```

### 단계 3: 기존 컴포넌트 마이그레이션
기존 `src/components/` 내의 컴포넌트들을 점진적으로 새로운 구조로 이동:

1. **Auth 컴포넌트들** → `src/features/auth/`로 이동 예정
2. **Analysis 컴포넌트** → `src/features/analysis/`로 이동 예정
3. **Setting 컴포넌트** → `src/features/settings/`로 이동 예정

## 🎯 미래 기능 구현 가이드

### TanStack Query 통합
```javascript
// features/dashboard/hooks/useDashboardMetrics.js
import { useQuery } from '@tanstack/react-query';
import { apiClient, endpoints } from '../../../api';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => apiClient.get(endpoints.dashboard.metrics),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
```

### Keyset Pagination
```javascript
// features/browse/hooks/useSeriesData.js
export const useSeriesData = () => {
  return useInfiniteQuery({
    queryKey: ['series'],
    queryFn: ({ pageParam }) => 
      apiClient.get(endpoints.series.list, { cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.meta?.nextCursor,
  });
};
```

### 가상 스크롤
```javascript
// shared/ui/VirtualList.js
import { FixedSizeList as List } from 'react-window';

export const VirtualList = ({ items, itemHeight = 80 }) => {
  const ItemRenderer = ({ index, style }) => (
    <div style={style}>
      {/* 아이템 렌더링 */}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={itemHeight}
    >
      {ItemRenderer}
    </List>
  );
};
```

### URL 상태 동기화
```javascript
// shared/lib/urlState.js
import { useSearchParams } from 'react-router-dom';

export const useUrlState = (key, defaultValue) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = searchParams.get(key) || defaultValue;
  
  const setValue = (newValue) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(key, newValue);
      return newParams;
    });
  };
  
  return [value, setValue];
};
```

## 📋 체크리스트

### 완료된 작업
- [x] API 클라이언트 구현
- [x] Features 구조 설계 (dashboard, browse)
- [x] 공용 UI 컴포넌트 라이브러리
- [x] 유틸리티 함수 모듈화
- [x] 앱 설정 중앙화 (router, providers)
- [x] 새로운 구조의 App.js 구현

### 향후 작업
- [ ] 기존 App.js를 새로운 구조로 교체
- [ ] 나머지 기능들 (auth, analysis, settings) 마이그레이션
- [ ] TanStack Query 통합
- [ ] Keyset pagination 구현
- [ ] 가상 스크롤 구현
- [ ] URL 상태 동기화 구현
- [ ] 테스트 코드 작성

## 🔍 주요 이점

1. **개발 효율성**: 기능별로 코드가 분리되어 개발 및 유지보수가 용이
2. **재사용성**: 공용 컴포넌트와 훅을 통한 코드 재사용
3. **확장성**: 새로운 기능 추가 시 일관된 구조 적용 가능
4. **타입 안전성**: 스키마를 통한 API 응답 검증
5. **성능**: 코드 분할과 지연 로딩 준비 완료

## 📖 참고 자료

- [Feature-based Architecture](https://feature-sliced.design/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Window](https://react-window.vercel.app/)
- [React Router](https://reactrouter.com/)

---

새로운 구조로 더욱 체계적이고 확장 가능한 React 애플리케이션이 되었습니다! 🎉