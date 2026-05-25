const express = require('express')

const router =
  express.Router()

const initializeDB =
  require('../database')

router.get(
  '/summary',

  async (req, res) => {

    try {

      const db =
        await initializeDB()


      const totalEmployees =
        await db.get(
          `
          SELECT
          COUNT(*) AS count
          FROM users
          `
        )


      const presentToday =
        await db.get(
          `
          SELECT
          COUNT(*) AS count
          FROM attendance
          WHERE status='Present'
          `
        )


      const pendingLeaves =
        await db.get(
          `
          SELECT
          COUNT(*) AS count
          FROM leave_requests
          WHERE status='Pending'
          `
        )


      const onLeave =
        await db.get(
          `
          SELECT
          COUNT(*) AS count
          FROM leave_requests
          WHERE status='Approved'
          `
        )


      const departments =
        await db.all(
          `
          SELECT
          department,
          COUNT(*) AS total

          FROM users

          GROUP BY department
          `
        )


      // temporary empty array
      // until activity_logs table created

      const recentActivity = []


      res.status(200).json({

        totalEmployees:
          totalEmployees.count,

        presentToday:
          presentToday.count,

        pendingLeaves:
          pendingLeaves.count,

        onLeave:
          onLeave.count,

        departments,

        recentActivity

      })

    }

    catch(error){

      res.status(500).json({

        message:
        'Dashboard error',

        error:
        error.message

      })

    }

  }

)

module.exports =
router