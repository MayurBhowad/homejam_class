const express = require('express');
const cors = require('cors');
const PG_CONN = require('./config/pg.db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// CONNECTION WITH POSTGRES
PG_CONN.connect()
    .then(() => console.log('Postgress db is up and Rolling...'))
    .catch(err => console.log('DB_ERROR: ', err.message));

app.get('/', (req, res) => {
    res.json({ success: true, route: '/' })
})

app.use('/', require('./routes'));

app.listen(PORT, () => console.log(`Api is up and Rolling...`));