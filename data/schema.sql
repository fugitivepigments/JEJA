### Schema

CREATE DATABASE my_art_caps;
USE my_art_caps;

CREATE TABLE artworks
(
	author varchar(255) NOT NULL,
    born_died varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
	date varchar(255) NOT NULL,
    technique varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
    img_url varchar(255) NOT NULL,
    form varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    school varchar(255) NOT NULL,
    timeframe varchar(255) NOT NULL
);

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE memes
(
	id int NOT NULL AUTO_INCREMENT,
	meme_name varchar(255) NOT NULL,
    meme_text varchar(255) NOT NULL,
    og_img varchar(255) NOT NULL,
    new_img varchar(255) NOT NULL,
    tags varchar(255),
	PRIMARY KEY (id)
);

CREATE TABLE portfolios
(
	id int NOT NULL AUTO_INCREMENT,
	portfolio_name varchar(255) NOT NULL,
    cover_img varchar(255),
	PRIMARY KEY (id)
);

LOAD DATA INFILE 'my_art_caps_lite.csv' INTO TABLE artworks FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;


ALTER TABLE artworks ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE artworks ADD COLUMN hitCount INT;

SELECT * FROM artworks LIMIT 1000;

SELECT `id`, `author`, `born_died`, `title`, `date`, `technique`, `location`, `img_url`, `form`, `type`, `school`, `timeframe`, `hitCount` FROM `Artworks` AS `Artwork` WHERE (`Artwork`.`id` = 1113 OR `Artwork`.`id` = 615 OR `Artwork`.`id` = 3307)