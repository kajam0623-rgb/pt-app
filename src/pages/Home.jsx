import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MStripe from '../components/MStripe';
import { todayStr, getDayOfWeekStr, month1Workouts, weeklySchedule } from '../data/workoutData';
import { getScoreGrade, DAILY_GOALS } from '../data/foodData';

const KOREAN_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Home({ appData }) {
  const { streak, calcProgress, getDayRecord, saveBodyweight, profile } = appData;
  const navigate = useNavigate();
  const [bwInput, setBwInput] = useState('');
  const [bwSaved, setBwSaved] = useState(false);

  const today = new Date();
  const todayRecord = getDayRecord(todayStr);
  const dayStr = getDayOfWeekStr(todayStr);
  const todaySchedule = weeklySchedule.find(s => s.day === dayStr);
  const workoutProgress = calcProgress(todayStr, 'workout');

  const todayFoods = todayRecord.foods || [];
  const totalCalories = todayFoods.reduce((s, f) => s + f.calories, 0);

  const handleSaveBw = () => {
    const w = parseFloat(bwInput);
    if (!isNaN(w) && w > 0) {
      saveBodyweight(todayStr, w);
      setBwSaved(true);
      setTimeout(() => setBwSaved(false), 2000);
      setBwInput('');
    }
  };

  const muscleProgress = Math.max(0, Math.min(100,
    Math.round(((profile.stats.muscle - 36.0) / (profile.goals.muscle - 36.0)) * 100)
  ));

  const labelStyle = {
    color: 'var(--muted)',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: '0 0 6px',
  };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--canvas)' }}>
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <p style={{ color: 'var(--muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px' }}>
          {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일 ({KOREAN_DAYS[today.getDay()]}요일)
        </p>
        <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.0, margin: 0 }}>
          오늘도<br />성장하는 날
        </h1>
      </div>

      {/* M 스트라이프 */}
      <div className="mx-5 mb-4">
        <MStripe />
      </div>

      {/* 스트릭 + 루틴 스펙 셀 */}
      <div className="mx-5 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--hairline)' }}>
        <div style={{ background: 'var(--surface-soft)', padding: '16px' }}>
          <p style={labelStyle}>연속 출석</p>
          <p style={{ color: '#fff', fontSize: '32px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
            {streak.current}<span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--body)' }}>일</span>
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '4px 0 0' }}>최고 기록: {streak.longest}일</p>
        </div>
        <div style={{ background: 'var(--surface-soft)', padding: '16px' }}>
          <p style={labelStyle}>오늘 루틴</p>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            {todaySchedule?.workout || '-'}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '4px 0 0' }}>{dayStr}</p>
        </div>
      </div>

      {/* 달성률 스펙 셀 3개 */}
      <div className="mx-5 mb-4">
        <p style={labelStyle}>오늘의 달성률</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--hairline)' }}>
          <div style={{ background: 'var(--surface-soft)', padding: '14px 12px' }}>
            <p style={{ ...labelStyle, margin: '0 0 4px' }}>운동</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
              {workoutProgress}<span style={{ fontSize: '11px', fontWeight: 300, color: 'var(--body)' }}>%</span>
            </p>
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '14px 12px' }}>
            <p style={{ ...labelStyle, margin: '0 0 4px' }}>칼로리</p>
            <p style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
              {totalCalories}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--body)' }}>kcal</span>
            </p>
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '14px 12px' }}>
            <p style={{ ...labelStyle, margin: '0 0 4px' }}>체중</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
              {todayRecord.bodyweight ?? profile.stats.weight}
              <span style={{ fontSize: '11px', fontWeight: 300, color: 'var(--body)' }}>kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* 체중 입력 */}
      <div className="mx-5 mb-4" style={{ border: '1px solid var(--hairline)' }}>
        <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            step="0.1"
            placeholder={todayRecord.bodyweight ? `${todayRecord.bodyweight}kg` : 'kg 입력'}
            value={bwInput}
            onChange={e => setBwInput(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--body)',
              fontSize: '13px',
              fontWeight: 300,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSaveBw}
            style={{
              border: `1px solid ${bwSaved ? 'var(--m-blue)' : '#ffffff'}`,
              background: bwSaved ? 'var(--m-blue)' : 'transparent',
              color: '#ffffff',
              padding: '8px 16px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            {bwSaved ? '✓' : '저장'}
          </button>
        </div>
      </div>

      {/* 골격근량 진행률 */}
      <div className="mx-5 mb-4" style={{ border: '1px solid var(--hairline)', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <p style={labelStyle}>골격근량 목표</p>
          <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, margin: 0 }}>
            {profile.stats.muscle}kg → {profile.goals.muscle}kg
          </p>
        </div>
        <div style={{ background: 'var(--surface-card)', height: '2px', marginBottom: '6px' }}>
          <div style={{
            background: 'linear-gradient(to right, var(--m-blue-light), var(--m-blue))',
            height: '100%',
            width: `${muscleProgress}%`,
          }} />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: 0 }}>
          목표까지 {(profile.goals.muscle - profile.stats.muscle).toFixed(1)}kg 남음
        </p>
      </div>

      {/* 빠른 실행 버튼 */}
      <div className="mx-5 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          onClick={() => navigate('/workout')}
          style={{ background: 'var(--m-blue)', padding: '16px', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 0 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px' }}>운동 시작</p>
          <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{dayStr} 루틴 →</p>
        </button>
        <button
          onClick={() => navigate('/diet')}
          style={{ border: '1px solid var(--hairline)', background: 'transparent', padding: '16px', textAlign: 'left', cursor: 'pointer', borderRadius: 0 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px' }}>식단 기록</p>
          <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>오늘 식단 →</p>
        </button>
      </div>
    </div>
  );
}
