# REQUIREMENT

- [REQUIREMENT](#requirement)
  - [API Requirements](#api-requirements)
  - [Design](#design)
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
        - [get list od products](#get-list-od-products)
        - [[OPTIONAL] Products by category (args: product category)](#optional-products-by-category-args-product-category)
        - [show](#show)
        - [create [token required]](#create-token-required)
        - [delete](#delete)
      - [Improvements [OPTIONAL]](#improvements-optional)
    - [Users](#users)
      - [Data Shapes](#data-shapes-3)
      - [Create table](#create-table-3)
      - [Model Layer](#model-layer-3)
      - [API Endoints](#api-endoints-1)
        - [login](#login)
        - [Index [token required]](#index-token-required)
        - [Show [token required]](#show-token-required)
        - [Create [token required]](#create-token-required-1)
        - [Delete [token required]](#delete-token-required)
    - [Orders](#orders)
      - [Data Shapes](#data-shapes-4)
      - [Create table](#create-table-4)
      - [Model Layer](#model-layer-4)
      - [API Endoints](#api-endoints-2)
        - [Current Order by user (args: user id)[token required]](#current-order-by-user-args-user-idtoken-required)
        - [Create and order](#create-and-order)
        - [Show an order](#show-an-order)
        - [Delete an order](#delete-an-order)
## API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the requirements from the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.


## Design

## Endpoints and table design

### Product Catetory

Product category should be maintained to categorize products for the end user convenience.

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

Following CRUD features provided in the model layer.

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

Following CRUD features provided in the model layer.


```
  Order Status Model
    ✓ create method should add a Order Status
    ✓ index method should return a list of product categories
    ✓ show method should return the correct Order Status
    ✓ update method should update a Order Status
    ✓ delete method should remove the Order Status
```


### Products

Requirement to the products that can be added to the order as orde items.

#### Endpoints

- get list of products
- show
- create [token required]
- [OPTIONAL] Products by category (args: product category)
- delete product by ID

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

Following CRUD features provided in the model layer.

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

##### get list od products

```
    ✓ [GET] /product/index
```

##### [OPTIONAL] Products by category (args: product category)

```
    ✓ [GET] /product/index?category=<category_id>
```

##### show

```
    ✓ [GET] /product/show/<product_id>
```

##### create [token required]

```
    ✓ [POST] /product/create
```

Send data defined in the Fields.

##### delete

```
    ✓ [DELETE] /product/<produc id>
```

#### Improvements [OPTIONAL]

When the number of products is huge, there will be an issue in perfomance.
One way to avoid that is to return the data with pagind.
Need this to be implemented in the future improvement.

### Users

- Index [token required]
- Show [token required]
- Create [token required]
- Delete [token required]

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

Following CRUD features provided in the model layer.

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

##### login

```
    ✓ /user/login
```

For registered user, you can login by sending below in your request body.

```
{
    email: string;
    password: string;
}
```

In the response body, you get below. Extract the token from below and set as *Authorization: Bearer <token>*, where you find **[token required]**.

```
{
    email: string;
    token: string;
}
```

##### Index [token required]

Get a list of users.
```
    ✓ [GET] /user/index
```

##### Show [token required]

```
    ✓ [GET] /user/show/<user id>
```

##### Create [token required]

```
    ✓ [POST] /user/create
```

Set the following in the request body.
```
{
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    userpassword: string;
}
```

##### Delete [token required]

```
    ✓ [DELETE] /user/<user id>
```

### Orders

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

Following CRUD features provided in the model layer.

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

Index method should return a list of order for user with completed.
You can query active and completed order as an option.

```
    ✓ [GET] /order/index/<user id>?status=<order status>
```
##### Create and order

```
    ✓ [POST] /order/create create method should add an order
```
You need to send data as a request body.
```
{
    id: number;
    appuser: number;
    order_status: number;
}
```

##### Show an order

Show method should return the correct order

```
    ✓ [GET] /order/show/<order id>
```

##### Delete an order

Delete method should remove the order.

```
    ✓ [DELETE] /order/<order id>
```
