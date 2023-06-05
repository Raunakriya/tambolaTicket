const express=require('express')
const router=express.Router();
const Controller=require('./controller.js');

router.post('/login',Controller.login);
router.post('/tickets',Controller.createTickets);
router.get('/tickets/:id',Controller.getTickets);


module.exports =router