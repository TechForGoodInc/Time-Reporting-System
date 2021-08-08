import HourLogForm from './hourLogForm';
import History from './history';

function LogYourHours(props) {
  return (
    <div>
      <HourLogForm post_data={props.post_data} />
      <History
        getEntries={props.getEntries}
        display_history={props.display_history}
      />
    </div>
  );
}

export default LogYourHours;
