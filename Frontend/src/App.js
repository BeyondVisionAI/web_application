import './App.css';
import LandingPage from './Pages/LandingPage/LandingPage';
import 'aos/dist/aos.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './GenericComponents/Auth/Auth';
import Login from './Pages/Login/Login';
import PrivateRoute from './GenericComponents/PrivateRoute/PrivateRoute';
import Page404 from './Pages/Page404/Page404';
import EmailVerificatn from './Pages/EmailVerification/EmailVerification';
import Register from './Pages/Register/Register';
import AskForPasswordChange from './Pages/AskForPasswordChange/AskForPasswordChange';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import Lists from './Pages/Lists/Lists';
import ManageProject from './Pages/Project/Manage/ManageProject';
import ScriptEdition from './Pages/ScriptEdition/ScriptEdition';
import Chat from './Pages/Chat/Chat';
import ProjectList from './Pages/ProjectList/ProjectList';
import Projects from './Pages/Projects/Projects';

function App() {
  return (
    <div className="App">
      <ToastContainer />
        <AuthProvider>
          <BrowserRouter>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Lists} />
              <PrivateRoute exact path="/dashboard/:listId" component={ProjectList} />
              <Route exact path="/" component={LandingPage} />
              <PrivateRoute exact path="/projects" component={Projects} />
              <PrivateRoute exact path="/project/:id" component={ManageProject} />
              <PrivateRoute exact path="/project/:id/edit" component={ScriptEdition} />
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
