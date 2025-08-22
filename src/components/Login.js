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
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
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
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
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
