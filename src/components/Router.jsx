import { Switch, Route } from 'react-router-dom';
import Calendar from './pages/Calendar';
import UserSettings from './pages/UserSettings';
import LogYourHours from './pages/LogYourHours';
import SupervisorPage from './pages/SupervisorPage';

function Router(props) {
    return (
        <Switch>
            <Route path="/calendar" component={Calendar}></Route>
            <Route path="/settings" component={UserSettings}></Route>
            <Route
                path="/"
                exact
                render={() => (
                    <LogYourHours hourLoggerDep={props.hourLoggerDep} historyDep={props.historyDep} email={props.email} />
                )}
            ></Route>
            <Route
                path="/supervisortools"
                exact
                render={() => (
                    <SupervisorPage historyDep={props.historyDep} email={props.email}/>
                )}
            ></Route>
        </Switch>
    );
}
export default Router;
