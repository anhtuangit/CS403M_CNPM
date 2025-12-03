import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import PropertyDetail from './pages/PropertyDetail';
import CreateEditProperty from './pages/CreateEditProperty';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import MarketNews from './pages/MarketNews';
import About from './pages/About';
import TaxCalculator from './pages/TaxCalculator';
import { useAppDispatch } from './hooks';
import { fetchCurrentUser } from './store/slices/authSlice';

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/properties/new" element={<CreateEditProperty />} />
          <Route path="/properties/:id/edit" element={<CreateEditProperty />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/news" element={<MarketNews />} />
          <Route path="/about" element={<About />} />
          <Route path="/tax" element={<TaxCalculator />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

