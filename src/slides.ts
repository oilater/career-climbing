import { Slide } from "./types/slide";

export const slides: Slide[] = [
  {
    id: "cover",
    layout: "cover",
    eyebrow: "함수랑산악회",
    title: "주니어 개발자의 커리어 등반기",
    subtitle: "김성현\nFrontend Engineer",
  },
  {
    id: "intro",
    layout: "body",
    eyebrow: "발표자 소개",
    title: "김성현",
    image: "/images/climbing.jpg",
    imagePosition: "right",
    bullets: [
      "트리플오스 Frontend Engineer",
      "함수랑산악회 1기 클라이머",
    ],
    revealAll: true
  },
  {
    id: "why",
    layout: "body",
    title: "목차",
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
    title: "저를 소개합니다",
  },

  {
    id: "before",
    layout: "body",
    title: "신학과 졸업",
    bullets: [
      { text: "무교", image: "/images/mugyo.webp" },
      { text: "7년", image: "/images/break.jpg" },
      { text: "내가 좋아하는 일은 뭘까", image: "/images/ssen.webp" },
      { text: "SSAFY 입과", image: "/images/ssafy.webp" },
    ],
  },

  {
    id: "first-company-story",
    layout: "body",
    title: "첫 회사",
    bullets: [
      { text: "Unity로 운동 앱 개발", image: "/images/goose1.jpg" },
      { text: "넌 못 지나간다", video: "/videos/run-to-merge.webm" },
      { text: "밀착 코드 리뷰, 협업하는 방법", image: "/images/code-review.webp" },
      { text: "서비스 종료", image: "/images/broke-up.webp" },
      { text: "게임은 멀리서 볼 때 가장 아름답다" },
    ],
  },
  {
    id: "part-2",
    layout: "section",
    eyebrow: "Part 2.",
    title: "방향 찾기",
  },

  {
    id: "first-company-story",
    layout: "body",
    title: "취업은 해야지",
    bullets: [
      { text: "지원내역", image: "/images/fail.jpg" },
      { text: "판교의 이쁜 카페", image: "/images/pangyo-cafe.webp" },
      { text: "(다행이야 납치될 뻔 했네)" },
    ],
  },

  {
    id: "ssafy-popular",
    layout: "body",
    title: "Web 기억을 되살려보면",
    bullets: [
      "SSAFY 때 퍼블리싱은 잘했음",
      "3번의 수상 (전공반 최우수상, 2학기 우수상 2번)",
      "근데 이력서에 쓸 게 아무것도 없다",
    ],
  },
  {
    id: "steps",
    layout: "body",
    title: "매일 했던 생각들",
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
    bullets: [
      "잘 치는 사람을 무작정 따라하면 길을 잃는다",
      "큰 문제는 잘게 쪼개자",
      "답은 생각치 못한 곳에 있을수도",
      {
        text: "성장은 계단식이다. 조급하지 말자",
      },
    ],
  },
  {
    id: "idea-1",
    layout: "body",
    title: "Problem. 잘 치는 사람을 무작정 따라하면 길을 잃는다",
    bullets: [
      "나도 이렇게 잘 치고 싶다",
      "별로 의미 없는 시간",
    ],
  },
  {
    id: "steps",
    layout: "body",
    title: "Solution 1. 자기객관화",
    bullets: [
      "나에게 솔직하기",
      "단계별 성장을 즐기자",
    ],
  },

  {
    id: "idea-2",
    layout: "body",
    title: "Idea. 큰 문제는 잘게 쪼개자",
  },
  {
    id: "apply",
    layout: "body",
    title: "Solution 2. 지원 많이 하기",
    bullets: [
      "서류 100개 넣으면 다 떨어진다? - 이력서 문제",
      "과제와 면접에 떨어진다? - 어떤 걸 공부해야 할 지 명확해짐",
    ],
    revealAll: true,
  },

  {
    id: "apply",
    layout: "body",
    title: "Solution 3. 다른 사람들 만나기",
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
  },
  {
    id: "quit-series",
    layout: "body",
    title: "성능을 개선하고 싶다",
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
    title: "무료로 성능 개선 해드립니다!",
    images: ["/images/help.jpg", "/images/feedback.jpg"],
    imagesPosition: "right",
    imagesMode: "step",
  },

  {
    id: "steps",
    layout: "body",
    title: "Deep Dive 베타리더 제안",
    images: ["/images/proposal.jpg"],
    imagesPosition: "right",
  },

  {
    id: "steps",
    layout: "body",
    title: "Deep Dive 베타리더 제안",
    images: ["/images/book-review.webp"],
    imagesPosition: "right",
  },


  {
    id: "company-1",
    layout: "body",
    title: "베타 리딩을 통해 배운 것",
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
  },

  {
    id: "company-2",
    layout: "body",
    title: "6개월 만의 깡퇴사",
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
  },


  {
    id: "new-company-lesson-1",
    layout: "body",
    title: "근무태도",
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
    bullets: [
      "한 번 치면 이상한 음, 두 번 치면 재즈",
      "커리어의 오점 덮기, 버티기"
    ],
  },
  {
    id: "outro-end",
    layout: "section",
    title: "기대된다",
  },
    {
    id: "qna",
    layout: "section",
    title: "Q&A",
  },
  {
    id: "thanks",
    layout: "closing",
    title: "감사합니다!",
    body: "발표 자료는 함수랑산악회 노션을 통해 확인하실 수 있습니다.",
    subtitle: "함바! 👋",
  },
];
