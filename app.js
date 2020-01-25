const fs = require('fs');
const path = require('path');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// parsuje dane typu application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'A very very secret password',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 20 * 60 * 1000 // (20 min)
    }
}));

app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

const homeController = require('./controller/homeController');
app.use('/', homeController.route);

const productController = require('./controller/productController');
app.use('/products', productController.route);

const orderController = require('./controller/orderController');
app.use('/orders', orderController.route);

 const productOrderController = require('./controller/productOrderController');
 app.use('/cart', productOrderController.route);

const db = require('./db/mysql');
let dbSchemaScript = fs.readFileSync(path.join(__dirname, '/db/schema.sql')).toString();
// console.log(`Attempt to run schema.sql...`);
// console.log(dbSchemaScript);
db.query(dbSchemaScript)
//     .then( () => {
//         return db.execute('select * from products');
//     })
//     .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});