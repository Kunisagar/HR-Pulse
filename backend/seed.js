const fs = require('fs')

const path = require('path')

const initializeDB =
require('./database')


const createTables =
async () => {

  try {

    const db =
      await initializeDB()

    const schemaPath =
      path.join(
        __dirname,
        'schema.sql'
      )

    const schema =
      fs.readFileSync(
        schemaPath,
        'utf8'
      )

    await db.exec(
      schema
    )


    await db.run(`
        INSERT OR IGNORE INTO users
            (

            employee_id,
            name,
            email,
            password,
            role,
            department,
            designation,
            joining_date,
            leave_balance

            )

            VALUES
            (

            'EMP001',
            'Sagar Kuni',
            'sagar@gmail.com',
            '123456',
            'Employee',
            'Engineering',
            'Frontend Developer',
            '2026-05-25',
            20

            )
            `
            )


    await db.run(

      `
      INSERT OR IGNORE INTO users
      (

        employee_id,
        name,
        email,
        password,
        role,
        department,
        designation,
        joining_date,
        leave_balance

      )

      VALUES
      (

        'EMP002',
        'Rahul Sharma',
        'hr@gmail.com',
        '123456',
        'HR',
        'Human Resources',
        'HR Manager',
        '2026-05-25',
        20

      )
      `
    )


    await db.run(

      `
      INSERT OR IGNORE INTO users
      (

        employee_id,
        name,
        email,
        password,
        role,
        department,
        designation,
        joining_date,
        leave_balance

      )

      VALUES
      (

        'EMP003',
        'Priya Patel',
        'admin@gmail.com',
        '123456',
        'Admin',
        'Administration',
        'System Admin',
        '2026-05-25',
        20

      )
      `
    )


    await db.run(

      `
      INSERT OR IGNORE INTO users
      (

        employee_id,
        name,
        email,
        password,
        role,
        department,
        designation,
        joining_date,
        leave_balance

      )

      VALUES
      (

        'EMP004',
        'Amit Kumar',
        'manager@gmail.com',
        '123456',
        'Manager',
        'Engineering',
        'Team Manager',
        '2026-05-25',
        20

      )
      `
    )


    console.log(
      'Tables and seed data created successfully 🚀'
    )

    process.exit()

  }

  catch(error){

    console.log(
      error.message
    )

  }

}

createTables()