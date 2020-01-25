const express = require('express');
const router = express.Router();
const Product = require('../model/product');

router.get("/", (req, res, next) => {
    Product.list()
        .then( ([productList]) => res.render('products/productList', {
            home: 'home',
            productList: productList
        }))
        .catch(err => console.log(err));
});

module.exports.route = router;
