import { useState } from 'react';
import { formatDate, getDayOfWeekStr, month1Workouts, dailyDietTasks } from '../data/workoutData';

const todayStr = formatDate(new Date());

export default function Calendar({ appData }) {
  const { calcProgress, getDayRecord, toggleWorkout, toggleDiet } = appData;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d;
    });
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const selectedDayStr = getDayOfWeekStr(selectedDate);
  const selectedWorkouts = month1Workouts[selectedDayStr] || [];
  const selectedRecord = getDayRecord(selectedDate);
  const workoutProgress = calcProgress(selectedDate, 'workout');
  const dietProgress = calcProgress(selectedDate, 'diet');

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      <div className="px-5 pt-12 pb-4">
        <p className="text-gray-500 text-sm">기록 보기</p>
        <h1 className="text-2xl font-black text-white mt-1">실천 달력</h1>
      </div>

      {/* 달력 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-gray-400 active:scale-90">◀</button>
          <p className="text-white font-bold">{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</p>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-gray-400 active:scale-90">▶</button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {getCalendarDays().map((date, idx) => {
            const ds = formatDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isSelected = ds === selectedDate;
            const isToday = ds === todayStr;
            const wp = calcProgress(ds, 'workout');
            const dp = calcProgress(ds, 'diet');
            const hasRecord = wp > 0 || dp > 0;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(ds)}
                className={`min-h-[52px] rounded-xl flex flex-col items-center p-1 transition-all active:scale-95
                  ${!isCurrentMonth ? 'opacity-25' : ''}
                  ${isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : 'hover:bg-white/5'}
                `}
              >
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-blue-600 text-white' : 'text-gray-300'}
                `}>{date.getDate()}</span>
                {hasRecord && (
                  <div className="w-full px-0.5 mt-auto space-y-0.5">
                    <div className="w-full h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${wp === 100 ? 'bg-blue-500' : 'bg-blue-400/60'}`} style={{ width: `${wp}%` }} />
                    </div>
                    <div className="w-full h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${dp === 100 ? 'bg-orange-500' : 'bg-orange-400/60'}`} style={{ width: `${dp}%` }} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 justify-end mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full inline-block" /> 운동</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full inline-block" /> 식단</span>
        </div>
      </div>

      {/* 선택 날짜 상세 */}
      {selectedDate && (
        <div className="mx-5 space-y-3">
          <p className="text-gray-400 text-sm font-semibold">
            {selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일 ({selectedDayStr}) — 운동 {workoutProgress}% · 식단 {dietProgress}%
          </p>

          {/* 운동 체크 */}
          {selectedWorkouts.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-2xl border border-white/5">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white font-bold text-sm">💪 운동</p>
              </div>
              <div className="p-3 space-y-2">
                {selectedWorkouts.map(task => {
                  const done = selectedRecord.workout[task.id];
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleWorkout(selectedDate, task.id)}
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all active:scale-98 ${done ? 'bg-blue-500/20' : 'bg-[#2A2A2A]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                        {done && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${done ? 'text-blue-300 line-through opacity-70' : 'text-gray-200'}`}>
                          {task.emoji} {task.name}
                        </p>
                        <p className="text-gray-500 text-xs">{task.sets > 0 ? `${task.sets}세트` : ''} {task.reps}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 식단 체크 */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-white font-bold text-sm">🍱 식단</p>
            </div>
            <div className="p-3 space-y-2">
              {dailyDietTasks.map(task => {
                const done = selectedRecord.diet[task.id];
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleDiet(selectedDate, task.id)}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all active:scale-98 ${done ? 'bg-orange-500/20' : 'bg-[#2A2A2A]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${done ? 'bg-orange-500 border-orange-500' : 'border-gray-600'}`}>
                      {done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${done ? 'text-orange-300 line-through opacity-70' : 'text-gray-200'}`}>{task.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
