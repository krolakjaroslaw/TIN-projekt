const db = require('../db/mysql');

class ProductOrder {
    constructor(orderId, productId, quantity, dateCreated, id) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.dateCreated = dateCreated;
    }

    static add(productOrder) {
        return db.execute(
            'insert into products_orders (order_id, product_id, quantity, date_created) values (?, ?, ?, ?)',
            [productOrder.orderId, productOrder.productId, productOrder.quantity, productOrder.dateCreated]
        );
    }

    static list(id) {
        return db.execute('select * from products_orders po join products p on po.product_id = p.product_id where po.order_id=(?)', [id]);
    }

    static delete(id) {
        return db.execute('delete from products_orders where order_id=(?)', [id]);
    }

    static edit(productOrder) {
        return db.execute('update products_orders set order_id=(?), product_id=(?), quantity=(?), date_created=(?) where id=(?)',
            [productOrder.orderId, productOrder.productId, productOrder.quantity, productOrder.dateCreated, productOrder.id]);
    }

    static details(id) {
        return db.execute('select * from products_orders where id=(?)', [id]);
    }
}
module.exports = ProductOrder;