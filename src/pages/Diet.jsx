import { useState } from 'react';
import { foodCategories, DAILY_GOALS, getScoreGrade } from '../data/foodData';
import { todayStr, formatDate } from '../data/workoutData';

function offsetDate(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return formatDate(d);
}

export default function Diet({ appData }) {
  const { getDayRecord, addFood, removeFood } = appData;
  const [viewDate, setViewDate] = useState(todayStr);
  const [activeCategory, setActiveCategory] = useState('healthy');

  const isToday = viewDate === todayStr;
  const dayRecord = getDayRecord(viewDate);
  const foods = dayRecord.foods || [];

  const totalCalories = foods.reduce((s, f) => s + f.calories, 0);
  const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
  const avgScore = foods.length > 0 ? foods.reduce((s, f) => s + f.score, 0) / foods.length : 0;
  const grade = getScoreGrade(avgScore);
  const calPercent = Math.min(100, Math.round((totalCalories / DAILY_GOALS.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / DAILY_GOALS.protein) * 100));

  const navigate = (delta) => setViewDate(d => offsetDate(d, delta));
  const dateLabel = isToday ? '오늘' : viewDate.slice(5).replace('-', '/');

  const currentCategory = foodCategories.find(c => c.id === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <p className="text-gray-500 text-sm">식단 기록</p>
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A1A1A] border border-white/5 text-gray-300 active:scale-90 transition-transform text-sm"
          >◀</button>
          <div className="text-center">
            <h1 className="text-xl font-black text-white">{dateLabel}</h1>
            <p className={`text-xs mt-0.5 font-semibold ${isToday ? 'text-orange-400' : 'text-gray-500'}`}>
              {isToday ? '오늘' : viewDate}
            </p>
          </div>
          <button
            onClick={() => navigate(1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A1A1A] border border-white/5 text-gray-300 active:scale-90 transition-transform text-sm"
          >▶</button>
        </div>
        {!isToday && (
          <button onClick={() => setViewDate(todayStr)} className="mt-2 w-full text-center text-xs text-orange-400 py-1">
            오늘로 돌아가기
          </button>
        )}
      </div>

      {/* 오늘의 요약 카드 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-xs">오늘 식단 점수</p>
          {foods.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: grade.color, backgroundColor: grade.color + '20' }}>
                {grade.label}등급
              </span>
              <p className="text-gray-400 text-xs">{grade.msg}</p>
            </div>
          ) : (
            <p className="text-gray-600 text-xs">아직 기록 없음</p>
          )}
        </div>

        {/* 칼로리 바 */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <p className="text-gray-400 text-xs">칼로리</p>
            <p className="text-xs font-bold">
              <span className={totalCalories > DAILY_GOALS.calories ? 'text-red-400' : 'text-white'}>{totalCalories}</span>
              <span className="text-gray-500"> / {DAILY_GOALS.calories} kcal</span>
            </p>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${totalCalories > DAILY_GOALS.calories ? 'bg-red-500' : 'bg-orange-500'}`}
              style={{ width: `${calPercent}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-600 mt-0.5">{calPercent}%</p>
        </div>

        {/* 단백질 바 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-gray-400 text-xs">단백질</p>
            <p className="text-xs font-bold">
              <span className="text-white">{totalProtein}g</span>
              <span className="text-gray-500"> / {DAILY_GOALS.protein}g</span>
            </p>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-600 mt-0.5">{proteinPercent}%</p>
        </div>
      </div>

      {/* 오늘 먹은 음식 목록 */}
      {foods.length > 0 && (
        <div className="mx-5 mb-4">
          <p className="text-gray-400 text-xs font-semibold mb-2">오늘 먹은 것</p>
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
            {foods.map((food, idx) => (
              <div key={`${food.id}-${idx}`} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{food.name}</p>
                  <p className="text-gray-500 text-xs">{food.calories}kcal · 단백질 {food.protein}g</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                  style={{ color: getScoreGrade(food.score).color, backgroundColor: getScoreGrade(food.score).color + '20' }}>
                  {'★'.repeat(food.score)}{'☆'.repeat(5 - food.score)}
                </span>
                <button
                  onClick={() => removeFood(viewDate, idx)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2A2A2A] text-gray-500 text-xs active:scale-90 transition-transform flex-shrink-0"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 탭 */}
      <div className="px-5 mb-3">
        <p className="text-gray-400 text-xs font-semibold mb-2">음식 추가</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {foodCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'text-white border-transparent'
                  : 'bg-[#1A1A1A] text-gray-400 border-white/10'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 음식 목록 */}
      {currentCategory && (
        <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
          {currentCategory.items.map((item) => {
            const itemGrade = getScoreGrade(item.score);
            return (
              <button
                key={item.id}
                onClick={() => addFood(viewDate, item)}
                className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 active:bg-white/5 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.calories}kcal · 단백질 {item.protein}g</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ color: itemGrade.color, backgroundColor: itemGrade.color + '20' }}>
                    {item.score >= 4.5 ? 'S' : item.score >= 3.5 ? 'A' : item.score >= 2.5 ? 'B' : item.score >= 1.5 ? 'C' : 'D'}
                  </span>
                  <span className="text-gray-600 text-lg">+</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
