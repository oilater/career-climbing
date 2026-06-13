import { Slide } from "./types/slide";

export const slides: Slide[] = [
  {
    id: "cover",
    layout: "cover",
    eyebrow: "함수랑산악회",
    title: "주니어 개발자의 커리어 등반기",
    subtitle: "김성현\nFrontend Engineer",
    notes: "인사 + 주제 한 줄. '커리어를 등반에 빗대어 풀어보겠습니다.' 긴장 풀고 천천히 시작.",
  },
  {
    id: "intro",
    layout: "body",
    eyebrow: "발표자 소개",
    title: "김성현",
    notes: "1년 좀 넘은 프론트엔드 / 산악회 1기 클라이머. 클라이밍 사진 가리키며 가볍게.",
    image: "/images/climbing.jpg",
    imagePosition: "right",
    bullets: [
      "2년차 프론트엔드 개발자",
      "함수랑산악회 1기 클라이머",
    ],
    revealAll: true
  },
  {
    id: "why",
    layout: "body",
    title: "목차",
    notes: "오늘 다섯 꼭지. 흐름만 짚고 빠르게 넘기기.",
    bullets: [
      "간단한 소개",
      "방향 찾기",
      "시야 넓히기",
      "커리어에 대한 오해",
      "앞으로 하고 싶은 것",
    ],
    revealAll: true
  },

  {
    id: "part-1",
    layout: "section",
    eyebrow: "Part 1.",
    title: "소개합니다",
    notes: "전환: 먼저 제가 어떤 사람인지부터.",
  },

  {
    id: "before",
    layout: "body",
    title: "간단 소개",
    notes: "신학과 졸업 → (무교, 웃음 포인트) → 7년 공백 → '좋아하는 일이 뭘까' → SSAFY 입과. 한 컷씩.",
    bullets: [
      { text: "신학과 졸업 (무교)", clearMedia: true },
      { text: "날려버린 7년", image: "/images/break.jpg" },
      { text: "내가 좋아하는 일은 뭘까?", clearMedia: true },
      { text: "SSAFY 입과", clearMedia: true },
    ],
  },

  {
    id: "first-company-story",
    layout: "body",
    title: "구스랩스",
    notes: "Unity 운동앱(거위·아바타 영상으로 웃기기) → merge 영상 → 밀착 코드리뷰로 협업 배움 → 서비스 종료 → '게임은 멀리서 볼 때 아름답다'(농담으로 마무리).",
    bullets: [
      { text: "Unity 개발", media: ["/videos/avatar-move.gif", "/images/goose1.jpg" ] },
      { text: "코드 리뷰, 협업", media: ["/images/code-review.webp", "/videos/run-to-merge.webm"] },
      { text: "서비스 종료", image: "/images/broke-up.webp" },
      { text: "게임은 멀리서 볼 때 가장 아름답다", clearMedia: true, },
    ],
  },
  {
    id: "part-2",
    layout: "section",
    eyebrow: "Part 2.",
    title: "방향 찾기",
    notes: "전환: 이제 방향을 찾기 시작.",
  },

  {
    id: "first-company-story",
    layout: "body",
    title: "다시 Web으로",
    notes: "지원 다 떨어짐 → 판교 예쁜 카페(여기서 '웃어라' 톤으로 띄우기) → 납치 농담.",
    bullets: [
      { text: "지원내역", image: "/images/fail.jpg" },
      { text: "판교의 이쁜 카페들", image: "/images/pangyo-cafe.webp" },
      { text: "(다행이야 납치될 뻔 했네)" },
    ],
  },

  {
    id: "ssafy-popular",
    layout: "body",
    title: "Web 기억을 되살려보면",
    notes: "SSAFY 땐 퍼블리싱 잘했고 수상도 했지만, 막상 이력서에 쓸 게 없더라.",
    bullets: [
      "SSAFY 때 퍼블리싱은 잘했음",
      "3번의 수상 (전공반 최우수상, 2학기 우수상 2번)",
      { text: "근데 이력서에 쓸 게 아무것도 없다", image: "/images/resume.jpg" },
    ],
  },
  {
    id: "steps",
    layout: "body",
    title: "매일 했던 생각들",
    notes: "매일 한 고민들. 마지막에 검정화면으로 전환되며 '재즈 배우던 시절' 회상으로 자연스럽게 넘어감(자동 전환).",
    bullets: [
      "진짜 성장하고 싶다",
      "누가 좀 알려줬으면 좋겠다",
      "취업은 대체 어떻게 하는 걸까?",
    ],
    flashback: {
      title: "재즈 배우던 시절",
      video: "/videos/jazz.webm",
      lastBullet: "대체 어떻게 성공할까?",
    },
  },
  {
    id: "jazz-lesson",
    layout: "body",
    title: "Idea. 당시에 느낀 것",
    notes: "재즈 배우며 느낀 4가지. 이게 커리어에도 그대로 적용됐다 — 다음부터 Problem→Solution으로 하나씩 풀어감.",
    bullets: [
      "절대적인 양이 필요하다",
      "잘 치는 사람을 무작정 따라하면 길을 잃는다",
      "큰 문제는 잘게 쪼개자",
      "답은 생각치 못한 곳에 있을수도",
      {
        text: "성장은 계단식이다. 조급하지 말자",
      },
    ],
  },
  {
    id: "steps",
    layout: "body",
    title: "자기객관화",
    notes: "해결: 자기객관화. 나에게 솔직해지기. '회사 가면 잘할 수 있는데?'라는 착각 버리기.",
    bullets: [
      "솔직히 회사 가면 나도 잘할 수 있는데?",
      "뭘 알고 있다고 생각하지 말자",
    ],
  },
  {
    id: "apply",
    layout: "body",
    title: "지원 많이 하기",
    notes: "해결: 일단 많이 지원. 서류 다 떨어지면 이력서 문제, 과제·면접에서 떨어지면 뭘 공부할지 명확해짐.",
    bullets: [
      "서류 100개 넣으면 다 떨어진다? - 이력서 문제",
      "과제와 면접에 떨어진다? - 어떤 걸 공부해야 할 지 명확해짐",
    ],
    revealAll: true,
  },
  {
    id: "apply",
    layout: "body",
    title: "다른 사람들 만나기",
    notes: "해결: 사람 만나기. 실음과 앙상블에서 '넌 스윙 안 한다'는 피드백 → 링크드인·테오콘·산악회 네트워킹.",
    bullets: [
      "실음과 학생들과의 재즈 앙상블",
      "너는 전혀 스윙하고 있지 않아",
      "링크드인, 테오콘, 함수랑산악회 등 네트워킹",
    ],
    revealAll: true,
  },
  {
    id: "part-2",
    layout: "section",
    eyebrow: "Part 2.",
    title: "시야 넓히기",
    notes: "전환: 시야를 넓히던 시기.",
  },
  {
    id: "quit-series",
    layout: "body",
    title: "성능을 개선하고 싶다",
    notes: "애니메이션 라이브러리 만들다 3중 for문, Lighthouse 경고 봐도 모름. (오른쪽 루프 영상)",
    video: "/videos/animation.webm",
    videoMode: "loop",
    videoPosition: "right",
    bullets: [
      "텍스트 애니메이션 라이브러리",
      "3중 for문...",
      "Lighthouse 경고 봐도 모르겠음"
    ],
  },

  {
    id: "steps",
    layout: "body",
    notes: "무작정 '무료로 개선해드린다' 글 올림 → 피드백 받음. (이미지 한 장씩)",
    images: ["/images/performance.webp"],
    imagesMode: "step",
    imagesLarge: true,
  },
  {
    id: "steps",
    layout: "body",
    notes: "무작정 '무료로 개선해드린다' 글 올림 → 피드백 받음. (이미지 한 장씩)",
    images: ["/images/help.jpg"],
    imagesMode: "step",
    imagesLarge: true,
  },
  {
    id: "steps",
    layout: "body",
    notes: "무작정 '무료로 개선해드린다' 글 올림 → 피드백 받음. (이미지 한 장씩)",
    images: ["/images/mail.jpg", "/images/feedback.jpg"],
    imagesMode: "step",
    imagesLarge: true,
  },
  

  {
    id: "steps",
    layout: "body",
    notes: "그 인연으로 Deep Dive 책 베타리더 제안을 받음.",
    images: ["/images/proposal.jpg"],
    imagesMode: "step",
    imagesLarge: true,
  },
  
  {
    id: "steps",
    layout: "body",
    notes: "베타리딩 후기/리뷰.",
    images: ["/images/book-review.webp"],
    imagesLarge: true,
  },
  {
    id: "steps",
    layout: "body",
    notes: "디벨로퍼스",
    images: ["/images/kakao.webp"],
    imagesMode: "step",
    imagesLarge: true,
  },

  {
    id: "company-1",
    layout: "body",
    title: "베타 리딩을 통해 배운 것",
    notes: "웹 시야 넓어짐. 화려한 애니메이션보다 JS 없이도 보이는 것, 리소스를 적절한 시점에, 귀찮으면 자동화.",
    bullets: [
      "웹 개발에 대한 시야가 좀 더 넓어짐",
      "화려한 애니메이션보단 자바스크립트 없이도 내용이 보이는 것",
      "결국 리소스를 적절한 시점에 불러오는 것(당기거나 늦추거나)",
      "귀찮으니까 자동화하자",
    ],
  },
  
  {
    id: "company-1",
    layout: "body",
    title: "전공자 따라잡기",
    notes: "산악회 1기, 방통대 컴공 편입, 정처기·SQLD, 한 달 반은 스터디카페.",
    bullets: [
      "함수랑산악회 1기",
      "방통대 컴퓨터과학과 편입",
      "정보처리기사, SQLD",
      "한 달의 반 이상은 스터디 카페",
    ],
  },

  {
    id: "part-3",
    layout: "section",
    eyebrow: "Part 3.",
    title: "커리어에 대한 오해",
    notes: "전환: 여기서부터 커리어에 대한 오해 이야기.",
  },

  {
    id: "company-2",
    layout: "body",
    title: "6개월 만의 깡퇴사",
    notes: "스트레스 + 공부할수록 더 나은 곳 가고 싶어 6개월 만에 퇴사. 1년 못 채움.",
    bullets: [
      "스트레스",
      "열심히 공부할수록 빨리 더 나은 곳에 가고 싶었음",
      "커리어는 걱정되지만 1년은 못 다니겠다",
    ],
    revealAll: true,
  },

  {
    id: "after-quit",
    layout: "body",
    title: "퇴사 당시 마음가짐",
    notes: "이번엔 아무데나 말고 정말 가고 싶은 곳에만 지원하자고 다짐.",
    image: "/images/icandoit.jpg",
    imagePosition: "right",
    bullets: [
      "이번엔 불안해도 아무데나 가지말고, 정말 가고 싶은 곳에 지원하자",
    ],
  },

  {
    id: "after-quit",
    layout: "body",
    title: "현실",
    notes: "현실은 — 이대로 1~2년 공부해도 취업 안 되겠다. 2주 행복 후 불안, 돈은 새고, 채용 프로세스도 변함.",
    image: "/images/fail.jpg",
    imagePosition: "right",
    bullets: [
      "이대로 1-2년을 공부해도 취업 못하겠다",
      "2주간 행복함",
      "숨 쉬면 나가는 돈, 오히려 막 쓰게 됨",
      "기존의 취업 고민 + 커리어 고민 추가",
      "달라지는 채용 프로세스",
    ],
  },

  {
    id: "new-company",
    layout: "body",
    title: "배운 것",
    notes: "개인 활동은 커리어가 아니다. 애정 갖고 만들 회사로 가자. → '경력이 커리어다' 강조.",
    bullets: [
      "개인 활동은 커리어가 아니다",
      "애정을 갖고 만들 수 있는 회사에 가자",
    ],
    emphasize: "경력이 커리어다",
  },

  {
    id: "part-4",
    layout: "section",
    eyebrow: "Part 4.",
    title: "앞으로 할 일",
    notes: "전환: 지금 회사에서, 앞으로 할 일.",
  },


  {
    id: "new-company-lesson-1",
    layout: "body",
    title: "근무태도",
    notes: "일찍 자고 일찍 출근. '회사에 뭐가 도움이 될까' 먼저 생각.",
    bullets: [
      "일찍 자고, 일찍 출근하기",
      "회사에 뭐가 도움이 될까?",
    ],
    revealAll: true,
  },

  {
    id: "new-company-lesson-2",
    layout: "body",
    title: "회사는 사회생활",
    notes: "무작정 개선보다 팀 관심사 먼저. 회사는 일하러 오는 곳. 사람마다 성격 다름.",
    bullets: [
      "무작정 개선보단 팀의 관심사 찾기",
      "회사는 일하러 오는 곳",
      "사람마다 성격이 다름",
    ],
  },

  {
    id: "future",
    layout: "body",
    title: "고민하고 있는 것",
    notes: "그냥 넘긴 것들, 엣지케이스, 프론트엔드의 한계 — 요즘 하는 고민.",
    bullets: [
      "그냥 넘긴 것들", 
      "엣지 케이스 잘 고려하기", 
      "프론트엔드의 한계?"
    ],
  },

  {
    id: "outro",
    layout: "body",
    title: "마치며",
    notes: "화면을 넘어서 / '한 번 치면 이상한 음, 두 번 치면 재즈' / 오점도 덮고 버티면 커리어가 된다.",
    bullets: [
      "화면을 넘어서",
      "청소하자",
      "한 번 치면 이상한 음, 두 번 치면 재즈",
      "커리어의 오점 덮기, 버티기"
    ],
  },
  {
    id: "outro-end",
    layout: "section",
    title: "기대된다",
    notes: "앞으로가 기대된다 — 힘줘서 마무리.",
  },
    {
    id: "qna",
    layout: "section",
    title: "Q&A",
    notes: "질문 받기.",
  },
  {
    id: "thanks",
    layout: "closing",
    title: "감사합니다!",
    body: "발표 자료는 함수랑산악회 노션을 통해 확인하실 수 있습니다.",
    subtitle: "함바! 👋",
    notes: "감사 인사. 자료는 산악회 노션. '함바!'",
  },
];
