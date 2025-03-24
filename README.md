# 📝 FE-memo-app

React JSX로 개발된 메모 애플리케이션입니다.  
백엔드와 통신하며 메모를 저장하고 불러올 수 있으며, 개인 서버를 활용한 배포 방식을 사용합니다.

---

## 🌟 주요 기능

✅ **메모 CRUD**: 메모 생성, 수정, 삭제, 조회 기능 제공  
✅ **주제별 메모 작성**: 주제별 메모를 기록하는 기능
✅ **실시간 동기화**: 백엔드와 연동하여 메모 상태 유지  
✅ **텍스트 편집기 지원**: Quill 에디터를 활용한 리치 텍스트 작성  
✅ **차트 시각화**: Chart.js를 활용하여 메모 사용 패턴을 분석  

---

## 👨‍💻 개발자 소개

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/67574367?s=150&v=4" alt="조승빈" width="150">
  <br>
  <strong>조승빈</strong>
  <br>
  Front End 개발
  <br>
  🔗 <a href="https://github.com/vkflco08">GitHub 프로필</a>
</div>

---

## 🚀 프로젝트 개요
- **프레임워크**: React (JSX)
- **배포 방식**: 개인 리눅스 서버에서 Jenkins를 활용하여 Nginx 컨테이너를 배포
- **백엔드**: Spring Boot
- **프론트엔드 개발 환경**: `React 18`, `react-scripts 5.0.1`
- **버전 관리**: GitHub

---

## 📌 사용된 라이브러리

### 📦 주요 라이브러리
| 라이브러리 | 버전 | 설명 |
|------------|------|------|
| `react` | 18.3.1 | React 라이브러리 |
| `react-dom` | 18.3.1 | React의 DOM 렌더링 |
| `react-router-dom` | 6.26.1 | React 라우팅 관리 |
| `axios` | 1.7.7 | HTTP 요청 처리 |
| `quill` | 2.0.2 | 리치 텍스트 에디터 |

### 📊 추가 라이브러리 (UI 및 기능)
| 라이브러리 | 버전 | 설명 |
|------------|------|------|
| `chart.js` | 4.4.6 | 데이터 시각화 차트 |
| `react-chartjs-2` | 5.2.0 | React용 Chart.js 래퍼 |
| `react-icons` | 5.4.0 | 아이콘 컴포넌트 |
| `react-dnd` | 16.0.1 | 드래그 앤 드롭 기능 |
| `react-dnd-html5-backend` | 16.0.1 | HTML5 DnD 백엔드 |

### 🔧 개발 환경 및 프록시 설정
| 라이브러리 | 버전 | 설명 |
|------------|------|------|
| `http-proxy-middleware` | 3.0.1 | 프록시 설정 |
| `env` | 0.0.2 | 환경 변수 관리 |

---

## 🚀 배포 방식
- GitHub 푸시: 코드 변경 사항을 GitHub에 푸시하면 Webhook이 작동합니다.
- Jenkins 실행: 개인 리눅스 서버의 Jenkins가 Webhook을 통해 빌드를 트리거합니다.
- Nginx 컨테이너 배포: Jenkins 스크립트에서 Nginx 컨테이너를 생성하여 최신 빌드를 배포합니다.
