# AGENTS.md

## 프로젝트 개요

물리학 2 대표문항/풀이 안내 사이트. 물리학 1 사이트(https://snu-eng-physics1-problem.netlify.app/)의 UI를
그대로 재현한 단일 정적 HTML 페이지입니다. 빌드 도구나 프레임워크 없이 `index.html` 하나로 구성됩니다.

## 구조

- `index.html` — 전체 UI. `#main-view`(단원 카드 그리드)와 `#detail-view`(단원 상세) 두 개의 뷰를
  JS로 토글하며 History API로 브라우저 뒤로/앞으로 가기와 동기화합니다(별도 URL 라우팅 없음).
  상세 진입은 `pushState`, 화면 복원은 `popstate`로 처리하며 내부 뒤로 가기도 `history.back()`을 사용합니다.
  모든 단원 데이터는 `<script>` 내부의 `data` 객체에
  하드코딩되어 있습니다.
- `img/` — 교재 표지 등 정적 이미지. GitHub Pages의 저장소 하위 경로에서도 작동하도록
  `img/<file>` 형태의 상대 경로로 참조합니다. Netlify 전용 Image CDN 주소는 사용하지 않습니다.
- `downloads/` — 단원별 "팁 및 해설 다운로드" PDF. 파일명은 `할리데이 <장 범위> 팁 및 해설.pdf` 규칙을
  따릅니다.
- `netlify.toml` — `publish = "."`만 지정. 별도 빌드 커맨드 없음.
- `.github/workflows/pages.yml` — `main` 변경 시 `index.html`, `img/`, `downloads/`만 GitHub Pages에 배포.
  작업용 `tmp/`, `output/`, 스크립트, 문서는 배포 산출물에 포함하지 않습니다.

## 데이터 갱신 방법 (가장 중요)

`index.html`의 `data` 객체 안에 있는 각 단원(1~7)의 `title`(영문 단원명), `problems`(장별 문항 번호),
`files`(다운로드 파일 경로/이름)를 수정하면 됩니다. 새 단원을 추가하려면:

1. `.chapter-grid` 안에 `<div class="chapter-card" onclick="showDetail(N)">` 카드 추가
2. `data` 객체에 동일한 키 `N`으로 항목 추가
3. `downloads/`에 대응하는 PDF 배치

## 컨벤션

- 모든 단원 명칭(챕터 타이틀)은 영문으로 표기합니다(예: "21. Electric Charge ~ 23. Gauss' Law"). 안내
  문구·라벨 등 나머지 텍스트는 한국어입니다.
- 다운로드 버튼 라벨은 항상 "팁 및 해설 다운로드" 하나로 통일합니다(팁/정답을 분리한 버튼을 만들지 않음).
- 교재명 표기는 "일반물리학 2 - 11판 (한글판) / Fundamentals of Physics (11th ed.)"로 고정합니다.
  표지는 한글판 11판 2권(II) 이미지를 사용합니다.

## 현재 상태

`할리데이_물2_통합본.zip`의 PDF 7개와 21~40장 문항 번호를 반영했습니다.
사용자 요청으로 21~23장 PDF의 21장 20번 안내 문구를 삭제했으며, 사이트의 문항 목록에서도 제외했습니다.
사이트에서 PDF 쪽수 안내는 표시하지 않습니다. 상세 내역과 배포 방법은 `README.md`를 참고하세요.
