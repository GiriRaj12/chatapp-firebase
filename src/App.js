import './App.css';
import React from 'react';
import ChatWindow from './components/ChatWindow';
import LoginPage from './components/LoginPage';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage';

function App() {
  return ( 
        <Router>
          <div>
            <Switch>
              <Route exact path='/Login'>
                <LoginPage/>
              </Route>
              <Route exact path='/Chat'>
                <ChatWindow/>
              </Route>
              <Route exact path='/'>
                <LandingPage/>
              </Route>
            </Switch>
            </div>
        </Router>
  );
}

export default App;
