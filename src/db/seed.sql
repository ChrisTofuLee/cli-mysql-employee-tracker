USE company_db;

INSERT INTO department (name) VALUES 
("Finance"),
("HR"),
("Mail Room"),
("IT Support");

INSERT INTO role (title, salary, department_id) VALUES
("Accountant", 28000, 1),
("Senior Accountant", 38000, 1),
("Admin", 20000, 2),
("Recruiter", 30000, 2),
("Mail Clerk", 34000, 3),
("IT Team Lead", 36000, 4),
("IT Manager", 54000, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES
("Bob", "Smith", 1),
("John", "Smith", 1),
("Chris", "Lee", 2),
("Simon", "Myers", 3),
("Kenneth", "Popay", 4),
("Corey", "Clarke", 5),
("Andrew", "Wong", 5),
("Nuel", "Supreme", 6),
("Steph", "Morrissey", 7),
("Adnan", "Ghafoor", 7);
----------------------------------
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role on employee.role_id = role.id 
LEFT JOIN department on role.department_id = department.id 
LEFT JOIN employee manager on manager.id = employee.manager_id

#


SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, r2.salary, e2.id AS Manager
FROM employee
left join role
ON employee.role_id=role.title
LEFT JOIN role r2
ON employee.role_id=r2.salary
left join department
ON role.department_id=department.name
LEFT JOIN employee e2
ON e2.id=concat(employee.first_name, " ", employee.last_name)
-- SELECT * FROM employee WHERE role_id BETWEEN 1 AND 2
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee 
LEFT JOIN role 
on employee.role_id = role.id 
LEFT JOIN department 
on role.department_id = department.id 
LEFT JOIN employee manager 
on manager.id = employee.manager_id

#


use company_db;
INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);


    #


    SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id
