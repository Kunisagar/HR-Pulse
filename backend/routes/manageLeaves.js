const express = require('express')

const router =
  express.Router()

const initializeDB =
  require('../database')



router.get(
'/',

async(req,res)=>{

try{

const db=
await initializeDB()


const leaves=
await db.all(

`
SELECT

leave_requests.*,

users.name AS employee_name

FROM leave_requests

LEFT JOIN users

ON leave_requests.employee_id=
users.employee_id

ORDER BY id DESC
`

)

res
.status(200)
.json(leaves)

}

catch(error){

res
.status(500)
.json({

message:
'Failed to fetch',

error:
error.message

})

}

}

)




router.put(
'/:id/approve',

async(req,res)=>{

try{

const{id}=
req.params

const db=
await initializeDB()


await db.run(

`
UPDATE leave_requests

SET status='Approved'

WHERE id=?
`,

[id]

)


res
.status(200)
.json({

message:
'Leave Approved'

})

}

catch(error){

res
.status(500)
.json({

message:
'Approval failed',

error:
error.message

})

}

}

)




router.put(
'/:id/reject',

async(req,res)=>{

try{

const{id}=
req.params

const db=
await initializeDB()


await db.run(

`
UPDATE leave_requests

SET status='Rejected'

WHERE id=?
`,

[id]

)


res
.status(200)
.json({

message:
'Leave Rejected'

})

}

catch(error){

res
.status(500)
.json({

message:
'Reject failed',

error:
error.message

})

}

}

)


module.exports=
router