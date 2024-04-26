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

        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route path='/home' element={<HomePage/>} />
        <Route path='/income' element={<IncomePage/>} />
        <Route path='/outcome' element={<OutcomePage/>} />
        <Route path='/planner' element={<PlannerPage/>} />
        <Route path='/edit' element={<EditPage/>} />

      </Routes>
    </Router>
  );
}
export default App;
