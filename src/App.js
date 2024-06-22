import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import HomePage from './pages/home';
import IncomePage from './pages/income';
import OutcomePage from './pages/outcome';
import PlannerPage from './financial-tools/planner';
import FinancialTools from "./pages/FinancialTools";
import EditPage from "./pages/edit";
import UserPage from "./pages/user";
import {createContext, useEffect, useState} from "react";

const MyContext = createContext();


// for global states
const MyProvider = ({children}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const updateIsAuth = (newValue) => {
    setIsAuth(newValue);
  }
  const updateIsOffline = (newValue) => {
    setIsOffline(newValue);
  }
  return(<MyContext.Provider value={{isOffline, updateIsOffline, isAuth, updateIsAuth}}>
    {children}
  </MyContext.Provider>)
}

function App() {



  return (

        <Router>

          <MyProvider>
            <Routes>


              <Route path='/money-manager/' element={<LoginPage />} />
              <Route path='/money-manager/login' element={<LoginPage />} />
              <Route path='/money-manager/signup' element={<SignupPage />} />

              <Route path='/money-manager/home' element={<HomePage/>} />
              <Route path='/money-manager/income' element={<IncomePage/>} />
              <Route path='/money-manager/outcome' element={<OutcomePage/>} />


              <Route path='/money-manager/financial-tools' element={<FinancialTools/>} />

              <Route path='/money-manager/financial-tools/planner' element={<PlannerPage/>} />
              <Route path='/money-manager/edit' element={<EditPage/>} />

              <Route path='/money-manager/home/user' element={<UserPage/>} />

            </Routes>
          </MyProvider>

        </Router>


  );
}
export default App;
export {MyContext}
