import {Link} from 'react-router-dom'

import {useEffect, useState} from 'react'

import Cookies from 'js-cookie'

import {
  LayoutDashboard,
  Clock3,
  CalendarDays,
  FileText,
  Users,
  ClipboardCheck,
  LogOut,
} from 'lucide-react'

import './index.css'

const Sidebar = () => {
  const role = localStorage.getItem('role') || 'Employee'

  const userName = localStorage.getItem('userName') || 'Guest User'

  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768)

  useEffect(() => {
    const toggle = () => {
      setShowSidebar(prev => !prev)
    }

    window.addEventListener('toggleSidebar', toggle)

    return () => {
      window.removeEventListener('toggleSidebar', toggle)
    }
  }, [])

  const onLogout = () => {
    Cookies.remove('jwt_token')

    localStorage.clear()

    window.location.replace('/login')
  }

  return (
    <div className={`sidebar-container ${showSidebar ? 'show-sidebar' : ''}`}>
      <div className="sidebar-top">
        <div className="menu-list">
          <Link to="/" className="menu-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/attendance" className="menu-item">
            <Clock3 size={20} />
            <span>Attendance</span>
          </Link>

          <Link to="/my-leaves" className="menu-item">
            <CalendarDays size={20} />
            <span>My Leaves</span>
          </Link>

          <Link to="/apply-leave" className="menu-item">
            <FileText size={20} />
            <span>Apply Leave</span>
          </Link>

          {['HR', 'Admin', 'Manager'].includes(role) && (
            <>
              <Link to="/employees" className="menu-item">
                <Users size={20} />
                <span>Employees</span>
              </Link>

              <Link to="/manage-leaves" className="menu-item">
                <ClipboardCheck size={20} />
                <span>Manage Leaves</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="demo-card">
          <h4>{userName}</h4>
          <p>{role}</p>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
