# API 요청 및 응답 형식

## 1. 로그인 API

### 요청
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "{{email}}",
    "password": "{{password}}"
}
```

### 성공 응답 (200)
이하는 예시
```json
{
    "data": {
        "access_token": "{{vault:json-web-token}}",
        "refresh_token": "{{vault:json-web-token}}",
        "user": {
            "created_at": "2025-08-21T07:41:10.245137",
            "email": "jkya02@gmail.com",
            "id": 2,
            "is_active": true,
            "is_verified": true,
            "last_login_at": "2025-08-21T07:42:59.522414+00:00",
            "phone_number": null,
            "profile_image_url": null,
            "updated_at": "2025-08-21T07:42:59.522661+00:00",
            "username": "제이든"
        }
    },
    "message": "Login successful",
    "success": true
}
```

### 실패 응답 (401)
```json
{
    "message": "Invalid email or password",
    "success": false
}
```
```json
{
    "error_code": "EMAIL_NOT_VERIFIED",
    "message": "Email verification required. Please check your email and verify your account.",
    "success": false
}
```

## 2. 회원가입 API

### 요청
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "nickname": "새사용자"
}
```

### 성공 응답 (201)
이하는 예시.
```json
{
    "data": {
        "user": {
            "created_at": "2025-08-21T07:41:10.245137+00:00",
            "email": "jkya02@gmail.com",
            "id": 2,
            "is_active": true,
            "is_verified": false,
            "last_login_at": null,
            "phone_number": null,
            "profile_image_url": null,
            "updated_at": "2025-08-21T07:41:10.245141+00:00",
            "username": "제이든"
        },
        "verification_required": true
    },
    "message": "User registered successfully. Please check your email and verify your account before logging in.",
    "success": true
}
```

## 3. 이메일 인증 재전송 API

### 요청
```http
POST /api/v1/auth/resend-verification
Content-Type: application/json

{
    "email": "{{email}}"
}
```

### 성공 응답 (200)
```json
{
    "message": "Verification email sent successfully. Please check your email.",
    "success": true
}
```

## 4. Access Token 갱신 API

### 요청
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
    "refresh_token": "{{refresh_token}}"
}
```

### 성공 응답 (200)
```json
{
    "data": {
        "access_token": "{{vault:json-web-token}}",
        "refresh_token": "{{vault:json-web-token}}"
    },
    "message": "Token refreshed successfully",
    "success": true
}
```

### 실패 응답 (401)
```json
{
    "message": "Invalid or expired refresh token",
    "success": false
}
```
