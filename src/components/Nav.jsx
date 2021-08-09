import '../App.css';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <ul className="nav-links">
        <Link style={{ textDecoration: 'none' }} to="/">
          <li>Log Hours</li>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="settings">
          <li>Settings</li>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/calendar">
          <li>Calendar</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
