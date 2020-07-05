const mysql = require("mysql");
const inquirer = require("inquirer");

const {
  findAllEmployees,
  rangeSearch,
  newEmployeeFunction,
} = require("./util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "company_db",
  user: "root",
  password: "Password",
  multipleStatements: true,
});

const questions = [
  {
    name: "operation",
    message: "What would you like to do?",
    type: "list",
    choices: [
      {
        name: "View all employees",
        value: "viewAll",
        short: "View All Employees",
      },
      {
        name: "View employees by department",
        value: "employeesByDept",
        short: "Employees By Department",
      },
      {
        name: "View employees by Roles",
        value: "employeesByRole",
        short: "Employees by roles",
      },
      {
        name: "View employees by manager",
        value: "employeesByManager",
        short: "Employees By Manager",
      },
      {
        name: "Add employee",
        value: "addEmployee",
        short: "Add Employee",
      },
      {
        name: "Add Department",
        value: "addDepartment",
        short: "Add Department",
      },
      {
        name: "Add role",
        value: "addRole",
        short: "Add Role",
      },
      {
        name: "Remove employee",
        value: "removeEmployee",
        short: "Remove Employee",
      },
      {
        name: "Update employee role",
        value: "updateRole",
        short: "Update Role",
      },
        {
          name: "Update employee manager",
          value: "updateManager",
          short: "Update Employee Manager",
        },
      {
        name: "End application",
        value: "end",
        short: "Finish"
      }
    ],
  },
];

const init = async () => {
  const onEmployeeQuery = (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  };
  const { operation } = await inquirer.prompt(questions);
  const allEmployeesQuery = "SELECT * FROM employee";

  switch (operation) {
    case "viewAll":
      const query =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
      const onQuery = (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
      };

      connection.query(query, onQuery);
      break;
    case "employeesByDept":
      const queryDept = "SELECT * FROM department";

      const onQueryDept = async (err, rows) => {
        if (err) throw err;

        const choices = rows.map((row) => {
          return {
            name: row.name,
            value: row.id,
            short: row.name,
          };
        });

        const questions = [
          {
            message: "Select a department:",
            name: "departmentId",
            type: "list",
            choices,
          },
        ];

        const { departmentId } = await inquirer.prompt(questions);

        const queryEmployeesByDepartment = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department
      FROM employee LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on role.department_id = department.id
      WHERE department.id = ${departmentId};
      `;

        connection.query(queryEmployeesByDepartment, onEmployeeQuery);
      };

      connection.query(queryDept, onQueryDept);
      break;
    case "employeesByRole":
      const queryRole = "SELECT * FROM role";

      const onQueryRole = async (err, rows) => {
        if (err) throw err;

        const roleChoices = rows.map((row) => {
          return {
            name: row.title,
            value: row.id,
            short: row.title,
          };
        });

        const roleQuestions = [
          {
            message: "Select a role:",
            name: "roleId",
            type: "list",
            choices: roleChoices,
          },
        ];

        const { roleId } = await inquirer.prompt(roleQuestions);

        const queryEmployeesByRole = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id 
        LEFT JOIN employee manager on manager.id = employee.manager_id
        WHERE role.id = ${roleId}`;

        connection.query(queryEmployeesByRole, onEmployeeQuery);
      };

      connection.query(queryRole, onQueryRole);
    case "addEmployee":
      const queryAddEmployee = `SELECT * FROM employee left join role on employee.role_id = role.id
      GROUP BY role_id`;
      const onQueryAddEmployee = async (err, rows) => {
        if (err) throw err;
        const [employees, managers] = rows;
        const addRoleChoices = await employees.map((row) => {
          return {
            name: row.title,
            value: row.role_id,
            short: row.title,
          };
        });

        const managerChoices = await managers.map((row) => {
          return {
            name: `${row.first_name} ${row.last_name}`,
            value: row.id,
            short: `${row.first_name} ${row.last_name}`,
          };
        });

        const addQuestions = [
          {
            message: "what is the new employee's name?",
            name: "addFirstName",
            type: "input",
          },
          {
            message: "what is their last name?",
            name: "addLastName",
            type: "input",
          },
          {
            message: "What is their role?",
            name: "roleId",
            type: "list",
            choices: addRoleChoices,
          },
          {
            message: "Do they have a manager?",
            name: "managerChecker",
            type: "list",
            choices: ["Yes", "No"],
          },
          {
            message: "Who is their manager?",
            name: "managerId",
            type: "list",
            choices: managerChoices,
            when: (answers) => answers.managerChecker === "Yes",
          },
        ];
        //the null bit for manager_id might throw an error
        const addAnswers = await inquirer.prompt(addQuestions);
        console.log(addAnswers.managerId);
        const queryAddingEmployee = `
        INSERT INTO employee SET 
        first_name= "${addAnswers.addFirstName}", 
        last_name= "${addAnswers.addLastName}", 
        role_id= "${addAnswers.roleId}",
        manager_id= "${addAnswers.managerId || null}";`;

        const addSuccess = (err, rows) => {
          if (err) throw err;
          console.log("Employee Successfully Added!");
          init();
        };
        connection.query(queryAddingEmployee, addSuccess);
      };

      connection.query(
        `${queryAddEmployee};  ${allEmployeesQuery}`,
        onQueryAddEmployee
      );
      break;
    case "addDepartment":
      const addDeptQuestions = [
        {
          message: "What is the name of the department?",
          name: "name",
        },
      ];

      const { deptName } = await inquirer.prompt(addDeptQuestions);

      const addDeptQuery = `INSERT INTO department (name) VALUES ("${deptName}") `;

      const deptCreateSuccess = (err) => {
        if (err) throw err;
        console.log("Successfully created a department");
        init();
      };

      connection.query(addDeptQuery, deptCreateSuccess);
      break;
    case "addRole":
      const queryAddRole =
        "SELECT * FROM role  left join department on role.department_id = department.id GROUP BY department_id";

      const onQueryAddRole = async (err, rows) => {
        const addRollChoices = rows.map((row) => {
          return {
            name: row.name,
            value: row.department_id,
            short: row.name,
          };
        });
        const addRoleQuestions = [
          {
            message: "What is the name of the role?",
            name: "title",
          },
          {
            message: "what is the salary of this role?",
            name: "salary",
            type: "input",
            validate: function (value) {
              if (isNaN(value)) {
                return "please enter numbers only";
              }
              return true;
            },
          },
          {
            message: "which department is this role in?",
            name: "department_id",
            type: "list",
            choices: addRollChoices,
          },
        ];

        const rollAnswers = await inquirer.prompt(addRoleQuestions);

        const queryAddingRole = `
        INSERT INTO role SET 
        title= "${rollAnswers.title}", 
        salary= "${rollAnswers.salary}", 
        department_id= "${rollAnswers.department_id}"`;

        const rollCreateSuccess = (err) => {
          if (err) throw err;
          console.log("Successfully created a roll");
          init();
        };

        connection.query(queryAddingRole, rollCreateSuccess);
      };

      connection.query(queryAddRole, onQueryAddRole);
      break;
    case "updateRole":
      const queryUpdateRoleName = `SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id GROUP BY role_id`;

      const onQueryUpdateRole = async (err, rows) => {
        if (err) throw err;

        const [employees, roles] = rows;

        const employeeList = await employees.map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
            short: `${employee.first_name} ${employee.last_name}`,
          };
        });
        const selectRoleChoices = await roles.map((role) => {
          return {
            name: role.title,
            value: role.role_id,
            short: role.title,
          };
        });
        const updateRoleQuestions = [
          {
            message: "Which employee role would you like to update",
            name: "employeeName",
            type: "list",
            choices: employeeList,
          },
          {
            message: "What is their new role?",
            name: "updateRole",
            type: "list",
            choices: selectRoleChoices,
          },
        ];

        const updateRoleAnswers = await inquirer.prompt(updateRoleQuestions);

        const queryUpdateEmployeeRole = `
          UPDATE employee SET 
          role_id= "${updateRoleAnswers.updateRole}" 
          WHERE id= ${updateRoleAnswers.employeeName}`;

        const updateRoleSuccess = (err, rows) => {
          if (err) throw err;

          console.log("Successfully updated employee roll");
          init();
        };

        connection.query(queryUpdateEmployeeRole, updateRoleSuccess);
      };

      connection.query(
        `${allEmployeesQuery}; ${queryUpdateRoleName}`,
        onQueryUpdateRole
      );

      break;
    case "removeEmployee":
      const onRemoveEmployeeQuery = async (err, rows) => {
        if (err) throw err;

        const choices = await rows.map((row) => {
          return {
            name: `${row.first_name} ${row.last_name}`,
            value: row.id,
            short: `${row.first_name} ${row.last_name}`,
          };
        });

        const questions = [
          {
            message: "Select an employee:",
            name: "employeeId",
            type: "list",
            choices,
          },
        ];

        const { employeeId } = await inquirer.prompt(questions);

        const deleteEmployeeQuery = `DELETE FROM employee WHERE id=${employeeId}`;

        const onDeleteEmployeeQuery = (err) => {
          if (err) throw err;
          console.log("Deleted employee successfully from DB");
          init();
        };

        connection.query(deleteEmployeeQuery, onDeleteEmployeeQuery);
      };

      connection.query(allEmployeesQuery, onRemoveEmployeeQuery);
      break;
    case "employeesByManager":
      const queryManagers = `
    SELECT employee.id, employee.first_name, employee.last_name FROM employee
    INNER JOIN (SELECT DISTINCT(manager_id) FROM company_db.employee WHERE manager_id IS NOT NULL) as manager
    on employee.id = manager.manager_id
    `;

      const onQueryViewByManager = async (err, rows) => {
        if (err) throw err;

        const choices = await rows.map((row) => {
          return {
            name: `${row.first_name} ${row.last_name}`,
            value: row.id,
            short: `${row.first_name} ${row.last_name}`,
          };
        });

        const questions = [
          {
            message: "Select a manager:",
            name: "managerId",
            type: "list",
            choices,
          },
        ];

        const { managerId } = await inquirer.prompt(questions);

        const queryEmployeesByManager = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department
      FROM employee LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on role.department_id = department.id
      WHERE employee.manager_id = ${managerId}
      `;

        connection.query(queryEmployeesByManager, onEmployeeQuery);
      };

      connection.query(queryManagers, onQueryViewByManager);
      break;
      case "updateManager":

        const onQueryUpdateManager = async (err, rows) => {
          if (err) throw err;
  
          const employeeList = await rows.map((row) => {
            return {
              name: `${row.first_name} ${row.last_name}`,
              value: row.id,
              short: `${row.first_name} ${row.last_name}`,
            };
          });

          const updateManagerQuestions = [
            {
              message: "Which employee's manager would you like to update",
              name: "employeeName",
              type: "list",
              choices: employeeList,
            },
            {
              message: "Who is the employee's new manager",
              name: "updateManager",
              type: "list",
              choices: employeeList,
            },
          ];
  
          const updateManagerAnswers = await inquirer.prompt(updateManagerQuestions);
  
          const queryUpdateEmployeeManager = `
            UPDATE employee SET 
            manager_id= "${updateManagerAnswers.updateManager}" 
            WHERE id= ${updateManagerAnswers.employeeName}`;
  
          const updateManagerSuccess = (err, rows) => {
            if (err) throw err;
  
            console.log("Successfully updated employee's manager");
            init();
          };
  
          connection.query(queryUpdateEmployeeManager, updateManagerSuccess);
        };
  
        connection.query(allEmployeesQuery, onQueryUpdateManager);
        break;
    case "end":
      process.exit()
      break;
  }
};
const onConnect = (err) => {
  if (err) throw err;

  console.log("Connected successfully to the DB");

  init();
};

connection.connect(onConnect);

// ///////////////////////////////////

// if (action === "removeEmployee") {
//   const allEmployeesQuery = "SELECT * FROM employee";

//   const onAllEmployeesQuery = async (err, employees) => {
//     if (err) throw err;

//     const choices = employees.map((employee) => {
//       return {
//         name: `${employee.first_name} ${employee.last_name}`,
//         value: employee.id,
//         short: `${employee.first_name} ${employee.last_name}`,
//       };
//     });

//     const questions = [
//       {
//         message: "Select an employee:",
//         name: "employeeId",
//         type: "list",
//         choices,
//       },
//     ];

//     const { employeeId } = await inquirer.prompt(questions);

//     const deleteEmployeeQuery = `DELETE FROM employee WHERE id=${employeeId}`;

//     const onDeleteEmployeeQuery = (err) => {
//       if (err) throw err;
//       console.log("Deleted employee successfully from DB");
//       init();
//     };

//     connection.query(deleteEmployeeQuery, onDeleteEmployeeQuery);
//   };

//   connection.query(allEmployeesQuery, onAllEmployeesQuery);
// }

// /////////////////////////////////////

// if (action === "end") {
//   process.exit();
// }

// ///////////////////////////////////

// const queryRoles = "SELECT * FROM role";
//     const queryManagers = `
//     SELECT employee.id, employee.first_name, employee.last_name FROM employee
//     INNER JOIN (SELECT DISTINCT(manager_id) FROM company_db.employee WHERE manager_id IS NOT NULL) as manager
//     on employee.id = manager.manager_id
//     `;

//     const onQuery = async (err, rows) => {
//       if (err) throw err;
//       const [roles, managers] = rows;

//       const roleChoices = roles.map((role) => {
//         return {
//           name: role.title,
//           value: role.id,
//           short: role.title,
//         };
//       });

//       const managerChoices = managers.map((manager) => {
//         return {
//           name: `${manager.first_name} ${manager.last_name}`,
//           value: manager.id,
//           short: `${manager.first_name} ${manager.last_name}`,
//         };
//       });

//       const questions = [
//         {
//           message: "What is your first name?",
//           name: "firstName",
//           type: "input",
//         },
//         {
//           message: "What is your last name?",
//           name: "lastName",
//           type: "input",
//         },
//         {
//           message: "Select a role:",
//           name: "roleId",
//           type: "list",
//           choices: roleChoices,
//         },
//         {
//           message: "Do you want to select a manager?",
//           name: "manager",
//           type: "confirm",
//         },
//         {
//           message: "Select manager:",
//           name: "managerId",
//           type: "list",
//           choices: managerChoices,
//           when: (answers) => {
//             return answers.manager;
//           },
//         },
//       ];

//       const answers = await inquirer.prompt(questions);

//       const addEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${
//         answers.firstName
//       }", "${answers.lastName}", ${answers.roleId}, ${
//         answers.managerId || null
//       })`;

//       const onEmployeeAddQuery = (err) => {
//         if (err) throw err;
//         console.log("Successfully added employee to DB");
//         init();
//       };

//       connection.query(addEmployeeQuery, onEmployeeAddQuery);
//     };

//     connection.query(`${queryRoles}; ${queryManagers}`, onQuery);
//   }
