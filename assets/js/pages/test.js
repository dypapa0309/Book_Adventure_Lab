/* ==========================================================
   assets/js/pages/test.js
   독해력 테스트 페이지 전용 JS

   흐름
   ----
   인트로(레벨 선택) → 12문항 → 결과 화면 → 상담 CTA

   ━━━ 문항 데이터 교체 방법 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   아래 QUESTIONS 객체에서 씨앗/가지/숲 각 배열에
   실제 문항 12개를 채워 넣으세요.

   각 문항 구조:
   {
     id: 번호,
     type: 'mc',            // 현재 4지선다 고정
     passage: '지문 텍스트',  // 없으면 빈 문자열 ''
     question: '질문',
     options: ['①...', '②...', '③...', '④...'],
     answer: 0,              // 정답 인덱스 (0~3)
     scores: {               // 맞혔을 때 각 영역 점수 (합산 최대 4점)
       reading: 1,           // 읽기 이해
       inference: 1,         // 추론
       expression: 1         // 표현/어휘
     }
   }
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── 문항 데이터 (실제 문항으로 교체 필요) ── */
const QUESTIONS = {
  씨앗: [
    { id:1,  passage:'글쓴이는 매일 아침 일기를 썼습니다.\n그 일기에는 오늘 있었던 일과 느낀 점을 적었습니다.',
      question:'글쓴이가 일기에 적은 내용으로 맞는 것은?',
      options:[''내일의 계획',''오늘 있었던 일과 느낀 점',''친구 이름',''좋아하는 음식'],
      answer:1, scores:{ reading:2, inference:1, expression:0 } },
    { id:2,  passage:'',
      question:'"빠르게 달리는 자동차"에서 "빠르게"는 어떤 말을 꾸며주고 있나요?',
      options:[''자동차',''달리는',''빠르게 자체',''문장 전체'],
      answer:1, scores:{ reading:1, inference:1, expression:1 } },
    { id:3,  passage:'진수는 도서관에서 책을 세 권 빌렸습니다.\n한 권은 과학책이고, 나머지 두 권은 이야기책입니다.',
      question:'진수가 빌린 이야기책은 몇 권인가요?',
      options:[''1권',''2권',''3권',''4권'],
      answer:1, scores:{ reading:2, inference:0, expression:0 } },
    { id:4,  passage:'',
      question:'"눈이 녹는다"와 비슷한 뜻으로 쓸 수 있는 표현은?',
      options:[''눈이 쌓인다',''눈이 사라진다',''눈이 내린다',''눈이 굳는다'],
      answer:1, scores:{ reading:0, inference:1, expression:2 } },
    { id:5,  passage:'',
      question:'다음 중 설명하는 글의 특징으로 알맞은 것은?',
      options:[''인물의 감정을 자세히 묘사한다',''사실을 정확하게 전달한다',''상상 속 이야기를 만들어 낸다',''자신의 의견만 담는다'],
      answer:1, scores:{ reading:1, inference:1, expression:1 } },
    { id:6,  passage:'가을에는 나뭇잎이 노랗고 빨갛게 물듭니다.\n낮이 짧아지고 기온이 떨어지면서 나타나는 현상입니다.',
      question:'나뭇잎이 색이 변하는 이유로 글에서 설명하는 것은?',
      options:[''비가 많이 와서',''낮이 짧아지고 기온이 내려가서',''바람이 강해서',''흙이 변해서'],
      answer:1, scores:{ reading:2, inference:1, expression:0 } },
    { id:7,  passage:'',
      question:'"친구를 ___ 돕는 것이 중요하다"에서 빈칸에 알맞은 말은?',
      options:[''빠르게',''기꺼이',''느리게',''멀리서'],
      answer:1, scores:{ reading:0, inference:1, expression:2 } },
    { id:8,  passage:'민지네 반은 환경 캠페인을 계획했습니다.\n포스터 만들기, 플라스틱 줄이기, 분리수거 실천을 결정했습니다.',
      question:'민지네 반이 결정한 캠페인 활동이 아닌 것은?',
      options:[''포스터 만들기',''학교 대청소',''플라스틱 줄이기',''분리수거 실천'],
      answer:1, scores:{ reading:2, inference:0, expression:0 } },
    { id:9,  passage:'',
      question:'독서의 좋은 점으로 가장 알맞은 것은?',
      options:[''빠른 시험 점수 향상',''다양한 생각과 지식을 얻는다',''운동 능력이 올라간다',''친구가 많아진다'],
      answer:1, scores:{ reading:0, inference:2, expression:1 } },
    { id:10, passage:'',
      question:'다음 중 "원인과 결과" 관계가 맞는 것은?',
      options:[''비가 온다 → 우산을 찾는다',''책을 읽는다 → 연필이 닳는다',''잠을 잔다 → 날씨가 흐리다',''걷는다 → 배가 부른다'],
      answer:0, scores:{ reading:1, inference:2, expression:0 } },
    { id:11, passage:'',
      question:'"선생님이 말씀하신 내용을 잘 이해했나요?"에서 높임말로 쓰인 단어는?',
      options:[''이해했나요',''말씀하신',''내용을',''잘'],
      answer:1, scores:{ reading:0, inference:1, expression:2 } },
    { id:12, passage:'책을 읽고 나서 느낀 점이나 궁금한 점을 적는 것을 독서 감상문이라고 합니다.',
      question:'독서 감상문에 주로 적는 내용은?',
      options:[''책의 가격',''느낀 점이나 궁금한 점',''글쓴이의 생년월일',''책의 두께'],
      answer:1, scores:{ reading:2, inference:0, expression:1 } }
  ],
  가지: [
    { id:1,  passage:'기후 위기는 인간 활동으로 발생하는 온실가스 증가가 주요 원인입니다.\n지구 평균 기온이 1.5°C 이상 오르면 생태계에 심각한 영향을 미칩니다.',
      question:'이 글에서 기후 위기의 주요 원인으로 설명한 것은?',
      options:[''화산 폭발',''인간 활동으로 발생하는 온실가스',''태양 활동 변화',''달의 중력 변화'],
      answer:1, scores:{ reading:2, inference:1, expression:0 } },
    { id:2,  passage:'',
      question:'다음 중 "주장"과 "근거"가 올바르게 짝지어진 것은?',
      options:[''주장: 운동은 좋다 / 근거: 나는 운동을 좋아한다',''주장: 독서를 생활화하자 / 근거: 독서는 어휘력과 사고력을 키운다',''주장: 날씨가 춥다 / 근거: 겨울이다',''주장: 음악이 좋다 / 근거: 음악이 있다'],
      answer:1, scores:{ reading:1, inference:2, expression:0 } },
    { id:3,  passage:'소설 속 인물 A는 항상 자신의 이익을 먼저 생각했습니다.\n그러나 친구가 어려움에 처하자 도움을 선택했습니다.',
      question:'인물 A의 행동 변화를 가장 잘 설명한 것은?',
      options:[''이기심이 더 강해졌다',''이익보다 관계를 중시하게 됐다',''계산적으로 돕기로 결정했다',''어려운 상황을 피하려 했다'],
      answer:1, scores:{ reading:1, inference:2, expression:1 } },
    { id:4,  passage:'',
      question:'"이 법안은 찬성과 반대 의견이 팽팽히 맞섰다"에서 "팽팽히"의 의미는?',
      options:[''한쪽이 압도적으로',''서로 비슷한 힘으로',''쉽게 합의되며',''빠른 속도로'],
      answer:1, scores:{ reading:0, inference:1, expression:2 } },
    { id:5,  passage:'뉴스 기사는 사실을 중심으로 씁니다. 그러나 제목 선택과\n사진 배치 방식에 따라 독자의 인식이 달라질 수 있습니다.',
      question:'이 글이 말하고자 하는 핵심은 무엇인가?',
      options:[''뉴스 기사는 항상 사실이다',''매체는 전달 방식으로 인식에 영향을 준다',''사진 없는 기사는 신뢰도가 낮다',''기자는 제목을 쉽게 써야 한다'],
      answer:1, scores:{ reading:1, inference:2, expression:1 } },
    { id:6,  passage:'',
      question:'설득하는 글에서 반드시 포함해야 하는 요소로 알맞은 것은?',
      options:[''주인공의 성격 묘사',''명확한 주장과 구체적 근거',''글쓴이의 생애',''반복되는 서사 구조'],
      answer:1, scores:{ reading:0, inference:2, expression:1 } },
    { id:7,  passage:'산업혁명 이후 도시 인구가 급증했습니다.\n농촌의 인구는 줄고, 공장 근로자 수가 증가했습니다.',
      question:'이 글에서 추론할 수 있는 변화로 가장 적절한 것은?',
      options:[''농업 생산량이 늘었다',''도시 중심의 경제 구조가 형성됐다',''인구 전체가 감소했다',''공장이 농촌에 세워졌다'],
      answer:1, scores:{ reading:1, inference:2, expression:0 } },
    { id:8,  passage:'',
      question:'"인과관계"를 파악하는 독해 전략으로 가장 유용한 질문은?',
      options:[''언제 일어났나?',''왜 이런 결과가 생겼나?',''누가 좋아하나?',''얼마나 큰가?'],
      answer:1, scores:{ reading:0, inference:2, expression:1 } },
    { id:9,  passage:'환경부 보고서에 따르면, 국내 플라스틱 재활용률은\n실제로 약 23% 수준에 그치는 것으로 나타났다.',
      question:'"보고서에 따르면"이라는 표현이 글에서 하는 역할은?',
      options:[''글쓴이의 감정 전달',''출처를 밝혀 신뢰도 강화',''반론 제기',''문장 길이 늘이기'],
      answer:1, scores:{ reading:1, inference:2, expression:0 } },
    { id:10, passage:'',
      question:'다음 중 "비교·대조" 구조의 글을 쓸 때 자주 쓰는 표현은?',
      options:[''그래서, 따라서',''반면에, 이와 달리',''예를 들면, 가령',''처음에는, 나중에는'],
      answer:1, scores:{ reading:0, inference:1, expression:2 } },
    { id:11, passage:'청소년들은 SNS를 통해 다양한 정보를 접합니다.\n하지만 정보의 출처와 신뢰도를 확인하는 습관이 중요합니다.',
      question:'이 글에서 주장하는 핵심 메시지는?',
      options:[''SNS 사용을 줄여야 한다',''정보 리터러시 역량이 필요하다',''청소년은 뉴스를 읽어야 한다',''인터넷 사용 시간을 제한해야 한다'],
      answer:1, scores:{ reading:1, inference:2, expression:0 } },
    { id:12, passage:'',
      question:'논설문을 쓸 때 "반론 인정 후 재반박"을 사용하는 목적은?',
      options:[''글을 길게 만들기 위해',''독자의 신뢰를 높이고 논리를 강화하기 위해',''반대 의견을 무시하기 위해',''서론을 생략하기 위해'],
      answer:1, scores:{ reading:0, inference:2, expression:2 } }
  ],
  숲: [
    { id:1,  passage:'하버마스는 의사소통 합리성을 통해 공론장의 역할을 강조했습니다.\n공론장에서 논쟁적 의제는 합리적 토론을 통해 공적 의견으로 수렴됩니다.',
      question:'이 글에서 공론장의 핵심 기능으로 설명한 것은?',
      options:[''권력자의 의견 전달',''합리적 토론을 통한 공적 의견 형성',''국가 정책 집행',''개인 의견의 억제'],
      answer:1, scores:{ reading:2, inference:1, expression:0 } },
    { id:2,  passage:'',
      question:'"귀납 추론"의 특징으로 가장 적절한 것은?',
      options:[''일반 원리에서 개별 사례를 도출',''개별 사례에서 일반 원리를 도출',''전제가 참이면 결론은 반드시 참',''감정에 기반한 추론'],
      answer:1, scores:{ reading:1, inference:2, expression:0 } },
    { id:3,  passage:'A 기업의 매출은 3년간 꾸준히 증가했습니다. 그러나\n같은 기간 직원 만족도는 하락했고 이직률은 높아졌습니다.',
      question:'이 자료에서 추론할 수 있는 가장 비판적인 시각은?',
      options:[''재무 성과가 곧 기업 건강성을 의미한다',''성장 지표가 내부 구성원 문제를 가릴 수 있다',''이직률 증가는 기업에 긍정적이다',''매출 증가는 직원 만족도에 비례한다'],
      answer:1, scores:{ reading:1, inference:2, expression:1 } },
    { id:4,  passage:'',
      question:'"프레이밍 효과"를 설명하는 예시로 가장 적절한 것은?',
      options:[''같은 사실을 어떻게 표현하느냐에 따라 판단이 달라진다',''정보가 많을수록 결정이 어려워진다',''친숙한 정보를 더 잘 기억한다',''첫인상이 오래 지속된다'],
      answer:0, scores:{ reading:0, inference:2, expression:2 } },
    { id:5,  passage:'예술은 미적 경험을 제공할 뿐 아니라 사회적 맥락을 반영합니다.\n따라서 작품 해석에는 창작 당시의 역사적 배경을 고려해야 합니다.',
      question:'이 글의 주장을 가장 잘 뒷받침하는 사례는?',
      options:[''인상파 화가들이 자연광을 탐구한 것',''나치 시대 표현주의 예술이 탄압받은 것',''현대 디지털 아트가 등장한 것',''조선 시대 산수화가 유행한 것'],
      answer:1, scores:{ reading:1, inference:2, expression:1 } },
    { id:6,  passage:'',
      question:'학술 논문에서 "선행 연구 검토"를 포함하는 이유로 가장 적절한 것은?',
      options:[''글의 분량을 채우기 위해',''기존 논의 맥락 안에서 연구 의의를 밝히기 위해',''반론을 미리 없애기 위해',''독자의 사전 지식 수준을 낮추기 위해'],
      answer:1, scores:{ reading:0, inference:2, expression:2 } },
    { id:7,  passage:'시장 실패란 시장 기제만으로는 자원이 효율적으로 배분되지\n않는 상황을 말합니다. 외부 효과, 공공재, 정보 비대칭이 대표적입니다.',
      question:'"외부 효과"의 예시로 가장 적절한 것은?',
      options:[''기업이 가격을 올려 수익을 극대화한다',''공장 매연이 인근 주민 건강에 피해를 준다',''소비자가 더 싼 제품을 선택한다',''정부가 금리를 조정한다'],
      answer:1, scores:{ reading:1, inference:2, expression:0 } },
    { id:8,  passage:'',
      question:'비판적 읽기에서 "필자의 전제"를 파악해야 하는 이유는?',
      options:[''필자의 감정을 이해하기 위해',''주장이 어떤 전제 위에 세워졌는지 검토하기 위해',''글의 길이를 가늠하기 위해',''어휘 수준을 파악하기 위해'],
      answer:1, scores:{ reading:0, inference:2, expression:2 } },
    { id:9,  passage:'사르트르는 "실존은 본질에 앞선다"고 주장했습니다.\n인간은 먼저 존재하고, 이후 스스로 의미를 만들어 나간다는 것입니다.',
      question:'이 명제의 함의로 가장 적절한 것은?',
      options:[''인간의 본질은 태어날 때 결정된다',''인간은 자신의 삶을 스스로 규정해야 한다',''실존보다 본질이 중요하다',''의미는 외부에서 주어진다'],
      answer:1, scores:{ reading:1, inference:2, expression:1 } },
    { id:10, passage:'',
      question:'다음 중 "상관관계"와 "인과관계"를 혼동하는 오류의 예시는?',
      options:[''온도가 올라가면 아이스크림 판매가 늘어난다 → 아이스크림이 온도를 올린다',''운동을 하면 심폐 기능이 향상된다',''학습 시간이 길수록 성적이 올라가는 경향이 있다',''수분 섭취가 부족하면 탈수가 생긴다'],
      answer:0, scores:{ reading:1, inference:2, expression:1 } },
    { id:11, passage:'디지털 리터러시는 정보를 수집·분석·평가하고\n윤리적으로 활용하는 복합적 역량을 말합니다.',
      question:'이 개념을 적용한 사례로 가장 적절한 것은?',
      options:[''인터넷 속도가 빠른 기기를 구매한다',''AI가 생성한 정보의 출처와 신뢰도를 비판적으로 검토한다',''SNS 팔로워 수를 늘린다',''동영상 강의를 빠른 배속으로 본다'],
      answer:1, scores:{ reading:1, inference:2, expression:1 } },
    { id:12, passage:'',
      question:'"공정으로서의 정의"(롤스)에서 "원초적 입장"의 역할은?',
      options:[''현재 사회 구조를 정당화한다',''자신의 위치를 모르는 상태에서 공정한 원칙을 도출한다',''다수결 원칙을 강화한다',''개인의 이익을 극대화하는 전략을 선택한다'],
      answer:1, scores:{ reading:1, inference:2, expression:2 } }
  ]
};

/* ── 결과 해석 (각 영역 만점 기준 48점) ── */
const RESULT_GUIDE = {
  씨앗: [
    { min: 0,  max: 20, label: '독서 출발선', badge: '🌱 씨앗',
      desc: '아직 독서·논술의 기초 단계입니다.\n꾸준히 읽는 습관을 만들어 가는 것이 중요합니다.\n씨앗 과정으로 시작하시면 좋습니다.', next: '씨앗' },
    { min: 21, max: 34, label: '성장 중',    badge: '🌱 씨앗+',
      desc: '기본 이해력은 갖추고 있습니다.\n추론과 표현 영역을 더 키우면 가지 과정으로 도약할 수 있습니다.', next: '씨앗→가지' },
    { min: 35, max: 48, label: '준비 완료',  badge: '🌿 가지 준비',
      desc: '씨앗 수준에서 탄탄한 기초를 쌓았습니다.\n가지 과정 도전을 권장합니다.', next: '가지' }
  ],
  가지: [
    { min: 0,  max: 20, label: '기초 재점검', badge: '🌱 씨앗 복습',
      desc: '기초 독해력부터 다시 다지는 것이 도움이 됩니다.\n씨앗 과정 복습 후 가지를 시작하면 효과적입니다.', next: '씨앗 복습' },
    { min: 21, max: 34, label: '성장 중',    badge: '🌿 가지',
      desc: '가지 수준의 추론·분석이 발전 중입니다.\n가지 과정을 이어가면서 표현력을 강화해 보세요.', next: '가지' },
    { min: 35, max: 48, label: '준비 완료',  badge: '🌲 숲 준비',
      desc: '가지 과정을 충분히 소화했습니다.\n숲 과정 도전을 권장합니다.', next: '숲' }
  ],
  숲: [
    { min: 0,  max: 20, label: '가지 보완 권장', badge: '🌿 가지 추천',
      desc: '고급 추론·비판 읽기 전에 가지 과정을 보강하면 좋습니다.', next: '가지 보강' },
    { min: 21, max: 34, label: '도약 중',    badge: '🌲 숲',
      desc: '비판적·논리적 사고가 발전 중입니다.\n숲 과정을 통해 심화 논술까지 연결해 보세요.', next: '숲' },
    { min: 35, max: 48, label: '심화 역량',  badge: '🌲 숲+',
      desc: '높은 수준의 독해·논리 역량을 갖추고 있습니다.\n진로 글쓰기 심화 과정도 고려해 보세요.', next: '진로 글쓰기' }
  ]
};

/* ──────────────────────────────────────────
   앱 상태
────────────────────────────────────────── */
const STATE = {
  level:    null,   // '씨앗' | '가지' | '숲'
  index:    0,      // 현재 문항 인덱스
  answers:  [],     // 선택한 답 인덱스 배열 (미응답 = null)
  timerSec: 0,
  timerHandle: null
};

/* ──────────────────────────────────────────
   DOM 참조
────────────────────────────────────────── */
const introCard    = document.getElementById('intro');
const testArea     = document.getElementById('test-area');
const progressText = document.getElementById('progress-text');
const progressBar  = document.getElementById('progress-bar');
const timerText    = document.getElementById('timer-text');
const qTitle       = document.getElementById('q-title');
const qPassage     = document.getElementById('q-passage');
const qOptions     = document.getElementById('q-options');
const btnPrev      = document.getElementById('btn-prev');
const btnNext      = document.getElementById('btn-next');
const btnSubmit    = document.getElementById('btn-submit');
const btnStart     = document.getElementById('btn-start');
const btnHow       = document.getElementById('btn-how');

/* ──────────────────────────────────────────
   추적 (analytics.js 의존)
────────────────────────────────────────── */
const track = window.trackBookLabEvent || function () {};

/* 페이지 진입 추적 */
track('landing_view', { page_path: '/test/' }, { onlyOnce: true });

/* ──────────────────────────────────────────
   인트로: 레벨 선택 화면 주입
────────────────────────────────────────── */
function renderLevelSelect() {
  if (!introCard) return;

  /* 기존 인트로 내용 대체 */
  introCard.innerHTML = `
    <h1 class="test-h1">시작 레벨 선택</h1>
    <p class="test-muted test-lead">
      현재 가장 가깝다고 느끼는 레벨을 선택해 주세요.<br>
      선택한 레벨에 맞는 12문항이 진행됩니다.
    </p>
    <div class="level-grid">
      <div class="level-card" data-level="씨앗" tabindex="0" role="button" aria-pressed="false">
        <div class="level-card-stamp">🌱</div>
        <div class="level-card-title">씨앗</div>
        <div class="level-card-sub">초등 3–6학년</div>
      </div>
      <div class="level-card" data-level="가지" tabindex="0" role="button" aria-pressed="false">
        <div class="level-card-stamp">🌿</div>
        <div class="level-card-title">가지</div>
        <div class="level-card-sub">중학생</div>
      </div>
      <div class="level-card" data-level="숲" tabindex="0" role="button" aria-pressed="false">
        <div class="level-card-stamp">🌲</div>
        <div class="level-card-title">숲</div>
        <div class="level-card-sub">고등학생</div>
      </div>
    </div>
    <div class="test-divider"></div>
    <div class="test-row">
      <button class="btn" id="btn-level-start" type="button" disabled>테스트 시작</button>
      <button class="btn-outline" id="btn-level-back" type="button">← 뒤로</button>
    </div>
    <p class="test-muted test-note">* 소요 시간 약 5–7분. 결과는 참고용 진단입니다.</p>
  `;

  const cards        = introCard.querySelectorAll('.level-card');
  const levelStartBtn = introCard.querySelector('#btn-level-start');
  const levelBackBtn  = introCard.querySelector('#btn-level-back');

  cards.forEach(card => {
    const select = () => {
      cards.forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      STATE.level = card.dataset.level;
      if (levelStartBtn) levelStartBtn.disabled = false;
    };
    card.addEventListener('click', select);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });

  levelBackBtn?.addEventListener('click', () => renderIntro());
  levelStartBtn?.addEventListener('click', () => {
    if (!STATE.level) return;
    startTest(STATE.level);
  });
}

/* 인트로 원복 */
function renderIntro() {
  if (!introCard) return;
  introCard.innerHTML = `
    <h1 class="test-h1">독해력 테스트</h1>
    <p class="test-muted test-lead">
      씨앗·가지·숲 중 현재 가장 가깝다고 느끼는 시작 레벨을 선택해 진행합니다.<br>
      소요 시간은 약 5–7분이며, 결과 화면에서 현재 적합도와 다음 권장 단계를 안내드립니다.
    </p>
    <div class="test-divider"></div>
    <div class="test-row">
      <button class="btn" id="btn-start" type="button">테스트 시작</button>
      <button class="btn-outline" id="btn-how" type="button">안내 보기</button>
    </div>
    <p class="test-muted test-note">* 테스트 결과는 상담 전 참고용 진단이며, 최종 판단은 상담에서 더 정확하게 안내드립니다.</p>
  `;
  introCard.querySelector('#btn-start')?.addEventListener('click', renderLevelSelect);
  introCard.querySelector('#btn-how')?.addEventListener('click', showHowModal);
}

/* ──────────────────────────────────────────
   테스트 시작
────────────────────────────────────────── */
function startTest(level) {
  STATE.level   = level;
  STATE.index   = 0;
  STATE.answers = new Array((QUESTIONS[level] || []).length).fill(null);
  STATE.timerSec = 0;

  if (introCard) introCard.classList.add('hide');
  if (testArea)  testArea.classList.remove('hide');

  startTimer();
  renderQuestion();
}

/* ──────────────────────────────────────────
   타이머
────────────────────────────────────────── */
function startTimer() {
  clearInterval(STATE.timerHandle);
  STATE.timerSec = 0;
  STATE.timerHandle = setInterval(() => {
    STATE.timerSec++;
    if (timerText) timerText.textContent = formatTime(STATE.timerSec);
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/* ──────────────────────────────────────────
   문항 렌더링
────────────────────────────────────────── */
function renderQuestion() {
  const qs    = QUESTIONS[STATE.level] || [];
  const q     = qs[STATE.index];
  const total = qs.length;

  if (!q) return;

  /* 진행 텍스트 & 바 */
  if (progressText) progressText.textContent = `문항 ${STATE.index + 1} / ${total}`;
  if (progressBar)  progressBar.style.width = `${((STATE.index + 1) / total) * 100}%`;

  /* 지문 */
  if (qPassage) {
    if (q.passage) {
      qPassage.textContent = q.passage;
      qPassage.classList.remove('hide');
    } else {
      qPassage.textContent = '';
      qPassage.classList.add('hide');
    }
  }

  /* 질문 */
  if (qTitle) qTitle.textContent = `Q${STATE.index + 1}. ${q.question}`;

  /* 선택지 */
  if (qOptions) {
    qOptions.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-option' + (STATE.answers[STATE.index] === i ? ' selected' : '');
      btn.innerHTML = `<span class="q-option-num">${i + 1}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => selectAnswer(i));
      qOptions.appendChild(btn);
    });
  }

  /* 이전/다음/제출 버튼 */
  if (btnPrev)   btnPrev.disabled = STATE.index === 0;
  if (btnNext)   btnNext.classList.toggle('hide', STATE.index === total - 1);
  if (btnSubmit) btnSubmit.classList.toggle('hide', STATE.index !== total - 1);
}

/* ──────────────────────────────────────────
   답 선택
────────────────────────────────────────── */
function selectAnswer(i) {
  STATE.answers[STATE.index] = i;
  renderQuestion();
}

/* ──────────────────────────────────────────
   이전 / 다음 / 제출
────────────────────────────────────────── */
btnPrev?.addEventListener('click', () => {
  if (STATE.index > 0) { STATE.index--; renderQuestion(); }
});

btnNext?.addEventListener('click', () => {
  const qs = QUESTIONS[STATE.level] || [];
  if (STATE.index < qs.length - 1) { STATE.index++; renderQuestion(); }
});

btnSubmit?.addEventListener('click', () => {
  const unanswered = STATE.answers.filter(a => a === null).length;
  if (unanswered > 0) {
    if (!confirm(`아직 ${unanswered}문항에 답하지 않았습니다. 그대로 제출할까요?`)) return;
  }
  clearInterval(STATE.timerHandle);
  showResult();
});

/* ──────────────────────────────────────────
   결과 계산 & 표시
────────────────────────────────────────── */
function showResult() {
  const qs = QUESTIONS[STATE.level] || [];

  let reading = 0, inference = 0, expression = 0, total = 0;

  qs.forEach((q, i) => {
    if (STATE.answers[i] === q.answer) {
      reading    += (q.scores?.reading    || 0);
      inference  += (q.scores?.inference  || 0);
      expression += (q.scores?.expression || 0);
    }
  });
  total = reading + inference + expression;

  /* 결과 해석 */
  const guides = RESULT_GUIDE[STATE.level] || [];
  const guide  = guides.find(g => total >= g.min && total <= g.max) || guides[guides.length - 1];

  /* 결과 카드 생성 */
  const resultCard = document.createElement('section');
  resultCard.className = 'test-card';
  resultCard.setAttribute('aria-label', '테스트 결과');
  resultCard.innerHTML = `
    <h2 class="test-h2">테스트 결과</h2>
    <div style="text-align:center;margin:12px 0">
      <span class="result-level-badge">${guide.badge} ${guide.label}</span>
    </div>
    <div class="result-score-wrap">
      <div class="result-score-item">
        <div class="result-score-label">읽기 이해</div>
        <div class="result-score-value">${reading}</div>
        <div class="result-score-max">/ 24</div>
      </div>
      <div class="result-score-item">
        <div class="result-score-label">추론</div>
        <div class="result-score-value">${inference}</div>
        <div class="result-score-max">/ 24</div>
      </div>
      <div class="result-score-item">
        <div class="result-score-label">표현·어휘</div>
        <div class="result-score-value">${expression}</div>
        <div class="result-score-max">/ 24</div>
      </div>
    </div>
    <p class="result-desc">${guide.desc.replace(/\n/g, '<br>')}</p>
    <p class="test-muted" style="font-size:13px;margin-top:0">권장 다음 단계: <strong>${guide.next}</strong></p>
    <div class="test-divider"></div>
    <p style="text-align:center;color:var(--ink-2);font-size:15px;line-height:1.7">
      결과를 바탕으로 1:1 상담을 받아보세요.<br>
      아이에게 맞는 수업 방향을 안내드립니다.
    </p>
    <div class="result-cta-row">
      <a class="btn" href="/#contact" id="btn-result-consult">상담 신청하기</a>
      <a class="btn-outline" href="/" id="btn-result-home">홈으로</a>
    </div>
    <p class="test-muted test-note" style="text-align:center;margin-top:16px">
      * 이 결과는 참고용 진단입니다. 최종 판단은 상담에서 더 정확하게 안내드립니다.
    </p>
  `;

  /* 테스트 영역 숨기고 결과 삽입 */
  if (testArea) testArea.classList.add('hide');
  testArea?.after(resultCard);
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  /* 결과 CTA 추적 */
  resultCard.querySelector('#btn-result-consult')?.addEventListener('click', () => {
    track('consult_click', {
      location:     'test_result',
      inquiry_type: 'consult',
      button_text:  '상담 신청하기',
      test_level:   STATE.level,
      test_score:   total
    });
  });

  /* 결과 이벤트 추적 */
  track('test_complete', {
    test_level:      STATE.level,
    score_total:     total,
    score_reading:   reading,
    score_inference: inference,
    score_expression:expression,
    result_label:    guide.label
  });
}

/* ──────────────────────────────────────────
   안내 보기 모달
────────────────────────────────────────── */
function showHowModal() {
  const BAL = window.BAL;
  BAL?.modal?.open?.({
    title: '테스트 안내',
    body: [
      '· 씨앗/가지/숲 중 레벨을 먼저 선택합니다.',
      '· 각 레벨 12문항이 출제됩니다.',
      '· 읽기 이해 · 추론 · 표현 세 영역이 측정됩니다.',
      '· 소요 시간: 약 5–7분',
      '· 결과는 상담 전 참고용 진단입니다.'
    ].join('\n'),
    actions: [{ label: '확인', className: 'primary', closeOnClick: true }]
  });
}

/* ──────────────────────────────────────────
   초기화
────────────────────────────────────────── */
btnStart?.addEventListener('click', renderLevelSelect);
btnHow?.addEventListener('click',   showHowModal);
