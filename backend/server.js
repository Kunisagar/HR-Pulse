const express =
require('express')

const cors =
require('cors')

const manageLeavesRoutes =
require('./routes/manageLeaves')

const app =
express()


app.use(
  cors()
)

app.use(
  express.json()
)



app.use(

  '/api/auth',

  require(
    './auth'
  )

)


app.use(

  '/api/employees',

  require(
    './routes/employees'
  )

)


app.use(

  '/api/leaves',

  require(
    './routes/leaves'
  )

)


app.use(

  '/api/dashboard',

  require(
    './routes/dashboard'
  )

)


app.use(

  '/api/attendance',

  require(
    './routes/attendance'
  )

)


app.use(

  '/api/manage-leaves',

  manageLeavesRoutes

)



app.get(

'/',

(req,res)=>{

res.send(

'HR Pulse Backend Running 🚀'

)

}

)



app.listen(

3000,

()=>{

console.log(

'Server Running on Port 3000'

)

}

)