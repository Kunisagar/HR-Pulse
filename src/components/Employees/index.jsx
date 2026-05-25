import {Component} from 'react'

import Header from '../Header'
import Sidebar from '../Sidebar'

import './index.css'

const employeeData = [
  {
    id: 'EMP001',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    department: 'Engineering',
    role: 'Developer',
    status: 'Active',
  },

  {
    id: 'EMP002',
    name: 'Priya Patel',
    email: 'priya@example.com',
    department: 'HR',
    role: 'HR Manager',
    status: 'Active',
  },

  {
    id: 'EMP003',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    department: 'Marketing',
    role: 'Executive',
    status: 'Inactive',
  },

  {
    id: 'EMP004',
    name: 'Neha Singh',
    email: 'neha@example.com',
    department: 'Finance',
    role: 'Accountant',
    status: 'Active',
  },

  {
    id: 'EMP005',
    name: 'Vikram Joshi',
    email: 'vikram@example.com',
    department: 'Engineering',
    role: 'Developer',
    status: 'Inactive',
  },
]

class Employees extends Component {
  state = {
    employees: employeeData,

    search: '',
    department: 'All',
    status: 'All',

    showForm: false,

    name: '',
    email: '',
    employeeDepartment: '',
    role: '',

    currentPage: 1,
    employeesPerPage: 5,
  }

  openForm = () => {
    this.setState({
      showForm: true,
    })
  }

  closeForm = () => {
    this.setState({
      showForm: false,
    })
  }

  onChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  addEmployee = () => {
    const {name, email, employeeDepartment, role} = this.state

    const newEmployee = {
      id: `EMP00${this.state.employees.length + 1}`,

      name,
      email,

      department: employeeDepartment,

      role,

      status: 'Active',
    }

    this.setState(prev => ({
      employees: [...prev.employees, newEmployee],

      showForm: false,

      name: '',
      email: '',
      employeeDepartment: '',
      role: '',
    }))
  }

  onChangeSearch = e => {
    this.setState({
      search: e.target.value,
    })
  }

  render() {
    const {
      employees,
      search,
      department,
      status,
      showForm,
      currentPage,
      employeesPerPage,
    } = this.state

    const filteredData = employees.filter(each => {
      const searchMatch = each.name.toLowerCase().includes(search.toLowerCase())

      const deptMatch = department === 'All' || each.department === department

      const statusMatch = status === 'All' || each.status === status

      return searchMatch && deptMatch && statusMatch
    })

    const lastEmployee = currentPage * employeesPerPage

    const firstEmployee = lastEmployee - employeesPerPage

    const currentEmployees = filteredData.slice(firstEmployee, lastEmployee)

    const totalPages = Math.ceil(filteredData.length / employeesPerPage)

    return (
      <div>
        <Header />

        <div className="home-container">
          <Sidebar />

          <div className="employees-content">
            <div className="employees-top">
              <h2>Employees</h2>

              <button className="add-btn" onClick={this.openForm}>
                Add Employee
              </button>
            </div>

            {showForm && (
              <div className="popup">
                <h3>Add Employee</h3>

                <input
                  name="name"
                  placeholder="Name"
                  onChange={this.onChangeInput}
                />

                <input
                  name="email"
                  placeholder="Email"
                  onChange={this.onChangeInput}
                />

                <input
                  name="employeeDepartment"
                  placeholder="Department"
                  onChange={this.onChangeInput}
                />

                <input
                  name="role"
                  placeholder="Role"
                  onChange={this.onChangeInput}
                />

                <div className="popup-buttons">
                  <button onClick={this.addEmployee}>Save</button>

                  <button onClick={this.closeForm}>Cancel</button>
                </div>
              </div>
            )}

            <div className="filters">
              <input
                className="search-input"
                placeholder="Search employees..."
                value={search}
                onChange={this.onChangeSearch}
              />

              <select
                className="select-box"
                onChange={e =>
                  this.setState({
                    department: e.target.value,
                  })
                }
              >
                <option>All</option>

                <option>Engineering</option>

                <option>HR</option>

                <option>Finance</option>

                <option>Marketing</option>
              </select>

              <select
                className="select-box"
                onChange={e =>
                  this.setState({
                    status: e.target.value,
                  })
                }
              >
                <option>All</option>

                <option>Active</option>

                <option>InActive</option>
              </select>
            </div>

            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Department</th>

                  <th>Role</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {currentEmployees.map(each => (
                  <tr key={each.id}>
                    <td>{each.id}</td>

                    <td>{each.name}</td>

                    <td>{each.email}</td>

                    <td>{each.department}</td>

                    <td>{each.role}</td>

                    <td>
                      <span
                        className={
                          each.status === 'Active' ? 'active' : 'inactive'
                        }
                      >
                        {each.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  this.setState(prev => ({
                    currentPage: prev.currentPage - 1,
                  }))
                }
              >
                Previous
              </button>

              <p>
                {currentPage}
                of
                {totalPages}
              </p>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  this.setState(prev => ({
                    currentPage: prev.currentPage + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Employees
