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
  fk_category_id INT,
    FOREIGN KEY (fk_category_id)
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
    fk_appuser_id INT,
        FOREIGN KEY (fk_appuser_id)
        REFERENCES appuser (id),
    fk_order_status_id INT,
        FOREIGN KEY (fk_order_status_id)
        REFERENCES order_status (id)
        ON DELETE RESTRICT ON UPDATE RESTRICT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS apporder_item (
    id SERIAL,
    fk_order_id INT,
        FOREIGN KEY (fk_order_id)
        REFERENCES apporder (id),
    fk_product_id INT,
        FOREIGN KEY (fk_product_id)
        REFERENCES product (id),
    quantity INT,
    PRIMARY KEY (id)
);