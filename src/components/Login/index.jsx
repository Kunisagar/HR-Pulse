import {Component} from 'react'

import Cookies from 'js-cookie'

import {withRouter, Link} from 'react-router-dom'

import hrPulseLogo from '../../assets/HRpulse.png'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    errorMsg: '',
  }

  componentDidMount() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken) {
      const {history} = this.props

      history.replace('/')
    }
  }

  onChangeUserName = e => {
    this.setState({
      username: e.target.value,
    })
  }

  onChangePassword = e => {
    this.setState({
      password: e.target.value,
    })
  }

  onToggleShowPassword = e => {
    this.setState({
      showPassword: e.target.checked,
    })
  }

  submitForm = async e => {
    e.preventDefault()

    const {username, password} = this.state

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/login',

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: username,

            password,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        Cookies.set(
          'jwt_token',

          data.jwtToken,

          {
            expires: 30,
          },
        )

        localStorage.setItem(
          'employeeId',

          data.user.employeeId,
        )

        localStorage.setItem(
          'userName',

          data.user.name,
        )

        localStorage.setItem(
          'userEmail',

          data.user.email,
        )

        localStorage.setItem(
          'role',

          data.user.role,
        )

        const {history} = this.props

        history.replace('/')
      } else {
        this.setState({
          errorMsg: data.message || 'Login Failed',
        })
      }
    } catch (error) {
      this.setState({
        errorMsg: 'Server Error',
      })
    }
  }

  render() {
    const {username, password, showPassword, errorMsg} = this.state

    return (
      <div className="login-bg">
        <div className="login-card">
          <div className="logo-container">
            <img src={hrPulseLogo} alt="logo" className="logo" />
          </div>

          <form className="form-container" onSubmit={this.submitForm}>
            <label className="label">EMAIL</label>

            <input
              type="text"
              className="input"
              value={username}
              onChange={this.onChangeUserName}
              placeholder="Enter Email"
            />

            <label className="label">PASSWORD</label>

            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Enter Password"
            />

            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={this.onToggleShowPassword}
              />

              <p>Show Password</p>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            <p>
              New User ?<Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
