const rangeSearch = (connection, { table, column, start, end }) => {
    const callback = (err, rows) => {
      if (err) throw err;
      console.table(rows);
    };
    connection.query(
      "SELECT * FROM ?? WHERE ?? BETWEEN ? AND ?",
      [table, column, start, end],
      callback
    );
    connection.end();
  };

// const viewEmployees = () => {
//   connection.query("SELECT * FROM employee", function (err, res) {
//     if (err) throw err;
//     console.table(res);
//   });}
//might need to declare this function const findAllEmployees = function () {}
const findAllEmployees = function() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
    
  }

  const newEmployeeFunction = function() {}

  module.exports = {
    findAllEmployees,
    rangeSearch,
    newEmployeeFunction
  }
  
  //-- SELECT * FROM employee WHERE role_id BETWEEN 1 AND 2


  //table maker
  /*
SELECT employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.id
from employee
left join role
ON employee.role_id=role.title
LEFT JOIN role
ON employee.role_id=role.salary
left join department
ON role.id=department.name
*/
// SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
// FROM employee 
// LEFT JOIN role 
// on employee.role_id = role.id 
// LEFT JOIN department 
// on role.department_id = department.id 
// LEFT JOIN employee manager 
// on manager.id = employee.manager_id
