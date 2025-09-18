import React, { useState } from 'react';
import { endpoints } from '../../../shared/api/endpoints';
import { authService } from '../../../shared/api';
import { config } from '../../../config';

const SignupPage = ({ onSwitchToLogin }) => {
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
    if (!config.isDevMode) {
      const emailRegex = /^[^@S@]+@[^S@]+\.[^S@]+$/;
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
      const data = await authService.register({
        email: formData.email,
        password: formData.password,
        username: formData.nickname
      });

      if (data.success) {
        setSuccess(data.message || '회원가입이 완료되었습니다. 이메일을 확인해주세요.');
        setStep('verify');
      } else {
        setError(data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.data?.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authService.resendVerification(formData.email);

      if (data.success) {
        setSuccess(data.message || '인증 이메일이 재전송되었습니다.');
      } else {
        setError(data.message || '이메일 재전송에 실패했습니다.');
      }
    } catch (err) {
      console.error('Resend email error:', err);
      setError(err.data?.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
        <div className="relative isolate bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slideUp sm:p-6">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white text-shadow-lg mb-2">이메일 인증</h1>
            <p className="text-white/90 text-sm leading-relaxed text-shadow-sm">
              {formData.email}로 인증 이메일을 보냈습니다.
            </p>
          </div>

          <div className="text-center p-5">
            <div className="text-6xl mb-5">📧</div>
            <p className="text-white/90 leading-relaxed mb-6 text-shadow-sm">이메일의 인증 링크를 클릭하여 회원가입을 완료해주세요.</p>

            {success && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm border-l-4 border-green-500">{success}</div>}
            {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm border-l-4 border-red-500">{error}</div>}

            <button
              type="button"
              className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 mb-4 hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleResendEmail}
              disabled={loading}
            >
              {loading ? '재전송 중...' : '인증 이메일 재전송'}
            </button>

            <button
              type="button"
              className="bg-transparent border-none text-white font-medium cursor-pointer underline text-sm hover:text-purple-200 hover:text-shadow-md"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="relative isolate bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slideUp sm:p-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white text-shadow-lg mb-2">회원가입</h1>
          <p className="text-white/90 text-sm leading-relaxed text-shadow-sm">Avazon에서 AI 콘텐츠를 생성해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-5">
            <label htmlFor="email" className="block mb-1.5 font-medium text-white text-sm text-shadow-sm relative z-10">이메일</label>
            <input
              type={config.isDevMode ? 'text' : 'email'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={config.isDevMode ? 'test@example.com 또는 이메일을 입력하세요' : '이메일을 입력하세요'}
              required
              className="w-full px-4 py-3 border-2 border-white/30 rounded-lg text-base transition-all duration-300 bg-white/90 text-gray-800 relative z-10 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/30 focus:bg-white"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="nickname" className="block mb-1.5 font-medium text-white text-sm text-shadow-sm relative z-10">닉네임</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              required
              className="w-full px-4 py-3 border-2 border-white/30 rounded-lg text-base transition-all duration-300 bg-white/90 text-gray-800 relative z-10 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/30 focus:bg-white"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-1.5 font-medium text-white text-sm text-shadow-sm relative z-10">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              required
              className="w-full px-4 py-3 border-2 border-white/30 rounded-lg text-base transition-all duration-300 bg-white/90 text-gray-800 relative z-10 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/30 focus:bg-white"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block mb-1.5 font-medium text-white text-sm text-shadow-sm relative z-10">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              className="w-full px-4 py-3 border-2 border-white/30 rounded-lg text-base transition-all duration-300 bg-white/90 text-gray-800 relative z-10 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/30 focus:bg-white"
            />
          </div>

          {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm border-l-4 border-red-500">{error}</div>}
          {success && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm border-l-4 border-green-500">{success}</div>}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="text-center text-white text-sm opacity-90 text-shadow-sm relative z-10">
          <p>
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              className="bg-transparent border-none text-white font-medium cursor-pointer underline text-sm hover:text-purple-200 hover:text-shadow-md"
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

export default SignupPage;