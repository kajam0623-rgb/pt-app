import { useState } from 'react';
import MStripe from '../components/MStripe';
import { todayStr, getDayOfWeekStr, month1Workouts, weeklySchedule, formatDate } from '../data/workoutData';

const DAY_ORDER = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function offsetDate(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return formatDate(d);
}

function CardioCard({ ex, done, onToggle, savedMin, onSaveMin }) {
  const [minInput, setMinInput] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const val = parseInt(minInput);
    if (!isNaN(val) && val > 0) {
      onSaveMin(val);
      setSaved(true);
      setMinInput('');
      setTimeout(() => setSaved(false), 1500);
    }
  };

  const hairline = '1px solid var(--hairline)';

  return (
    <div style={{ border: hairline, borderRadius: 0 }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '20px', height: '20px', flexShrink: 0, borderRadius: 0,
            border: done ? 'none' : '2px solid var(--hairline)',
            background: done ? 'var(--m-blue)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          {done && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 700, fontSize: '13px', color: done ? 'var(--muted)' : '#fff', margin: 0, textDecoration: done ? 'line-through' : 'none' }}>{ex.name}</p>
            <span style={{ fontSize: '9px', padding: '2px 8px', background: 'rgba(28,105,212,0.2)', color: 'var(--m-blue)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>유산소</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>{ex.reps} · 목표 {ex.cardioGoal}{ex.cardioUnit} · {ex.target}</p>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px', borderTop: hairline }}>
        <div style={{ background: 'var(--surface-soft)', padding: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: 'var(--m-blue)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>방법</p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' 자세 운동')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--m-red)', padding: '4px 10px', color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none' }}
            >▶ YOUTUBE</a>
          </div>
          {ex.how.split('\n').map((line, i) => (
            <p key={i} style={{ color: 'var(--body)', fontSize: '11px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{line}</p>
          ))}
        </div>
        <div style={{ background: 'var(--surface-soft)', padding: '12px', marginBottom: '12px' }}>
          <p style={{ color: '#f4b400', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px' }}>포인트</p>
          <p style={{ color: 'var(--body)', fontSize: '11px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{ex.point}</p>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px' }}>실제 시간 기록</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number" inputMode="numeric"
            placeholder={savedMin ? `${savedMin}` : `목표 ${ex.cardioGoal}분`}
            value={minInput}
            onChange={e => setMinInput(e.target.value)}
            style={{ flex: 1, background: 'var(--surface-soft)', color: '#fff', fontSize: '13px', textAlign: 'center', border: '1px solid var(--hairline)', padding: '8px', outline: 'none', borderRadius: 0, fontFamily: 'inherit' }}
          />
          <span style={{ color: 'var(--muted)', fontSize: '10px', width: '16px' }}>분</span>
          <button
            onClick={handleSave}
            style={{ padding: '8px 16px', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: saved ? 'var(--m-blue)' : 'var(--surface-card)', color: '#fff', border: '1px solid var(--hairline)', cursor: 'pointer', borderRadius: 0 }}
          >{saved ? '✓' : '저장'}</button>
        </div>
        {savedMin && (
          <p style={{ color: 'var(--m-blue)', fontSize: '10px', fontWeight: 300, margin: '6px 0 0' }}>
            {savedMin >= ex.cardioGoal ? `✓ 목표 달성 (${savedMin}분)` : `${savedMin}분 완료 · 목표까지 ${ex.cardioGoal - savedMin}분`}
          </p>
        )}
      </div>
    </div>
  );
}

function WeightCard({ ex, done, onToggle, viewRecord, onSaveSet }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weightInputs, setWeightInputs] = useState({});

  const getSavedWeight = (setIdx) => viewRecord.sets?.[ex.id]?.[setIdx]?.weight;

  const initInputs = () => {
    const init = {};
    for (let i = 0; i < ex.sets; i++) {
      const saved = getSavedWeight(i);
      if (saved != null) init[`${ex.id}-${i}`] = String(saved);
    }
    return init;
  };

  const handleToggleExpand = () => {
    if (!isExpanded) setWeightInputs(initInputs());
    setIsExpanded(prev => !prev);
  };

  const handleChange = (i, value) => {
    if (i === 0) {
      const filled = {};
      for (let j = 0; j < ex.sets; j++) filled[`${ex.id}-${j}`] = value;
      setWeightInputs(prev => ({ ...prev, ...filled }));
    } else {
      setWeightInputs(prev => ({ ...prev, [`${ex.id}-${i}`]: value }));
    }
  };

  const handleBlur = (setIdx) => {
    const val = parseFloat(weightInputs[`${ex.id}-${setIdx}`]);
    if (!isNaN(val) && val > 0) onSaveSet(ex.id, setIdx, { weight: val, reps: 12 });
  };

  const lastSaved = getSavedWeight(ex.sets - 1);
  const hitGoal = ex.goalWeight > 0 && lastSaved >= ex.goalWeight;
  const hairline = '1px solid var(--hairline)';

  return (
    <div style={{ border: isExpanded ? '1px solid var(--m-blue)' : hairline, borderRadius: 0 }}>
      <button
        onClick={handleToggleExpand}
        style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{
            width: '20px', height: '20px', flexShrink: 0, borderRadius: 0,
            border: done ? 'none' : '2px solid var(--hairline)',
            background: done ? 'var(--m-blue)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          {done && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '13px', color: done ? 'var(--muted)' : '#fff', margin: 0, textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300 }}>{ex.sets}세트 × {ex.reps}</span>
            {ex.goalWeight > 0 && (
              <span style={{ fontSize: '9px', padding: '2px 8px', background: hitGoal ? 'rgba(15,163,54,0.2)' : 'rgba(28,105,212,0.2)', color: hitGoal ? '#0fa336' : 'var(--m-blue)', fontWeight: 700, letterSpacing: '1px' }}>
                {hitGoal ? '✓ ' : ''}목표 {ex.goalWeight}kg
              </span>
            )}
          </div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div style={{ padding: '0 16px 16px', borderTop: hairline }} className="slide-up">
          <div style={{ background: 'var(--surface-soft)', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ color: 'var(--m-blue)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>기구 사용법</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' 자세 운동')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ background: 'var(--m-red)', padding: '4px 10px', color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none' }}
              >▶ YOUTUBE</a>
            </div>
            {ex.how.split('\n').map((line, i) => (
              <p key={i} style={{ color: 'var(--body)', fontSize: '11px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{line}</p>
            ))}
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '12px', marginBottom: '12px' }}>
            <p style={{ color: '#f4b400', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px' }}>핵심 포인트</p>
            <p style={{ color: 'var(--body)', fontSize: '11px', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{ex.point}</p>
          </div>

          {ex.goalWeight > 0 && (
            <div style={{ padding: '10px 12px', marginBottom: '12px', background: hitGoal ? 'rgba(15,163,54,0.1)' : 'rgba(28,105,212,0.1)', border: `1px solid ${hitGoal ? '#0fa336' : 'var(--m-blue)'}` }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: hitGoal ? '#0fa336' : 'var(--m-blue)' }}>
                {hitGoal ? '🎉 이번 달 목표 달성!' : `🎯 이번 달 목표: ${ex.goalWeight}kg`}
              </span>
              {!hitGoal && lastSaved && (
                <span style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: '8px' }}>{lastSaved}kg → {ex.goalWeight}kg</span>
              )}
            </div>
          )}

          <p style={{ color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px' }}>무게 기록 · 입력 후 자동저장</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Array.from({ length: ex.sets }).map((_, i) => {
              const saved = getSavedWeight(i);
              const inputKey = `${ex.id}-${i}`;
              const metGoal = ex.goalWeight > 0 && saved >= ex.goalWeight;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', width: '40px', flexShrink: 0 }}>SET {i + 1}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, width: '40px', flexShrink: 0 }}>× 12회</span>
                  <input
                    type="number" inputMode="decimal"
                    placeholder={saved != null ? `${saved}` : 'kg'}
                    value={weightInputs[inputKey] ?? ''}
                    onChange={e => handleChange(i, e.target.value)}
                    onBlur={() => handleBlur(i)}
                    style={{ flex: 1, minWidth: 0, background: 'var(--surface-soft)', color: '#fff', fontSize: '13px', textAlign: 'center', border: `1px solid ${weightInputs[inputKey] ? 'var(--m-blue)' : 'var(--hairline)'}`, padding: '8px', outline: 'none', borderRadius: 0, fontFamily: 'inherit' }}
                  />
                  <span style={{ fontSize: '10px', width: '16px', flexShrink: 0, color: metGoal ? '#0fa336' : 'var(--muted)' }}>{metGoal ? '✓' : 'kg'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Workout({ appData }) {
  const { getDayRecord, toggleWorkout, saveSet, calcProgress } = appData;
  const [viewDate, setViewDate] = useState(todayStr);

  const dayStr = getDayOfWeekStr(viewDate);
  const workouts = month1Workouts[dayStr] || [];
  const isToday = viewDate === todayStr;
  const viewRecord = getDayRecord(viewDate);
  const progress = calcProgress(viewDate, 'workout');

  const navigate = (delta) => setViewDate(d => offsetDate(d, delta));

  const jumpToDay = (targetDayStr) => {
    const todayDow = new Date(todayStr + 'T00:00:00').getDay();
    const targetDow = DAY_ORDER.indexOf(targetDayStr);
    let diff = targetDow - todayDow;
    if (diff < 0) diff += 7;
    setViewDate(offsetDate(todayStr, diff));
  };

  const getSavedCardioMin = (taskId) => viewRecord.sets?.[taskId]?.[0]?.reps;
  const handleSaveCardioMin = (taskId, min) => saveSet(viewDate, taskId, 0, { weight: 0, reps: min });
  const dateLabel = isToday ? '오늘' : viewDate.slice(5).replace('-', '/');
  const hairline = '1px solid var(--hairline)';
  const labelStyle = { color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--canvas)' }}>
      {/* 헤더 */}
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={labelStyle}>운동 기록</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ border: hairline, background: 'transparent', color: 'var(--body)', padding: '8px 12px', cursor: 'pointer', borderRadius: 0, fontSize: '13px' }}>◀</button>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{dayStr}</h1>
            <p style={{ color: isToday ? 'var(--m-blue)' : 'var(--muted)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '4px 0 0' }}>{dateLabel}</p>
          </div>
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

      {/* 요일 탭 */}
      <div style={{ margin: '0 20px 16px', borderBottom: hairline, display: 'flex', gap: 0, overflowX: 'auto' }}>
        {weeklySchedule.map((s) => {
          const isSelected = s.day === dayStr;
          const hasCardio = (month1Workouts[s.day] || []).some(e => e.cardio);
          return (
            <button
              key={s.day}
              onClick={() => jumpToDay(s.day)}
              style={{
                flexShrink: 0, padding: '8px 12px', background: 'transparent', border: 'none',
                borderBottom: isSelected ? '2px solid var(--m-blue)' : '2px solid transparent',
                color: isSelected ? '#fff' : 'var(--muted)',
                fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {s.day.slice(0, 1)}요일 {hasCardio ? '🏃' : '💪'}
            </button>
          );
        })}
      </div>

      {/* 완료율 */}
      <div style={{ margin: '0 20px 16px', border: hairline, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <p style={labelStyle}>완료율</p>
          <p style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
            {progress}<span style={{ fontSize: '12px', fontWeight: 300, color: 'var(--body)' }}>%</span>
          </p>
        </div>
        <div style={{ background: 'var(--surface-card)', height: '2px' }}>
          <div style={{ background: 'linear-gradient(to right, var(--m-blue-light), var(--m-blue))', height: '100%', width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>
        {progress === 100 && (
          <p style={{ textAlign: 'center', color: '#0fa336', fontWeight: 700, fontSize: '12px', marginTop: '12px' }} className="pop-anim">🎉 오늘 운동 완료! 최고야!</p>
        )}
      </div>

      {/* 운동 목록 */}
      <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {workouts.map((ex) => {
          const done = viewRecord.workout[ex.id];
          if (ex.cardio) {
            return (
              <CardioCard
                key={ex.id} ex={ex} done={done}
                onToggle={() => appData.toggleWorkout(viewDate, ex.id)}
                savedMin={getSavedCardioMin(ex.id)}
                onSaveMin={(min) => handleSaveCardioMin(ex.id, min)}
              />
            );
          }
          return (
            <WeightCard
              key={ex.id} ex={ex} done={done}
              onToggle={() => appData.toggleWorkout(viewDate, ex.id)}
              viewRecord={viewRecord}
              onSaveSet={(taskId, setIdx, data) => appData.saveSet(viewDate, taskId, setIdx, data)}
            />
          );
        })}
      </div>
    </div>
  );
}
