import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppStore from './AppStore';
import ServiceList from './ServiceList';
import ErrorLog from './ErrorLog';
import './App.css';

function App() {
  return (
    <Router>
      <div className="dashboard">
        <header>
          <h1>Web Services Dashboard</h1>
        </header>
        <div className="content">
          <aside>
            <ServiceList />
          </aside>
          <main>
            <Switch>
              <Route path="/" exact component={AppStore} />
              <Route path="/errors" component={ErrorLog} />
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
