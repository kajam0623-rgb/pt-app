import { useState } from 'react';
import MStripe from '../components/MStripe';
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

  const hairline = '1px solid var(--hairline)';
  const labelStyle = { color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={labelStyle}>기록 보기</p>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', margin: '6px 0 0', lineHeight: 1.0 }}>실천 달력</h1>
      </div>

      <div style={{ margin: '0 20px 16px' }}><MStripe /></div>

      {/* 달력 */}
      <div style={{ margin: '0 20px 16px', border: hairline, padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={prevMonth} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' }}>◀</button>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', margin: 0 }}>{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</p>
          <button onClick={nextMonth} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' }}>▶</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} style={{ fontSize: '10px', fontWeight: 700, color: i === 0 ? 'var(--m-red)' : i === 6 ? 'var(--m-blue)' : 'var(--muted)' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
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
                style={{
                  minHeight: '52px', borderRadius: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px',
                  background: isSelected ? 'rgba(28,105,212,0.15)' : 'transparent',
                  border: isSelected ? '1px solid var(--m-blue)' : '1px solid transparent',
                  cursor: 'pointer',
                  opacity: isCurrentMonth ? 1 : 0.25,
                }}
              >
                <span style={{
                  fontSize: '11px', fontWeight: 700, width: '22px', height: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0,
                  background: isToday ? 'var(--m-blue)' : 'transparent',
                  color: isToday ? '#fff' : isCurrentMonth ? 'var(--body)' : 'var(--muted)',
                }}>{date.getDate()}</span>
                {hasRecord && (
                  <div style={{ width: '100%', paddingLeft: '2px', paddingRight: '2px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ width: '100%', height: '2px', background: 'var(--surface-card)' }}>
                      <div style={{ height: '100%', background: wp === 100 ? 'var(--m-blue)' : 'rgba(28,105,212,0.5)', width: `${wp}%` }} />
                    </div>
                    <div style={{ width: '100%', height: '2px', background: 'var(--surface-card)' }}>
                      <div style={{ height: '100%', background: dp === 100 ? 'var(--m-red)' : 'rgba(226,39,24,0.4)', width: `${dp}%` }} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--muted)' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--m-blue)', display: 'inline-block' }} /> 운동
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--muted)' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--m-red)', display: 'inline-block' }} /> 식단
          </span>
        </div>
      </div>

      {/* 선택 날짜 상세 */}
      {selectedDate && (
        <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
            {selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일 ({selectedDayStr}) — 운동 {workoutProgress}% · 식단 {dietProgress}%
          </p>

          {selectedWorkouts.length > 0 && (
            <div style={{ border: '1px solid var(--hairline)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hairline)' }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', margin: 0 }}>운동</p>
              </div>
              <div style={{ padding: '8px' }}>
                {selectedWorkouts.map(task => {
                  const done = selectedRecord.workout[task.id];
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleWorkout(selectedDate, task.id)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                        background: done ? 'rgba(28,105,212,0.15)' : 'var(--surface-soft)',
                        border: '1px solid var(--hairline)', borderRadius: 0, cursor: 'pointer', marginBottom: '4px',
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 0,
                        border: done ? 'none' : '2px solid var(--hairline)',
                        background: done ? 'var(--m-blue)' : 'transparent',
                      }}>
                        {done && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: done ? 'var(--m-blue)' : 'var(--body)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.7 : 1 }}>
                          {task.name}
                        </p>
                        <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>{task.sets > 0 ? `${task.sets}세트` : ''} {task.reps}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ border: '1px solid var(--hairline)', marginBottom: '16px' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hairline)' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', margin: 0 }}>식단</p>
            </div>
            <div style={{ padding: '8px' }}>
              {dailyDietTasks.map(task => {
                const done = selectedRecord.diet[task.id];
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleDiet(selectedDate, task.id)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                      background: done ? 'rgba(226,39,24,0.1)' : 'var(--surface-soft)',
                      border: '1px solid var(--hairline)', borderRadius: 0, cursor: 'pointer', marginBottom: '4px',
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 0,
                      border: done ? 'none' : '2px solid var(--hairline)',
                      background: done ? 'var(--m-red)' : 'transparent',
                    }}>
                      {done && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: done ? 'var(--m-red)' : 'var(--body)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.7 : 1 }}>{task.name}</span>
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
