import './App.css';
import LandingPage from './Pages/LandingPage/LandingPage';
import 'aos/dist/aos.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './GenericComponents/Auth/Auth';
import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Pages/Login/Login';
import PrivateRoute from './GenericComponents/PrivateRoute/PrivateRoute';
import Page404 from './Pages/Page404/Page404';
import Project from './Pages/Project/Project';
import EmailVerificatn from './Pages/EmailVerification/EmailVerification';
import Register from './Pages/Register/Register';
import AskForPasswordChange from './Pages/AskForPasswordChange/AskForPasswordChange'; 
import ResetPassword from './Pages/ResetPassword/ResetPassword';

function App() {
  return (
    <div className="App">
      <ToastContainer />
        <AuthProvider>
          <BrowserRouter>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/project" component={Project} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/askForPasswordChange" component={AskForPasswordChange} />
              <Route exact path="/resetPassword" component={ResetPassword} />
              <Route exact path="/verifyEmail" component={EmailVerificatn} />
              <Route exact path="/404" component={Page404} />
              <Redirect to="/404" />
            </Switch>
          </BrowserRouter>
        </AuthProvider>
    </div>
  );
}

export default App;
