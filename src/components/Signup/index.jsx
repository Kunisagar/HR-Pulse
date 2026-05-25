import {Component} from 'react'
import {withRouter} from 'react-router-dom'

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    role: 'Employee',
  }

  submitForm = async e => {
    e.preventDefault()

    const {name, email, password, role, department} = this.state

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/register',

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name,
            email,
            password,
            role,
            department,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        alert('New account created successfully 🎉')

        const {history} = this.props

        history.replace('/login')
      } else {
        this.setState({
          errorMsg: data.message,
        })
      }
    } catch (error) {
      this.setState({
        errorMsg: 'Server Error',
      })
    }
  }

  render() {
    return (
      <div className="login-bg">
        <div className="login-card">
          <h2>Create User</h2>

          <form onSubmit={this.submitForm}>
            <input
              placeholder="Name"
              className="input"
              onChange={e =>
                this.setState({
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              className="input"
              onChange={e =>
                this.setState({
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Password"
              className="input"
              type="password"
              onChange={e =>
                this.setState({
                  password: e.target.value,
                })
              }
            />

            <select
              className="input"
              onChange={e =>
                this.setState({
                  role: e.target.value,
                })
              }
            >
              <option>Employee</option>

              <option>Manager</option>

              <option>HR</option>

              <option>Admin</option>
            </select>

            <button className="login-btn">Create User</button>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Signup)
