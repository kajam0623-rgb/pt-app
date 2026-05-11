import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import MStripe from '../components/MStripe';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)', padding: '8px 12px' }}>
        <p style={{ color: 'var(--muted)', fontSize: '10px', margin: '0 0 2px' }}>{label}</p>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', margin: 0 }}>{payload[0].value}{unit}</p>
      </div>
    );
  }
  return null;
};

export default function Progress({ appData }) {
  const { getWeightHistory, getWeeklyCompletion, profile } = appData;
  const weightData = getWeightHistory();
  const weeklyData = getWeeklyCompletion();

  const latestWeight = weightData.length ? weightData[weightData.length - 1].value : profile.stats.weight;
  const firstWeight = weightData.length ? weightData[0].value : profile.stats.weight;
  const weightDiff = (latestWeight - firstWeight).toFixed(1);

  const labelStyle = { color: 'var(--muted)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 };
  const hairline = '1px solid var(--hairline)';
  const musclePercent = Math.min(100, Math.max(0, ((profile.stats.muscle - 36) / (profile.goals.muscle - 36)) * 100));

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '48px 20px 16px' }}>
        <p style={labelStyle}>변화 추적</p>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, textTransform: 'uppercase', margin: '6px 0 0', lineHeight: 1.0 }}>진행 그래프</h1>
      </div>

      <div style={{ margin: '0 20px 16px' }}><MStripe /></div>

      {/* 요약 스펙 셀 */}
      <div style={{ margin: '0 20px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--hairline)' }}>
        <div style={{ background: 'var(--surface-soft)', padding: '14px 12px', textAlign: 'center' }}>
          <p style={{ ...labelStyle, fontSize: '8px', margin: '0 0 4px' }}>현재 체중</p>
          <p style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>{latestWeight}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--body)' }}>kg</span></p>
        </div>
        <div style={{ background: 'var(--surface-soft)', padding: '14px 12px', textAlign: 'center' }}>
          <p style={{ ...labelStyle, fontSize: '8px', margin: '0 0 4px' }}>변화량</p>
          <p style={{ color: parseFloat(weightDiff) >= 0 ? '#0fa336' : 'var(--m-red)', fontSize: '22px', fontWeight: 700, margin: 0 }}>
            {parseFloat(weightDiff) >= 0 ? '+' : ''}{weightDiff}<span style={{ fontSize: '10px', fontWeight: 300 }}>kg</span>
          </p>
        </div>
        <div style={{ background: 'var(--surface-soft)', padding: '14px 12px', textAlign: 'center' }}>
          <p style={{ ...labelStyle, fontSize: '8px', margin: '0 0 4px' }}>목표</p>
          <p style={{ color: 'var(--m-blue)', fontSize: '22px', fontWeight: 700, margin: 0 }}>{profile.goals.weight}<span style={{ fontSize: '10px', fontWeight: 300, color: 'var(--body)' }}>kg</span></p>
        </div>
      </div>

      {/* 체중 라인 차트 */}
      <div style={{ margin: '0 20px 16px', border: hairline, padding: '16px' }}>
        <p style={{ ...labelStyle, marginBottom: '16px' }}>체중 변화</p>
        {weightData.length < 2 ? (
          <div style={{ height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '13px' }}>
            체중을 2일 이상 기록하면 그래프가 나타납니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--muted)', fontSize: 10 }} width={35} />
              <Tooltip content={<CustomTooltip unit="kg" />} />
              <Line type="monotone" dataKey="value" stroke="#1c69d4" strokeWidth={2} dot={{ fill: '#1c69d4', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 골격근량 목표 진행 */}
      <div style={{ margin: '0 20px 16px', border: hairline, padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
          <p style={labelStyle}>골격근량 목표</p>
          <p style={{ color: 'var(--m-blue)', fontSize: '11px', fontWeight: 700, margin: 0 }}>{profile.stats.muscle}kg / {profile.goals.muscle}kg</p>
        </div>
        <div style={{ background: 'var(--surface-card)', height: '3px', margin: '8px 0' }}>
          <div style={{ background: 'linear-gradient(to right, var(--m-blue-light), var(--m-blue))', height: '100%', width: `${musclePercent}%`, transition: 'width 0.7s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300 }}>시작 36.0kg</span>
          <span style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 300 }}>목표 {profile.goals.muscle}kg</span>
        </div>
        <p style={{ color: 'var(--body)', fontSize: '11px', fontWeight: 300, margin: '8px 0 0' }}>
          장기 목표: 40kg까지 <span style={{ color: 'var(--m-blue)', fontWeight: 700 }}>{(40 - profile.stats.muscle).toFixed(1)}kg</span> 남음
        </p>
      </div>

      {/* 주간 완료율 바 차트 */}
      <div style={{ margin: '0 20px 16px', border: hairline, padding: '16px' }}>
        <p style={{ ...labelStyle, marginBottom: '16px' }}>주간 운동 완료율</p>
        {weeklyData.length < 1 ? (
          <div style={{ height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '13px' }}>
            운동을 기록하면 주간 통계가 나타납니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} width={30} unit="%" />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="rate" fill="#1c69d4" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
