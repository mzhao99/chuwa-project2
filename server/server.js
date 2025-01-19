const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
const port = 4000;

const authRouter = require('./routes/authRoutes');
const visaRouter = require('./routes/visaRoutes');
const onboardingRouter = require('./routes/onboardingRoutes');

connectDB();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/visa', visaRouter);
app.use('./onboarding', onboardingRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));

