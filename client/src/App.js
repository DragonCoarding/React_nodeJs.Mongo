import './App.css';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"; 
import LandingPage from './components/views/LandingPage/LadingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';




function App() { 
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={LandingPage} /> 
            <Route exact path="/login" component={LoginPage} />      
            <Route exact path="/register" component={RegisterPage} />        
          </Switch>
        </div>
      </Router>
    </div>
  );
}
export default App;
