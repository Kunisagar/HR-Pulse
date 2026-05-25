import {Component} from 'react'

import Header from '../Header'
import Sidebar from '../Sidebar'

import './index.css'

class ManageLeaves extends Component {
  state = {
    leaves: [],

    filteredLeaves: [],

    pending: 0,

    approved: 0,

    rejected: 0,

    onLeaveToday: 0,

    search: '',

    status: 'All',

    isLoading: true,
  }

  componentDidMount() {
    this.getLeaves()
  }

  getLeaves = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/manage-leaves')

      const data = await response.json()

      if (response.ok) {
        const pending = data.filter(each => each.status === 'Pending').length

        const approved = data.filter(each => each.status === 'Approved').length

        const rejected = data.filter(each => each.status === 'Rejected').length

        const today = new Date().toISOString().split('T')[0]

        const onLeaveToday = data.filter(
          each =>
            each.status === 'Approved' &&
            each.start_date <= today &&
            each.end_date >= today,
        ).length

        this.setState({
          leaves: data,

          filteredLeaves: data,

          pending,

          approved,

          rejected,

          onLeaveToday,

          isLoading: false,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  approveLeave = async id => {
    await fetch(
      `http://localhost:3000/api/manage-leaves/${id}/approve`,

      {
        method: 'PUT',
      },
    )

    this.getLeaves()
  }

  rejectLeave = async id => {
    await fetch(
      `http://localhost:3000/api/manage-leaves/${id}/reject`,

      {
        method: 'PUT',
      },
    )

    this.getLeaves()
  }

  onSearch = e => {
    const value = e.target.value

    const {
      leaves,

      status,
    } = this.state

    let updated = leaves.filter(each =>
      (each.employee_name || 'Unknown User')

        .toLowerCase()

        .includes(value.toLowerCase()),
    )

    if (status !== 'All') {
      updated = updated.filter(each => each.status === status)
    }

    this.setState({
      search: value,

      filteredLeaves: updated,
    })
  }

  onChangeStatus = e => {
    const value = e.target.value

    const {
      leaves,

      search,
    } = this.state

    let updated = leaves.filter(each =>
      (each.employee_name || 'Unknown User')

        .toLowerCase()

        .includes(search.toLowerCase()),
    )

    if (value !== 'All') {
      updated = updated.filter(each => each.status === value)
    }

    this.setState({
      status: value,

      filteredLeaves: updated,
    })
  }

  calculateDays = (start, end) => {
    const s = new Date(start)

    const e = new Date(end)

    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1
  }

  render() {
    const {
      filteredLeaves,

      pending,

      approved,

      rejected,

      onLeaveToday,

      search,

      status,

      isLoading,
    } = this.state

    return (
      <div>
        <Header />

        <div className="home-container">
          <Sidebar />

          <div className="manage-content">
            <h1 className="page-title">Manage Leaves</h1>

            <div className="cards-container">
              <div className="manage-card yellow">
                <h3>Pending</h3>

                <h1>{pending}</h1>
              </div>

              <div className="manage-card green">
                <h3>Approved</h3>

                <h1>{approved}</h1>
              </div>

              <div className="manage-card red">
                <h3>Rejected</h3>

                <h1>{rejected}</h1>
              </div>

              <div className="manage-card blue">
                <h3>On Leave Today</h3>

                <h1>{onLeaveToday}</h1>
              </div>
            </div>

            <div className="filter-container">
              <input
                type="search"
                value={search}
                onChange={this.onSearch}
                placeholder="Search Employee"
                className="search-input"
              />

              <select
                value={status}
                onChange={this.onChangeStatus}
                className="select"
              >
                <option>All</option>

                <option>Pending</option>

                <option>Approved</option>

                <option>Rejected</option>
              </select>
            </div>

            {isLoading ? (
              <h2>Loading...</h2>
            ) : (
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>ID</th>

                    <th>Name</th>

                    <th>Type</th>

                    <th>From</th>

                    <th>To</th>

                    <th>Days</th>

                    <th>Reason</th>

                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeaves.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        style={{
                          textAlign: 'center',

                          padding: '30px',
                        }}
                      >
                        No Leave Requests Found
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map(each => (
                      <tr key={each.id}>
                        <td>{each.employee_id}</td>

                        <td>{each.employee_name || 'Unknown User'}</td>

                        <td>{each.leave_type}</td>

                        <td>{each.start_date}</td>

                        <td>{each.end_date}</td>

                        <td>
                          {this.calculateDays(
                            each.start_date,

                            each.end_date,
                          )}
                        </td>

                        <td>{each.reason}</td>

                        <td>
                          <span className={each.status}>{each.status}</span>
                        </td>

                        <td>
                          {each.status === 'Pending' ? (
                            <>
                              <button
                                className="approve-btn"
                                onClick={() => this.approveLeave(each.id)}
                              >
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={() => this.rejectLeave(each.id)}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            '--'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default ManageLeaves
