/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS product_category (
  id SERIAL,
  category VARCHAR(32) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS order_status (
  id SERIAL,
  order_status VARCHAR(32) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS product (
  id SERIAL,
  product_name VARCHAR(128) NOT NULL,
  price INT NOT NULL,
  category INT,
    FOREIGN KEY (category)
    REFERENCES product_category (id),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS appuser (
  id SERIAL,
  email VARCHAR NOT NULL,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  userpassword VARCHAR NOT NULL,
  PRIMARY KEY (id)
);

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