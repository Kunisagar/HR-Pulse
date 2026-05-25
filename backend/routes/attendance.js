const express = require('express')

const router = express.Router()

const initializeDB =
  require('../database')



router.post(
  '/check-in',

  async (req, res) => {

    try {

      const {
        employeeId,
        employeeName,
      } = req.body


      const db =
        await initializeDB()


      const currentTime =
        new Date()


      const date =
        currentTime
          .toISOString()
          .split('T')[0]


      const time =
        currentTime
          .toLocaleTimeString()


      const existingAttendance =
        await db.get(

          `
          SELECT *

          FROM attendance

          WHERE employee_id = ?
          AND attendance_date = ?
          `,

          [
            employeeId,
            date,
          ]

        )


      if (existingAttendance) {

        return res
          .status(400)
          .json({

            message:
              'Already checked in today',

          })

      }


      await db.run(

        `
        INSERT INTO attendance(

          employee_id,
          employee_name,
          check_in,
          check_out,
          work_hours,
          status,
          attendance_date

        )

        VALUES(
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

          employeeId,
          employeeName,
          time,
          '',
          '0h 0m',
          'Present',
          date,

        ]

      )


      await db.run(

        `
        INSERT INTO activity_logs(

          employee_id,
          action

        )

        VALUES(
          ?,
          ?
        )
        `,

        [

          employeeId,
          `${employeeName} checked in`

        ]

      )


      res
        .status(200)
        .json({

          message:
            'Checked in successfully',

        })

    }

    catch (error) {

      console.log(
        'CHECKIN ERROR:',
        error
      )

      res
        .status(500)
        .json({

          message:
            'Check In Failed',

          error:
            error.message

        })

    }

  }

)




router.post(
  '/check-out',

  async (req, res) => {

    try {

      const {
        employeeId
      } = req.body


      const db =
        await initializeDB()


      const current =
        new Date()


      const date =
        current
          .toISOString()
          .split('T')[0]


      const checkout =
        current
          .toLocaleTimeString()


      const attendance =
        await db.get(

          `
          SELECT *

          FROM attendance

          WHERE employee_id = ?
          AND attendance_date = ?
          `,

          [
            employeeId,
            date
          ]

        )


      if (!attendance) {

        return res
          .status(404)
          .json({

            message:
              'Check in first'

          })

      }


      if (attendance.check_out) {

        return res
          .status(400)
          .json({

            message:
              'Already checked out'

          })

      }


      const start =
        new Date(
          `2000-01-01 ${attendance.check_in}`
        )


      const end =
        new Date(
          `2000-01-01 ${checkout}`
        )


      const diff =
        Math.abs(
          end - start
        )


      const hours =
        Math.floor(
          diff / 3600000
        )


      const mins =
        Math.floor(
          (diff % 3600000) / 60000
        )


      const workHours =
        `${hours}h ${mins}m`


      await db.run(

        `
        UPDATE attendance

        SET

        check_out = ?,
        work_hours = ?

        WHERE id = ?
        `,

        [
          checkout,
          workHours,
          attendance.id
        ]

      )


      await db.run(

        `
        INSERT INTO activity_logs(

          employee_id,
          action

        )

        VALUES(
          ?,
          ?
        )
        `,

        [

          employeeId,

          `${attendance.employee_name} checked out`

        ]

      )


      res
        .status(200)
        .json({

          message:
            'Checked out successfully'

        })

    }

    catch (error) {

      console.log(
        'CHECKOUT ERROR:',
        error
      )

      res
        .status(500)
        .json({

          message:
            'Checkout Failed',

          error:
            error.message

        })

    }

  }

)




router.get(
  '/',

  async (req, res) => {

    try {

      const role =
        req.query.role

      const employeeId =
        req.query.employeeId


      const db =
        await initializeDB()


      let attendance = []


      if (
        role ===
        'Employee'
      ) {

        attendance =
          await db.all(

            `
            SELECT *

            FROM attendance

            WHERE employee_id = ?

            ORDER BY id DESC
            `,

            [
              employeeId
            ]

          )

      }

      else {

        attendance =
          await db.all(

            `
            SELECT *

            FROM attendance

            ORDER BY id DESC
            `

          )

      }


      res
        .status(200)
        .json(
          attendance
        )

    }

    catch (error) {

      res
        .status(500)
        .json({

          message:
            'Fetch Failed',

          error:
            error.message

        })

    }

  }

)


module.exports =
  router