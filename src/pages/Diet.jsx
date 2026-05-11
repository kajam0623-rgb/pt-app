import { useState } from 'react';
import MStripe from '../components/MStripe';
import { foodCategories, DAILY_GOALS, getScoreGrade } from '../data/foodData';
import { todayStr, formatDate } from '../data/workoutData';

function offsetDate(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return formatDate(d);
}

const GRADE_LETTER = (score) => score >= 4.5 ? 'S' : score >= 3.5 ? 'A' : score >= 2.5 ? 'B' : score >= 1.5 ? 'C' : 'D';

export default function Diet({ appData }) {
  const { getDayRecord, addFood, removeFood, getRecentFoods } = appData;
  const [viewDate, setViewDate] = useState(todayStr);
  const [activeCategory, setActiveCategory] = useState('healthy');

  const isToday = viewDate === todayStr;
  const dayRecord = getDayRecord(viewDate);
  const foods = dayRecord.foods || [];

  const totalCalories = foods.reduce((s, f) => s + f.calories, 0);
  const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
  const calPercent = Math.min(100, Math.round((totalCalories / DAILY_GOALS.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / DAILY_GOALS.protein) * 100));

  const navigate = (delta) => setViewDate(d => offsetDate(d, delta));
  const dateLabel = isToday ? '오늘' : viewDate.slice(5).replace('-', '/');

  const recentFoods = getRecentFoods();
  const currentCategory = foodCategories.find(c => c.id === activeCategory);

  const hairline = '1px solid var(--hairline)';
  const labelStyle = { color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--canvas)' }}>
      {/* 헤더 */}
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={labelStyle}>식단 기록</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ border: hairline, background: 'transparent', color: 'var(--body)', padding: '8px 12px', cursor: 'pointer', borderRadius: 0, fontSize: '13px' }}>◀</button>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{dateLabel}</h1>
          <button onClick={() => navigate(1)} style={{ border: hairline, background: 'transparent', color: 'var(--body)', padding: '8px 12px', cursor: 'pointer', borderRadius: 0, fontSize: '13px' }}>▶</button>
        </div>
        {!isToday && (
          <button onClick={() => setViewDate(todayStr)} style={{ marginTop: '8px', width: '100%', textAlign: 'center', fontSize: '10px', color: 'var(--m-blue)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            오늘로 돌아가기
          </button>
        )}
      </div>

      {/* M 스트라이프 */}
      <div style={{ margin: '0 20px 16px' }}><MStripe /></div>

      {/* 영양 요약 스펙 셀 */}
      <div style={{ margin: '0 20px 16px' }}>
        <p style={{ ...labelStyle, marginBottom: '8px' }}>오늘 영양 현황</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--hairline)' }}>
          <div style={{ background: 'var(--surface-soft)', padding: '14px' }}>
            <p style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>칼로리</p>
            <p style={{ color: totalCalories > DAILY_GOALS.calories ? 'var(--m-red)' : '#fff', fontSize: '26px', fontWeight: 700, margin: '0 0 6px', lineHeight: 1 }}>
              {totalCalories}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--muted)' }}> / {DAILY_GOALS.calories}</span>
            </p>
            <div style={{ background: 'var(--surface-card)', height: '2px' }}>
              <div style={{ background: `linear-gradient(to right, var(--m-blue-light), ${totalCalories > DAILY_GOALS.calories ? 'var(--m-red)' : 'var(--m-blue)'})`, height: '100%', width: `${calPercent}%` }} />
            </div>
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '14px' }}>
            <p style={{ ...labelStyle, fontSize: '8px', marginBottom: '4px' }}>단백질</p>
            <p style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: '0 0 6px', lineHeight: 1 }}>
              {totalProtein}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--muted)' }}>g / {DAILY_GOALS.protein}g</span>
            </p>
            <div style={{ background: 'var(--surface-card)', height: '2px' }}>
              <div style={{ background: 'linear-gradient(to right, var(--m-blue-light), var(--m-blue))', height: '100%', width: `${proteinPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 오늘 먹은 것 목록 */}
      {foods.length > 0 && (
        <div style={{ margin: '0 20px 16px' }}>
          <p style={{ ...labelStyle, marginBottom: '8px' }}>오늘 먹은 것</p>
          <div style={{ border: hairline }}>
            {foods.map((food, idx) => (
              <div key={`${food.id}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: idx < foods.length - 1 ? hairline : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>{food.calories}kcal · 단백질 {food.protein}g</p>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: getScoreGrade(food.score).color, flexShrink: 0 }}>{GRADE_LETTER(food.score)}</span>
                <button onClick={() => removeFood(viewDate, idx)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-card)', border: hairline, color: 'var(--muted)', fontSize: '10px', cursor: 'pointer', borderRadius: 0, flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 최근 먹은 것 */}
      {recentFoods.length > 0 && (
        <div style={{ margin: '0 20px 16px' }}>
          <p style={{ ...labelStyle, marginBottom: '8px' }}>최근 먹은 것</p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {recentFoods.map(food => (
              <button
                key={food.id}
                onClick={() => addFood(viewDate, food)}
                style={{ flexShrink: 0, border: hairline, padding: '10px 14px', background: 'transparent', cursor: 'pointer', textAlign: 'left', borderRadius: 0 }}
              >
                <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>{food.name}</p>
                <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>{food.calories}kcal · {food.protein}g</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 탭 */}
      <div style={{ margin: '0 20px 12px', borderBottom: hairline, display: 'flex', gap: 0, overflowX: 'auto' }}>
        {foodCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              flexShrink: 0, padding: '8px 14px', background: 'transparent', border: 'none',
              borderBottom: activeCategory === cat.id ? '2px solid #fff' : '2px solid transparent',
              color: activeCategory === cat.id ? '#fff' : 'var(--muted)',
              fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 음식 목록 */}
      {currentCategory && (
        <div style={{ margin: '0 20px', border: hairline }}>
          {currentCategory.items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => addFood(viewDate, item)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                borderBottom: idx < currentCategory.items.length - 1 ? hairline : 'none',
                background: 'transparent', border: 'none',
                borderBottom: idx < currentCategory.items.length - 1 ? hairline : 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>{item.calories}kcal · 단백질 {item.protein}g</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: getScoreGrade(item.score).color }}>{GRADE_LETTER(item.score)}</span>
                <span style={{ color: 'var(--muted)', fontSize: '18px', fontWeight: 300 }}>+</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
