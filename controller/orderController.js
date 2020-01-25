const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const ProductOrder = require('../model/product_order');

router.get("/", (req, res, next) => {
    Order.list()
        .then(([orderList]) => {
            res.render('orders/orderList', {
                orderList: orderList
            })
        })
        .catch(err => console.log(err));
});

// router.post("/add", (req, res, next) => {
//    if (!isAnyRequiredFieldMissing(req, res) && !isAnyFieldWrongParamType(req, res)) {
    // const newOrder = new Order(req.body.first_name, req.body.last_name, req.body.email, req.body. delivery, req.body.address);
    // Order.add(newOrder)
    //     .then(() => res.redirect("/orders"))
    //     .catch(err => console.log(err));
//    }
// });

// router.post("/edit", (req, res, next) => {
//    if (!isAnyRequiredFieldMissing(req, res) && !isAnyFieldWrongParamType(req, res)) {
//     const order = new Order(req.body.first_name, req.body.last_name, req.body.email, req.body.delivery, req.body.address, req.body.order_id);
//     Order.edit(order)
//         .then(() => res.redirect("/orders"))
//         .catch(err => console.log(err));
//    }
// });

router.get("/delete", (req, res, next) => {
    const orderId = req.query.order_id;
    Order.delete(orderId)
    // ProductOrder.list(orderId)
    //     .then(() => {
            // ProductOrder.delete(orderId)
            //     .then(() => {
            //         Order.delete(orderId)
                        .then(() => res.redirect("/orders"))
                        .catch(err => console.log(err));
                // })
                // .catch(err => console.log(err));
        // })
        // .catch(err => console.log(err));
});

module.exports.route = router;