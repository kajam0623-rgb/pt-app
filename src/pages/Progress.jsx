import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2A2A2A] border border-white/10 rounded-xl px-3 py-2 text-xs">
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-bold">{payload[0].value}{unit}</p>
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

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] pb-24">
      <div className="px-5 pt-12 pb-4">
        <p className="text-gray-500 text-sm">변화 추적</p>
        <h1 className="text-2xl font-black text-white mt-1">진행 그래프 📈</h1>
      </div>

      {/* 요약 카드 */}
      <div className="mx-5 mb-4 grid grid-cols-3 gap-3">
        <div className="bg-[#1A1A1A] rounded-2xl p-3 border border-white/5 text-center">
          <p className="text-gray-500 text-xs mb-1">현재 체중</p>
          <p className="text-white font-black text-lg">{latestWeight}<span className="text-xs text-gray-400">kg</span></p>
        </div>
        <div className="bg-[#1A1A1A] rounded-2xl p-3 border border-white/5 text-center">
          <p className="text-gray-500 text-xs mb-1">변화량</p>
          <p className={`font-black text-lg ${parseFloat(weightDiff) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {parseFloat(weightDiff) >= 0 ? '+' : ''}{weightDiff}<span className="text-xs">kg</span>
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-2xl p-3 border border-white/5 text-center">
          <p className="text-gray-500 text-xs mb-1">목표</p>
          <p className="text-blue-400 font-black text-lg">{profile.goals.weight}<span className="text-xs text-gray-400">kg</span></p>
        </div>
      </div>

      {/* 체중 라인 차트 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <p className="text-white font-bold text-sm mb-4">체중 변화</p>
        {weightData.length < 2 ? (
          <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
            체중을 2일 이상 기록하면 그래프가 나타납니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#6B7280', fontSize: 10 }} width={35} />
              <Tooltip content={<CustomTooltip unit="kg" />} />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 골격근량 목표 진행 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white font-bold text-sm">골격근량 목표</p>
          <p className="text-blue-400 text-xs font-bold">{profile.stats.muscle}kg / {profile.goals.muscle}kg</p>
        </div>
        <div className="w-full bg-[#2A2A2A] rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, ((profile.stats.muscle - 36) / (profile.goals.muscle - 36)) * 100))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>시작 36.0kg</span>
          <span>목표 {profile.goals.muscle}kg</span>
        </div>
        <p className="text-gray-400 text-xs mt-3">
          장기 목표: 40kg까지 <span className="text-blue-400 font-bold">{(40 - profile.stats.muscle).toFixed(1)}kg</span> 남음
        </p>
      </div>

      {/* 주간 완료율 바 차트 */}
      <div className="mx-5 mb-4 bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
        <p className="text-white font-bold text-sm mb-4">주간 운동 완료율</p>
        {weeklyData.length < 1 ? (
          <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
            운동을 기록하면 주간 통계가 나타납니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} width={30} unit="%" />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="rate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
