# README

**CAUTION**

All the environment file for the container is configured in *.env* including the password.
This appliacation in the repository is provided as experimental purpose,
and the passowrds are also included in the *.env* file.
When you develop application which provides the service opent to the internet,
do not forget to *.env* to add to *.gitignore* so that the user IDs and passords are not open in the *git* repository.

Also if you provide the service external to the internet, configure firewall to prevent access except your middleware.
Only provide the port application provides (Here port number 3000 is provided).

## About this project

This is the project to provide **node.js + express + typescript** which connects to backend DB.


- [README](#readme)
  - [About this project](#about-this-project)
  - [How to launch the application](#how-to-launch-the-application)
    - [pre-requisite](#pre-requisite)
    - [PostgresSQL server](#postgressql-server)
    - [clean up the environment](#clean-up-the-environment)
  - [Test the application](#test-the-application)
    - [Set up](#set-up)
    - [Initialize DB tables](#initialize-db-tables)
    - [Launch](#launch)
  - [Design](#design)
  - [Database Server](#database-server)
  - [Endpoints and table design](#endpoints-and-table-design)
    - [Product Catetory](#product-catetory)
      - [Data Shapes](#data-shapes)
      - [Create Table](#create-table)
      - [Model Layer](#model-layer)
    - [Order Status](#order-status)
      - [Data Shapes](#data-shapes-1)
      - [Create Table](#create-table-1)
      - [Model Layer](#model-layer-1)
    - [Products](#products)
      - [Endpoints](#endpoints)
      - [Data Shapes](#data-shapes-2)
        - [Fields](#fields)
      - [Create table](#create-table-2)
      - [Model Layer](#model-layer-2)
      - [API Endoints](#api-endoints)
        - [[OPTIONAL] Products by category (args: product category)](#optional-products-by-category-args-product-category)
        - [get list od products](#get-list-od-products)
        - [[OPTIONAL] Products by category (args: product category)](#optional-products-by-category-args-product-category-1)
        - [show](#show)
        - [create [token required]](#create-token-required)
        - [List of including others](#list-of-including-others)
      - [Improvements](#improvements)
    - [Users](#users)
      - [Data Shapes](#data-shapes-3)
      - [Create table](#create-table-3)
      - [Model Layer](#model-layer-3)
      - [API Endoints](#api-endoints-1)
        - [Index [token required]](#index-token-required)
        - [Show [token required]](#show-token-required)
        - [Create N[token required]](#create-ntoken-required)
        - [Lis of others](#lis-of-others)
    - [Orders](#orders)
      - [Data Shapes](#data-shapes-4)
      - [Create table](#create-table-4)
      - [Model Layer](#model-layer-4)
      - [API Endoints](#api-endoints-2)
        - [Current Order by user (args: user id)[token required]](#current-order-by-user-args-user-idtoken-required)
        - [[OPTIONAL] Completed Orders by user (args: user id)[token required]](#optional-completed-orders-by-user-args-user-idtoken-required)
        - [List of Others](#list-of-others)

## How to launch the application

### pre-requisite

You need Docker and Docker-Composer to launch the application.

### PostgresSQL server

As the middleware needs in the backend PostgreSQL server,
please run the followign command to launch the PostgreSQL server.

```
docker-compose up -d
```

This will launch the PostgreSQL server and Admin tools as docker containers each.

After you run your test, run below to shutdown the docker components.

```
docker-compose down
```

### clean up the environment

```
docker rmi $(sudo docker images -q) -f
docker volume prune

```

## Test the application

### Set up

```
cd api/backend
npm install

```

### Initialize DB tables

### Launch

```
npm run dev
```


Then you should find the following output. You can also refer to the test calls for the usage of the APIs.

```

Jasmine started
starting app on: 0.0.0.0:3000

  Test Suite for database client
    ✓ connect to db
    ✓ release db connection

  Order Item Model
    ✓ create method should add an order item
    ✓ index method should return a list of order items for an order
    ✓ show method should return the correct order
    ✓ update method should update an order item quantity
    ✓ delete method should remove the order

  Order Model
    ✓ create method should add an order
    ✓ index method should return a list of order
    ✓ show method should return the correct order
    ✓ update method should update an order status
    ✓ update method should update an order item
    ✓ delete method should remove the order

  Order Status Model
    ✓ create method should add a Order Status
    ✓ index method should return a list of product categories
    ✓ show method should return the correct Order Status
    ✓ update method should update a Order Status
    ✓ delete method should remove the Order Status

  Product Category Model
    ✓ create method should add a Product Category
    ✓ index method should return a list of product categories
    ✓ show method should return the correct product category
    ✓ update method should update a product category
    ✓ delete method should remove the product category

  Product Model
    ✓ create method should add a product
    ✓ create method should add a product (2nd)
SELECT * FROM product
    ✓ index method should return a list of products
SELECT * FROM product WHERE category=5;
    ✓ index method should return a list of product with category
    ✓ show method should return the correct product
    ✓ update method should update a product fields
SELECT * FROM product
    ✓ delete method should remove the product

  User Model
    ✓ create method should add a user
    ✓ index method should return a list of users
    ✓ show method should return the correct user
    ✓ authenticate with correst user/pass to approve login
    ✓ authenticate with wrong pass to approve login
    ✓ authenticate with wrong user to approve login
    ✓ update method should update a product fields
    ✓ delete method should remove the user

  Test suite for /order
    ✓ /order/create create method should add an order
    ✓ /order/index/userid index method should return a list of order for user
    ✓ /order/index/1?status=2 index method should return a list of order for user with completed
    ✓ /order/show/0 show method should return the correct order
    ✓ /order/delete delete method should remove the order

  Test Suite for /product
    ✓ /product/create create method should add a product (first)
    ✓ /product/create create method should add a product (2nd)
    ✓ /product/index
    ✓ /product/index?category=1
    ✓ /product/show/2
    ✓ /product/delete

  Test suite for /user
    ✓ /user/login
    ✓ /user/create
    ✓ /user/index
    ✓ /user/show/1

  Test Suite for /
    ✓ Server healthcheck

Executed 54 of 54 specs SUCCESS in 2 secs.
```


## Design


## Database Server

For maintenance, you can connect to the DB in command line.

``` sql
psql -h 0.0.0.0 -p 5432 -U root backend4storefront_test;
\q
```

Or you can use the admin tools.

```
http://localhost:3001
```

## Endpoints and table design

### Product Catetory

#### Data Shapes

``` ts
export interface  ProductCategory {
    id: number;
    category: string;
}
```

The model implementation is [here](backend/api/src/models/product_category.ts).

#### Create Table

``` sql
CREATE TABLE IF NOT EXISTS product_category (
  id SERIAL,
  category VARCHAR(32) NOT NULL,
  PRIMARY KEY (id)
);
```

#### Model Layer

```
  Product Category Model
    ✓ create method should add a Product Category
    ✓ index method should return a list of product categories
    ✓ show method should return the correct product category
    ✓ update method should update a product category
    ✓ delete method should remove the product category
```

### Order Status

#### Data Shapes

``` ts
export interface OrderStatus {
    id: number;
    order_status: string;
}
```

#### Create Table

``` sql
CREATE TABLE IF NOT EXISTS order_status (
  id SERIAL,
  order_status VARCHAR(32) NOT NULL,
  PRIMARY KEY (id)
);
```

#### Model Layer

```
  Order Status Model
    ✓ create method should add a Order Status
    ✓ index method should return a list of product categories
    ✓ show method should return the correct Order Status
    ✓ update method should update a Order Status
    ✓ delete method should remove the Order Status
```


### Products

#### Endpoints

- [OPTIONAL] Products by category (args: product category)
- get list od products
- [OPTIONAL] Products by category (args: product category)
- show
- create [token required]


#### Data Shapes

##### Fields

``` ts
export interface Product {
    id: number;
    product_name: string;
    price: number;
    category?: number;
}
```

#### Create table

``` sql
CREATE TABLE IF NOT EXISTS product (
  id SERIAL,
  product_name VARCHAR(128) NOT NULL,
  price INT NOT NULL,
  category INT,
    FOREIGN KEY (category)
    REFERENCES product_category (id),
  PRIMARY KEY (id)
);
```
#### Model Layer

```
  Product Model
    ✓ create method should add a product
    ✓ index method should return a list of products
    ✓ index method should return a list of product with category
    ✓ show method should return the correct product
    ✓ update method should update a product fields
    ✓ delete method should remove the product
```

#### API Endoints

##### [OPTIONAL] Products by category (args: product category)
##### get list od products

##### [OPTIONAL] Products by category (args: product category)

##### show

##### create [token required]

##### List of including others

Al the API points including for maintenance are listed below.

```
  API End poinst for /product
    ✓ /product/create create method should add a product (first)
    ✓ /product/create create method should add a product (2nd)
    ✓ /product/index
    ✓ /product/index?category=1
    ✓ /product/show/2
    ✓ /product/delete
```


#### Improvements

When the number of products is huge, there will be an issue in perfomance.
One way to avoid that is to return the data with pagind.
Need this to be implemented in the future improvement.



### Users

- Index [token required]
- Show [token required]
- Create N[token required]

#### Data Shapes

```ts
export interface User {
    id: number;
    email: string;
    firstname: string,
    lastname: string;
    userpassword: string;
}
```

#### Create table

``` sql
CREATE TABLE IF NOT EXISTS appuser (
  id SERIAL,
  email VARCHAR NOT NULL,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  userpassword VARCHAR NOT NULL,
  PRIMARY KEY (id)
);
```

#### Model Layer

```
  User Model
    ✓ create method should add a user
    ✓ index method should return a list of users
    ✓ show method should return the correct user
    ✓ authenticate with correst user/pass to approve login
    ✓ authenticate with wrong pass to approve login
    ✓ authenticate with wrong user to approve login
    ✓ update method should update a product fields
    ✓ delete method should remove the user
```

#### API Endoints

You can access the following endpoinst under */product*.

##### Index [token required]

``` ts
user.get('/index', verifyAuthToken, async (request, response) => {
```

##### Show [token required]

``` ts
user.get('/show/:id', verifyAuthToken, async (request, response) => {
```

##### Create N[token required]


``` ts
user.post('/create', verifyAuthToken, async (request, response) => {
```

##### Lis of others

Al the API points including for maintenance are listed below.

```
  Test suite for /user
    ✓ /user/login
    ✓ /user/create
    ✓ /user/index
    ✓ /user/show/1
```

### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

#### Data Shapes

```ts
export interface Order {
    id: number;
    appuser: number;
    order_status: number;
}

export interface OrderItem {
    id: number;
    apporder: number;
    product: number;
    quantity: number;
}
```

#### Create table

``` sql
CREATE TABLE IF NOT EXISTS apporder (
    id SERIAL,
    appuser INT,
        FOREIGN KEY (appuser)
        REFERENCES appuser (id),
    order_status INT,
        FOREIGN KEY (order_status)
        REFERENCES order_status (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS apporder_item (
    id SERIAL,
    apporder INT,
        FOREIGN KEY (apporder)
        REFERENCES apporder (id),
    product INT,
        FOREIGN KEY (product)
        REFERENCES product (id),
    quantity INT,
    PRIMARY KEY (id)
);
```

#### Model Layer

```
  Order Item Model
    ✓ create method should add an order item
    ✓ index method should return a list of order items for an order
    ✓ show method should return the correct order
    ✓ update method should update an order item quantity
    ✓ delete method should remove the order

  Order Model
    ✓ create method should add an order
    ✓ index method should return a list of order
    ✓ show method should return the correct order
    ✓ update method should update an order status
    ✓ update method should update an order item
    ✓ delete method should remove the order
```

#### API Endoints

You can access the following endpoinst under */order*.

##### Current Order by user (args: user id)[token required]

``` ts
order.get('/index/:user', verifyAuthToken, (request: Request, response: Response) => {
order.get('/show/:id', (request: Request, response: Response) => {
```

##### [OPTIONAL] Completed Orders by user (args: user id)[token required]

``` ts
order.get('/index/:user?status=<status id>', verifyAuthToken, (request: Request, response: Response) => {
```

##### List of Others

Al the API points including for maintenance are listed below.
```
  /order
    ✓ /order/create create method should add an order
    ✓ /order/index/userid index method should return a list of order for user
    ✓ /order/index/1?status=2 index method should return a list of order for user with completed
    ✓ /order/show/0 show method should return the correct order
    ✓ /order/delete delete method should remove the order
```
