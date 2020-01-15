const express = require('express')
const bcrypt = require('bcryptjs')
require('./db/mongoose.js')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const noteRouter = require('./routes/note')

const app = express()

// KADA BUDEM POKRENUO SERVER U PRODUKCIJU OVO MORAM MAKNUT
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, PATCH, DELETE')
    next();
  });

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(noteRouter)

module.exports = app