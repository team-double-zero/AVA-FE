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

## 6. 승인된 시리즈 목록 조회 API

### 요청
```http
GET /api/v1/series
Authorization: Bearer {{access_token}}
```

### 성공 응답 (200)
```json
{
    "data": [
        {
            "id": 6,
            "name": "시선데이트: 하리",
            "slug": "시선데이트-하리",
            "one_liner": "1인칭 카메라로 함께 걷고 먹고 웃는 도시 데이트 숏폼, 설렘과 배려의 감각을 담다.",
            "concept": "• 1인칭(시청자 시점) 데이트 바이브 숏폼 시리즈\n• 여성 호스트가 카메라를 바라보며 대화, 손짓, 미소로 상호작용\n• 한 회차=한 장소/한 테마(카페, 서점, 산책, 야시장 등)로 감각 중심 구성\n• 친밀하되 건전하고 존중하는 표현만 사용(모든 캐릭터 21세 이상)\n• 노골적 성적 묘사/노출 금지, 부드럽고 대담한 플러팅과 돌봄 중심\n• ASMR형 근접 음성+현장 앰비언스, 캡션은 짧고 감각적인 1인칭 문장",
            "audience": "20-34 성인 시청자, 로맨스/ASMR/도시 브이로그 취향층",
            "tone_keywords": [
                "설레는",
                "따뜻한",
                "잔잔한",
                "친밀한",
                "플러티",
                "사려 깊은",
                "감각적",
                "코지",
                "현대적",
                "대담한",
                "매혹적인"
            ],
            "style_visual": [
                "POV 클로즈업 아이컨택",
                "손잡기 제스처의 손 프레이밍",
                "소프트 자연광과 저녁 네온 보케",
                "핸드헬드+미니 짐벌의 안정된 흔들림",
                "파스텔 톤 컬러 그레이딩",
                "입김/컵 스팀 등 미세 디테일 매크로 샷",
                "도시 사인·회전문·계단의 리듬 편집",
                "자연스러운 피부톤과 미소 하이라이트"
            ],
            "style_audio": [
                "근접 속삭임/알토 톤 ASMR",
                "도시 앰비언스(바람, 전철 멀리, 컵 소리)",
                "로파이/재즈 훅 60-80BPM",
                "발걸음과 코트 소리의 리듬",
                "사운드 트랜지션(문 여는 소리→씬 컷)",
                "리버브 얕은 공간감",
                "서브베이스 미니멀한 웜톤",
                "피사체 동작에 맞춘 다이내믹 오토메이션"
            ],
            "format_outline": [
                "0-2초: 훅(아이컨택+짧은 속삭임, 손 내밀기 제스처)",
                "3-10초: 비트1(장소 소개 한 문장+감각 디테일 SFX)",
                "11-20초: 비트2(상호작용 제안: 손, 목도리, 사진)",
                "21-30초: 비트3(작은 웃음/공감 포인트, 속도 맞추기)",
                "31-40초: 버튼(따뜻한 한 줄+짧은 숨/바람 사운드)",
                "마무리: 다음 테마 티저+댓글 유도(다음엔 어디로 걸을까?)"
            ],
            "caption_rules": [
                "1인칭 현재형 문장 사용(예: 지금, 우리는, 나는).",
                "10자 내외 짧은 문장 1~2줄, 화면 하단 중앙 고정.",
                "존댓말/반말 혼용 금지, 부드러운 구어체 반말 유지.",
                "직접 묘사보다 감각 단서(향, 바람, 온기) 위주.",
                "과장된 이모지/과다 이펙트 금지, 하트는 상황에 1개 이하.",
                "모든 표현은 성인/상호 존중/동의 어휘로 제한.",
                "브랜드/개인 정보 노출 금지, 장소는 일반화 표현 사용(동네 카페 등).",
                "자막과 오디오 대사는 95% 일치, 핵심 단어만 하이라이트(색상 1가지)."
            ],
            "images": [],
            "created_at": "2025-08-28T08:09:52.155319",
            "updated_at": "2025-08-28T08:09:52.155325"
        }
        // ... 추가 시리즈 생략
    ],
    "filters": {},
    "total_count": 5,
    "message": "Series retrieved successfully",
    "success": true
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
    "message": "No approved series found",
    "success": false
}
```

## 7. 캐릭터 목록 조회 API

### 요청
```http
GET /api/v1/characters
Authorization: Bearer {{access_token}}
```

### 성공 응답 (200)
```json
{
    "data": [
        {
            "id": 16,
            "name": "준호",
            "display_name": "준호",
            "slug": "준호",
            "role": "guest",
            "age": "28",
            "birthday": "1997-07-02",
            "appearance": "미니멀 블랙 앞치마, 헤어는 깔끔한 투블록, 얇은 은반지.",
            "personality": "친절한 안내자 스타일, 설명은 짧고 핵심만.",
            "residence": "서울 용산구 남영동 공유주택",
            "voice_gender": "male",
            "voice_keywords": [
                "따뜻한 바리톤",
                "짧고 명료",
                "차분한 매너",
                "미소가 들리는 톤"
            ],
            "behavior_notes": [
                "카메라를 손님으로 인식하고 정면 응대",
                "음료/공간에 대한 간단한 정보 제공",
                "브랜드 언급 없이 맛의 노트로 설명",
                "개인 정보 질문 지양, 대화는 가볍게"
            ],
            "example_lines": [
                "오늘 원두는 라즈베리 노트가 은은해요.",
                "뜨거우니까 뚜껑 살짝 열어두세요.",
                "조용한 좌석은 창가 쪽이 좋아요."
            ],
            "constraints": [
                "플러팅 참여 금지(호스트-시청자 관계 존중)",
                "상업적 홍보/브랜드명 직접 언급 금지",
                "개인 신상 캐묻기 금지"
            ],
            "features": "커피 내릴 때 집중하는 눈빛, 낮은 웃음소리, 손목 시계 습관적으로 확인.",
            "links_series_tone": [
                "현장성 강화용 현실감 보이스",
                "감각 디테일 보조, 과도한 존재감 지양"
            ],
            "series_id": 6,
            "images": [],
            "created_at": "2025-08-28T08:09:52.182561",
            "updated_at": "2025-08-28T08:09:52.182584"
        }
        // ... 추가 캐릭터 생략
    ],
    "filters": {},
    "total_count": 15,
    "message": "Characters retrieved successfully",
    "success": true
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
    "message": "No characters found",
    "success": false
}
```