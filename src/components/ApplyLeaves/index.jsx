import { Component } from "react";

import Header from "../Header";
import Sidebar from "../Sidebar";

import "./index.css";

class ApplyLeave extends Component {
  state = {
    leaveType: "Sick",

    startDate: "",

    endDate: "",

    reason: "",

    days: 0,

    pending: 0,

    approved: 0,

    rejected: 0,

    leaves: [],
  };

  componentDidMount() {
    this.getLeaveData();
  }

  calculateDays = (start, end) => {
    if (!start || !end) {
      return 0;
    }

    const s = new Date(start);

    const e = new Date(end);

    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  getLeaveData = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      const response = await fetch(
        `https://hr-pulse-backend.onrender.com/api/leaves/${employeeId}`,
      );

      const data = await response.json();

      let pending = 0;
      let approved = 0;
      let rejected = 0;

      data.forEach((each) => {
        if (each.status === "Pending") {
          pending++;
        }

        if (each.status === "Approved") {
          approved++;
        }

        if (each.status === "Rejected") {
          rejected++;
        }
      });

      this.setState({
        leaves: data,

        pending,

        approved,

        rejected,
      });
    } catch (error) {
      console.log(error);
    }
  };

  onChangeType = (e) => {
    this.setState({
      leaveType: e.target.value,
    });
  };

  onChangeStart = (e) => {
    this.setState({
      startDate: e.target.value,
    });
  };

  onChangeEnd = (e) => {
    const end = e.target.value;

    const { startDate } = this.state;

    this.setState({
      endDate: end,

      days: this.calculateDays(startDate, end),
    });
  };

  onReason = (e) => {
    this.setState({
      reason: e.target.value,
    });
  };

  applyLeave = async () => {
    const {
      leaveType,

      startDate,

      endDate,

      reason,
    } = this.state;

    const employeeId = localStorage.getItem("employeeId");

    const response = await fetch(
      "https://hr-pulse-backend.onrender.com/api/leaves/apply",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          employeeId,

          leaveType,

          startDate,

          endDate,

          reason,
        }),
      },
    );

    const data = await response.json();

    alert(data.message);

    this.getLeaveData();
  };

  render() {
    const {
      leaveType,

      startDate,

      endDate,

      reason,

      days,

      pending,

      approved,

      rejected,

      leaves,
    } = this.state;

    return (
      <div>
        <Header />

        <div className="home-container">
          <Sidebar />

          <div className="apply-content">
            <h1>Apply Leave</h1>

            <div className="leave-cards">
              <div className="small-card pending-card">
                <h3>Pending</h3>

                <h1>{pending}</h1>
              </div>

              <div className="small-card approved-card">
                <h3>Approved</h3>

                <h1>{approved}</h1>
              </div>

              <div className="small-card rejected-card">
                <h3>Rejected</h3>

                <h1>{rejected}</h1>
              </div>
            </div>

            <div className="form-card">
              <h2>Apply New Leave</h2>

              <select value={leaveType} onChange={this.onChangeType}>
                <option>Sick</option>

                <option>Casual</option>

                <option>Earned</option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={this.onChangeStart}
              />

              <input type="date" value={endDate} onChange={this.onChangeEnd} />

              <div className="days-box">
                Days:
                {days}
              </div>

              <textarea
                placeholder="Reason"
                value={reason}
                onChange={this.onReason}
              />

              <button className="apply-btn" onClick={this.applyLeave}>
                Apply Leave
              </button>
            </div>

            <div className="table-card">
              <h2>Recent Requests</h2>

              <table>
                <thead>
                  <tr>
                    <th>Type</th>

                    <th>Start</th>

                    <th>End</th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((each) => (
                    <tr key={each.id}>
                      <td>{each.leave_type}</td>

                      <td>{each.start_date}</td>

                      <td>{each.end_date}</td>

                      <td>
                        <span className={each.status.toLowerCase()}>
                          {each.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApplyLeave;
