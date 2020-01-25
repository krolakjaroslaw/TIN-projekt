const express = require('express');
const router = express.Router();
const Product = require('../model/product');

router.get("/", (req, res, next) => {
    Product.list()
        .then(([productList]) => res.render('products/productList', {
            home: '',
            productList: productList
        }))
        .catch(err => console.log(err));
});

router.get("/showAddForm", (req, res, next) => {
    res.render('products/productForm', {
        pageTitle: "Nowy produkt",
        formAction: "add",
        product: {}
    });
});

router.get("/showEditForm", (req, res, next) => {
    const productId = req.query.product_id;
    Product.details(productId)
        .then(([product]) => {
            let globalProduct = product[0];
            globalProduct.exp_date = new Date(globalProduct.exp_date + ' EDT').toISOString().slice(0, 10);
            res.render('products/productForm', {
                pageTitle: "Produkt " + productId,
                formAction: "edit",
                product: globalProduct
            });
        })
        .catch(err => console.log(err));
});

router.post("/add", (req, res, next) => {
    console.log(req.body);
    if (!isAnyRequiredFieldMissing(req, res) && !isAnyFieldWrongParamType(req, res)) {
        const newProduct = new Product(req.body.name, req.body.unit, req.body.quantity_to_sale, req.body.price,
            req.body.expiration_date, req.body.image, req.body.description);
        Product.add(newProduct)
            .then(() => {
                console.log('product', newProduct);
                res.redirect("/products")
            })
            .catch(err => console.log(err));
    }
});

router.post("/edit", (req, res, next) => {
    if (!isAnyRequiredFieldMissing(req, res) && !isAnyFieldWrongParamType(req, res)) {
        const product = new Product(req.body.name, req.body.unit, req.body.quantity_to_sale, req.body.price,
            req.body.expiration_date, req.body.image, req.body.description, req.body.product_id);
        Product.edit(product)
            .then(() => res.redirect("/products"))
            .catch(err => console.log(err));
    }
});

router.get("/showDetails", (req, res, next) => {
    const productId = req.query.product_id;
    Product.details(productId)
        .then(([product]) => {
            const globalProduct = product[0];
            globalProduct.exp_date = new Date(globalProduct.exp_date + ' EDT').toISOString().slice(0, 10);
            res.render('products/productDetails', {
                pageTitle: "Produkt " + productId,
                product: globalProduct
            });
        })
        .catch(err => console.log(err));
});

router.get("/delete", (req, res, next) => {
    const productId = req.query.product_id;
    Product.delete(productId)
        .then(() => res.redirect("/products"))
        .catch(err => console.log(err));
});


const NAME = 'name';
const UNIT = 'unit';
const QUANTITY = 'quantity';
const PRICE = 'price';
const DATE = 'date';

const stringType = "string";
const numberType = "number";

function isAnyRequiredFieldMissing(req, res) {
    let reqBody = req.body;
    let isFieldMissing = false;

    if (!reqBody.name) {
        missingParam(req, res, NAME);
        isFieldMissing = true;
    }
    if (!reqBody.unit) {
        missingParam(req, res, UNIT);
        isFieldMissing = true;
    }
    if (!reqBody.quantity_to_sale) {
        missingParam(req, res, QUANTITY);
        isFieldMissing = true;
    }
    if (!reqBody.price) {
        missingParam(req, res, PRICE);
        isFieldMissing = true;
    }
    if (!reqBody.expiration_date) {
        missingParam(req, res, DATE);
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

    if (!isString(reqBody.name)) {
        paramWrongType(req, res, NAME);
        isFieldWrongType = true;
    }
    if (!isString(reqBody.unit)) {
        paramWrongType(req, res, UNIT);
        isFieldWrongType = true;
    }
    if (!isNumber(parseInt(reqBody.quantity_to_sale))) {
        paramWrongType(req, res, QUANTITY);
        isFieldWrongType = true;
    }
    if (!isNumber(parseFloat(reqBody.price))) {
        paramWrongType(req, res, PRICE);
        isFieldWrongType = true;
    }
    if (isNumberLowerThanZero(parseFloat(reqBody.price))) {
        paramLowerThanZero(req, res, PRICE);
        isFieldWrongType = true;
    }
    if (!isString(reqBody.expiration_date)) {
        paramWrongType(req, res, DATE);
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

function paramLowerThanZero(req, res, paramName) {
    // req.flash('error' + paramName, paramName + ' has wrong type');
    console.log('error', paramName + ' is lower than 0');
}

function isString(responseValue) {
    return typeof responseValue === stringType;
}

function isNumber(responseValue) {
    return typeof responseValue === numberType;
}

function isNumberLowerThanZero(responseValue) {
    return responseValue < 0;
}

module.exports.route = router;