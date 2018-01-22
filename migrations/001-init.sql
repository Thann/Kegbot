-- UP
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    pw_salt VARCHAR(255),
    password_hash VARCHAR(255),
    admin BOOLEAN DEFAULT 0,
    session_cookie VARCHAR(255) UNIQUE,
    session_created DATETIME
);
INSERT into users (username, password_hash, admin) VALUES ('admin', 'admin', 1);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    data VARCHAR(255),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivered DATETIME,
    finished DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- DOWN
DROP TABLE users;
-- DROP TABLE orders;
