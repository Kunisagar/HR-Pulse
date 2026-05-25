CREATE TABLE IF NOT EXISTS users (

    id INTEGER
    PRIMARY KEY AUTOINCREMENT,

    employee_id TEXT
    UNIQUE,

    name TEXT
    NOT NULL,

    email TEXT
    UNIQUE
    NOT NULL,

    password TEXT
    NOT NULL,

    role TEXT
    NOT NULL,

    department TEXT,

    designation TEXT,

    joining_date TEXT,

    leave_balance INTEGER
    DEFAULT 20,

    created_at DATETIME
    DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS departments (

    id INTEGER
    PRIMARY KEY AUTOINCREMENT,

    department_name TEXT
    UNIQUE

);



CREATE TABLE IF NOT EXISTS attendance (

    id INTEGER
    PRIMARY KEY
    AUTOINCREMENT,

    employee_id TEXT,

    employee_name TEXT,

    attendance_date TEXT,

    check_in TEXT,

    check_out TEXT,

    work_hours TEXT,

    status TEXT
    DEFAULT 'Absent',

    FOREIGN KEY(employee_id)
    REFERENCES users(employee_id)

);



CREATE TABLE IF NOT EXISTS leave_requests (

    id INTEGER
    PRIMARY KEY AUTOINCREMENT,

    employee_id TEXT,

    leave_type TEXT,

    start_date TEXT,

    end_date TEXT,

    reason TEXT,

    status TEXT
    DEFAULT 'Pending',

    remarks TEXT,

    created_at DATETIME
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(employee_id)
    REFERENCES users(employee_id)

);



CREATE TABLE IF NOT EXISTS leave_balances (

    id INTEGER
    PRIMARY KEY AUTOINCREMENT,

    employee_id TEXT,

    casual_leave INTEGER
    DEFAULT 10,

    sick_leave INTEGER
    DEFAULT 10,

    earned_leave INTEGER
    DEFAULT 10,

    FOREIGN KEY(employee_id)
    REFERENCES users(employee_id)

);



CREATE TABLE IF NOT EXISTS activity_logs (

    id INTEGER
    PRIMARY KEY AUTOINCREMENT,

    employee_id TEXT,

    action TEXT,

    created_at DATETIME
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(employee_id)
    REFERENCES users(employee_id)

);