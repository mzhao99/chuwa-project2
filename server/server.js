const express = require('express');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
const port = 4000;

connectDB();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/products', productRouter);
app.use(errorHandlerMiddleware);

app.listen(port, () => console.log(`Server running on port ${port}`));
