show databases;
use notice_board;
select database();
show tables;


INSERT IGNORE INTO notice_categories (name) VALUES
('Examination Cell'),
('Training and Placement Cell'),
('Academics'),
('Student Council'),
('NSS'),
('Impact Club'),
('Photography Club'),
('Technical Society'),
('Sports Club'),
('General');


-- =========================
-- SAMPLE STUDENTS
-- =========================

INSERT INTO students (
  roll_no,
  email,
  password_hash,
) VALUES
(
  '12411025',
  'chhatarapaticse12411025@iiitsonepat.ac.in',
  '$2b$10$AU0fejSi3NSAKj2iUYFIkOnhEyddFv9Tss4AuKjK.B2xcBUpKXFDK',
);

-- =========================
-- SAMPLE PROFESSORS
-- =========================

INSERT INTO professors (
  email,
  password_hash,
) VALUES
(
  'prof1@iiitsonepat.ac.in',
  '$2b$10$2jPbdWKc/hXyM82Xk2T12eUwYmY2kmntfXJ6c8mDB1qqc49RePauG',
);
