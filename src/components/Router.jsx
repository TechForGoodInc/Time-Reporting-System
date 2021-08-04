import { Switch, Route } from 'react-router-dom';
import Calendar from './Calendar';
import UserSettings from './UserSettings';
import LogYourHours from './LogYourHours';
import HourLogForm from './hourLogForm';

function Router() {
  return (
    <div className="router">
      <Switch>
        <Route path="/calendar" exact component={Calendar}></Route>
        <Route path="/settings" exact component={UserSettings}></Route>
        <Route path="/" exact component={HourLogForm}></Route>
      </Switch>
    </div>
  );
}

export default Router;
