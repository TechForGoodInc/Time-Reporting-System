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
          <LogYourHours
            post_data={props.post_data}
            getEntries={props.getEntries}
            display_history={props.display_history}
          />
        )}
      ></Route>
    </Switch>
  );
}
export default Router;
