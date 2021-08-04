import '../App.css';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav className="nav">
      <ul className="nav-links">
        <Link to="/">
          <li>Log Hours</li>
        </Link>
        <Link to="settings">
          <li>Settings</li>
        </Link>
        <Link to="/calendar">
          <li>Calendar</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
