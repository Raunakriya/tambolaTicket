const express=require('express')
const bodyParser = require('body-parser');
const app=express();
const router=require('./router.js')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',router);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});