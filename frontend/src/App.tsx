import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Routes/Home";
import NoPage from "./Routes/NoPage";
import Signin from "./Routes/Signin";
import Signup from "./Routes/Signup";
import UnProtectedRoutes from "./components/UnProtectedRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
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
