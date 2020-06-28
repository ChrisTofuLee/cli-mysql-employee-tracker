# Unit 12 MySQL Homework: Employee Tracker

Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as **C**ontent **M**anagement **S**ystems. In this homework assignment, your challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

## Instructions

Design the following database schema containing three tables:

![Database Schema](Assets/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
  
Build a command-line application that at a minimum allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

Bonus points if you're able to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

We can frame this challenge as follows:

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

How do you deliver this? Here are some guidelines:

* Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

* You may wish to have a separate file containing functions for performing specific SQL queries you'll need to use. Could a constructor function or a class be helpful for organizing these?

* You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you review the week's activities if you need a refresher on this.

![Employee Tracker](Assets/employee-tracker.gif)

### Hints

* You may wish to include a `seed.sql` file to pre-populate your database. This will make development of individual features much easier.

* Focus on getting the basic functionality completed before working on more advanced features.

* Review the week's activities for a refresher on MySQL.

* Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

## Minimum Requirements

* Functional application.

* GitHub repository with a unique name and a README describing the project.

* The command-line application should allow users to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

## Bonus

* The command-line application should allow users to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

## Commit Early and Often

One of the most important skills to master as a web developer is version control. Building the habit of committing via Git is important for two reasons:

* Your commit history is a signal to employers that you are actively working on projects and learning new skills.

* Your commit history allows you to revert your codebase in the event that you need to return to a previous state.

Follow these guidelines for committing:

* Make single-purpose commits for related changes to ensure a clean, manageable history. If you are fixing two issues, make two commits.

* Write descriptive, meaningful commit messages so that you and anyone else looking at your repository can easily understand its history.

* Don't commit half-done work, for the sake of your collaborators (and your future self!).

* Test your application before you commit to ensure functionality at every step in the development process.

We would like you to have well over 200 commits by graduation, so commit early and often!


## Submission on BCS

You are required to submit the following:

* The URL of the GitHub repository

* A video demonstrating the entirety of the app's functionality 

- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.
ets go.

 - 
 - 
 - 
 

Node, Inquirer & MySQL
- MySql NPM package
- Inqurier
- Console.table
department:
column name - data type
id - INT PRIMARY KEY
name - VARCHAR(30) to hold department name
role:
id - INT PRIMARY KEY
title - VARCHAR(30) to hold role title
salary - DECIMAL to hold role salary
department_id - INT to hold reference to department role belongs to
employee:
id - INT PRIMARY KEY
first_name - VARCHAR(30) to hold employee first name
last_name - VARCHAR(30) to hold employee last name
role_id - INT to hold reference to role employee has
manager_id - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
CRUD
Create - Add depeartments, roles and employees DONE
Read - View departments, roles and employees View employees by manager DONE
Update - Update employee's managers, roles DONE
Delete - Delete departments, roles and employees. DONE
Total utilized budget of a department, e.g. the combined salaries of all employees in the department.
Classes, using constructors, the classes map to our tables?
Department -> Department Class
Role -> Role Class
Employee -> Employee Class
HINT: USE JOINS, JOINS are going to be used in our way of getting back the data.
Create a seed.sql file, insert dummy data into each of the tables on startup of the application.
> Potentially we need to genericise Inquirer ... 
> Might be easier to read if we look into using async/await
---------------
What would you like to do?
-
<VIEW OPERATIONS (READ)>
View All Departments
1.
View All Roles
1.
View All Employees,
1. Returned all of the employees with the following data:
    > { id, first_name, last_name, title, department, salary, manager }
    > Console.table()
View All Employees By Department
1.
View All Employees By Manager
1.
View total utilized budget of a department
1.
<ADD OPERATIONS (CREATE)>
Add Employee
1. What is the employee's first name?
2. What is the employee's last name?
3. What is the employee's role?
    > Roles is coming back from a list that is dynamic?
4. Who is the manager?
    > Manager is coming back from a list that is also dynamic?
    > None?! So that means to handle no manager.
    > There's no distinction between managers.
Add Departments
1.
Add Roles
1.
<REMOVE OPERATIONS (DELETE)>
Remove Employee
1. Pick from a list of employees on who to remove
2. Needs to be dynamic from the database,
Remove Roles
1.
Remove Departments
1.
<UPDATE OPERATIONS (UPDATE)>
Update Employee Role
1.
Update Employee Manager
1. Which employee's manager would you like to update?
    > Needs to pick from a list of employees (dynamic?)
2. Which employee do you want to set as a manager for the selected employee?
    > Needs to pick from a list of managers 
STEPS:
Step 0: Fill out all the flows above, figure out what we need for each of the sections when we start!
Step 1: Create the database schema based on the diagram, run this in MySQL Workbench
    > Don't insert any data here if there's any errors.
Step 2: Insert a department into the department table.
Step 3: Insert a role into the role table, ensure you can link the department_id to the department table's ids.
Step 4: Insert an employee into the employee table. Ensure you can link to the role_id
    > "Foreign Keys" are going to be ids that link to one of the other tables.
Step 5: Ensure that each table has 3-5 rows of information in it.
Step 6: We need to start getting data from each table, let's make a function that will get all the database records for a given table.
Step 7: We need some way of selecting what operation is going to run
    > What operation will run, is it create, reading, updating or deleting?
    > Maybe: 
        1. Prompt 1 - Select the table first (Employees, Department, Roles)
        2. Prompt 2 - Select the action (CRUD)
        3. Prompt 3 - Select from a dynamic list (Your database functions)
    > E.g. "Employee Table, Delete Employee, Select Employee"
Step 8: Repeat Step 7 for each of the different criteria listed above.
Step 9: Ensure that inquirer can return back to the original list of options. (Inquirer recursive? Might be overkill)
