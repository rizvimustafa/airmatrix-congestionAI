import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Analytics from './Pages/Analytics';
import Settings from './Pages/Settings';
import Monitor from './Pages/Monitor';
import Shield from './Pages/Shield'


function App() {

  return (
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/monitor" element={<Monitor/>}/>
        <Route path="/shield" element={<Shield/>}/>
      </Routes>
  )
}

export default App;
