import HourLogForm from './hourLogForm';
import Calendar from './Calendar';
import UserSettings from './UserSettings';
import { Switch, Route } from 'react-router-dom';

function Router(props) {
  return (
    <Switch>
      <Route path="/calendar" component={Calendar}></Route>
      <Route path="/settings" component={UserSettings}></Route>
      <Route
        path="/"
        exact
        render={() => <HourLogForm post_data={props.post_data} />}
      ></Route>
    </Switch>
  );
}
export default Router;
