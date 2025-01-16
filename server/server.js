const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
const port = 4000;

connectDB();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.listen(port, () => console.log(`Server running on port ${port}`));