import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Routes/Home';
import NoPage from './Routes/NoPage';
import Signin from './Routes/Signin';
import Signup from './Routes/Signup';
import UnProtectedRoutes from './components/UnProtectedRoutes';
import ProtectedRoutes from './components/ProtectedRoutes';
import Business from './Routes/Business';
import BusinessDetail from './Routes/BusinessDetail';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/business" element={<Business />} />
            <Route path="/businessDetail/:id" element={<BusinessDetail />} />
          </Route>
          <Route element={<UnProtectedRoutes />}>
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
