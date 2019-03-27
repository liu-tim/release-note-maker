const express = require('express');
const session = require('express-session');
const randomString = require('randomstring');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(express.static('dist'));
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(
  session({
    secret: randomString.generate(),
    resave: false,
    saveUninitialized: false
  })
);

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

app.use(require('./routes'));


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));