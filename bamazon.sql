DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE DATABASE bamazon;

CREATE TABLE products (
    id integer(11) auto_increment not null,
    product varchar(75) not null,
    department varchar(30) not null,
    price float not null,
    stock integer(50) not null,
    primary key(id)
);

INSERT INTO products (product, department, price, stock)
