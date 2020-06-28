DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name) VALUES ('IT'), ('Finance');
INSERT INTO role (title, salary, department_id) VALUES ('IT Technician', 20000, 1), ('IT Manager', 40000, 2), ('Accountant', 20500, 3), ('Senior Accountant', 39000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Chris', 'Lee', 2, null), ('John', 'Don', 1, 1), ('Harvey', 'Jackson', 4, null), ('Mary', 'Sherry', 3, 3);
