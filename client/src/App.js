import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect,Switch} from 'react-router-dom';

import './App.css';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import Navigation from './components/Navigation/Navigation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <React.Fragment>
      <Navigation />

      <main className="main-content"> 
      <Switch>
       <Redirect from="/" to ="/auth" exact />
       <Route path="/auth" component={Auth} />
       <Route path="/events" component={Events} />
       <Route path="/bookings" component={Bookings} />
      </Switch>
      </main>
      </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
