LOAD DATA INFILE 'my_art_caps_lite.csv' INTO TABLE artworks FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;

ALTER TABLE artworks ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE artworks ADD COLUMN hitCount INT;