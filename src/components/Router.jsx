import { Redirect } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Calendar from './pages/Calendar';
import UserSettings from './pages/UserSettings';
import LogYourHours from './pages/LogYourHours';

function Router(props) {
  return (
    <Switch>
      <Route path="/calendar" component={Calendar}></Route>
      <Route path="/settings" component={UserSettings}></Route>
      <Route
        path="/"
        exact
        render={() => (
            <LogYourHours hourLoggerDep={props.hourLoggerDep} historyDep={props.historyDep} />
        )}
      ></Route>
    </Switch>
  );
}
export default Router;
