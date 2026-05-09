// 음식 카테고리별 데이터
// protein: 단백질(g), calories: 칼로리(kcal), score: 근성장 점수 (0~5)
// score 기준: 단백질 높고 공복 칼로리 낮을수록 높음

export const foodCategories = [
  {
    id: 'healthy',
    label: '💪 건강식',
    color: '#22C55E',
    items: [
      { id: 'f01', name: '닭가슴살 200g', protein: 46, calories: 220, score: 5 },
      { id: 'f02', name: '닭가슴살 도시락', protein: 35, calories: 400, score: 4 },
      { id: 'f03', name: '계란 3개', protein: 19, calories: 210, score: 5 },
      { id: 'f04', name: '계란 1개', protein: 6, calories: 70, score: 4 },
      { id: 'f05', name: '밥 1공기', protein: 5, calories: 300, score: 4 },
      { id: 'f06', name: '고구마 1개', protein: 2, calories: 130, score: 4 },
      { id: 'f07', name: '바나나 1개', protein: 1, calories: 90, score: 4 },
      { id: 'f08', name: '단백질 쉐이크', protein: 25, calories: 130, score: 5 },
      { id: 'f09', name: '연어 150g', protein: 30, calories: 280, score: 5 },
      { id: 'f10', name: '참치캔 1개', protein: 25, calories: 120, score: 5 },
      { id: 'f11', name: '그릭 요거트', protein: 17, calories: 150, score: 5 },
      { id: 'f12', name: '두부 반모', protein: 10, calories: 100, score: 4 },
      { id: 'f13', name: '아몬드 한줌', protein: 6, calories: 170, score: 3 },
      { id: 'f14', name: '우유 1컵', protein: 8, calories: 150, score: 4 },
      { id: 'f15', name: '오트밀 1컵', protein: 6, calories: 150, score: 4 },
    ],
  },
  {
    id: 'korean',
    label: '🍚 한식',
    color: '#F97316',
    items: [
      { id: 'k01', name: '제육볶음 + 밥', protein: 28, calories: 650, score: 3 },
      { id: 'k02', name: '김치찌개 + 밥', protein: 18, calories: 550, score: 3 },
      { id: 'k03', name: '된장찌개 + 밥', protein: 15, calories: 500, score: 3 },
      { id: 'k04', name: '불고기 + 밥', protein: 30, calories: 620, score: 3 },
      { id: 'k05', name: '삼겹살 200g', protein: 30, calories: 700, score: 2 },
      { id: 'k06', name: '김밥 1줄', protein: 10, calories: 330, score: 2 },
      { id: 'k07', name: '라면 1개', protein: 8, calories: 500, score: 1 },
      { id: 'k08', name: '순두부찌개 + 밥', protein: 20, calories: 520, score: 3 },
      { id: 'k09', name: '비빔밥', protein: 15, calories: 580, score: 3 },
      { id: 'k10', name: '갈비탕', protein: 35, calories: 600, score: 4 },
      { id: 'k11', name: '닭볶음탕 + 밥', protein: 38, calories: 680, score: 4 },
      { id: 'k12', name: '설렁탕', protein: 30, calories: 450, score: 4 },
    ],
  },
  {
    id: 'chinese',
    label: '🥢 중식',
    color: '#EF4444',
    items: [
      { id: 'c01', name: '짜장면', protein: 15, calories: 650, score: 1 },
      { id: 'c02', name: '짬뽕', protein: 18, calories: 600, score: 2 },
      { id: 'c03', name: '볶음밥', protein: 12, calories: 700, score: 1 },
      { id: 'c04', name: '탕수육 (소)', protein: 20, calories: 800, score: 1 },
      { id: 'c05', name: '마파두부 + 밥', protein: 15, calories: 580, score: 2 },
      { id: 'c06', name: '양장피', protein: 18, calories: 500, score: 2 },
    ],
  },
  {
    id: 'western',
    label: '🍝 양식',
    color: '#8B5CF6',
    items: [
      { id: 'w01', name: '돈까스', protein: 25, calories: 750, score: 2 },
      { id: 'w02', name: '스파게티', protein: 15, calories: 650, score: 1 },
      { id: 'w03', name: '스테이크 200g', protein: 45, calories: 500, score: 4 },
      { id: 'w04', name: '샐러드 + 닭', protein: 30, calories: 350, score: 5 },
      { id: 'w05', name: '샌드위치', protein: 18, calories: 420, score: 3 },
      { id: 'w06', name: '피자 2조각', protein: 18, calories: 600, score: 1 },
      { id: 'w07', name: '햄버거', protein: 20, calories: 700, score: 1 },
      { id: 'w08', name: '그릴 치킨', protein: 40, calories: 400, score: 5 },
    ],
  },
  {
    id: 'snack',
    label: '🧃 간식/음료',
    color: '#EC4899',
    items: [
      { id: 's01', name: '아이스크림', protein: 3, calories: 200, score: 0 },
      { id: 's02', name: '과자 1봉지', protein: 2, calories: 250, score: 0 },
      { id: 's03', name: '치킨 반마리', protein: 35, calories: 650, score: 2 },
      { id: 's04', name: '떡볶이', protein: 8, calories: 400, score: 1 },
      { id: 's05', name: '아메리카노', protein: 0, calories: 10, score: 3 },
      { id: 's06', name: '라떼', protein: 5, calories: 150, score: 2 },
      { id: 's07', name: '탄산음료 캔', protein: 0, calories: 140, score: 0 },
      { id: 's08', name: '초콜릿 바', protein: 4, calories: 250, score: 0 },
      { id: 's09', name: '에너지바', protein: 10, calories: 200, score: 3 },
      { id: 's10', name: '빵 1개', protein: 5, calories: 280, score: 1 },
    ],
  },
];

export const DAILY_GOALS = {
  calories: 2900,  // 목표 칼로리 (린벌크 기준)
  protein: 140,    // 목표 단백질 (g)
};

// 점수 → 등급 변환
export const getScoreGrade = (avg) => {
  if (avg >= 4.5) return { label: 'S', color: '#22C55E', msg: '완벽한 근성장 식단!' };
  if (avg >= 3.5) return { label: 'A', color: '#3B82F6', msg: '훌륭해요! 단백질 충분' };
  if (avg >= 2.5) return { label: 'B', color: '#F97316', msg: '무난해요. 단백질 보충 추천' };
  if (avg >= 1.5) return { label: 'C', color: '#EAB308', msg: '개선 필요. 닭가슴살 추가하세요' };
  return { label: 'D', color: '#EF4444', msg: '오늘은 쉐이크라도 한 잔!' };
};
