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
Authorization: Bearer {{refresh_token}}
Content-Type: application/json
```

**참고**: Refresh token은 Authorization 헤더의 Bearer token으로 전송해야 합니다. Request body는 비워둡니다.

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

## 5. 초안 시리즈 목록 조회 API

### 요청
```http
GET /api/v1/series-drafts?draft_status=pending
Authorization: Bearer {{access_token}}
```

### 쿼리 파라미터
- `draft_status` (선택): 초안 상태 필터 (`pending`, `processing`, `completed`, `failed`)

### 성공 응답 (200)
```json
{
    "data": [
        {
            "id": 19,
            "status": "pending",
            "is_processed": false,
            "language": "ko",
            "version": "series-draft.v4",
            "created_at": "2025-09-05T11:07:05.371155",
            "updated_at": "2025-09-05T11:08:43.142212",
            "last_attempt_at": "2025-09-05T11:07:05.387693",
            "retry_count": 0,
            "draft_data": {
                "language": "ko",
                "version": "series-draft.v4",
                "series": {
                    "name": "쫀득클레이버스",
                    "one_liner": "손끝에서 살아나는 점토들이 장난스레 변신하는 스톱모션 미니 유니버스",
                    "concept": "고정 탑다운 작업대에서 촬영; 손은 화면에 등장하지 않음; 모든 변형은 컷 간 모핑으로 표현; 대사는 1문장 6초 이내의 짧은 리액션 중심; 의성어·의태어 적극 사용; 도구도 캐릭터화해 개입; 마지막엔 원형 복귀 또는 한 번의 깜짝 변주; 안전·정리 루틴을 짧게 보여줌.",
                    "audience": "10~30대 숏폼 시청자, 공예·만들기·ASMR·힐링 감성 선호층",
                    "tone_keywords": [
                        "키치",
                        "따뜻함",
                        "장난기",
                        "미니멀",
                        "만족감",
                        "ASMR",
                        "손맛",
                        "유머",
                        "포근함"
                    ],
                    "style_visual": [
                        "탑다운 고정 프레이밍",
                        "자연광 혹은 소프트박스의 부드러운 그림자",
                        "점토 표면의 지문·결 텍스처 클로즈업",
                        "스쿼시&스트레치 과장 모핑",
                        "과감한 파스텔·원색 대비",
                        "1:1 혹은 9:16 안전 프레임 가이드",
                        "도구 출현 시 미세 흔들림 바운스",
                        "종이·코르크 베이스보드 배경",
                        "로고 스탬프 인·아웃 애니메이션"
                    ],
                    "style_audio": [
                        "클레이 눌림·찢김·비빔 Foley",
                        "커터 긁힘·스냅 소리",
                        "부드러운 우드블록·핸드클랩 리듬 루프",
                        "저음역 롤오프된 환경 노이즈",
                        "속삭임 톤 내레이션",
                        "짧은 멜로딕 벨·글로켄 포인트",
                        "리버브 짧게 걸린 팝 효과",
                        "무가사·저자극 배경음"
                    ],
                    "format_outline": [
                        "0.5초 로고 스탬프 인",
                        "1초 콜드오픈(변형 하이라이트 한 컷)",
                        "호스트 한 문장 인사/상황 제시",
                        "주요 모핑 루프 2~3비트",
                        "도구 캐릭터 개입 1비트",
                        "ASMR 클로즈업 포인트 1비트",
                        "미니 팁/안전 한 줄 캡션",
                        "원형 복귀 또는 반전 변주",
                        "콜투액션 한 문장(댓글 유도)",
                        "엔드카드 1초 + 구독/다음 영상 프리뷰"
                    ],
                    "caption_rules": [
                        "자막은 1~2줄, 줄당 12자 이내",
                        "핵심 의성어를 컬러 강조(최대 2색)",
                        "이모지는 장면당 1개 이하",
                        "해시태그는 말미 2개 이하로 축약",
                        "전문용어 대신 쉬운 말 사용",
                        "숫자는 아라비아 숫자, 단위는 한글",
                        "의성어는 『』로 감싸 포인트",
                        "세로 비율(9:16) 우선 배치 기준 유지"
                    ]
                },
                "characters": [
                    {
                        "display_name": "모프리",
                        "role": "host",
                        "age": 3,
                        "birthday": "2022-06-15",
                        "appearance": "주황색 점토 네모 기본형에 큰 흰 눈알 두 개, 둥근 입 홈",
                        "personality": "낙천·호기심·리듬감이 강하고 즉흥적으로 리액션을 던진다.",
                        "residence": "작업대 중앙 베이스보드",
                        "voice_gender": "male",
                        "voice_keywords": [
                            "밝음",
                            "경쾌",
                            "장난기",
                            "짧은 호흡",
                            "가벼운 숨소리 ASMR"
                        ],
                        "behavior_notes": [
                            "문장을 짧게 끊어 리듬을 만든다.",
                            "모서리를 만지작거리며 말한다.",
                            "웃음은 '히히'보다 '하—'처럼 숨 내쉬기.",
                            "놀랄 때 몸이 살짝 길어졌다가 복귀.",
                            "도구에게 존댓말, 친구에겐 반말."
                        ],
                        "example_lines": [
                            "톡! 오늘은 모서리 깎아볼래?",
                            "쫀— 늘어났다! 복귀— 착.",
                            "둥글둥글, 기분도 둥글!",
                            "잠깐만, 안전캡 먼저— 오케이!",
                            "와— 이 결, 소름 퐁!"
                        ],
                        "constraints": [
                            "한 대사 6초 이내",
                            "폭력·파괴적 표현 금지",
                            "현실 인간·메타 언급 금지",
                            "안전 관련은 긍정형 표현",
                            "장면당 의성어 2개 이하"
                        ],
                        "features": "자석 눈알로 방향 전환, 입 모양 교체 가능, 몸에 남는 지문 텍스처가 표정처럼 보임",
                        "links_series_tone": [
                            "키치",
                            "장난기",
                            "만족감",
                            "유머"
                        ]
                    }
                    // ... 다른 캐릭터들 생략
                ],
                "metadata": {
                    "tags": [
                        "스톱모션",
                        "클레이",
                        "ASMR",
                        "숏폼",
                        "모핑",
                        "키치",
                        "힐링",
                        "공예",
                        "작업대",
                        "애니메이션"
                    ],
                    "notes": "촬영은 고정 삼각대와 레일 없는 핸드오프; 배경 소음 -40dB 이하 유지; Foley는 자체 녹음 중심; 색채는 파스텔 60/원색 40 비율 권장."
                }
            }
        }
        // ... 추가 초안 항목들
    ],
    "filters": {
        "draft_status": "pending",
        "query": null,
        "story_type": null
    },
    "total_count": 14
}
```

### 실패 응답 (401)
```json
{
    "message": "Unauthorized access",
    "success": false
}
```

### 실패 응답 (404)
```json
{
    "message": "No series drafts found",
    "success": false
}
```