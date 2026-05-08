import { useState } from 'react';
import { todayStr, getDayOfWeekStr, month1Workouts, weeklySchedule, formatDate } from '../data/workoutData';

const DAY_ORDER = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function offsetDate(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return formatDate(d);
}

// 유산소 카드
function CardioCard({ ex, done, onToggle, viewDate, savedMin, onSaveMin }) {
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

  return (
    <div className={`bg-[#1A1A1A] rounded-2xl border transition-all ${done ? 'border-green-500/30' : 'border-white/5'}`}>
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90
            ${done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}
        >
          {done && <span className="text-white text-xs">✓</span>}
        </button>
        <span className="text-lg flex-shrink-0">{ex.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-bold text-sm ${done ? 'text-gray-500 line-through' : 'text-white'}`}>{ex.name}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">유산소</span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">{ex.reps} · 목표 {ex.cardioGoal}{ex.cardioUnit} · {ex.target}</p>
        </div>
      </div>

      {/* 유산소 상세 */}
      <div className="px-4 pb-4">
        <div className="bg-[#242424] rounded-xl p-3 mb-3">
          <p className="text-green-400 text-xs font-bold mb-2">📋 방법</p>
          {ex.how.split('\n').map((line, i) => (
            <p key={i} className="text-gray-300 text-xs leading-relaxed">{line}</p>
          ))}
        </div>
        <div className="bg-[#242424] rounded-xl p-3 mb-3">
          <p className="text-yellow-400 text-xs font-bold mb-1">✨ 포인트</p>
          <p className="text-gray-300 text-xs leading-relaxed">{ex.point}</p>
        </div>

        {/* 시간 기록 */}
        <p className="text-gray-400 text-xs font-semibold mb-2">오늘 실제 시간 기록</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={savedMin ? `${savedMin}` : `목표 ${ex.cardioGoal}분`}
            value={minInput}
            onChange={e => setMinInput(e.target.value)}
            className="flex-1 bg-[#2A2A2A] text-white text-sm text-center rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-green-500"
          />
          <span className="text-gray-500 text-xs w-4">분</span>
          <button
            onClick={handleSave}
            className={`px-4 py-2 text-xs rounded-lg font-bold active:scale-95 transition-colors
              ${saved ? 'bg-green-500 text-white' : 'bg-green-600 text-white'}`}
          >
            {saved ? '✓' : '저장'}
          </button>
        </div>
        {savedMin && (
          <p className="text-green-400 text-xs mt-1.5">
            {savedMin >= ex.cardioGoal ? `✓ 목표 달성! (${savedMin}분)` : `${savedMin}분 완료 (목표까지 ${ex.cardioGoal - savedMin}분)`}
          </p>
        )}
      </div>
    </div>
  );
}

// 웨이트 카드
function WeightCard({ ex, done, onToggle, viewRecord, onSaveSet }) {
  const [expandedId, setExpandedId] = useState(null);
  const [weightInputs, setWeightInputs] = useState({});
  const [savedKeys, setSavedKeys] = useState({});

  const isExpanded = expandedId === ex.id;

  const getSavedWeight = (setIdx) => viewRecord.sets?.[ex.id]?.[setIdx]?.weight;

  const handleSave = (setIdx) => {
    const val = parseFloat(weightInputs[`${ex.id}-${setIdx}`]);
    if (!isNaN(val) && val > 0) {
      onSaveSet(ex.id, setIdx, { weight: val, reps: 12 });
      const key = `${ex.id}-${setIdx}`;
      setSavedKeys(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setSavedKeys(prev => ({ ...prev, [key]: false })), 1500);
    }
  };

  // 목표 무게 달성 여부
  const lastSaved = getSavedWeight(ex.sets - 1);
  const hitGoal = ex.goalWeight > 0 && lastSaved >= ex.goalWeight;

  return (
    <div className={`bg-[#1A1A1A] rounded-2xl border transition-all ${done ? 'border-blue-500/30' : 'border-white/5'}`}>
      <button
        onClick={() => setExpandedId(isExpanded ? null : ex.id)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90
            ${done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}
        >
          {done && <span className="text-white text-xs">✓</span>}
        </button>
        <span className="text-lg flex-shrink-0">{ex.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm truncate ${done ? 'text-gray-500 line-through' : 'text-white'}`}>{ex.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-gray-500 text-xs">{ex.sets}세트 × {ex.reps}</span>
            {ex.goalWeight > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                ${hitGoal ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {hitGoal ? '✓ ' : ''}목표 {ex.goalWeight}kg
              </span>
            )}
          </div>
        </div>
        <span className="text-gray-600 text-xs flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 slide-up">
          {/* 기구 사용법 */}
          <div className="bg-[#242424] rounded-xl p-3 mb-2">
            <p className="text-blue-400 text-xs font-bold mb-2">📋 기구 사용법</p>
            {ex.how.split('\n').map((line, i) => (
              <p key={i} className="text-gray-300 text-xs leading-relaxed">{line}</p>
            ))}
          </div>
          <div className="bg-[#242424] rounded-xl p-3 mb-3">
            <p className="text-yellow-400 text-xs font-bold mb-1">✨ 핵심 포인트</p>
            <p className="text-gray-300 text-xs leading-relaxed">{ex.point}</p>
          </div>

          {/* 목표 무게 배너 */}
          {ex.goalWeight > 0 && (
            <div className={`rounded-xl px-3 py-2 mb-3 flex items-center justify-between
              ${hitGoal ? 'bg-green-500/10 border border-green-500/30' : 'bg-blue-500/10 border border-blue-500/20'}`}>
              <span className={`text-xs font-semibold ${hitGoal ? 'text-green-400' : 'text-blue-400'}`}>
                {hitGoal ? '🎉 이번 달 목표 달성!' : `🎯 이번 달 목표: ${ex.goalWeight}kg`}
              </span>
              {!hitGoal && lastSaved && (
                <span className="text-xs text-gray-400">{lastSaved}kg → {ex.goalWeight}kg</span>
              )}
            </div>
          )}

          {/* 세트별 무게 기록 */}
          <p className="text-gray-400 text-xs font-semibold mb-2">오늘 무게 기록 (× 12회 고정)</p>
          <div className="space-y-2">
            {Array.from({ length: ex.sets }).map((_, i) => {
              const saved = getSavedWeight(i);
              const inputKey = `${ex.id}-${i}`;
              const isSaved = savedKeys[inputKey];
              const metGoal = ex.goalWeight > 0 && saved >= ex.goalWeight;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-12 flex-shrink-0">Set {i + 1}</span>
                  <span className="text-gray-600 text-xs w-12 flex-shrink-0">× 12회</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder={saved != null ? `${saved}` : 'kg'}
                    value={weightInputs[inputKey] ?? ''}
                    onChange={e => setWeightInputs(prev => ({ ...prev, [inputKey]: e.target.value }))}
                    className="flex-1 min-w-0 bg-[#2A2A2A] text-white text-sm text-center rounded-lg px-2 py-2 border border-white/10 focus:outline-none focus:border-blue-500"
                  />
                  <span className={`text-xs w-4 flex-shrink-0 ${metGoal ? 'text-green-400' : 'text-gray-500'}`}>
                    {metGoal ? '✓' : 'kg'}
                  </span>
                  <button
                    onClick={() => handleSave(i)}
                    className={`px-3 py-2 text-xs rounded-lg font-bold active:scale-95 flex-shrink-0 transition-colors
                      ${isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}
                  >
                    {isSaved ? '✓' : '저장'}
                  </button>
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

  const handleSaveCardioMin = (taskId, min) => {
    saveSet(viewDate, taskId, 0, { weight: 0, reps: min });
  };

  const dateLabel = isToday ? '오늘' : viewDate.slice(5).replace('-', '/');

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <p className="text-gray-500 text-sm">운동 기록</p>
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A1A1A] border border-white/5 text-gray-300 active:scale-90 transition-transform text-sm"
          >◀</button>
          <div className="text-center">
            <h1 className="text-xl font-black text-white">{dayStr}</h1>
            <p className={`text-xs mt-0.5 font-semibold ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>{dateLabel}</p>
          </div>
          <button
            onClick={() => navigate(1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A1A1A] border border-white/5 text-gray-300 active:scale-90 transition-transform text-sm"
          >▶</button>
        </div>
        {!isToday && (
          <button onClick={() => setViewDate(todayStr)} className="mt-2 w-full text-center text-xs text-blue-400 py-1">
            오늘로 돌아가기
          </button>
        )}
      </div>

      {/* 요일 탭 */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-1">
        {weeklySchedule.map((s) => {
          const isSelected = s.day === dayStr;
          const hasCardio = (month1Workouts[s.day] || []).some(e => e.cardio);
          return (
            <button
              key={s.day}
              onClick={() => jumpToDay(s.day)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all
                ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-[#1A1A1A] text-blue-400 border-blue-500/30'}`}
            >
              {s.day.slice(0, 1)}요일 {hasCardio ? '🏃' : '💪'}
            </button>
          );
        })}
      </div>

      {/* 진행률 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-xs">완료율</p>
          <p className="text-blue-400 font-black text-lg">{progress}%</p>
        </div>
        <div className="w-full bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && (
          <p className="text-center text-green-400 font-bold text-sm mt-3 pop-anim">🎉 오늘 운동 완료! 최고야!</p>
        )}
      </div>

      {/* 운동 목록 */}
      <div className="mx-5 space-y-3">
        {workouts.map((ex) => {
          const done = viewRecord.workout[ex.id];
          if (ex.cardio) {
            return (
              <CardioCard
                key={ex.id}
                ex={ex}
                done={done}
                onToggle={() => appData.toggleWorkout(viewDate, ex.id)}
                viewDate={viewDate}
                savedMin={getSavedCardioMin(ex.id)}
                onSaveMin={(min) => handleSaveCardioMin(ex.id, min)}
              />
            );
          }
          return (
            <WeightCard
              key={ex.id}
              ex={ex}
              done={done}
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
