const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

//
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt.js');
const errorHandler = require('./helpers/error-handler');

//middleware

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());
app.use(authJwt());
app.use(errorHandler);

//api declaration
const api = process.env.API_URL;

//Routes
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');

//

//Routes.....
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
/*app.use(`${api}/orders`, ordersRoutes); */
app.use(`${api}/categories`, categoriesRoutes);

//
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'talkmart',
  })
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.log(err);
  });

//port
app.listen(3000, () => {
  console.log(api);
  console.log('server started');
});
