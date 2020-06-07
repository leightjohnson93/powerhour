import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import LandingPage from '../Landing'
import GamePage from '../GamePage';
import Navigation from '../Navigation'
import * as ROUTES from '../../constants/routes'

const App = () => (
  <Router>
    <Navigation />
    <Route exact path={ROUTES.LANDING} component={LandingPage} />
    <Route path={ROUTES.GAME} component={GamePage} />
  </Router>
)

export default App
