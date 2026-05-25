const express = require('express')

const router = express.Router()

const initializeDB = require('../database')


// Get all employees

router.get(
  '/',
  async (req, res) => {

    try {

      const db =
        await initializeDB()

      const employees =
        await db.all(`
          SELECT *
          FROM users
        `)

      res
        .status(200)
        .json(employees)

    } catch (error) {

      res
        .status(500)
        .json({

          message:
            'Failed to fetch employees',

          error:
            error.message,

        })

    }

  }
)


// Create employee

router.post(
  '/',
  async (req, res) => {

    try {

      const {

        name,
        email,
        role,
        department,
        designation,
        joiningDate,
        leaveBalance,

      } = req.body


      if (
        !name ||
        !email ||
        !role
      ) {

        return res
          .status(400)
          .json({

            message:
              'Required fields missing',

          })

      }


      const db =
        await initializeDB()


      await db.run(

        `
          INSERT INTO users
          (

            name,
            email,
            role,
            department,
            designation,
            joining_date,
            leave_balance

          )

          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
          )
        `,

        [
          name,
          email,
          role,
          department,
          designation,
          joiningDate,
          leaveBalance,
        ]

      )


      res
        .status(201)
        .json({

          message:
            'Employee created successfully',

        })

    } catch (error) {

      res
        .status(500)
        .json({

          message:
            'Failed creating employee',

          error:
            error.message,

        })

    }

  }
)


module.exports = router