const express = require('express')

const jwt = require('jsonwebtoken')

const router =
  express.Router()

const initializeDB =
  require('./database')

const JWT_SECRET =
  'HR_PULSE_SECRET'


router.post(
  '/login',

  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body


      if (
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({

            message:
              'Email and Password required',

          })

      }


      const db =
        await initializeDB()


      const user =
        await db.get(

          `
          SELECT *
          FROM users
          WHERE email = ?
          `,

          [email]

        )


      if (!user) {

        return res
          .status(404)
          .json({

            message:
              'User not found',

          })

      }


      const passwordMatched =
        password ===
        user.password


      if (!passwordMatched) {

        return res
          .status(401)
          .json({

            message:
              'Invalid password',

          })

      }


      const payload = {

        employeeId:
          user.employee_id,

        name:
          user.name,

        role:
          user.role,

        email:
          user.email,

      }


      const jwtToken =
        jwt.sign(
          payload,
          JWT_SECRET,
          {

            expiresIn:
            '7d'

          }
        )


      res
        .status(200)
        .json({

          jwtToken,

          user: {

            employeeId:
              user.employee_id,

            name:
              user.name,

            email:
              user.email,

            role:
              user.role,

            department:
              user.department,

          }

        })

    }

    catch (error) {

      res
        .status(500)
        .json({

          message:
            'Login failed',

          error:
            error.message

        })

    }

  }
)


router.post(
  '/register',

  async (req, res) => {

    try {

      const {

        name,
        email,
        password,
        role,
        department,

      } = req.body


      if (

        !name ||
        !email ||
        !password ||
        !role

      ) {

        return res
          .status(400)
          .json({

            message:
            'Required fields missing'

          })

      }


      const db =
        await initializeDB()


      const existingUser =
        await db.get(

          `
          SELECT *
          FROM users
          WHERE email = ?
          `,

          [email]

        )


      if (existingUser) {

        return res
          .status(400)
          .json({

            message:
            'Email already exists'

          })

      }


      const employeeId =
        `EMP${Date.now()}`


      await db.run(

        `
        INSERT INTO users
        (

          employee_id,
          name,
          email,
          password,
          role,
          department

        )

        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,

        [

          employeeId,
          name,
          email,
          password,
          role,
          department,

        ]

      )


      res
        .status(201)
        .json({

          message:
          'User registered successfully'

        })

    }

    catch (error) {

      res
        .status(500)
        .json({

          message:
          'Registration failed',

          error:
          error.message

        })

    }

  }

)


module.exports =
router