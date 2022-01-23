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