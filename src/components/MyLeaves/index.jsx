import { Component } from "react";

import Header from "../Header";
import Sidebar from "../Sidebar";

import "./index.css";

class MyLeaves extends Component {
  state = {
    leaves: [],

    totalAllowed: 30,

    usedLeaves: 0,

    remaining: 30,

    sick: 10,

    casual: 10,

    earned: 10,
  };

  componentDidMount() {
    this.getLeaves();
  }

  calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);

    const end = new Date(endDate);

    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  getLeaves = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      const response = await fetch(
        `https://hr-pulse-backend.onrender.com/api/leaves/${employeeId}`,
      );

      const data = await response.json();

      if (response.ok) {
        let used = 0;

        let sick = 10;
        let casual = 10;
        let earned = 10;

        data.forEach((each) => {
          if (each.status === "Approved") {
            const days = this.calculateDays(
              each.start_date,

              each.end_date,
            );

            used += days;

            if (each.leave_type === "Sick") {
              sick -= days;
            }

            if (each.leave_type === "Casual") {
              casual -= days;
            }

            if (each.leave_type === "Earned") {
              earned -= days;
            }
          }
        });

        this.setState({
          leaves: data,

          usedLeaves: used,

          remaining: 30 - used,

          sick,

          casual,

          earned,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      leaves,

      totalAllowed,

      usedLeaves,

      remaining,

      sick,

      casual,

      earned,
    } = this.state;

    return (
      <div>
        <Header />

        <div className="home-container">
          <Sidebar />

          <div className="leave-content">
            <h1 className="leave-title">My Leaves</h1>

            <div className="cards-container">
              <div className="leave-card">
                <p>Total Allowed</p>

                <h1>{totalAllowed}</h1>
              </div>

              <div className="leave-card">
                <p>Used Leaves</p>

                <h1>{usedLeaves}</h1>
              </div>

              <div className="leave-card">
                <p>Remaining</p>

                <h1>{remaining}</h1>
              </div>
            </div>

            <div className="cards-container">
              <div className="leave-card">
                <p>Sick Leaves Left</p>

                <h1>{sick}</h1>
              </div>

              <div className="leave-card">
                <p>Casual Leaves Left</p>

                <h1>{casual}</h1>
              </div>

              <div className="leave-card">
                <p>Earned Leaves Left</p>

                <h1>{earned}</h1>
              </div>
            </div>

            <div className="table-container">
              <h2>Leave History</h2>

              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>

                    <th>Name</th>

                    <th>Leave Type</th>

                    <th>From</th>

                    <th>To</th>

                    <th>Days</th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="7">No Leave Records Found</td>
                    </tr>
                  ) : (
                    leaves.map((each) => (
                      <tr key={each.id}>
                        <td>{each.employee_id}</td>

                        <td>{each.employee_name}</td>

                        <td>{each.leave_type}</td>

                        <td>{each.start_date}</td>

                        <td>{each.end_date}</td>

                        <td>
                          {this.calculateDays(
                            each.start_date,

                            each.end_date,
                          )}
                        </td>

                        <td>
                          <span
                            className={`status
${each.status.toLowerCase()}`}
                          >
                            {each.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyLeaves;
