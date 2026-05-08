import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppData } from './hooks/useAppData';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Workout from './pages/Workout';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

export default function App() {
  const appData = useAppData();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F0F0F] flex justify-center">
        <div className="w-full max-w-[430px] relative">
          <Routes>
            <Route path="/" element={<Home appData={appData} />} />
            <Route path="/workout" element={<Workout appData={appData} />} />
            <Route path="/calendar" element={<Calendar appData={appData} />} />
            <Route path="/progress" element={<Progress appData={appData} />} />
            <Route path="/settings" element={<Settings appData={appData} />} />
          </Routes>
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}
