import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import LoginPage from './Pages/Login'

function App() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/login" exact component={LoginPage} />
        </Switch>
      </HashRouter>
    </div>
  )
}

export default App