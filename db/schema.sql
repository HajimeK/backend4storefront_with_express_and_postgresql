\set my_pass `echo "$POSTGRES_TABLE_PASSWORD"`
CREATE EXTENSION PGCRYPTO;
CREATE DATABASE backend4storefront;
CREATE DATABASE backend4storefront_dev;
CREATE DATABASE backend4storefront_test;