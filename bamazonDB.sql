DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2)  NOT NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
);

--  Books departement
INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Cracking the Coding Interview", "Books", 34.99, 1000);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Eloquent JavaScript", "Books", 30.99, 200);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Callback function for dummies", "Books", 100.99, 10);

-- Home ,Garden, Pets & Tools
INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Dog Crate","Home ,Garden, Pets & Tools",38.99, 100);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Zinus Memory Foam 12 Inch Green Tea Mattress, Queen","Home ,Garden, Pets & Tools",279.00, 100);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Wahl Dog/Puppy Shampoo","Home ,Garden, Pets & Tools",6.99, 100);

-- Eletronic, Computer & Office
INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Mac Book pro","Eletronic, Computer & Office",1299.99, 20);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("IPhone X","Eletronic, Computer & Office",1099.99, 1000);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Bamazon Echo","Eletronic, Computer & Office",99.99, 20000);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("GC Gelfand & Co Watch","Clothing, Shoes & Jewerly",39.99, 1000);






