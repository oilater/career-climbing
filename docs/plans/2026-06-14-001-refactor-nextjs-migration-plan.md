---
title: "refactor: Vite SPA → Next.js App Router 마이그레이션 (SEO 메타데이터 우선)"
type: refactor
status: active
date: 2026-06-14
---

# refactor: Vite SPA → Next.js App Router 마이그레이션 (SEO 메타데이터 우선)

## Summary

career-like-jazz(React + Vite client SPA 슬라이드 덱)를 Next.js App Router로 옮긴다. server `layout`/`page` 셸이 SEO 메타데이터·폰트·전역 CSS를 소유하고, 덱 본체는 `dynamic(ssr:false)` client island 하나로 마운트한다. 발표 콘텐츠·동작·hash 네비게이션·GSAP 애니메이션은 보존하며, SEO는 v1에서 메타데이터(OG/Twitter/JSON-LD Person)까지만 가져가고 전체 본문 SSR은 후속으로 미룬다.

---

## Problem Frame

이 앱은 "나를 소개하는 사이트"로 쓰여야 하므로 (1) 검색·링크 공유 시 제대로 된 제목·설명·미리보기가 떠야 하고 (2) 코드가 깔끔해야 한다. 현재는 순수 client SPA라 메타데이터/OG가 없고, Vite 설정 산출물(`vite.config.js`/`.d.ts`)이 커밋되는 등 정리되지 않은 부분이 있다. 동작은 이미 검증된 상태(직전 코드리뷰에서 SSR 블로커 P1 수정 완료)라 이 작업은 동작 변경이 아니라 인프라·SEO 토대 마련이다.

---

## Requirements

- R1. Vite 빌드/툴체인을 Next.js App Router로 교체하되 슬라이드 덱의 시각·인터랙션 동작을 100% 보존한다 (키보드/터치/엣지 네비, hash 동기화, GSAP 입장·플래시백·스텝 애니메이션, prefers-reduced-motion).
- R2. server 셸(`app/layout`/`app/page`)에서 SEO 메타데이터를 제공한다: title/description, OpenGraph, Twitter card, JSON-LD Person 스키마, 시맨틱 HTML.
- R3. 덱 본체는 단일 `"use client"` island로 두고, server는 메타데이터·폰트·전역 CSS만 소유한다.
- R4. 발표 콘텐츠/구조는 변경하지 않는다 (`slides.ts` 데이터 불변).
- R5. oxlint·oxfmt 워크플로를 유지하고, Vite 잔재(`vite.config.*`, `main.tsx`, `index.html`, `vite-env.d.ts`, project-reference tsconfig 분리)를 제거한다.
- R6. Vercel 배포가 Next 프리셋으로 정상 빌드·서빙된다.

---

## Scope Boundaries

- 발표 콘텐츠/구성 변경 (화면 분할, 위트, 흐름/요지 재구성) — 명시적 제외.
- Tailwind / shadcn 등 디자인 시스템 도입.
- 슬라이드별 URL 라우팅 / 딥링크 재설계 (hash 네비 유지).
- 테스트 러너(vitest) 도입 — 직전 리뷰의 별도 트랙.
- 로컬 이미지 미표시 이슈의 근본 진단 (U6에서 마이그레이션 중 재확인은 하되, 별도 디버깅 트랙).

### Deferred to Follow-Up Work

- **전체 본문 SSR (콘텐츠 색인용)**: 모든 슬라이드 텍스트를 server HTML에 렌더해 크롤러가 커리어 서사 전문을 색인하게 하는 작업. v1 출시 후 Search Console 색인 결과를 보고 필요 시 진행. v1의 `ssr:false` island 구조에서는 본문이 초기 HTML에 없으므로 이 작업이 본문 SEO의 레버가 됨.
- **next/font/local 폰트 최적화**: pretendard 변수 폰트를 repo로 복사해 `next/font/local`로 self-host (preload/no-CLS). v1은 기존 CSS import 유지.
- **next/image 도입**: 슬라이드 이미지 최적화.

---

## Context & Research

### Relevant Code and Patterns

- `src/main.tsx` — 진입점(`createRoot` + StrictMode + pretendard CSS import + `index.css`). → `app/layout.tsx` + `app/page.tsx`로 분해.
- `index.html` — `<html lang="ko">` + title. → root layout이 흡수 (Next가 charset/viewport 자동 주입).
- `src/App.tsx` — 덱 오케스트레이터(상태 index/step/showHud, 키보드/터치 핸들러, hash 동기화·초기화, preload, autoHideHud, toggleFullscreen). 이미 `typeof window` 가드 적용됨. → client island의 루트.
- `src/components/SlideView.tsx`, `BulletList.tsx`, `SplitChars.tsx`, `MountainBackdrop.tsx` — 프레젠테이션 컴포넌트. client 트리 안에 그대로 위치.
- `src/hooks/useSlideAnimations.ts` — GSAP `useLayoutEffect` 4종. `ssr:false`로 마운트되면 SSR useLayoutEffect 경고·하이드레이션 미스매치 회피.
- `src/hooks/useKeyboardNav.ts`, `src/reveal.ts`, `src/utils.ts`, `src/slides.ts`, `src/types/slide.ts` — 로직·데이터 불변. import 경로만 영향 가능.
- `tsconfig.json` + `tsconfig.node.json` — Vite용 project-reference 분리. Next에선 단일 tsconfig + `next-env.d.ts`로 대체.
- `vite.config.ts` (+ 커밋된 `vite.config.js`/`.d.ts` 산출물) — 제거 대상.

### External References

- [Migrating from Vite | Next.js](https://nextjs.org/docs/app/guides/migrating/from-vite) — 공식 가이드. 진입점 변환, `public/` 자산, `VITE_`→`NEXT_PUBLIC_`, SPA용 `app/[[...slug]]/page.tsx` catch-all + `dynamic(ssr:false)` 래퍼 패턴.
- [Upgrading: Version 16 | Next.js](https://nextjs.org/docs/app/guides/upgrading/version-16) — App Router가 React 19 요구. `create-next-app`이 React 19 스캐폴드. Node 20.9+/TS 5.1+ 최소. `next lint` 제거.
- [generateMetadata | Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — `metadata` export(server 전용), OG/Twitter 필드, `metadataBase`. viewport/themeColor는 별도 `viewport` export로 이동.
- [Font Module | Next.js](https://nextjs.org/docs/app/api-reference/components/font) — `next/font/local` 권장, 단 node_modules 직접 참조는 비권장(repo로 복사 필요).

---

## Key Technical Decisions

- **React 18 → 19 업그레이드를 마이그레이션에 포함한다.** Next 16 App Router는 React 19를 하드 요구(React 18 지원은 Next 14에서 종료). 대안인 Next 14 고정은 Turbopack 기본·`next.config.ts`·현행 metadata 스트리밍을 잃는 dead end. GSAP/`useLayoutEffect`/StrictMode 패턴은 19에서 그대로 동작하므로 리스크 낮음. (대안 비교는 아래 Alternatives 참조.)
- **덱은 `dynamic(() => import(...), { ssr: false })`로 client-only 마운트.** DOM 측정·GSAP 애니메이션 덱이라 SSR하면 `useLayoutEffect` 경고 + 애니메이션이 변형한 DOM과 하이드레이션 미스매치가 남. 공식 Vite 가이드도 동일 패턴. server `layout`/`page`는 그대로 SSR되어 메타데이터 제공. 단 `ssr:false`는 client wrapper에서 호출해야 함(server component 직접 불가).
- **SEO는 v1에서 메타데이터까지만.** `ssr:false` island라 본문은 초기 HTML에 없음 → 콘텐츠 색인은 0이지만 메타데이터/OG/JSON-LD SEO는 완전. 이름 검색·링크 공유 프리뷰가 1차 목표이므로 충분. 본문 색인은 Deferred(전체 본문 SSR)로.
- **JSON-LD Person 스키마는 server `layout`에 `<script type="application/ld+json">`로 직접 렌더.** Next 공식 권장 패턴(전용 API 없음).
- **폰트는 v1에서 기존 pretendard CSS import 유지.** `next/font/local`은 node_modules 직접 참조가 어색해 repo 복사가 필요 → 최적화 트랙으로 분리. CSS import는 Next layout에서 정상 동작.
- **단일 라우트 유지(`app/page.tsx`).** hash 네비를 client에서 그대로 쓰므로 catch-all(`[[...slug]]`)은 불필요. 가장 단순한 단일 page.
- **`output: 'export'` 미사용.** Vercel 배포라 기본 server 빌드가 단일 라우트를 정적 프리렌더하면서 metadata 스트리밍·OG 이미지 생성 여지를 남김.

---

## Open Questions

### Resolved During Planning

- SEO 깊이: 메타데이터 우선, 전체 본문 SSR은 후속 (사용자 확정).
- client 경계: server 셸 + 덱 단일 island (사용자 확정).
- Next 버전/React 버전: Next 16 + React 19 (리서치로 확정, 아래 Alternatives에 대안 기록).

### Deferred to Implementation

- pretendard CSS import 경로가 Next 빌드에서 그대로 해석되는지(node_modules CSS import) — U6에서 실제 확인.
- 로컬에서 이미지가 안 보이던 기존 이슈가 `public/` 자산 경로 차이 때문인지 — U6 마이그레이션 중 재현·확인.
- 패키지 매니저 정리: 현재 `package-lock.json` + `pnpm-lock.yaml` + `pnpm-workspace.yaml` 공존. 하나로 통일할지 U1에서 결정(현행 npm 스크립트 기준 npm 유지가 기본).

---

## Implementation Units

### U1. 의존성 교체 및 Next.js 스캐폴딩

**Goal:** Vite/React18 의존성을 Next 16 + React 19로 교체하고 npm 스크립트를 Next 기준으로 전환.

**Requirements:** R1, R5

**Dependencies:** None

**Files:**
- Modify: `package.json` (dependencies: `next` 추가, `react`/`react-dom` 19로, `gsap`·`pretendard` 유지; devDependencies: `vite`·`@vitejs/plugin-react` 제거, `@types/react`/`@types/react-dom` 19로; scripts: `dev`/`build`/`start`를 `next dev`/`next build`/`next start`로, `lint`/`format`/`format:check` 유지)
- Modify: `.gitignore` (`.next/`, `next-env.d.ts` 처리 추가; `dist` 제거 가능)

**Approach:**
- React 19 + react-dom 19로 올리고 GSAP는 버전 유지. `@gsap/react`(useGSAP) 도입은 선택 — 현행 수동 cleanup이 동작하면 추가 안 함(YAGNI).
- `next lint`는 v16에서 제거됨 → 기존 `oxlint`/`oxfmt` 스크립트 그대로 유지.
- 패키지 매니저: 현행 npm 기준 유지, 잉여 pnpm 락파일·workspace 정리 여부 확인.

**Verification:**
- `npm install` 성공, `next` 바이너리 사용 가능.
- React/react-dom이 19로, vite 의존성이 사라졌는지 lockfile에서 확인.

**Test scenarios:**
- Test expectation: none — 의존성/스크립트 변경, 동작은 후속 유닛에서 검증.

---

### U2. App Router 셸: server layout + page + client 마운트 래퍼

**Goal:** `index.html`+`main.tsx`를 `app/layout.tsx`(server) + `app/page.tsx`(server) + 덱을 `ssr:false`로 싣는 client 래퍼로 분해.

**Requirements:** R1, R3

**Dependencies:** U1

**Files:**
- Create: `app/layout.tsx` (server: `<html lang="ko">`/`<body>`, 전역 CSS·pretendard import, `metadata` export는 U4에서 채움)
- Create: `app/page.tsx` (server: 시맨틱 `<main>` 셸 + client 래퍼 마운트)
- Create: `app/deck-client.tsx` (`"use client"`: `dynamic(() => import("../src/App"), { ssr: false })`로 덱 마운트)
- Reference: `src/App.tsx` (덱 루트, 그대로 재사용)

**Approach:**
- root layout이 `index.html`의 역할을 흡수. Next가 charset/viewport 자동 주입하므로 해당 meta 제거. `lang="ko"` 보존.
- 전역 CSS(`src/index.css`)와 pretendard CSS는 layout에서 import.
- `ssr:false`는 server component에서 직접 호출 불가 → `app/deck-client.tsx`("use client")를 한 단계 두고 거기서 `dynamic` 호출.
- `src/App.tsx`는 위치·내용 유지(또는 `app/`로 이동은 선택). import 경로만 정합.

**Patterns to follow:**
- 공식 Vite→Next 가이드의 `client.tsx` + `dynamic(ssr:false)` 래퍼 구조.

**Test scenarios:**
- Happy path: `next dev` 기동 후 첫 슬라이드가 렌더되고, ←/→·스페이스·터치 스와이프·엣지 클릭 네비가 동작.
- Happy path: GSAP 입장 애니메이션이 슬라이드 전환마다 재생되고, 플래시백 슬라이드 진입·역방향 탐색이 정상.
- Edge case: prefers-reduced-motion ON일 때 애니메이션 생략되고 콘텐츠 즉시 표시.
- Integration: hash(`#3`)로 진입 시 해당 슬라이드에서 시작(client 초기화), 네비 시 `window.location.hash` 동기화.

**Verification:**
- 마이그레이션 전(Vite preview) 대비 시각·인터랙션 동작 패리티. 콘솔에 `useLayoutEffect` SSR 경고·하이드레이션 미스매치 없음.

---

### U3. 덱 client island 정합 및 SSR 안전성 확인

**Goal:** `src/App.tsx` 이하 트리가 Next client 컨텍스트에서 안전하게 동작하도록 `window`/`document` 접근과 import 경로를 정합.

**Requirements:** R1, R3

**Dependencies:** U2

**Files:**
- Modify: `src/App.tsx` (필요 시 `"use client"` 지시자 — 단, `dynamic(ssr:false)` 래퍼가 client 경계를 이미 만들면 불필요할 수 있음; 실제 빌드로 확인)
- Reference: `src/hooks/useSlideAnimations.ts`, `src/hooks/useKeyboardNav.ts`, `src/utils.ts`

**Approach:**
- 이미 적용된 가드 확인: `App.tsx`의 `useState` 초기화 `typeof window` 가드, `prefersReducedMotion`의 `MediaQueryList` 캐싱(모듈 로드시 `typeof window` 분기), `toggleFullscreen`의 `document` 접근(useCallback 내부).
- `ssr:false`로 덱이 client-only면 위 가드들은 안전망으로 남고 추가 변경 최소.
- import 경로(`./components/...`, `../utils` 등) Next 빌드에서 해석되는지 확인. 필요 시 tsconfig `paths` 또는 상대경로 유지.

**Test scenarios:**
- Happy path: 풀스크린 토글(F 키)이 동작하고 SSR 경로에서 throw 없음.
- Edge case: hash 없이 진입 시 0번 슬라이드, 잘못된 hash(`#abc`, `#999`)는 안전하게 0/마지막으로 클램프.
- Integration: 이미지 preload(`new Image()`)가 client에서만 실행되고 server에서 실행 안 됨.

**Verification:**
- `next build` 타입체크·빌드 통과. dev/prod 양쪽에서 런타임 에러 없음.

---

### U4. SEO 메타데이터 레이어

**Goal:** server 셸에 title/description, OpenGraph, Twitter card, JSON-LD Person, 파일 컨벤션 SEO 자산을 추가.

**Requirements:** R2

**Dependencies:** U2

**Files:**
- Modify: `app/layout.tsx` (`metadata` export: title/description/`metadataBase`/openGraph/twitter; `viewport` export; JSON-LD Person `<script>`)
- Create: `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` (파일 컨벤션)
- Create: `app/opengraph-image.*` 또는 `public/`의 정적 OG 이미지 (소셜 프리뷰)
- Create: `app/icon.png` / `app/favicon.ico` (기존 없으면)

**Approach:**
- `metadataBase`를 배포 도메인(`climbing.oilater.com`)으로 설정해 상대 OG 경로 해석.
- OG: title, description, url, siteName, images[], locale `ko_KR`, type `website`. Twitter: `summary_large_image`.
- JSON-LD `Person` 스키마(이름, 직함=Frontend Engineer, 사이트 URL) — server layout에 직접 렌더.
- viewport/themeColor는 metadata 객체가 아니라 별도 `viewport` export(현행 Next 규칙).

**Test scenarios:**
- Happy path: 빌드된 HTML `<head>`에 title·description·OG·twitter 메타 존재.
- Happy path: JSON-LD `<script type="application/ld+json">`가 유효한 Person 스키마로 렌더(구조화 데이터 검증 통과).
- Edge case: OG 이미지 URL이 절대경로로 해석됨(`metadataBase` 적용 확인).
- Integration: `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`가 200으로 서빙.

**Verification:**
- 페이지 소스 보기에서 메타데이터·JSON-LD 확인. 소셜 디버거(또는 수동 OG 파싱)에서 프리뷰 정상.

---

### U5. tsconfig·설정 정리 및 Vite 잔재 제거

**Goal:** Next용 tsconfig·`next.config.ts`로 정리하고 Vite 산출물·진입 파일을 삭제.

**Requirements:** R5

**Dependencies:** U1, U2

**Files:**
- Create: `next.config.ts` (최소 설정; `output:'export'` 미사용)
- Modify: `tsconfig.json` (Next 플러그인 `{ "name": "next" }`, `next-env.d.ts` include, `jsx: preserve`/Next 권장값, `paths` 필요 시; project-reference 제거)
- Delete: `vite.config.ts`, `vite.config.js`, `vite.config.d.ts`, `tsconfig.node.json`, `tsconfig.node.tsbuildinfo`, `tsconfig.tsbuildinfo`, `src/main.tsx`, `index.html`, `src/vite-env.d.ts`
- Modify: `.gitignore` (`.next/` 추가)

**Approach:**
- 커밋돼 있던 `vite.config.js`/`.d.ts`(composite 프로젝트 emit 산출물)도 함께 제거 — 마이그레이션으로 project-reference 분리 자체가 사라지므로 재발 안 함.
- `next-env.d.ts`는 Next가 생성, git에 커밋(공식 권장).

**Test scenarios:**
- Test expectation: none — 설정/파일 정리. 동작 검증은 U2/U3의 빌드·런타임 통과로 갈음.

**Verification:**
- `git status`에 Vite 잔재 없음. `next build` 성공. oxlint/oxfmt 그대로 통과.

---

### U6. 자산·폰트 정합 및 로컬 이미지 이슈 재확인

**Goal:** `public/` 자산과 pretendard 폰트 CSS가 Next에서 정상 서빙·로드되는지 확인하고, 기존 로컬 이미지 미표시 이슈를 마이그레이션 맥락에서 재현·확인.

**Requirements:** R1, R4

**Dependencies:** U2

**Files:**
- Reference: `public/` (슬라이드 이미지·비디오 자산)
- Reference: `src/slides.ts` (자산 URL 참조 — 데이터는 불변)
- Modify (필요 시): `app/layout.tsx`의 pretendard CSS import 경로

**Approach:**
- Next도 `public/`를 루트(`/file.ext`)로 서빙 → `slides.ts`의 절대경로 참조가 그대로 동작하는지 확인.
- pretendard `node_modules` CSS import가 Next에서 해석되는지 확인(안 되면 폰트 CSS를 repo로 복사 — 단 이는 Deferred next/font 트랙과 연결).
- 기존 "로컬에서 이미지 안 보임" 이슈가 경로/base 차이였는지 이 시점에 확인. 근본 원인이 마이그레이션과 무관하면 별도 트랙으로 기록.

**Test scenarios:**
- Happy path: 이미지·비디오 슬라이드가 dev·prod 빌드에서 모두 표시.
- Edge case: query string 포함 비디오 URL(`isVideoUrl` 정규식 직전 수정분)이 올바르게 비디오로 분류.
- Integration: pretendard 폰트가 적용된 상태로 텍스트 렌더(FOUT/폰트 누락 없음).

**Verification:**
- 전체 슬라이드를 훑어 누락된 자산·깨진 폰트 없음.

---

### U7. Vercel 배포 정합 및 패리티 검증

**Goal:** Vercel 프로젝트를 Next 프리셋으로 빌드·서빙하고, 마이그레이션 전후 동작 패리티를 최종 확인.

**Requirements:** R6, R1

**Dependencies:** U1–U6

**Files:**
- Reference: Vercel 프로젝트 설정(프레임워크 프리셋 Vite→Next, 빌드 커맨드/출력 자동 감지)
- Modify (있다면): `vercel.json` — 대개 불필요

**Approach:**
- Vercel은 Next를 자동 감지 → 별도 빌드 커맨드 불필요. 기존 Vite 프리셋/출력 디렉토리 설정이 있으면 제거.
- 환경변수: 현재 `VITE_*` 사용처 있으면 `NEXT_PUBLIC_*`로 전환(없을 가능성 높음 — 확인).
- 프리뷰 배포에서 메타데이터·OG·동작 확인 후 프로덕션.

**Test scenarios:**
- Happy path: Vercel 프리뷰 빌드 성공, `climbing.oilater.com`(또는 프리뷰 URL)에서 덱 정상 동작.
- Integration: 배포 HTML에 U4의 메타데이터·JSON-LD 포함, OG 프리뷰 정상.
- Edge case: 직접 hash URL(`/#5`) 진입이 배포 환경에서도 해당 슬라이드로.

**Verification:**
- 프로덕션 배포 후 데스크톱·모바일에서 네비·애니메이션·폰트·이미지·메타데이터 전부 패리티.

---

## System-Wide Impact

- **Interaction graph:** 진입점(`main.tsx`→`app/layout`+`app/page`+`deck-client`)만 교체. 덱 내부 컴포넌트·훅·로직은 불변.
- **State lifecycle risks:** `ssr:false`로 덱이 client-only가 되므로 server/client 상태 불일치 없음. StrictMode dev 더블 마운트에서 GSAP cleanup 동작 재확인(현행 `tl.revert()`/`tween.revert()` + 직전 추가한 flashback `cancelled` 가드).
- **API surface parity:** 외부 API 없음(정적 사이트). 메타데이터는 순수 추가.
- **Unchanged invariants:** `slides.ts` 데이터, `reveal.ts`/`utils.ts` 순수 함수, 키보드/터치 네비 동작, hash 네비, GSAP 애니메이션 시퀀스는 변경하지 않음.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| React 18→19 업그레이드가 GSAP/StrictMode 동작에 영향 | 패턴은 19 호환 확인됨. U2/U3에서 dev(StrictMode 더블마운트)·prod 양쪽 애니메이션 패리티 검증 |
| `ssr:false` island라 본문이 HTML에 없어 콘텐츠 SEO 0 | v1 목표는 메타데이터/OG/JSON-LD SEO. 본문 색인은 Deferred(전체 본문 SSR)로 명시, Search Console 결과 기반 판단 |
| pretendard CSS의 node_modules import가 Next 빌드에서 실패 | U6에서 확인, 실패 시 폰트 파일 repo 복사(next/font 트랙) |
| 커밋된 Vite 산출물·잉여 락파일 정리 누락 | U5에서 명시적 삭제 + `git status`로 잔재 확인 |
| 기존 로컬 이미지 미표시 이슈가 마이그레이션과 얽힘 | U6에서 재현·격리. 무관하면 별도 디버깅 트랙으로 분리 |

---

## Alternative Approaches Considered

- **Next 14 + React 18 유지**: React 18 핀을 지키려 App Router가 React 18을 지원하는 마지막 라인(Next 14)으로 고정. 거부 — 2026 기준 낡았고 Turbopack 기본·`next.config.ts`·현행 metadata 스트리밍을 잃음. React 19 업그레이드가 더 적은 장기 부채.
- **덱을 SSR하는 client component(ssr:false 없이)**: 0번 슬라이드 본문이 초기 HTML에 들어와 약간의 콘텐츠 SEO 획득. 거부(v1) — DOM 측정/애니메이션 덱이라 `useLayoutEffect` SSR 경고 + 하이드레이션 미스매치를 mounted 가드로 싸매야 해 코드가 지저분. 본문 SEO는 Deferred의 "전체 본문 SSR"이 더 깔끔한 레버.
- **전체 본문 SSR을 v1에 포함**: 모든 슬라이드를 server 렌더 + visibility 토글. 거부(v1) — `key` 기반 per-slide mount + GSAP 모델 재설계 필요, 관객 1명 덱엔 과투자. 후속으로.

---

## Sources & References

- Origin: 직전 코드리뷰 문서 `docs/code-review-2026-06-14.md` (Next.js 마이그레이션 메모, P1 SSR 수정 내역)
- 공식 가이드: https://nextjs.org/docs/app/guides/migrating/from-vite
- v16 업그레이드: https://nextjs.org/docs/app/guides/upgrading/version-16
- 메타데이터 API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- 폰트: https://nextjs.org/docs/app/api-reference/components/font
