# MindCraft AI Server

---

##  폴더 구조

### core
- 환경설정 및 공통 설정

### routers
- API 엔드포인트

### services
- AI 비즈니스 로직

### schemas
- 요청/응답 모델

### prompts
- LLM 프롬프트 템플릿

---

##  가상환경 설정

### 1. venv 생성

```bash
python -m venv venv
```

### 2. venv 활성화 (Windows)

```bash
venv\Scripts\activate
```

### 3. 패키지 설치

```bash
pip install -r requirements.txt
```

### 4. 서버 실행

```bash
uvicorn app.main:app --reload
```

##  실행 주소

- API Server : http://127.0.0.1:8000
- Swagger : http://127.0.0.1:8000/docs