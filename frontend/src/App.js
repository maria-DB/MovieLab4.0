import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import HomePage from './components/Movies/HomePage';
import Actor from './components/Actors/actor';
import Producer from './components/Producers/producer';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Backdrop, Paper } from '@mui/material';
import RegisterForm from './components/common/RegisterForm';
import LoginForm from './components/common/LoginForm';
import { getUserInfo } from './redux/userSlice';
import React from 'react';

function App() {

  const { email, isLogin, onRegister } = useSelector(state => state.user)
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(!localStorage.getItem('id')) return 'No user'
    dispatch(getUserInfo({id:localStorage.getItem('id')}))
    return () => {
      console.log('Cleaned');
    }
  }, [dispatch])

  return (
    <Router>
      <div className="App" style={{ overflow:'scroll'}}>
        { !isLogin && 
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
              <Paper elevation={6} sx={{ p:4, m:2}}>
                <Alert severity="info">Please Login or Sign Up first to access this website</Alert>
                { onRegister &&
                  <RegisterForm/>
                }
                { !onRegister &&
                  <LoginForm/>
                }
              </Paper>
          </Backdrop>
        }

          <Navbar />
          <Routes>
            <Route exact path="/" element={<HomePage/>} />
            <Route exact path="/actors" element={<Actor/>} />
            <Route exact path="/producers" element={<Producer/>} />
          </Routes>
      </div>
    </Router>

  );
}

export default App;
