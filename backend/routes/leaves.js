const express=require('express')

const router=
express.Router()

const initializeDB=
require('../database')


router.get(
'/:employeeId',

async(req,res)=>{

try{

const db=
await initializeDB()

const data=
await db.all(

`
SELECT

leave_requests.*,

users.name
AS employee_name

FROM leave_requests

LEFT JOIN users

ON

leave_requests.employee_id=
users.employee_id

WHERE
leave_requests.employee_id=?

ORDER BY id DESC
`,

[
req.params.employeeId
]

)

res.json(data)

}

catch(error){

res.status(500)
.json({

message:error.message

})

}

})

module.exports=
router