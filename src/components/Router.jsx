import { Redirect } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Calendar from './Calendar';
import UserSettings from './UserSettings';
import LogYourHours from './LogYourHours';

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
