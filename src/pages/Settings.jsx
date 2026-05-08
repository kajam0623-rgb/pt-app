import { useState, useEffect } from 'react';

export default function Settings({ appData }) {
  const { profile, setProfile } = appData;

  const [stats, setStats] = useState({ ...profile.stats });
  const [goals, setGoals] = useState({ ...profile.goals });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('stats');

  useEffect(() => {
    setStats({ ...profile.stats });
    setGoals({ ...profile.goals });
  }, [profile]);

  const updateStat = (key, val) => setStats(prev => ({ ...prev, [key]: val }));
  const updateGoal = (key, val) => setGoals(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const parsed = {
      stats: {
        weight: parseFloat(stats.weight) || profile.stats.weight,
        muscle: parseFloat(stats.muscle) || profile.stats.muscle,
        fat: parseFloat(stats.fat) || profile.stats.fat,
        bmr: parseInt(stats.bmr) || profile.stats.bmr,
      },
      goals: {
        weight: parseFloat(goals.weight) || profile.goals.weight,
        muscle: parseFloat(goals.muscle) || profile.goals.muscle,
        fatMax: parseFloat(goals.fatMax) || profile.goals.fatMax,
      },
    };
    setProfile(parsed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const muscleGap = (parseFloat(goals.muscle) - parseFloat(stats.muscle)).toFixed(1);
  const weightGap = (parseFloat(goals.weight) - parseFloat(stats.weight)).toFixed(1);

  const NumInput = ({ label, value, onChange, unit, step = '0.1', desc }) => (
    <div className="py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-200 text-sm font-semibold">{label}</p>
          {desc && <p className="text-gray-500 text-xs mt-0.5">{desc}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange((parseFloat(value) - parseFloat(step)).toFixed(step.includes('.') ? 1 : 0))}
            className="w-8 h-8 rounded-lg bg-[#2A2A2A] text-gray-300 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
          >−</button>
          <input
            type="number"
            step={step}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-20 bg-[#2A2A2A] text-white text-sm text-center rounded-lg px-2 py-2 border border-white/10 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => onChange((parseFloat(value) + parseFloat(step)).toFixed(step.includes('.') ? 1 : 0))}
            className="w-8 h-8 rounded-lg bg-[#2A2A2A] text-gray-300 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
          >+</button>
          <span className="text-gray-500 text-xs w-8">{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      <div className="px-5 pt-12 pb-4">
        <p className="text-gray-500 text-sm">내 정보 관리</p>
        <h1 className="text-2xl font-black text-white mt-1">설정 ⚙️</h1>
      </div>

      {/* 현재 vs 목표 요약 카드 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <p className="text-gray-400 text-xs mb-3">현재 → 목표 요약</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#2A2A2A] rounded-xl p-3">
            <p className="text-gray-500 text-xs">체중</p>
            <p className="text-white font-black text-lg mt-0.5">
              {stats.weight}<span className="text-gray-400 text-xs font-normal">kg</span>
              <span className="text-gray-500 text-xs font-normal ml-1">→ {goals.weight}kg</span>
            </p>
            <p className={`text-xs mt-1 font-semibold ${parseFloat(weightGap) > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(weightGap) > 0 ? '+' : ''}{weightGap}kg 필요
            </p>
          </div>
          <div className="bg-[#2A2A2A] rounded-xl p-3">
            <p className="text-gray-500 text-xs">골격근량</p>
            <p className="text-white font-black text-lg mt-0.5">
              {stats.muscle}<span className="text-gray-400 text-xs font-normal">kg</span>
              <span className="text-gray-500 text-xs font-normal ml-1">→ {goals.muscle}kg</span>
            </p>
            <p className={`text-xs mt-1 font-semibold ${parseFloat(muscleGap) > 0 ? 'text-blue-400' : 'text-green-400'}`}>
              {parseFloat(muscleGap) > 0 ? `+${muscleGap}kg 필요` : '목표 달성! 🎉'}
            </p>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="mx-5 mb-4 flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5">
        <button
          onClick={() => setActiveSection('stats')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === 'stats' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
        >
          현재 수치
        </button>
        <button
          onClick={() => setActiveSection('goals')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === 'goals' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
        >
          목표 수치
        </button>
      </div>

      {/* 현재 수치 섹션 */}
      {activeSection === 'stats' && (
        <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden slide-up">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-white font-bold text-sm">인바디 수치 업데이트</p>
            <p className="text-gray-500 text-xs mt-0.5">측정 후 바로 업데이트하세요</p>
          </div>
          <div className="px-4">
            <NumInput label="체중" value={stats.weight} onChange={v => updateStat('weight', v)} unit="kg" step="0.1" />
            <NumInput label="골격근량" value={stats.muscle} onChange={v => updateStat('muscle', v)} unit="kg" step="0.1" desc="인바디 결과지의 골격근량" />
            <NumInput label="체지방률" value={stats.fat} onChange={v => updateStat('fat', v)} unit="%" step="0.1" />
            <NumInput label="기초대사량" value={stats.bmr} onChange={v => updateStat('bmr', v)} unit="kcal" step="1" />
          </div>
        </div>
      )}

      {/* 목표 수치 섹션 */}
      {activeSection === 'goals' && (
        <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden slide-up">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-white font-bold text-sm">목표 수치 설정</p>
            <p className="text-gray-500 text-xs mt-0.5">언제든지 수정 가능</p>
          </div>
          <div className="px-4">
            <NumInput label="목표 체중" value={goals.weight} onChange={v => updateGoal('weight', v)} unit="kg" step="0.1" />
            <NumInput label="목표 골격근량" value={goals.muscle} onChange={v => updateGoal('muscle', v)} unit="kg" step="0.1" desc="3개월 1차 목표" />
            <NumInput label="체지방률 최대" value={goals.fatMax} onChange={v => updateGoal('fatMax', v)} unit="%" step="0.1" desc="이 이상 넘지 않도록 관리" />
          </div>
          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-gray-600 text-xs text-center">장기 목표: 골격근량 40kg</p>
          </div>
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="mx-5 mb-4">
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 ${saved ? 'bg-green-500' : 'bg-blue-600'}`}
        >
          {saved ? '✓ 저장 완료!' : '저장하기'}
        </button>
      </div>

      {/* 앱 정보 */}
      <div className="mx-5 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <p className="text-gray-500 text-xs text-center">3개월 골격근량 증가 마스터 플랜</p>
        <p className="text-gray-600 text-xs text-center mt-1">💾 모든 데이터는 이 기기에만 저장됩니다</p>
      </div>
    </div>
  );
}
