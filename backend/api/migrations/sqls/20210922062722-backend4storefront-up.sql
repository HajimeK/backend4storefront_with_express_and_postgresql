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
  CONSTRAINT fk_category_id
    FOREIGN KEY (category_id)
    REFERENCES product_category (id)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user (
  id SERIAL,
  email VARCHAR NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  userpassword VARCHAR NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS order (
    id SERIAL,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_order_status_id
        FOREIGN KEY (order_status_id)
        REFERENCES order_status (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS order_item (
    id SERIAL,
    CONSTRAINT fk_order_id
        FOREIGN KEY (order_id)
        REFERENCES order (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_product_id
        FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    quantity INT,
    PRIMARY KEY (id)
)