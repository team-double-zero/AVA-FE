import React, { useState } from 'react';
import './Auth.css';
import { setAccessToken, setRefreshToken } from '../shared/lib/tokenUtils';
import { endpoints } from '../api/endpoints';

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState(null); // 'online', 'offline', null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // 입력 시 에러 메시지 초기화
  };

  // 서버 연결 상태 확인
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setServerStatus('online');
        return true;
      } else {
        setServerStatus('offline');
        return false;
      }
    } catch (err) {
      console.error('Server health check failed:', err);
      setServerStatus('offline');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 서버 상태 확인
    console.log('Checking server status before login...');
    const isServerOnline = await checkServerStatus();

    // 서버가 오프라인인 경우 에러 메시지 표시
    if (!isServerOnline) {
      setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인하거나 관리자에게 문의하세요.');
      setLoading(false);
      return;
    }

    // ========== 개발 모드 테스트 로그인 ==========
    // .env에서 REACT_APP_DEV_MODE=true로 설정하면 admin/admin으로 테스트 로그인 가능
    if (process.env.REACT_APP_DEV_MODE === 'true' && formData.email === 'admin' && formData.password === 'admin') {
      const dummyUser = {
        id: 1,
        email: 'admin@test.com',
        username: '관리자 (개발모드)',
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const dummyAccessToken = 'dev_access_token_' + Date.now();
      const dummyRefreshToken = 'dev_refresh_token_' + Date.now();
      
      // Access Token은 메모리에, Refresh Token은 쿠키에 저장
      console.log('💾 개발모드 토큰 저장 시작...');
      setAccessToken(dummyAccessToken);
      setRefreshToken(dummyRefreshToken);
      localStorage.setItem('userData', JSON.stringify(dummyUser));
      console.log('✅ 개발모드 토큰 저장 완료');
      
      onLoginSuccess(dummyAccessToken, dummyUser);
      setLoading(false);
      return;
    }
    // ========== 개발 모드 테스트 로그인 끝 ==========

    try {
      // 실제 API 요청
      console.log('Making login request to:', `${process.env.REACT_APP_DOMAIN}/api/v1/auth/login`);
      
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}${endpoints.auth.login}`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      const data = await response.json();

      if (response.ok && data.success) {
        // 로그인 성공
        const { access_token, refresh_token, user } = data.data;
        
        // Access Token은 메모리에, Refresh Token은 쿠키에 저장
        console.log('💾 실제 로그인 토큰 저장 시작...');
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        localStorage.setItem('userData', JSON.stringify(user));
        console.log('✅ 실제 로그인 토큰 저장 완료');
        
        onLoginSuccess(access_token, user);
      } else {
        // 로그인 실패
        if (data.error_code === 'EMAIL_NOT_VERIFIED') {
          setError('이메일 인증이 필요합니다. 이메일을 확인하고 계정을 인증해주세요.');
        } else {
          setError(data.message || '로그인에 실패했습니다.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // 에러 타입에 따른 상세한 메시지 제공
      let errorMessage = '서버에 연결할 수 없습니다.';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = '네트워크 연결을 확인해주세요. 서버에 접근할 수 없습니다.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS 정책으로 인해 서버에 접근할 수 없습니다.';
      } else if (err.message.includes('SSL') || err.message.includes('certificate')) {
        errorMessage = 'SSL 인증서 문제로 서버에 접근할 수 없습니다.';
      }
      
      // 개발자를 위한 추가 정보
      console.error('API Domain:', process.env.REACT_APP_DOMAIN);
      console.error('Full URL:', `${process.env.REACT_APP_DOMAIN}/api/v1/auth/login`);
      
      // ========== 서버 연결 실패 시 개발 모드 폴백 ==========
      if (process.env.REACT_APP_DEV_MODE === 'true' && formData.email === 'admin' && formData.password === 'admin') {
        const dummyUser = {
          id: 1,
          email: 'admin@test.com',
          username: '관리자 (오프라인)',
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const dummyAccessToken = 'offline_access_token_' + Date.now();
        const dummyRefreshToken = 'offline_refresh_token_' + Date.now();
        
        // Access Token은 메모리에, Refresh Token은 쿠키에 저장
        console.log('💾 오프라인 모드 토큰 저장 시작...');
        setAccessToken(dummyAccessToken);
        setRefreshToken(dummyRefreshToken);
        localStorage.setItem('userData', JSON.stringify(dummyUser));
        console.log('✅ 오프라인 모드 토큰 저장 완료');
        
        onLoginSuccess(dummyAccessToken, dummyUser);
      } else {
        const devModeHint = process.env.REACT_APP_DEV_MODE === 'true' 
          ? ' 개발모드에서는 admin/admin으로 로그인 가능합니다.' 
          : '';
        setError(`${errorMessage} 잠시 후 다시 시도해주세요.${devModeHint}`);
      }
      // ========== 서버 연결 실패 시 개발 모드 폴백 끝 ==========
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Avazon</h1>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              {process.env.REACT_APP_DEV_MODE === 'true' ? '이메일 또는 아이디' : '이메일'}
            </label>
            <input
              type={process.env.REACT_APP_DEV_MODE === 'true' ? 'text' : 'email'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={process.env.REACT_APP_DEV_MODE === 'true' ? "이메일 또는 아이디를 입력하세요" : "이메일을 입력하세요"}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* 서버 상태 표시 */}
          {serverStatus && (
            <div className={`status-message ${serverStatus}`} style={{
              background: serverStatus === 'online' ? '#e8f5e8' : '#ffebee',
              color: serverStatus === 'online' ? '#2e7d32' : '#c62828',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginBottom: '16px'
            }}>
              {serverStatus === 'online' ? '✅ 서버 연결 정상' : '❌ 서버 연결 실패'}
            </div>
          )}

          {/* 서버 상태 확인 버튼 */}
          <button
            type="button"
            className="auth-button secondary"
            onClick={checkServerStatus}
            style={{ marginBottom: '16px' }}
          >
            🔄 서버 연결 확인
          </button>

          {process.env.REACT_APP_DEV_MODE === 'true' && (
            <div className="info-message" style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginBottom: '16px'
            }}>
              💡 개발모드: admin / admin으로 테스트 로그인 가능
            </div>
          )}

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            계정이 없으신가요?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToSignup}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
  );
};

export default Login;
