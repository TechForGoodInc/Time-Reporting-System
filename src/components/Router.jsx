import { Switch, Route } from 'react-router-dom';
import Calendar from './Calendar';
import UserSettings from './UserSettings';
import HourLogForm from './hourLogForm';

function Router() {
  return (
    <div className="router">
      <Switch>
        <Route path="/calendar" component={Calendar}></Route>
        <Route path="/settings" component={UserSettings}></Route>
        <Route path="/" exact component={HourLogForm}></Route>
      </Switch>
      <h1>Test</h1>
    </div>
  );
}

export default Router;
