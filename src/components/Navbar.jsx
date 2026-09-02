import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <nav>
        <h2>ICT930</h2>
        <ul>
          <li><NavLink to="/">Dashboard</NavLink></li>
          <li><NavLink to="/services">Services</NavLink></li>
          <li><NavLink to="/my-services">My Services</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;