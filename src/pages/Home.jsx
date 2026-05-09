import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RingChart from '../components/RingChart';
import { todayStr, getDayOfWeekStr, month1Workouts, weeklySchedule } from '../data/workoutData';
import { getScoreGrade, DAILY_GOALS } from '../data/foodData';

const KOREAN_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Home({ appData }) {
  const { streak, calcProgress, getDayRecord, toggleWorkout, saveBodyweight, profile } = appData;
  const navigate = useNavigate();
  const [bwInput, setBwInput] = useState('');
  const [bwSaved, setBwSaved] = useState(false);

  const today = new Date();
  const todayRecord = getDayRecord(todayStr);
  const dayStr = getDayOfWeekStr(todayStr);
  const todaySchedule = weeklySchedule.find(s => s.day === dayStr);
  const workoutProgress = calcProgress(todayStr, 'workout');
  const dietProgress = calcProgress(todayStr, 'diet');
  const workouts = month1Workouts[dayStr] || [];

  const todayFoods = todayRecord.foods || [];
  const totalCalories = todayFoods.reduce((s, f) => s + f.calories, 0);
  const avgScore = todayFoods.length > 0 ? todayFoods.reduce((s, f) => s + f.score, 0) / todayFoods.length : 0;
  const dietGrade = getScoreGrade(avgScore);

  const handleSaveBw = () => {
    const w = parseFloat(bwInput);
    if (!isNaN(w) && w > 0) {
      saveBodyweight(todayStr, w);
      setBwSaved(true);
      setTimeout(() => setBwSaved(false), 2000);
      setBwInput('');
    }
  };

  const muscleProgress = Math.round(
    ((profile.stats.muscle - 36.0) / (profile.goals.muscle - 36.0)) * 100
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <p className="text-gray-500 text-sm">
          {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일 ({KOREAN_DAYS[today.getDay()]}요일)
        </p>
        <h1 className="text-2xl font-black text-white mt-1">오늘도 성장하는 날 💪</h1>
      </div>

      {/* 스트릭 배너 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 flex items-center justify-between border border-white/5">
        <div>
          <p className="text-gray-400 text-xs mb-1">연속 출석</p>
          <p className="text-3xl font-black text-white">
            🔥 {streak.current}<span className="text-lg font-semibold text-gray-400">일</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">최고 기록: {streak.longest}일</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs mb-1">오늘 루틴</p>
          <p className={`text-sm font-bold ${
            todaySchedule?.type === 'free' ? 'text-yellow-400'
            : todaySchedule?.type === 'workout' ? 'text-blue-400'
            : 'text-gray-400'
          }`}>
            {todaySchedule?.workout || '-'}
          </p>
        </div>
      </div>

      {/* 진행률 링 차트 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-5 border border-white/5">
        <p className="text-gray-400 text-xs mb-4">오늘의 달성률</p>
        <div className="flex justify-around">
          <RingChart percent={workoutProgress} color="#3B82F6" size={100} strokeWidth={10} label="운동" sublabel={`${workouts.filter(w => todayRecord.workout[w.id]).length}/${workouts.length}`} />
          <RingChart percent={dietProgress} color="#F97316" size={100} strokeWidth={10} label="칼로리" sublabel={`${totalCalories}kcal`} />
        </div>
        {todayFoods.length > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ color: dietGrade.color, backgroundColor: dietGrade.color + '20' }}>
              식단 {dietGrade.label}등급
            </span>
            <span className="text-gray-500 text-xs">{dietGrade.msg}</span>
          </div>
        )}
      </div>

      {/* 체중 입력 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <p className="text-gray-400 text-xs mb-3">오늘 체중 기록</p>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder={todayRecord.bodyweight ? `${todayRecord.bodyweight}kg` : "kg 입력"}
            value={bwInput}
            onChange={e => setBwInput(e.target.value)}
            className="flex-1 bg-[#2A2A2A] text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSaveBw}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${bwSaved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}
          >
            {bwSaved ? '✓' : '저장'}
          </button>
        </div>
      </div>

      {/* 목표 진행률 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-xs">골격근량 목표 달성률</p>
          <p className="text-xs text-blue-400 font-bold">{profile.stats.muscle}kg → {profile.goals.muscle}kg</p>
        </div>
        <div className="w-full bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(100, muscleProgress))}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">현재 {profile.stats.muscle}kg (목표까지 {(profile.goals.muscle - profile.stats.muscle).toFixed(1)}kg 남음)</p>
      </div>

      {/* 빠른 실행 버튼 */}
      <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/workout')}
          className="bg-blue-600 rounded-2xl p-4 text-left active:scale-95 transition-transform"
        >
          <p className="text-2xl mb-2">💪</p>
          <p className="text-white font-bold text-sm">운동 시작</p>
          <p className="text-blue-200 text-xs mt-0.5">{dayStr} 루틴 보기</p>
        </button>
        <button
          onClick={() => navigate('/diet')}
          className="bg-orange-600 rounded-2xl p-4 text-left active:scale-95 transition-transform"
        >
          <p className="text-2xl mb-2">🍱</p>
          <p className="text-white font-bold text-sm">식단 기록</p>
          <p className="text-orange-200 text-xs mt-0.5">
            {todayFoods.length > 0 ? `${dietGrade.label}등급 · ${totalCalories}kcal` : '오늘 뭐 먹었어?'}
          </p>
        </button>
      </div>
    </div>
  );
}
