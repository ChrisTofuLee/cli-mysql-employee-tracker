const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "company_db",
  user: "root",
  password: "password",
});


const onConnect = (err) => {
    if (err) throw err;
  
    console.log("Connected successfully to the DB");
  
    init();
  };
  
  connection.connect(onConnect);
  