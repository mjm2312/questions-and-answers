CREATE SCHEMA IF NOT EXISTS test1;

SET search_path TO test1;

CREATE TABLE IF NOT EXISTS table1 (
  id integer,
  content text
);

CREATE TABLE IF NOT EXISTS answers_photos (
  id integer, 
  answer_id integer,
  photo_url varchar
);

CREATE TABLE IF NOT EXISTS table2 (
  id integer, 
  answer_id integer,
  photo_url varchar
);

-- COPY answers_photos 
-- FROM '/Users/mattmartin/Downloads/answers_photos_transformed.csv' 
-- DELIMITER ',' CSV HEADER;


INSERT INTO test1.table1 (id, content) VALUES (1, 'message1');


-- /*CREATE DATABASE chat;*/

-- USE chat;


-- /* Create other tables and define schemas for them here! */

-- CREATE TABLE users (
--   /* Describe your table here.*/
--   id INT(11) NOT NULL AUTO_INCREMENT,
--   users VARCHAR(10),
--   PRIMARY KEY (id)
--   /*UNIQUE(users)*/

-- );

-- CREATE TABLE messages (
--   /* Describe your table here.*/
--   id INT(11) NOT NULL AUTO_INCREMENT,
--   messages VARCHAR(200),
--   user_id int (11) DEFAULT 1,
--   room_id int (11) DEFAULT 1,
--   PRIMARY KEY (id)
--   /*FOREIGN KEY (user_id) REFERENCES users(id)*/

-- );


-- CREATE TABLE rooms (
--   /* Describe your table here.*/
--   id INT(11) NOT NULL AUTO_INCREMENT,
--   rooms VARCHAR(10),
--   PRIMARY KEY (id)

-- );


-- /*  Execute this file from the command line by typing:
--  *    mysql -u root < server/schema.sql
--  *  to create the database and the tables.*/

