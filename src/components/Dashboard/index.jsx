import { Component } from "react";

import Header from "../Header";
import Sidebar from "../Sidebar";

import { Users, UserCheck, CalendarX, Clock3 } from "lucide-react";

import "./index.css";

class Dashboard extends Component {
  state = {
    totalEmployees: 0,

    presentToday: 0,

    onLeave: 0,

    pendingLeaves: 0,

    departments: [],

    recentActivity: [],
  };

  componentDidMount() {
    this.getDashboardData();
  }

  getDashboardData = async () => {
    try {
      const response = await fetch(
        "https://hr-pulse-backend.onrender.com/api/dashboard/summary",
      );

      const data = await response.json();

      if (response.ok) {
        this.setState({
          totalEmployees: data.totalEmployees || 0,

          presentToday: data.presentToday || 0,

          onLeave: data.onLeave || 0,

          pendingLeaves: data.pendingLeaves || 0,

          departments: data.departments || [],

          recentActivity: data.recentActivity || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      totalEmployees,

      presentToday,

      onLeave,

      pendingLeaves,

      departments,

      recentActivity,
    } = this.state;

    const role = (localStorage.getItem("role") || "").toLowerCase();

    const employeeName = localStorage.getItem("userName") || "";

    const employeeId = localStorage.getItem("employeeId") || "";

    return (
      <div>
        <Header />

        <div className="home-container">
          <Sidebar />

          <div className="dashboard-content">
            <h1 className="dashboard-title">Dashboard</h1>

            {role !== "employee" && (
              <div className="cards-container">
                <div className="card">
                  <div className="icon-box blue">
                    <Users />
                  </div>

                  <div>
                    <h1>{totalEmployees}</h1>

                    <p>Total Employees</p>
                  </div>
                </div>

                <div className="card">
                  <div className="icon-box green">
                    <UserCheck />
                  </div>

                  <div>
                    <h1>{presentToday}</h1>

                    <p>Present Today</p>
                  </div>
                </div>

                <div className="card">
                  <div className="icon-box orange">
                    <CalendarX />
                  </div>

                  <div>
                    <h1>{onLeave}</h1>

                    <p>On Leave</p>
                  </div>
                </div>

                <div className="card">
                  <div className="icon-box yellow">
                    <Clock3 />
                  </div>

                  <div>
                    <h1>{pendingLeaves}</h1>

                    <p>Pending Leaves</p>
                  </div>
                </div>
              </div>
            )}

            {role === "employee" ? (
              <div className="bottom-section">
                <div className="activity-card">
                  <h2>Employee Information</h2>

                  <p>ID :{employeeId}</p>

                  <p>Name :{employeeName}</p>

                  <p>Role : Employee</p>
                </div>

                <div className="activity-card">
                  <h2>Leave Balance</h2>

                  <p>Sick Leaves : 10</p>

                  <p>Casual Leaves : 10</p>

                  <p>Earned Leaves : 10</p>
                </div>
              </div>
            ) : (
              <div className="bottom-section">
                <div className="activity-card">
                  <h2>Department Attendance Today</h2>

                  {departments.length === 0 ? (
                    <p>No Department Data</p>
                  ) : (
                    departments.map((each) => (
                      <p key={each.department}>
                        {each.department}:{each.total}
                        Employees
                      </p>
                    ))
                  )}
                </div>

                <div className="activity-card">
                  <h2>Recent Activity</h2>

                  {recentActivity.length === 0 ? (
                    <p>No Recent Activity</p>
                  ) : (
                    recentActivity.map((each) => (
                      <p key={each.created_at}>{each.action}</p>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
