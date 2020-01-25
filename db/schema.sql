CREATE SCHEMA IF NOT EXISTS `tin-projekt` ;

CREATE TABLE IF NOT EXISTS `tin-projekt`.`products` (
  `product_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NOT NULL,
  `unit` VARCHAR(45) NOT NULL,
  `quantity_to_sale` INT NOT NULL,
  `price` DECIMAL(4,2) NOT NULL,
  `exp_date` DATE,
  `image` LONGBLOB,
  `description` VARCHAR(45),
  PRIMARY KEY (`product_id`),
  UNIQUE INDEX `product_id_UNIQUE` (`product_id` ASC));

CREATE TABLE IF NOT EXISTS `tin-projekt`.`orders` (
 `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
 `first_name` VARCHAR(45) NOT NULL,
 `last_name` VARCHAR(45) NOT NULL,
 `email` VARCHAR(45) NOT NULL,
 `delivery` BOOLEAN,
 `address` VARCHAR(45),
 PRIMARY KEY (`id`),
 UNIQUE INDEX `id_UNIQUE` (`id` ASC));

 CREATE TABLE IF NOT EXISTS `tin-projekt`.`products_orders` (
 `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
 `order_id` INT UNSIGNED,
 `product_id` INT UNSIGNED,
 `quantity` INT NOT NULL,
 `date_created` DATETIME NOT NULL,
 PRIMARY KEY (`id`),
 FOREIGN KEY (`order_id`) REFERENCES `tin-projekt`.`orders` (`id`) ON DELETE CASCADE,
 FOREIGN KEY (`product_id`) REFERENCES `tin-projekt`.`products` (`product_id`) ON DELETE CASCADE,
 UNIQUE INDEX `id_UNIQUE` (`id` ASC));


INSERT IGNORE INTO `tin-projekt`.`products` (`product_id`, `product_name`, `unit`, `quantity_to_sale`, `price`, `exp_date`, `description`) VALUES
  (1, 'Produkt 1', '500g', 10, 21.5, STR_TO_DATE('28-02-2020', '%d-%m-%Y'), 'lorem ipsum'),
  (2, 'Produkt 2', '2l', 10, 55, STR_TO_DATE('28-02-2020', '%d-%m-%Y'), 'lorem ipsum'),
  (3, 'Produkt 3', '1szt.', 50, 11, STR_TO_DATE('28-02-2020', '%d-%m-%Y'), 'lorem ipsum'),
  (4, 'Produkt 4', '250g', 10, 15, STR_TO_DATE('28-02-2020', '%d-%m-%Y'), 'lorem ipsum')
;

INSERT IGNORE INTO `tin-projekt`.`orders` (`id`, `first_name`, `last_name`, `email`, `delivery`, `address`) VALUES
 (1, 'Jan', 'Kowalski', 'j.kowalski@gmail.com', 1, 'Adres 1'),
 (2, 'Adam', 'Nowak', 'a.nowak@o2.pl', 1, 'Adres 2'),
 (3, 'Malwina', 'Piotrowska', 'm.piotrowska@wp.pl', 1, 'Adres 3'),
 (4, 'Justyna', 'Wolska', 'j.wolska4@op.pl', 0, null)
;

INSERT IGNORE INTO `tin-projekt`.`products_orders` (`id`, `order_id`, `product_id`, `quantity`, `date_created`) VALUES
 (1, 1, 1, 1, '2020-01-25 14:25:30'),
 (2, 1, 2, 2, '2020-01-25 14:25:30'),
 (3, 1, 4, 1, '2020-01-25 14:25:30'),
 (4, 2, 2, 2, '2020-01-25 14:25:30'),
 (5, 2, 3, 2, '2020-01-25 14:25:30'),
 (6, 3, 3, 3, '2020-01-25 14:25:30'),
 (7, 3, 4, 1, '2020-01-25 14:25:30'),
 (8, 4, 1, 2, '2020-01-25 14:25:30')
;