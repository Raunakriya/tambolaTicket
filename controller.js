const express = require('express');
const db = require("./dbHelper");
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const val = require('./constant');
const SECRET_KEY = 'RAUNAK'
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));





//post Api for login
const login = async (req, res) => {
    try {
        var credentials = await db.excuteQuery(val.loginQuery, [req.body.email_id])
        if (credentials.length <= 0) {
            res.status(401).send({
                msg: 'Invalid User !',
                status: 401
            });
        }
        var password = req.body.password

        if (!password) {
            res.status(401).send({
                msg: 'Username or password is incorrect!',
                status: 401
            });
        }
        else {
            const token = jwt.sign({ email_id: credentials.email_id }, SECRET_KEY);
            res.status(200).send({
                msg: 'Logged in!',
                token,
                user: credentials[0],
                status: 200
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({
            msg: err,
            status: 500
        });
    }

}



// API endpoint for creating a Tambola ticket
const createTickets = (req, res) => {
    const numberOfTickets = req.body.numberOfTickets;

    if (!numberOfTickets) {
        return res.status(400).json({ message: 'Number of tickets is required.' });
    }

    // Generate tickets
    const tickets = generateTambolaTickets(numberOfTickets);

    // Store tickets in the database
    const ticketData = JSON.stringify(tickets);
    const sql = 'INSERT INTO tickets (tickets) VALUES (?)';
    db.db.query(sql, [ticketData], (error, result) => {
        if (error) {
            console.error('Error storing tickets in the database:', error);
            return res.status(500).json({ message: 'Failed to create tickets.' });
        }

        const ticketId = result.insertId;
        return res.status(201).json({ ticketId });
    });

}

// Helper function to generate Tambola tickets
function generateTambolaTickets(numberOfTickets) {
    const tickets = [];
    for (let i = 0; i < numberOfTickets; i++) {
      const ticket = [];
      const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
      for (let j = 0; j < 3; j++) {
        const row = Array.from({ length: 9 }, () => 0);
        for (let k = 0; k < 5; k++) {
          const index = Math.floor(Math.random() * availableNumbers.length);
          const number = availableNumbers.splice(index, 1)[0];
          row[k] = number;
        }
        row.sort((a, b) => a - b);
        ticket.push(row);
      }
      tickets.push(ticket);
    }
    return tickets;

}



















// API endpoint for fetching Tambola tickets by ID with pagination
const getTickets = (req, res) => {
    const ticketId = req.params.id;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
  
    const offset = (page - 1) * pageSize;
    const sql = 'SELECT tickets FROM tickets WHERE id = ? LIMIT ? OFFSET ?';
    db.db.query(sql, [ticketId, pageSize, offset], (error, results) => {
      if (error) {
        console.error('Error fetching tickets from the database:', error);
        return res.status(500).json({ message: 'Failed to fetch tickets.' });
      }
  
      const tickets = results.map((row) => JSON.parse(row.tickets));
      return res.json(tickets);
    });
};








module.exports = { login, createTickets, getTickets }