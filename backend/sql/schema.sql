show databases;
use notice_board;
select database();
show tables;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_no CHAR(8) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
desc students;


CREATE TABLE professors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
desc professors;


CREATE TABLE notice_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
desc notice_categories;

ALTER TABLE notice_categories
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;


CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  notice_category_id INT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  posted_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notice_category_id)
    REFERENCES notice_categories(id)
    ON DELETE RESTRICT,
  FOREIGN KEY (posted_by)
    REFERENCES professors(id)
    ON DELETE SET NULL
);
desc notices;


CREATE TABLE notice_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notice_id INT NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notice_id)
    REFERENCES notices(id)
    ON DELETE CASCADE
);
desc notice_files;


CREATE TABLE password_reset_otp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_type ENUM('STUDENT', 'PROFESSOR') NOT NULL,
  user_id INT NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
desc password_reset_otp;


CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_type ENUM('STUDENT', 'PROFESSOR') NOT NULL,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
desc refresh_tokens;



