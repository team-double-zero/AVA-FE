import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      const dummyToken = 'dev_token_' + Date.now();
      
      localStorage.setItem('authToken', dummyToken);
      localStorage.setItem('refreshToken', 'dev_refresh_' + Date.now());
      localStorage.setItem('userData', JSON.stringify(dummyUser));
      
      onLoginSuccess(dummyToken, dummyUser);
      setLoading(false);
      return;
    }
    // ========== 개발 모드 테스트 로그인 끝 ==========

    try {
      // 실제 API 요청
      const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 로그인 성공
        const { access_token, refresh_token, user } = data.data;
        
        // 토큰을 localStorage에 저장
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('userData', JSON.stringify(user));
        
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
        const dummyToken = 'offline_token_' + Date.now();
        
        localStorage.setItem('authToken', dummyToken);
        localStorage.setItem('refreshToken', 'offline_refresh_' + Date.now());
        localStorage.setItem('userData', JSON.stringify(dummyUser));
        
        onLoginSuccess(dummyToken, dummyUser);
      } else {
        const devModeHint = process.env.REACT_APP_DEV_MODE === 'true' 
          ? ' 개발모드에서는 admin/admin으로 로그인 가능합니다.' 
          : '';
        setError(`서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.${devModeHint}`);
      }
      // ========== 서버 연결 실패 시 개발 모드 폴백 끝 ==========
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Avazon</h1>
          <p className="auth-subtitle">AI 콘텐츠 생성 플랫폼에 오신 것을 환영합니다</p>
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
    </div>
  );
};

export default Login;
