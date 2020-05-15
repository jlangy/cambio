const express = require('express');
// require('dotenv').config();
const socket = require('socket.io');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();
const server = app.listen(port, () => console.log(`listening on port ${port}`));
const io = socket(server);

io.on('connection', socket => {
  console.log('connection established')
});