const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const Product = require('../model/product');
const ProductOrder = require('../model/product_order');

let tempCartList = [];

router.get("/showDetails", (req, res, next) => {
    const orderId = req.query.order_id;
    Order.details(orderId)
        .then(([order]) => {
            let globalOrder = order[0];
            ProductOrder.list(orderId)
                .then(([list]) => {
                    changeDates(list);
                    res.render('products_orders/productOrderDetails', {
                        pageTitle: "Zamówienie " + orderId,
                        order: globalOrder,
                        productList: list
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.get("/showAddForm", (req, res, next) => {
    let product_id = req.query.product_id;
    if (product_id) {
        Product.details(product_id)
            .then(([product]) => {
                let globalProduct = product[0];
                changeDate(globalProduct);
                tempCartList.push(globalProduct);
                res.render('products_orders/productOrderForm', {
                    pageTitle: "Nowe zamówienie",
                    formAction: "add",
                    order: {},
                    productList: tempCartList
                });
            })
            .catch(err => console.log(err));
    } else {
        res.render('products_orders/productOrderForm', {
            pageTitle: "Nowe zamówienie",
            formAction: "add",
            order: {},
            productList: {}
        });
    }
});

router.get("/showEditForm", (req, res, next) => {
    const orderId = req.query.order_id;
    Order.details(orderId)
        .then(([order]) => {
            let globalOrder = order[0];
            ProductOrder.list(orderId)
                .then(([list]) => {
                    changeDates(list);
                    res.render('products_orders/productOrderForm', {
                        pageTitle: "Zamówienie " + orderId,
                        formAction: 'edit',
                        order: globalOrder,
                        productList: list
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.post("/add", (req, res, next) => {
    if (!isAnyRequiredFieldMissing(req, res) && !isAnyFieldWrongParamType(req, res)) {
        let products = [];
        let data = req.body.product_id;
        if (typeof data !== 'string') {
            products = req.body.product_id;
        } else {
            products.push(req.body.product_id);
        }
        const newOrder = new Order(req.body.first_name, req.body.last_name, req.body.email, req.body.delivery, req.body.address);
        newOrder.delivery ? newOrder.delivery = 1 : newOrder.delivery = 0;

        console.log('body', req.body);

        Order.add(newOrder)
            .then(() => {
                Order.maxId()
                    .then(([max]) => {
                        const date = new Date();
                        products.forEach(function (item, index) {
                            const productOrder = new ProductOrder(max[0].id, item, req.body.quantity[index], date);
                            ProductOrder.add(productOrder);
                        })
                    })
                    .then(() => res.redirect("/orders"))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
});

router.post("/edit", (req, res, next) => {
    if (!isAnyRequiredFieldMissing(req, res) && !isAnyFieldWrongParamType(req, res)) {
        let products = [];
        let data = req.body.product_id;
        if (typeof data !== 'string') {
            products = req.body.product_id;
        } else {
            products.push(req.body.product_id);
        }
        const order = new Order(req.body.first_name, req.body.last_name, req.body.email, req.body.delivery, req.body.address, req.body.order_id);
        order.delivery ? order.delivery = 1 : order.delivery = 0;

        console.log(req.body);

        Order.edit(order)
            .then(() => {
                const date = new Date();
                products.forEach(function (item, index) {
                    const productOrder = new ProductOrder(req.body.order_id, item, req.body.quantity[index], date, req.body.cart_id[index]);
                    ProductOrder.edit(productOrder);
                });
            })
            .then(() => res.redirect("/orders"))
            .catch(err => console.log(err));
    }
});


function changeDate(item) {
    if (item.exp_date) {
        item.exp_date = new Date(item.exp_date + ' EDT').toISOString().slice(0, 10);
    }
}

function changeDates(list) {
    list.forEach(function (item) {
        changeDate(item);
    });
}


const FIRST_NAME = 'first_name';
const LAST_NAME = 'last_name';
const EMAIL = 'email';

const stringType = "string";

function isAnyRequiredFieldMissing(req, res) {
    let reqBody = req.body;
    let isFieldMissing = false;

    if (!reqBody.first_name) {
        missingParam(req, res, FIRST_NAME);
        isFieldMissing = true;
    }
    if (!reqBody.last_name) {
        missingParam(req, res, LAST_NAME);
        isFieldMissing = true;
    }
    if (!reqBody.email) {
        missingParam(req, res, EMAIL);
        isFieldMissing = true;
    }
    if (isFieldMissing) {
        console.log('error');
        // res.render('products/productForm', {pageTitle: "Nowy produkt", formAction: "add", product: {}});
    }
    return isFieldMissing;
}

function isAnyFieldWrongParamType(req, res) {
    let reqBody = req.body;
    let isFieldWrongType = false;

    if (!isString(reqBody.first_name)) {
        paramWrongType(req, res, FIRST_NAME);
        isFieldWrongType = true;
    }
    if (!isString(reqBody.last_name)) {
        paramWrongType(req, res, LAST_NAME);
        isFieldWrongType = true;
    }
    if (!isString(reqBody.email)) {
        paramWrongType(req, res, EMAIL);
        isFieldWrongType = true;
    }
    if (isFieldWrongType) {
        console.log('error');
        // res.render('products/productForm', {pageTitle: "Nowy produkt", formAction: "add", product: {}});
    }
    return isFieldWrongType;
}

function missingParam(req, res, paramName) {
    // req.flash('error' + paramName, paramName + ' is missing');
    console.log('error', paramName + ' is missing');
}

function paramWrongType(req, res, paramName) {
    // req.flash('error' + paramName, paramName + ' has wrong type');
    console.log('error', paramName + ' has wrong type');
}

function isString(responseValue) {
    return typeof responseValue === stringType;
}

module.exports.route = router;