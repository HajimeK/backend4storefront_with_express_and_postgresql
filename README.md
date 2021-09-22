# About

## About this project

- [About](#about)
  - [About this project](#about-this-project)
  - [How to launch the application](#how-to-launch-the-application)
    - [pre-requisite](#pre-requisite)
    - [Launch](#launch)
  - [Test the application](#test-the-application)
    - [Set up](#set-up)
  - [Design](#design)
  - [Database](#database)
    - [Initialize PostgreSQL](#initialize-postgresql)
  - [Endpoints and table design](#endpoints-and-table-design)
    - [Utility Tables](#utility-tables)
      - [Product Catetory](#product-catetory)
        - [Data Shapes](#data-shapes)
        - [Create Table](#create-table)
        - [Initial data for testing](#initial-data-for-testing)
        - [API Endpoint](#api-endpoint)
        - [DB query](#db-query)
      - [Order Status](#order-status)
        - [Data Shapes](#data-shapes-1)
        - [Create Table](#create-table-1)
        - [Initial data for testing](#initial-data-for-testing-1)
    - [APIs for Products](#apis-for-products)
      - [Data Shapes](#data-shapes-2)
        - [Fields](#fields)
        - [Create table](#create-table-2)
        - [Initial data for testing](#initial-data-for-testing-2)
      - [API Endoints](#api-endoints)
        - [Index](#index)
          - [API](#api)
          - [DB query](#db-query-1)
          - [Improvements](#improvements)
        - [Show](#show)
          - [API](#api-1)
          - [DB query](#db-query-2)
        - [Create [token required]](#create-token-required)
    - [APIs for Users](#apis-for-users)
      - [Data Shapes](#data-shapes-3)
        - [Fields](#fields-1)
        - [Create table](#create-table-3)
        - [Initial data for testing](#initial-data-for-testing-3)
      - [API Endoints](#api-endoints-1)
        - [Index [token required]](#index-token-required)
          - [API](#api-2)
          - [DB query](#db-query-3)
        - [Show [token required]](#show-token-required)
          - [API](#api-3)
          - [DB query](#db-query-4)
        - [Create N[token required]](#create-ntoken-required)
          - [API](#api-4)
          - [DB query](#db-query-5)
    - [APIs for Orders](#apis-for-orders)
      - [Data Shapes](#data-shapes-4)
        - [Fields](#fields-2)
        - [Create table](#create-table-4)
        - [Initial data for testing](#initial-data-for-testing-4)
      - [API Endoints](#api-endoints-2)
        - [Current Order by user (args: user id)[token required]](#current-order-by-user-args-user-idtoken-required)
          - [API](#api-5)
          - [DB query](#db-query-6)
        - [[OPTIONAL] Completed Orders by user (args: user id)[token required]](#optional-completed-orders-by-user-args-user-idtoken-required)
          - [API](#api-6)
          - [DB query](#db-query-7)

## How to launch the application

### pre-requisite

You need Docker and Docker-Composer to launch the application.

### Launch

Execute the following command to launch the application.

```
docker-composer up -d
```

**CAUTION**

All the environment file for the container is configured in *.env* including the password.
This appliacation in the repository is provided as experimental purpose,
and the passowrds are also included in the *.env* file.
When you develop application which provides the service opent to the internet,
do not forget to *.env* to add to *.gitignore* so that the user IDs and passords are not open in the *git* repository.

## Test the application

### Set up

```
cd api/backend
npm i -g db-migrate
sudo npm i -g db-migrate
npm i db-migrate db-migrate-pg
db-migrate create backend4storefront --sql-file
```


## Design


## Database

### Initialize PostgreSQL

1. open psql
2. install encrypt some of the data
3. create a new database
4. connect to a database
5. get out of psql

``` sql
psql postgres;
CREATE EXTENSION PGCRYPTO;
CREATE DATABASE backend4storefront;
\c backend4storefront
\q
```

## Endpoints and table design

### Utility Tables

#### Product Catetory

##### Data Shapes

- id
- category

##### Create Table 

``` sql
CREATE TABLE IF NOT EXISTS product_category (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(32) NOT NULL,
);
```

##### Initial data for testing

``` sql
INSERT INTO product_category VALUES
  ('stock'),
  ('ETF');
  ('crypto');
```

##### API Endpoint

``` ts
/*
 * /categories
 * @return {json array} list of catetoryies
 *        [ id :{
 *                  category: <{string} category name>
 *              },
 *           ...]
```

##### DB query

``` sql
SELECT *
FROM product_category
```

#### Order Status

##### Data Shapes

- id
- order_status (compoleted, active)

##### Create Table 

``` sql
CREATE TABLE IF NOT EXISTS order_status (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_status VARCHAR(32) NOT NULL,
);
```

##### Initial data for testing

``` sql
INSERT INTO order_status VALUES
  ('compoleted'),
  ('active');
```

### APIs for Products

- Index
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)
- categories

#### Data Shapes

##### Fields

- id
- name
- price
- [OPTIONAL] category

##### Create table

``` sql
CREATE TABLE IF NOT EXISTS product (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(128) NOT NULL,
    price INT NOT NULL,
    CONSTRAINT fk_category_id
    FOREIGN KEY (category_id) 
    REFERENCES product_category (id)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
);
```

##### Initial data for testing

``` sql
INSERT INTO product VALUES
  ('AMZN', 100, 0),
  ('GOGL', 100, 0),
  ('APPL', 100, 0),
  ('FCBK', 100, 0),
  ('MSFT', 100, 0),
  ('USGROWTH', 100, 1),
  ('Asia', 100, 1),
  ('SP500', 100, 1),
  ('bitcoin', 100, 2),
  ('ethereum', 100, 2);
```

#### API Endoints

##### Index

- get list od products
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

###### API

``` ts
/*
 * /products?top=<true | false>&num=<number(default 5)>category=<catetory>
 *
 * @param {boolean} top: [Optional]true to get top. If not specified
 * @param {number} num: [Optional] Only work with top.The numbe of items to get. Default value is 5.
 * @param {string} category: [Optional] the product category. The category should match that are stored in the category table.
 * @return {json array} list of products
 *        [ id :{
 *                  product_name: <{string} product name>,
 *                  price: <{number} >
 *              },
 *           ...]
```

###### DB query

``` sql
SELECT product.id, product.product_name, product.price, product_category.category
FROM product
LEFT JOIN product_category ON product.category_id = product_category.id;
```

###### Improvements

When the number of products is huge, there will be an issue in perfomance.
One way to avoid that is to return the data with pagind.
Need this to be implemented in the future improvement.

##### Show

- show

###### API

``` ts
/*
 * Take at least one and only one of product id or product name as a parametera and return a single product itme
 * /show?id=<product id>
 * /show?procuct=<product name>
 *
 * @param {number} id: [Optional]
 * @param {string} product: [Optional]
 * @return {json array} list of products
 *        {
 *          id: {number},
 *          product_name: {string},
 *          price: {number},
 *          category: {string}
 *        }
 *        Error () if no parameter is set.
```

###### DB query

####### Query by product ID

``` sql
SELECT SINGLE product.id, product.product_name, product.price, product_category.category
FROM product
WHERE product.id=<product id>
LEFT JOIN product_category ON product.category_id = product_category.id;
```

####### Query by product name

``` sql
SELECT SINGLE product.id, product.product_name, product.price, product_category.category
FROM product
WHERE product.product_name=<product name>
LEFT JOIN product_category ON product.category_id = product_category.id;
```

##### Create [token required]


### APIs for Users

- Index [token required]
- Show [token required]
- Create N[token required]

#### Data Shapes

##### Fields

- id
- firstName
- lastName
- password

##### Create table

``` sql
CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  firstName BYTES NOT NULL,
  lastName BYTES NOT NULL,
  password BYTES NOT NULL,
);
```

##### Initial data for testing

``` sql
INSERT INTO backend4storefront.user (item, description, level) VALUES
    (
        pgp_sym_encrypt('first', 'my_pass'),
        pgp_sym_encrypt('last', 'my_pass'),
        pgp_sym_encrypt('password', 'my_pass')
    );
```

#### API Endoints


##### Index [token required]

###### API

``` ts
/*
 */
```

###### DB query

``` sql
SELECT id, pgp_sym_decrypt(firstname, 'my_pass'),  pgp_sym_decrypt(lastname, 'my_pass'),
FROM member;
```

##### Show [token required]

###### API

``` ts
/*
 */
```

###### DB query

``` sql
SELECT id, pgp_sym_decrypt(firstname, 'my_pass'), pgp_sym_decrypt(lastname, 'my_pass'),  pgp_sym_decrypt(password, 'my_pass')
FROM member;
WHERE firstname=pgp_sym_encrypt('first', 'my_pass') AND lastname=gp_sym_encrypt('last', 'my_pass')
```

##### Create N[token required]

###### API

``` ts
/*
 */
```

###### DB query

``` sql
INSERT INTO user VALUES
  ( pgp_sym_encrypt('first', 'my_pass'),
    pgp_sym_encrypt('last', 'my_pass'),
    pgp_sym_encrypt('password', 'my_pass'));
```

### APIs for Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

#### Data Shapes

##### Fields

- id
- product_id (id of each product in the order)
- quantity (quantity of each product in the order)
- user_id
- order_status_id (status of order (active or complete))

##### Create table

``` sql
CREATE TABLE IF NOT EXISTS order (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    CONSTRAINT fk_product_id
        FOREIGN KEY (product_id) 
        REFERENCES product (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    quantity INT,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id) 
        REFERENCES user (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_order_status_id
        FOREIGN KEY (order_status_id) 
        REFERENCES order_status (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
);
```

##### Initial data for testing

``` sql
INSERT INTO product VALUES
  (0, 10, 0, 0),
  (5, 10, 0, 0),
  (8, 10, 0, 0),
  (0, 10, 0, 1),
  (5, 10, 0, 1),
  (8, 10, 0, 1);
```

#### API Endoints

##### Current Order by user (args: user id)[token required]

###### API

``` ts
/*
 */
```

###### DB query

``` sql
```

##### [OPTIONAL] Completed Orders by user (args: user id)[token required]

###### API

``` ts
/*
 */
```

###### DB query

``` sql
```
