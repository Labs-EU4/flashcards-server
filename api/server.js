const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const apiRouter = require('./apiRouter');
const googlePassport = require('../utils/googlePassport');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use(googlePassport.Passport.initialize());
server.use(googlePassport.Passport.session());

server.use('/api', apiRouter);
server.get('/', (req, res) => {
  res.status(200).json({ message: `Welcome to the QuickDecks API` });
});

module.exports = server;
