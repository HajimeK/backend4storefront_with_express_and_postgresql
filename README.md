# About

## About this project


- [About](#about)
  - [About this project](#about-this-project)
  - [Design](#design)
    - [API Endpoints](#api-endpoints)
      - [Products](#products)
        - [Index](#index)
          - [API](#api)
          - [DB query](#db-query)
          - [Improvements](#improvements)
        - [Show](#show)
        - [Create [token required]](#create-token-required)
        - [categories](#categories)
          - [API](#api-1)
          - [DB query](#db-query-1)
      - [Users](#users)
        - [Index [token required]](#index-token-required)
        - [Show [token required]](#show-token-required)
        - [Create N[token required]](#create-ntoken-required)
      - [Orders](#orders)
        - [Current Order by user (args: user id)[token required]](#current-order-by-user-args-user-idtoken-required)
        - [[OPTIONAL] Completed Orders by user (args: user id)[token required]](#optional-completed-orders-by-user-args-user-idtoken-required)
  - [Database](#database)
  - [Data Shapes](#data-shapes)
      - [Product](#product)
      - [User](#user)
      - [Orders](#orders-1)
      - [Product Catetory](#product-catetory)
      - [Order Status](#order-status)
    - [Back-end to implement with SQL in Azure](#back-end-to-implement-with-sql-in-azure)
      - [SKills](#skills)
        - [Query](#query)
  - [How to launch the application](#how-to-launch-the-application)
    - [pre-requisite](#pre-requisite)
    - [Launch](#launch)

## Design


### API Endpoints

#### Products

- Index
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)
- categories

##### Index

- get list od products
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

###### API

```
/*
 * /products?top=<true | false>&num=<number(default 5)>category=<catetory>
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

##### Create [token required]

##### categories

###### API

```
/*
 * /categories
 * @return {json array} list of categories
 *        [ id :{
 *                  category: <{string} category name>
 *              },
 *           ...]
```

###### DB query

``` sql
SELECT *product.id, product.product_name, product.price, product_category.category*
FROM product_category;
```

#### Users

- Index [token required]
- Show [token required]
- Create N[token required]

##### Index [token required]

##### Show [token required]

##### Create N[token required]

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

##### Current Order by user (args: user id)[token required]

##### [OPTIONAL] Completed Orders by user (args: user id)[token required]


## Database

```
open psql: psql postgres
create a new database: create database backend4storefront
connect to a database: \c backend4storefront
get out of psql: \q
```

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

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

#### User

- id
- firstName
- lastName
- password

``` sql
CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(128) NOT NULL,
  lastName VARCHAR(128) NOT NULL,
  password VARCHAR NOT NULL,
);
```

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

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

#### Product Catetory

- id
- category

``` sql
CREATE TABLE IF NOT EXISTS product_category (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(32) NOT NULL,
);
```

#### Order Status

- id
- order_status (compoleted, active)

``` sql
CREATE TABLE IF NOT EXISTS order_status (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_status VARCHAR(32) NOT NULL,
);
```

### Back-end to implement with SQL in Azure

#### SKills

##### Query

``` sql
SELECT Skill.id, Skill.item, Skill.level, Skill.description, Project.name, Project.description, Project.url
FROM Skill
LEFT JOIN Skill_Project ON Skill.id = Skill_Project.skill_id
LEFT JOIN Project ON Skill_Project.project_id = Project.id
```


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