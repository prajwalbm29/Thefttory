
// import logo from '../assets/logo.png'
// import cart from '../assets/cart_icon.png'
import './navBar.css'
import { Link } from 'react-router-dom';
import { UseSession } from '../context/sessionContext';


function Navbar() {
  const { logout } = UseSession();

  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className="navbar">
      <div className="nav-logo">
        {/* <img src={logo} alt="Logo of website" /> */}
        <p>Thefttory</p>
      </div>
      <ul className="nav-menu">
        <li><Link to='/' style={{ textDecoration: 'none' }}>Home</Link></li>
      </ul>
      <div className="nav-login-cart">
        <button onClick={handleLogout} className='logoutBtn'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar