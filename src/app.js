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
      //   {
      //     name: "View employees by manager",
      //     value: "employeesByManager",
      //     short: "Employees By Manager",
      //   },
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
      //   {
      //     name: "Remove employee",
      //     value: "removeEmployee",
      //     short: "Remove Employee",
      //   },
      {
        name: "Update employee role",
        value: "updateRole",
        short: "Update Role",
      },
      //   {
      //     name: "Update employee manager",
      //     value: "updateManager",
      //     short: "Update Employee Manager",
      //   },
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
      const queryAddEmployee = "SELECT * FROM employee";
      const onQueryAddEmployee = async (err, rows) => {
        if (err) throw err;

        const roleChoices = rows.map((row) => {
          return {
            name: row.title,
            value: row.id,
            short: row.title,
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
            choices: roleChoices,
          },
          {
            message: "Whoe is their manager?",
            name: "managerId",
            type: "list",
            choices: managerChoices,
          }
        ];

        const { roleId } = await inquirer.prompt(addQuestions);

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

      connection.query(queryAddEmployee, onQueryAddEmployee);
      break;
    case "allSongs":
      const { artist } = await inquirer.prompt({
        message: "Name of the Artist",
        name: "artist",
      });
      selectWhere(connection, "top5000", { artist });
      break;
    case "allDuplicateArtists":
      multipleOccurrences(connection, "artist", "top5000");
      break;
    case "allSongsInRange":
      const { start, end } = await inquirer.prompt([
        {
          message: "Start Year",
          name: "start",
        },
        {
          message: "End Year",
          name: "end",
        },
      ]);
      rangeSearch(connection, {
        columns: ["artist", "release_year"],
        table: "top5000",
        column: "release_year",
        start,
        end,
      });
      break;
    case "specificSong":
      const { single } = await inquirer.prompt({
        message: "Name of the Single",
        name: "single",
      });
      selectWhere(connection, "top5000", { single });
      break;
    default:
      break;
  }
};
const onConnect = (err) => {
  if (err) throw err;

  console.log("Connected successfully to the DB");

  init();
};

connection.connect(onConnect);

// const init = async () => {
//   const { operation } = await inquirer.prompt(questions);

//   switch (operation) {
//     case "viewAll":
//       //   connection.query("SELECT * FROM employee", function (err, res) {
//       //     if (err) throw err;
//       //     console.table(res);
//       //   });
//       async function viewEmployees() {
//         const employees = await findAllEmployees();

//         console.table(employees);

//         init();
//       }
//       break;
//     // case "employeesByDept":
//     //   const { dept } = await inquirer.prompt({
//     //     name: "dept",
//     //     message: "which department employees do you want to load?",
//     //     type: "list",
//     //     choices: ["IT", "Finance", "Marketing"],
//     //   });

//     //   selectWhere(connection, "department", dept);
//     case "addEmployee":
//       const { newEmployeeInfo } = await inquirer.prompt([
//         {
//           name: "newFirstName",
//           message: "First name of new employee",
//           type: "input",
//         },
//         {
//           name: "newLastName",
//           message: "Last name of new employee",
//           type: "input",
//         },
//         {
//           name: "newEmployeeDepartment",
//           message: "what department is the new employee in?",
//           type: "list",
//           choices: ["IT", "Finance", "Marketing"],
//         },
//         //switch statement to display role choices for each answer then switch for if not a manager role choose from pulled list
//         {
//           name: "newEmployeeRole",
//           message: "what is the new employee's role?",
//           type: "list",
//           choices: ["a", "b"],
//         },
//         {
//           name: "newEmployeeManager",
//           message: "does this employee have a manager?",
//           type: "list",
//           choices: ["a", "b"],
//         },
//       ]);
//       newEmployeeFunction(connection, "employee", { newEmployeeInfo });
//     case "allSongs":
//       const { artist } = await inquirer.prompt({
//         message: "Name of the Artist",
//         name: "artist",
//       });
//       selectWhere(connection, "top5000", { artist });
//       break;
//     case "allDuplicateArtists":
//       multipleOccurrences(connection, "artist", "top5000");
//       break;
//     case "allSongsInRange":
//       const { start, end } = await inquirer.prompt([
//         {
//           message: "Start Year",
//           name: "start",
//         },
//         {
//           message: "End Year",
//           name: "end",
//         },
//       ]);
//       rangeSearch(connection, {
//         columns: ["artist", "release_year"],
//         table: "top5000",
//         column: "release_year",
//         start,
//         end,
//       });
//       break;
//     case "specificSong":
//       const { single } = await inquirer.prompt({
//         message: "Name of the Single",
//         name: "single",
//       });
//       selectWhere(connection, "top5000", { single });
//       break;
//     default:
//       break;
//   }
// };
