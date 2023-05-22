SELECT 'Beginning execution of initializer script.';
-- User creation
DROP USER IF EXISTS 'artic-api-user'@'%';
CREATE USER 'artic-api-user'@'%' IDENTIFIED BY 'pwrd';
GRANT ALL PRIVILEGES ON `artic-api`.* TO 'artic-api-user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Table creation
CREATE TABLE IF NOT EXISTS `artic-api`.`user` (
    id INT AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `artic-api`.`artwork` (
    id INT AUTO_INCREMENT,
    user_id INT,
    external_id INT UNIQUE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) 
      REFERENCES user(id)
      ON DELETE CASCADE
);

-- Seeds
INSERT INTO user (email, password) VALUES ('user1@email.com', 'password');
INSERT INTO user (email, password) VALUES ('user2@email.com', 'password');

SELECT 'Ending execution of initializer script.';