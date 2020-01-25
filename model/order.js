const db = require('../db/mysql');

class Order {
    constructor(firstName, lastName, email, delivery, address, id) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.delivery = delivery;
        this.address = address;
    }

    static add(order) {
        return db.execute(
            'insert into orders (first_name, last_name, email, delivery, address) values (?, ?, ?, ?, ?)',
            [order.firstName, order.lastName, order.email, order.delivery, order.address]
        );
    }

    static list() {
        return db.execute('select * from orders');
    }

    static delete(id) {
        return db.execute('delete from orders where id=(?)', [id]);
    }

    static edit(order) {
        return db.execute('update orders set first_name=(?), last_name=(?), email=(?), delivery=(?), address=(?) where id=(?)',
            [order.firstName, order.lastName, order.email, order.delivery, order.address, order.id]);
    }

    static details(id) {
        return db.execute('select * from orders where id=(?)', [id]);
    }

    static maxId() {
        return db.execute('select id from orders order by id desc limit 1');
    }
}
module.exports = Order;