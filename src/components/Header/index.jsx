import {Link} from 'react-router-dom'

import {Bell, Menu} from 'lucide-react'

import hrPulseLogo from '../../assets/HRpulse.png'
import adminProfile from '../../assets/administrator.png'

import './index.css'

const Header = () => {
  const role = localStorage.getItem('role') || 'Employee'

  const userName = localStorage.getItem('userName') || 'Guest User'

  const toggleSidebar = () => {
    window.dispatchEvent(new Event('toggleSidebar'))
  }

  return (
    <div className="header-container">
      <div className="logo-section">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <Link to="/">
          <img src={hrPulseLogo} alt="logo" className="header-logo" />
        </Link>
      </div>

      <div className="right-section">
        <div className="notification-container">
          <Bell size={20} />

          <span className="notification-dot" />
        </div>

        <img src={adminProfile} alt="admin" className="profile-img" />

        <p className="user-name">{userName}</p>

        <select value={role} disabled className="role-select">
          <option>Employee</option>

          <option>Manager</option>

          <option>HR</option>

          <option>Admin</option>
        </select>
      </div>
    </div>
  )
}

export default Header
