import {Switch, Route} from 'react-router-dom'

import Login from './components/Login'
import Signup from './components/Signup'

import Dashboard from './components/Dashboard'
import Employees from './components/Employees/index'
import Attendance from './components/Attendance/index'

import MyLeaves from './components/MyLeaves/index'
import ApplyLeaves from './components/ApplyLeaves/index'
import ManageLeaves from './components/ManageLeaves/index'

import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />

    <Route exact path="/signup" component={Signup} />

    <ProtectedRoute exact path="/" component={Dashboard} />

    <ProtectedRoute exact path="/employees" component={Employees} />

    <ProtectedRoute exact path="/attendance" component={Attendance} />

    <ProtectedRoute exact path="/my-leaves" component={MyLeaves} />

    <ProtectedRoute exact path="/apply-leave" component={ApplyLeaves} />

    <ProtectedRoute exact path="/manage-leaves" component={ManageLeaves} />

    <Route component={Dashboard} />
  </Switch>
)

export default App
