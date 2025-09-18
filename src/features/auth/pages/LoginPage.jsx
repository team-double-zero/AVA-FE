import React, { useState } from 'react';
import { setAccessToken, setRefreshToken } from '../../../shared/lib/tokenUtils';
import { endpoints } from '../../../shared/api/endpoints';
import { authService } from '../../../shared/api';
import { config } from '../../../config';

const LoginPage = ({ onLoginSuccess, onSwitchToSignup }) => {
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
      const response = await fetch(`${import.meta.env.VITE_DOMAIN}/api/v1/health`, {
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

    // ========== 개발 모드 테스트 로그인 ========== (기존 로직 유지)
    if (config.isDevMode && formData.email === 'admin' && formData.password === 'admin') {
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
      const data = await authService.login(formData);

      if (data.success) {
        const { access_token, refresh_token, user } = data.data;

        console.log('💾 실제 로그인 토큰 저장 시작...');
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        localStorage.setItem('userData', JSON.stringify(user));
        console.log('✅ 실제 로그인 토큰 저장 완료');

        onLoginSuccess(access_token, user);
      } else {
        if (data.error_code === 'EMAIL_NOT_VERIFIED') {
          setError('이메일 인증이 필요합니다. 이메일을 확인하고 계정을 인증해주세요.');
        } else {
          setError(data.message || '로그인에 실패했습니다.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);

      let errorMessage = '서버에 연결할 수 없습니다.';

      if (err.message.includes('fetch') || err.message.includes('Network')) {
        errorMessage = '네트워크 연결을 확인해주세요. 서버에 접근할 수 없습니다.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS 정책으로 인해 서버에 접근할 수 없습니다.';
      } else if (err.message.includes('SSL') || err.message.includes('certificate')) {
        errorMessage = 'SSL 인증서 문제로 서버에 접근할 수 없습니다.';
      } else if (err.data && err.data.message) {
        errorMessage = err.data.message;
      }

      console.error('API Domain:', import.meta.env.VITE_DOMAIN);
      console.error('Full URL:', `${import.meta.env.VITE_DOMAIN}/api/v1/auth/login`);

      // ========== 서버 연결 실패 시 개발 모드 폴백 ========== (기존 로직 유지)
      if (config.isDevMode && formData.email === 'admin' && formData.password === 'admin') {
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

        console.log('💾 오프라인 모드 토큰 저장 시작...');
        setAccessToken(dummyAccessToken);
        setRefreshToken(dummyRefreshToken);
        localStorage.setItem('userData', JSON.stringify(dummyUser));
        console.log('✅ 오프라인 모드 토큰 저장 완료');

        onLoginSuccess(dummyAccessToken, dummyUser);
      } else {
        const devModeHint = config.isDevMode
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="relative isolate bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slideUp before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1/2 before:rounded-t-2xl before:pointer-events-none before:bg-gradient-to-b before:from-white/15 before:to-white/5 after:content-[''] after:absolute after:inset-px after:rounded-[15px] after:pointer-events-none after:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)] after:opacity-80 sm:p-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white text-shadow-lg mb-2">Avazon</h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-5">
            <label htmlFor="email" className="block mb-1.5 font-medium text-white text-sm text-shadow-sm relative z-10">
              {config.isDevMode ? '이메일 또는 아이디' : '이메일'}
            </label>
            <input
              type={config.isDevMode ? 'text' : 'email'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={config.isDevMode ? "이메일 또는 아이디를 입력하세요" : "이메일을 입력하세요"}
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
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full px-4 py-3 border-2 border-white/30 rounded-lg text-base transition-all duration-300 bg-white/90 text-gray-800 relative z-10 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200/30 focus:bg-white"
            />
          </div>

          {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm border-l-4 border-red-500">{error}</div>}

          {serverStatus && (
            <div className={`p-2 px-3 rounded-md text-sm mb-4 ${serverStatus === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {serverStatus === 'online' ? '✅ 서버 연결 정상' : '❌ 서버 연결 실패'}
            </div>
          )}

          <button
            type="button"
            className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 mb-4 hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            onClick={checkServerStatus}
          >
            🔄 서버 연결 확인
          </button>

          {config.isDevMode && (
            <div className="bg-blue-100 text-blue-800 p-2 px-3 rounded-md text-sm mb-4">
              💡 개발모드: admin / admin으로 테스트 로그인 가능
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="text-center text-white text-sm opacity-90 text-shadow-sm relative z-10">
          <p>
            계정이 없으신가요?{' '}
            <button
              type="button"
              className="bg-transparent border-none text-white font-medium cursor-pointer underline text-sm hover:text-purple-200 hover:text-shadow-md"
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

export default LoginPage;