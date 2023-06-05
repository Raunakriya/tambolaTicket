
const host= "localhost"
const user= "root"
const password= "root"
const database= "raunak"

var loginQuery = "SELECT * FROM user WHERE email_id =?"

module.exports={host,user,password,database,loginQuery}