import React, { createContext, useContext, useReducer } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * 애플리케이션 상태 관리를 위한 Context
 */

// 초기 상태
const initialState = {
  user: null,
  itemsData: {
    pending: { series: [], character: [], episode: [], video: [] },
    working: { series: [], character: [], episode: [], video: [] },
    approved: { series: [], character: [], episode: [], video: [] },
  },
  ui: {
    activeTab: 'dashboard',
    currentView: { type: 'tab', data: null },
    isLoading: false,
    error: null,
  },
};

// 액션 타입
export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_ITEMS_DATA: 'SET_ITEMS_DATA',
  UPDATE_ITEM: 'UPDATE_ITEM',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// 리듀서
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case actionTypes.SET_ITEMS_DATA:
      return {
        ...state,
        itemsData: action.payload,
      };

    case actionTypes.UPDATE_ITEM:
      // 특정 아이템 업데이트 로직
      const { category, type, item } = action.payload;
      return {
        ...state,
        itemsData: {
          ...state.itemsData,
          [category]: {
            ...state.itemsData[category],
            [type]: state.itemsData[category][type].map(existingItem =>
              existingItem.id === item.id ? { ...existingItem, ...item } : existingItem
            ),
          },
        },
      };

    case actionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeTab: action.payload,
        },
      };

    case actionTypes.SET_CURRENT_VIEW:
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: action.payload,
        },
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload,
        },
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
        },
      };

    default:
      return state;
  }
};

// React Query 클라이언트 생성
const queryClient = new QueryClient();

// Context 생성
const AppContext = createContext();

// Provider 컴포넌트
export const AppProvider = ({ children, initialData = {} }) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    ...initialData,
  });

  // 액션 생성자들
  const actions = {
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    
    setItemsData: (itemsData) => dispatch({ type: actionTypes.SET_ITEMS_DATA, payload: itemsData }),
    
    updateItem: (category, type, item) => dispatch({ 
      type: actionTypes.UPDATE_ITEM, 
      payload: { category, type, item } 
    }),
    
    setActiveTab: (tab) => dispatch({ type: actionTypes.SET_ACTIVE_TAB, payload: tab }),
    
    setCurrentView: (view) => dispatch({ type: actionTypes.SET_CURRENT_VIEW, payload: view }),
    
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    
    clearError: () => dispatch({ type: actionTypes.CLEAR_ERROR }),
  };

  const value = {
    state,
    actions,
    // 편의를 위한 직접 접근자들
    user: state.user,
    itemsData: state.itemsData,
    ui: state.ui,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

// Hook for using context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

/**
 * 에러 바운더리 컴포넌트
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  오류가 발생했습니다
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  애플리케이션에서 예상치 못한 오류가 발생했습니다.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppProvider;