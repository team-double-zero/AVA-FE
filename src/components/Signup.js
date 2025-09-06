import React, { useState } from 'react';
import './Auth.css';

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('signup'); // 'signup' | 'verify'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    // 개발 모드가 아닐 때만 이메일 형식 검사
    if (process.env.REACT_APP_DEV_MODE !== 'true') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return false;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    if (formData.nickname.length < 2) {
      setError('닉네임은 2자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // 실제 API 요청
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.nickname
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 회원가입 성공 - 이메일 인증 단계로 이동
        setSuccess(data.message || '회원가입이 완료되었습니다. 이메일을 확인해주세요.');
        setStep('verify');
      } else {
        setError(data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 이메일 재전송 API 호출
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message || '인증 이메일이 재전송되었습니다.');
      } else {
        setError(data.message || '이메일 재전송에 실패했습니다.');
      }
    } catch (err) {
      console.error('Resend email error:', err);
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">이메일 인증</h1>
            <p className="auth-subtitle">
              {formData.email}로 인증 이메일을 보냈습니다.
            </p>
          </div>

          <div className="verification-content">
            <div className="verification-icon">📧</div>
            <p>이메일의 인증 링크를 클릭하여 회원가입을 완료해주세요.</p>
            
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <button
              type="button"
              className="auth-button secondary"
              onClick={handleResendEmail}
              disabled={loading}
            >
              {loading ? '재전송 중...' : '인증 이메일 재전송'}
            </button>

            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-subtitle">Avazon에서 AI 콘텐츠를 생성해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type={process.env.REACT_APP_DEV_MODE === 'true' ? 'text' : 'email'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={process.env.REACT_APP_DEV_MODE === 'true' ? 'test@example.com 또는 이메일을 입력하세요' : '이메일을 입력하세요'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
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
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
