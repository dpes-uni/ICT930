import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import MyServices from './pages/MyServices';
import Profile from './pages/Profile';
import AddService from './pages/AddService';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;