import { useState } from 'react';
import { todayStr, getDayOfWeekStr, month1Workouts, weeklySchedule, formatDate } from '../data/workoutData';

const DAY_ORDER = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function offsetDate(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return formatDate(d);
}

function FreeDay() {
  return (
    <div className="mx-5 bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 text-center">
      <p className="text-5xl mb-3">🎯</p>
      <p className="text-white font-bold text-xl mb-2">자율 운동의 날</p>
      <p className="text-gray-400 text-sm mb-4">오늘은 정해진 루틴 없이 자유롭게!</p>
      <div className="text-left space-y-2 bg-[#2A2A2A] rounded-xl p-4">
        <p className="text-gray-300 text-xs font-semibold mb-2">💡 추천 활동</p>
        {['하고 싶은 부위 추가 운동', '가벼운 유산소 (걷기, 자전거)', '전신 스트레칭 및 폼롤러', '완전한 휴식도 OK'].map(t => (
          <p key={t} className="text-gray-400 text-xs">• {t}</p>
        ))}
      </div>
    </div>
  );
}

export default function Workout({ appData }) {
  const { getDayRecord, toggleWorkout, saveSet, calcProgress } = appData;
  const [viewDate, setViewDate] = useState(todayStr);
  const [expandedId, setExpandedId] = useState(null);
  const [weightInputs, setWeightInputs] = useState({});
  const [savedKeys, setSavedKeys] = useState({});

  const dayStr = getDayOfWeekStr(viewDate);
  const workouts = month1Workouts[dayStr] || [];
  const schedule = weeklySchedule.find(s => s.day === dayStr);
  const isFreeDay = schedule?.type === 'free';
  const isToday = viewDate === todayStr;
  const viewRecord = getDayRecord(viewDate);
  const progress = calcProgress(viewDate, 'workout');

  const navigate = (delta) => {
    setViewDate(d => offsetDate(d, delta));
    setExpandedId(null);
  };

  const jumpToDay = (targetDayStr) => {
    const todayDow = new Date(todayStr + 'T00:00:00').getDay();
    const targetDow = DAY_ORDER.indexOf(targetDayStr);
    let diff = targetDow - todayDow;
    if (diff < 0) diff += 7;
    setViewDate(offsetDate(todayStr, diff));
    setExpandedId(null);
  };

  const handleWeightInput = (taskId, setIdx, val) => {
    setWeightInputs(prev => ({ ...prev, [`${taskId}-${setIdx}`]: val }));
  };

  const handleSaveWeight = (taskId, setIdx) => {
    const weight = parseFloat(weightInputs[`${taskId}-${setIdx}`]);
    if (!isNaN(weight) && weight > 0) {
      saveSet(viewDate, taskId, setIdx, { weight, reps: 12 });
      const key = `${taskId}-${setIdx}`;
      setSavedKeys(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setSavedKeys(prev => ({ ...prev, [key]: false })), 1500);
    }
  };

  const getSavedWeight = (taskId, setIdx) => viewRecord.sets?.[taskId]?.[setIdx]?.weight;

  const dateLabel = isToday ? '오늘' : viewDate.slice(5).replace('-', '/');

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      {/* 헤더 + 날짜 화살표 */}
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
          <button onClick={() => { setViewDate(todayStr); setExpandedId(null); }} className="mt-2 w-full text-center text-xs text-blue-400 py-1">
            오늘로 돌아가기
          </button>
        )}
      </div>

      {/* 요일 탭 */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-1">
        {weeklySchedule.map((s) => {
          const isSelected = s.day === dayStr;
          return (
            <button
              key={s.day}
              onClick={() => jumpToDay(s.day)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all
                ${isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : s.type === 'workout'
                    ? 'bg-[#1A1A1A] text-blue-400 border-blue-500/30'
                    : 'bg-[#1A1A1A] text-gray-500 border-white/10'
                }`}
            >
              {s.day.slice(0, 1)}요일 {s.type === 'workout' ? '💪' : '🎯'}
            </button>
          );
        })}
      </div>

      {/* 진행률 바 */}
      {!isFreeDay && workouts.length > 0 && (
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
      )}

      {/* 메인 */}
      {isFreeDay ? <FreeDay /> : (
        <div className="mx-5 space-y-3">
          {workouts.map((ex) => {
            const done = viewRecord.workout[ex.id];
            const isExpanded = expandedId === ex.id;

            return (
              <div key={ex.id} className={`bg-[#1A1A1A] rounded-2xl border transition-all ${done ? 'border-blue-500/30' : 'border-white/5'}`}>
                {/* 운동 헤더 */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWorkout(viewDate, ex.id); }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90
                      ${done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}
                  >
                    {done && <span className="text-white text-xs">✓</span>}
                  </button>
                  <span className="text-lg flex-shrink-0">{ex.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${done ? 'text-gray-500 line-through' : 'text-white'}`}>{ex.name}</p>
                    <p className="text-gray-500 text-xs">{ex.sets}세트 × {ex.reps} · {ex.target}</p>
                  </div>
                  <span className="text-gray-600 text-xs flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* 펼쳐진 상세 */}
                {isExpanded && (
                  <div className="px-4 pb-4 slide-up">
                    {/* 기구 사용법 */}
                    <div className="bg-[#242424] rounded-xl p-3 mb-3">
                      <p className="text-blue-400 text-xs font-bold mb-2">📋 기구 사용법</p>
                      {ex.how.split('\n').map((line, i) => (
                        <p key={i} className="text-gray-300 text-xs leading-relaxed">{line}</p>
                      ))}
                    </div>
                    <div className="bg-[#242424] rounded-xl p-3 mb-3">
                      <p className="text-yellow-400 text-xs font-bold mb-1">✨ 핵심 포인트</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{ex.point}</p>
                    </div>

                    {/* 무게 기록 — 세트별 1행 */}
                    <p className="text-gray-400 text-xs font-semibold mb-2">오늘 사용한 무게 (kg)</p>
                    <div className="space-y-2">
                      {Array.from({ length: ex.sets }).map((_, i) => {
                        const saved = getSavedWeight(ex.id, i);
                        const inputKey = `${ex.id}-${i}`;
                        const isSaved = savedKeys[inputKey];
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs w-12 flex-shrink-0">Set {i + 1}</span>
                            <span className="text-gray-600 text-xs w-14 flex-shrink-0">× 12회</span>
                            <input
                              type="number"
                              inputMode="decimal"
                              placeholder={saved != null ? `${saved}` : 'kg'}
                              value={weightInputs[inputKey] ?? ''}
                              onChange={e => handleWeightInput(ex.id, i, e.target.value)}
                              className="flex-1 min-w-0 bg-[#2A2A2A] text-white text-sm text-center rounded-lg px-2 py-2 border border-white/10 focus:outline-none focus:border-blue-500"
                            />
                            <span className="text-gray-500 text-xs w-4 flex-shrink-0">kg</span>
                            <button
                              onClick={() => handleSaveWeight(ex.id, i)}
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
          })}
        </div>
      )}
    </div>
  );
}
