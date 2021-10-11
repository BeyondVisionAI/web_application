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

function App() {
    return (
      <div className="App">
         <ToastContainer />
         <AuthProvider>
            <BrowserRouter>
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/" component={LandingPage} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/404" component={Page404} />
                  <Redirect to="/404" />
                </Switch>
            </BrowserRouter>
          </AuthProvider>
      </div>
    );
}

export default App;
