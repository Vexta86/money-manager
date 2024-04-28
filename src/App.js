import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import HomePage from './pages/home';
import IncomePage from './pages/income';
import OutcomePage from './pages/outcome';
import PlannerPage from './pages/planner';
import EditPage from "./pages/edit";
function App() {

  return (
    <Router>
      <Routes>
        <Route path='*' element={<HomePage />} />

        <Route path='/money-manager/login' element={<LoginPage />} />
        <Route path='/money-manager/signup' element={<SignupPage />} />

        <Route path='/money-manager/home' element={<HomePage/>} />
        <Route path='/money-manager/income' element={<IncomePage/>} />
        <Route path='/money-manager/outcome' element={<OutcomePage/>} />
        <Route path='/money-manager/planner' element={<PlannerPage/>} />
        <Route path='/money-manager/edit' element={<EditPage/>} />

      </Routes>
    </Router>
  );
}
export default App;
