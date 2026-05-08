import { useStorage } from './useStorage';
import { DEFAULT_PROFILE, todayStr, formatDate, month1Workouts, dailyDietTasks, getDayOfWeekStr } from '../data/workoutData';

export function useAppData() {
  const [profile, setProfile] = useStorage('pt_profile', DEFAULT_PROFILE);
  const [records, setRecords] = useStorage('pt_records', {});
  const [streak, setStreak] = useStorage('pt_streak', { current: 0, longest: 0, lastDate: '' });

  const getDayRecord = (dateStr) => records[dateStr] || { workout: {}, sets: {}, diet: {}, bodyweight: null };

  const toggleWorkout = (dateStr, taskId) => {
    setRecords((prev) => {
      const day = prev[dateStr] || { workout: {}, sets: {}, diet: {}, bodyweight: null };
      const updated = { ...prev, [dateStr]: { ...day, workout: { ...day.workout, [taskId]: !day.workout[taskId] } } };
      updateStreak(updated);
      return updated;
    });
  };

  const toggleDiet = (dateStr, taskId) => {
    setRecords((prev) => {
      const day = prev[dateStr] || { workout: {}, sets: {}, diet: {}, bodyweight: null };
      return { ...prev, [dateStr]: { ...day, diet: { ...day.diet, [taskId]: !day.diet[taskId] } } };
    });
  };

  const saveSet = (dateStr, taskId, setIndex, data) => {
    setRecords((prev) => {
      const day = prev[dateStr] || { workout: {}, sets: {}, diet: {}, bodyweight: null };
      const taskSets = day.sets[taskId] ? [...day.sets[taskId]] : [];
      taskSets[setIndex] = data;
      return { ...prev, [dateStr]: { ...day, sets: { ...day.sets, [taskId]: taskSets } } };
    });
  };

  const saveBodyweight = (dateStr, weight) => {
    setRecords((prev) => {
      const day = prev[dateStr] || { workout: {}, sets: {}, diet: {}, bodyweight: null };
      return { ...prev, [dateStr]: { ...day, bodyweight: weight } };
    });
  };

  const updateStreak = (updatedRecords) => {
    const today = todayStr;
    const dayRecord = updatedRecords[today] || {};
    const dayOfWeek = getDayOfWeekStr(today);
    const workouts = month1Workouts[dayOfWeek] || [];
    const totalWorkout = workouts.length;
    const doneWorkout = workouts.filter(w => dayRecord.workout?.[w.id]).length;
    const totalDiet = dailyDietTasks.length;
    const doneDiet = dailyDietTasks.filter(d => dayRecord.diet?.[d.id]).length;
    const isComplete = totalWorkout > 0 && doneWorkout === totalWorkout && doneDiet === totalDiet;

    if (!isComplete) return;

    setStreak((prev) => {
      if (prev.lastDate === today) return prev;
      const yesterday = formatDate(new Date(Date.now() - 86400000));
      const newCurrent = prev.lastDate === yesterday ? prev.current + 1 : 1;
      return { current: newCurrent, longest: Math.max(newCurrent, prev.longest), lastDate: today };
    });
  };

  const calcProgress = (dateStr, type) => {
    const dayRecord = records[dateStr] || {};
    if (type === 'workout') {
      const dayOfWeek = getDayOfWeekStr(dateStr);
      const workouts = month1Workouts[dayOfWeek] || [];
      if (!workouts.length) return 0;
      const done = workouts.filter(w => dayRecord.workout?.[w.id]).length;
      return Math.round((done / workouts.length) * 100);
    }
    if (type === 'diet') {
      const done = dailyDietTasks.filter(d => dayRecord.diet?.[d.id]).length;
      return Math.round((done / dailyDietTasks.length) * 100);
    }
    return 0;
  };

  const getWeightHistory = () => {
    return Object.entries(records)
      .filter(([, r]) => r.bodyweight)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, r]) => ({ date: date.slice(5), value: r.bodyweight }));
  };

  const getWeeklyCompletion = () => {
    const weeks = {};
    Object.entries(records).forEach(([date, r]) => {
      const d = new Date(date + 'T00:00:00');
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = formatDate(weekStart);
      if (!weeks[key]) weeks[key] = { total: 0, done: 0 };
      const dayOfWeek = getDayOfWeekStr(date);
      const workouts = month1Workouts[dayOfWeek] || [];
      if (workouts.length > 0) {
        weeks[key].total += workouts.length;
        weeks[key].done += workouts.filter(w => r.workout?.[w.id]).length;
      }
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([date, { total, done }]) => ({
        date: date.slice(5),
        rate: total > 0 ? Math.round((done / total) * 100) : 0,
      }));
  };

  return {
    profile, setProfile,
    records, streak,
    getDayRecord,
    toggleWorkout, toggleDiet,
    saveSet, saveBodyweight,
    calcProgress,
    getWeightHistory, getWeeklyCompletion,
  };
}
