const db = require('../db/mysql');

class Product {
    constructor(name, unit, quantityToSale, price, expirationDate, image, description, id) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.quantityToSale = parseInt(quantityToSale);
        this.price = parseFloat(price).toFixed(2);
        this.expirationDate = expirationDate;
        this.image = image;
        this.description = description;
    }

    static add(product) {
        return db.execute(
            'insert into products (product_name, unit, quantity_to_sale, price, exp_date, image, description) values (?, ?, ?, ?, ?, ?, ?)',
            [product.name, product.unit, product.quantityToSale, product.price, product.expirationDate, product.image, product.description]
        );
    }

    static list() {
        return db.execute('select * from products');
    }

    static delete(id) {
        return db.execute('delete from products where product_id=(?)', [id]);
    }

    static edit(product) {
        return db.execute('update products set product_name=(?), unit=(?), quantity_to_sale=(?), price=(?), exp_date=(?), image=(?), description=(?) where product_id=(?)',
            [product.name, product.unit, product.quantityToSale, product.price, product.expirationDate, product.image, product.description, product.id]);
    }

    static details(id) {
        return db.execute('select * from products where product_id=(?)', [id]);
    }
}
module.exports = Product;