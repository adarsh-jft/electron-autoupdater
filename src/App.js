import './App.css';
import {Switch, Route} from 'react-router-dom'
import HomeScreen from './components/HomeScreen/HomeScreen';
import Hello from './components/Hello/Hello'

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomeScreen}/>
        <Route exact path='/home' component={Hello}/>
      </Switch>
    </div>
  );
}

export default App;
