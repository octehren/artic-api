CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Artwork (
    id INT AUTO_INCREMENT,
    user_id INT,
    external_id INT UNIQUE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

-- INSERT statements
INSERT INTO User (email, password) VALUES ('user1@email.com', 'password');
INSERT INTO User (email, password) VALUES ('user2@email.com', 'password');
