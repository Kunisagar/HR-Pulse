import {Component} from 'react'

import Header from '../Header'
import Sidebar from '../Sidebar'

import './index.css'

class Attendance extends Component {
  state = {
    attendance: [],

    search: '',

    isLoading: true,

    currentPage: 1,

    itemsPerPage: 8,
  }

  componentDidMount() {
    this.getAttendance()
  }

  getAttendance = async () => {
    try {
      const role = localStorage.getItem('role')

      const employeeId = localStorage.getItem('employeeId')

      const response = await fetch(
        `http://localhost:3000/api/attendance?role=${role}&employeeId=${employeeId}`,
      )

      const data = await response.json()

      const formattedData = data.map(each => ({
        id: each.employee_id,

        name: each.employee_name,

        checkIn: each.check_in || '--:--',

        checkOut: each.check_out || '--:--',

        status: each.status,

        hours: each.work_hours || '0h 0m',

        attendanceDate: each.attendance_date,
      }))

      const today = new Date().toISOString().split('T')[0]

      const todayAttendance = formattedData.find(
        each => each.attendanceDate === today,
      )

      this.setState({
        attendance: formattedData,

        checkIn: todayAttendance?.checkIn || '--:--',

        checkOut: todayAttendance?.checkOut || '--:--',

        isLoading: false,
      })
    } catch (error) {
      console.log(error)
    }
  }

  onSearch = e => {
    this.setState({
      search: e.target.value,

      currentPage: 1,
    })
  }

  onCheckIn = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId')

      const employeeName = localStorage.getItem('userName')

      const response = await fetch(
        'http://localhost:3000/api/attendance/check-in',

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            employeeId,
            employeeName,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        alert(data.message)

        this.getAttendance()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)

      alert('Check In Failed')
    }
  }

  onCheckOut = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId')

      const response = await fetch(
        'http://localhost:3000/api/attendance/check-out',

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            employeeId,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        this.getAttendance()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  changePage = page => {
    this.setState({
      currentPage: page,
    })
  }

  render() {
    const role = (localStorage.getItem('role') || 'Employee').toLowerCase()

    const currentUser = localStorage.getItem('userName')

    const {
      attendance,

      search,

      isLoading,

      currentPage,

      itemsPerPage,
    } = this.state

    const filteredData =
      role === 'employee'
        ? attendance
        : attendance.filter(each =>
            each.name
              .toLowerCase()

              .includes(search.toLowerCase()),
          )

    const lastIndex = currentPage * itemsPerPage

    const firstIndex = lastIndex - itemsPerPage

    const currentEmployees = filteredData.slice(firstIndex, lastIndex)

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
      <div>
        <Header />

        <div className="home-container">
          <Sidebar />

          <div className="attendance-content">
            {role === 'employee' && (
              <div className="check-card">
                <div>
                  <p>{new Date().toDateString()}</p>

                  <h3>{currentUser}</h3>

                  <h2>
                    Check In:
                    {attendance.length > 0 ? attendance[0].checkIn : '--:--'}
                  </h2>

                  <h2>
                    Check Out:
                    {attendance.length > 0 ? attendance[0].checkOut : '--:--'}
                  </h2>
                </div>

                <div>
                  <button className="check-btn" onClick={this.onCheckIn}>
                    Check In
                  </button>

                  <button className="checkout-btn" onClick={this.onCheckOut}>
                    Check Out
                  </button>
                </div>
              </div>
            )}

            <div className="attendance-top">
              <h2>Attendance</h2>

              {role !== 'employee' && (
                <button className="export-btn">Export</button>
              )}
            </div>

            {role !== 'employee' && (
              <input
                className="search-input"
                placeholder="Search employee..."
                value={search}
                onChange={this.onSearch}
              />
            )}

            {isLoading ? (
              <h2>Loading...</h2>
            ) : (
              <>
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>ID</th>

                      <th>Name</th>

                      <th>Check In</th>

                      <th>Check Out</th>

                      <th>Status</th>

                      <th>Work Hours</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="6">No attendance found</td>
                      </tr>
                    ) : (
                      currentEmployees.map(each => (
                        <tr key={each.id + each.checkIn}>
                          <td>{each.id}</td>

                          <td>{each.name}</td>

                          <td>{each.checkIn}</td>

                          <td>{each.checkOut}</td>

                          <td>
                            <span className={each.status}>{each.status}</span>
                          </td>

                          <td>{each.hours}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {role !== 'employee' && (
                  <div className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={
                          currentPage === index + 1 ? 'active-page' : ''
                        }
                        onClick={() => this.changePage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Attendance
