const { promptUser } = require('../index');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeetracker'
});

// view current departments 

const viewDepartment = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    )
}

// add department to database

const addDepartment = () => {
    inquirer
        .prompt({
            type: 'text',
            name: 'department_name',
            message: 'Enter the name of the department you would like to add: '
        })
        .then((data) => {
            connection.query(
                `INSERT INTO department (name)
                VALUES(?)`,
                [data.department_name],
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.log('Department Added!');
                    promptUser();
                }
            )
        })
}

module.exports = { viewDepartment, addDepartment }