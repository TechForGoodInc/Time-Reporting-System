import HourLogger from './hourLogger';
import History from './history';

function LogYourHours(props) {
  return (
    <div>
          <HourLogger postData={props.hourLoggerDep.postData} activeTimer={props.hourLoggerDep.activeTimer} screenWidth={props.hourLoggerDep.screenWidth}
              startTimer={props.hourLoggerDep.startTimer} stopTimer={props.hourLoggerDep.stopTimer} removeTimer={props.hourLoggerDep.removeTimer} startTime={props.hourLoggerDep.startTime}
              stopTime={props.hourLoggerDep.stopTime} hoursWorked={props.hourLoggerDep.hoursWorked} />
          <br />
          <br />
          <History getEntries={props.historyDep.getEntriesBetweenDates} display_history={props.historyDep.display_history} />
    </div>
  );
}

export default LogYourHours;
