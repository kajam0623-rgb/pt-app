import { useState, useEffect } from 'react';
import MStripe from '../components/MStripe';

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

  const hairline = '1px solid var(--hairline)';
  const labelStyle = { color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 };

  const NumInput = ({ label, value, onChange, unit, step = '0.1', desc }) => (
    <div style={{ padding: '12px 0', borderBottom: hairline }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'var(--body)', fontSize: '13px', fontWeight: 700, margin: 0 }}>{label}</p>
          {desc && <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>{desc}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onChange((parseFloat(value) - parseFloat(step)).toFixed(step.includes('.') ? 1 : 0))}
            style={{ width: '32px', height: '32px', background: 'var(--surface-card)', border: hairline, color: 'var(--body)', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 0 }}
          >−</button>
          <input
            type="number" step={step} value={value} onChange={e => onChange(e.target.value)}
            style={{ width: '72px', background: 'var(--surface-soft)', color: '#fff', fontSize: '13px', textAlign: 'center', border: hairline, padding: '8px', outline: 'none', borderRadius: 0, fontFamily: 'inherit' }}
          />
          <button
            onClick={() => onChange((parseFloat(value) + parseFloat(step)).toFixed(step.includes('.') ? 1 : 0))}
            style={{ width: '32px', height: '32px', background: 'var(--surface-card)', border: hairline, color: 'var(--body)', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 0 }}
          >+</button>
          <span style={{ color: 'var(--muted)', fontSize: '10px', width: '32px', fontWeight: 300 }}>{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={labelStyle}>내 정보 관리</p>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', margin: '6px 0 0', lineHeight: 1.0 }}>설정</h1>
      </div>

      <div style={{ margin: '0 20px 16px' }}><MStripe /></div>

      {/* 현재/목표 요약 스펙 셀 */}
      <div style={{ margin: '0 20px 16px', border: '1px solid var(--hairline)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--hairline)' }}>
          <div style={{ background: 'var(--surface-soft)', padding: '16px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px' }}>체중</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: 0 }}>
              {stats.weight}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--muted)' }}>kg → {goals.weight}kg</span>
            </p>
            <p style={{ color: parseFloat(weightGap) > 0 ? '#0fa336' : 'var(--m-red)', fontSize: '10px', fontWeight: 700, margin: '4px 0 0' }}>
              {parseFloat(weightGap) > 0 ? '+' : ''}{weightGap}kg 필요
            </p>
          </div>
          <div style={{ background: 'var(--surface-soft)', padding: '16px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px' }}>골격근량</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: 0 }}>
              {stats.muscle}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--muted)' }}>kg → {goals.muscle}kg</span>
            </p>
            <p style={{ color: parseFloat(muscleGap) > 0 ? 'var(--m-blue)' : '#0fa336', fontSize: '10px', fontWeight: 700, margin: '4px 0 0' }}>
              {parseFloat(muscleGap) > 0 ? `+${muscleGap}kg 필요` : '목표 달성! 🎉'}
            </p>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ margin: '0 20px 16px', borderBottom: hairline, display: 'flex' }}>
        {['stats', 'goals'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              flex: 1, padding: '10px 0', background: 'transparent', border: 'none',
              borderBottom: activeSection === section ? '2px solid var(--m-blue)' : '2px solid transparent',
              color: activeSection === section ? '#fff' : 'var(--muted)',
              fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >{section === 'stats' ? '현재 수치' : '목표 수치'}</button>
        ))}
      </div>

      {/* 현재 수치 섹션 */}
      {activeSection === 'stats' && (
        <div style={{ margin: '0 20px 16px', border: hairline }} className="slide-up">
          <div style={{ padding: '12px 16px', borderBottom: hairline }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', margin: 0 }}>인바디 수치 업데이트</p>
            <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>측정 후 바로 업데이트하세요</p>
          </div>
          <div style={{ padding: '0 16px' }}>
            <NumInput label="체중" value={stats.weight} onChange={v => updateStat('weight', v)} unit="kg" step="0.1" />
            <NumInput label="골격근량" value={stats.muscle} onChange={v => updateStat('muscle', v)} unit="kg" step="0.1" desc="인바디 결과지의 골격근량" />
            <NumInput label="체지방률" value={stats.fat} onChange={v => updateStat('fat', v)} unit="%" step="0.1" />
            <NumInput label="기초대사량" value={stats.bmr} onChange={v => updateStat('bmr', v)} unit="kcal" step="1" />
          </div>
        </div>
      )}

      {/* 목표 수치 섹션 */}
      {activeSection === 'goals' && (
        <div style={{ margin: '0 20px 16px', border: hairline }} className="slide-up">
          <div style={{ padding: '12px 16px', borderBottom: hairline }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', margin: 0 }}>목표 수치 설정</p>
            <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300, margin: '2px 0 0' }}>언제든지 수정 가능</p>
          </div>
          <div style={{ padding: '0 16px' }}>
            <NumInput label="목표 체중" value={goals.weight} onChange={v => updateGoal('weight', v)} unit="kg" step="0.1" />
            <NumInput label="목표 골격근량" value={goals.muscle} onChange={v => updateGoal('muscle', v)} unit="kg" step="0.1" desc="3개월 1차 목표" />
            <NumInput label="체지방률 최대" value={goals.fatMax} onChange={v => updateGoal('fatMax', v)} unit="%" step="0.1" desc="이 이상 넘지 않도록 관리" />
          </div>
          <div style={{ padding: '12px 16px', borderTop: hairline }}>
            <p style={{ color: 'var(--muted)', fontSize: '10px', textAlign: 'center', margin: 0 }}>장기 목표: 골격근량 40kg</p>
          </div>
        </div>
      )}

      {/* 저장 버튼 */}
      <div style={{ margin: '0 20px 16px' }}>
        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '16px', fontWeight: 700, fontSize: '11px',
            letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: 0, cursor: 'pointer',
            background: saved ? '#0fa336' : 'var(--m-blue)',
            color: '#fff', border: 'none',
          }}
        >{saved ? '✓ 저장 완료' : '저장하기'}</button>
      </div>

      {/* 앱 정보 */}
      <div style={{ margin: '0 20px', border: hairline, padding: '16px' }}>
        <p style={{ color: 'var(--muted)', fontSize: '10px', textAlign: 'center', margin: 0 }}>3개월 골격근량 증가 마스터 플랜</p>
        <p style={{ color: 'var(--muted)', fontSize: '10px', textAlign: 'center', margin: '4px 0 0', fontWeight: 300 }}>모든 데이터는 이 기기에만 저장됩니다</p>
      </div>
    </div>
  );
}
